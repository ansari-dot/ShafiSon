import { useState } from "react";
import { apiGet } from "../util/api";

export default function TrackOrder() {
  const [orderId, setOrderId] = useState("");
  const [phone, setPhone] = useState("");
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const steps = [
    { title: "Order Placed", status: "Pending" },
    { title: "Processing", status: "Confirmed" },
    { title: "Shipped", status: "Shipped" },
    { title: "Out for Delivery", status: "Shipped" },
    { title: "Delivered", status: "Delivered" },
  ];

  const statusIndex = (status) => {
    const map = {
      Pending: 0,
      Confirmed: 1,
      Shipped: 3,
      Delivered: 4,
      Cancelled: -1,
    };
    return map[status] ?? 0;
  };

  const handleTrack = async () => {
    setError("");
    setLoading(true);
    try {
      const data = await apiGet(`/api/orders/${orderId.trim()}`);
      if (phone && data?.customer?.phone && String(phone).trim() !== String(data.customer.phone).trim()) {
        setError("Phone number does not match this order.");
        setOrder(null);
      } else {
        setOrder(data);
      }
    } catch (err) {
      setError(err?.message || "Order not found");
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  const currentIndex = statusIndex(order?.status || "Pending");
  const progressPct = currentIndex < 0 ? 0 : Math.min(100, (currentIndex / 4) * 100);

  return (
    <main className="track-page">
      <section className="track-hero">
        <div className="container">
          <div className="track-hero-inner">
            <div>
              <span className="section-label">Track Order</span>
              <h1 className="track-title">Track Your Delivery in Real Time</h1>
              <p className="track-subtitle">
                Enter your order ID and phone number to see the latest delivery status and timeline.
              </p>
            </div>
            <div className="track-hero-card">
              <div className="track-hero-label">Support</div>
              <h3>Need Help?</h3>
              <p>Our team is ready to help you with any delivery updates.</p>
              <a className="track-hero-link" href="/contact">Contact Support</a>
            </div>
          </div>
        </div>
      </section>

      <section className="section-pad">
        <div className="container">
          <div className="track-card">
            <div className="track-form">
              <h3>Find Your Order</h3>
              <p className="track-form-sub">Use the same phone number you used during checkout.</p>
              <div className="track-field">
                <label>Order ID</label>
                <input
                  type="text"
                  placeholder="e.g. SHF-2026-1042"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                />
              </div>
              <div className="track-field">
                <label>Phone Number</label>
                <input
                  type="tel"
                  placeholder="03XX-XXXXXXX"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              <button className="btn-brand track-btn" onClick={handleTrack} disabled={loading}>
                {loading ? "Checking..." : "Track Order"}
              </button>
              <div className="track-secure">Your data is safe and encrypted.</div>
              {error && <div className="track-error">{error}</div>}
            </div>

            <div className="track-status">
              <div className="track-status-head">
                <div>
                  <h3>Tracking Status</h3>
                  <p className="track-status-sub">
                    {order ? `Order #${order.orderCode} · ${order.customer?.city || ""}` : "Enter your order details"}
                  </p>
                </div>
                <span className="track-pill">{order?.status || "Pending"}</span>
              </div>

              <div className="track-progress">
                <div className="track-progress-bar" style={{ width: `${progressPct}%` }} />
              </div>
              <div className="track-progress-labels">
                <span>Placed</span>
                <span>Processing</span>
                <span>Shipped</span>
                <span>Out</span>
                <span>Delivered</span>
              </div>

              <div className="track-timeline">
                {steps.map((step, idx) => (
                  <div className="track-step" key={step.title}>
                    <div className={`track-dot ${currentIndex >= idx ? "active" : ""}`}>
                      <span></span>
                    </div>
                    <div className="track-info">
                      <h4>{step.title}</h4>
                      <p>{order ? (currentIndex >= idx ? "Completed" : "Pending") : "Waiting"}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="track-note">
                Updates refresh automatically when your order moves to the next stage.
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
