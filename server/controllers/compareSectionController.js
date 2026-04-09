import CompareSection from "../models/CompareSection.js";

export async function getCompareSection(req, res) {
  try {
    const doc = await CompareSection.findOne().lean();
    return res.json(doc || null);
  } catch (err) {
    return res.status(500).json({ message: "Failed to fetch compare section" });
  }
}

export async function upsertCompareSection(req, res) {
  try {
    const payload = req.body || {};
    const doc = await CompareSection.findOneAndUpdate({}, payload, {
      new: true,
      upsert: true,
      runValidators: true,
      setDefaultsOnInsert: true,
    }).lean();
    return res.json(doc);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
}
