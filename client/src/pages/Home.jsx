import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Hero from "../components/Hero";
import TestimonialSlider from "../components/TestimonialSlider";
import Categories from "../components/Categories";
import StatsBar from "../components/StatsBar";
import DealBanner from "../components/DealBanner";
import Newsletter from "../components/Newsletter";
import RoomInspiration from "../components/RoomInspiration";
import HowItWorks from "../components/HowItWorks";
import ProductComparison from "../components/ProductComparison";
import FAQ from "../components/FAQ";
import { apiGet } from "../util/api";
import { formatPKR } from "../util/formatCurrency";
import usePageMeta from "../util/usePageMeta";

const revealUp = {
  hidden: { opacity: 0, y: 54, scale: 0.97, filter: "blur(8px)" },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: { type: "spring", stiffness: 90, damping: 16, mass: 0.5 },
  },
};

const staggerWrap = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const revealCard = {
  hidden: { opacity: 0, y: 34, scale: 0.96, filter: "blur(6px)" },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: { type: "spring", stiffness: 110, damping: 18, mass: 0.45 },
  },
};

const CartIcon = () => (
  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 9m12-9l2 9M9 21a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm6 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"
    />
  </svg>
);

const HeartIcon = ({ active = false } = {}) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
    />
  </svg>
);

const EyeIcon = () => (
  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

function MotionSection({ children, delay = 0 }) {
  return (
    <motion.div
      variants={revealUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once: false, amount: 0.2 }}
      transition={{ duration: 0.75, ease: "easeOut", delay }}
    >
      {children}
    </motion.div>
  );
}

function ScrollSection({ children, from = 48, to = -18 }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.92", "end 0.08"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [from, to]);
  const opacity = useTransform(scrollYProgress, [0, 0.18, 1], [0.2, 1, 1]);
  const blur = useTransform(scrollYProgress, [0, 0.2, 1], ["10px", "0px", "0px"]);

  return (
    <motion.div ref={ref} style={{ y, opacity, filter: blur }}>
      {children}
    </motion.div>
  );
}

