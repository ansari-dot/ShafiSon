import { formatPKR } from "../util/formatCurrency";

export default function PromoBar() {
  return (
    <div className="promo-bar">
      <div className="container">
        <p className="mb-0 text-center small">
          Free shipping on all orders over <strong>{formatPKR(99)}</strong> - Limited time offer!{" "}
          <a href="/shop" className="promo-bar-link">Shop Now -&gt;</a>
        </p>
      </div>
    </div>
  );
}
