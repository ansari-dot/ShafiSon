import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
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
  const [heroDoc, setHeroDoc] = useState(null);
  const [collection, setCollection] = useState(null);
  const [collectionProducts, setCollectionProducts] = useState([]);
  const [popular, setPopular] = useState(null);
  const [popularProducts, setPopularProducts] = useState([]);

  useEffect(() => {
    let active = true;
    apiGet("/api/hero-banner")
      .then((doc) => {
        if (!active) return;
        setHeroDoc(doc || null);
      })
      .catch(() => {
        if (!active) return;
        setHeroDoc(null);
      });

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

    return () => {
      active = false;
    };
  }, []);

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
      <section className="home-trust-strip">
        <div className="container">
          <div className="home-trust-grid">
            <div><strong>Since 1972</strong><span>Trusted in Quetta</span></div>
            <div><strong>Premium Materials</strong><span>Tested for durability</span></div>
            <div><strong>Design Guidance</strong><span>Free fabric consultation</span></div>
            <div><strong>Fast Support</strong><span>WhatsApp help available</span></div>
          </div>
        </div>
      </section>

      <MotionSection delay={0.05}>
        <BrandLogos />
      </MotionSection>

      <MotionSection delay={0.08}>
        <StatsBar />
      </MotionSection>

      <MotionSection delay={0.1}>
        <Categories />
      </MotionSection>

      <MotionSection delay={0.12}>
        <HowItWorks />
      </MotionSection>

      <MotionSection delay={0.14}>
        <section className="section-pad">
          <div className="container">
            <div className="row g-4 align-items-start">
              <div className="col-lg-3">
                <span className="section-label">{collection?.title || "Our Collection"}</span>
                <h2 className="mb-3 fs-2 fw-bold text-dark mt-1">
                  {collection?.heading || "Crafted with Excellent Material"}
                </h2>
                <p className="mb-4">
                  {collection?.text || "Every piece is designed with care - using sustainably sourced wood, premium fabrics, and timeless craftsmanship."}
                </p>
                <a href="/shop" className="btn-dark d-inline-block">
                  View All Products
                </a>
              </div>
              <div className="col-lg-9">
                <div className="row g-4">
                  {collectionProducts.map((item) => (
                    <motion.div
                      className="col-12 col-md-4"
                      key={item._id}
                      variants={revealCard}
                      initial="hidden"
                      whileInView="show"
                      viewport={{ once: false, amount: 0.25 }}
                      transition={{ duration: 0.45, ease: "easeOut" }}
                    >
                      <a href={`/shop/${item._id}`} className="product-card">
                        <img src={item.img} alt={item.title} className="img-fluid mb-4" />
                        <h3 className="fw-semibold text-dark fs-6">{item.title}</h3>
                        <strong className="fw-bold text-dark fs-5">{formatPKR(item.price)}</strong>
                        <span className="position-absolute start-50 translate-middle-x bottom-0 bg-dark rounded-circle d-inline-flex align-items-center justify-content-center product-card-btn">
                          <img src="/images/cross.svg" alt="" width="14" height="14" />
                        </span>
                      </a>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </MotionSection>

      <ScrollSection from={56} to={-20}>
        <MotionSection delay={0.16}>
          <DealBanner />
        </MotionSection>
      </ScrollSection>

      <ScrollSection from={48} to={-14}>
        <MotionSection delay={0.18}>
          <RoomInspiration />
        </MotionSection>
      </ScrollSection>

      <MotionSection delay={0.2}>
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

      <MotionSection delay={0.22}>
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
        <MotionSection delay={0.24}>
          <ProductComparison />
        </MotionSection>
      </ScrollSection>

      <MotionSection delay={0.26}>
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

      <ScrollSection from={40} to={-10}>
        <MotionSection delay={0.28}>
          <TestimonialSlider />
        </MotionSection>
      </ScrollSection>

      <ScrollSection from={38} to={-10}>
        <MotionSection delay={0.3}>
          <FAQ />
        </MotionSection>
      </ScrollSection>

      <ScrollSection from={34} to={-8}>
        <MotionSection delay={0.32}>
          <Newsletter />
        </MotionSection>
      </ScrollSection>
    </main>
  );
}




