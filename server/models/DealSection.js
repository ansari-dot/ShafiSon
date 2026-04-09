import mongoose from "mongoose";

const dealSectionSchema = new mongoose.Schema(
  {
    title: { type: String, default: "Limited Offer" },
    heading: { type: String, default: "Grab the Deal" },
    text: { type: String, default: "" },
    productIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
    discountType: {
      type: String,
      enum: ["percent", "amount", "none"],
      default: "percent",
    },
    discountValue: { type: Number, default: 0, min: 0 },
    endsAt: { type: Date, default: null },
  },
  { timestamps: true }
);

export default mongoose.model("DealSection", dealSectionSchema);
