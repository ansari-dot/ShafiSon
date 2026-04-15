import heroBannerImage from "../assets/hero.png";

export default function Hero() {
  return (
    <section className="hero-with-banner" style={{ backgroundImage: `url(${heroBannerImage})` }}>
      <div className="hero-overlay"></div>
    </section>
  );
}
