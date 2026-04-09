import Hero from "../components/Hero";
import { Link } from "react-router-dom";

export default function Thankyou() {
  return (
    <main>
      <Hero title="Cart" />

      <section className="section-pad">
        <div className="container text-center">
          <span className="position-relative d-inline-flex text-brand">
            <span className="position-absolute top-50 start-50 translate-middle rounded-circle" style={{ width: 50, height: 50, background: "rgba(59,93,80,0.2)" }}></span>
            <svg
              width="64"
              height="64"
              viewBox="0 0 16 16"
              className="position-relative mb-4"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M11.354 5.646a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L8 8.293l2.646-2.647a.5.5 0 0 1 .708 0z"
              />
              <path
                fillRule="evenodd"
                d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5zM3.102 4l1.313 7h8.17l1.313-7H3.102zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-7 1a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm7 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"
              />
            </svg>
          </span>
          <h2 className="fs-2 fw-semibold text-dark">Thank you!</h2>
          <p className="mt-2 fs-5">You order was successfuly completed.</p>
          <Link to="/shop" className="btn btn-outline-dark mt-3">
            Back to shop
          </Link>
        </div>
      </section>
    </main>
  );
}
