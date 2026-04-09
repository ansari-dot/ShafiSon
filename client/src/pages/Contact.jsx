import { useState } from "react";
import { Link } from "react-router-dom";
import { apiPost } from "../util/api";

/* ── Icons ── */
const ChevronIcon = () => (
  <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
  </svg>
);
const LocationIcon = () => (
  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 0 1-2.827 0l-4.244-4.243a8 8 0 1 1 11.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
  </svg>
);
const EmailIcon = () => (
  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 0 0 2.22 0L21 8M5 19h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2z" />
  </svg>
);
const PhoneIcon = () => (
  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 0 1 2-2h3.28a1 1 0 0 1 .948.684l1.498 4.493a1 1 0 0 1-.502 1.21l-2.257 1.13a11.042 11.042 0 0 0 5.516 5.516l1.13-2.257a1 1 0 0 1 1.21-.502l4.493 1.498a1 1 0 0 1 .684.949V19a2 2 0 0 1-2 2h-1C9.716 21 3 14.284 3 6V5z" />
  </svg>
);
const ClockIcon = () => (
  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
    <circle cx="12" cy="12" r="10" strokeLinecap="round" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" />
  </svg>
);
const CheckIcon = () => (
  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);
const SendIcon = () => (
  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
  </svg>
);

const contactInfo = [
  {
    icon: <LocationIcon />,
    label: "Visit Us",
    value: "43 Raymouth Rd.",
    sub: "London, UK 3910",
  },
  {
    icon: <EmailIcon />,
    label: "Email Us",
    value: "hello@furni.com",
    sub: "We reply within 24 hours",
  },
  {
    icon: <PhoneIcon />,
    label: "Call Us",
    value: "+1 (294) 392-5393",
    sub: "Mon – Fri, 9am – 6pm",
  },
  {
    icon: <ClockIcon />,
    label: "Working Hours",
    value: "Mon – Fri: 9am – 6pm",
    sub: "Sat: 10am – 4pm",
  },
];

const topics = [
  "Order & Shipping",
  "Product Inquiry",
  "Returns & Refunds",
  "Custom Order",
  "Partnership",
  "Other",
];

