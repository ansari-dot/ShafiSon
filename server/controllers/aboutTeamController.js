import AboutTeam from "../models/AboutTeam.js";

export async function getAboutTeam(req, res) {
  try {
    const doc = await AboutTeam.findOne().lean();
    return res.json(doc || null);
  } catch (err) {
    return res.status(500).json({ message: "Failed to fetch about team section" });
  }
}

export async function upsertAboutTeam(req, res) {
  try {
    const payload = req.body || {};
    const doc = await AboutTeam.findOneAndUpdate({}, payload, {
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
