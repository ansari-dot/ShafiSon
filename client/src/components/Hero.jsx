import { useState, useEffect } from "react";
import { resolveAssetUrl } from "../util/api";
import hero from "../assets/hero.webp";
import hero1 from "../assets/hero1.webp";
import hero2 from "../assets/hero2.webp";

const fallbackSlides = [hero, hero1, hero2];

export default function Hero({ slides }) {
  const resolvedSlides =
    Array.isArray(slides) && slides.length > 0
      ? slides.map(resolveAssetUrl)
      : fallbackSlides;

  const [current, setCurrent] = useState(0);

  useEffect(() => {
    setCurrent(0);
  }, [slides]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % resolvedSlides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [resolvedSlides.length]);

  return (
    <section className="hero-with-banner">
      {resolvedSlides.map((src, i) => (
        <img
          key={i}
          src={src}
          alt={`ShafiSons hero banner ${i + 1}`}
          className={`hero-slide ${i === current ? "hero-slide-active" : ""}`}
          loading={i === 0 ? "eager" : "lazy"}
          fetchPriority={i === 0 ? "high" : "auto"}
          decoding="async"
        />
      ))}
      <div className="hero-overlay"></div>
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
