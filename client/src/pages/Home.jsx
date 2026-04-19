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
import HomeInstagramSection from "../components/HomeInstagramSection";
import HomeStoreLocation from "../components/HomeStoreLocation";
import { apiGet, resolveAssetUrl } from "../util/api";
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
  const mainImg = resolveAssetUrl(item?.img);
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
          src={hovered && hoverImg ? hoverImg : mainImg}
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

function getHoverImage(item) {
  if (!Array.isArray(item?.imgs)) return null;
  const mainImg = resolveAssetUrl(item?.img);
  return item.imgs.map(resolveAssetUrl).find((src) => src && src !== mainImg) || null;
}

export default function Home() {
  usePageMeta({
    title: "Premium Curtains, Blinds & Interior Fabrics",
    description: "Shop premium curtain fabrics, custom drapery, modern blinds, floor seating & upholstery at Shafisons. Trusted by 15,000+ customers since 1975.",
    keywords: "curtain fabric, blinds, sofa fabric, upholstery, floor seating, interior fabrics Quetta",
    canonical: "/",
  });

  const collectionGridRef = useRef(null);
  const [heroDoc, setHeroDoc] = useState(null);
  const [categories, setCategories] = useState([]);
  const [collection, setCollection] = useState(null);
  const [collectionProducts, setCollectionProducts] = useState([]);
  const [popular, setPopular] = useState(null);
  const [popularProducts, setPopularProducts] = useState([]);
  const [dealDoc, setDealDoc] = useState(null);
  const [compareDoc, setCompareDoc] = useState(null);
  const [compareProducts, setCompareProducts] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [categorySections, setCategorySections] = useState([]);

  useEffect(() => {
    let active = true;

    apiGet("/api/home").then((data) => {
      if (!active) return;
      setHeroDoc(data?.hero || null);
      setCategories(Array.isArray(data?.categories) ? data.categories : []);
      setCollection(data?.collection || null);
      setCollectionProducts(Array.isArray(data?.collectionProducts) ? data.collectionProducts : []);
      setPopular(data?.popular || null);
      setPopularProducts(Array.isArray(data?.popularProducts) ? data.popularProducts : []);
      setDealDoc(data?.deal || null);
      setCompareDoc(data?.compare || null);
      setCompareProducts(Array.isArray(data?.compareProducts) ? data.compareProducts : []);
      setTestimonials(Array.isArray(data?.testimonials) ? data.testimonials : []);
      setCategorySections(Array.isArray(data?.categorySections) ? data.categorySections : []);
    }).catch(() => {
      if (!active) return;
      setHeroDoc(null);
    });

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
        title={heroDoc?.titleLine1 || "Carpets & Floorings"}
        label={heroDoc?.label || "ShafiSons"}
        primaryBtnText={heroDoc?.primaryBtnText || "Explore"}
        primaryBtnLink={heroDoc?.primaryBtnLink || "/shop"}
        slides={heroDoc?.heroImages}
        showButtons
      />

      <Categories initialItems={categories} />

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
              {collectionProducts.length > 0
                ? collectionProducts.map((item) => {
                    const hoverImg = getHoverImage(item);
                    return <CollectionCard key={item._id} item={item} hoverImg={hoverImg} />;
                  })
                : Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="home-collection-modern-card sp-card-skeleton">
                      <div className="home-collection-modern-image"><div className="sp-skeleton-img" style={{ height: "100%" }} /></div>
                      <div className="home-collection-modern-info">
                        <div className="sp-skeleton-line" style={{ width: "70%", height: 14 }} />
                        <div className="sp-skeleton-line" style={{ width: "40%", height: 12, marginTop: 6 }} />
                      </div>
                    </div>
                  ))
              }
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

      <CategorySections initialSections={categorySections} />

      <DealBanner initialDeal={dealDoc} />

      <section className="section-pad home-collection-modern">
        <div className="container">
          <div className="text-center mb-5">
            <span className="section-label">{popular?.title || "Trending Now"}</span>
            <h2 className="home-collection-modern-title">{popular?.heading || "Popular Picks"}</h2>
            {popular?.text && <p className="home-collection-modern-sub">{popular.text}</p>}
          </div>
          <div className="cat-section-grid">
            {popularProducts.length > 0
              ? popularProducts.map((item) => {
                  const hoverImg = getHoverImage(item);
                  return <CollectionCard key={item._id} item={item} hoverImg={hoverImg} />;
                })
              : Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="home-collection-modern-card sp-card-skeleton">
                    <div className="home-collection-modern-image"><div className="sp-skeleton-img" style={{ height: "100%" }} /></div>
                    <div className="home-collection-modern-info">
                      <div className="sp-skeleton-line" style={{ width: "70%", height: 14 }} />
                      <div className="sp-skeleton-line" style={{ width: "40%", height: 12, marginTop: 6 }} />
                    </div>
                  </div>
                ))
            }
          </div>
          <div className="text-center mt-4">
            <a href="/shop" className="btn-dark d-inline-flex align-items-center gap-2">
              View All Products <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </section>

      <ProductComparison initialSection={compareDoc} initialProducts={compareProducts} />

      <HowItWorks />

      <TestimonialSlider initialItems={testimonials} />

      <FAQ />

      <HomeInstagramSection />

      <HomeStoreLocation />

      <Newsletter />
    </main>
  );
}
