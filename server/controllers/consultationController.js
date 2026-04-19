import Consultation from "../models/Consultation.js";
import { invalidateCache } from "../app.js";

export async function getConsultations(req, res) {
  try {
    const pageNum = Math.max(1, parseInt(req.query.page) || 1);
    const limitNum = Math.max(1, parseInt(req.query.limit) || 20);
    const skip = (pageNum - 1) * limitNum;

    const [consultations, total] = await Promise.all([
      Consultation.find().sort({ createdAt: -1 }).skip(skip).limit(limitNum).lean(),
      Consultation.countDocuments(),
    ]);

    return res.json({ 
      consultations, 
      total, 
      page: pageNum, 
      totalPages: Math.ceil(total / limitNum) 
    });
  } catch (err) {
    return res.status(500).json({ message: "Failed to fetch consultations" });
  }
}

export async function createConsultation(req, res) {
  const { 
    name, 
    email, 
    phone, 
    address, 
    consultationType, 
    preferredDate, 
    preferredTime,
    projectDetails,
    budget,
    urgency,
    status,
    submittedAt
  } = req.body || {};

  const payload = {
    name: String(name || "").trim(),
    email: String(email || "").trim().toLowerCase(),
    phone: String(phone || "").trim(),
    address: String(address || "").trim(),
    consultationType: String(consultationType || "").trim(),
    preferredDate: preferredDate ? new Date(preferredDate) : null,
    preferredTime: String(preferredTime || "").trim(),
    projectDetails: String(projectDetails || "").trim(),
    budget: String(budget || "").trim(),
    urgency: String(urgency || "flexible").trim(),
    status: String(status || "pending").trim(),
    submittedAt: submittedAt ? new Date(submittedAt) : new Date()
  };

  // Validation
  if (!payload.name || !payload.email || !payload.phone || !payload.address) {
    return res.status(400).json({ message: "Name, email, phone and address are required" });
  }

  if (!payload.consultationType || !["curtains", "blinds", "upholstery", "interior", "commercial"].includes(payload.consultationType)) {
    return res.status(400).json({ message: "Valid consultation type is required" });
  }

  if (!payload.preferredDate || !payload.preferredTime) {
    return res.status(400).json({ message: "Preferred date and time are required" });
  }

  if (!/\S+@\S+\.\S+/.test(payload.email)) {
    return res.status(400).json({ message: "Invalid email address" });
  }

  // Check if preferred date is in the future
  if (payload.preferredDate <= new Date()) {
    return res.status(400).json({ message: "Preferred date must be in the future" });
  }

  try {
    const created = await Consultation.create(payload);
    
    // Clear dashboard cache to show new consultation in notifications
    invalidateCache("/api/dashboard");
    
    return res.status(201).json(created);
  } catch (err) {
    return res.status(400).json({ message: err.message || "Failed to save consultation" });
  }
}

export async function updateConsultationStatus(req, res) {
  const { id } = req.params;
  const { status, notes } = req.body || {};

  if (!["pending", "confirmed", "completed", "cancelled"].includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  try {
    const updated = await Consultation.findByIdAndUpdate(
      id,
      { 
        status,
        notes: String(notes || "").trim(),
        updatedAt: new Date()
      },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Consultation not found" });
    }

    return res.json(updated);
  } catch (err) {
    return res.status(400).json({ message: err.message || "Failed to update consultation" });
  }
}