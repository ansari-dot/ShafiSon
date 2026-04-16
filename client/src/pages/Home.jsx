import { useEffect, useRef, useState } from "react";
import Hero from "../components/Hero";
import TestimonialSlider from "../components/TestimonialSlider";
import Categories from "../components/Categories";
import DealBanner from "../components/DealBanner";
import Newsletter from "../components/Newsletter";
import CategorySections from "../components/CategorySections";
import HowItWorks from "../components/HowItWorks";
import ProductComparison from "../components/ProductComparison";
import FAQ from "../components/FAQ";
import { apiGet } from "../util/api";
import { formatPKR } from "../util/formatCurrency";
import usePageMeta from "../util/usePageMeta";

const CartIcon = () => (
  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 9m12-9l2 9M9 21a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm6 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" />
  </svg>
);

const HeartIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

const EyeIcon = () => (
  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

function CollectionCard({ item, hoverImg }) {
  const [hovered, setHovered] = useState(false);
  return (
    <a
      href={`/shop/${item._id}`}
      className="home-collection-modern-card"
      onMouseEnter={() => hoverImg && setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="home-collection-modern-image">
        <div className="home-collection-modern-overlay" aria-hidden="true" />
        {(item.badge || item.isDeal) && (
          <div className="home-collection-modern-badge">{item.badge || "Deal"}</div>
        )}
        <div className="home-collection-modern-actions" aria-hidden="true">
          <span className="home-collection-modern-action"><EyeIcon /></span>
          <span className="home-collection-modern-action"><HeartIcon /></span>
          <span className="home-collection-modern-action"><CartIcon /></span>
        </div>
        <div className="home-collection-modern-cta" aria-hidden="true">Shop Now →</div>
        <img
          src={hovered && hoverImg ? hoverImg : item.img}
          alt={item.title}
          loading="lazy"
          style={{ transition: "opacity 0.25s ease" }}
        />
      </div>
      <div className="home-collection-modern-info">
        <h3 className="home-collection-modern-name">{item.title}</h3>
        <p className="home-collection-modern-price">
          {formatPKR(item.price)}<span className="text-xs text-gray-500 ml-1">/ {item.priceUnit || "per yard"}</span>
        </p>
      </div>
    </a>
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
    <main className="home-page">
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

      <Categories />

      <section style={{ padding: "1rem 0 4rem" }} className="home-collection-modern">
        <div className="container">
          <div className="text-center mb-5">
            <span className="section-label">{collection?.title || "Our Collection"}</span>
            <h2 className="home-collection-modern-title">
              {collection?.heading || "Crafted with Excellent Material"}
            </h2>
            <p className="home-collection-modern-sub">
              {collection?.text || "Every piece is designed with care - using premium fabrics and timeless craftsmanship."}
            </p>
          </div>

          <div className="home-collection-modern-carousel">
            <button type="button" className="home-collection-modern-nav prev" aria-label="Scroll left" onClick={() => scrollCollection(-1)}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            <div className="home-collection-modern-grid" ref={collectionGridRef}>
              {collectionProducts.map((item) => {
                const hoverImg = item?.imgs?.[0] && item.imgs[0] !== item.img ? item.imgs[0] : null;
                return <CollectionCard key={item._id} item={item} hoverImg={hoverImg} />;
              })}
            </div>

            <button type="button" className="home-collection-modern-nav next" aria-label="Scroll right" onClick={() => scrollCollection(1)}>
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

      <CategorySections />

      <DealBanner />

      <section className="section-pad home-collection-modern">
        <div className="container">
          <div className="text-center mb-5">
            <span className="section-label">{popular?.title || "Trending Now"}</span>
            <h2 className="home-collection-modern-title">{popular?.heading || "Popular Picks"}</h2>
            {popular?.text && <p className="home-collection-modern-sub">{popular.text}</p>}
          </div>
          <div className="cat-section-grid">
            {popularProducts.map((item) => {
              const hoverImg = item?.imgs?.[0] && item.imgs[0] !== item.img ? item.imgs[0] : null;
              return <CollectionCard key={item._id} item={item} hoverImg={hoverImg} />;
            })}
          </div>
          <div className="text-center mt-4">
            <a href="/shop" className="btn-dark d-inline-flex align-items-center gap-2">
              View All Products <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </section>

      <ProductComparison />

      <HowItWorks />

      <TestimonialSlider />

      <FAQ />

      <Newsletter />
    </main>
  );
}
