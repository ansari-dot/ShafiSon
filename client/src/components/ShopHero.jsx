export default function ShopHero() {
  return (
    <section className="shop-hero">
      <div className="container">
        <div className="shop-hero-inner">

          <div className="shop-hero-left">
            {/* Breadcrumb */}
            <nav className="shop-breadcrumb" aria-label="breadcrumb">
              <a href="/">Home</a>
              <span className="shop-breadcrumb-sep">
                <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </span>
              <span>Shop</span>
            </nav>
            <h1 className="shop-hero-title">Shop at shafisons</h1>
            <p className="shop-hero-sub">
              Discover premium fabric collections by shafisons, designed to match every interior style — from modern to traditional.
            </p>
            <div className="mt-3">
              <strong className="d-block mb-2">Categories</strong>
              <ul className="list-unstyled mb-3">
                <li>Curtain Fabrics by shafisons</li>
                <li>Sofa Fabrics by shafisons</li>
                <li>Office Blinds by shafisons</li>
              </ul>
              <strong className="d-block mb-2">Product Example</strong>
              <p className="mb-2">Luxury Pattern Curtain – by shafisons</p>
              <p className="mb-3">High-quality fabric with elegant design</p>
              <a href="/contact" className="btn-dark d-inline-block">Order via WhatsApp</a>
            </div>
          </div>

          {/* Quick stats */}
          <div className="shop-hero-stats">
            {[
              { value: "200+", label: "Products" },
              { value: "12", label: "Categories" },
              { value: "Free", label: "Shipping" },
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

