import { useState, useMemo, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import ShopHero from "../components/ShopHero";
import { formatPKR } from "../util/formatCurrency";
import { apiGet } from "../util/api";
import { addToCart } from "../util/cart";
import { getWishlist, toggleWishlist } from "../wishlist";
import { getQuantity, isLowStock, isOutOfStock } from "../util/stock";
import usePageMeta from "../util/usePageMeta";

const SORT_OPTIONS = [
  { label: "Featured",          value: "featured"   },
  { label: "Price: Low to High", value: "price_asc"  },
  { label: "Price: High to Low", value: "price_desc" },
  { label: "Top Rated",         value: "rating"     },
  { label: "Most Reviewed",     value: "reviews"    },
];

const revealUp = {
  hidden: { opacity: 0, y: 24, filter: "blur(6px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.45, ease: "easeOut" },
  },
};

/* -- Icons -- */
const StarIcon = ({ filled = true }) => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.5">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);
const CartIcon = () => (
  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 9m12-9l2 9M9 21a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm6 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" />
  </svg>
);
const HeartIcon = ({ active }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);
const EyeIcon = () => (
  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const GridIcon = () => (
  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" />
  </svg>
);
const ListIcon = () => (
  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
  </svg>
);
const FilterIcon = () => (
  <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h18M7 12h10M11 20h2" />
  </svg>
);
const ChevronIcon = ({ open }) => (
  <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"
    style={{ transform: open ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.2s" }}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
  </svg>
);
const XIcon = () => (
  <svg width="10" height="10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

/* -- Star Rating Row -- */
function Stars({ rating }) {
  return (
    <span className="sp-stars">
      {[1,2,3,4,5].map(i => (
        <span key={i} style={{ color: i <= Math.round(rating) ? "#d97706" : "#dce5e4" }}>
          <StarIcon filled={i <= Math.round(rating)} />
        </span>
      ))}
    </span>
  );
}

/* -- Collapsible filter group -- */
function FilterGroup({ title, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="sp-filter-group">
      <button className="sp-filter-group-btn" onClick={() => setOpen(o => !o)}>
        <span>{title}</span><ChevronIcon open={open} />
      </button>
      {open && <div className="sp-filter-group-body">{children}</div>}
    </div>
  );
}

/* -- Product Card -- */
function ProductCard({ item, view, wished, onWish, deal, getDealPrice, isDealActive }) {
  const isList = view === "list";
  const dealActive = item?.isDeal && isDealActive(deal);
  const outOfStock = isOutOfStock(item);
  const lowStock = isLowStock(item);
  const quantity = getQuantity(item);
  const dealPrice = dealActive ? getDealPrice(item.price, deal) : null;
  const hoverImg = item?.imgs?.[0] && item.imgs[0] !== item.img ? item.imgs[0] : null;
  const [hovered, setHovered] = useState(false);
  const handleAdd = () => {
    if (outOfStock) return;
    const unitPrice = dealActive ? dealPrice : item.price;
    addToCart({
      id: item._id,
      title: item.title,
      img: item.img,
      unitPrice: Number(unitPrice || 0),
      originalPrice: Number(item.price || 0),
      priceUnit: item.priceUnit || 'per yard',
      isDeal: !!item.isDeal,
    }, 1);
  };
  return (
    <motion.div
      className={`sp-card ${isList ? "sp-card-list" : ""}`}
      variants={revealUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once: false, amount: 0.2 }}
      onMouseEnter={() => hoverImg && setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="sp-card-img-wrap">
        <Link to={`/shop/${item._id}`}>
          <img
            src={hovered && hoverImg ? hoverImg : item.img}
            alt={item.title}
            className="sp-card-img"
            style={{ transition: "opacity 0.25s ease" }}
          />
        </Link>
        {item.badge && <span className={`sp-badge sp-badge-${item.badge.toLowerCase()}`}>{item.badge}</span>}
        {outOfStock && <span className="sp-stock-badge sp-stock-badge-out">Out of Stock</span>}
        {lowStock && <span className="sp-stock-badge sp-stock-badge-low">Low Stock ({quantity} left)</span>}
        <div className="sp-card-actions">
          <button className="sp-action-btn" onClick={() => onWish(item)} aria-label="Wishlist"
            style={{ color: wished ? "#ef4444" : undefined }}>
            <HeartIcon active={wished} />
          </button>
          <button className="sp-action-btn" aria-label="Quick view"><EyeIcon /></button>
        </div>
        <button className={`sp-add-cart-btn ${outOfStock ? "disabled" : ""}`} onClick={handleAdd} disabled={outOfStock}>
          <CartIcon /> {outOfStock ? "Out of Stock" : "Add to Cart"}
        </button>
      </div>
      <div className="sp-card-body">
        <span className="sp-card-cat">{item.category}</span>
        <Link to={`/shop/${item._id}`}>
          <h3 className="sp-card-title">{item.title}</h3>
        </Link>
        <div className="sp-card-rating">
          <Stars rating={item.rating || 0} />
          <span className="sp-card-rating-num">{item.rating || 0}</span>
          <span className="sp-card-reviews">({item.reviews || 0} reviews)</span>
        </div>
        {isList && <p className="sp-card-desc">Handcrafted with premium {item.material?.toLowerCase() || "materials"} Ã¢â‚¬â€ built for comfort and lasting style.</p>}
        <div className="sp-card-footer">
          {dealActive ? (
            <div className="sp-card-price">
              <strong>{formatPKR(dealPrice)}</strong>
              <span style={{ marginLeft: "0.5rem", textDecoration: "line-through", color: "#9ca3af", fontWeight: 600 }}>
                {formatPKR(item.price)}
              </span>
              <span style={{ fontSize: "11px", color: "#9ca3af", marginLeft: "4px" }}>{item.priceUnit || "per yard"}</span>
            </div>
          ) : (
            <div className="sp-card-price"><strong>{formatPKR(item.price)}</strong><span style={{ fontSize: "11px", color: "#9ca3af", marginLeft: "4px" }}>{item.priceUnit || "per yard"}</span></div>
          )}
          {isList && (
            <button className={`sp-list-cart-btn ${outOfStock ? "disabled" : ""}`} onClick={handleAdd} disabled={outOfStock}><CartIcon /> {outOfStock ? "Out of Stock" : "Add to Cart"}</button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

/* -- Main Page -- */
export default function Shop() {
  const location = useLocation();
  const queryText = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return (params.get("q") || "").trim();
  }, [location.search]);
  const isDealPage = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return params.get("deal") === "1";
  }, [location.search]);
  const queryCategory = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return (params.get("category") || "").trim();
  }, [location.search]);
  const querySubcategory = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return (params.get("subcategory") || "").trim();
  }, [location.search]);
  const queryMaterial = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return (params.get("material") || "").trim();
  }, [location.search]);
  const querySort = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return (params.get("sort") || "").trim();
  }, [location.search]);

  const [items, setItems] = useState([]);
  const [categoryDocs, setCategoryDocs] = useState([]);
  const [deal, setDeal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [category,     setCategory]     = useState("All");
  const [subcategory,  setSubcategory]  = useState("All");
  const [material,     setMaterial]     = useState("All");
  const [color,        setColor]        = useState("All");
  const [size,         setSize]         = useState("All");
  const [badge,        setBadge]        = useState("All");
  const [inStock,      setInStock]      = useState(false);
  const [dealsOnly,    setDealsOnly]    = useState(false);
  const [newOnly,      setNewOnly]      = useState(false);
  const [minDiscount,  setMinDiscount]  = useState(0);
  const [minPrice,     setMinPrice]     = useState(0);
  const [maxPrice,     setMaxPrice]     = useState(0);
  const [priceFloor,   setPriceFloor]   = useState(0);
  const [priceCeil,    setPriceCeil]    = useState(0);
  const [minRating,    setMinRating]    = useState(0);
  const [sort,         setSort]         = useState("featured");
  const [view,         setView]         = useState("grid");
  const [wished,       setWished]       = useState(() => getWishlist().map((item) => item.id));
  const [drawerOpen,   setDrawerOpen]   = useState(false);

  useEffect(() => {
    if (drawerOpen) {
      document.body.classList.add("sp-drawer-open");
    } else {
      document.body.classList.remove("sp-drawer-open");
    }
    return () => {
      document.body.classList.remove("sp-drawer-open");
    };
  }, [drawerOpen]);

  useEffect(() => {
    let active = true;
    const loadProducts = async () => {
      try {
        setLoading(true);
        let list = [];
        const dealDoc = await apiGet("/api/deal-section").catch(() => null);
        if (!active) return;
        setDeal(dealDoc || null);
        if (isDealPage) {
          const ids = dealDoc?.productIds?.length ? dealDoc.productIds.join(",") : "";
          if (!ids) {
            if (!active) return;
            setItems([]);
            setError("");
            return;
          }
          const data = await apiGet(`/api/products?ids=${ids}`);
          if (!active) return;
          list = Array.isArray(data) ? data : Array.isArray(data?.products) ? data.products : [];
        } else {
          const path = queryText
            ? `/api/products?search=${encodeURIComponent(queryText)}`
            : "/api/products";
          const data = await apiGet(path);
          if (!active) return;
          list = Array.isArray(data) ? data : Array.isArray(data?.products) ? data.products : [];
        }

        if (!active) return;
        setItems(list);
        const prices = list.map(p => Number(p.price || 0)).filter(p => !Number.isNaN(p));
        const min = prices.length ? Math.min(...prices) : 0;
        const max = prices.length ? Math.max(...prices) : 0;
        setMinPrice(min);
        setMaxPrice(max || 0);
        setPriceFloor(min);
        setPriceCeil(max || 0);
        setError("");
      } catch (err) {
        if (!active) return;
        setError(err?.message || "Failed to load products");
      } finally {
        if (!active) return;
        setLoading(false);
      }
    };

    loadProducts();
    return () => { active = false; };
  }, [isDealPage, queryText]);

  useEffect(() => {
    apiGet("/api/categories").then((data) => {
      setCategoryDocs(Array.isArray(data) ? data : []);
    }).catch(() => {});
  }, []);

  const isDealActive = (d) => {
    if (!d) return false;
    if (!d.endsAt) return false;
    const end = new Date(d.endsAt).getTime();
    if (Number.isNaN(end) || end <= Date.now()) return false;
    if (d.discountType === "none") return false;
    if (typeof d.discountValue !== "number" || d.discountValue <= 0) return false;
    return true;
  };

  const getDealPrice = (price, d) => {
    const base = Number(price || 0);
    if (!isDealActive(d)) return base;
    if (d.discountType === "amount") return Math.max(0, base - d.discountValue);
    return Math.max(0, Math.round(base * (1 - d.discountValue / 100)));
  };

  const CATEGORIES = useMemo(() => {
    const set = new Set(items.map(p => p.category).filter(Boolean));
    return ["All", ...Array.from(set)];
  }, [items]);

  const SUBCATEGORIES = useMemo(() => {
    if (category === "All") return [];
    const doc = categoryDocs.find(c => c.name === category);
    if (doc?.subcategories?.length) return doc.subcategories.map(s => s.name || s);
    // fallback: derive from product data
    const set = new Set(
      items.filter(p => p.category === category && p.subcategory).map(p => p.subcategory)
    );
    return Array.from(set);
  }, [categoryDocs, category, items]);

  const MATERIALS = useMemo(() => {
    const set = new Set(items.map(p => p.material).filter(Boolean));
    return ["All", ...Array.from(set)];
  }, [items]);

  const SIZES = useMemo(() => {
    const set = new Set();
    items.forEach(p => (p.sizes || []).forEach(s => { if (s) set.add(s); }));
    return ["All", ...Array.from(set)];
  }, [items]);

  const BADGES = useMemo(() => {
    const set = new Set(items.map(p => p.badge).filter(Boolean));
    return ["All", ...Array.from(set)];
  }, [items]);

  const COLORS = useMemo(() => {
    const set = new Set();
    items.forEach(p => (p.colors || []).forEach(c => { if (c.name) set.add(c.name); }));
    return ["All", ...Array.from(set)];
  }, [items]);

  useEffect(() => {
    if (queryCategory && CATEGORIES.includes(queryCategory)) {
      setCategory(queryCategory);
      setSubcategory(querySubcategory || "All");
    } else if (!queryCategory) {
      setCategory("All");
      setSubcategory("All");
    }

    if (queryMaterial && MATERIALS.includes(queryMaterial)) {
      setMaterial(queryMaterial);
    } else if (!queryMaterial) {
      setMaterial("All");
    }
    setColor("All");

    if (querySort && SORT_OPTIONS.some((option) => option.value === querySort)) {
      setSort(querySort);
    } else if (!querySort) {
      setSort("featured");
    }
  }, [queryCategory, querySubcategory, queryMaterial, querySort, CATEGORIES, MATERIALS]);

  useEffect(() => {
    const updateWished = () => setWished(getWishlist().map((item) => item.id));
    window.addEventListener("wishlist:updated", updateWished);
    return () => window.removeEventListener("wishlist:updated", updateWished);
  }, []);

  const toggleWish = (item) => {
    toggleWishlist({
      id: item._id,
      title: item.title,
      img: item.img,
      price: item.price,
      category: item.category,
    });
    setWished(getWishlist().map((entry) => entry.id));
  };

  const filtered = useMemo(() => {
    let list = [...items];
    if (category !== "All") list = list.filter(p => p.category === category);
    if (subcategory !== "All") list = list.filter(p => p.subcategory === subcategory);
    if (material !== "All") list = list.filter(p => p.material === material);
    if (color !== "All") list = list.filter(p => (p.colors || []).some(c => c.name === color));
    if (size !== "All") list = list.filter(p => (p.sizes || []).includes(size));
    if (badge !== "All") list = list.filter(p => p.badge === badge);
    if (inStock) list = list.filter(p => p.inStock !== false && Number(p.quantity || 0) > 0);
    if (dealsOnly) list = list.filter(p => p.isDeal);
    if (newOnly) list = list.filter(p => p.badge?.toLowerCase() === "new");
    if (minDiscount > 0) list = list.filter(p => {
      if (!isDealActive(deal) || !p.isDeal) return false;
      const orig = Number(p.price || 0);
      if (!orig) return false;
      const discounted = getDealPrice(orig, deal);
      return Math.round(((orig - discounted) / orig) * 100) >= minDiscount;
    });
    list = list.filter(p => p.price <= maxPrice && p.price >= minPrice && (p.rating || 0) >= minRating);
    if (sort === "price_asc")  list.sort((a, b) => a.price - b.price);
    if (sort === "price_desc") list.sort((a, b) => b.price - a.price);
    if (sort === "rating")     list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    if (sort === "reviews")    list.sort((a, b) => (b.reviews || 0) - (a.reviews || 0));
    return list;
  }, [items, category, subcategory, material, color, size, badge, inStock, dealsOnly, newOnly, minDiscount, minPrice, maxPrice, minRating, sort, deal]);

  const resetAll = () => {
    setCategory("All");
    setSubcategory("All");
    setMaterial("All");
    setColor("All");
    setSize("All");
    setBadge("All");
    setInStock(false);
    setDealsOnly(false);
    setNewOnly(false);
    setMinDiscount(0);
    setMinPrice(priceFloor);
    setMaxPrice(priceCeil);
    setMinRating(0);
  };

  const activeTags = [
    category    !== "All" && { key: "cat",    label: category,             clear: () => { setCategory("All"); setSubcategory("All"); } },
    subcategory !== "All" && { key: "subcat", label: subcategory,          clear: () => setSubcategory("All") },
    material    !== "All" && { key: "mat",    label: material,             clear: () => setMaterial("All")  },
    color       !== "All" && { key: "color",  label: color,                clear: () => setColor("All")     },
    size        !== "All" && { key: "size",   label: `Size: ${size}`,      clear: () => setSize("All")      },
    badge       !== "All" && { key: "badge",  label: badge,                clear: () => setBadge("All")     },
    inStock              && { key: "stock",  label: "In Stock",           clear: () => setInStock(false)   },
    dealsOnly            && { key: "deals",  label: "Deals Only",         clear: () => setDealsOnly(false) },
    newOnly              && { key: "new",    label: "New Arrivals",        clear: () => setNewOnly(false)   },
    minDiscount > 0      && { key: "disc",   label: `${minDiscount}%+ Off`, clear: () => setMinDiscount(0)  },
    minPrice    > priceFloor && { key: "minp", label: `Min ${formatPKR(minPrice)}`, clear: () => setMinPrice(priceFloor) },
    maxPrice    < priceCeil  && { key: "price", label: `Up to ${formatPKR(maxPrice)}`, clear: () => setMaxPrice(priceCeil) },
    minRating >  0      && { key: "rating", label: `${minRating}+ stars`, clear: () => setMinRating(0)     },
  ].filter(Boolean);

  const SidebarContent = (
    <>
      <div className="sp-sidebar-head">
        <span>Filters</span>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          {activeTags.length > 0 && (
            <button className="sp-clear-all" onClick={resetAll}>Clear all</button>
          )}
          <button className="sp-drawer-close" onClick={() => setDrawerOpen(false)} aria-label="Close filters">
            <XIcon />
          </button>
        </div>
      </div>

      {/* Quick toggles */}
      <div style={{ display: "flex", gap: "0.5rem", padding: "0.85rem 0", borderBottom: "1px solid #ede7de", flexWrap: "wrap" }}>
        {[
          { label: "In Stock",     active: inStock,   toggle: () => setInStock(v => !v),   emoji: "✓" },
          { label: "Deals",        active: dealsOnly, toggle: () => setDealsOnly(v => !v), emoji: "🔥" },
          { label: "New Arrivals", active: newOnly,   toggle: () => setNewOnly(v => !v),   emoji: "✨" },
        ].map(({ label, active, toggle, emoji }) => (
          <button key={label} onClick={toggle} style={{
            display: "inline-flex", alignItems: "center", gap: "5px",
            padding: "6px 12px", fontSize: "12px", fontWeight: 700, cursor: "pointer",
            border: "1.5px solid", borderRadius: "999px",
            background: active ? "var(--dark)" : "transparent",
            color: active ? "#fff" : "var(--dark)",
            borderColor: active ? "var(--dark)" : "#d8cebf",
            transition: "0.18s all",
            boxShadow: active ? "0 2px 10px rgba(46,13,16,0.22)" : "none",
          }}>
            <span style={{ fontSize: "11px" }}>{emoji}</span>{label}
          </button>
        ))}
      </div>

      <FilterGroup title="Category">
        {CATEGORIES.map(c => (
          <label key={c} className="sp-check-row">
            <input type="radio" name="cat" checked={category === c}
              onChange={() => { setCategory(c); setSubcategory("All"); }} className="sp-radio" />
            <span className="sp-check-label">{c}</span>
            <span className="sp-check-count">
              {c === "All" ? items.length : items.filter(p => p.category === c).length}
            </span>
          </label>
        ))}
      </FilterGroup>

      {category !== "All" && SUBCATEGORIES.length > 0 && (
        <FilterGroup title="Subcategory">
          <label className="sp-check-row">
            <input type="radio" name="subcat" checked={subcategory === "All"}
              onChange={() => setSubcategory("All")} className="sp-radio" />
            <span className="sp-check-label">All</span>
            <span className="sp-check-count">{items.filter(p => p.category === category).length}</span>
          </label>
          {SUBCATEGORIES.map(s => (
            <label key={s} className="sp-check-row">
              <input type="radio" name="subcat" checked={subcategory === s}
                onChange={() => setSubcategory(s)} className="sp-radio" />
              <span className="sp-check-label">{s}</span>
              <span className="sp-check-count">
                {items.filter(p => p.category === category && p.subcategory === s).length}
              </span>
            </label>
          ))}
        </FilterGroup>
      )}

      <FilterGroup title="Price Range">
        <div className="sp-price-wrap">
          <div className="sp-price-display">
            <span className="sp-price-tag">{formatPKR(priceFloor)}</span>
            <span className="sp-price-current">{formatPKR(minPrice)} – {formatPKR(maxPrice)}</span>
            <span className="sp-price-tag">{formatPKR(priceCeil)}</span>
          </div>
          <div style={{ marginBottom: "6px" }}>
            <div style={{ fontSize: "11px", color: "var(--muted)", marginBottom: "3px" }}>Min price</div>
            <input type="range" min={priceFloor} max={priceCeil} value={minPrice}
              onChange={e => setMinPrice(Math.min(+e.target.value, maxPrice))}
              className="sp-range" />
          </div>
          <div>
            <div style={{ fontSize: "11px", color: "var(--muted)", marginBottom: "3px" }}>Max price</div>
            <input type="range" min={priceFloor} max={priceCeil} value={maxPrice}
              onChange={e => setMaxPrice(Math.max(+e.target.value, minPrice))}
              className="sp-range" />
          </div>
        </div>
      </FilterGroup>

      {SIZES.length > 1 && (
        <FilterGroup title="Size">
          {SIZES.map(s => (
            <label key={s} className="sp-check-row">
              <input type="radio" name="size" checked={size === s}
                onChange={() => setSize(s)} className="sp-radio" />
              <span className="sp-check-label">{s}</span>
              <span className="sp-check-count">
                {s === "All" ? items.length : items.filter(p => (p.sizes || []).includes(s)).length}
              </span>
            </label>
          ))}
        </FilterGroup>
      )}

      {COLORS.length > 1 && (
        <FilterGroup title="Color">
          {COLORS.map(c => (
            <label key={c} className="sp-check-row">
              <input type="radio" name="color" checked={color === c}
                onChange={() => setColor(c)} className="sp-radio" />
              <span className="sp-check-label" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                {c !== "All" && (() => {
                  const variant = items.flatMap(p => p.colors || []).find(cv => cv.name === c);
                  return variant?.hex
                    ? <span style={{ width: 14, height: 14, borderRadius: "50%", background: variant.hex, display: "inline-block", flexShrink: 0, border: "1px solid rgba(0,0,0,0.15)" }} />
                    : variant?.image
                      ? <img src={variant.image} alt={c} style={{ width: 18, height: 18, objectFit: "cover", borderRadius: 2, border: "1px solid #d8cebf", flexShrink: 0 }} />
                      : <span style={{ width: 14, height: 14, borderRadius: "50%", background: "#d8cebf", display: "inline-block", flexShrink: 0 }} />;
                })()}
                {c}
              </span>
              <span className="sp-check-count">
                {c === "All" ? items.length : items.filter(p => (p.colors || []).some(cv => cv.name === c)).length}
              </span>
            </label>
          ))}
        </FilterGroup>
      )}

      <FilterGroup title="Material">
        {MATERIALS.map(m => (
          <label key={m} className="sp-check-row">
            <input type="radio" name="mat" checked={material === m}
              onChange={() => setMaterial(m)} className="sp-radio" />
            <span className="sp-check-label">{m}</span>
            <span className="sp-check-count">
              {m === "All" ? items.length : items.filter(p => p.material === m).length}
            </span>
          </label>
        ))}
      </FilterGroup>

      {BADGES.length > 1 && (
        <FilterGroup title="Badge">
          {BADGES.map(b => (
            <label key={b} className="sp-check-row">
              <input type="radio" name="badge" checked={badge === b}
                onChange={() => setBadge(b)} className="sp-radio" />
              <span className="sp-check-label">{b}</span>
              <span className="sp-check-count">
                {b === "All" ? items.length : items.filter(p => p.badge === b).length}
              </span>
            </label>
          ))}
        </FilterGroup>
      )}

      <FilterGroup title="Customer Rating">
        {[[0,"All Ratings"],[3,"3+ Stars"],[4,"4+ Stars"],[4.5,"4.5+ Stars"],[4.8,"4.8+ Stars"]].map(([val, lbl]) => (
          <label key={val} className="sp-check-row">
            <input type="radio" name="rating" checked={minRating === val}
              onChange={() => setMinRating(val)} className="sp-radio" />
            <span className="sp-check-label" style={{ display: "flex", alignItems: "center", gap: "5px" }}>
              {val > 0 && (
                <span style={{ color: "#d97706", fontSize: "11px" }}>
                  {"★".repeat(Math.floor(val))}{val % 1 ? "½" : ""}
                </span>
              )}
              {lbl}
            </span>
          </label>
        ))}
      </FilterGroup>

      <FilterGroup title="Discount" defaultOpen={false}>
        {[[0,"Any"],[10,"10%+ Off"],[20,"20%+ Off"],[30,"30%+ Off"],[50,"50%+ Off"]].map(([val, lbl]) => (
          <label key={val} className="sp-check-row">
            <input type="radio" name="disc" checked={minDiscount === val}
              onChange={() => setMinDiscount(val)} className="sp-radio" />
            <span className="sp-check-label">{lbl}</span>
            {val > 0 && <span style={{ fontSize: "10px", background: "#fef2f2", color: "#b91c1c", padding: "1px 6px", borderRadius: "999px", fontWeight: 700, marginLeft: "auto" }}>{val}%+</span>}
          </label>
        ))}
      </FilterGroup>
    </>
  );

  return (
    <main className="sp-page">
      <ShopHero />

      {drawerOpen && (
        <div className="sp-drawer-overlay" onClick={() => setDrawerOpen(false)} />
      )}

      <aside className={`sp-drawer ${drawerOpen ? "sp-drawer-open" : ""}`}>
        {SidebarContent}
      </aside>

      <div className="sp-wrap">
        <div className="container">
          <div className="sp-layout">
            <aside className="sp-sidebar">
              {SidebarContent}
            </aside>

            <div className="sp-main">
              <div className="sp-mobile-filter-bar">
                <button className="sp-mobile-filter-btn" onClick={() => setDrawerOpen(true)}>
                  <FilterIcon />
                  Filters
                  {activeTags.length > 0 && <span className="sp-mobile-filter-count">{activeTags.length}</span>}
                </button>
                <select className="sp-sort sp-sort-mobile" value={sort} onChange={e => setSort(e.target.value)}>
                  {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>

              <motion.div
                className="sp-toolbar"
                variants={revealUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: false, amount: 0.2 }}
              >
                <div className="sp-toolbar-left">
                  {queryText && (
                    <p className="sp-count mb-1">
                      Search results for <strong>"{queryText}"</strong>
                    </p>
                  )}
                  <p className="sp-count">
                    Showing <strong>{filtered.length}</strong> of <strong>{items.length}</strong> products
                  </p>
                  {activeTags.length > 0 && (
                    <div className="sp-active-tags">
                      {activeTags.map(t => (
                        <span key={t.key} className="sp-active-tag">
                          {t.label}
                          <button onClick={t.clear} aria-label="Remove filter"><XIcon /></button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="sp-toolbar-right">
                  <select className="sp-sort" value={sort} onChange={e => setSort(e.target.value)}>
                    {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                  <div className="sp-view-btns">
                    <button className={`sp-view-btn ${view === "grid" ? "active" : ""}`} onClick={() => setView("grid")} aria-label="Grid view"><GridIcon /></button>
                    <button className={`sp-view-btn ${view === "list" ? "active" : ""}`} onClick={() => setView("list")} aria-label="List view"><ListIcon /></button>
                  </div>
                </div>
              </motion.div>

              {loading && (
                <div className="sp-empty">
                  <h4>Loading products...</h4>
                </div>
              )}

              {!loading && error && (
                <div className="sp-empty">
                  <h4>Could not load products</h4>
                  <p>{error}</p>
                </div>
              )}

              {!loading && !error && (filtered.length === 0 ? (
                <div className="sp-empty">
                  <svg width="52" height="52" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.172 16.172a4 4 0 0 1 5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" />
                  </svg>
                  <h4>No products found</h4>
                  <p>Try adjusting your filters to find what you're looking for.</p>
                  <button className="btn-brand" onClick={resetAll}>Clear Filters</button>
                </div>
              ) : (
                <motion.div
                  className={view === "grid" ? "sp-grid" : "sp-list"}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: false, amount: 0.1 }}
                  transition={{ staggerChildren: 0.06 }}
                >
                  {filtered.map(item => (
                    <ProductCard key={item._id} item={item} view={view}
                      wished={wished.includes(item._id)} onWish={toggleWish}
                      deal={deal} getDealPrice={getDealPrice} isDealActive={isDealActive} />
                  ))}
                </motion.div>
              ))}
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}














