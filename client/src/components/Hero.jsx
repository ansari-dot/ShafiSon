import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { resolveAssetUrl } from "../util/api";
import hero from "../assets/hero.webp";
import hero1 from "../assets/hero1-opt.webp";
import hero2 from "../assets/hero2-opt.webp";
import hero3 from "../assets/hero3-opt.webp";
import hero4 from "../assets/hero4-opt.webp";

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
  // Track which slide indexes have been loaded into DOM
  const [loaded, setLoaded] = useState(() => new Set([0]));

  const slideContent = {
    0: { centered: true, brandButton: false },
    1: { label: "Smart. Modern.", title: "Blinds", primaryBtnText, centered: false },
    2: { label: "Tradition. Comfort", title: "Floor Seating", primaryBtnText, centered: false },
    3: { label: "Texture. Possibility.", title: "Upholstery Fabrics", primaryBtnText, centered: true },
    4: { label: "Fabric. Elegance.", title: "Fabric. Elegance.", primaryBtnText, centered: true },
  };
  const activeContent = slideContent[current] || null;

  useEffect(() => {
    setCurrent(0);
    setLoaded(new Set([0]));
  }, [slides]);

  useEffect(() => {
    if (resolvedSlides.length <= 1) return undefined;

    const timer = setInterval(() => {
      setCurrent((prev) => {
        const next = (prev + 1) % resolvedSlides.length;
        // Add next slide to DOM just before it becomes active
        setLoaded((l) => {
          if (l.has(next)) return l;
          const n = new Set(l);
          n.add(next);
          return n;
        });
        return next;
      });
    }, 8000);

    return () => clearInterval(timer);
  }, [resolvedSlides.length]);

  // Preload the next slide's image 3s before it shows
  useEffect(() => {
    const preloadTimer = setTimeout(() => {
      const next = (current + 1) % resolvedSlides.length;
      setLoaded((l) => {
        if (l.has(next)) return l;
        const n = new Set(l);
        n.add(next);
        return n;
      });
    }, 5000);
    return () => clearTimeout(preloadTimer);
  }, [current, resolvedSlides.length]);

  return (
    <section className="hero-with-banner">
      {resolvedSlides.map((slide, index) => {
        if (!loaded.has(index)) return null;
        return (
          <img
            key={index}
            src={slide}
            alt={`ShafiSons hero banner ${index + 1}`}
            className={`hero-slide ${index === current ? "hero-slide-active" : ""}`}
            loading={index === 0 ? "eager" : "lazy"}
            fetchPriority={index === 0 ? "high" : "auto"}
            decoding={index === 0 ? "sync" : "async"}
            width="2005"
            height="1128"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              opacity: index === current ? 1 : 0,
              transition: 'opacity 0.6s ease-in-out',
            }}
          />
        );
      })}
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
                {activeContent?.title === "Floor Seating" && secondaryBtnText ? (
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
            onClick={() => {
              setLoaded((l) => { const n = new Set(l); n.add(i); return n; });
              setCurrent(i);
            }}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
