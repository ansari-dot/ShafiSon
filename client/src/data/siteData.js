export const roomStyles = [
  {
    id: 1,
    name: "Living Room",
    tag: "Most Popular",
    title: "Cozy Modern Living",
    desc: "Create a warm, inviting living room with our signature sofas, coffee tables, and accent chairs. Designed for families who love to gather.",
    img: "/images/img-grid-1.jpg",
    highlights: [
      { icon: "🛋️", label: "Sofa Style", value: "Sectional" },
      { icon: "🎨", label: "Color Palette", value: "Warm Neutrals" },
      { icon: "💡", label: "Lighting", value: "Ambient + Task" },
      { icon: "📐", label: "Best For", value: "12×15 ft rooms" },
    ],
  },
  {
    id: 2,
    name: "Bedroom",
    tag: "Editor's Pick",
    title: "Serene Sleep Sanctuary",
    desc: "Transform your bedroom into a peaceful retreat with our platform beds, plush headboards, and smart storage solutions.",
    img: "/images/img-grid-2.jpg",
    highlights: [
      { icon: "🛏️", label: "Bed Type", value: "Platform Bed" },
      { icon: "🎨", label: "Color Palette", value: "Soft Blues" },
      { icon: "💡", label: "Lighting", value: "Warm Dimmers" },
      { icon: "📐", label: "Best For", value: "10×12 ft rooms" },
    ],
  },
  {
    id: 3,
    name: "Home Office",
    tag: "New Arrival",
    title: "Productive & Stylish Workspace",
    desc: "Work from home in style. Our ergonomic desks, chairs, and shelving units keep you focused and organized all day long.",
    img: "/images/img-grid-3.jpg",
    highlights: [
      { icon: "🖥️", label: "Desk Style", value: "Standing Desk" },
      { icon: "🎨", label: "Color Palette", value: "Clean Whites" },
      { icon: "💡", label: "Lighting", value: "Daylight LED" },
      { icon: "📐", label: "Best For", value: "8×10 ft rooms" },
    ],
  },
];

export const categories = [
  { id: 1, name: "Living Room", count: 24, img: "/images/product-1.png" },
  { id: 2, name: "Bedroom", count: 18, img: "/images/product-2.png" },
  { id: 3, name: "Dining Room", count: 12, img: "/images/product-3.png" },
  { id: 4, name: "Office", count: 9, img: "/images/product-1.png" },
];

export const stats = [
  { id: 1, value: "15K+", label: "Happy Customers" },
  { id: 2, value: "8K+", label: "Products Sold" },
  { id: 3, value: "120+", label: "Design Awards" },
  { id: 4, value: "98%", label: "Satisfaction Rate" },
];

export const navLinks = [
  { label: "Home", to: "/" },
  { label: "Shop", to: "/shop" },
  { label: "About us", to: "/about" },
  { label: "Contact us", to: "/contact" },
];

export const products = [
  { id: 1, title: "Nordic Chair", price: 50, img: "/images/product-1.png" },
  { id: 2, title: "Kruzo Aero Chair", price: 78, img: "/images/product-2.png" },
  { id: 3, title: "Ergonomic Chair", price: 43, img: "/images/product-3.png" },
];

