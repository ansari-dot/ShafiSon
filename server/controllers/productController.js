import Product from "../models/Product.js";

function isValidObjectId(id) {
  return id && id.match(/^[0-9a-fA-F]{24}$/);
}

export async function getProducts(req, res) {
  try {
    const { search, ids } = req.query;
    if (ids) {
      const list = String(ids).split(",").map((s) => s.trim()).filter(Boolean);
      const products = await Product.find({ _id: { $in: list } }).lean();
      const order = new Map(list.map((id, i) => [id, i]));
      products.sort((a, b) => (order.get(String(a._id)) ?? 0) - (order.get(String(b._id)) ?? 0));
      return res.json(products);
    }
    const filter = search
      ? { title: { $regex: String(search).trim(), $options: "i" } }
      : {};
    const products = await Product.find(filter).sort({ createdAt: -1 }).lean();
    return res.json(products);
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
    return res.json(product);
  } catch (err) {
    return res.status(500).json({ message: "Failed to fetch product" });
  }
}

export async function createProduct(req, res) {
  try {
    const product = await Product.create(req.body);
    return res.status(201).json(product);
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
    return res.json(product);
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
