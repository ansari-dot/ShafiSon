const brands = [
  "IKEA", "Herman Miller", "West Elm", "Pottery Barn", "Restoration Hardware", "CB2",
];

export default function BrandLogos() {
  return (
    <section className="brand-logos-section">
      <div className="container">
        <p className="brand-logos-label">Trusted by customers who love</p>
        <div className="brand-logos-track">
          {[...brands, ...brands].map((brand, i) => (
            <span className="brand-logo-item" key={i}>{brand}</span>
          ))}
        </div>
      </div>
    </section>
  );
}
