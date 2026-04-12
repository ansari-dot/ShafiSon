import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    count: { type: Number, default: 0 },
    img: { type: String, default: "" },
    subcategories: { type: [String], default: [] },
  },
  { timestamps: true }
);

export default mongoose.model("Category", categorySchema);
