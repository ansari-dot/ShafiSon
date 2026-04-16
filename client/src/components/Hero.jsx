import heroBannerImage from "../assets/hero.webp";

export default function Hero() {
  return (
    <section className="hero-with-banner">
      <img
        src={heroBannerImage}
        alt="ShafiSons hero banner"
        className="hero-banner-media"
        loading="eager"
        fetchPriority="high"
        decoding="async"
      />
      <div className="hero-overlay"></div>
    </section>
  );
}
