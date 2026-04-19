import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiGet, resolveAssetUrl } from "../util/api";
import { formatPKR } from "../util/formatCurrency";

const EyeIcon = () => (
  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const HeartIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);
const CartIcon = () => (
  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 9m12-9l2 9M9 21a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm6 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" />
  </svg>
);

function SectionDivider() {
  return (
    <div className="home-section-divider">
      <span className="home-section-divider-line" />
      <span className="home-section-divider-dot" />
      <span className="home-section-divider-dot" />
      <span className="home-section-divider-dot" />
      <span className="home-section-divider-line" />
    </div>
  );
}

function ProductCard({ item }) {
  const [hovered, setHovered] = useState(false);
  const mainImg = resolveAssetUrl(item?.img);
  const hoverImg = Array.isArray(item?.imgs)
    ? item.imgs.map(resolveAssetUrl).find((src) => src && src !== mainImg) || null
    : null;

  return (
    <div className="home-collection-modern-card">
      <Link
        to={`/shop/${item._id}`}
        className="home-collection-modern-image"
        style={{ display: "block" }}
        onMouseEnter={() => hoverImg && setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div className="home-collection-modern-overlay" aria-hidden="true" />
        {(item.badge || item.isDeal) && (
          <div className="home-collection-modern-badge">{item.badge || "Deal"}</div>
        )}
        <div className="home-collection-modern-actions" aria-hidden="true">
          <span className="home-collection-modern-action"><EyeIcon /></span>
          <span className="home-collection-modern-action"><HeartIcon /></span>
          <span className="home-collection-modern-action"><CartIcon /></span>
        </div>
        <div className="home-collection-modern-cta" aria-hidden="true">Shop Now →</div>
        <img
          src={hovered && hoverImg ? hoverImg : mainImg}
          alt={item.title}
          loading="lazy"
          style={{ transition: "opacity 0.25s ease" }}
        />
      </Link>
      <div className="home-collection-modern-info">
        <h3 className="home-collection-modern-name">{item.title}</h3>
        <p className="home-collection-modern-price">
          {formatPKR(item.price)}<span className="text-xs text-gray-500 ml-1">/ {item.priceUnit || "per yard"}</span>
        </p>
      </div>
    </div>
  );
}

export default function CategorySections({ initialSections }) {
  const [sections, setSections] = useState(() => (Array.isArray(initialSections) ? initialSections : []));

  useEffect(() => {
    if (Array.isArray(initialSections) && initialSections.length) return undefined;
    let active = true;
    apiGet("/api/category-sections")
      .then(async (list) => {
        if (!active) return;
        const activeSections = (Array.isArray(list) ? list : []).filter((s) => s.active && s.productIds?.length);
        const withProducts = await Promise.all(
          activeSections.map(async (sec) => {
            try {
              const products = await apiGet(`/api/products?ids=${sec.productIds.join(",")}`);
              return { ...sec, products: Array.isArray(products) ? products : [] };
            } catch {
              return { ...sec, products: [] };
            }
          })
        );
        if (!active) return;
        setSections(withProducts.filter((s) => s.products.length > 0));
      })
      .catch(() => { if (!active) return; setSections([]); });
    return () => { active = false; };
  }, [initialSections]);

  if (!sections.length) return null;

  return (
    <>
      {sections.map((sec, idx) => (
        <div key={sec._id}>
          {idx > 0 && <SectionDivider />}
          <section className="section-pad home-collection-modern">
            <div className="container">
              <div className="text-center mb-5">
                <span className="section-label">{sec.title}</span>
                <h2 className="home-collection-modern-title">{sec.heading}</h2>
                {sec.text && <p className="home-collection-modern-sub">{sec.text}</p>}
              </div>

              <div className="cat-section-grid">
                {sec.products.map((item) => (
                  <ProductCard key={item._id} item={item} />
                ))}
              </div>

              <div className="text-center mt-4">
                <Link to="/shop" className="btn-dark d-inline-flex align-items-center gap-2">
                  View All <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>
          </section>
        </div>
      ))}
    </>
  );
}
