import { Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import PromoBar from "./PromoBar";

export default function Layout() {
  const { pathname } = useLocation();
  const isHomePage = pathname === "/";

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className={`site-shell${isHomePage ? " site-shell-home" : " site-shell-inner"}`}>
      <Navbar />
      <main className="site-content">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
