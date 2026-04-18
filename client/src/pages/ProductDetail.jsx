import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { apiGet } from "../util/api";
import { formatPKR } from "../util/formatCurrency";
import { addToCart } from "../util/cart";
import { hasInWishlist, toggleWishlist } from "../wishlist";
import { getQuantity, isLowStock, isOutOfStock } from "../util/stock";
import usePageMeta from "../util/usePageMeta";

/* -- Icons -- */
const StarIcon = ({ filled }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.5">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);
const CartIcon = () => (
  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 9m12-9l2 9M9 21a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm6 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" />
  </svg>
);
const HeartIcon = ({ active }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill={active ? "#ef4444" : "none"} stroke={active ? "#ef4444" : "currentColor"} strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);
const ShareIcon = () => (
  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8M16 6l-4-4-4 4M12 2v13" />
  </svg>
);
const ShieldIcon = () => (
  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);
const TruckIcon = () => (
  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M1 3h15v13H1zM16 8h4l3 3v5h-7V8zM5.5 21a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zM18.5 21a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z" />
  </svg>
);
const ReturnIcon = () => (
  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h10a8 8 0 0 1 8 8v2M3 10l4-4M3 10l4 4" />
  </svg>
);
const ChevronIcon = () => (
  <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
  </svg>
);
const MinusIcon = () => (
  <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
  </svg>
);
const PlusIcon = () => (
  <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14M5 12h14" />
  </svg>
);
const CheckIcon = () => (
  <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);
const EyeIcon = () => (
  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ZOOM = 2.1;

function ImageZoom({ src, alt }) {
  const wrapRef = useRef(null);
  const [zoomOrigin, setZoomOrigin] = useState("50% 50%");
  const [isZoomed, setIsZoomed] = useState(false);

  const onMove = (e) => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const rect = wrap.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const originX = `${(x / rect.width) * 100}%`;
    const originY = `${(y / rect.height) * 100}%`;
    setZoomOrigin(`${originX} ${originY}`);
    setIsZoomed(true);
  };

  const onLeave = () => {
    setIsZoomed(false);
    setZoomOrigin("50% 50%");
  };

  return (
    <div
      ref={wrapRef}
      className={`pd-zoom-wrap ${isZoomed ? "is-zoomed" : ""}`}
      onMouseMove={onMove}
      onMouseEnter={onMove}
      onMouseLeave={onLeave}
    >
      <img
        src={src}
        alt={alt}
        className="pd-main-img"
        style={{
          transformOrigin: zoomOrigin,
          transform: isZoomed ? `scale(${ZOOM})` : "scale(1)",
        }}
      />
    </div>
  );
}


function Stars({ rating }) {
  return (
    <span className="pd-stars">
      {[1,2,3,4,5].map(i => (
        <span key={i} style={{ color: i <= Math.round(rating) ? "#d97706" : "#dce5e4" }}>
          <StarIcon filled={i <= Math.round(rating)} />
        </span>
      ))}
    </span>
  );
}

function AccordionItem({ title, children }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`pd-accordion-item ${open ? "open" : ""}`}>
      <button className="pd-accordion-btn" onClick={() => setOpen(o => !o)}>
        <span>{title}</span>
        <span className={`pd-accordion-icon ${open ? "rotated" : ""}`}>
          <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </span>
      </button>
      {open && <div className="pd-accordion-body">{children}</div>}
    </div>
  );
}

