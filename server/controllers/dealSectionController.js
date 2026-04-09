import DealSection from "../models/DealSection.js";
import Product from "../models/Product.js";

export async function getDealSection(req, res) {
  try {
    const doc = await DealSection.findOne().lean();
    return res.json(doc || null);
  } catch (err) {
    return res.status(500).json({ message: "Failed to fetch deal section" });
  }
}

export async function upsertDealSection(req, res) {
  try {
    const payload = req.body || {};
    const prev = await DealSection.findOne().lean();
    const doc = await DealSection.findOneAndUpdate({}, payload, {
      new: true,
      upsert: true,
      runValidators: true,
      setDefaultsOnInsert: true,
    }).lean();

    const prevIds = new Set((prev?.productIds || []).map(String));
    const nextIds = new Set((doc?.productIds || []).map(String));

    const toDisable = [...prevIds].filter((id) => !nextIds.has(id));
    const toEnable = [...nextIds];

    if (toDisable.length) {
      await Product.updateMany({ _id: { $in: toDisable } }, { $set: { isDeal: false } });
    }
    if (toEnable.length) {
      await Product.updateMany({ _id: { $in: toEnable } }, { $set: { isDeal: true } });
    }

    return res.json(doc);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
}
