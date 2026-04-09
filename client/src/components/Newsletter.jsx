import { useState } from "react";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) setSent(true);
  };

  return (
    <section className="newsletter-section section-pad">
      <div className="container">
        <div className="newsletter-inner">
          <div className="row align-items-center g-4">
            <div className="col-lg-6">
              <span className="section-label">Newsletter</span>
              <h2 className="fs-2 fw-bold text-dark mt-2 mb-2">
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
                    type="email"
                    className="form-control newsletter-input"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <button type="submit" className="btn-brand newsletter-btn">
                    Subscribe
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
