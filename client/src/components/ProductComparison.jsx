import { useEffect, useMemo, useState } from "react";
import { apiGet } from "../util/api";

const defaultSpecs = ["Material", "Dimensions", "Weight", "Warranty", "Assembly"];

const CheckIcon = () => (
  <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);

const specIcons = {
  Material:   <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 10V11" /></svg>,
  Dimensions: <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M4 8V4m0 0h4M4 4l5 5M20 8V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5M20 16v4m0 0h-4m4 0l-5-5" /></svg>,
  Weight:     <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M3 6l3 1m0 0l-3 9a5 5 0 0 0 6.027 6.027L12 21l2.973.027A5 5 0 0 0 21 16l-3-9m-6 0h6" /></svg>,
  Warranty:   <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>,
  Assembly:   <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 0 0-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 0 0-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 0 0-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 0 0-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 0 0 1.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><circle cx="12" cy="12" r="3" /></svg>,
};

export default function ProductComparison() {
  const [active, setActive] = useState(0);
  const [section, setSection] = useState(null);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    let activeReq = true;
    apiGet("/api/compare-section")
      .then((doc) => {
        if (!activeReq) return;
        if (doc && doc.productIds && doc.productIds.length) {
          setSection(doc);
          apiGet(`/api/products?ids=${doc.productIds.join(",")}`)
            .then((list) => {
              if (!activeReq) return;
              setProducts(Array.isArray(list) ? list : []);
            })
            .catch(() => {
              if (!activeReq) return;
              setProducts([]);
            });
        } else {
          setSection(null);
          setProducts([]);
        }
      })
      .catch(() => {
        if (!activeReq) return;
        setSection(null);
        setProducts([]);
      });
    return () => { activeReq = false; };
  }, []);

  const specs = useMemo(() => {
    if (!products.length) return defaultSpecs;
    const keys = new Set();
    products.forEach((p) => {
      const s = p.specs || {};
      Object.keys(s).forEach((k) => keys.add(k));
    });
    const arr = Array.from(keys);
    return arr.length ? arr : defaultSpecs;
  }, [products]);

  const specValues = useMemo(() => {
    if (!products.length) return [];
    return products.map((p) => {
      const s = p.specs || {};
      return specs.map((k) => s[k] || "-");
    });
  }, [products, specs]);

  if (!products.length) return null;

  return (
    <section className="section-pad compare-section">
      <div className="container">
        <div className="text-center mb-5">
          <span className="section-label">{section?.title || "Compare"}</span>
          <h2 className="fs-2 fw-bold text-dark mt-1">{section?.heading || "Find Your Perfect Fit"}</h2>
          <p className="mt-2">{section?.text || "Not sure which to pick? Compare our top sellers side by side."}</p>
        </div>

        {/* ── Desktop table ── */}
        <div className="cmp-table-wrap">
          <table className="cmp-table">
            <thead>
              <tr>
                <th className="cmp-th-label" />
                {products.map((p) => (
                  <th key={p._id} className="cmp-th-product">
                    <div className="cmp-product-img-wrap">
                      <img src={p.img} alt={p.title} className="cmp-product-img" />
                    </div>
                    <strong className="cmp-product-name">{p.title}</strong>
                    <span className="cmp-product-price">{p.price}</span>
                    <a href={`/shop/${p._id}`} className="cmp-add-btn">View</a>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {specs.map((spec, i) => (
                <tr key={spec} className={i % 2 === 0 ? "cmp-row-alt" : ""}>
                  <td className="cmp-spec-label">
                    <span className="cmp-spec-icon">{specIcons[spec] || <CheckIcon />}</span>
                    {spec}
                  </td>
                  {specValues.map((vals, j) => (
                    <td key={j} className="cmp-spec-val">
                      <span className="cmp-check"><CheckIcon /></span>
                      {vals[i]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ── Mobile cards ── */}
        <div className="cmp-mobile">
          <div className="cmp-tabs">
            {products.map((p, i) => (
              <button
                key={p._id}
                className={`cmp-tab ${active === i ? "cmp-tab-active" : ""}`}
                onClick={() => setActive(i)}
              >
                <img src={p.img} alt={p.title} className="cmp-tab-img" />
                <span className="cmp-tab-name">{p.title}</span>
              </button>
            ))}
          </div>

          <div className="cmp-card">
            <div className="cmp-card-top">
              <img src={products[active].img} alt={products[active].title} className="cmp-card-img" />
              <div className="cmp-card-info">
                <strong className="cmp-card-name">{products[active].title}</strong>
                <span className="cmp-card-price">{products[active].price}</span>
                <a href={`/shop/${products[active]._id}`} className="cmp-add-btn cmp-add-btn-full">View</a>
              </div>
            </div>
            <div className="cmp-card-specs">
              {specs.map((spec, i) => (
                <div key={spec} className="cmp-card-spec-row">
                  <span className="cmp-card-spec-key">
                    <span className="cmp-spec-icon">{specIcons[spec] || <CheckIcon />}</span>
                    {spec}
                  </span>
                  <span className="cmp-card-spec-val">{specValues[active][i]}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="cmp-dots">
            {products.map((_, i) => (
              <button
                key={i}
                className={`cmp-dot ${active === i ? "cmp-dot-active" : ""}`}
                onClick={() => setActive(i)}
                aria-label={`View product ${i + 1}`}
              />
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
