import Subscriber from "../models/Subscriber.js";

export async function getSubscribers(req, res) {
  try {
    const list = await Subscriber.find().sort({ createdAt: -1 }).lean();
    return res.json(list);
  } catch (err) {
    return res.status(500).json({ message: "Failed to fetch subscribers" });
  }
}

export async function createSubscriber(req, res) {
  const name = String(req.body?.name || "").trim();
  const email = String(req.body?.email || "").trim().toLowerCase();

  if (!name || !email) {
    return res.status(400).json({ message: "Name and email are required" });
  }
  if (!/\S+@\S+\.\S+/.test(email)) {
    return res.status(400).json({ message: "Invalid email" });
  }

  try {
    const existing = await Subscriber.findOne({ email }).lean();
    if (existing) {
      return res.json({ ...existing, alreadySubscribed: true });
    }
    const created = await Subscriber.create({ name, email, source: "newsletter" });
    return res.status(201).json(created);
  } catch (err) {
    return res.status(400).json({ message: err.message || "Failed to save subscriber" });
  }
}
