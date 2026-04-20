export default function ShopHero() {
  return (
    <section className="shop-hero">
      <div className="container">
        <div className="shop-hero-inner">
          <div className="shop-hero-left">
            <nav className="shop-breadcrumb" aria-label="breadcrumb">
              <a href="/">Home</a>
              <span className="shop-breadcrumb-sep">
                <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </span>
              <span>Shop</span>
            </nav>

            <h1 className="shop-hero-title">Refined Collections For Modern Interiors</h1>
            <p className="shop-hero-sub">
              Discover premium curtain fabrics, sofa textiles, and blinds curated for elegant spaces.
            </p>

            <div className="shop-hero-cats">
              <span>Curtain Fabrics</span>
              <span>Sofa Fabrics</span>
              <span>Office Blinds</span>
            </div>

            <div className="shop-hero-cta-row">
              <a href="/contact" className="shop-hero-link">Order via WhatsApp</a>
              <a href="/consultation" className="shop-hero-link">Book Interior Consultation</a>
            </div>
          </div>

          <div className="shop-hero-stats">
            {[
              { value: "200+", label: "Products" },
              { value: "12+", label: "Collections" },
              { value: "Since 1975", label: "Trusted Craft" },
            ].map((s) => (
              <div className="shop-hero-stat" key={s.label}>
                <strong>{s.value}</strong>
                <span>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}