export const shopProducts = [
  {
    id: 1, title: "Nordic Lounge Chair", price: 50, img: "/images/product-1.png",
    imgs: ["/images/product-1.png","/images/product-2.png","/images/product-3.png"],
    category: "Living Room", material: "Wood", rating: 4.8, reviews: 124, badge: "Bestseller",
    colors: ["#c8b89a","#6b5c4e","#3b5d50"], sizes: ["Small","Medium","Large"],
    desc: "The Nordic Lounge Chair blends Scandinavian minimalism with premium solid oak craftsmanship. Designed for long hours of comfort, its ergonomic backrest and cushioned seat make it the perfect centerpiece for any living room.",
    specs: { Dimensions: "80 × 80 × 90 cm", Weight: "12 kg", Material: "Solid Oak + Foam", Assembly: "Easy, 15 min", Warranty: "5 Years" },
    inStock: true,
  },
  {
    id: 2, title: "Kruzo Aero Chair", price: 78, img: "/images/product-2.png",
    imgs: ["/images/product-2.png","/images/product-1.png","/images/product-3.png"],
    category: "Office", material: "Metal", rating: 4.6, reviews: 89, badge: "New",
    colors: ["#2f2f2f","#ffffff","#3b5d50"], sizes: ["Standard","XL"],
    desc: "The Kruzo Aero Chair is engineered for the modern workspace. Its breathable mesh back, adjustable lumbar support, and 360° swivel base keep you productive and comfortable throughout the day.",
    specs: { Dimensions: "70 × 65 × 95 cm", Weight: "9 kg", Material: "Steel + Mesh", Assembly: "Tool-free", Warranty: "3 Years" },
    inStock: true,
  },
  {
    id: 3, title: "Ergonomic Desk Chair", price: 43, img: "/images/product-3.png",
    imgs: ["/images/product-3.png","/images/product-1.png","/images/product-2.png"],
    category: "Office", material: "Fabric", rating: 4.5, reviews: 67, badge: null,
    colors: ["#6a6a6a","#3b5d50","#c8b89a"], sizes: ["Standard"],
    desc: "Built for all-day comfort, the Ergonomic Desk Chair features a contoured seat, adjustable armrests, and breathable fabric upholstery. Ideal for home offices and professional workspaces alike.",
    specs: { Dimensions: "75 × 75 × 88 cm", Weight: "11 kg", Material: "Fabric + Steel", Assembly: "15 min", Warranty: "2 Years" },
    inStock: true,
  },
  {
    id: 4, title: "Minimal Accent Chair", price: 95, img: "/images/product-1.png",
    imgs: ["/images/product-1.png","/images/product-3.png","/images/product-2.png"],
    category: "Living Room", material: "Wood", rating: 4.9, reviews: 210, badge: "Popular",
    colors: ["#c8b89a","#2f2f2f","#dce5e4"], sizes: ["One Size"],
    desc: "A statement piece for any room. The Minimal Accent Chair features clean geometric lines, a solid beech wood frame, and premium upholstery available in three curated colorways.",
    specs: { Dimensions: "72 × 70 × 85 cm", Weight: "10 kg", Material: "Beech Wood + Velvet", Assembly: "Easy", Warranty: "5 Years" },
    inStock: true,
  },
  {
    id: 5, title: "Scandinavian Armchair", price: 120, img: "/images/product-2.png",
    imgs: ["/images/product-2.png","/images/product-1.png","/images/product-3.png"],
    category: "Bedroom", material: "Fabric", rating: 4.7, reviews: 55, badge: null,
    colors: ["#dce5e4","#c8b89a","#6b5c4e"], sizes: ["Standard","Large"],
    desc: "Inspired by Nordic design traditions, this armchair wraps you in warmth and style. The solid wood legs and plush fabric seat create a perfect reading nook companion.",
    specs: { Dimensions: "78 × 82 × 92 cm", Weight: "13 kg", Material: "Oak + Linen", Assembly: "20 min", Warranty: "4 Years" },
    inStock: true,
  },
  {
    id: 6, title: "Oak Dining Chair", price: 65, img: "/images/product-3.png",
    imgs: ["/images/product-3.png","/images/product-2.png","/images/product-1.png"],
    category: "Dining Room", material: "Wood", rating: 4.4, reviews: 38, badge: "Sale",
    colors: ["#c8b89a","#6b5c4e"], sizes: ["Standard"],
    desc: "Solid oak construction meets timeless dining room style. The Oak Dining Chair is stackable, easy to clean, and built to last through years of family meals and gatherings.",
    specs: { Dimensions: "45 × 50 × 88 cm", Weight: "6 kg", Material: "Solid Oak", Assembly: "5 min", Warranty: "3 Years" },
    inStock: false,
  },
  {
    id: 7, title: "Velvet Side Chair", price: 88, img: "/images/product-1.png",
    imgs: ["/images/product-1.png","/images/product-2.png","/images/product-3.png"],
    category: "Bedroom", material: "Fabric", rating: 4.6, reviews: 72, badge: null,
    colors: ["#3b5d50","#c8b89a","#2f2f2f"], sizes: ["One Size"],
    desc: "Luxurious velvet upholstery meets a slim gold-tipped frame in this elegant side chair. Perfect beside a vanity, desk, or as a bedroom accent piece.",
    specs: { Dimensions: "50 × 55 × 82 cm", Weight: "7 kg", Material: "Velvet + Metal", Assembly: "10 min", Warranty: "2 Years" },
    inStock: true,
  },
  {
    id: 8, title: "Steel Frame Stool", price: 35, img: "/images/product-2.png",
    imgs: ["/images/product-2.png","/images/product-3.png","/images/product-1.png"],
    category: "Dining Room", material: "Metal", rating: 4.3, reviews: 44, badge: "Sale",
    colors: ["#2f2f2f","#ffffff"], sizes: ["Counter","Bar Height"],
    desc: "Industrial-style steel frame stool with a solid wood seat. Lightweight, durable, and available in two heights — perfect for kitchen islands and dining bars.",
    specs: { Dimensions: "38 × 38 × 75 cm", Weight: "4 kg", Material: "Steel + Wood", Assembly: "5 min", Warranty: "1 Year" },
    inStock: true,
  },
  {
    id: 9, title: "Rattan Lounge Chair", price: 110, img: "/images/product-3.png",
    imgs: ["/images/product-3.png","/images/product-1.png","/images/product-2.png"],
    category: "Living Room", material: "Wood", rating: 4.8, reviews: 91, badge: "New",
    colors: ["#c8b89a","#6b5c4e"], sizes: ["One Size"],
    desc: "Handwoven natural rattan over a solid hardwood frame. This lounge chair brings organic warmth and texture to any living space, indoors or on a covered patio.",
    specs: { Dimensions: "82 × 78 × 88 cm", Weight: "8 kg", Material: "Rattan + Hardwood", Assembly: "Easy", Warranty: "3 Years" },
    inStock: true,
  },
  {
    id: 10, title: "Executive Office Chair", price: 145, img: "/images/product-1.png",
    imgs: ["/images/product-1.png","/images/product-2.png","/images/product-3.png"],
    category: "Office", material: "Leather", rating: 4.9, reviews: 183, badge: "Popular",
    colors: ["#2f2f2f","#6b5c4e","#ffffff"], sizes: ["Standard","XL"],
    desc: "Command your workspace with the Executive Office Chair. Full-grain leather upholstery, memory foam lumbar support, and a polished aluminum base deliver unmatched comfort and authority.",
    specs: { Dimensions: "68 × 68 × 120 cm", Weight: "16 kg", Material: "Full-Grain Leather", Assembly: "20 min", Warranty: "5 Years" },
    inStock: true,
  },
  {
    id: 11, title: "Upholstered Bed Frame", price: 220, img: "/images/product-2.png",
    imgs: ["/images/product-2.png","/images/product-3.png","/images/product-1.png"],
    category: "Bedroom", material: "Fabric", rating: 4.7, reviews: 60, badge: null,
    colors: ["#dce5e4","#c8b89a","#2f2f2f"], sizes: ["Queen","King"],
    desc: "A plush upholstered headboard and solid wood slat base make this bed frame the ultimate bedroom upgrade. Available in Queen and King sizes with three fabric colorways.",
    specs: { Dimensions: "160 × 200 cm (Queen)", Weight: "32 kg", Material: "Linen + Pine", Assembly: "30 min", Warranty: "5 Years" },
    inStock: true,
  },
  {
    id: 12, title: "Solid Wood Coffee Table", price: 175, img: "/images/product-3.png",
    imgs: ["/images/product-3.png","/images/product-1.png","/images/product-2.png"],
    category: "Living Room", material: "Wood", rating: 4.5, reviews: 48, badge: "Bestseller",
    colors: ["#c8b89a","#6b5c4e","#2f2f2f"], sizes: ["Small","Large"],
    desc: "Crafted from a single slab of reclaimed solid wood, this coffee table is a conversation starter. Each piece is unique, with natural grain patterns and a hand-applied matte finish.",
    specs: { Dimensions: "120 × 60 × 45 cm", Weight: "22 kg", Material: "Reclaimed Solid Wood", Assembly: "10 min", Warranty: "5 Years" },
    inStock: true,
  },
];

