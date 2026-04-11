import HeroBanner from "../models/HeroBanner.js";

export async function getHeroBanner(req, res) {
  try {
    const doc = await HeroBanner.findOne().lean();
    return res.json(doc || null);
  } catch (err) {
    return res.status(500).json({ message: "Failed to fetch hero banner" });
  }
}

export async function upsertHeroBanner(req, res) {
  try {
    const payload = req.body || {};
    const doc = await HeroBanner.findOneAndUpdate({}, payload, {
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