export default function Contact() {
  const [form, setForm]   = useState({ firstName: "", lastName: "", email: "", phone: "", topic: "", message: "" });
  const [sent, setSent]   = useState(false);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const validate = () => {
    const e = {};
    if (!form.firstName.trim()) e.firstName = "Required";
    if (!form.lastName.trim())  e.lastName  = "Required";
    if (!form.email.trim())     e.email     = "Required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Invalid email";
    if (!form.message.trim())   e.message   = "Required";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const e2 = validate();
    if (Object.keys(e2).length) { setErrors(e2); return; }
    setSubmitting(true);
    setSubmitError("");
    try {
      await apiPost("/api/contacts", form);
      setSent(true);
      setForm({ firstName: "", lastName: "", email: "", phone: "", topic: "", message: "" });
    } catch (err) {
      setSubmitError(err?.message || "Failed to send message. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (field, val) => {
    setForm(f => ({ ...f, [field]: val }));
    setErrors(e => ({ ...e, [field]: undefined }));
  };

  return (
    <main className="ct-page">
      <div className="container">

        {/* Breadcrumb */}
        <nav className="pd-breadcrumb ct-breadcrumb">
          <Link to="/">Home</Link>
          <ChevronIcon />
          <span>Contact Us</span>
        </nav>

        {/* Page header */}
        <div className="ct-header">
          <div>
            <span className="section-label">Get in Touch</span>
            <h1 className="ct-title">We'd Love to Hear From You</h1>
            <p className="ct-subtitle">
              Have a question about an order, a product, or just want to say hello?
              Our team is here to help.
            </p>
          </div>
        </div>

        {/* Main grid */}
        <div className="ct-grid">

          {/* ── Left: Info ── */}
          <div className="ct-info-col">

            {/* Contact cards */}
            <div className="ct-info-cards">
              {contactInfo.map((item, i) => (
                <div className="ct-info-card" key={i}>
                  <div className="ct-info-icon">{item.icon}</div>
                  <div>
                    <span className="ct-info-label">{item.label}</span>
                    <strong className="ct-info-value">{item.value}</strong>
                    <span className="ct-info-sub">{item.sub}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Map placeholder */}
            <div className="ct-map">
              <iframe
                title="Furni Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2483.3!2d-0.1276!3d51.5074!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNTHCsDMwJzI2LjYiTiAwwrAwNyc0MC4wIlc!5e0!3m2!1sen!2suk!4v1234567890"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

          </div>

          {/* ── Right: Form ── */}
          <div className="ct-form-col">
            {sent ? (
              <div className="ct-success">
                <div className="ct-success-icon"><CheckIcon /></div>
                <h3 className="ct-success-title">Message Sent!</h3>
                <p className="ct-success-desc">
                  Thanks for reaching out. We'll get back to you within 24 hours.
                </p>
                <button className="ct-success-btn" onClick={() => { setSent(false); }}>
                  Send Another Message
                </button>
              </div>
            ) : (
              <form className="ct-form" onSubmit={handleSubmit} noValidate>
                <div className="ct-form-header">
                  <h2 className="ct-form-title">Send a Message</h2>
                  <p className="ct-form-sub">Fill in the form and we'll be in touch shortly.</p>
                </div>

                <div className="ct-form-body">
                  {/* Name row */}
                  <div className="ct-form-row">
                    <div className="ct-field">
                      <label className="ct-label">First Name <span className="ct-required">*</span></label>
                      <input
                        className={`ct-input ${errors.firstName ? "ct-input-error" : ""}`}
                        placeholder="John"
                        value={form.firstName}
                        onChange={e => handleChange("firstName", e.target.value)}
                      />
                      {errors.firstName && <span className="ct-error-msg">{errors.firstName}</span>}
                    </div>
                    <div className="ct-field">
                      <label className="ct-label">Last Name <span className="ct-required">*</span></label>
                      <input
                        className={`ct-input ${errors.lastName ? "ct-input-error" : ""}`}
                        placeholder="Doe"
                        value={form.lastName}
                        onChange={e => handleChange("lastName", e.target.value)}
                      />
                      {errors.lastName && <span className="ct-error-msg">{errors.lastName}</span>}
                    </div>
                  </div>

                  {/* Email + Phone */}
                  <div className="ct-form-row">
                    <div className="ct-field">
                      <label className="ct-label">Email Address <span className="ct-required">*</span></label>
                      <input
                        type="email"
                        className={`ct-input ${errors.email ? "ct-input-error" : ""}`}
                        placeholder="john@example.com"
                        value={form.email}
                        onChange={e => handleChange("email", e.target.value)}
                      />
                      {errors.email && <span className="ct-error-msg">{errors.email}</span>}
                    </div>
                    <div className="ct-field">
                      <label className="ct-label">Phone <span className="ct-optional">(optional)</span></label>
                      <input
                        type="tel"
                        className="ct-input"
                        placeholder="+1 234 567 890"
                        value={form.phone}
                        onChange={e => handleChange("phone", e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Topic */}
                  <div className="ct-field">
                    <label className="ct-label">Topic</label>
                    <div className="ct-topic-grid">
                      {topics.map(t => (
                        <button
                          type="button"
                          key={t}
                          className={`ct-topic-btn ${form.topic === t ? "active" : ""}`}
                          onClick={() => handleChange("topic", t)}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Message */}
                  <div className="ct-field">
                    <label className="ct-label">Message <span className="ct-required">*</span></label>
                    <textarea
                      className={`ct-input ct-textarea ${errors.message ? "ct-input-error" : ""}`}
                      placeholder="Tell us how we can help you..."
                      rows="5"
                      value={form.message}
                      onChange={e => handleChange("message", e.target.value)}
                    />
                    {errors.message && <span className="ct-error-msg">{errors.message}</span>}
                  </div>

                  {submitError && <span className="ct-error-msg">{submitError}</span>}
                  <button type="submit" className="ct-submit-btn" disabled={submitting}>
                    <SendIcon />
                    {submitting ? "Sending..." : "Send Message"}
                  </button>
                </div>
              </form>
            )}
          </div>

        </div>

        {/* FAQ strip */}
        <div className="ct-faq-strip">
          <p className="ct-faq-text">Looking for quick answers?</p>
          <Link to="/" className="ct-faq-link">Browse our FAQ →</Link>
        </div>

      </div>
    </main>
  );
}
