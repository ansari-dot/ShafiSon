import { useEffect, useState } from "react";
import { apiGet } from "../util/api";

export default function Categories() {
  const [items, setItems] = useState([]);
  const [section, setSection] = useState(null);

  useEffect(() => {
    let active = true;
    apiGet("/api/home-categories")
      .then((doc) => {
        if (!active) return;
        if (doc && doc.categoryIds && doc.categoryIds.length) {
          setSection(doc);
          apiGet(`/api/categories?ids=${doc.categoryIds.join(",")}`)
            .then((list) => {
              if (!active) return;
              setItems(Array.isArray(list) ? list : []);
            })
            .catch(() => {
              if (!active) return;
              setItems([]);
            });
        } else {
          setSection(null);
          apiGet("/api/categories")
            .then((list) => {
              if (!active) return;
              setItems(Array.isArray(list) ? list.slice(0, 3) : []);
            })
            .catch(() => {
              if (!active) return;
              setItems([]);
            });
        }
      })
      .catch(() => {
        if (!active) return;
        setSection(null);
        setItems([]);
      });
    return () => { active = false; };
  }, []);

  if (!items.length) return null;

  return (
    <section className="section-pad pb-0">
      <div className="container">
        <div className="section-heading text-center mb-5">
          <span className="section-label">{section?.title || "Browse"}</span>
          <h2 className="fs-2 fw-bold text-dark mt-1">{section?.heading || "Shop by Category"}</h2>
          <p className="mt-2">{section?.text || "Find the perfect piece for every room in your home."}</p>
        </div>
        <div className="row g-4">
          {items.map((cat) => (
            <div className="col-6 col-md-3" key={cat._id}>
              <a href="/shop" className="category-card">
                <div className="category-card-img">
                  <img src={cat.img} alt={cat.name} className="img-fluid" />
                </div>
                <div className="category-card-body">
                  <h3 className="fs-6 fw-semibold text-dark mb-0">{cat.name}</h3>
                  <span className="small text-muted">{cat.count} items</span>
                </div>
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
