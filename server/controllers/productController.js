import Product from "../models/Product.js";

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
    const { search, ids } = req.query;
    if (ids) {
      const list = String(ids).split(",").map((s) => s.trim()).filter(Boolean);
      const products = await Product.find({ _id: { $in: list } }).lean();
      const order = new Map(list.map((id, i) => [id, i]));
      products.sort((a, b) => (order.get(String(a._id)) ?? 0) - (order.get(String(b._id)) ?? 0));
      return res.json(products.map(normalizeProductDoc));
    }
    const filter = search
      ? { title: { $regex: String(search).trim(), $options: "i" } }
      : {};
    const products = await Product.find(filter).sort({ createdAt: -1 }).lean();
    return res.json(products.map(normalizeProductDoc));
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
    const product = await Product.create(req.body);
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
