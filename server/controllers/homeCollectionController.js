import HomeCollection from "../models/HomeCollection.js";

export async function getHomeCollection(req, res) {
  try {
    const doc = await HomeCollection.findOne().lean();
    return res.json(doc || null);
  } catch (err) {
    return res.status(500).json({ message: "Failed to fetch home collection" });
  }
}

export async function upsertHomeCollection(req, res) {
  try {
    const payload = req.body || {};
    const doc = await HomeCollection.findOneAndUpdate({}, payload, {
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
