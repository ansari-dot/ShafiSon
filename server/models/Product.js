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
productSchema.index({ title: "text", sku: "text" });

export default mongoose.model("Product", productSchema);

