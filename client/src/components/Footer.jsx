import { useState } from "react";
import { Link } from "react-router-dom";
import { apiPost } from "../util/api";

export default function Footer() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [saving, setSaving] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubscribe = async (e) => {
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

  const footerLinks = [
    [
      { label: "About us", to: "/about" },
      { label: "Contact us", to: "/contact" },
    ],
    [
      { label: "Support", to: "/contact" },
      { label: "Knowledge base", to: "#" },
      { label: "Live chat", to: "#" },
    ],
    [
      { label: "Jobs", to: "#" },
      { label: "Our team", to: "/about" },
      { label: "Leadership", to: "/about" },
      { label: "Privacy Policy", to: "#" },
    ],
    [
      { label: "Nordic Chair", to: "/shop" },
      { label: "Kruzo Aero", to: "/shop" },
      { label: "Ergonomic Chair", to: "/shop" },
    ],
  ];

  return (
    <footer className="footer">
      <div className="container position-relative">
        <div className="mb-5">
          <h3 className="d-flex align-items-center gap-2 text-brand fs-5 fw-medium">
            <img src="/images/envelope-outline.svg" alt="Envelope" width="20" height="20" />
            <span>Subscribe to Newsletter</span>
          </h3>
          {sent ? (
            <div className="small text-success mt-2">Thanks for subscribing. You are added successfully.</div>
          ) : (
          <form className="footer-newsletter-form" onSubmit={handleSubscribe}>
            <input
              type="text"
              className="form-control"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <input
              type="email"
              className="form-control"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button className="btn-brand" type="submit" disabled={saving}>
              <span className="fa fa-paper-plane"></span>
            </button>
          </form>
          )}
          {error && <div className="small text-danger mt-2">{error}</div>}
        </div>

        <div className="row g-5">
          <div className="col-lg-4">
            <a href="#" className="fs-2 fw-medium text-brand">
              Shafi Sons
            </a>
            <p className="mt-4">
              Donec facilisis quam ut purus rutrum lobortis. Donec vitae odio
              quis nisl dapibus malesuada. Nullam ac aliquet velit. Aliquam
              vulputate velit imperdiet dolor tempor tristique. Pellentesque
              habitant
            </p>
            <ul className="list-unstyled d-flex gap-2 mt-4 footer-social">
              {["facebook-f", "twitter", "instagram", "linkedin"].map((icon) => (
                <li key={icon}>
                  <a href="#">
                    <span className={`fa fa-brands fa-${icon}`}></span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-lg-8">
            <div className="row">
              {footerLinks.map((group, idx) => (
                <div className="col-6 col-md-3" key={idx}>
                  <ul className="list-unstyled">
                    {group.map((item) => (
                      <li key={item.label} className="mb-2">
                        <Link to={item.to}>{item.label}</Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="border-top mt-4 pt-4">
          <div className="row">
            <div className="col-lg-6 text-center text-lg-start">
              <p className="mb-2">
                Copyright &copy; {new Date().getFullYear()}. All Rights Reserved.
                &mdash; Shafi Sons Furniture
              </p>
            </div>
            <div className="col-lg-6 text-center text-lg-end">
              <ul className="list-unstyled d-inline-flex gap-4 mb-0">
                <li>
                  <a href="#">Terms &amp; Conditions</a>
                </li>
                <li>
                  <a href="#">Privacy Policy</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
