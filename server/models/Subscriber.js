import mongoose from "mongoose";

const subscriberSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true, unique: true },
    source: { type: String, default: "newsletter", trim: true },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

subscriberSchema.index({ createdAt: -1 });

export default mongoose.model("Subscriber", subscriberSchema);
