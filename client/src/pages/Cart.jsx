import { Link } from "react-router-dom";
import { useEffect, useMemo, useState, useCallback } from "react";
import { formatPKR } from "../util/formatCurrency";
import { getCart, updateQty, removeFromCart, getCartSubtotal, addToCart } from "../util/cart";
import { apiGet } from "../util/api";
import { getWishlist, toggleWishlist } from "../wishlist";
import usePageMeta from "../util/usePageMeta";

const TrashIcon = () => (
  <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" />
  </svg>
);
const TagIcon = () => (
  <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
    <circle cx="7" cy="7" r="1" fill="currentColor" />
  </svg>
);
const ShieldIcon = () => (
  <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);
const TruckIcon = () => (
  <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M1 3h15v13H1zM16 8h4l3 3v5h-7V8zM5.5 21a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zM18.5 21a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z" />
  </svg>
);
const ReturnIcon = () => (
  <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h10a8 8 0 0 1 8 8v2M3 10l4-4M3 10l4 4" />
  </svg>
);
const ChevronIcon = () => (
  <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
  </svg>
);
const LockIcon = () => (
  <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);
const CartIcon = () => (
  <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 9m12-9l2 9M9 21a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm6 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" />
  </svg>
);
const HeartIcon = ({ active }) => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);
const EyeIcon = () => (
  <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

export default function Cart() {
  usePageMeta({
    title: "Your Cart",
    description: "Review your selected curtain fabrics, blinds and interior products before checkout at Shafisons.",
    canonical: "/cart",
  });

  const [items, setItems] = useState([]);
  const [browseItems, setBrowseItems] = useState([]);
  const [wished, setWished] = useState(() => getWishlist().map((w) => w.id));
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [discount, setDiscount] = useState(0);
  const [toast, setToast] = useState(null);
  const [couponLoading, setCouponLoading] = useState(false);

  const refresh = () => setItems(getCart());

  useEffect(() => {
    refresh();
    const handler = () => refresh();
    window.addEventListener("cart:updated", handler);
    return () => window.removeEventListener("cart:updated", handler);
  }, []);

  useEffect(() => {
    let active = true;
    apiGet("/api/products")
      .then((list) => {
        if (!active) return;
        const products = Array.isArray(list) ? list : Array.isArray(list?.products) ? list.products : [];
        setBrowseItems(products.slice(0, 4));
      })
      .catch(() => { if (!active) return; setBrowseItems([]); });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    const update = () => setWished(getWishlist().map((w) => w.id));
    window.addEventListener("wishlist:updated", update);
    return () => window.removeEventListener("wishlist:updated", update);
  }, []);

  const toggleWish = useCallback((item) => {
    toggleWishlist({ id: item._id, title: item.title, img: item.img, price: item.price, category: item.category });
    setWished(getWishlist().map((w) => w.id));
  }, []);

  const handleBrowseAdd = useCallback((item) => {
    addToCart({ id: item._id, title: item.title, img: item.img, unitPrice: Number(item.price || 0), originalPrice: Number(item.price || 0), priceUnit: item.priceUnit || "per yard" }, 1);
  }, []);

  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(id);
  }, [toast]);

  const subtotal = useMemo(() => getCartSubtotal(), [items]);
  const shipping = subtotal > 0 && subtotal < 10000 ? 299 : 0;
  const total = Math.max(0, subtotal - discount + shipping);
  const totalItems = items.reduce((s, i) => s + (i.qty || 0), 0);

  const computeDiscount = (coupon, list) => {
    if (!coupon) return 0;
    const nonDealItems = list.filter((item) => !item.isDeal);
    let eligibleSubtotal = nonDealItems.reduce((sum, item) => sum + (item.qty || 0) * (item.unitPrice || 0), 0);
    if (!coupon.appliesToAll) {
      const allowed = new Set((coupon.productIds || []).map(String));
      eligibleSubtotal = nonDealItems.reduce((sum, item) =>
        allowed.has(String(item.id)) ? sum + (item.qty || 0) * (item.unitPrice || 0) : sum, 0);
    }
    if (eligibleSubtotal <= 0) return 0;
    const discountAmount = coupon.type === "percentage"
      ? Math.round(eligibleSubtotal * (coupon.value / 100))
      : coupon.value;
    return Math.min(discountAmount, eligibleSubtotal);
  };

  useEffect(() => {
    if (!appliedCoupon) { setDiscount(0); return; }
    setDiscount(computeDiscount(appliedCoupon, items));
  }, [items, appliedCoupon]);

  const applyCoupon = async () => {
    if (!couponCode.trim()) { setToast({ type: "error", message: "Please enter a coupon code." }); return; }
    setCouponLoading(true);
    try {
      const couponsRes = await apiGet("/api/coupons");
      const list = Array.isArray(couponsRes) ? couponsRes : Array.isArray(couponsRes?.value) ? couponsRes.value : [];
      const code = couponCode.trim().toLowerCase();
      const coupon = list.find((c) => String(c.code || "").toLowerCase() === code);
      if (!coupon) { setToast({ type: "error", message: "Invalid coupon code." }); setAppliedCoupon(null); setDiscount(0); return; }
      if (!coupon.active) { setToast({ type: "error", message: "This coupon is not active." }); setAppliedCoupon(null); setDiscount(0); return; }
      const now = Date.now();
      if (coupon.startDate && new Date(coupon.startDate).getTime() > now) { setToast({ type: "error", message: "This coupon is not active yet." }); setAppliedCoupon(null); setDiscount(0); return; }
      if (coupon.endDate && new Date(coupon.endDate).getTime() < now) { setToast({ type: "error", message: "This coupon has expired." }); setAppliedCoupon(null); setDiscount(0); return; }
      const discountAmount = computeDiscount(coupon, items);
      if (discountAmount <= 0) { setToast({ type: "error", message: "Coupon does not apply to these items." }); setAppliedCoupon(null); setDiscount(0); return; }
      setAppliedCoupon(coupon);
      setDiscount(discountAmount);
      setToast({ type: "success", message: `Coupon "${coupon.code}" applied! You save ${formatPKR(discountAmount)}.` });
    } catch {
      setToast({ type: "error", message: "Could not apply coupon. Try again." });
    } finally {
      setCouponLoading(false);
    }
  };

  const clearCoupon = () => { setAppliedCoupon(null); setDiscount(0); setCouponCode(""); };

  return (
    <main className="cart-page">
      <section className="cart-section">
        <div className="container">

          {/* Breadcrumb */}
          <nav className="cart-breadcrumb">
            <Link to="/">Home</Link>
            <ChevronIcon />
            <Link to="/shop">Shop</Link>
            <ChevronIcon />
            <span>Cart</span>
          </nav>

          {/* Header */}
          <div className="cart-head">
            <div>
              <h1 className="cart-title">Shopping Cart</h1>
              {items.length > 0 && (
                <p className="cart-sub">{totalItems} {totalItems === 1 ? "item" : "items"} in your cart</p>
              )}
            </div>
            {items.length > 0 && (
              <Link to="/shop" className="cart-continue-link">
                ← Continue Shopping
              </Link>
            )}
          </div>

          {toast && (
            <div className={`cart-toast ${toast.type}`}>
              {toast.type === "success" ? "✓" : "✕"} {toast.message}
            </div>
          )}

          {items.length === 0 ? (
            <div className="cart-empty">
              <div className="cart-empty-icon">🛒</div>
              <h3>Your cart is empty</h3>
              <p>Looks like you haven't added anything yet. Browse our collection and find something you love.</p>
              <Link to="/shop" className="btn-dark">Browse Products</Link>
            </div>
          ) : (
            <>
              <div className="cart-layout">

                {/* ── Left: Items + Coupon ── */}
                <div className="cart-left">

                  {/* Column headers */}
                  <div className="cart-col-headers">
                    <span>Product</span>
                    <span>Price</span>
                    <span>Quantity</span>
                    <span>Total</span>
                  </div>

                  <div className="cart-lines">
                    {items.map((row) => (
                      <article className="cart-line" key={`${row.id}-${row.size}-${row.color}`}>

                        {/* Image */}
                        <Link to={`/shop/${row.id}`} className="cart-line-img-wrap">
                          <img src={row.img} alt={row.title} className="cart-line-img" />
                          {row.isDeal && <span className="cart-img-deal-badge">Deal</span>}
                        </Link>

                        {/* Info */}
                        <div className="cart-line-info">
                          <Link to={`/shop/${row.id}`} className="cart-line-title">{row.title}</Link>
                          {row.sku && <span className="cart-line-sku">SKU: {row.sku}</span>}
                          <div className="cart-line-meta">
                            {row.color && (
                              <span className="cart-line-tag">
                                {row.colorHex && (
                                  <span className="cart-color-dot" style={{ background: row.colorHex }} />
                                )}
                                {row.color}
                              </span>
                            )}
                            {row.size && <span className="cart-line-tag">Size: {row.size}</span>}
                          </div>
                          <button className="cart-remove-btn" onClick={() => removeFromCart(row.id, row.size, row.color)}>
                            <TrashIcon /> Remove
                          </button>
                        </div>

                        {/* Unit Price */}
                        <div className="cart-line-price-col">
                          <span className="cart-line-price">{formatPKR(row.unitPrice)}</span>
                          <span className="cart-line-price-unit">{row.priceUnit || "per yard"}</span>
                          {row.originalPrice > row.unitPrice && (
                            <span className="cart-line-old-price">{formatPKR(row.originalPrice)}</span>
                          )}
                        </div>

                        {/* Qty */}
                        <div className="cart-line-qty-col">
                          <div className="cart-qty">
                            <button
                              className="cart-qty-btn"
                              onClick={() => updateQty(row.id, Math.max(1, (row.qty || 1) - 1), row.size, row.color)}
                              aria-label="Decrease"
                            >−</button>
                            <span className="cart-qty-num">{row.qty}</span>
                            <button
                              className="cart-qty-btn"
                              onClick={() => updateQty(row.id, (row.qty || 1) + 1, row.size, row.color)}
                              aria-label="Increase"
                            >+</button>
                          </div>
                          <span className="cart-qty-unit">{row.priceUnit === "per yard" ? "yards" : "pcs"}</span>
                        </div>

                        {/* Line Total */}
                        <div className="cart-line-total-col">
                          <strong className="cart-line-total">{formatPKR((row.qty || 0) * (row.unitPrice || 0))}</strong>
                          {row.originalPrice > row.unitPrice && (
                            <span className="cart-line-saved">
                              Save {formatPKR((row.originalPrice - row.unitPrice) * row.qty)}
                            </span>
                          )}
                        </div>

                      </article>
                    ))}
                  </div>

                  {/* Coupon */}
                  <div className="cart-coupon-block">
                    <div className="cart-coupon-label">
                      <TagIcon /> Have a coupon code?
                    </div>
                    {appliedCoupon ? (
                      <div className="cart-coupon-applied">
                        <div className="cart-coupon-applied-info">
                          <span className="cart-coupon-applied-code">{appliedCoupon.code}</span>
                          <span className="cart-coupon-applied-save">You save {formatPKR(discount)}</span>
                        </div>
                        <button className="cart-coupon-remove" onClick={clearCoupon}>Remove</button>
                      </div>
                    ) : (
                      <div className="cart-coupon-row">
                        <input
                          type="text"
                          placeholder="Enter coupon code"
                          className="cart-coupon-input"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && applyCoupon()}
                        />
                        <button className="cart-coupon-btn" onClick={applyCoupon} disabled={couponLoading}>
                          {couponLoading ? "Applying..." : "Apply"}
                        </button>
                      </div>
                    )}
                    <p className="cart-coupon-note">* Coupons do not apply to deal items.</p>
                  </div>

                </div>

                {/* ── Right: Order Summary ── */}
                <aside className="cart-summary">
                  <h3 className="cart-summary-title">Order Summary</h3>

                  <div className="cart-summary-lines">
                    <div className="cart-summary-line">
                      <span>Subtotal ({totalItems} {totalItems === 1 ? "item" : "items"})</span>
                      <strong>{formatPKR(subtotal)}</strong>
                    </div>
                    {discount > 0 && (
                      <div className="cart-summary-line cart-summary-discount">
                        <span>Coupon Discount</span>
                        <strong>− {formatPKR(discount)}</strong>
                      </div>
                    )}
                    <div className="cart-summary-line">
                      <span>Shipping</span>
                      <strong>{shipping === 0 ? <span className="cart-free-ship">FREE</span> : formatPKR(shipping)}</strong>
                    </div>
                    {shipping > 0 && (
                      <p className="cart-ship-note">Add {formatPKR(10000 - subtotal)} more for free shipping</p>
                    )}
                    <div className="cart-summary-divider" />
                    <div className="cart-summary-total">
                      <span>Total</span>
                      <strong>{formatPKR(total)}</strong>
                    </div>
                    {discount > 0 && (
                      <div className="cart-summary-saving">
                        🎉 You're saving {formatPKR(discount)} on this order!
                      </div>
                    )}
                  </div>

                  <Link to="/checkout" className="cart-checkout-btn">
                    <LockIcon /> Proceed to Checkout
                  </Link>

                  <div className="cart-summary-trust">
                    <div className="cart-trust-item"><ShieldIcon /> Secure Checkout</div>
                    <div className="cart-trust-item"><TruckIcon /> Free shipping over {formatPKR(10000)}</div>
                    <div className="cart-trust-item"><ReturnIcon /> 30-day free returns</div>
                  </div>

                  <div className="cart-payment-icons">
                    <span className="cart-payment-label">We accept</span>
                    <div className="cart-payment-badges">
                      <span className="cart-pay-badge">Cash on Delivery</span>
                      <span className="cart-pay-badge">Bank Transfer</span>
                    </div>
                  </div>
                </aside>
              </div>

              {/* Browse More */}
              {browseItems.length > 0 && (
                <section className="cart-browse">
                  <div className="cart-browse-head">
                    <h3 className="cart-browse-title">You Might Also Like</h3>
                    <Link to="/shop" className="cart-browse-link">See All →</Link>
                  </div>
                  <div className="cart-browse-grid">
                    {browseItems.map((item) => (
                      <div key={item._id} className="cart-browse-card" data-cart-browse>
                        <div className="cart-browse-img-wrap">
                          <Link to={`/shop/${item._id}`}>
                            <img src={item.img} alt={item.title} className="cart-browse-img" loading="lazy" />
                          </Link>
                          <div className="sp-card-actions">
                            <button className="sp-action-btn" onClick={() => toggleWish(item)} aria-label="Wishlist"
                              style={{ color: wished.includes(item._id) ? "#ef4444" : undefined }}>
                              <HeartIcon active={wished.includes(item._id)} />
                            </button>
                            <Link to={`/shop/${item._id}`} className="sp-action-btn" aria-label="View product">
                              <EyeIcon />
                            </Link>
                          </div>
                          <button className="sp-add-cart-btn" onClick={() => handleBrowseAdd(item)}>
                            <CartIcon /> Add to Cart
                          </button>
                        </div>
                        <div className="cart-browse-info">
                          <p className="cart-browse-name">{item.title}</p>
                          <strong className="cart-browse-price">{formatPKR(item.price)}</strong>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </>
          )}
        </div>
      </section>
    </main>
  );
}
