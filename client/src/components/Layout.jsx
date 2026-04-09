import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import PromoBar from "./PromoBar";

export default function Layout() {
  return (
    <div className="min-vh-100">
      <PromoBar />
      <Navbar />
      <Outlet />
      <Footer />
    </div>
  );
}
