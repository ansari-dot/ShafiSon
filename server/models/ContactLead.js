import mongoose from "mongoose";

const contactLeadSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, default: "", trim: true },
    topic: { type: String, default: "", trim: true },
    message: { type: String, required: true, trim: true },
    status: { type: String, enum: ["New", "Replied"], default: "New" },
  },
  { timestamps: true }
);

contactLeadSchema.index({ createdAt: -1 });
contactLeadSchema.index({ email: 1 });

export default mongoose.model("ContactLead", contactLeadSchema);