export const features = [
  {
    title: "Fast & Free Shipping",
    desc: "Donec vitae odio quis nisl dapibus malesuada. Nullam ac aliquet velit. Aliquam vulputate.",
    icon: "/images/truck.svg",
  },
  {
    title: "Easy to Shop",
    desc: "Donec vitae odio quis nisl dapibus malesuada. Nullam ac aliquet velit. Aliquam vulputate.",
    icon: "/images/bag.svg",
  },
  {
    title: "24/7 Support",
    desc: "Donec vitae odio quis nisl dapibus malesuada. Nullam ac aliquet velit. Aliquam vulputate.",
    icon: "/images/support.svg",
  },
  {
    title: "Hassle Free Returns",
    desc: "Donec vitae odio quis nisl dapibus malesuada. Nullam ac aliquet velit. Aliquam vulputate.",
    icon: "/images/return.svg",
  },
];

export const testimonials = [
  {
    id: 1,
    quote:
      "Donec facilisis quam ut purus rutrum lobortis. Donec vitae odio quis nisl dapibus malesuada. Nullam ac aliquet velit. Aliquam vulputate velit imperdiet dolor tempor tristique. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Integer convallis volutpat dui quis scelerisque.",
    name: "Maria Jones",
    role: "CEO, Co-Founder, XYZ Inc.",
    img: "/images/person-1.png",
  },
  {
    id: 2,
    quote:
      "Donec facilisis quam ut purus rutrum lobortis. Donec vitae odio quis nisl dapibus malesuada. Nullam ac aliquet velit. Aliquam vulputate velit imperdiet dolor tempor tristique. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Integer convallis volutpat dui quis scelerisque.",
    name: "Maria Jones",
    role: "CEO, Co-Founder, XYZ Inc.",
    img: "/images/person-1.png",
  },
  {
    id: 3,
    quote:
      "Donec facilisis quam ut purus rutrum lobortis. Donec vitae odio quis nisl dapibus malesuada. Nullam ac aliquet velit. Aliquam vulputate velit imperdiet dolor tempor tristique. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Integer convallis volutpat dui quis scelerisque.",
    name: "Maria Jones",
    role: "CEO, Co-Founder, XYZ Inc.",
    img: "/images/person-1.png",
  },
];

export const posts = [
  {
    id: 1,
    title: "First Time Home Owner Ideas",
    author: "Kristin Watson",
    date: "Dec 19, 2021",
    img: "/images/post-1.jpg",
  },
  {
    id: 2,
    title: "How To Keep Your Furniture Clean",
    author: "Robert Fox",
    date: "Dec 15, 2021",
    img: "/images/post-2.jpg",
  },
  {
    id: 3,
    title: "Small Space Furniture Apartment Ideas",
    author: "Kristin Watson",
    date: "Dec 12, 2021",
    img: "/images/post-3.jpg",
  },
];

export const blogGrid = [
  ...posts,
  ...posts,
  ...posts,
];

export const team = [
  { id: 1, name: "Lawson Arnold", role: "CEO, Founder, Atty.", img: "/images/person_1.jpg" },
  { id: 2, name: "Jeremy Walker", role: "CEO, Founder, Atty.", img: "/images/person_2.jpg" },
  { id: 3, name: "Patrik White", role: "CEO, Founder, Atty.", img: "/images/person_3.jpg" },
  { id: 4, name: "Kathryn Ryan", role: "CEO, Founder, Atty.", img: "/images/person_4.jpg" },
];
