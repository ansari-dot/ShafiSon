import Hero from "../components/Hero";
import { Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { formatPKR } from "../util/formatCurrency";
import { getCart, updateQty, removeFromCart, getCartSubtotal } from "../util/cart";
import { apiGet } from "../util/api";

export default function Cart() {
  const [items, setItems] = useState([]);
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
    if (!toast) return;
    const id = setTimeout(() => setToast(null), 2500);
    return () => clearTimeout(id);
  }, [toast]);

  const subtotal = useMemo(() => getCartSubtotal(), [items]);
  const total = Math.max(0, subtotal - discount);

  const computeDiscount = (coupon, list, sub) => {
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
    const amount = computeDiscount(appliedCoupon, items, subtotal);
    setDiscount(amount);
  }, [items, appliedCoupon, subtotal]);

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

      const discountAmount = computeDiscount(coupon, items, subtotal);
      if (discountAmount <= 0) {
        setToast({ type: "error", message: "Coupon does not apply to these items." });
        setAppliedCoupon(null);
        setDiscount(0);
        return;
      }

      setAppliedCoupon(coupon);
      setDiscount(discountAmount);
      setToast({ type: "success", message: "Coupon applied successfully." });
    } catch (err) {
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
      <Hero title="Cart" />

      <section className="section-pad">
        <div className="container">
          {toast && (
            <div className={`cart-toast ${toast.type}`}>{toast.message}</div>
          )}

          {items.length === 0 ? (
            <div className="text-center cart-empty">
              <h3 className="fw-semibold text-dark">Your cart is empty</h3>
              <p className="text-muted">Start adding your favorite products.</p>
              <Link to="/shop" className="btn-dark mt-2 d-inline-block">Continue Shopping</Link>
            </div>
          ) : (
            <>
              <div className="table-responsive bg-white rounded-3">
                <table className="table text-center">
                  <thead className="border-bottom">
                    <tr className="text-sm text-dark">
                      {[
                        "Image",
                        "Product",
                        "Price",
                        "Quantity",
                        "Total",
                        "Remove",
                      ].map((head) => (
                        <th key={head} className="py-4 fw-semibold">
                          {head}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((row) => (
                      <tr key={row.id}>
                        <td className="py-4">
                          <img src={row.img} alt={row.title} width="120" />
                        </td>
                        <td className="py-4 text-dark">
                          {row.title}
                          {row.isDeal && <span className="cart-deal-badge">Deal item</span>}
                        </td>
                        <td className="py-4 text-dark">
                          {formatPKR(row.unitPrice)}
                          {row.originalPrice && row.originalPrice > row.unitPrice && (
                            <div style={{ textDecoration: "line-through", color: "#9ca3af", fontSize: "0.8rem" }}>
                              {formatPKR(row.originalPrice)}
                            </div>
                          )}
                        </td>
                        <td className="py-4">
                          <div className="d-flex align-items-center justify-content-center gap-2">
                            <button
                              className="btn btn-outline-secondary btn-sm"
                              onClick={() => updateQty(row.id, Math.max(1, (row.qty || 1) - 1))}
                            >
                              -
                            </button>
                            <input
                              className="form-control form-control-sm text-center"
                              value={row.qty}
                              readOnly
                              style={{ width: 60 }}
                            />
                            <button
                              className="btn btn-outline-secondary btn-sm"
                              onClick={() => updateQty(row.id, (row.qty || 1) + 1)}
                            >
                              +
                            </button>
                          </div>
                        </td>
                        <td className="py-4 text-dark">{formatPKR((row.qty || 0) * (row.unitPrice || 0))}</td>
                        <td className="py-4">
                          <button className="btn btn-dark btn-sm" onClick={() => removeFromCart(row.id)}>X</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="row g-4 mt-4">
                <div className="col-lg-7">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <button className="btn-dark w-100" onClick={refresh}>Update Cart</button>
                    </div>
                    <div className="col-md-6">
                      <Link to="/shop" className="btn btn-outline-dark w-100">Continue Shopping</Link>
                    </div>
                  </div>
                  <div className="mt-4">
                    <h4 className="fw-semibold text-dark">Coupon</h4>
                    <p>Enter your coupon code if you have one.</p>
                    <div className="row g-2">
                      <div className="col-md-8">
                        <input
                          type="text"
                          placeholder="Coupon Code"
                          className="form-control"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value)}
                        />
                      </div>
                      <div className="col-md-4">
                        <button className="btn-dark w-100" onClick={applyCoupon}>Apply Coupon</button>
                      </div>
                    </div>
                    {appliedCoupon && (
                      <div className="cart-coupon-chip">
                        <span>Applied: {appliedCoupon.code}</span>
                        <button onClick={clearCoupon}>Remove</button>
                      </div>
                    )}
                    <div className="cart-coupon-note">Coupon does not apply to grab deal items.</div>
                  </div>
                </div>

                <div className="col-lg-5">
                  <div className="bg-white p-4 rounded-3 cart-summary">
                    <h3 className="border-bottom pb-3 fw-semibold text-dark">
                      Cart Totals
                    </h3>
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
                    <Link to="/checkout" className="btn-dark mt-3 d-block text-center">
                      Proceed To Checkout
                    </Link>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </section>
    </main>
  );
}
