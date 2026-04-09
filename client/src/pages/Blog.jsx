import Hero from "../components/Hero";
import TestimonialSlider from "../components/TestimonialSlider";
import { blogGrid } from "../data/siteData";

export default function Blog() {
  return (
    <main>
      <Hero
        title="Blog"
        text="Donec vitae odio quis nisl dapibus malesuada. Nullam ac aliquet velit. Aliquam vulputate velit imperdiet dolor tempor tristique."
        showButtons
      />

      <section className="section-pad">
        <div className="container">
          <div className="row g-4">
            {blogGrid.map((post, idx) => (
              <article key={`${post.id}-${idx}`} className="col-md-4">
                <a href="#" className="d-block">
                  <img
                    src={post.img}
                    alt={post.title}
                    className="img-fluid mb-4 rounded-4"
                  />
                </a>
                <div className="px-2">
                  <h3 className="fs-6 fw-semibold text-dark">
                    <a href="#">{post.title}</a>
                  </h3>
                  <div className="small">
                    <span>
                      by <a href="#">{post.author}</a>
                    </span>{" "}
                    <span>
                      on <a href="#">{post.date}</a>
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <TestimonialSlider padded={false} />
    </main>
  );
}
