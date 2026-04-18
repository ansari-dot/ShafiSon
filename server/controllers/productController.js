import Product from "../models/Product.js";

const LIST_PRODUCT_PROJECTION = {
  description: 0,
  specs: 0,
  imgs: 0,
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
    const { search, ids, page, limit } = req.query;
    const searchText = String(search || "").trim();

    // ids mode — no pagination (used internally)
    if (ids) {
      const list = String(ids).split(",").map((s) => s.trim()).filter(Boolean);
      const products = await Product.find({ _id: { $in: list } }, LIST_PRODUCT_PROJECTION).lean();
      const order = new Map(list.map((id, i) => [id, i]));
      products.sort((a, b) => (order.get(String(a._id)) ?? 0) - (order.get(String(b._id)) ?? 0));
      return res.json(products.map(normalizeProductDoc));
    }

    const escapedSearch = searchText.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const filter = searchText
      ? {
          $or: [
            { $text: { $search: searchText } },
            { sku: { $regex: `^${escapedSearch}`, $options: "i" } },
          ],
        }
      : {};

    const pageNum  = Math.max(1, parseInt(page)  || 1);
    const limitNum = Math.max(1, parseInt(limit) || 20);
    const skip     = (pageNum - 1) * limitNum;
    const sort = searchText
      ? { score: { $meta: "textScore" }, createdAt: -1 }
      : { createdAt: -1 };
    const projection = searchText
      ? { ...LIST_PRODUCT_PROJECTION, score: { $meta: "textScore" } }
      : LIST_PRODUCT_PROJECTION;

    const [products, total] = await Promise.all([
      Product.find(filter, projection).sort(sort).skip(skip).limit(limitNum).lean(),
      Product.countDocuments(filter),
    ]);

    return res.json({
      products: products.map(normalizeProductDoc),
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum),
    });
  } catch (err) {
    return res.status(500).json({ message: "Failed to fetch products" });
  }
}

export async function getProductById(req, res) {
  const id = req.params.id;
  if (!isValidObjectId(id)) return res.status(400).json({ message: "Invalid id" });

  try {
    const product = await Product.findById(id).lean();
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
      const count = await Product.countDocuments();
      body.sku = `SKU-${String(count + 1).padStart(5, '0')}`;
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
