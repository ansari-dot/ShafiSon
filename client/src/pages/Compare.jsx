import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { formatPKR } from "../util/formatCurrency";
import { getCompare, removeFromCompare, clearCompare } from "../compare";
import { apiGet } from "../util/api";

const StarIcon = ({ filled = true }) => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.5">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);

function Stars({ rating }) {
  const displayRating = Math.round(rating || 0);
  return (
    <span style={{ display: "inline-flex", gap: "2px" }}>
      {[1,2,3,4,5].map(i => (
        <span key={i} style={{ color: i <= displayRating ? "#d97706" : "#dce5e4" }}>
          <StarIcon filled={i <= displayRating} />
        </span>
      ))}
    </span>
  );
}

export default function Compare() {
  const [items, setItems] = useState([]);
  const [fullProducts, setFullProducts] = useState({});
  const [browseItems, setBrowseItems] = useState([]);

  const refresh = () => setItems(getCompare());

  useEffect(() => {
    refresh();
    const update = () => refresh();
    window.addEventListener("compare:updated", update);
    return () => window.removeEventListener("compare:updated", update);
  }, []);

  useEffect(() => {
    let active = true;
    if (items.length === 0) return;
    const ids = items.map(i => i.id).join(",");
    apiGet(`/api/products?ids=${ids}`)
      .then((list) => {
        if (!active) return;
        const products = Array.isArray(list) ? list : [];
        const map = {};
        products.forEach((p) => { map[p._id] = p; });
        setFullProducts(map);
      })
      .catch(() => {
        if (!active) return;
      });
    return () => { active = false; };
  }, [items]);

  useEffect(() => {
    let active = true;
    apiGet("/api/products")
      .then((list) => {
        if (!active) return;
        const products = Array.isArray(list) ? list : [];
        setBrowseItems(products.slice(0, 3));
      })
      .catch(() => {
        if (!active) return;
        setBrowseItems([]);
      });
    return () => { active = false; };
  }, []);

  const getFeatures = (id) => {
    const product = fullProducts[id];
    if (!product) return [];
    return [
      { label: "Material", value: product.material || "N/A" },
      { label: "Category", value: product.category || "N/A" },
      { label: "Colors", value: product.colors?.length || 0 },
      { label: "Sizes", value: product.sizes?.length || 0 },
      { label: "Stock", value: product.inStock ? "In Stock" : "Out of Stock" },
    ];
  };

  return (
    <main className="wl-page">
      <section className="wl-section">
        <div className="container">
          <div className="wl-head">
            <h1 className="wl-title">Compare Products</h1>
            <p className="wl-sub">Compare up to 4 products side by side.</p>
          </div>

          {items.length === 0 ? (
            <div className="wl-empty">
              <h3>No products to compare</h3>
              <p>Add products to compare by clicking the compare icon.</p>
              <Link to="/shop" className="btn-dark d-inline-block">Explore Shop</Link>
            </div>
          ) : (
            <>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                <p style={{ fontSize: "14px", color: "#6b7280" }}>
                  Comparing {items.length} of 4 products
                </p>
                <button 
                  onClick={clearCompare}
                  style={{
                    padding: "8px 16px",
                    fontSize: "13px",
                    fontWeight: 600,
                    color: "#ef4444",
                    background: "transparent",
                    border: "1.5px solid #ef4444",
                    borderRadius: "6px",
                    cursor: "pointer",
                    transition: "all 0.2s"
                  }}
                  onMouseOver={(e) => {
                    e.target.style.background = "#ef4444";
                    e.target.style.color = "#fff";
                  }}
                  onMouseOut={(e) => {
                    e.target.style.background = "transparent";
                    e.target.style.color = "#ef4444";
                  }}
                >
                  Clear All
                </button>
              </div>

              <div style={{ overflowX: "auto", marginBottom: "3rem" }}>
                <table style={{ 
                  width: "100%", 
                  borderCollapse: "separate", 
                  borderSpacing: "0 8px",
                  minWidth: "800px"
                }}>
                  <thead>
                    <tr>
                      <th style={{ 
                        padding: "1rem", 
                        textAlign: "left", 
                        fontSize: "13px", 
                        fontWeight: 700,
                        color: "#6b7280",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                        background: "#f9fafb",
                        borderRadius: "8px 0 0 8px"
                      }}>
                        Feature
                      </th>
                      {items.map((item) => (
                        <th key={item.id} style={{ 
                          padding: "1rem", 
                          textAlign: "center",
                          background: "#f9fafb",
                          borderRadius: items.indexOf(item) === items.length - 1 ? "0 8px 8px 0" : "0"
                        }}>
                          <Link to={`/shop/${item.id}`}>
                            <img 
                              src={item.img} 
                              alt={item.title} 
                              style={{ 
                                width: "120px", 
                                height: "120px", 
                                objectFit: "cover", 
                                borderRadius: "8px",
                                marginBottom: "0.75rem"
                              }} 
                            />
                          </Link>
                          <Link 
                            to={`/shop/${item.id}`}
                            style={{ 
                              fontSize: "14px", 
                              fontWeight: 600,
                              color: "#111827",
                              display: "block",
                              marginBottom: "0.5rem",
                              textDecoration: "none"
                            }}
                          >
                            {item.title}
                          </Link>
                          <button
                            onClick={() => removeFromCompare(item.id)}
                            style={{
                              padding: "6px 12px",
                              fontSize: "12px",
                              fontWeight: 600,
                              color: "#ef4444",
                              background: "transparent",
                              border: "1px solid #ef4444",
                              borderRadius: "4px",
                              cursor: "pointer",
                              transition: "all 0.2s"
                            }}
                            onMouseOver={(e) => {
                              e.target.style.background = "#ef4444";
                              e.target.style.color = "#fff";
                            }}
                            onMouseOut={(e) => {
                              e.target.style.background = "transparent";
                              e.target.style.color = "#ef4444";
                            }}
                          >
                            Remove
                          </button>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={{ 
                        padding: "1rem", 
                        fontWeight: 600,
                        fontSize: "14px",
                        background: "#fff",
                        borderRadius: "8px 0 0 8px",
                        border: "1px solid #e5e7eb"
                      }}>
                        Price
                      </td>
                      {items.map((item) => (
                        <td key={item.id} style={{ 
                          padding: "1rem", 
                          textAlign: "center",
                          background: "#fff",
                          border: "1px solid #e5e7eb",
                          borderLeft: "none",
                          borderRadius: items.indexOf(item) === items.length - 1 ? "0 8px 8px 0" : "0"
                        }}>
                          <strong style={{ fontSize: "18px", color: "#111827" }}>
                            {formatPKR(item.price)}
                          </strong>
                          <div style={{ fontSize: "12px", color: "#6b7280", marginTop: "4px" }}>
                            {item.priceUnit}
                          </div>
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td style={{ 
                        padding: "1rem", 
                        fontWeight: 600,
                        fontSize: "14px",
                        background: "#fff",
                        borderRadius: "8px 0 0 8px",
                        border: "1px solid #e5e7eb"
                      }}>
                        Rating
                      </td>
                      {items.map((item) => (
                        <td key={item.id} style={{ 
                          padding: "1rem", 
                          textAlign: "center",
                          background: "#fff",
                          border: "1px solid #e5e7eb",
                          borderLeft: "none",
                          borderRadius: items.indexOf(item) === items.length - 1 ? "0 8px 8px 0" : "0"
                        }}>
                          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
                            <Stars rating={item.rating || 0} />
                            <span style={{ fontSize: "13px", color: "#6b7280" }}>
                              {item.rating || 0} ({item.reviews || 0} reviews)
                            </span>
                          </div>
                        </td>
                      ))}
                    </tr>
                    {getFeatures(items[0]?.id).map((feature, idx) => (
                      <tr key={idx}>
                        <td style={{ 
                          padding: "1rem", 
                          fontWeight: 600,
                          fontSize: "14px",
                          background: "#fff",
                          borderRadius: "8px 0 0 8px",
                          border: "1px solid #e5e7eb"
                        }}>
                          {feature.label}
                        </td>
                        {items.map((item) => {
                          const features = getFeatures(item.id);
                          const value = features[idx]?.value || "N/A";
                          return (
                            <td key={item.id} style={{ 
                              padding: "1rem", 
                              textAlign: "center",
                              fontSize: "14px",
                              color: "#374151",
                              background: "#fff",
                              border: "1px solid #e5e7eb",
                              borderLeft: "none",
                              borderRadius: items.indexOf(item) === items.length - 1 ? "0 8px 8px 0" : "0"
                            }}>
                              {value}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                    <tr>
                      <td style={{ 
                        padding: "1rem", 
                        fontWeight: 600,
                        fontSize: "14px",
                        background: "#fff",
                        borderRadius: "8px 0 0 8px",
                        border: "1px solid #e5e7eb"
                      }}>
                        Action
                      </td>
                      {items.map((item) => (
                        <td key={item.id} style={{ 
                          padding: "1rem", 
                          textAlign: "center",
                          background: "#fff",
                          border: "1px solid #e5e7eb",
                          borderLeft: "none",
                          borderRadius: items.indexOf(item) === items.length - 1 ? "0 8px 8px 0" : "0"
                        }}>
                          <Link 
                            to={`/shop/${item.id}`}
                            style={{
                              display: "inline-block",
                              padding: "10px 20px",
                              fontSize: "13px",
                              fontWeight: 600,
                              color: "#fff",
                              background: "#2e0d10",
                              border: "none",
                              borderRadius: "6px",
                              textDecoration: "none",
                              transition: "all 0.2s"
                            }}
                            onMouseOver={(e) => {
                              e.target.style.background = "#4a1419";
                            }}
                            onMouseOut={(e) => {
                              e.target.style.background = "#2e0d10";
                            }}
                          >
                            View Details
                          </Link>
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </>
          )}

          {browseItems.length > 0 && (
            <section className="wl-browse">
              <div className="wl-browse-head">
                <h3 className="wl-browse-title">Browse More</h3>
                <Link to="/shop" className="wl-browse-link">See All Products</Link>
              </div>
              <div className="wl-browse-grid">
                {browseItems.map((item) => (
                  <Link to={`/shop/${item._id}`} key={item._id} className="wl-browse-card">
                    <div className="wl-browse-img-wrap">
                      <img src={item.img} alt={item.title} className="wl-browse-img" />
                    </div>
                    <p className="wl-browse-name">{item.title}</p>
                    <strong className="wl-browse-price">{formatPKR(item.price)}</strong>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </section>
    </main>
  );
}
