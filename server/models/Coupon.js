import mongoose from "mongoose";

const couponSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true, trim: true },
    type: { type: String, enum: ["percentage", "fixed"], required: true },
    value: { type: Number, required: true },
    appliesToAll: { type: Boolean, default: true },
    productIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
    startDate: { type: Date, default: null },
    endDate: { type: Date, default: null },
    active: { type: Boolean, default: true },
    usageCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

couponSchema.index({ createdAt: -1 });
couponSchema.index({ active: 1 });

export default mongoose.model("Coupon", couponSchema);
