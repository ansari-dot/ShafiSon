import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { apiPost } from "../util/api";

const CalendarIcon = () => (
  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
    <line x1="16" y1="2" x2="16" y2="6"/>
    <line x1="8" y1="2" x2="8" y2="6"/>
    <line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);

const ClockIcon = () => (
  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10"/>
    <polyline points="12,6 12,12 16,14"/>
  </svg>
);

const UserIcon = () => (
  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
);

const PhoneIcon = () => (
  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path d="M3 5a2 2 0 0 1 2-2h3.28a1 1 0 0 1 .948.684l1.498 4.493a1 1 0 0 1-.502 1.21l-2.257 1.13a11.042 11.042 0 0 0 5.516 5.516l1.13-2.257a1 1 0 0 1 1.21-.502l4.493 1.498a1 1 0 0 1 .684.949V19a2 2 0 0 1-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
  </svg>
);

const EmailIcon = () => (
  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
    <polyline points="22,6 12,13 2,6"/>
  </svg>
);

const HomeIcon = () => (
  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
    <polyline points="9,22 9,12 15,12 15,22"/>
  </svg>
);

const CheckIcon = () => (
  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);

const consultationTypes = [
  {
    id: "curtains",
    title: "Curtain Design",
    description: "Custom curtain solutions for your windows",
    duration: "60 minutes",
    price: "Free"
  },
  {
    id: "blinds",
    title: "Blinds & Shades",
    description: "Modern window treatment options",
    duration: "45 minutes", 
    price: "Free"
  },
  {
    id: "upholstery",
    title: "Upholstery Services",
    description: "Furniture restoration and reupholstering",
    duration: "90 minutes",
    price: "Free"
  },
  {
    id: "interior",
    title: "Complete Interior Design",
    description: "Full room makeover consultation",
    duration: "120 minutes",
    price: "PKR 2,000"
  },
  {
    id: "commercial",
    title: "Commercial Projects",
    description: "Office and hotel interior solutions",
    duration: "90 minutes",
    price: "Free"
  }
];

const timeSlots = [
  "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
  "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM"
];

