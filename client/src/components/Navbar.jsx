import { NavLink, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { navLinks } from "../data/siteData";
import { getCartCount } from "../util/cart";

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
const CartIcon = () => (
  <svg width="17" height="17" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 6h18M16 10a4 4 0 0 1-8 0" />
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

export default function Navbar() {
  const [open,       setOpen]       = useState(false);
  const [scrolled,   setScrolled]   = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchVal,  setSearchVal]  = useState("");
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const update = () => setCartCount(getCartCount());
    update();
    window.addEventListener("cart:updated", update);
    window.addEventListener("storage", update);
    return () => {
      window.removeEventListener("cart:updated", update);
      window.removeEventListener("storage", update);
    };
  }, []);

  // close mobile menu on route change
  const handleNavClick = () => setOpen(false);

  return (
    <>
      <nav className={`nb-nav ${scrolled ? "nb-scrolled" : ""}`}>
        <div className="container">
          <div className="nb-inner">

            {/* Logo */}
            <Link to="/" className="nb-logo" onClick={handleNavClick}>
              Shafi Sons
            </Link>

            {/* Desktop links */}
            <ul className="nb-links">
              {navLinks.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    className={({ isActive }) => `nb-link ${isActive ? "nb-link-active" : ""}`}
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>

            {/* Right actions */}
            <div className="nb-actions">

              {/* Search */}
              <button className="nb-icon-btn" aria-label="Search" onClick={() => setSearchOpen(s => !s)}>
                <SearchIcon />
              </button>

              {/* Track Order */}
              <Link to="/track" className="nb-icon-btn" aria-label="Track Order">
                <TrackIcon />
              </Link>

              {/* Cart */}
              <Link to="/cart" className="nb-icon-btn nb-cart-btn" aria-label="Cart">
                <CartIcon />
                {cartCount > 0 && <span className="nb-cart-badge">{cartCount}</span>}
              </Link>

              {/* Shop CTA — desktop only */}
              <Link to="/shop" className="nb-cta-btn">
                Shop Now
              </Link>

              {/* Hamburger — mobile only */}
              <button
                className="nb-hamburger"
                aria-label="Toggle menu"
                onClick={() => setOpen(o => !o)}
              >
                {open ? <CloseIcon /> : <MenuIcon />}
              </button>

            </div>
          </div>
        </div>

        {/* Search bar dropdown */}
        {searchOpen && (
          <div className="nb-search-bar">
            <div className="container">
              <div className="nb-search-inner">
                <SearchIcon />
                <input
                  autoFocus
                  type="text"
                  className="nb-search-input"
                  placeholder="Search for furniture, chairs, tables…"
                  value={searchVal}
                  onChange={e => setSearchVal(e.target.value)}
                />
                <button className="nb-search-close" onClick={() => { setSearchOpen(false); setSearchVal(""); }}>
                  <CloseIcon />
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Mobile drawer */}
      {open && (
        <div className="nb-mobile-overlay" onClick={() => setOpen(false)}>
          <div className="nb-mobile-drawer" onClick={e => e.stopPropagation()}>
            <div className="nb-mobile-head">
              <Link to="/" className="nb-logo" onClick={handleNavClick}>
                Shafi Sons
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
