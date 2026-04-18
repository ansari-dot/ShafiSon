import { Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { formatPKR } from "../util/formatCurrency";
import { getCart, updateQty, removeFromCart, getCartSubtotal } from "../util/cart";
import { apiGet } from "../util/api";
import usePageMeta from "../util/usePageMeta";

export default function Cart() {
  usePageMeta({
    title: "Your Cart",
    description: "Review your selected curtain fabrics, blinds and interior products before checkout at Shafisons.",
    canonical: "/cart",
  });
  const [items, setItems] = useState([]);
  const [browseItems, setBrowseItems] = useState([]);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [discount, setDiscount] = useState(0);
  const [toast, setToast] = useState(null);

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
        const products = Array.isArray(list) ? list : [];
        setBrowseItems(products.slice(0, 3));
      })
      .catch(() => {
        if (!active) return;
        setBrowseItems([]);
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(null), 2500);
    return () => clearTimeout(id);
  }, [toast]);

  const subtotal = useMemo(() => getCartSubtotal(), [items]);
  const total = Math.max(0, subtotal - discount);

  const computeDiscount = (coupon, list) => {
    if (!coupon) return 0;
    const nonDealItems = list.filter((item) => !item.isDeal);
    let eligibleSubtotal = nonDealItems.reduce(
      (sum, item) => sum + (item.qty || 0) * (item.unitPrice || 0),
      0
    );

    if (!coupon.appliesToAll) {
      const allowed = new Set((coupon.productIds || []).map(String));
      eligibleSubtotal = nonDealItems.reduce((sum, item) => {
        if (allowed.has(String(item.id))) {
          return sum + (item.qty || 0) * (item.unitPrice || 0);
        }
        return sum;
      }, 0);
    }

    if (eligibleSubtotal <= 0) return 0;

    let discountAmount = 0;
    if (coupon.type === "percentage") {
      discountAmount = Math.round(eligibleSubtotal * (coupon.value / 100));
    } else {
      discountAmount = coupon.value;
    }

    return Math.min(discountAmount, eligibleSubtotal);
  };

  useEffect(() => {
    if (!appliedCoupon) {
      setDiscount(0);
      return;
    }
    const amount = computeDiscount(appliedCoupon, items);
    setDiscount(amount);
  }, [items, appliedCoupon]);

  const applyCoupon = async () => {
    if (!couponCode.trim()) {
      setToast({ type: "error", message: "Please enter a coupon code." });
      return;
    }

    try {
      const couponsRes = await apiGet("/api/coupons");
      const list = Array.isArray(couponsRes)
        ? couponsRes
        : Array.isArray(couponsRes?.value)
          ? couponsRes.value
          : [];

      const code = couponCode.trim().toLowerCase();
      const coupon = list.find((c) => String(c.code || "").toLowerCase() === code);

      if (!coupon) {
        setToast({ type: "error", message: "Invalid coupon code." });
        setAppliedCoupon(null);
        setDiscount(0);
        return;
      }

      if (!coupon.active) {
        setToast({ type: "error", message: "This coupon is not active." });
        setAppliedCoupon(null);
        setDiscount(0);
        return;
      }

      const now = Date.now();
      if (coupon.startDate && new Date(coupon.startDate).getTime() > now) {
        setToast({ type: "error", message: "This coupon is not active yet." });
        setAppliedCoupon(null);
        setDiscount(0);
        return;
      }
      if (coupon.endDate && new Date(coupon.endDate).getTime() < now) {
        setToast({ type: "error", message: "This coupon has expired." });
        setAppliedCoupon(null);
        setDiscount(0);
        return;
      }

      const discountAmount = computeDiscount(coupon, items);
      if (discountAmount <= 0) {
        setToast({ type: "error", message: "Coupon does not apply to these items." });
        setAppliedCoupon(null);
        setDiscount(0);
        return;
      }

      setAppliedCoupon(coupon);
      setDiscount(discountAmount);
      setToast({ type: "success", message: "Coupon applied successfully." });
    } catch {
      setToast({ type: "error", message: "Could not apply coupon. Try again." });
    }
  };

  const clearCoupon = () => {
    setAppliedCoupon(null);
    setDiscount(0);
    setCouponCode("");
  };

  return (
    <main className="cart-page">
      <section className="cart-section">
        <div className="container">
          <div className="cart-head">
            <h1 className="cart-title">Your Cart</h1>
            <p className="cart-sub">Review your selections and continue to secure checkout.</p>
          </div>

          {toast && <div className={`cart-toast ${toast.type}`}>{toast.message}</div>}

          {items.length === 0 ? (
            <div className="text-center cart-empty">
              <h3 className="fw-semibold text-dark">Your cart is empty</h3>
              <p className="text-muted">Start adding your favorite products.</p>
              <Link to="/shop" className="btn-dark mt-2 d-inline-block">Continue Shopping</Link>
            </div>
          ) : (
            <>
              <div className="cart-layout">
                <section>
                <div className="cart-lines">
                  {items.map((row) => (
                    <article className="cart-line" key={row.id}>
                      <div className="cart-line-img-wrap">
                        <img src={row.img} alt={row.title} className="cart-line-img" />
                      </div>

                      <div className="cart-line-main">
                        <h3 className="cart-line-title">{row.title}</h3>
                        {row.isDeal && <span className="cart-deal-badge">Deal item</span>}
                        {(row.size || row.color) && (
                          <div className="cart-line-variants">
                            {row.color && (
                              <span className="cart-line-variant">
                                {row.colorHex && <span style={{ display:'inline-block', width:10, height:10, borderRadius:'50%', background:row.colorHex, border:'1px solid #d8cebf', marginRight:4, verticalAlign:'middle' }} />}
                                {row.color}
                              </span>
                            )}
                            {row.size && <span className="cart-line-variant">Size: {row.size}</span>}
                          </div>
                        )}

                        <div className="cart-line-price-wrap">
                          <span className="cart-line-price">{formatPKR(row.unitPrice)}</span>
                          <span className="cart-line-price-unit">{row.priceUnit || 'per yard'}</span>
                          {row.originalPrice && row.originalPrice > row.unitPrice && (
                            <span className="cart-line-old-price">{formatPKR(row.originalPrice)}</span>
                          )}
                        </div>

                        <div className="cart-line-controls">
                          <div className="cart-qty">
                            <button
                              className="cart-qty-btn"
                              onClick={() => updateQty(row.id, Math.max(1, (row.qty || 1) - 1), row.size, row.color)}
                              aria-label="Decrease quantity"
                            >
                              -
                            </button>
                            <span className="cart-qty-num">{row.qty}</span>
                            <button
                              className="cart-qty-btn"
                              onClick={() => updateQty(row.id, (row.qty || 1) + 1, row.size, row.color)}
                              aria-label="Increase quantity"
                            >
                              +
                            </button>
                          </div>

                          <strong className="cart-line-total">{formatPKR((row.qty || 0) * (row.unitPrice || 0))}</strong>

                          <button className="cart-remove-btn" onClick={() => removeFromCart(row.id, row.size, row.color)}>
                            Remove
                          </button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>

                <div className="cart-bottom-row">
                  <button className="btn-dark" onClick={refresh}>Update Cart</button>
                  <Link to="/shop" className="btn btn-outline-dark">Continue Shopping</Link>
                </div>

                <div className="cart-coupon-block">
                  <h4 className="fw-semibold text-dark">Coupon</h4>
                  <p>Enter your coupon code if you have one.</p>
                  <div className="cart-coupon-row">
                    <input
                      type="text"
                      placeholder="Coupon Code"
                      className="form-control"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                    />
                    <button className="btn-dark" onClick={applyCoupon}>Apply Coupon</button>
                  </div>
                  {appliedCoupon && (
                    <div className="cart-coupon-chip">
                      <span>Applied: {appliedCoupon.code}</span>
                      <button onClick={clearCoupon}>Remove</button>
                    </div>
                  )}
                  <div className="cart-coupon-note">Coupon does not apply to grab deal items.</div>
                </div>
                </section>

                <aside className="cart-summary p-4">
                  <h3 className="border-bottom pb-3 fw-semibold text-dark">Order Summary</h3>
                  <div className="mt-3 small">
                    <div className="cart-total-line">
                      <span className="text-dark">Subtotal</span>
                      <strong className="text-dark">{formatPKR(subtotal)}</strong>
                    </div>
                    {discount > 0 && (
                      <div className="cart-total-line">
                        <span className="text-dark">Discount</span>
                        <strong className="text-dark">- {formatPKR(discount)}</strong>
                      </div>
                    )}
                    <div className="cart-total-line">
                      <span className="text-dark">Total</span>
                      <strong className="text-dark">{formatPKR(total)}</strong>
                    </div>
                  </div>
                  <Link to="/checkout" className="btn-dark mt-3 d-block text-center">Proceed To Checkout</Link>
                </aside>
              </div>

              {browseItems.length > 0 && (
                <section className="cart-browse">
                  <div className="cart-browse-head">
                    <h3 className="cart-browse-title">Browse More</h3>
                    <Link to="/shop" className="cart-browse-link">See All Products</Link>
                  </div>

                  <div className="cart-browse-grid">
                    {browseItems.map((item) => (
                      <Link to={`/shop/${item._id}`} key={item._id} className="cart-browse-card">
                        <div className="cart-browse-img-wrap">
                          <img src={item.img} alt={item.title} className="cart-browse-img" />
                        </div>
                        <p className="cart-browse-name">{item.title}</p>
                        <strong className="cart-browse-price">{formatPKR(item.price)}</strong>
                      </Link>
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
