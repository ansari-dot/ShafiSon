import mongoose from "mongoose";

const compareSectionSchema = new mongoose.Schema({
    title: { type: String, default: "Compare" },
    heading: { type: String, default: "Find Your Perfect Fit" },
    text: { type: String, default: "Not sure which to pick? Compare our top sellers side by side." },
    productIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
}, { timestamps: true });

export default mongoose.model("CompareSection", compareSectionSchema);