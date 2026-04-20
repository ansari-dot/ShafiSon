import { NavLink, Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import { navLinks } from "../data/siteData";
import { getCartCount } from "../util/cart";
import { getWishlistCount } from "../wishlist";
import { getCompareCount } from "../compare";
import { apiGet } from "../util/api";
import logo from "../assets/logo.png";

const SearchIcon = () => (
  <svg width="17" height="17" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="7" strokeLinecap="round" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35" />
  </svg>
);
const TrackIcon = () => (
  <svg width="17" height="17" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 10c0 4-4.5 9-9 12-4.5-3-9-8-9-12a9 9 0 1 1 18 0z" />
    <circle cx="12" cy="10" r="3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const HeartIcon = () => (
  <svg width="17" height="17" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);
const CartIcon = () => (
  <svg width="17" height="17" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 6h18M16 10a4 4 0 0 1-8 0" />
  </svg>
);
const CompareIcon = () => (
  <svg width="17" height="17" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2m-6 9l2 2 4-4" />
  </svg>
);
const MenuIcon = () => (
  <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);
const CloseIcon = () => (
  <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const ChevronDownIcon = ({ open = false }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
  </svg>
);

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const isHomePage = location.pathname === "/";
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchVal, setSearchVal] = useState("");
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [compareCount, setCompareCount] = useState(0);
  const [megaOpen, setMegaOpen] = useState(false);
  const [megaNav, setMegaNav] = useState({ categories: [], materials: [] });
  const [megaCategoryDocs, setMegaCategoryDocs] = useState([]);
  const [openCategory, setOpenCategory] = useState(null);

  const makeShopLink = (key, value) => {
    const params = new URLSearchParams();
    params.set(key, value);
    return `/shop?${params.toString()}`;
  };

  const megaCategories = useMemo(() => {
    return (megaNav.categories || [])
      .map(({ label, count }) => {
        const doc = megaCategoryDocs.find(c => c.name === label);
        const subcategories = (
          doc?.subcategories?.length
            ? doc.subcategories.map(s => (typeof s === "object" ? s.name : s)).filter(Boolean)
            : []
        ).map(s => ({
          label: s,
          to: `/shop?category=${encodeURIComponent(label)}&subcategory=${encodeURIComponent(s)}`,
        }));
        return { label, count, to: makeShopLink("category", label), subcategories };
      })
      .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label))
      .slice(0, 5);
  }, [megaNav.categories, megaCategoryDocs]);

  const megaMaterials = useMemo(() => {
    return (megaNav.materials || [])
      .map(({ label, count }) => ({
        label,
        count,
        to: makeShopLink("material", label),
      }))
      .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label))
      .slice(0, 5);
  }, [megaNav.materials]);

  const megaShortcuts = [
    { label: "Featured", to: "/shop" },
    { label: "Top Rated", to: "/shop?sort=rating" },
    { label: "Most Reviewed", to: "/shop?sort=reviews" },
    { label: "Price: Low to High", to: "/shop?sort=price_asc" },
    { label: "Price: High to Low", to: "/shop?sort=price_desc" },
    { label: "Deals", to: "/shop?deal=1" },
  ];

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get("q") || "";
    setSearchVal(q);
  }, [location.pathname, location.search]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!megaOpen) setOpenCategory(null);
  }, [megaOpen]);

  useEffect(() => {
    const update = () => {
      setCartCount(getCartCount());
      setWishlistCount(getWishlistCount());
      setCompareCount(getCompareCount());
    };
    update();
    window.addEventListener("cart:updated", update);
    window.addEventListener("wishlist:updated", update);
    window.addEventListener("compare:updated", update);
    window.addEventListener("storage", update);
    return () => {
      window.removeEventListener("cart:updated", update);
      window.removeEventListener("wishlist:updated", update);
      window.removeEventListener("compare:updated", update);
      window.removeEventListener("storage", update);
    };
  }, []);

  useEffect(() => {
    let active = true;
    const loadMegaNav = async () => {
      try {
        const data = await apiGet("/api/products/navigation");
        if (!active) return;
        setMegaNav({
          categories: Array.isArray(data?.categories) ? data.categories : [],
          materials: Array.isArray(data?.materials) ? data.materials : [],
        });
      } catch {
        if (!active) return;
        setMegaNav({ categories: [], materials: [] });
      }
    };
    loadMegaNav();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    apiGet("/api/categories").then((data) => {
      setMegaCategoryDocs(Array.isArray(data) ? data : []);
    }).catch(() => {});
  }, []);

  const handleNavClick = () => setOpen(false);

  const submitSearch = (e) => {
    e.preventDefault();
    const q = searchVal.trim();
    if (!q) {
      navigate("/shop");
      return;
    }
    navigate(`/shop?q=${encodeURIComponent(q)}`);
    setOpen(false);
  };

  return (
    <>
      <div className={`nb-topbar${isHomePage && !scrolled ? " nb-topbar-home" : ""}`}>
        <div className="container">
          <div className="nb-topbar-inner">
            <p className="nb-topbar-text">Free Delivery in Quetta on Orders Above PKR 10,000</p>
            <div className="nb-topbar-right">
              <Link to="/contact" className="nb-topbar-link">Store Locator</Link>
              <Link to="/track" className="nb-topbar-link">Customer Service</Link>
            </div>
          </div>
        </div>
      </div>

      <nav className={`nb-nav${scrolled || !isHomePage ? " nb-scrolled" : " nb-home-overlay"}`}>
        <div className="container">
          <div className="nb-main-row">
            <form className="nb-search-slot" onSubmit={submitSearch}>
              <SearchIcon />
              <input
                type="text"
                className="nb-inline-search"
                placeholder="Search products"
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
              />
              <button type="submit" className="nb-icon-btn" aria-label="Search">
                <SearchIcon />
              </button>
            </form>

            <Link to="/" className="nb-logo nb-logo-center" onClick={handleNavClick}>
              <img src={logo} alt="ShafiSons" className="nb-logo-img" />
            </Link>

            <div className="nb-actions">
              <Link to="/track" className="nb-icon-btn" aria-label="Track Order">
                <TrackIcon />
              </Link>
              <Link to="/compare" className="nb-icon-btn nb-cart-btn" aria-label="Compare">
                <CompareIcon />
                {compareCount > 0 && <span className="nb-cart-badge">{compareCount}</span>}
              </Link>
              <Link to="/wishlist" className="nb-icon-btn nb-cart-btn" aria-label="Wishlist">
                <HeartIcon />
                {wishlistCount > 0 && <span className="nb-cart-badge">{wishlistCount}</span>}
              </Link>
              <Link to="/cart" className="nb-icon-btn nb-cart-btn" aria-label="Cart">
                <CartIcon />
                {cartCount > 0 && <span className="nb-cart-badge">{cartCount}</span>}
              </Link>
              <button className="nb-hamburger" aria-label="Toggle menu" onClick={() => setOpen((o) => !o)}>
                {open ? <CloseIcon /> : <MenuIcon />}
              </button>
            </div>
          </div>

          <div className="nb-inner">
            <ul className="nb-links">
              {navLinks.map((item) => (
                <li
                  key={item.to}
                  className={item.to === "/shop" ? "nb-link-item nb-link-item-shop" : "nb-link-item"}
                  onMouseEnter={() => item.to === "/shop" && setMegaOpen(true)}
                  onMouseLeave={() => item.to === "/shop" && setMegaOpen(false)}
                  onFocus={() => item.to === "/shop" && setMegaOpen(true)}
                  onBlur={() => item.to === "/shop" && setMegaOpen(false)}
                >
                  <NavLink
                    to={item.to}
                    className={({ isActive }) => `nb-link ${isActive ? "nb-link-active" : ""}`}
                    onClick={() => setMegaOpen(false)}
                  >
                    {item.label}
                  </NavLink>

                  {item.to === "/shop" && (
                    <div
                      className={`nb-mega ${megaOpen ? "nb-mega-open" : ""}`}
                      onMouseEnter={() => setMegaOpen(true)}
                      onMouseLeave={() => setMegaOpen(false)}
                    >
                      <div className="nb-mega-inner">
                        <div className="nb-mega-col">
                          <p className="nb-mega-title">Shop by Category</p>
                          <ul className="nb-mega-list">
                            <li>
                              <Link to="/shop" className="nb-mega-link" onClick={() => setMegaOpen(false)}>
                                <span>All Products</span>
                                <small>{megaNav.categories.reduce((sum, item) => sum + (item.count || 0), 0)}</small>
                              </Link>
                            </li>
                            {megaCategories.map((cat) => {
                              const isOpen = openCategory === cat.label;
                              return (
                                <li key={cat.label} className={`nb-mega-cat-item${isOpen ? " nb-mega-cat-open" : ""}`}>
                                  <div className="nb-mega-cat-heading">
                                    <Link to={cat.to} className="nb-mega-link" onClick={() => setMegaOpen(false)}>
                                      <span>{cat.label}</span>
                                      <small>{cat.count}</small>
                                    </Link>
                                    {cat.subcategories && cat.subcategories.length > 0 && (
                                      <button
                                        type="button"
                                        className={`nb-mega-cat-toggle${isOpen ? " open" : ""}`}
                                        aria-expanded={isOpen}
                                        aria-label={`${isOpen ? "Hide" : "Show"} ${cat.label} subcategories`}
                                        onClick={(e) => {
                                          e.preventDefault();
                                          e.stopPropagation();
                                          setOpenCategory(isOpen ? null : cat.label);
                                        }}
                                      >
                                        <ChevronDownIcon open={isOpen} />
                                      </button>
                                    )}
                                  </div>
                                  {cat.subcategories && cat.subcategories.length > 0 && (
                                    <ul className="nb-mega-sublist">
                                      {cat.subcategories.map((sub) => (
                                        <li key={sub.label}>
                                          <Link to={sub.to} className="nb-mega-sublink" onClick={() => setMegaOpen(false)}>
                                            {sub.label}
                                          </Link>
                                        </li>
                                      ))}
                                    </ul>
                                  )}
                                </li>
                              );
                            })}
                          </ul>
                        </div>

                        <div className="nb-mega-col">
                          <p className="nb-mega-title">Materials</p>
                          <ul className="nb-mega-list">
                            {megaMaterials.map((mat) => (
                              <li key={mat.label}>
                                <Link to={mat.to} className="nb-mega-link" onClick={() => setMegaOpen(false)}>
                                  <span>{mat.label}</span>
                                  <small>{mat.count}</small>
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="nb-mega-col">
                          <p className="nb-mega-title">Quick Filters</p>
                          <ul className="nb-mega-list">
                            {megaShortcuts.map((shortcut) => (
                              <li key={shortcut.label}>
                                <Link to={shortcut.to} className="nb-mega-link" onClick={() => setMegaOpen(false)}>
                                  {shortcut.label}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>

                      </div>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </nav>

      {open && (
        <div className="nb-mobile-overlay" onClick={() => setOpen(false)}>
          <div className="nb-mobile-drawer" onClick={(e) => e.stopPropagation()}>
            <div className="nb-mobile-head">
              <Link to="/" className="nb-logo" onClick={handleNavClick}>
                <img src={logo} alt="ShafiSons" className="nb-logo-img" />
              </Link>
              <button className="nb-icon-btn" onClick={() => setOpen(false)} aria-label="Close">
                <CloseIcon />
              </button>
            </div>
            <ul className="nb-mobile-links">
              {navLinks.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    className={({ isActive }) => `nb-mobile-link ${isActive ? "nb-mobile-link-active" : ""}`}
                    onClick={handleNavClick}
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
            <div className="nb-mobile-footer">
              <Link to="/wishlist" className="btn btn-outline-dark d-block text-center mb-2" onClick={handleNavClick}>
                Wishlist
              </Link>
              <Link to="/shop" className="btn-brand d-block text-center" onClick={handleNavClick}>
                Shop Now
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
