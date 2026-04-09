import { useState } from "react";

const faqs = [
  {
    q: "What materials do you use for your furniture?",
    a: "We use sustainably sourced solid wood, premium steel frames, high-density foam, and carefully selected fabrics. Every material is tested for durability and comfort.",
  },
  {
    q: "How long does delivery take?",
    a: "Standard delivery takes 5–7 business days. White-glove delivery with in-home setup is available in most areas within 10–14 business days.",
  },
  {
    q: "Can I customize the size or fabric of a product?",
    a: "Yes! Most of our products are available in custom sizes and a wide range of fabric and finish options. Contact our design team for a personalized quote.",
  },
  {
    q: "What is your return policy?",
    a: "We offer a 30-day hassle-free return policy. If you're not completely satisfied, we'll arrange a free pickup and full refund — no questions asked.",
  },
  {
    q: "Do you offer assembly services?",
    a: "Yes, professional assembly is available as an add-on at checkout. Our trained team will set everything up perfectly in your home.",
  },
];

export default function FAQ() {
  const [open, setOpen] = useState(null);

  return (
    <section className="section-pad faq-section">
      <div className="container">
        <div className="row g-5 align-items-start">
          <div className="col-lg-4">
            <span className="section-label">Got Questions?</span>
            <h2 className="fs-2 fw-bold text-dark mt-2 mb-3">
              Frequently Asked Questions
            </h2>
            <p className="mb-4">
              Can't find the answer you're looking for? Reach out to our
              friendly support team.
            </p>
            <a href="/contact" className="btn-brand d-inline-block">
              Contact Support
            </a>
          </div>
          <div className="col-lg-8">
            <div className="faq-list">
              {faqs.map((faq, i) => (
                <div
                  key={i}
                  className={`faq-item ${open === i ? "faq-open" : ""}`}
                >
                  <button
                    className="faq-question"
                    onClick={() => setOpen(open === i ? null : i)}
                  >
                    <span>{faq.q}</span>
                    <span className="faq-icon">{open === i ? "−" : "+"}</span>
                  </button>
                  {open === i && (
                    <div className="faq-answer">
                      <p className="mb-0">{faq.a}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