export default function ConsultationBooking() {
  useEffect(() => {
    document.title = "Book Interior Consultation - ShafiSons";
  }, []);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    consultationType: "",
    preferredDate: "",
    preferredTime: "",
    projectDetails: "",
    budget: "",
    urgency: "flexible"
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await apiPost("/api/consultations", {
        ...formData,
        status: "pending",
        submittedAt: new Date().toISOString()
      });
      
      setSuccess(true);
      setFormData({
        name: "",
        email: "",
        phone: "",
        address: "",
        consultationType: "",
        preferredDate: "",
        preferredTime: "",
        projectDetails: "",
        budget: "",
        urgency: "flexible"
      });
    } catch (err) {
      setError(err?.message || "Failed to submit consultation request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const selectedConsultation = consultationTypes.find(c => c.id === formData.consultationType);

  // Get tomorrow's date as minimum date
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  if (success) {
    return (
      <div className="consultation-page">
        <div className="consultation-success">
          <div className="container">
            <div className="consultation-success-content">
              <div className="consultation-success-icon">
                <CheckIcon />
              </div>
              <h1 className="consultation-success-title">Consultation Booked Successfully!</h1>
              <p className="consultation-success-desc">
                Thank you for booking your interior consultation with ShafiSons. 
                We've received your request and will contact you within 24 hours to confirm your appointment.
              </p>
              <div className="consultation-success-details">
                <div className="consultation-success-detail">
                  <strong>Service:</strong> {selectedConsultation?.title}
                </div>
                <div className="consultation-success-detail">
                  <strong>Preferred Date:</strong> {new Date(formData.preferredDate).toLocaleDateString()}
                </div>
                <div className="consultation-success-detail">
                  <strong>Preferred Time:</strong> {formData.preferredTime}
                </div>
              </div>
              <div className="consultation-success-actions">
                <Link to="/shop" className="btn-brand">Continue Shopping</Link>
                <Link to="/" className="btn-accent">Back to Home</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="consultation-page">
      {/* Hero Section */}
      <section className="consultation-hero">
        <div className="container">
          <div className="consultation-hero-content">
            <div className="consultation-breadcrumb">
              <Link to="/">Home</Link>
              <span>/</span>
              <Link to="/shop">Shop</Link>
              <span>/</span>
              <span>Book Consultation</span>
            </div>
            <h1 className="consultation-hero-title">Book Your Interior Consultation</h1>
            <p className="consultation-hero-desc">
              Get expert advice from our interior design specialists. We'll help you transform 
              your space with premium fabrics and custom solutions tailored to your needs.
            </p>
            <div className="consultation-hero-features">
              <div className="consultation-feature">
                <CheckIcon />
                <span>Free Home Visit</span>
              </div>
              <div className="consultation-feature">
                <CheckIcon />
                <span>Expert Advice</span>
              </div>
              <div className="consultation-feature">
                <CheckIcon />
                <span>Custom Solutions</span>
              </div>
              <div className="consultation-feature">
                <CheckIcon />
                <span>No Obligation Quote</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Booking Form */}
      <section className="consultation-form-section">
        <div className="container">
          <div className="consultation-form-layout">
            {/* Form */}
            <div className="consultation-form-wrap">
              <div className="consultation-form-header">
                <h2 className="consultation-form-title">Schedule Your Consultation</h2>
                <p className="consultation-form-desc">
                  Fill out the form below and we'll contact you to confirm your appointment.
                </p>
              </div>

              {error && (
                <div className="consultation-error">
                  <strong>Error:</strong> {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="consultation-form">
                {/* Personal Information */}
                <div className="consultation-form-section">
                  <h3 className="consultation-section-title">Personal Information</h3>
                  <div className="consultation-form-grid">
                    <div className="consultation-field">
                      <label className="consultation-label">
                        <UserIcon />
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="consultation-input"
                        placeholder="Enter your full name"
                        required
                      />
                    </div>
                    <div className="consultation-field">
                      <label className="consultation-label">
                        <EmailIcon />
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="consultation-input"
                        placeholder="your@email.com"
                        required
                      />
                    </div>
                    <div className="consultation-field">
                      <label className="consultation-label">
                        <PhoneIcon />
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="consultation-input"
                        placeholder="+92 300 1234567"
                        required
                      />
                    </div>
                    <div className="consultation-field consultation-field-full">
                      <label className="consultation-label">
                        <HomeIcon />
                        Address *
                      </label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        className="consultation-input"
                        placeholder="Your complete address for home visit"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Consultation Type */}
                <div className="consultation-form-section">
                  <h3 className="consultation-section-title">Consultation Type</h3>
                  <div className="consultation-types">
                    {consultationTypes.map((type) => (
                      <label key={type.id} className="consultation-type-card">
                        <input
                          type="radio"
                          name="consultationType"
                          value={type.id}
                          checked={formData.consultationType === type.id}
                          onChange={handleChange}
                          required
                        />
                        <div className="consultation-type-content">
                          <div className="consultation-type-header">
                            <h4 className="consultation-type-title">{type.title}</h4>
                            <span className="consultation-type-price">{type.price}</span>
                          </div>
                          <p className="consultation-type-desc">{type.description}</p>
                          <div className="consultation-type-duration">
                            <ClockIcon />
                            <span>{type.duration}</span>
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Schedule */}
                <div className="consultation-form-section">
                  <h3 className="consultation-section-title">Preferred Schedule</h3>
                  <div className="consultation-form-grid">
                    <div className="consultation-field">
                      <label className="consultation-label">
                        <CalendarIcon />
                        Preferred Date *
                      </label>
                      <input
                        type="date"
                        name="preferredDate"
                        value={formData.preferredDate}
                        onChange={handleChange}
                        className="consultation-input"
                        min={minDate}
                        required
                      />
                    </div>
                    <div className="consultation-field">
                      <label className="consultation-label">
                        <ClockIcon />
                        Preferred Time *
                      </label>
                      <select
                        name="preferredTime"
                        value={formData.preferredTime}
                        onChange={handleChange}
                        className="consultation-input"
                        required
                      >
                        <option value="">Select time</option>
                        {timeSlots.map((time) => (
                          <option key={time} value={time}>{time}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Project Details */}
                <div className="consultation-form-section">
                  <h3 className="consultation-section-title">Project Details</h3>
                  <div className="consultation-form-grid">
                    <div className="consultation-field consultation-field-full">
                      <label className="consultation-label">
                        Project Description
                      </label>
                      <textarea
                        name="projectDetails"
                        value={formData.projectDetails}
                        onChange={handleChange}
                        className="consultation-textarea"
                        placeholder="Tell us about your project, room dimensions, style preferences, etc."
                        rows="4"
                      />
                    </div>
                    <div className="consultation-field">
                      <label className="consultation-label">
                        Budget Range
                      </label>
                      <select
                        name="budget"
                        value={formData.budget}
                        onChange={handleChange}
                        className="consultation-input"
                      >
                        <option value="">Select budget range</option>
                        <option value="under-25k">Under PKR 25,000</option>
                        <option value="25k-50k">PKR 25,000 - 50,000</option>
                        <option value="50k-100k">PKR 50,000 - 100,000</option>
                        <option value="100k-200k">PKR 100,000 - 200,000</option>
                        <option value="200k-plus">PKR 200,000+</option>
                      </select>
                    </div>
                    <div className="consultation-field">
                      <label className="consultation-label">
                        Project Urgency
                      </label>
                      <select
                        name="urgency"
                        value={formData.urgency}
                        onChange={handleChange}
                        className="consultation-input"
                      >
                        <option value="flexible">Flexible timeline</option>
                        <option value="1-month">Within 1 month</option>
                        <option value="2-weeks">Within 2 weeks</option>
                        <option value="urgent">Urgent (ASAP)</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="consultation-form-footer">
                  <button
                    type="submit"
                    className="consultation-submit-btn"
                    disabled={loading}
                  >
                    {loading ? "Submitting..." : "Book Consultation"}
                  </button>
                  <p className="consultation-form-note">
                    By submitting this form, you agree to our terms and conditions. 
                    We'll contact you within 24 hours to confirm your appointment.
                  </p>
                </div>
              </form>
            </div>

            {/* Sidebar */}
            <div className="consultation-sidebar">
              <div className="consultation-info-card">
                <h3 className="consultation-info-title">What to Expect</h3>
                <ul className="consultation-info-list">
                  <li>
                    <CheckIcon />
                    <div>
                      <strong>Professional Assessment</strong>
                      <span>Our expert will evaluate your space and requirements</span>
                    </div>
                  </li>
                  <li>
                    <CheckIcon />
                    <div>
                      <strong>Fabric Samples</strong>
                      <span>We'll bring relevant fabric samples for you to see and feel</span>
                    </div>
                  </li>
                  <li>
                    <CheckIcon />
                    <div>
                      <strong>Detailed Quote</strong>
                      <span>Receive a comprehensive quote with no hidden costs</span>
                    </div>
                  </li>
                  <li>
                    <CheckIcon />
                    <div>
                      <strong>Design Recommendations</strong>
                      <span>Get expert advice on colors, patterns, and styles</span>
                    </div>
                  </li>
                </ul>
              </div>

              <div className="consultation-contact-card">
                <h3 className="consultation-contact-title">Need Help?</h3>
                <p className="consultation-contact-desc">
                  Have questions about our consultation service? Contact us directly.
                </p>
                <div className="consultation-contact-info">
                  <div className="consultation-contact-item">
                    <PhoneIcon />
                    <div>
                      <strong>Call Us</strong>
                      <span>+92 81 123 4567</span>
                    </div>
                  </div>
                  <div className="consultation-contact-item">
                    <EmailIcon />
                    <div>
                      <strong>Email Us</strong>
                      <span>support@shafisons.com</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}