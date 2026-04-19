import HeroBanner from "../models/HeroBanner.js";
import HomeCollection from "../models/HomeCollection.js";
import PopularPicks from "../models/PopularPicks.js";
import HomeCategories from "../models/HomeCategories.js";
import DealSection from "../models/DealSection.js";
import CategorySection from "../models/CategorySection.js";
import CompareSection from "../models/CompareSection.js";
import Testimonial from "../models/Testimonial.js";
import Category from "../models/Category.js";
import Product from "../models/Product.js";

const LIST_PRODUCT_PROJECTION = {
  description: 0,
  specs: 0,
  imgs: 0,
};

function normalizeImageList(list) {
  if (!Array.isArray(list)) return [];
  const out = [];
  for (let i = 0; i < list.length; i += 1) {
    const cur = String(list[i] || "").trim();
    if (!cur) continue;
    if (/^data:image\/[a-zA-Z0-9+.-]+;base64$/i.test(cur)) {
      const next = String(list[i + 1] || "").trim();
      if (/^[A-Za-z0-9+/=]+$/.test(next)) {
        out.push(`${cur},${next}`);
        i += 1;
        continue;
      }
    }
    out.push(cur);
  }
  return out;
}

function normalizeProductDoc(product) {
  if (!product || typeof product !== "object") return product;
  const imgs = normalizeImageList(product.imgs);
  const img = String(product.img || "").trim() || imgs[0] || "";
  return { ...product, img, imgs };
}

async function fetchProductsByIds(ids) {
  const list = Array.isArray(ids) ? ids.map((id) => String(id).trim()).filter(Boolean) : [];
  if (!list.length) return [];
  const docs = await Product.find({ _id: { $in: list } }, LIST_PRODUCT_PROJECTION).lean();
  const order = new Map(list.map((id, index) => [id, index]));
  return docs
    .sort((a, b) => (order.get(String(a._id)) ?? 0) - (order.get(String(b._id)) ?? 0))
    .map(normalizeProductDoc);
}

export async function getHomeData(req, res) {
  try {
    const [
      hero,
      collection,
      popular,
      homeCategories,
      deal,
      compare,
      testimonials,
      categorySections,
      categories,
    ] = await Promise.all([
      HeroBanner.findOne().lean(),
      HomeCollection.findOne().lean(),
      PopularPicks.findOne().lean(),
      HomeCategories.findOne().lean(),
      DealSection.findOne().lean(),
      CompareSection.findOne().lean(),
      Testimonial.find({ active: true }).sort({ createdAt: -1 }).lean(),
      CategorySection.find({ active: true }).sort({ position: 1 }).lean(),
      Category.find().sort({ createdAt: -1 }).lean(),
    ]);

    const [collectionProducts, popularProducts, compareProducts, sectionProducts] = await Promise.all([
      fetchProductsByIds(collection?.productIds),
      fetchProductsByIds(popular?.productIds),
      fetchProductsByIds(compare?.productIds),
      Promise.all(
        (Array.isArray(categorySections) ? categorySections : []).map(async (section) => ({
          ...section,
          products: await fetchProductsByIds(section?.productIds),
        }))
      ),
    ]);

    return res.json({
      hero: hero || null,
      categories: Array.isArray(categories) ? categories : [],
      homeCategories: homeCategories || null,
      collection: collection || null,
      collectionProducts,
      popular: popular || null,
      popularProducts,
      deal: deal || null,
      compare: compare || null,
      compareProducts,
      testimonials: Array.isArray(testimonials) ? testimonials : [],
      categorySections: sectionProducts.filter((section) => Array.isArray(section.products) && section.products.length > 0),
    });
  } catch (err) {
    return res.status(500).json({ message: "Failed to load home data" });
  }
}
