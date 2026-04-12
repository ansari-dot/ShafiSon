import re

with open(r'E:\myshop\client\src\pages\Shop.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

new_card = '''/* -- Product Card -- */
function ProductCard({ item, view, wished, onWish, deal, getDealPrice, isDealActive }) {
  const isList = view === "list";
  const dealActive = item?.isDeal && isDealActive(deal);
  const outOfStock = isOutOfStock(item);
  const lowStock = isLowStock(item);
  const quantity = getQuantity(item);
  const dealPrice = dealActive ? getDealPrice(item.price, deal) : null;
  const colorImages = [item.img, ...(item.colors || []).filter(c => c.image).map(c => c.image)].filter(Boolean);
  const [hovered, setHovered] = useState(false);
  const [imgIdx, setImgIdx] = useState(0);
  useEffect(() => {
    if (!hovered || colorImages.length <= 1) { setImgIdx(0); return; }
    const id = setInterval(() => setImgIdx(i => (i + 1) % colorImages.length), 800);
    return () => clearInterval(id);
  }, [hovered, colorImages.length]);
  const displayImg = colorImages[imgIdx] || item.img;
  const handleAdd = () => {
    if (outOfStock) return;
    const unitPrice = dealActive ? dealPrice : item.price;
    addToCart({ id: item._id, title: item.title, img: item.img, unitPrice: Number(unitPrice || 0), originalPrice: Number(item.price || 0), isDeal: !!item.isDeal }, 1);
  };
  return (
    <motion.div
      className={`sp-card ${isList ? "sp-card-list" : ""}`}
      variants={revealUp} initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.2 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setImgIdx(0); }}
    >
      <div className="sp-card-img-wrap">
        <Link to={`/shop/${item._id}`}>
          <img src={displayImg} alt={item.title} className="sp-card-img" />
        </Link>
        {item.badge && <span className={`sp-badge sp-badge-${item.badge.toLowerCase()}`}>{item.badge}</span>}
        {outOfStock && <span className="sp-stock-badge sp-stock-badge-out">Out of Stock</span>}
        {lowStock && <span className="sp-stock-badge sp-stock-badge-low">Low Stock ({quantity} left)</span>}
        <div className="sp-card-actions">
          <button className="sp-action-btn" onClick={() => onWish(item)} aria-label="Wishlist" style={{ color: wished ? "#ef4444" : undefined }}>
            <HeartIcon active={wished} />
          </button>
          <button className="sp-action-btn" aria-label="Quick view"><EyeIcon /></button>
        </div>
        <button className={`sp-add-cart-btn ${outOfStock ? "disabled" : ""}`} onClick={handleAdd} disabled={outOfStock}>
          <CartIcon /> {outOfStock ? "Out of Stock" : "Add to Cart"}
        </button>
      </div>
      <div className="sp-card-body">
        <span className="sp-card-cat">{item.category}</span>
        <Link to={`/shop/${item._id}`}>
          <h3 className="sp-card-title">{item.title}</h3>
        </Link>
        <div className="sp-card-rating">
          <Stars rating={item.rating || 0} />
          <span className="sp-card-rating-num">{item.rating || 0}</span>
          <span className="sp-card-reviews">({item.reviews || 0} reviews)</span>
        </div>
        {isList && <p className="sp-card-desc">Handcrafted with premium {item.material?.toLowerCase() || "materials"}.</p>}
        <div className="sp-card-footer">
          {dealActive ? (
            <div className="sp-card-price">
              <strong>{formatPKR(dealPrice)}</strong>
              <span style={{ marginLeft: "0.5rem", textDecoration: "line-through", color: "#9ca3af", fontWeight: 600 }}>{formatPKR(item.price)}</span>
            </div>
          ) : (
            <strong className="sp-card-price">{formatPKR(item.price)}</strong>
          )}
          {isList && <button className={`sp-list-cart-btn ${outOfStock ? "disabled" : ""}`} onClick={handleAdd} disabled={outOfStock}><CartIcon /> {outOfStock ? "Out of Stock" : "Add to Cart"}</button>}
        </div>
      </div>
    </motion.div>
  );
}

'''

start = content.index('/* -- Product Card -- */')
end = content.index('/* -- Main Page -- */')
content = content[:start] + new_card + content[end:]

with open(r'E:\myshop\client\src\pages\Shop.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

print('done')
