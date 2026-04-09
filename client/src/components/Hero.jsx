export default function Hero({ title, text, showButtons = false }) {
  return (
    <section className="hero">
      <div className="container">
        <div className="row align-items-center g-4">
          <div className="col-lg-5">
            <h1 className="hero-title display-5 mb-4">
              {title}
            </h1>
            {text && <p className="hero-text mb-4">{text}</p>}
            {showButtons && (
              <div className="d-flex flex-wrap gap-2">
                <a href="#" className="btn-accent">
                  Shop Now
                </a>
                <a href="#" className="btn-white-outline">
                  Explore
                </a>
              </div>
            )}
          </div>
          <div className="col-lg-7">
            <div className="hero-img-wrap">
              <img src="/images/couch.png" alt="Couch" className="img-fluid" />
              <span className="hero-dots d-none d-lg-block"></span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
