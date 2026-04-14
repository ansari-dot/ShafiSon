import ContactLead from "../models/ContactLead.js";

export async function getContactLeads(req, res) {
  try {
    const pageNum  = Math.max(1, parseInt(req.query.page)  || 1);
    const limitNum = Math.max(1, parseInt(req.query.limit) || 20);
    const skip     = (pageNum - 1) * limitNum;

    const [leads, total] = await Promise.all([
      ContactLead.find().sort({ createdAt: -1 }).skip(skip).limit(limitNum).lean(),
      ContactLead.countDocuments(),
    ]);
    return res.json({ leads, total, page: pageNum, totalPages: Math.ceil(total / limitNum) });
  } catch (err) {
    return res.status(500).json({ message: "Failed to fetch contacts" });
  }
}

export async function createContactLead(req, res) {
  const { firstName, lastName, email, phone, topic, message } = req.body || {};
  const payload = {
    firstName: String(firstName || "").trim(),
    lastName: String(lastName || "").trim(),
    email: String(email || "").trim().toLowerCase(),
    phone: String(phone || "").trim(),
    topic: String(topic || "").trim(),
    message: String(message || "").trim(),
  };

  if (!payload.firstName || !payload.lastName || !payload.email || !payload.message) {
    return res.status(400).json({ message: "firstName, lastName, email and message are required" });
  }

  if (!/\S+@\S+\.\S+/.test(payload.email)) {
    return res.status(400).json({ message: "Invalid email" });
  }

  try {
    const created = await ContactLead.create(payload);
    return res.status(201).json(created);
  } catch (err) {
    return res.status(400).json({ message: err.message || "Failed to save contact" });
  }
}
