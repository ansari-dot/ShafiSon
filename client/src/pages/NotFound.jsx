import { Link } from "react-router-dom";
import { useEffect } from "react";

export default function NotFound() {
  useEffect(() => {
    document.title = "Page Not Found - ShafiSons";
  }, []);

  return (
    <div className="nf-page">
      <div className="nf-section">
        <div className="container">
          <div className="nf-content">
            {/* Decorative elements */}
            <div className="nf-orb nf-orb-1"></div>
            <div className="nf-orb nf-orb-2"></div>
            
            <div className="nf-inner">
              {/* 404 Number */}
              <div className="nf-number-wrap">
                <span className="nf-number">4</span>
                <div className="nf-zero">
                  <div className="nf-zero-inner">
                    <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
                      <circle 
                        cx="60" 
                        cy="60" 
                        r="50" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeDasharray="8 4"
                        className="nf-circle"
                      />
                      <path 
                        d="M40 40L80 80M80 40L40 80" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round"
                        className="nf-cross"
                      />
                    </svg>
                  </div>
                </div>
                <span className="nf-number">4</span>
              </div>

              {/* Content */}
              <div className="nf-text-content">
                <span className="nf-label">Page Not Found</span>
                <h1 className="nf-title">Oops! This page seems to have wandered off</h1>
                <p className="nf-desc">
                  The page you're looking for doesn't exist or has been moved. 
                  Don't worry, let's get you back to exploring our beautiful furniture collection.
                </p>

                {/* Action buttons */}
                <div className="nf-actions">
                  <Link to="/" className="nf-btn nf-btn-primary">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                      <polyline points="9,22 9,12 15,12 15,22"/>
                    </svg>
                    Back to Home
                  </Link>
                  <Link to="/shop" className="nf-btn nf-btn-secondary">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                      <line x1="3" y1="6" x2="21" y2="6"/>
                      <path d="M16 10a4 4 0 0 1-8 0"/>
                    </svg>
                    Browse Shop
                  </Link>
                </div>

                {/* Quick links */}
                <div className="nf-quick-links">
                  <span className="nf-quick-label">Or try these popular pages:</span>
                  <div className="nf-quick-list">
                    <Link to="/about" className="nf-quick-link">About Us</Link>
                    <Link to="/contact" className="nf-quick-link">Contact</Link>
                    <Link to="/services" className="nf-quick-link">Services</Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Featured products suggestion */}
            <div className="nf-suggestion">
              <div className="nf-suggestion-inner">
                <h3 className="nf-suggestion-title">While you're here, check out our trending products</h3>
                <Link to="/shop" className="nf-suggestion-link">
                  Explore Collection
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="7" y1="17" x2="17" y2="7"/>
                    <polyline points="7,7 17,7 17,17"/>
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}