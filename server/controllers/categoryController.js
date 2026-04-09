import Category from "../models/Category.js";

function isValidObjectId(id) {
    return id && id.match(/^[0-9a-fA-F]{24}$/);
}

export async function getCategories(req, res) {
  try {
    const { ids } = req.query;
    if (ids) {
      const list = String(ids).split(",").map((s) => s.trim()).filter(Boolean);
      const categories = await Category.find({ _id: { $in: list } }).lean();
      const order = new Map(list.map((id, i) => [id, i]));
      categories.sort((a, b) => (order.get(String(a._id)) ?? 0) - (order.get(String(b._id)) ?? 0));
      return res.json(categories);
    }
    const categories = await Category.find().sort({ createdAt: -1 }).lean();
    return res.json(categories);
  } catch (err) {
    return res.status(500).json({ message: "Failed to fetch categories" });
  }
}

export async function getCategoryById(req, res) {
    const id = req.params.id;
    if (!isValidObjectId(id)) return res.status(400).json({ message: "Invalid id" });

    try {
        const category = await Category.findById(id).lean();
        if (!category) return res.status(404).json({ message: "Category not found" });
        return res.json(category);
    } catch (err) {
        return res.status(500).json({ message: "Failed to fetch category" });
    }
}

export async function createCategory(req, res) {
    try {
        const category = await Category.create(req.body);
        return res.status(201).json(category);
    } catch (err) {
        return res.status(400).json({ message: err.message });
    }
}

export async function updateCategory(req, res) {
    const id = req.params.id;
    if (!isValidObjectId(id)) return res.status(400).json({ message: "Invalid id" });

    try {
        const category = await Category.findByIdAndUpdate(id, req.body, {
            new: true,
            runValidators: true,
        }).lean();
        if (!category) return res.status(404).json({ message: "Category not found" });
        return res.json(category);
    } catch (err) {
        return res.status(400).json({ message: err.message });
    }
}

export async function deleteCategory(req, res) {
    const id = req.params.id;
    if (!isValidObjectId(id)) return res.status(400).json({ message: "Invalid id" });

    try {
        const deleted = await Category.findByIdAndDelete(id).lean();
        if (!deleted) return res.status(404).json({ message: "Category not found" });
        return res.json({ message: "Category deleted" });
    } catch (err) {
        return res.status(500).json({ message: "Failed to delete category" });
    }
}
