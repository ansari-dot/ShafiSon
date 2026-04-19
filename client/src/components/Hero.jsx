import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { resolveAssetUrl } from "../util/api";
import hero from "../assets/hero.webp";

const fallbackSlides = [hero];

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
  const slideContent = {
    0: {
      primaryBtnText: "Explore More",
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

  return (
    <section className="hero-with-banner">
      <img
        key={current}
        src={resolvedSlides[current]}
        alt={`ShafiSons hero banner ${current + 1}`}
        className="hero-slide hero-slide-active"
        loading="eager"
        fetchPriority="high"
        decoding="async"
      />
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
