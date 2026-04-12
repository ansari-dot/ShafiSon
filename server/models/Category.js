import mongoose from "mongoose";

const subcategorySchema = new mongoose.Schema(
  { name: { type: String, required: true }, serialNumber: { type: String, default: '' } },
  { _id: false }
);

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    count: { type: Number, default: 0 },
    img: { type: String, default: "" },
    subcategories: { type: [subcategorySchema], default: [] },
  },
  { timestamps: true }
);

export default mongoose.model("Category", categorySchema);
