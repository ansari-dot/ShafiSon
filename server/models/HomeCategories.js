import mongoose from "mongoose";

const homeCategoriesSchema = new mongoose.Schema(
  {
    title: { type: String, default: "Browse" },
    heading: { type: String, default: "Shop by Category" },
    text: { type: String, default: "Find the perfect piece for every room in your home." },
    categoryIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category" }],
  },
  { timestamps: true }
);

export default mongoose.model("HomeCategories", homeCategoriesSchema);