function HoverProductActions({ item, wished, onWish, onAdd }) {
  return (
    <>
      <div className="pd-card-actions">
        <button
          type="button"
          className="pd-card-action-btn"
          aria-label="Wishlist"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onWish(item);
          }}
          style={{ color: wished ? "#ef4444" : undefined }}
        >
          <HeartIcon active={wished} />
        </button>
        <Link
          to={`/shop/${item._id}`}
          className="pd-card-action-btn"
          aria-label="View product"
          onClick={(e) => e.stopPropagation()}
        >
          <EyeIcon />
        </Link>
      </div>
      <button
        type="button"
        className="pd-card-cart-btn"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onAdd(item);
        }}
      >
        <CartIcon /> Add to Cart
      </button>
    </>
  );
}

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [allProducts, setAllProducts] = useState([]);
  const [deal, setDeal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  usePageMeta({
    title: product ? product.title : "Product",
    description: product
      ? `Buy ${product.title} — ${product.category} by Shafisons. ${product.material ? `Made from ${product.material}.` : ""} Premium quality interior fabrics in Quetta, Pakistan.`
      : "Premium interior fabric product at Shafisons.",
    keywords: product ? `${product.title}, ${product.category}, ${product.material || ""}, interior fabric Quetta` : "",
    canonical: `/shop/${id}`,
    image: product?.img || undefined,
    type: "product",
  });

  const [activeImg, setActiveImg] = useState(0);
  const [selectedSize, setSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [qty, setQty] = useState(1);
  const [wished, setWished] = useState(false);
  const [added, setAdded] = useState(false);
  const [activeTab, setActiveTab] = useState("description");

  useEffect(() => {
    let active = true;
    Promise.all([apiGet(`/api/products/${id}`), apiGet("/api/products"), apiGet("/api/deal-section").catch(() => null)])
      .then(([p, list, dealDoc]) => {
        if (!active) return;
        setProduct(p);
        setWished(hasInWishlist(p?._id));
        const productList = Array.isArray(list) ? list : Array.isArray(list?.products) ? list.products : [];
        setAllProducts(productList);
        setDeal(dealDoc || null);
        setSize(null);
        setSelectedColor(null);
        setError("");
      })
      .catch((err) => {
        if (!active) return;
        setError(err.message || "Failed to load product");
      })
      .finally(() => {
        if (!active) return;
        setLoading(false);
      });
    return () => { active = false; };
  }, [id]);

  const handleToggleWishlist = () => {
    if (!product) return;
    const activeWish = toggleWishlist({
      id: product._id,
      title: product.title,
      img: product.img,
      price: product.price,
      priceUnit: product.priceUnit || 'per yard',
      category: product.category,
    });
    setWished(activeWish);
  };

  const handleCardWishlist = (item) => {
    toggleWishlist({
      id: item._id,
      title: item.title,
      img: item.img,
      price: item.price,
      priceUnit: item.priceUnit || "per yard",
      category: item.category,
    });
  };

  const handleCardAddToCart = (item) => {
    addToCart({
      id: item._id,
      title: item.title,
      img: item.img,
      unitPrice: Number(item.price || 0),
      originalPrice: Number(item.price || 0),
      priceUnit: item.priceUnit || "per yard",
      isDeal: !!item.isDeal,
      size: "",
      color: "",
      colorHex: "",
      sku: item.sku || "",
      subcategorySerial: item.subcategorySerial || "",
    }, 1);
  };


  if (loading) {
    return (
      <main className="pd-not-found">
        <h2>Loading product...</h2>
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="pd-not-found">
        <h2>Product not found</h2>
        <p>{error}</p>
        <Link to="/shop" className="btn-brand d-inline-block mt-3">Back to Shop</Link>
      </main>
    );
  }

  const images = product.img ? [product.img] : [];
  const colorImages = (product.colors || []).filter(c => c.image).map(c => c.image);
  // gallery = main img + all color images
  const gallery = [...new Set([...images, ...colorImages])];
  const activeColor = selectedColor !== null ? product.colors?.[selectedColor] : null;
  // when a color is selected, put its image first
  const displayImages = activeColor?.image
    ? [activeColor.image, ...gallery.filter(img => img !== activeColor.image)]
    : gallery;
  const related = allProducts.filter(p => p.category === product.category && p._id !== product._id).slice(0, 4);
  const browseMore = allProducts.filter((p) => p._id !== product._id).slice(0, 3);

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

  const dealActive = product?.isDeal && isDealActive(deal);
  const outOfStock = isOutOfStock(product);
  const lowStock = isLowStock(product);
  const stockQty = getQuantity(product);
  const dealPrice = dealActive ? getDealPrice(product.price, deal) : null;

  const handleAddToCart = () => {
    if (outOfStock) return;
    setAdded(true);
    const unitPrice = dealActive ? dealPrice : product.price;
    const selectedSizeName = selectedSize !== null ? (product.sizes || [])[selectedSize] || '' : '';
    const selectedColorName = activeColor ? activeColor.name : '';
    // find subcategory serial from allProducts categories (passed via product data)
    const subcategorySerial = product.subcategorySerial || '';
    addToCart({
      id: product._id,
      title: product.title,
      img: activeColor?.image || product.img,
      unitPrice: Number(unitPrice || 0),
      originalPrice: Number(product.price || 0),
      priceUnit: product.priceUnit || 'per yard',
      isDeal: !!product.isDeal,
      size: selectedSizeName,
      color: selectedColorName,
      colorHex: activeColor?.hex || '',
      sku: product.sku || '',
      subcategorySerial,
    }, qty);
    setTimeout(() => setAdded(false), 2000);
  };


  const badgeClass = (b) => {
    if (!b) return "";
    const map = { Sale: "sp-badge-sale", New: "sp-badge-new", Popular: "sp-badge-popular", Bestseller: "sp-badge-bestseller" };
    return `sp-badge ${map[b] || ""}`;
  };

  return (
    <main className="pd-page">
      <div className="container">

        {/* Breadcrumb */}
        <nav className="pd-breadcrumb">
          <Link to="/">Home</Link>
          <ChevronIcon />
          <Link to="/shop">Shop</Link>
          <ChevronIcon />
          <span>{product.title}</span>
        </nav>

        {/* -- Main Section -- */}
        <div className="pd-main">

          {/* Left — Images */}
          <div className="pd-gallery">
            {/* Desktop: vertical thumbs on left */}
            <div className="pd-thumbs pd-thumbs-desktop">
              {displayImages.map((img, i) => (
                <button
                  key={i}
                  className={`pd-thumb ${activeImg === i ? "active" : ""}`}
                  onClick={() => setActiveImg(i)}
                >
                  <img src={img} alt={`View ${i + 1}`} />
                </button>
              ))}
            </div>

            {/* Main image + mobile thumb strip wrapper */}
            <div className="pd-gallery-main">
              <div className="pd-main-img-wrap">
                {product.badge && (
                  <span className={badgeClass(product.badge)}>{product.badge}</span>
                )}
                {displayImages[activeImg] && (
                  <ImageZoom key={displayImages[activeImg]} src={displayImages[activeImg]} alt={product.title} />
                )}
                <button
                  className={`pd-wish-float ${wished ? "active" : ""}`}
                  onClick={handleToggleWishlist}
                  aria-label="Wishlist"
                >
                  <HeartIcon active={wished} />
                </button>
              </div>

              {/* Mobile: horizontal thumb strip below main image */}
              <div className="pd-thumbs-mobile">
                {displayImages.map((img, i) => (
                  <button
                    key={i}
                    className={`pd-thumb ${activeImg === i ? "active" : ""}`}
                    onClick={() => setActiveImg(i)}
                  >
                    <img src={img} alt={`View ${i + 1}`} />
                </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right — Info */}
          <div className="pd-info">

            {/* Category + badge */}
            <div className="pd-info-top">
              <span className="pd-cat-label">{product.category}</span>
              {outOfStock && <span className="pd-out-badge">Out of Stock</span>}
              {lowStock && <span className="pd-low-badge">Low Stock ({stockQty} left)</span>}
              {product.color && <span className="pd-color-text">Color: {activeColor ? activeColor.name : product.color}</span>}
              {dealActive && <span className="pd-deal-badge">Deal</span>}
            </div>

            <h1 className="pd-title">{product.title}</h1>

            {/* Rating */}
            <div className="pd-rating-row">
              <Stars rating={product.rating || 0} />
              <span className="pd-rating-num">{product.rating || 0}</span>
              <span className="pd-rating-sep">·</span>
              <span className="pd-review-count">{product.reviews || 0} reviews</span>
            </div>

            {/* Price */}
            <div className="pd-price-row">
              <span className="pd-price">{formatPKR(dealActive ? dealPrice : product.price)}</span>
              <span style={{ fontSize: "13px", color: "#9ca3af", fontWeight: 500, alignSelf: "flex-end", marginBottom: "2px" }}>{product.priceUnit || "per yard"}</span>
              {dealActive && (
                <>
                  <span className="pd-price-orig" style={{ textDecoration: "line-through" }}>
                    {formatPKR(product.price)}
                  </span>
                  <span className="pd-discount">
                    {deal?.discountType === "amount"
                      ? `Save ${formatPKR(deal.discountValue)}`
                      : `Save ${deal?.discountValue || 0}%`}
                  </span>
                </>
              )}
            </div>

            <p className="pd-desc">{product.description}</p>

            <div className="pd-divider" />


            {/* Color Variants */}
            {product.colors && product.colors.length > 0 && (
              <div className="pd-option-group">
                <label className="pd-option-label">Color</label>
                <div className="pd-color-swatches">
                  {product.colors.map((c, i) => (
                    <div key={i} className="pd-color-swatch-wrap">
                      <button
                        className={`pd-color-swatch ${selectedColor === i ? "active" : ""}`}
                        onClick={() => {
                          setSelectedColor(i);
                          setActiveImg(0);
                        }}
                        title={c.name}
                      >
                        {c.hex
                          ? <span className="pd-color-swatch-hex" style={{ background: c.hex }} />
                          : c.image
                            ? <img src={c.image} alt={c.name} className="pd-color-swatch-img" />
                            : <span className="pd-color-swatch-label">{c.name}</span>
                        }
                      </button>
                      {c.name && <span className="pd-color-swatch-name">{c.name}</span>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Size */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="pd-option-group">
                <label className="pd-option-label">
                  Size
                  {selectedSize !== null && (
                    <span className="pd-option-val"> — {product.sizes[selectedSize]}</span>
                  )}
                </label>
                <div className="pd-sizes">
                  {product.sizes.map((s, i) => (
                    <button
                      key={i}
                      className={`pd-size-btn ${selectedSize === i ? "active" : ""}`}
                      onClick={() => setSize(selectedSize === i ? null : i)}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Qty + CTA */}
            <div className="pd-cta-row">
              <div className="pd-qty">
                <button className="pd-qty-btn" onClick={() => setQty(q => Math.max(1, q - 1))} aria-label="Decrease"><MinusIcon /></button>
                <span className="pd-qty-num">{qty}</span>
                <button className="pd-qty-btn" onClick={() => setQty(q => q + 1)} aria-label="Increase"><PlusIcon /></button>
              </div>
              <button
                className={`pd-add-btn ${added ? "added" : ""} ${outOfStock ? "disabled" : ""}`}
                onClick={handleAddToCart}
                disabled={outOfStock}
              >
                {added ? <><CheckIcon /> Added!</> : <><CartIcon /> {outOfStock ? "Out of Stock" : "Add to Cart"}</>}
              </button>
              <button className={`pd-wish-btn ${wished ? "active" : ""}`} onClick={handleToggleWishlist} aria-label="Wishlist">
                <HeartIcon active={wished} />
              </button>
              <button className="pd-share-btn" aria-label="Share"><ShareIcon /></button>
            </div>

            {/* Trust badges */}
            <div className="pd-trust">
              <div className="pd-trust-item">
                <TruckIcon />
                <span>Free shipping over {formatPKR(99)}</span>
              </div>
              <div className="pd-trust-item">
                <ReturnIcon />
                <span>30-day free returns</span>
              </div>
              <div className="pd-trust-item">
                <ShieldIcon />
                <span>{product.specs?.Warranty || ""} warranty</span>
              </div>
            </div>

          </div>
        </div>

        {/* -- Tabs -- */}
        <div className="pd-tabs-section">
          <div className="pd-tabs">
            {"description,specifications,reviews".split(",").map(tab => (
              <button
                key={tab}
                className={`pd-tab-btn ${activeTab === tab ? "active" : ""}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                {tab === "reviews" && <span className="pd-tab-count">{product.reviews || 0}</span>}
              </button>
            ))}
          </div>

          <div className="pd-tab-content">
            {activeTab === "description" && (
              <div className="pd-tab-desc">
                <p>{product.description}</p>
                <div className="pd-accordion">
                  <AccordionItem title="Materials & Construction">
                    <p>Crafted from {product.material?.toLowerCase() || "quality materials"} with precision joinery and hand-applied finishes. Each piece undergoes a 12-point quality inspection before shipping.</p>
                  </AccordionItem>
                  <AccordionItem title="Care Instructions">
                    <p>Wipe clean with a dry or slightly damp cloth. Avoid direct sunlight and moisture. For fabric pieces, spot clean with a mild detergent. Do not machine wash.</p>
                  </AccordionItem>
                  <AccordionItem title="Sustainability">
                    <p>We source all wood from FSC-certified forests. Our packaging is 100% recyclable and we offset carbon emissions for every order shipped.</p>
                  </AccordionItem>
                </div>
              </div>
            )}

            {activeTab === "specifications" && (
              <div className="pd-specs-table">
                {Object.entries(product.specs || {}).map(([key, val]) => (
                  <div className="pd-spec-row" key={key}>
                    <span className="pd-spec-key">{key}</span>
                    <span className="pd-spec-val">{val}</span>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "reviews" && (
              <div className="pd-reviews">
                <div className="pd-reviews-summary">
                  <div className="pd-reviews-score">
                    <span className="pd-score-big">{product.rating || 0}</span>
                    <Stars rating={product.rating || 0} />
                    <span className="pd-score-sub">Based on {product.reviews || 0} reviews</span>
                  </div>
                  <div className="pd-rating-bars">
                    {[5,4,3,2,1].map(star => (
                      <div className="pd-rating-bar-row" key={star}>
                        <span className="pd-bar-label">{star}?</span>
                        <div className="pd-bar-track">
                          <div className="pd-bar-fill" style={{ width: `${star === 5 ? 68 : star === 4 ? 20 : star === 3 ? 8 : 3}%` }} />
                        </div>
                        <span className="pd-bar-pct">{star === 5 ? "68" : star === 4 ? "20" : star === 3 ? "8" : "3"}%</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="pd-review-list">
                  {[] .map((r, i) => (
                    <div className="pd-review-card" key={i}>
                      <div className="pd-review-header">
                        <div className="pd-reviewer-avatar">{r.name[0]}</div>
                        <div>
                          <strong className="pd-reviewer-name">{r.name}</strong>
                          <span className="pd-review-date">{r.date}</span>
                        </div>
                        <div className="pd-review-stars ms-auto">
                          <Stars rating={r.rating} />
                        </div>
                      </div>
                      <p className="pd-review-text">{r.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* -- Related Products -- */}
        {related.length > 0 && (
          <div className="pd-related">
            <div className="pd-related-head">
              <span className="section-label">More Like This</span>
              <h2 className="fs-4 fw-bold text-dark mt-1">Related Products</h2>
            </div>
            <div className="pd-related-grid">
              {related.map(item => (
                <Link to={`/shop/${item._id}`} key={item._id} className="pd-related-card">
                  <div className="pd-related-img-wrap">
                    <img src={item.img} alt={item.title} className="pd-related-img" />
                    <HoverProductActions
                      item={item}
                      wished={hasInWishlist(item._id)}
                      onWish={handleCardWishlist}
                      onAdd={handleCardAddToCart}
                    />
                  </div>
                  <div className="pd-related-info">
                    <span className="pd-cat-label">{item.category}</span>
                    <h4 className="pd-related-title">{item.title}</h4>
                    <div className="pd-related-bottom">
                      <Stars rating={item.rating || 0} />
                      <strong className="pd-related-price">{formatPKR(item.price)}</strong>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {browseMore.length > 0 && (
          <section className="pd-browse">
            <div className="pd-browse-head">
              <h3 className="pd-browse-title">Browse More</h3>
              <Link to="/shop" className="pd-browse-link">See All Products</Link>
            </div>
            <div className="pd-browse-grid">
              {browseMore.map((item) => (
                <Link to={`/shop/${item._id}`} key={item._id} className="pd-browse-card">
                  <div className="pd-browse-img-wrap">
                    <img src={item.img} alt={item.title} className="pd-browse-img" />
                    <HoverProductActions
                      item={item}
                      wished={hasInWishlist(item._id)}
                      onWish={handleCardWishlist}
                      onAdd={handleCardAddToCart}
                    />
                  </div>
                  <p className="pd-browse-name">{item.title}</p>
                  <strong className="pd-browse-price">{formatPKR(item.price)}</strong>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}




