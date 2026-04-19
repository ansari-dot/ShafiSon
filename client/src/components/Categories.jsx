import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiGet } from "../util/api";

export default function Categories({ initialItems }) {
  const [items, setItems] = useState(() => (Array.isArray(initialItems) ? initialItems : []));

  useEffect(() => {
    if (Array.isArray(initialItems) && initialItems.length) return undefined;
    let active = true;
    apiGet("/api/categories")
      .then((list) => {
        if (!active) return;
        setItems(Array.isArray(list) ? list : []);
      })
      .catch(() => {
        if (!active) return;
        setItems([]);
      });
    return () => {
      active = false;
    };
  }, [initialItems]);

  if (!items.length) return null;
  const movingItems = [...items, ...items];

  return (
    <section className="categories-showcase" style={{ padding: '2rem 0 1rem' }}>
      <div className="container">
        <div className="section-heading text-center mb-4">
          <span className="section-label">Browse</span>
          <h2 className="fs-2 fw-bold text-dark mt-1">Shop by Category</h2>
          <p className="mt-2 mb-0">Find the perfect piece for every room in your home.</p>
        </div>

        <div className="categories-orb-marquee" aria-label="Shop categories">
          <div className="categories-orb-track">
            {movingItems.map((cat, index) => (
              <Link to={`/shop?category=${encodeURIComponent(cat.name)}`} className="category-orb" key={`${cat._id}-${index}`}>
                <div className="category-orb-media">
                  <img src={cat.img} alt={cat.name} className="img-fluid" loading="lazy" />
                  <span className="category-orb-glow" aria-hidden="true" />
                </div>
                <div className="category-orb-body">
                  <h3 className="fs-6 fw-semibold text-dark mb-0">{cat.name}</h3>
                  <span className="small text-muted">{cat.count || 0} items</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
