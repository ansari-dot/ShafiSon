import PopularPicks from "../models/PopularPicks.js";

export async function getPopularPicks(req, res) {
  try {
    const doc = await PopularPicks.findOne().lean();
    return res.json(doc || null);
  } catch (err) {
    return res.status(500).json({ message: "Failed to fetch popular picks" });
  }
}

export async function upsertPopularPicks(req, res) {
  try {
    const payload = req.body || {};
    const doc = await PopularPicks.findOneAndUpdate({}, payload, {
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
