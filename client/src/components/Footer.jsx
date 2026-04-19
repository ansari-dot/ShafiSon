import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { apiPost, apiGet } from "../util/api";
import indexLogo from "../assets/index-logo.png";

const FacebookIcon = () => (
  <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);
const InstagramIcon = () => (
  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
  </svg>
);
const WhatsAppIcon = () => (
  <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
  </svg>
);
const LocationIcon = () => (
  <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 0 1-2.827 0l-4.244-4.243a8 8 0 1 1 11.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
  </svg>
);
const PhoneIcon = () => (
  <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 0 1 2-2h3.28a1 1 0 0 1 .948.684l1.498 4.493a1 1 0 0 1-.502 1.21l-2.257 1.13a11.042 11.042 0 0 0 5.516 5.516l1.13-2.257a1 1 0 0 1 1.21-.502l4.493 1.498a1 1 0 0 1 .684.949V19a2 2 0 0 1-2 2h-1C9.716 21 3 14.284 3 6V5z" />
  </svg>
);
const EmailIcon = () => (
  <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 0 0 2.22 0L21 8M5 19h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2z" />
  </svg>
);
const SendIcon = () => (
  <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
  </svg>
);

export default function Footer() {
  const [email, setEmail] = useState("");
  const [saving, setSaving] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [categories, setCategories] = useState([]);

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await apiGet("/api/categories");
        // Get first 6 categories for footer
        setCategories(response.slice(0, 6));
      } catch (err) {
        console.error("Failed to fetch categories:", err);
        // Fallback to default categories if API fails
        setCategories([
          { name: "Curtain Fabrics", slug: "curtain-fabrics" },
          { name: "Blinds & Shades", slug: "blinds-shades" },
          { name: "Sofa Fabrics", slug: "sofa-fabrics" },
          { name: "Floor Seating", slug: "floor-seating" },
          { name: "Upholstery", slug: "upholstery" },
          { name: "Home Decor", slug: "home-decor" }
        ]);
      }
    };

    fetchCategories();
  }, []);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSaving(true);
    setError("");
    try {
      await apiPost("/api/subscribers", { name: email, email });
      setSent(true);
      setEmail("");
    } catch (err) {
      setError(err?.message || "Failed to subscribe. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <footer className="footer-pro footer">
      <div className="container">

        {/* ── Main Grid ── */}
        <div className="row g-5 py-4">

          {/* Brand column */}
          <div className="col-lg-4 col-md-6">
            <Link to="/" className="d-inline-block mb-3">
              <img src={indexLogo} alt="Shafisons" style={{ height: 110, width: "auto", maxWidth: 260, objectFit: "contain" }} />
            </Link>
            <p className="mb-4" style={{ fontSize: 13.5, lineHeight: 1.8, maxWidth: 320 }}>
              Premium curtain fabrics, custom drapery, modern blinds, floor seating &amp; upholstery
              solutions — crafted with care since 1975. Trusted by 15,000+ homes and offices across Pakistan.
            </p>

            {/* Contact info */}
            <ul className="list-unstyled mb-4" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <li style={{ display: "flex", alignItems: "flex-start", gap: 9, fontSize: 13 }}>
                <span style={{ color: "var(--brand)", marginTop: 2, flexShrink: 0 }}><LocationIcon /></span>
                <span>Jinnah Road Showroom, Quetta, Pakistan</span>
              </li>
              <li style={{ display: "flex", alignItems: "center", gap: 9, fontSize: 13 }}>
                <span style={{ color: "var(--brand)", flexShrink: 0 }}><PhoneIcon /></span>
                <a href="tel:+92811234567" style={{ color: "inherit" }}>+92 81 123 4567</a>
              </li>
              <li style={{ display: "flex", alignItems: "center", gap: 9, fontSize: 13 }}>
                <span style={{ color: "var(--brand)", flexShrink: 0 }}><EmailIcon /></span>
                <a href="mailto:support@shafisons.com" style={{ color: "inherit" }}>support@shafisons.com</a>
              </li>
            </ul>

            {/* Social */}
            <ul className="list-unstyled d-flex gap-2 mb-0 footer-social">
              <li>
                <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook">
                  <FacebookIcon />
                </a>
              </li>
              <li>
                <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram">
                  <InstagramIcon />
                </a>
              </li>
              <li>
                <a href="https://wa.me/92811234567" target="_blank" rel="noreferrer" aria-label="WhatsApp">
                  <WhatsAppIcon />
                </a>
              </li>
            </ul>
          </div>

          {/* Shop column */}
          <div className="col-6 col-lg-2 col-md-3">
            <h4 className="footer-head">Shop</h4>
            <ul className="list-unstyled footer-links">
              <li><Link to="/shop">All Products</Link></li>
              {categories.map((category, index) => (
                <li key={index}>
                  <Link to={`/shop?category=${encodeURIComponent(category.name || category.slug)}`}>
                    {category.name}
                  </Link>
                </li>
              ))}
              <li><Link to="/shop?deal=1">Current Deals</Link></li>
            </ul>
          </div>

          {/* Company column */}
          <div className="col-6 col-lg-2 col-md-3">
            <h4 className="footer-head">Company</h4>
            <ul className="list-unstyled footer-links">
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/about">Our Story</Link></li>
              <li><Link to="/about">Our Team</Link></li>
              <li><Link to="/contact">Contact Us</Link></li>
              <li><Link to="/contact">Store Locator</Link></li>
            </ul>
          </div>

          {/* Help column */}
          <div className="col-6 col-lg-2 col-md-3">
            <h4 className="footer-head">Help</h4>
            <ul className="list-unstyled footer-links">
              <li><Link to="/track">Track My Order</Link></li>
              <li><Link to="/cart">My Cart</Link></li>
              <li><Link to="/wishlist">My Wishlist</Link></li>
              <li><Link to="/return-refund">Returns &amp; Refunds</Link></li>
              <li><Link to="/consultation">Book Consultation</Link></li>
            </ul>
          </div>

          {/* Hours column */}
          <div className="col-6 col-lg-2 col-md-3">
            <h4 className="footer-head">Store Hours</h4>
            <ul className="list-unstyled footer-links" style={{ fontSize: 13 }}>
              <li style={{ marginBottom: 6 }}>
                <span style={{ fontWeight: 600, color: "var(--dark)", display: "block" }}>Mon – Fri</span>
                9:00 am – 6:00 pm
              </li>
              <li style={{ marginBottom: 6 }}>
                <span style={{ fontWeight: 600, color: "var(--dark)", display: "block" }}>Saturday</span>
                10:00 am – 4:00 pm
              </li>
              <li>
                <span style={{ fontWeight: 600, color: "var(--dark)", display: "block" }}>Sunday</span>
                Closed
              </li>
            </ul>
            <div style={{ marginTop: 16, padding: "10px 14px", background: "rgba(46,13,16,0.05)", borderLeft: "3px solid var(--brand)", fontSize: 12, lineHeight: 1.6 }}>
              <strong style={{ color: "var(--dark)", display: "block", marginBottom: 2 }}>Free Delivery</strong>
              On orders above PKR 10,000 within Quetta.
            </div>
          </div>

        </div>

        {/* ── Bottom bar ── */}
        <div className="footer-pro-bottom">
          <p style={{ margin: 0, fontSize: 13, color: "var(--muted)" }}>
            &copy; {new Date().getFullYear()} Shafisons. All rights reserved. Crafting interiors since 1975.
          </p>
          <div className="footer-pro-policy">
            <Link to="/return-refund" style={{ fontSize: 13, color: "var(--muted)" }}>Return & Refund Policy</Link>
            <Link to="/privacy-policy" style={{ fontSize: 13, color: "var(--muted)" }}>Privacy Policy</Link>
            <Link to="/terms-conditions" style={{ fontSize: 13, color: "var(--muted)" }}>Terms &amp; Conditions</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
