import mongoose from "mongoose";

const categorySectionSchema = new mongoose.Schema(
  {
    title: { type: String, default: "Featured Category" },
    heading: { type: String, default: "Explore Our Range" },
    text: { type: String, default: "" },
    categoryIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category" }],
    productIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
    position: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("CategorySection", categorySectionSchema);
