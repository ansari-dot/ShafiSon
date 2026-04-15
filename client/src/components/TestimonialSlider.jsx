import { useEffect, useState } from "react";
import { apiGet } from "../util/api";

export default function TestimonialSlider({ padded = true }) {
  const [index, setIndex] = useState(0);
  const [items, setItems] = useState([]);

  useEffect(() => {
    let active = true;
    apiGet("/api/testimonials?active=true")
      .then((data) => {
        if (!active) return;
        setItems(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        if (!active) return;
        setItems([]);
      });
    return () => { active = false; };
  }, []);

  const current = items[index];

  const go = (dir) => {
    setIndex((prev) => {
      if (!items.length) return 0;
      if (dir === "next") return (prev + 1) % items.length;
      return (prev - 1 + items.length) % items.length;
    });
  };

  if (!items.length) return null;

  return (
    <section className={padded ? "section-pad" : "pt-5 pb-5"}>
      <div className="container">
        <div className="text-center">
          <h2 className="fs-3 fw-semibold text-dark">Testimonials</h2>
        </div>

        <div className="position-relative mt-4">
          <div className="d-none d-md-block">
            <button
              onClick={() => go("prev")}
              className="btn btn-light position-absolute top-50 start-0 translate-middle-y rounded-circle"
              aria-label="Previous"
            >
              <span className="fa fa-chevron-left"></span>
            </button>
            <button
              onClick={() => go("next")}
              className="btn btn-light position-absolute top-50 end-0 translate-middle-y rounded-circle"
              aria-label="Next"
            >
              <span className="fa fa-chevron-right"></span>
            </button>
          </div>

          <div className="mx-auto text-center testimonial-body">
            <blockquote className="fs-6">
              &#8220;{current.quote}&#8221;
            </blockquote>
            <div className="mt-4">
              {current.img && (
                <img
                  src={current.img}
                  alt={current.name}
                  className="rounded-circle d-block mx-auto"
                  width="80"
                  height="80"
                />
              )}
              <h3 className="mt-3 fs-6 fw-bold text-dark">{current.name}</h3>
              <span className="text-muted">{current.role}</span>
            </div>
          </div>

          <div className="mt-4 d-flex justify-content-center gap-2">
            {items.map((item, i) => (
              <button
                key={item._id}
                onClick={() => setIndex(i)}
                className={`rounded-circle border-0 testimonial-dot ${
                  i === index ? "bg-brand" : "bg-secondary-subtle"
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
