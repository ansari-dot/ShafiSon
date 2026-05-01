import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { formatPKR } from "../util/formatCurrency";
import { addToCart } from "../util/cart";
import { getWishlist, removeFromWishlist } from "../wishlist";
import { apiGet } from "../util/api";
import { getQuantity, isLowStock, isOutOfStock } from "../util/stock";

export default function Wishlist() {
  const [items, setItems] = useState([]);
  const [browseItems, setBrowseItems] = useState([]);
  const [stockById, setStockById] = useState({});

  const refresh = () => setItems(getWishlist());

  useEffect(() => {
    refresh();
    const update = () => refresh();
    window.addEventListener("wishlist:updated", update);
    return () => window.removeEventListener("wishlist:updated", update);
  }, []);

  useEffect(() => {
    let active = true;
    apiGet("/api/products")
      .then((list) => {
        if (!active) return;
        const products = Array.isArray(list) ? list : [];
        setBrowseItems(products.slice(0, 3));
        const map = {};
        products.forEach((p) => { map[p._id] = p; });
        setStockById(map);
      })
      .catch(() => {
        if (!active) return;
        setBrowseItems([]);
      });
    return () => {
      active = false;
    };
  }, []);

  const moveToCart = (item) => {
    const stockProduct = stockById[item.id];
    if (!stockProduct || isOutOfStock(stockProduct)) return;
    addToCart({
      id: item.id,
      title: item.title,
      img: item.img,
      unitPrice: Number(item.price || 0),
      originalPrice: Number(item.price || 0),
      priceUnit: item.priceUnit || 'per yard',
      isDeal: false,
      quantity: getQuantity(stockProduct),
    }, 1);
    removeFromWishlist(item.id);
  };

  return (
    <main className="wl-page">
      <section className="wl-section">
        <div className="container">
          <div className="wl-head">
            <h1 className="wl-title">Wishlist</h1>
            <p className="wl-sub">Products you saved for later.</p>
          </div>

          {items.length === 0 ? (
            <div className="wl-empty">
              <h3>Your wishlist is empty</h3>
              <p>Tap the heart icon on products to save them here.</p>
              <Link to="/shop" className="btn-dark d-inline-block">Explore Shop</Link>
            </div>
          ) : (
            <div className="wl-grid">
              {items.map((item) => {
                const stockProduct = stockById[item.id];
                const outOfStock = !stockProduct || isOutOfStock(stockProduct);
                const lowStock = stockProduct ? isLowStock(stockProduct) : false;
                const qty = stockProduct ? getQuantity(stockProduct) : 0;
                return (
                <article key={item.id} className="wl-card">
                  <Link to={`/shop/${item.id}`} className="wl-img-wrap">
                    <img src={item.img} alt={item.title} className="wl-img" />
                  </Link>
                  <p className="wl-cat">{item.category || "Product"}</p>
                  <Link to={`/shop/${item.id}`} className="wl-name">{item.title}</Link>
                  <div className="wl-price-row">
                    <strong className="wl-price">{formatPKR(item.price)}</strong>
                    <span className="wl-price-unit">{item.priceUnit || 'per yard'}</span>
                  </div>
                  <div className="wl-actions">
                    {lowStock && <span className="wl-stock-badge wl-stock-badge-low">Low Stock ({qty} left)</span>}
                    <button className={`wl-btn wl-btn-primary ${outOfStock ? "disabled" : ""}`} onClick={() => moveToCart(item)} disabled={outOfStock}>{outOfStock ? "Out of Stock" : "Move to Cart"}</button>
                    <button className="wl-btn" onClick={() => removeFromWishlist(item.id)}>Remove</button>
                  </div>
                </article>
              );
              })}
            </div>
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






