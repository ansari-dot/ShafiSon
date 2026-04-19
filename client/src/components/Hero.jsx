import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { resolveAssetUrl } from "../util/api";
import hero from "../assets/hero.webp";
import hero1 from "../assets/hero1.webp";
import hero2 from "../assets/hero2.webp";
import hero3 from "../assets/hero3.webp";
import hero4 from "../assets/hero4.webp";

const fallbackSlides = [hero, hero1, hero2, hero3, hero4];

export default function Hero({
  slides,
  label,
  title,
  text,
  highlights,
  offerChip,
  primaryBtnText,
  primaryBtnLink,
  secondaryBtnText,
  secondaryBtnLink,
  showButtons,
}) {
  const resolvedSlides = useMemo(
    () => (Array.isArray(slides) && slides.length > 0 ? slides.map(resolveAssetUrl) : fallbackSlides),
    [slides]
  );

  const [current, setCurrent] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const slideContent = {
    0: {
      centered: true,
      lowerButton: true,
      brandButton: true,
    },
    1: {
      label,
      title: "Venetian blinds",
      primaryBtnText,
      centered: false,
    },
    2: {
      label,
      title: "Sofa Sets",
      primaryBtnText,
      centered: false,
    },
    3: {
      label,
      title: "Curtain Collection",
      primaryBtnText,
      centered: true,
    },
    4: {
      label,
      title: "Luxurious Interior",
      primaryBtnText,
      centered: true,
    },
  };
  const activeContent = slideContent[current] || null;

  useEffect(() => {
    setCurrent(0);
  }, [slides]);

  useEffect(() => {
    if (resolvedSlides.length <= 1) return undefined;

    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % resolvedSlides.length);
    }, 4000);

    return () => clearInterval(timer);
  }, [resolvedSlides.length]);

  // Preload all images
  useEffect(() => {
    resolvedSlides.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, [resolvedSlides]);

  return (
    <section className="hero-with-banner" style={{ height: '120vh' }}>
      {resolvedSlides.map((slide, index) => (
        <img
          key={index}
          src={slide}
          alt={`ShafiSons hero banner ${index + 1}`}
          className={`hero-slide ${index === current ? "hero-slide-active" : ""}`}
          loading="eager"
          fetchPriority="high"
          decoding="async"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: index === current ? 1 : 0,
            transition: 'opacity 0.5s ease-in-out'
          }}
        />
      ))}
      <div className="hero-overlay"></div>
      <div className={`hero-content-wrap ${activeContent?.centered ? "hero-content-wrap-centered" : ""}`}>
        <div className="container">
          <div className={`hero-content-panel ${activeContent?.centered ? "hero-content-panel-centered" : ""}`}>
            {activeContent?.label ? <span className="hero-eyebrow">{activeContent.label}</span> : null}
            {activeContent?.title ? <h1 className="hero-title">{activeContent.title}</h1> : null}

            {showButtons ? (
              <div className={`hero-cta-row ${activeContent?.centered ? "hero-cta-row-centered" : ""} ${activeContent?.lowerButton ? "hero-cta-row-lower" : ""}`}>
                {activeContent?.primaryBtnText ? (
                  <Link
                    to={primaryBtnLink || "/shop"}
                    className={`hero-cta-primary ${activeContent?.brandButton ? "hero-cta-primary-brand" : ""}`}
                  >
                    {activeContent.primaryBtnText}
                  </Link>
                ) : null}
                {activeContent?.title === "Sofa Sets" && secondaryBtnText ? (
                  <Link
                    to={secondaryBtnLink || "/contact"}
                    className="hero-cta-secondary"
                  >
                    {secondaryBtnText}
                  </Link>
                ) : null}
              </div>
            ) : null}
          </div>
        </div>
      </div>
      <div className="hero-dots">
        {resolvedSlides.map((_, i) => (
          <button
            key={i}
            className={`hero-dot ${i === current ? "hero-dot-active" : ""}`}
            onClick={() => setCurrent(i)}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
