import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const heroSlides = [
  { src: "/images/couch.png", alt: "Premium couch set" },
  { src: "/images/sofa.png", alt: "Luxury sofa collection" },
  { src: "/images/product-1.png", alt: "Featured decor product" },
  { src: "/images/product-2.png", alt: "Modern fabric collection" },
];

export default function Hero({ title, text, showButtons = false }) {
  const [slideIndex, setSlideIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setSlideIndex((prev) => (prev + 1) % heroSlides.length);
    }, 4200);

    return () => window.clearInterval(timer);
  }, []);

  const currentSlide = heroSlides[slideIndex];

  return (
    <section className="hero">
      <div className="container">
        <div className="row align-items-center g-4">
          <div className="col-lg-6 hero-copy-col">
            <span className="hero-label">New Arrival Campaign</span>
            <h1 className="hero-title display-5 mb-4">
              {title}
            </h1>
            {text && <p className="hero-text mb-4">{text}</p>}
            <p className="hero-highlights mb-4">
              50+ years of trusted interior fabric expertise
            </p>
            {showButtons && (
              <div className="d-flex flex-wrap gap-2 align-items-center">
                <Link to="/shop" className="btn-accent">
                  Shop Now
                </Link>
                <Link to="/services" className="btn-white-outline">
                  Explore
                </Link>
                <span className="hero-offer-chip">Free swatches + same day consultation</span>
              </div>
            )}
          </div>
          <div className="col-lg-6">
            <div className="hero-img-wrap">
              <span className="hero-orb hero-orb-1" aria-hidden="true"></span>
              <span className="hero-orb hero-orb-2" aria-hidden="true"></span>
              <img
                key={currentSlide.src}
                src={currentSlide.src}
                alt={currentSlide.alt}
                className="img-fluid hero-slide-image"
              />
              <div className="hero-slide-dots" aria-hidden="true">
                {heroSlides.map((item, index) => (
                  <span
                    key={item.src}
                    className={`hero-slide-dot ${index === slideIndex ? "active" : ""}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
