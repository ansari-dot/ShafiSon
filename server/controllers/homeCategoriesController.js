import HomeCategories from "../models/HomeCategories.js";

export async function getHomeCategories(req, res) {
  try {
    const doc = await HomeCategories.findOne().lean();
    return res.json(doc || null);
  } catch (err) {
    return res.status(500).json({ message: "Failed to fetch home categories" });
  }
}

export async function upsertHomeCategories(req, res) {
  try {
    const payload = req.body || {};
    const doc = await HomeCategories.findOneAndUpdate({}, payload, {
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
