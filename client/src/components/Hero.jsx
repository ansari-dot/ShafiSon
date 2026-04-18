import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { resolveAssetUrl } from "../util/api";
import hero from "../assets/hero.webp";
import hero1 from "../assets/hero1.jpeg";
import hero2 from "../assets/hero2.jpeg";
import hero3 from "../assets/hero3.jpeg";
import hero4 from "../assets/hero4.jpeg";


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
  const resolvedSlides =
    Array.isArray(slides) && slides.length > 0
      ? slides.map(resolveAssetUrl)
      : fallbackSlides;

  const [current, setCurrent] = useState(0);
  const [loadedSlides, setLoadedSlides] = useState(() =>
    resolvedSlides.map((_, index) => index === 0)
  );
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
    setLoadedSlides(resolvedSlides.map((_, index) => index === 0));
  }, [slides]);

  useEffect(() => {
    let cancelled = false;

    resolvedSlides.forEach((src, index) => {
      if (index === 0) return;

      const image = new Image();
      image.src = src;

      const markLoaded = () => {
        if (cancelled) return;
        setLoadedSlides((prev) => {
          if (prev[index]) return prev;
          const next = [...prev];
          next[index] = true;
          return next;
        });
      };

      if (image.complete) {
        markLoaded();
        return;
      }

      image.onload = markLoaded;
      image.onerror = markLoaded;
    });

    return () => {
      cancelled = true;
    };
  }, [resolvedSlides]);

  useEffect(() => {
    if (resolvedSlides.length <= 1) return undefined;

    const timer = setInterval(() => {
      setCurrent((prev) => {
        for (let offset = 1; offset <= resolvedSlides.length; offset += 1) {
          const nextIndex = (prev + offset) % resolvedSlides.length;
          if (loadedSlides[nextIndex]) {
            return nextIndex;
          }
        }
        return prev;
      });
    }, 4000);

    return () => clearInterval(timer);
  }, [loadedSlides, resolvedSlides.length]);

  return (
    <section className="hero-with-banner">
      {resolvedSlides.map((src, i) => (
        <img
          key={i}
          src={src}
          alt={`ShafiSons hero banner ${i + 1}`}
          className={`hero-slide ${i === current ? "hero-slide-active" : ""}`}
          loading="eager"
          fetchPriority={i === 0 ? "high" : "auto"}
          decoding="async"
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
