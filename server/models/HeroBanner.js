import mongoose from "mongoose";

const heroBannerSchema = new mongoose.Schema(
  {
    label: { type: String, default: "New Arrival Campaign" },
    titleLine1: { type: String, default: "Timeless Interiors, Crafted by" },
    titleLine2: { type: String, default: "shafisons" },
    text: { type: String, default: "Premium Curtain Cloth, Sofa Fabrics & Office Blinds - trusted since 1972." },
    highlights: { type: String, default: "50+ years of trusted interior fabric expertise" },
    primaryBtnText: { type: String, default: "Shop Now" },
    primaryBtnLink: { type: String, default: "/shop" },
    secondaryBtnText: { type: String, default: "Explore" },
    secondaryBtnLink: { type: String, default: "/services" },
    offerChip: { type: String, default: "Free swatches + same day consultation" },
    heroImages: {
      type: [String],
      default: ["/images/couch.png", "/images/sofa.png", "/images/product-1.png", "/images/product-2.png"],
    },
  },
  { timestamps: true }
);

export default mongoose.model("HeroBanner", heroBannerSchema);
