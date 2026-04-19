import Product from "../models/Product.js";

const LIST_PRODUCT_PROJECTION = {
  description: 0,
  specs: 0,
  imgs: 0, // Exclude heavy image arrays for list view
  createdAt: 0,
  updatedAt: 0,
};

function isValidObjectId(id) {
  return id && id.match(/^[0-9a-fA-F]{24}$/);
}

function normalizeImageList(list) {
  if (!Array.isArray(list)) return [];
  const out = [];
  for (let i = 0; i < list.length; i += 1) {
    const cur = String(list[i] || "").trim();
    if (!cur) continue;

    // Repair broken split of data URLs like:
    // ["data:image/webp;base64", "AAAA...."]
    if (/^data:image\/[a-zA-Z0-9+.-]+;base64$/i.test(cur)) {
      const next = String(list[i + 1] || "").trim();
      if (/^[A-Za-z0-9+/=]+$/.test(next)) {
        out.push(`${cur},${next}`);
        i += 1;
        continue;
      }
    }

    out.push(cur);
  }
  return out;
}

function normalizeProductDoc(product) {
  if (!product || typeof product !== "object") return product;
  const imgs = normalizeImageList(product.imgs);
  const img = String(product.img || "").trim() || imgs[0] || "";
  return { ...product, img, imgs };
}

export async function getProducts(req, res) {
  try {
    const { search, ids, page, limit, category } = req.query;
    const searchText = String(search || "").trim();
    const categoryFilter = String(category || "").trim();

    // ids mode — no pagination (used internally)
    if (ids) {
      const list = String(ids).split(",").map((s) => s.trim()).filter(Boolean);
      const products = await Product.find({ _id: { $in: list } }, LIST_PRODUCT_PROJECTION).lean();
      const order = new Map(list.map((id, i) => [id, i]));
      products.sort((a, b) => (order.get(String(a._id)) ?? 0) - (order.get(String(b._id)) ?? 0));
      return res.json(products.map(normalizeProductDoc));
    }

    const escapedSearch = searchText.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    // Try exact SKU match first (indexed, fast) — fall back to $text only if needed
    let filter = {};
    if (searchText) {
      const skuMatch = await Product.exists({ sku: { $regex: `^${escapedSearch}`, $options: "i" } });
      filter = skuMatch
        ? { sku: { $regex: `^${escapedSearch}`, $options: "i" } }
        : { $text: { $search: searchText } };
    }

    if (categoryFilter) filter = { ...filter, category: categoryFilter };

    const pageNum  = Math.max(1, parseInt(page)  || 1);
    const limitNum = Math.min(50, Math.max(1, parseInt(limit) || 24)); // Cap at 50, default 24
    const skip     = (pageNum - 1) * limitNum;
    const sort = searchText
      ? { score: { $meta: "textScore" }, createdAt: -1 }
      : { createdAt: -1 };
    const projection = searchText
      ? { ...LIST_PRODUCT_PROJECTION, score: { $meta: "textScore" } }
      : LIST_PRODUCT_PROJECTION;

    const [products, total] = await Promise.all([
      Product.find(filter, projection).sort(sort).skip(skip).limit(limitNum).lean(),
      pageNum === 1 ? Product.countDocuments(filter) : Promise.resolve(null),
    ]);

    return res.json({
      products: products.map(normalizeProductDoc),
      total,
      page: pageNum,
      totalPages: total !== null ? Math.ceil(total / limitNum) : undefined,
    });
  } catch (err) {
    return res.status(500).json({ message: "Failed to fetch products" });
  }
}

export async function getProductNavigation(req, res) {
  try {
    const [categoryBuckets, materialBuckets] = await Promise.all([
      Product.aggregate([
        { $match: { category: { $type: "string", $ne: "" } } },
        { $group: { _id: "$category", count: { $sum: 1 } } },
        { $sort: { count: -1, _id: 1 } },
        { $limit: 12 },
      ]),
      Product.aggregate([
        { $match: { material: { $type: "string", $ne: "" } } },
        { $group: { _id: "$material", count: { $sum: 1 } } },
        { $sort: { count: -1, _id: 1 } },
        { $limit: 12 },
      ]),
    ]);

    return res.json({
      categories: categoryBuckets.map((item) => ({ label: item._id, count: item.count })),
      materials: materialBuckets.map((item) => ({ label: item._id, count: item.count })),
    });
  } catch (err) {
    return res.status(500).json({ message: "Failed to fetch product navigation" });
  }
}

// Projection for detail page — excludes nothing, but normalizes imgs before sending
const DETAIL_PRODUCT_PROJECTION = { description: 1, specs: 1, imgs: 1,
  sku: 1, title: 1, price: 1, priceUnit: 1, quantity: 1, isDeal: 1,
  img: 1, category: 1, subcategory: 1, material: 1, rating: 1,
  reviews: 1, badge: 1, sizes: 1, inStock: 1, colors: 1, createdAt: 1,
};

export async function getProductById(req, res) {
  const id = req.params.id;
  if (!isValidObjectId(id)) return res.status(400).json({ message: "Invalid id" });

  try {
    const product = await Product.findById(id, DETAIL_PRODUCT_PROJECTION).lean();
    if (!product) return res.status(404).json({ message: "Product not found" });
    return res.json(normalizeProductDoc(product));
  } catch (err) {
    return res.status(500).json({ message: "Failed to fetch product" });
  }
}

export async function createProduct(req, res) {
  try {
    const body = { ...req.body };
    if (!body.sku || !String(body.sku).trim()) {
      body.sku = `SKU-${Date.now().toString(36).toUpperCase()}`;
    }
    const product = await Product.create(body);
    return res.status(201).json(normalizeProductDoc(product.toObject()));
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
}

export async function updateProduct(req, res) {
  const id = req.params.id;
  if (!isValidObjectId(id)) return res.status(400).json({ message: "Invalid id" });

  try {
    const product = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    }).lean();
    if (!product) return res.status(404).json({ message: "Product not found" });
    return res.json(normalizeProductDoc(product));
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
}

export async function deleteProduct(req, res) {
  const id = req.params.id;
  if (!isValidObjectId(id)) return res.status(400).json({ message: "Invalid id" });

  try {
    const deleted = await Product.findByIdAndDelete(id).lean();
    if (!deleted) return res.status(404).json({ message: "Product not found" });
    return res.json({ message: "Product deleted" });
  } catch (err) {
    return res.status(500).json({ message: "Failed to delete product" });
  }
}
