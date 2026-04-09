import Hero from "../components/Hero";
import { Link, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { apiGet } from "../util/api";
import { clearCart } from "../util/cart";
import { formatPKR } from "../util/formatCurrency";

export default function PaymentConfirmation() {
  const [params] = useSearchParams();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const code = params.get("order");
    if (!code) return;
    apiGet(`/api/orders/${code}`)
      .then((data) => {
        setOrder(data);
        if (data?.paymentStatus === "Paid") {
          clearCart();
        }
      })
      .catch((err) => setError(err.message || "Failed to load order"));
  }, [params]);

  return (
    <main>
      <Hero title="Payment Confirmation" />
      <section className="section-pad">
        <div className="container">
          {error && <div className="alert alert-danger">{error}</div>}
          {!order && !error && <div className="text-center">Loading your order...</div>}
          {order && (
            <div className="bg-white p-4 rounded-3">
              <h3 className="fw-semibold text-dark">Order {order.orderCode}</h3>
              <p className="text-muted mb-3">Payment Status: {order.paymentStatus}</p>
              <div className="small">
                <div className="d-flex justify-content-between">
                  <span>Subtotal</span>
                  <strong>{formatPKR(order.subtotal)}</strong>
                </div>
                {order.discount > 0 && (
                  <div className="d-flex justify-content-between mt-2">
                    <span>Discount</span>
                    <strong>- {formatPKR(order.discount)}</strong>
                  </div>
                )}
                <div className="d-flex justify-content-between mt-2">
                  <span>Total</span>
                  <strong>{formatPKR(order.total)}</strong>
                </div>
              </div>
              <Link to="/shop" className="btn-dark mt-3 d-inline-block">Back to Shop</Link>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
