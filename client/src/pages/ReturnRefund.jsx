import { useEffect } from 'react';
import { Link } from 'react-router-dom';

const CheckIcon = () => (
  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);

const XIcon = () => (
  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const ClockIcon = () => (
  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10"/>
    <polyline points="12,6 12,12 16,14"/>
  </svg>
);

const ShieldIcon = () => (
  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);

const TruckIcon = () => (
  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <rect x="1" y="3" width="15" height="13"/>
    <polygon points="16,8 20,8 23,11 23,16 16,16 16,8"/>
    <circle cx="5.5" cy="18.5" r="2.5"/>
    <circle cx="18.5" cy="18.5" r="2.5"/>
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

export default function ReturnRefund() {
  useEffect(() => {
    document.title = "Return & Refund Policy - ShafiSons";
  }, []);

  return (
    <div className="rr-page">
      {/* Hero Section */}
      <section className="rr-hero">
        <div className="container">
          <div className="rr-breadcrumb">
            <Link to="/">Home</Link>
            <span>/</span>
            <span>Return & Refund Policy</span>
          </div>
          <div className="rr-hero-content">
            <h1 className="rr-hero-title">Return & Refund Policy</h1>
            <p className="rr-hero-desc">
              We want you to be completely satisfied with your purchase. Learn about our 
              hassle-free return and refund process for all ShafiSons products.
            </p>
            <div className="rr-hero-features">
              <div className="rr-feature">
                <ClockIcon />
                <span>30-Day Return Window</span>
              </div>
              <div className="rr-feature">
                <ShieldIcon />
                <span>Quality Guarantee</span>
              </div>
              <div className="rr-feature">
                <TruckIcon />
                <span>Free Return Pickup</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="rr-content">
        <div className="container">
          <div className="rr-layout">
            {/* Main Content */}
            <div className="rr-main">
              {/* Return Policy */}
              <div className="rr-section">
                <h2 className="rr-section-title">Return Policy</h2>
                <div className="rr-text">
                  <p>
                    At ShafiSons, we stand behind the quality of our products. If you're not completely 
                    satisfied with your purchase, you can return eligible items within 30 days of delivery 
                    for a full refund or exchange.
                  </p>
                </div>

                <div className="rr-grid">
                  <div className="rr-card">
                    <div className="rr-card-icon">
                      <ClockIcon />
                    </div>
                    <h3 className="rr-card-title">30-Day Return Window</h3>
                    <p className="rr-card-desc">
                      You have 30 days from the delivery date to initiate a return. 
                      Items must be in original condition with tags attached.
                    </p>
                  </div>
                  <div className="rr-card">
                    <div className="rr-card-icon">
                      <ShieldIcon />
                    </div>
                    <h3 className="rr-card-title">Quality Guarantee</h3>
                    <p className="rr-card-desc">
                      All our fabrics and products are guaranteed against manufacturing 
                      defects. We'll replace or refund defective items at no cost.
                    </p>
                  </div>
                  <div className="rr-card">
                    <div className="rr-card-icon">
                      <TruckIcon />
                    </div>
                    <h3 className="rr-card-title">Free Return Pickup</h3>
                    <p className="rr-card-desc">
                      We offer free return pickup service within Quetta city limits. 
                      For other areas, return shipping costs may apply.
                    </p>
                  </div>
                </div>
              </div>

              {/* Eligible Items */}
              <div className="rr-section">
                <h2 className="rr-section-title">What Can Be Returned</h2>
                <div className="rr-eligible">
                  <div className="rr-eligible-col">
                    <h3 className="rr-eligible-title">
                      <CheckIcon />
                      Returnable Items
                    </h3>
                    <ul className="rr-list">
                      <li>Curtain fabrics (uncut and unused)</li>
                      <li>Sofa fabrics (uncut and unused)</li>
                      <li>Ready-made curtains in original packaging</li>
                      <li>Blinds and window treatments (unused)</li>
                      <li>Cushions and pillows (unused)</li>
                      <li>Home decor accessories</li>
                    </ul>
                  </div>
                  <div className="rr-eligible-col">
                    <h3 className="rr-eligible-title">
                      <XIcon />
                      Non-Returnable Items
                    </h3>
                    <ul className="rr-list">
                      <li>Custom-cut fabrics to your specifications</li>
                      <li>Custom-made curtains or upholstery</li>
                      <li>Items damaged by customer use</li>
                      <li>Fabrics cut or altered by customer</li>
                      <li>Items without original tags or packaging</li>
                      <li>Sale or clearance items (unless defective)</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Return Process */}
              <div className="rr-section">
                <h2 className="rr-section-title">How to Return Items</h2>
                <div className="rr-process">
                  <div className="rr-step">
                    <div className="rr-step-number">1</div>
                    <div className="rr-step-content">
                      <h3 className="rr-step-title">Contact Us</h3>
                      <p className="rr-step-desc">
                        Call us at +92 81 123 4567 or email support@shafisons.com to initiate 
                        your return. Provide your order number and reason for return.
                      </p>
                    </div>
                  </div>
                  <div className="rr-step">
                    <div className="rr-step-number">2</div>
                    <div className="rr-step-content">
                      <h3 className="rr-step-title">Get Return Authorization</h3>
                      <p className="rr-step-desc">
                        We'll provide you with a Return Authorization Number (RAN) and 
                        return instructions. Keep this number for tracking purposes.
                      </p>
                    </div>
                  </div>
                  <div className="rr-step">
                    <div className="rr-step-number">3</div>
                    <div className="rr-step-content">
                      <h3 className="rr-step-title">Package Items</h3>
                      <p className="rr-step-desc">
                        Pack items securely in original packaging with all tags attached. 
                        Include the RAN and original receipt or order confirmation.
                      </p>
                    </div>
                  </div>
                  <div className="rr-step">
                    <div className="rr-step-number">4</div>
                    <div className="rr-step-content">
                      <h3 className="rr-step-title">Ship or Schedule Pickup</h3>
                      <p className="rr-step-desc">
                        Either schedule a free pickup (Quetta city) or ship the items back 
                        using the provided return label and instructions.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Refund Policy */}
              <div className="rr-section">
                <h2 className="rr-section-title">Refund Policy</h2>
                <div className="rr-text">
                  <p>
                    Once we receive and inspect your returned items, we'll process your refund 
                    within 5-7 business days. Refunds will be issued to the original payment method.
                  </p>
                </div>

                <div className="rr-refund-info">
                  <div className="rr-refund-item">
                    <h4>Processing Time</h4>
                    <p>5-7 business days after we receive your return</p>
                  </div>
                  <div className="rr-refund-item">
                    <h4>Refund Method</h4>
                    <p>Original payment method (credit card, bank transfer, etc.)</p>
                  </div>
                  <div className="rr-refund-item">
                    <h4>Shipping Costs</h4>
                    <p>Original shipping costs are non-refundable (except for defective items)</p>
                  </div>
                  <div className="rr-refund-item">
                    <h4>Partial Refunds</h4>
                    <p>Items not in original condition may receive partial refunds</p>
                  </div>
                </div>
              </div>

              {/* Exchange Policy */}
              <div className="rr-section">
                <h2 className="rr-section-title">Exchange Policy</h2>
                <div className="rr-text">
                  <p>
                    We offer exchanges for items of equal or greater value. If exchanging for 
                    a higher-value item, you'll pay the difference. If exchanging for a 
                    lower-value item, we'll refund the difference.
                  </p>
                  <ul className="rr-exchange-list">
                    <li>Exchanges must be initiated within 30 days of delivery</li>
                    <li>Items must be in original condition with tags attached</li>
                    <li>Exchange items must be in stock and available</li>
                    <li>Custom items cannot be exchanged unless defective</li>
                  </ul>
                </div>
              </div>

              {/* Damaged or Defective Items */}
              <div className="rr-section">
                <h2 className="rr-section-title">Damaged or Defective Items</h2>
                <div className="rr-text">
                  <p>
                    If you receive damaged or defective items, please contact us immediately. 
                    We'll arrange for immediate replacement or full refund, including shipping costs.
                  </p>
                </div>
                <div className="rr-damage-process">
                  <div className="rr-damage-step">
                    <strong>Step 1:</strong> Contact us within 48 hours of delivery
                  </div>
                  <div className="rr-damage-step">
                    <strong>Step 2:</strong> Provide photos of the damaged/defective item
                  </div>
                  <div className="rr-damage-step">
                    <strong>Step 3:</strong> We'll arrange immediate pickup and replacement
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="rr-sidebar">
              <div className="rr-contact-card">
                <h3 className="rr-contact-title">Need Help with Returns?</h3>
                <p className="rr-contact-desc">
                  Our customer service team is here to help with your return or refund request.
                </p>
                <div className="rr-contact-info">
                  <div className="rr-contact-item">
                    <PhoneIcon />
                    <div>
                      <strong>Call Us</strong>
                      <span>+92 81 123 4567</span>
                      <small>Mon-Sat: 9 AM - 6 PM</small>
                    </div>
                  </div>
                  <div className="rr-contact-item">
                    <EmailIcon />
                    <div>
                      <strong>Email Us</strong>
                      <span>support@shafisons.com</span>
                      <small>Response within 24 hours</small>
                    </div>
                  </div>
                </div>
                <Link to="/contact" className="rr-contact-btn">
                  Contact Support
                </Link>
              </div>

              <div className="rr-quick-links">
                <h3 className="rr-quick-title">Quick Links</h3>
                <ul className="rr-quick-list">
                  <li><Link to="/track">Track Your Order</Link></li>
                  <li><Link to="/contact">Contact Support</Link></li>
                  <li><Link to="/shop">Continue Shopping</Link></li>
                  <li><Link to="/about">About ShafiSons</Link></li>
                </ul>
              </div>

              <div className="rr-guarantee">
                <div className="rr-guarantee-icon">
                  <ShieldIcon />
                </div>
                <h3 className="rr-guarantee-title">Our Guarantee</h3>
                <p className="rr-guarantee-desc">
                  We stand behind every product we sell. If you're not satisfied, 
                  we'll make it right with our hassle-free return policy.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}