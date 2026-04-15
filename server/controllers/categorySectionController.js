import CategorySection from "../models/CategorySection.js";

export async function getCategorySections(req, res) {
  try {
    const docs = await CategorySection.find().sort({ position: 1 }).lean();
    return res.json(docs);
  } catch (err) {
    return res.status(500).json({ message: "Failed to fetch category sections" });
  }
}

export async function createCategorySection(req, res) {
  try {
    const doc = await CategorySection.create(req.body);
    return res.status(201).json(doc);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
}

export async function updateCategorySection(req, res) {
  try {
    const doc = await CategorySection.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).lean();
    if (!doc) return res.status(404).json({ message: "Not found" });
    return res.json(doc);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
}

export async function deleteCategorySection(req, res) {
  try {
    const doc = await CategorySection.findByIdAndDelete(req.params.id);
    if (!doc) return res.status(404).json({ message: "Not found" });
    return res.json({ message: "Deleted" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}
