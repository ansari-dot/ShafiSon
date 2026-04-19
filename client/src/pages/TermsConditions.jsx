import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const CheckIcon = () => (
  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);

const InfoIcon = () => (
  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10"/>
    <path d="M12 16v-4"/>
    <path d="M12 8h.01"/>
  </svg>
);

const ShieldIcon = () => (
  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);

const ArrowUpIcon = () => (
  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
  </svg>
);

export default function TermsConditions() {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    document.title = "Terms & Conditions - ShafiSons";
    // Smooth scroll to top when component mounts
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Show/hide scroll to top button
    const handleScroll = () => {
      setShowScrollTop(window.pageYOffset > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="tc-page">
      {/* Hero Section */}
      <section className="tc-hero">
        <div className="container">
          <div className="tc-breadcrumb">
            <Link to="/">Home</Link>
            <span>/</span>
            <span>Terms & Conditions</span>
          </div>
          <div className="tc-hero-content">
            <h1 className="tc-hero-title">Terms & Conditions</h1>
            <p className="tc-hero-desc">
              Please read these terms and conditions carefully before using our services. 
              By accessing or using ShafiSons services, you agree to be bound by these terms.
            </p>
            <div className="tc-hero-features">
              <div className="tc-feature">
                <InfoIcon />
                <span>Last Updated: January 2024</span>
              </div>
              <div className="tc-feature">
                <ShieldIcon />
                <span>Legal Protection</span>
              </div>
              <div className="tc-feature">
                <CheckIcon />
                <span>Fair Terms</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="tc-content">
        <div className="container">
          <div className="tc-layout">
            {/* Main Content */}
            <div className="tc-main">
              
              {/* Acceptance of Terms */}
              <div className="tc-section">
                <h2 className="tc-section-title">1. Acceptance of Terms</h2>
                <div className="tc-text">
                  <p>
                    By accessing and using the ShafiSons website and services, you accept and agree to be bound by the terms and provision of this agreement. These Terms & Conditions apply to all visitors, users, and others who access or use our service.
                  </p>
                  <p>
                    If you do not agree to abide by the above, please do not use this service. We reserve the right to change these terms at any time without prior notice.
                  </p>
                </div>
              </div>

              {/* Use License */}
              <div className="tc-section">
                <h2 className="tc-section-title">2. Use License</h2>
                <div className="tc-text">
                  <p>
                    Permission is granted to temporarily download one copy of the materials on ShafiSons website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
                  </p>
                  <ul className="tc-list">
                    <li>Modify or copy the materials</li>
                    <li>Use the materials for any commercial purpose or for any public display</li>
                    <li>Attempt to reverse engineer any software contained on the website</li>
                    <li>Remove any copyright or other proprietary notations from the materials</li>
                  </ul>
                </div>
              </div>

              {/* Products and Services */}
              <div className="tc-section">
                <h2 className="tc-section-title">3. Products and Services</h2>
                <div className="tc-text">
                  <p>
                    ShafiSons offers premium curtain fabrics, custom drapery, blinds, floor seating, and upholstery solutions. All product descriptions, specifications, and pricing are subject to change without notice.
                  </p>
                  <div className="tc-grid">
                    <div className="tc-card">
                      <h3 className="tc-card-title">Product Availability</h3>
                      <p className="tc-card-desc">
                        All products are subject to availability. We reserve the right to discontinue any product at any time.
                      </p>
                    </div>
                    <div className="tc-card">
                      <h3 className="tc-card-title">Custom Orders</h3>
                      <p className="tc-card-desc">
                        Custom orders require advance payment and are non-refundable unless defective.
                      </p>
                    </div>
                    <div className="tc-card">
                      <h3 className="tc-card-title">Pricing</h3>
                      <p className="tc-card-desc">
                        All prices are in Pakistani Rupees (PKR) and include applicable taxes unless stated otherwise.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Orders and Payment */}
              <div className="tc-section">
                <h2 className="tc-section-title">4. Orders and Payment</h2>
                <div className="tc-text">
                  <p>
                    By placing an order with ShafiSons, you offer to purchase a product on and subject to the following terms and conditions. All orders are subject to availability and confirmation of the order price.
                  </p>
                  <div className="tc-process">
                    <div className="tc-step">
                      <div className="tc-step-number">1</div>
                      <div className="tc-step-content">
                        <h3 className="tc-step-title">Order Placement</h3>
                        <p className="tc-step-desc">
                          Orders can be placed online, by phone, or in-store. All orders require confirmation.
                        </p>
                      </div>
                    </div>
                    <div className="tc-step">
                      <div className="tc-step-number">2</div>
                      <div className="tc-step-content">
                        <h3 className="tc-step-title">Payment Terms</h3>
                        <p className="tc-step-desc">
                          Payment is required at the time of order placement. We accept cash, bank transfer, and major credit cards.
                        </p>
                      </div>
                    </div>
                    <div className="tc-step">
                      <div className="tc-step-number">3</div>
                      <div className="tc-step-content">
                        <h3 className="tc-step-title">Order Confirmation</h3>
                        <p className="tc-step-desc">
                          You will receive an order confirmation via email or SMS within 24 hours of placing your order.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Delivery and Installation */}
              <div className="tc-section">
                <h2 className="tc-section-title">5. Delivery and Installation</h2>
                <div className="tc-text">
                  <p>
                    Delivery times are estimates and may vary based on product availability and location. Installation services are available for an additional fee.
                  </p>
                  <div className="tc-delivery-info">
                    <div className="tc-delivery-item">
                      <h4>Delivery Areas</h4>
                      <p>We deliver throughout Quetta and surrounding areas. Extended delivery areas may incur additional charges.</p>
                    </div>
                    <div className="tc-delivery-item">
                      <h4>Delivery Times</h4>
                      <p>Standard delivery: 3-7 business days. Custom orders: 2-4 weeks depending on complexity.</p>
                    </div>
                    <div className="tc-delivery-item">
                      <h4>Installation</h4>
                      <p>Professional installation available. Installation must be scheduled in advance.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Returns and Refunds */}
              <div className="tc-section">
                <h2 className="tc-section-title">6. Returns and Refunds</h2>
                <div className="tc-text">
                  <p>
                    Our return and refund policy is designed to ensure customer satisfaction while protecting our business interests. Please refer to our detailed Return & Refund Policy for complete information.
                  </p>
                  <div className="tc-return-summary">
                    <div className="tc-return-item">
                      <strong>Return Window:</strong> 30 days from delivery date
                    </div>
                    <div className="tc-return-item">
                      <strong>Condition:</strong> Items must be unused and in original packaging
                    </div>
                    <div className="tc-return-item">
                      <strong>Custom Items:</strong> Non-returnable unless defective
                    </div>
                    <div className="tc-return-item">
                      <strong>Refund Processing:</strong> 5-7 business days after return approval
                    </div>
                  </div>
                </div>
              </div>

              {/* Limitation of Liability */}
              <div className="tc-section">
                <h2 className="tc-section-title">7. Limitation of Liability</h2>
                <div className="tc-text">
                  <p>
                    In no event shall ShafiSons or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on ShafiSons website.
                  </p>
                  <p>
                    Our total liability to you for any loss or damage arising from or in connection with these terms or your use of our services shall not exceed the amount paid by you for the specific product or service.
                  </p>
                </div>
              </div>

              {/* Privacy and Data Protection */}
              <div className="tc-section">
                <h2 className="tc-section-title">8. Privacy and Data Protection</h2>
                <div className="tc-text">
                  <p>
                    Your privacy is important to us. Our Privacy Policy explains how we collect, use, and protect your information when you use our services. By using our services, you agree to the collection and use of information in accordance with our Privacy Policy.
                  </p>
                </div>
              </div>

              {/* Governing Law */}
              <div className="tc-section">
                <h2 className="tc-section-title">9. Governing Law</h2>
                <div className="tc-text">
                  <p>
                    These terms and conditions are governed by and construed in accordance with the laws of Pakistan. Any disputes relating to these terms and conditions will be subject to the exclusive jurisdiction of the courts of Pakistan.
                  </p>
                </div>
              </div>

              {/* Contact Information */}
              <div className="tc-section">
                <h2 className="tc-section-title">10. Contact Information</h2>
                <div className="tc-text">
                  <p>
                    If you have any questions about these Terms & Conditions, please contact us:
                  </p>
                  <div className="tc-contact-info">
                    <div className="tc-contact-item">
                      <strong>Address:</strong> Jinnah Road Showroom, Quetta, Pakistan
                    </div>
                    <div className="tc-contact-item">
                      <strong>Phone:</strong> +92 81 123 4567
                    </div>
                    <div className="tc-contact-item">
                      <strong>Email:</strong> support@shafisons.com
                    </div>
                    <div className="tc-contact-item">
                      <strong>Business Hours:</strong> Mon-Sat: 9 AM - 6 PM
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Sidebar */}
            <div className="tc-sidebar">
              <div className="tc-quick-nav">
                <h3 className="tc-quick-title">Quick Navigation</h3>
                <ul className="tc-quick-list">
                  <li><a href="#acceptance" onClick={(e) => { e.preventDefault(); document.querySelector('.tc-section:nth-of-type(1)')?.scrollIntoView({ behavior: 'smooth' }); }}>Acceptance of Terms</a></li>
                  <li><a href="#license" onClick={(e) => { e.preventDefault(); document.querySelector('.tc-section:nth-of-type(2)')?.scrollIntoView({ behavior: 'smooth' }); }}>Use License</a></li>
                  <li><a href="#products" onClick={(e) => { e.preventDefault(); document.querySelector('.tc-section:nth-of-type(3)')?.scrollIntoView({ behavior: 'smooth' }); }}>Products & Services</a></li>
                  <li><a href="#orders" onClick={(e) => { e.preventDefault(); document.querySelector('.tc-section:nth-of-type(4)')?.scrollIntoView({ behavior: 'smooth' }); }}>Orders & Payment</a></li>
                  <li><a href="#delivery" onClick={(e) => { e.preventDefault(); document.querySelector('.tc-section:nth-of-type(5)')?.scrollIntoView({ behavior: 'smooth' }); }}>Delivery & Installation</a></li>
                  <li><a href="#returns" onClick={(e) => { e.preventDefault(); document.querySelector('.tc-section:nth-of-type(6)')?.scrollIntoView({ behavior: 'smooth' }); }}>Returns & Refunds</a></li>
                  <li><a href="#liability" onClick={(e) => { e.preventDefault(); document.querySelector('.tc-section:nth-of-type(7)')?.scrollIntoView({ behavior: 'smooth' }); }}>Limitation of Liability</a></li>
                  <li><a href="#privacy" onClick={(e) => { e.preventDefault(); document.querySelector('.tc-section:nth-of-type(8)')?.scrollIntoView({ behavior: 'smooth' }); }}>Privacy & Data</a></li>
                  <li><a href="#law" onClick={(e) => { e.preventDefault(); document.querySelector('.tc-section:nth-of-type(9)')?.scrollIntoView({ behavior: 'smooth' }); }}>Governing Law</a></li>
                  <li><a href="#contact" onClick={(e) => { e.preventDefault(); document.querySelector('.tc-section:nth-of-type(10)')?.scrollIntoView({ behavior: 'smooth' }); }}>Contact Information</a></li>
                </ul>
              </div>

              <div className="tc-related-links">
                <h3 className="tc-related-title">Related Policies</h3>
                <ul className="tc-related-list">
                  <li><Link to="/privacy-policy">Privacy Policy</Link></li>
                  <li><Link to="/return-refund">Return & Refund Policy</Link></li>
                  <li><Link to="/contact">Contact Support</Link></li>
                  <li><Link to="/about">About ShafiSons</Link></li>
                </ul>
              </div>

              <div className="tc-help-card">
                <div className="tc-help-icon">
                  <InfoIcon />
                </div>
                <h3 className="tc-help-title">Need Help?</h3>
                <p className="tc-help-desc">
                  Have questions about our terms? Our customer service team is here to help.
                </p>
                <Link to="/contact" className="tc-help-btn">
                  Contact Support
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Scroll to Top Button */}
      <button 
        className={`scroll-to-top ${showScrollTop ? 'visible' : ''}`}
        onClick={scrollToTop}
        aria-label="Scroll to top"
      >
        <ArrowUpIcon />
      </button>
    </div>
  );
}