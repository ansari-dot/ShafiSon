import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const ShieldIcon = () => (
  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);

const LockIcon = () => (
  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
    <circle cx="12" cy="16" r="1"/>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);

const EyeIcon = () => (
  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);

const UserIcon = () => (
  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
);

const ArrowUpIcon = () => (
  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
  </svg>
);

export default function PrivacyPolicy() {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    document.title = "Privacy Policy - ShafiSons";
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
    <div className="pp-page">
      {/* Hero Section */}
      <section className="pp-hero">
        <div className="container">
          <div className="pp-breadcrumb">
            <Link to="/">Home</Link>
            <span>/</span>
            <span>Privacy Policy</span>
          </div>
          <div className="pp-hero-content">
            <h1 className="pp-hero-title">Privacy Policy</h1>
            <p className="pp-hero-desc">
              Your privacy is important to us. This Privacy Policy explains how ShafiSons collects, 
              uses, and protects your personal information when you use our services.
            </p>
            <div className="pp-hero-features">
              <div className="pp-feature">
                <ShieldIcon />
                <span>Data Protection</span>
              </div>
              <div className="pp-feature">
                <LockIcon />
                <span>Secure Storage</span>
              </div>
              <div className="pp-feature">
                <EyeIcon />
                <span>Transparency</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="pp-content">
        <div className="container">
          <div className="pp-layout">
            {/* Main Content */}
            <div className="pp-main">
              
              {/* Information We Collect */}
              <div className="pp-section">
                <h2 className="pp-section-title">1. Information We Collect</h2>
                <div className="pp-text">
                  <p>
                    We collect information you provide directly to us, information we obtain automatically when you use our services, and information from third-party sources.
                  </p>
                </div>

                <div className="pp-grid">
                  <div className="pp-card">
                    <div className="pp-card-icon">
                      <UserIcon />
                    </div>
                    <h3 className="pp-card-title">Personal Information</h3>
                    <p className="pp-card-desc">
                      Name, email address, phone number, shipping address, and payment information when you make a purchase or create an account.
                    </p>
                  </div>
                  <div className="pp-card">
                    <div className="pp-card-icon">
                      <EyeIcon />
                    </div>
                    <h3 className="pp-card-title">Usage Information</h3>
                    <p className="pp-card-desc">
                      Information about how you use our website, including pages visited, time spent, and interactions with our content.
                    </p>
                  </div>
                  <div className="pp-card">
                    <div className="pp-card-icon">
                      <LockIcon />
                    </div>
                    <h3 className="pp-card-title">Device Information</h3>
                    <p className="pp-card-desc">
                      Information about your device, including IP address, browser type, operating system, and device identifiers.
                    </p>
                  </div>
                </div>
              </div>

              {/* How We Use Your Information */}
              <div className="pp-section">
                <h2 className="pp-section-title">2. How We Use Your Information</h2>
                <div className="pp-text">
                  <p>
                    We use the information we collect to provide, maintain, and improve our services, process transactions, and communicate with you.
                  </p>
                </div>

                <div className="pp-usage-list">
                  <div className="pp-usage-item">
                    <h4>Order Processing</h4>
                    <p>To process and fulfill your orders, including payment processing, shipping, and customer service.</p>
                  </div>
                  <div className="pp-usage-item">
                    <h4>Communication</h4>
                    <p>To send you order confirmations, shipping updates, promotional offers, and respond to your inquiries.</p>
                  </div>
                  <div className="pp-usage-item">
                    <h4>Service Improvement</h4>
                    <p>To analyze usage patterns, improve our website functionality, and develop new features and services.</p>
                  </div>
                  <div className="pp-usage-item">
                    <h4>Marketing</h4>
                    <p>To send you promotional materials about our products and services, with your consent where required.</p>
                  </div>
                  <div className="pp-usage-item">
                    <h4>Legal Compliance</h4>
                    <p>To comply with applicable laws, regulations, and legal processes.</p>
                  </div>
                </div>
              </div>

              {/* Information Sharing */}
              <div className="pp-section">
                <h2 className="pp-section-title">3. Information Sharing and Disclosure</h2>
                <div className="pp-text">
                  <p>
                    We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy.
                  </p>
                </div>

                <div className="pp-sharing-grid">
                  <div className="pp-sharing-col">
                    <h3 className="pp-sharing-title">We May Share Information With:</h3>
                    <ul className="pp-list">
                      <li>Service providers who help us operate our business</li>
                      <li>Payment processors for transaction processing</li>
                      <li>Shipping companies for order delivery</li>
                      <li>Marketing partners with your consent</li>
                      <li>Legal authorities when required by law</li>
                    </ul>
                  </div>
                  <div className="pp-sharing-col">
                    <h3 className="pp-sharing-title">We Never Share:</h3>
                    <ul className="pp-list">
                      <li>Your personal information for profit</li>
                      <li>Sensitive payment details (stored securely)</li>
                      <li>Your data with unauthorized third parties</li>
                      <li>Information without proper security measures</li>
                      <li>Data beyond what's necessary for services</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Data Security */}
              <div className="pp-section">
                <h2 className="pp-section-title">4. Data Security</h2>
                <div className="pp-text">
                  <p>
                    We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
                  </p>
                </div>

                <div className="pp-security-measures">
                  <div className="pp-security-item">
                    <div className="pp-security-icon">
                      <LockIcon />
                    </div>
                    <div className="pp-security-content">
                      <h4>Encryption</h4>
                      <p>All sensitive data is encrypted in transit and at rest using industry-standard encryption protocols.</p>
                    </div>
                  </div>
                  <div className="pp-security-item">
                    <div className="pp-security-icon">
                      <ShieldIcon />
                    </div>
                    <div className="pp-security-content">
                      <h4>Access Controls</h4>
                      <p>Strict access controls ensure only authorized personnel can access your personal information.</p>
                    </div>
                  </div>
                  <div className="pp-security-item">
                    <div className="pp-security-icon">
                      <EyeIcon />
                    </div>
                    <div className="pp-security-content">
                      <h4>Regular Monitoring</h4>
                      <p>We continuously monitor our systems for security vulnerabilities and potential threats.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Your Rights */}
              <div className="pp-section">
                <h2 className="pp-section-title">5. Your Rights and Choices</h2>
                <div className="pp-text">
                  <p>
                    You have certain rights regarding your personal information. You can exercise these rights by contacting us using the information provided below.
                  </p>
                </div>

                <div className="pp-rights-grid">
                  <div className="pp-right-item">
                    <h4>Access</h4>
                    <p>Request access to the personal information we hold about you.</p>
                  </div>
                  <div className="pp-right-item">
                    <h4>Correction</h4>
                    <p>Request correction of inaccurate or incomplete personal information.</p>
                  </div>
                  <div className="pp-right-item">
                    <h4>Deletion</h4>
                    <p>Request deletion of your personal information, subject to legal requirements.</p>
                  </div>
                  <div className="pp-right-item">
                    <h4>Portability</h4>
                    <p>Request a copy of your personal information in a structured format.</p>
                  </div>
                  <div className="pp-right-item">
                    <h4>Opt-out</h4>
                    <p>Opt-out of marketing communications at any time.</p>
                  </div>
                  <div className="pp-right-item">
                    <h4>Restriction</h4>
                    <p>Request restriction of processing of your personal information.</p>
                  </div>
                </div>
              </div>

              {/* Cookies and Tracking */}
              <div className="pp-section">
                <h2 className="pp-section-title">6. Cookies and Tracking Technologies</h2>
                <div className="pp-text">
                  <p>
                    We use cookies and similar tracking technologies to enhance your browsing experience, analyze website traffic, and personalize content.
                  </p>
                </div>

                <div className="pp-cookies-info">
                  <div className="pp-cookie-type">
                    <h4>Essential Cookies</h4>
                    <p>Required for the website to function properly. These cannot be disabled.</p>
                  </div>
                  <div className="pp-cookie-type">
                    <h4>Analytics Cookies</h4>
                    <p>Help us understand how visitors interact with our website to improve user experience.</p>
                  </div>
                  <div className="pp-cookie-type">
                    <h4>Marketing Cookies</h4>
                    <p>Used to deliver relevant advertisements and track campaign effectiveness.</p>
                  </div>
                  <div className="pp-cookie-type">
                    <h4>Preference Cookies</h4>
                    <p>Remember your preferences and settings to provide a personalized experience.</p>
                  </div>
                </div>
              </div>

              {/* Data Retention */}
              <div className="pp-section">
                <h2 className="pp-section-title">7. Data Retention</h2>
                <div className="pp-text">
                  <p>
                    We retain your personal information only for as long as necessary to fulfill the purposes for which it was collected, comply with legal obligations, and resolve disputes.
                  </p>
                  <div className="pp-retention-info">
                    <div className="pp-retention-item">
                      <strong>Account Information:</strong> Retained while your account is active and for 3 years after closure
                    </div>
                    <div className="pp-retention-item">
                      <strong>Order History:</strong> Retained for 7 years for tax and legal compliance
                    </div>
                    <div className="pp-retention-item">
                      <strong>Marketing Data:</strong> Retained until you opt-out or for 2 years of inactivity
                    </div>
                    <div className="pp-retention-item">
                      <strong>Website Analytics:</strong> Aggregated data retained for 2 years
                    </div>
                  </div>
                </div>
              </div>

              {/* Children's Privacy */}
              <div className="pp-section">
                <h2 className="pp-section-title">8. Children's Privacy</h2>
                <div className="pp-text">
                  <p>
                    Our services are not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us.
                  </p>
                </div>
              </div>

              {/* Changes to Privacy Policy */}
              <div className="pp-section">
                <h2 className="pp-section-title">9. Changes to This Privacy Policy</h2>
                <div className="pp-text">
                  <p>
                    We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.
                  </p>
                  <p>
                    We encourage you to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.
                  </p>
                </div>
              </div>

              {/* Contact Information */}
              <div className="pp-section">
                <h2 className="pp-section-title">10. Contact Us</h2>
                <div className="pp-text">
                  <p>
                    If you have any questions about this Privacy Policy or our privacy practices, please contact us:
                  </p>
                  <div className="pp-contact-info">
                    <div className="pp-contact-item">
                      <strong>Privacy Officer:</strong> ShafiSons Customer Service
                    </div>
                    <div className="pp-contact-item">
                      <strong>Address:</strong> Jinnah Road Showroom, Quetta, Pakistan
                    </div>
                    <div className="pp-contact-item">
                      <strong>Phone:</strong> +92 81 123 4567
                    </div>
                    <div className="pp-contact-item">
                      <strong>Email:</strong> privacy@shafisons.com
                    </div>
                    <div className="pp-contact-item">
                      <strong>Response Time:</strong> We will respond to your inquiry within 48 hours
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Sidebar */}
            <div className="pp-sidebar">
              <div className="pp-quick-nav">
                <h3 className="pp-quick-title">Quick Navigation</h3>
                <ul className="pp-quick-list">
                  <li><a href="#information" onClick={(e) => { e.preventDefault(); document.querySelector('.pp-section:nth-of-type(1)')?.scrollIntoView({ behavior: 'smooth' }); }}>Information We Collect</a></li>
                  <li><a href="#usage" onClick={(e) => { e.preventDefault(); document.querySelector('.pp-section:nth-of-type(2)')?.scrollIntoView({ behavior: 'smooth' }); }}>How We Use Information</a></li>
                  <li><a href="#sharing" onClick={(e) => { e.preventDefault(); document.querySelector('.pp-section:nth-of-type(3)')?.scrollIntoView({ behavior: 'smooth' }); }}>Information Sharing</a></li>
                  <li><a href="#security" onClick={(e) => { e.preventDefault(); document.querySelector('.pp-section:nth-of-type(4)')?.scrollIntoView({ behavior: 'smooth' }); }}>Data Security</a></li>
                  <li><a href="#rights" onClick={(e) => { e.preventDefault(); document.querySelector('.pp-section:nth-of-type(5)')?.scrollIntoView({ behavior: 'smooth' }); }}>Your Rights</a></li>
                  <li><a href="#cookies" onClick={(e) => { e.preventDefault(); document.querySelector('.pp-section:nth-of-type(6)')?.scrollIntoView({ behavior: 'smooth' }); }}>Cookies & Tracking</a></li>
                  <li><a href="#retention" onClick={(e) => { e.preventDefault(); document.querySelector('.pp-section:nth-of-type(7)')?.scrollIntoView({ behavior: 'smooth' }); }}>Data Retention</a></li>
                  <li><a href="#children" onClick={(e) => { e.preventDefault(); document.querySelector('.pp-section:nth-of-type(8)')?.scrollIntoView({ behavior: 'smooth' }); }}>Children's Privacy</a></li>
                  <li><a href="#changes" onClick={(e) => { e.preventDefault(); document.querySelector('.pp-section:nth-of-type(9)')?.scrollIntoView({ behavior: 'smooth' }); }}>Policy Changes</a></li>
                  <li><a href="#contact" onClick={(e) => { e.preventDefault(); document.querySelector('.pp-section:nth-of-type(10)')?.scrollIntoView({ behavior: 'smooth' }); }}>Contact Us</a></li>
                </ul>
              </div>

              <div className="pp-related-links">
                <h3 className="pp-related-title">Related Policies</h3>
                <ul className="pp-related-list">
                  <li><Link to="/terms-conditions">Terms & Conditions</Link></li>
                  <li><Link to="/return-refund">Return & Refund Policy</Link></li>
                  <li><Link to="/contact">Contact Support</Link></li>
                  <li><Link to="/about">About ShafiSons</Link></li>
                </ul>
              </div>

              <div className="pp-help-card">
                <div className="pp-help-icon">
                  <ShieldIcon />
                </div>
                <h3 className="pp-help-title">Privacy Questions?</h3>
                <p className="pp-help-desc">
                  Have questions about how we handle your data? Our privacy team is here to help.
                </p>
                <Link to="/contact" className="pp-help-btn">
                  Contact Privacy Team
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}