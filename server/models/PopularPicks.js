import mongoose from "mongoose";

const popularPicksSchema = new mongoose.Schema({
    title: { type: String, default: "Trending Now" },
    heading: { type: String, default: "Popular Picks" },
    text: { type: String, default: "" },
    productIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
}, { timestamps: true });

export default mongoose.model("PopularPicks", popularPicksSchema);