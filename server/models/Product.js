import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    sku: { type: String, unique: true, sparse: true, default: '' },
    title: { type: String, required: true },
    price: { type: Number, required: true },
    priceUnit: { type: String, default: 'per yard' },
    quantity: { type: Number, default: 0 },
    isDeal: { type: Boolean, default: false },
    img: { type: String, default: "" },
    imgs: { type: [String], default: [] },
    category: { type: String, required: true },
    subcategory: { type: String, default: "" },
    material: { type: String, required: true },
    rating: { type: Number, default: 0 },
    reviews: { type: Number, default: 0 },
    averageRating: { type: Number, default: 0 },
    totalReviews: { type: Number, default: 0 },
    badge: { type: String, default: null },
    sizes: { type: [String], default: [] },
    description: { type: String, default: "" },
    specs: {
        Dimensions: { type: String, default: "" },
        Weight: { type: String, default: "" },
        Material: { type: String, default: "" },
        Assembly: { type: String, default: "" },
        Warranty: { type: String, default: "" },
    },

    inStock: { type: Boolean, default: true },
    colors: {
        type: [{ name: { type: String }, image: { type: String }, hex: { type: String, default: '' } }],
        default: [],
    },
}, { timestamps: true });

productSchema.index({ createdAt: -1 });
productSchema.index({ title: 1 });
productSchema.index({ category: 1 });
productSchema.index({ isDeal: 1 });
productSchema.index({ category: 1, createdAt: -1 });
productSchema.index({ isDeal: 1, createdAt: -1 });
productSchema.index({ material: 1, createdAt: -1 });
productSchema.index({ badge: 1, createdAt: -1 });
productSchema.index({ quantity: 1 });
productSchema.index({ price: 1 }); // Add price index for sorting
productSchema.index({ rating: -1 }); // Add rating index for sorting
productSchema.index({ inStock: 1 }); // Add stock index for filtering
productSchema.index({ title: "text", sku: "text", category: "text" });

export default mongoose.model("Product", productSchema);
