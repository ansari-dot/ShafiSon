import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

const fallbackSlides = [
  { src: "/images/couch.png", alt: "Premium couch set" },
  { src: "/images/sofa.png", alt: "Luxury sofa collection" },
  { src: "/images/product-1.png", alt: "Featured decor product" },
  { src: "/images/product-2.png", alt: "Modern fabric collection" },
];

export default function Hero({
  title,
  text,
  showButtons = false,
  label = "New Arrival Campaign",
  highlights = "50+ years of trusted interior fabric expertise",
  primaryBtnText = "Shop Now",
  primaryBtnLink = "/shop",
  secondaryBtnText = "Explore",
  secondaryBtnLink = "/services",
  offerChip = "Free swatches + same day consultation",
  slides = [],
}) {
  const [slideIndex, setSlideIndex] = useState(0);
  const heroSlides = useMemo(() => {
    if (!Array.isArray(slides)) return fallbackSlides;
    const cleaned = slides
      .map((src) => (typeof src === "string" ? src.trim() : ""))
      .filter(Boolean)
      .map((src, index) => ({ src, alt: `Hero slide ${index + 1}` }));
    return cleaned.length ? cleaned : fallbackSlides;
  }, [slides]);

  useEffect(() => {
    setSlideIndex(0);
  }, [heroSlides.length]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setSlideIndex((prev) => (prev + 1) % heroSlides.length);
    }, 4200);

    return () => window.clearInterval(timer);
  }, []);

  const currentSlide = heroSlides[slideIndex] || heroSlides[0];

  return (
    <section className="hero">
      <div className="container">
        <div className="row align-items-center g-4">
          <div className="col-lg-6 hero-copy-col">
            <span className="hero-label">{label}</span>
            <h1 className="hero-title display-5 mb-4">
              {title}
            </h1>
            {text && <p className="hero-text mb-4">{text}</p>}
            <p className="hero-highlights mb-4">{highlights}</p>
            {showButtons && (
              <div className="d-flex flex-wrap gap-2 align-items-center">
                <Link to={primaryBtnLink || "/shop"} className="btn-accent">
                  {primaryBtnText || "Shop Now"}
                </Link>
                <Link to={secondaryBtnLink || "/services"} className="btn-white-outline">
                  {secondaryBtnText || "Explore"}
                </Link>
                <span className="hero-offer-chip">{offerChip}</span>
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