export default function Home() {
  usePageMeta({
    title: "ShafiSons | Premium Curtains, Sofa Fabrics & Blinds",
    description: "Explore premium curtain cloth, sofa fabrics, and office blinds from ShafiSons. Trusted craftsmanship since 1972.",
  });
  const collectionGridRef = useRef(null);
  const [heroDoc, setHeroDoc] = useState(null);
  const [collection, setCollection] = useState(null);
  const [collectionProducts, setCollectionProducts] = useState([]);
  const [popular, setPopular] = useState(null);
  const [popularProducts, setPopularProducts] = useState([]);

  useEffect(() => {
    let active = true;
    apiGet("/api/hero-banner")
      .then((doc) => { if (!active) return; setHeroDoc(doc || null); })
      .catch(() => { if (!active) return; setHeroDoc(null); });

    apiGet("/api/home-collection")
      .then((doc) => {
        if (!active) return;
        if (doc && doc.productIds && doc.productIds.length) {
          setCollection(doc);
          apiGet(`/api/products?ids=${doc.productIds.join(",")}`)
            .then((list) => { if (!active) return; setCollectionProducts(Array.isArray(list) ? list : []); })
            .catch(() => { if (!active) return; setCollectionProducts([]); });
        } else {
          setCollection(null);
          setCollectionProducts([]);
        }
      })
      .catch(() => { if (!active) return; setCollection(null); setCollectionProducts([]); });

    apiGet("/api/popular-picks")
      .then((doc) => {
        if (!active) return;
        if (doc && doc.productIds && doc.productIds.length) {
          setPopular(doc);
          apiGet(`/api/products?ids=${doc.productIds.join(",")}`)
            .then((list) => { if (!active) return; setPopularProducts(Array.isArray(list) ? list : []); })
            .catch(() => { if (!active) return; setPopularProducts([]); });
        } else {
          setPopular(null);
          setPopularProducts([]);
        }
      })
      .catch(() => { if (!active) return; setPopular(null); setPopularProducts([]); });

    return () => { active = false; };
  }, []);

  const scrollCollection = (dir) => {
    const el = collectionGridRef.current;
    if (!el) return;
    const amount = Math.max(260, Math.round(el.clientWidth * 0.85));
    el.scrollBy({ left: dir * amount, behavior: "smooth" });
  };

  return (
    <main>
      <MotionSection>
        <Hero
          title={
            <>
              {heroDoc?.titleLine1 || "Timeless Interiors, Crafted by"}{" "}
              <span className="d-block">{heroDoc?.titleLine2 || "shafisons"}</span>
            </>
          }
          text={heroDoc?.text || "Premium Curtain Cloth, Sofa Fabrics & Office Blinds - trusted since 1972."}
          label={heroDoc?.label || "New Arrival Campaign"}
          highlights={heroDoc?.highlights || "50+ years of trusted interior fabric expertise"}
          primaryBtnText={heroDoc?.primaryBtnText || "Shop Now"}
          primaryBtnLink={heroDoc?.primaryBtnLink || "/shop"}
          secondaryBtnText={heroDoc?.secondaryBtnText || "Book Consultation"}
          secondaryBtnLink={heroDoc?.secondaryBtnLink || "/contact"}
          offerChip={heroDoc?.offerChip || "Free swatches + same day consultation"}
          slides={heroDoc?.heroImages}
          showButtons
        />
      </MotionSection>
      <MotionSection delay={0.06}>
        <StatsBar />
      </MotionSection>

      <MotionSection delay={0.08}>
        <Categories />
      </MotionSection>

      <MotionSection delay={0.14}>
        <section className="section-pad home-collection-modern">
          <div className="container">
            <div className="text-center mb-5">
              <span className="section-label">{collection?.title || "Our Collection"}</span>
              <h2 className="home-collection-modern-title">
                {collection?.heading || "Crafted with Excellent Material"}
              </h2>
              <p className="home-collection-modern-sub">
                {collection?.text ||
                  "Every piece is designed with care - using premium fabrics and timeless craftsmanship."}
              </p>
            </div>

            <div className="home-collection-modern-carousel">
              <button
                type="button"
                className="home-collection-modern-nav prev"
                aria-label="Scroll collection left"
                onClick={() => scrollCollection(-1)}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              <motion.div
                className="home-collection-modern-grid"
                ref={collectionGridRef}
                variants={staggerWrap}
                initial="hidden"
                whileInView="show"
                viewport={{ once: false, amount: 0.2 }}
              >
                {collectionProducts.map((item) => (
                  <motion.a
                    key={item._id}
                    href={`/shop/${item._id}`}
                    className="home-collection-modern-card"
                    variants={revealCard}
                    whileHover={{ y: -6 }}
                    transition={{ type: "spring", stiffness: 240, damping: 20 }}
                  >
                    <div className="home-collection-modern-image">
                      <div className="home-collection-modern-overlay" aria-hidden="true" />
                      {(item.badge || item.isDeal) && (
                        <div className="home-collection-modern-badge">{item.badge || "Deal"}</div>
                      )}
                      <div className="home-collection-modern-actions" aria-hidden="true">
                        <span className="home-collection-modern-action">
                          <EyeIcon />
                        </span>
                        <span className="home-collection-modern-action">
                          <HeartIcon />
                        </span>
                        <span className="home-collection-modern-action">
                          <CartIcon />
                        </span>
                      </div>
                      <div className="home-collection-modern-cta" aria-hidden="true">
                        Shop Now →
                      </div>
                      <img src={item.img} alt={item.title} loading="lazy" />
                    </div>

                    <div className="home-collection-modern-info">
                      <h3 className="home-collection-modern-name">{item.title}</h3>
                      <p className="home-collection-modern-price">{formatPKR(item.price)}</p>
                    </div>
                  </motion.a>
                ))}
              </motion.div>

              <button
                type="button"
                className="home-collection-modern-nav next"
                aria-label="Scroll collection right"
                onClick={() => scrollCollection(1)}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>

            <div className="text-center mt-4">
              <a href="/shop" className="btn-dark d-inline-flex align-items-center gap-2">
                View All Products <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </section>
      </MotionSection>

      <ScrollSection from={56} to={-20}>
        <MotionSection delay={0.16}>
          <DealBanner />
        </MotionSection>
      </ScrollSection>

      <MotionSection delay={0.18}>
        <section className="section-pad bg-white">
          <div className="container">
            <div className="text-center mb-5">
              <span className="section-label">{popular?.title || "Trending Now"}</span>
              <h2 className="fs-2 fw-bold text-dark mt-1">{popular?.heading || "Popular Picks"}</h2>
              {popular?.text && <p className="mt-2">{popular.text}</p>}
            </div>
            <motion.div
              className="row g-4"
              variants={staggerWrap}
              initial="hidden"
              whileInView="show"
              viewport={{ once: false, amount: 0.25 }}
            >
              {popularProducts.map((item) => (
                <motion.div key={item._id} className="col-md-4 d-flex gap-3" variants={revealCard}>
                  <div className="position-relative product-thumb">
                    <span className="position-absolute top-0 start-0 w-100 h-100 rounded-4 bg-soft"></span>
                    <img src={item.img} alt="" className="position-relative img-fluid" />
                  </div>
                  <div>
                    <h3 className="fs-6 fw-bold text-dark">{item.title}</h3>
                    <p className="small">Sustainably sourced, beautifully crafted for modern living.</p>
                    <a href={`/shop/${item._id}`} className="small text-dark fw-semibold">Shop Now &rarr;</a>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      </MotionSection>

      <ScrollSection from={48} to={-14}>
        <MotionSection delay={0.2}>
          <RoomInspiration />
        </MotionSection>
      </ScrollSection>

      <MotionSection delay={0.22}>
        <HowItWorks />
      </MotionSection>

      <MotionSection delay={0.24}>
        <section className="section-pad bg-white">
          <div className="container">
            <div className="row align-items-center g-4">
              <div className="col-lg-7">
                <span className="section-label">Why shafisons</span>
                <h2 className="fs-2 fw-bold text-dark mt-1 mb-3">Why Choose shafisons</h2>
                <p className="mt-2">Serving interiors with trusted quality and timeless design for decades.</p>
                <motion.div
                  className="row g-4 mt-3"
                  variants={staggerWrap}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: false, amount: 0.25 }}
                >
                  {["Serving Since 1972", "Trusted Brand in Quetta", "Premium Quality Materials", "Customer Satisfaction First"].map((item) => (
                    <motion.div className="col-6" key={item} variants={revealCard}>
                      <h3 className="fs-6 fw-semibold text-dark">{item}</h3>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
              <div className="col-lg-5 position-relative">
                <span className="dots-yellow"></span>
                <img src="/images/why-choose-us-img.jpg" alt="Why Choose Us" className="img-fluid rounded-4" />
              </div>
            </div>
          </div>
        </section>
      </MotionSection>

      <MotionSection delay={0.26}>
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
                <p className="mb-4">From classic designs to modern styles, we help transform your space with quality and trust.</p>
                <a href="/about" className="btn-dark d-inline-block">About Us</a>
              </div>
            </div>
          </div>
        </section>
      </MotionSection>

      <ScrollSection from={44} to={-12}>
        <MotionSection delay={0.28}>
          <ProductComparison />
        </MotionSection>
      </ScrollSection>

      <ScrollSection from={40} to={-10}>
        <MotionSection delay={0.3}>
          <TestimonialSlider />
        </MotionSection>
      </ScrollSection>

      <ScrollSection from={38} to={-10}>
        <MotionSection delay={0.32}>
          <FAQ />
        </MotionSection>
      </ScrollSection>

      <ScrollSection from={34} to={-8}>
        <MotionSection delay={0.34}>
          <Newsletter />
        </MotionSection>
      </ScrollSection>
    </main>
  );
}
