import { useEffect, useState } from "react";
import Hero from "../components/Hero";
import TestimonialSlider from "../components/TestimonialSlider";
import Categories from "../components/Categories";
import StatsBar from "../components/StatsBar";
import DealBanner from "../components/DealBanner";
import Newsletter from "../components/Newsletter";
import BrandLogos from "../components/BrandLogos";
import RoomInspiration from "../components/RoomInspiration";
import HowItWorks from "../components/HowItWorks";
import ProductComparison from "../components/ProductComparison";
import FAQ from "../components/FAQ";
import { apiGet } from "../util/api";
import { formatPKR } from "../util/formatCurrency";

export default function Home() {
  const [collection, setCollection] = useState(null);
  const [collectionProducts, setCollectionProducts] = useState([]);
  const [popular, setPopular] = useState(null);
  const [popularProducts, setPopularProducts] = useState([]);

  useEffect(() => {
    let active = true;
    apiGet("/api/home-collection")
      .then((doc) => {
        if (!active) return;
        if (doc && doc.productIds && doc.productIds.length) {
          setCollection(doc);
          apiGet(`/api/products?ids=${doc.productIds.join(",")}`)
            .then((list) => {
              if (!active) return;
              setCollectionProducts(Array.isArray(list) ? list : []);
            })
            .catch(() => {
              if (!active) return;
              setCollectionProducts([]);
            });
        } else {
          setCollection(null);
          setCollectionProducts([]);
        }
      })
      .catch(() => {
        if (!active) return;
        setCollection(null);
        setCollectionProducts([]);
      });

    apiGet("/api/popular-picks")
      .then((doc) => {
        if (!active) return;
        if (doc && doc.productIds && doc.productIds.length) {
          setPopular(doc);
          apiGet(`/api/products?ids=${doc.productIds.join(",")}`)
            .then((list) => {
              if (!active) return;
              setPopularProducts(Array.isArray(list) ? list : []);
            })
            .catch(() => {
              if (!active) return;
              setPopularProducts([]);
            });
        } else {
          setPopular(null);
          setPopularProducts([]);
        }
      })
      .catch(() => {
        if (!active) return;
        setPopular(null);
        setPopularProducts([]);
      });

    return () => { active = false; };
  }, []);

  return (
    <main>

      {/* ── Hero ── */}
      <Hero
        title={
          <>
            Timeless Interiors, Crafted by{" "}
            <span className="d-block">shafisons</span>
          </>
        }
        text="Premium Curtain Cloth, Sofa Fabrics & Office Blinds — trusted since 1972."
        showButtons
      />

      {/* ── Trusted Brands ── */}
      <BrandLogos />

      {/* ── Stats ── */}
      <StatsBar />

      {/* ── Shop by Category ── */}
      <Categories />

      {/* ── How It Works ── */}
      <HowItWorks />

      {/* ── Featured Products ── */}
      <section className="section-pad">
        <div className="container">
          <div className="row g-4 align-items-start">
            <div className="col-lg-3">
              <span className="section-label">{collection?.title || "Our Collection"}</span>
              <h2 className="mb-3 fs-2 fw-bold text-dark mt-1">
                {collection?.heading || "Crafted with Excellent Material"}
              </h2>
              <p className="mb-4">
                {collection?.text || "Every piece is designed with care — using sustainably sourced wood, premium fabrics, and timeless craftsmanship."}
              </p>
              <a href="/shop" className="btn-dark d-inline-block">
                View All Products
              </a>
            </div>
            <div className="col-lg-9">
              <div className="row g-4">
                {collectionProducts.map((item) => (
                  <div className="col-12 col-md-4" key={item._id}>
                    <a href={`/shop/${item._id}`} className="product-card">
                      <img src={item.img} alt={item.title} className="img-fluid mb-4" />
                      <h3 className="fw-semibold text-dark fs-6">{item.title}</h3>
                      <strong className="fw-bold text-dark fs-5">{formatPKR(item.price)}</strong>
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

      {/* ── Deal Banner with Countdown ── */}
      <DealBanner />

      {/* ── Room Inspiration ── */}
      <RoomInspiration />

      {/* ── Why Choose Us ── */}
      <section className="section-pad bg-white">
        <div className="container">
          <div className="row align-items-center g-4">
            <div className="col-lg-7">
              <span className="section-label">Why shafisons</span>
              <h2 className="fs-2 fw-bold text-dark mt-1 mb-3">Why Choose shafisons</h2>
              <p className="mt-2">
                Serving interiors with trusted quality and timeless design for decades.
              </p>
              <div className="row g-4 mt-3">
                {[
                  "Serving Since 1972",
                  "Trusted Brand in Quetta",
                  "Premium Quality Materials",
                  "Customer Satisfaction First",
                ].map((item) => (
                  <div className="col-6" key={item}>
                    <h3 className="fs-6 fw-semibold text-dark">{item}</h3>
                  </div>
                ))}
              </div>
            </div>
            <div className="col-lg-5 position-relative">
              <span className="dots-yellow"></span>
              <img
                src="/images/why-choose-us-img.jpg"
                alt="Why Choose Us"
                className="img-fluid rounded-4"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── Interior Design Section ── */}
      <section className="section-pad">
        <div className="container">
          <div className="row g-4">
            <div className="col-lg-7 position-relative">
              <span className="dots-green"></span>
              <div className="row g-3">
                <div className="col-8">
                  <img src="/images/img-grid-1.jpg" alt="" className="img-fluid rounded-4" />
                </div>
                <div className="col-4">
                  <img src="/images/img-grid-2.jpg" alt="" className="img-fluid rounded-4" />
                </div>
                <div className="col-6 offset-6">
                  <img src="/images/img-grid-3.jpg" alt="" className="img-fluid rounded-4" />
                </div>
              </div>
            </div>
            <div className="col-lg-5">
              <span className="section-label">About Preview</span>
              <h2 className="mb-4 fs-2 fw-bold text-dark mt-1">
                At shafisons, we bring over 50 years of expertise in fabric and interior solutions.
              </h2>
              <p className="mb-4">
                From classic designs to modern styles, we help transform your space with quality and trust.
              </p>
              <a href="/about" className="btn-dark d-inline-block">About Us</a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Product Comparison ── */}
      <ProductComparison />

      {/* ── Popular Picks ── */}
      <section className="section-pad bg-white">
        <div className="container">
          <div className="text-center mb-5">
            <span className="section-label">{popular?.title || "Trending Now"}</span>
            <h2 className="fs-2 fw-bold text-dark mt-1">{popular?.heading || "Popular Picks"}</h2>
            {popular?.text && <p className="mt-2">{popular.text}</p>}
          </div>
          <div className="row g-4">
            {popularProducts.map((item) => (
              <div key={item._id} className="col-md-4 d-flex gap-3">
                <div className="position-relative product-thumb">
                  <span className="position-absolute top-0 start-0 w-100 h-100 rounded-4 bg-soft"></span>
                  <img src={item.img} alt="" className="position-relative img-fluid" />
                </div>
                <div>
                  <h3 className="fs-6 fw-bold text-dark">{item.title}</h3>
                  <p className="small">Sustainably sourced, beautifully crafted for modern living.</p>
                  <a href={`/shop/${item._id}`} className="small text-dark fw-semibold">Shop Now →</a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <TestimonialSlider />

      {/* ── FAQ ── */}
      <FAQ />

      {/* ── Newsletter ── */}
      <Newsletter />

    </main>
  );
}
