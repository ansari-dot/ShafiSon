import { useState } from "react";
import { apiPost } from "../util/api";

export default function Newsletter() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    setSaving(true);
    setError("");
    try {
      await apiPost("/api/subscribers", { name, email });
      setSent(true);
      setName("");
      setEmail("");
    } catch (err) {
      setError(err?.message || "Failed to subscribe");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="newsletter-section section-pad">
      <div className="container">
        <div className="newsletter-inner">
          <div className="row align-items-center g-4">
            <div className="col-lg-6">
              <span className="section-label">Newsletter</span>
              <h2 className="fs-2 fw-bold mt-2 mb-2">
                Get Inspired. Stay Updated.
              </h2>
              <p className="mb-0">
                Subscribe for exclusive deals, interior design tips, and new arrivals
                delivered straight to your inbox.
              </p>
            </div>
            <div className="col-lg-6">
              {sent ? (
                <div className="newsletter-success">
                  <span>🎉</span>
                  <p className="mb-0 fw-semibold text-dark">
                    Thanks for subscribing! Check your inbox for a welcome gift.
                  </p>
                </div>
              ) : (
                <form className="newsletter-form" onSubmit={handleSubmit}>
                  <input
                    type="text"
                    className="form-control newsletter-input"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                  <input
                    type="email"
                    className="form-control newsletter-input"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <button type="submit" className="btn-brand newsletter-btn" disabled={saving}>
                    {saving ? "Subscribing..." : "Subscribe"}
                  </button>
                  {error && <p className="mb-0 mt-2 text-danger small">{error}</p>}
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
