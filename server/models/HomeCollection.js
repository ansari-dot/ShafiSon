import mongoose from "mongoose";

const homeCollectionSchema = new mongoose.Schema(
  {
    title: { type: String, default: "Our Collection" },
    heading: { type: String, default: "Crafted with Excellent Material" },
    text: { type: String, default: "" },
    productIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
  },
  { timestamps: true }
);

export default mongoose.model("HomeCollection", homeCollectionSchema);
