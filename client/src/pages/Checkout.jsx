import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { formatPKR } from "../util/formatCurrency";
import { getCart } from "../util/cart";
import { apiPost } from "../util/api";

export default function Checkout() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [items, setItems] = useState([]);
  const [couponCode, setCouponCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    country: "",
    firstName: "",
    lastName: "",
    company: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    postalCode: "",
    email: "",
    phone: "",
    notes: "",
  });

  useEffect(() => {
    setItems(getCart());
  }, []);

  useEffect(() => {
    if (searchParams.get("cancel") === "1") {
      setError("Payment was cancelled. Please try again.");
    }
  }, [searchParams]);

  const subtotal = useMemo(
    () => items.reduce((sum, i) => sum + (i.qty || 0) * (i.unitPrice || 0), 0),
    [items]
  );

  const handleChange = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
  };

  const handlePay = async () => {
    if (items.length === 0) {
      setError("Your cart is empty.");
      return;
    }
    if (!form.firstName || !form.lastName || !form.email || !form.phone || !form.address1) {
      setError("Please fill the required billing details.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const payload = {
        cartItems: items.map((i) => ({
          productId: i.id,
          title: i.title,
          qty: i.qty,
          unitPrice: i.unitPrice,
        })),
        customer: {
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          phone: form.phone,
          address1: form.address1,
          address2: form.address2,
          city: form.city,
          state: form.state,
          postalCode: form.postalCode,
          country: form.country,
          notes: form.notes,
        },
        couponCode: couponCode.trim(),
      };
      const res = await apiPost("/api/payments/payfast/init", payload);
      const formEl = document.createElement("form");
      formEl.method = "POST";
      formEl.action = res.payment_url;
      Object.entries(res.fields || {}).forEach(([k, v]) => {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = k;
        input.value = String(v);
        formEl.appendChild(input);
      });
      document.body.appendChild(formEl);
      formEl.submit();
    } catch (err) {
      setError(err?.message || "Failed to start payment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main>
      <section className="section-pad checkout-page">
        <div className="container">
          {error && <div className="alert alert-danger mb-4 checkout-alert">{error}</div>}

          <div className="row g-4 align-items-start">
            <div className="col-12 col-lg-6">
              <div className="checkout-panel">
                <div className="checkout-panel-head">
                  <p className="checkout-kicker">Secure Checkout</p>
                  <h2 className="checkout-title">Billing Details</h2>
                  <p className="checkout-sub">Please enter your shipping and contact details.</p>
                </div>
                <div className="row g-3">
                  <div className="col-12">
                    <label className="form-label">Country *</label>
                    <input className="form-control" value={form.country} onChange={handleChange("country")} />
                  </div>
                  <div className="col-sm-6">
                    <label className="form-label">First Name *</label>
                    <input className="form-control" value={form.firstName} onChange={handleChange("firstName")} />
                  </div>
                  <div className="col-sm-6">
                    <label className="form-label">Last Name *</label>
                    <input className="form-control" value={form.lastName} onChange={handleChange("lastName")} />
                  </div>
                  <div className="col-12">
                    <label className="form-label">Company Name</label>
                    <input className="form-control" value={form.company} onChange={handleChange("company")} />
                  </div>
                  <div className="col-12">
                    <label className="form-label">Address *</label>
                    <input className="form-control" placeholder="Street address" value={form.address1} onChange={handleChange("address1")} />
                  </div>
                  <div className="col-12">
                    <input className="form-control" placeholder="Apartment, suite, unit etc. (optional)" value={form.address2} onChange={handleChange("address2")} />
                  </div>
                  <div className="col-sm-6">
                    <label className="form-label">City *</label>
                    <input className="form-control" value={form.city} onChange={handleChange("city")} />
                  </div>
                  <div className="col-sm-6">
                    <label className="form-label">State / Country *</label>
                    <input className="form-control" value={form.state} onChange={handleChange("state")} />
                  </div>
                  <div className="col-sm-6">
                    <label className="form-label">Postal / Zip *</label>
                    <input className="form-control" value={form.postalCode} onChange={handleChange("postalCode")} />
                  </div>
                  <div className="col-sm-6">
                    <label className="form-label">Email *</label>
                    <input className="form-control" value={form.email} onChange={handleChange("email")} />
                  </div>
                  <div className="col-sm-6">
                    <label className="form-label">Phone *</label>
                    <input className="form-control" placeholder="Phone Number" value={form.phone} onChange={handleChange("phone")} />
                  </div>
                  <div className="col-12">
                    <label className="form-label">Order Notes</label>
                    <textarea rows="5" className="form-control" placeholder="Write your notes here..." value={form.notes} onChange={handleChange("notes")} />
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-6">
              <div className="mb-4">
                <div className="checkout-panel">
                  <h2 className="checkout-title checkout-title-sm">Coupon Code</h2>
                  <label className="form-label">Enter your coupon code if you have one</label>
                  <div className="row g-2">
                    <div className="col-md-8">
                      <input className="form-control" placeholder="Coupon Code" value={couponCode} onChange={(e) => setCouponCode(e.target.value)} />
                    </div>
                    <div className="col-md-4">
                      <button className="btn-dark w-100 checkout-btn-muted" type="button">Apply</button>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <div className="checkout-panel checkout-order-panel">
                  <h2 className="checkout-title checkout-title-sm">Your Order</h2>

                  <div className="checkout-order-list">
                    {items.map((row) => (
                      <div key={row.id} className="checkout-order-row">
                        <div>
                          <p className="checkout-order-name">{row.title}</p>
                          <p className="checkout-order-qty">Qty: {row.qty}</p>
                        </div>
                        <p className="checkout-order-price">{formatPKR((row.qty || 0) * (row.unitPrice || 0))}</p>
                      </div>
                    ))}
                    {items.length === 0 && (
                      <div className="checkout-empty">No items in cart yet.</div>
                    )}
                  </div>

                  <div className="checkout-totals">
                    <div className="checkout-total-row">
                      <span>Cart Subtotal</span>
                      <strong>{formatPKR(subtotal)}</strong>
                    </div>
                    <div className="checkout-total-row checkout-total-row-final">
                      <span>Order Total</span>
                      <strong>{formatPKR(subtotal)}</strong>
                    </div>
                  </div>

                  <div className="checkout-actions">
                    <Link to="/shop" className="btn btn-outline-dark w-100">Back to Shop</Link>
                    <button className="btn-dark w-100 checkout-pay-btn" onClick={handlePay} disabled={loading}>
                      {loading ? "Redirecting..." : "Proceed to PayFast"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
