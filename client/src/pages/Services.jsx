import Hero from "../components/Hero";
import TestimonialSlider from "../components/TestimonialSlider";
import { products } from "../data/siteData";
import { formatPKR } from "../util/formatCurrency";

export default function Services() {
  const serviceGrid = [
    {
      title: "Curtain Cloth",
      desc: "At shafisons, we offer a wide range of curtain fabrics designed to enhance your interiors with elegance and style.",
    },
    {
      title: "Sofa Fabrics",
      desc: "Upgrade your furniture with premium-quality sofa fabrics by shafisons — durable, comfortable, and stylish.",
    },
    {
      title: "Office Blinds",
      desc: "Modern and professional blinds solutions by shafisons, perfect for offices and commercial environments.",
    },
  ];

  return (
    <main>
      <Hero
        title="Our Services"
        text="Curtain cloth, sofa fabrics, and office blinds tailored to your space — trusted quality since 1972."
        showButtons
      />

      <section className="section-pad">
        <div className="container">
          <div className="row g-4">
            {serviceGrid.map((service) => (
              <div className="col-12 col-md-4" key={service.title}>
                <h3 className="fs-6 fw-semibold text-dark">{service.title}</h3>
                <p className="small">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-5">
        <div className="container">
          <div className="row g-4">
            <div className="col-lg-3">
              <h2 className="mb-4 fs-3 fw-semibold text-dark">
                Transform your space with shafisons today.
              </h2>
              <p className="mb-4">
                Premium curtain cloth, sofa fabrics, and office blinds — trusted since 1972.
              </p>
              <a href="/contact" className="btn-dark d-inline-block">
                Contact Us Now
              </a>
            </div>
            <div className="col-lg-9">
              <div className="row g-4">
              {products.map((item) => (
                <div className="col-12 col-md-4" key={item.id}>
                  <a href="#" className="product-card">
                    <img
                      src={item.img}
                      alt={item.title}
                      className="img-fluid mb-4"
                    />
                    <h3 className="fw-semibold text-dark fs-6">{item.title}</h3>
                    <strong className="fw-bold text-dark fs-5">
                      {formatPKR(item.price)}
                    </strong>
                    <span className="position-absolute start-50 translate-middle-x bottom-0 bg-dark rounded-circle d-inline-flex align-items-center justify-content-center product-card-btn">
                      <img src="/images/cross.svg" alt="" width="14" height="14" />
                    </span>
                  </a>
                </div>
              ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <TestimonialSlider padded={false} />
    </main>
  );
}
