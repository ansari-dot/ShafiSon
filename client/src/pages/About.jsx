import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import TestimonialSlider from "../components/TestimonialSlider";
import { team, stats } from "../data/siteData";
import { apiGet } from "../util/api";
import usePageMeta from "../util/usePageMeta";
import aboutCurtain from "../assets/about us/curtain.jpg";
import aboutOffice from "../assets/about us/office.jpg";
import aboutSofa from "../assets/about us/sofa.jpg";

const ChevronIcon = () => (
  <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
  </svg>
);
const CheckIcon = () => (
  <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);
const LinkedInIcon = () => (
  <svg width="15" height="15" fill="currentColor" viewBox="0 0 24 24">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);
const TwitterIcon = () => (
  <svg width="15" height="15" fill="currentColor" viewBox="0 0 24 24">
    <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
  </svg>
);

const values = [
  {
    icon: (
      <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
    title: "Quality First",
    desc: "We prioritize premium materials and strict quality standards to ensure every product delivers durability, comfort, and long-lasting performance.",
  },
  {
    icon: (
      <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
        <circle cx="12" cy="12" r="10" strokeLinecap="round" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3" />
      </svg>
    ),
    title: "Designed to Last",
    desc: "Our fabrics and solutions are crafted to stand the test of time, combining strong materials with timeless aesthetics.",
  },
  {
    icon: (
      <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 0 1 2 2v1a2 2 0 0 0 2 2 2 2 0 0 1 2 2v2.945M8 3.935V5.5A2.5 2.5 0 0 0 10.5 8h.5a2 2 0 0 1 2 2 2 2 0 1 0 4 0 2 2 0 0 1 2-2h1.064M15 20.488V18a2 2 0 0 1 2-2h3.064" />
      </svg>
    ),
    title: "Wide Product Range",
    desc: "From curtains and blinds to floor seating and upholstery fabrics, we offer versatile solutions for every interior need.",
  },
  {
    icon: (
      <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 0 0-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 0 1 5.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 0 1 9.288 0" />
      </svg>
    ),
    title: "Customer Focused",
    desc: "From selection to delivery, we are committed to providing a seamless experience with high customer satisfaction.",
  },
];

const timeline = [
  { year: "1975", title: "Founded in Lahore", desc: "Shafisons was established with a vision to bring premium interior fabrics and solutions to every home and commercial space." },
  { year: "1990", title: "Expanding Our Range", desc: "We expanded our product line to include custom drapery, modern blinds, and upholstery fabrics to serve a wider clientele." },
  { year: "2005", title: "Commercial Projects", desc: "Shafisons began serving large-scale commercial and office interior projects, becoming a trusted partner for businesses." },
  { year: "2015", title: "Floor Seating & Majlis", desc: "Launched our floor seating and Majlis design collection, catering to traditional and contemporary interior styles." },
  { year: "2024", title: "15,000+ Happy Customers", desc: "Crossed 15,000 satisfied customers and continue to grow as a leading name in premium interior fabrics & solutions." },
];

const revealUp = {
  hidden: { opacity: 0, y: 36, filter: "blur(8px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.55, ease: "easeOut" },
  },
};

const revealCard = {
  hidden: { opacity: 0, y: 24, scale: 0.98 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.45, ease: "easeOut" },
  },
};

export default function About() {
  const [teamSection, setTeamSection] = useState(null);

  useEffect(() => {
    let active = true;
    apiGet("/api/about-team")
      .then((doc) => { if (!active) return; setTeamSection(doc || null); })
      .catch(() => { if (!active) return; setTeamSection(null); });
    return () => { active = false; };
  }, []);

  const activeTeam = Array.isArray(teamSection?.members)
    ? teamSection.members.filter((m) => m?.active !== false)
    : team;

  return (
    <main className="au-page">

      {/* Hero */}
      <motion.section className="au-hero" variants={revealUp} initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.2 }}>
        <div className="container">
          <nav className="pd-breadcrumb mb-4">
            <Link to="/">Home</Link>
            <ChevronIcon />
            <span>About Us</span>
          </nav>
          <div className="au-hero-grid">
            <div className="au-hero-left">
              <span className="section-label">About Us</span>
              <h1 className="au-hero-title">
                About <span className="au-hero-accent">Shafisons</span>
              </h1>
              <p className="au-hero-desc">
                Founded in 1975, Shafisons has grown into a trusted name in premium interior fabrics and solutions.
                From elegant curtains and modern blinds to floor seating and upholstery fabrics, we are dedicated to
                delivering quality, style, and comfort for every space.
              </p>
              <p className="au-hero-desc">
                With decades of experience, our focus remains on craftsmanship, durability, and timeless design that
                enhances both homes and commercial environments.
              </p>
              <div className="au-hero-btns">
                <Link to="/shop" className="btn-brand d-inline-block">Explore Collection &rarr;</Link>
                <Link to="/contact" className="au-contact-link">Contact Us &rarr;</Link>
              </div>
            </div>
            <div className="au-hero-right">
              <div className="au-hero-img-grid">
                <div className="au-img-main">
                  <img src={aboutCurtain} alt="Curtain fabrics" className="img-fluid rounded-4" />
                </div>
                <div className="au-img-stack">
                  <img src={aboutOffice} alt="Office blinds" className="img-fluid rounded-4" />
                  <img src={aboutSofa} alt="Sofa fabrics" className="img-fluid rounded-4" />
                </div>
              </div>
              <div className="au-float-card">
                <strong>15K+</strong>
                <span>Happy Customers Worldwide</span>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Stats */}
      <motion.section className="au-stats-section" variants={revealUp} initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.2 }}>
        <div className="container">
          <motion.div className="au-stats-grid" initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.2 }} transition={{ staggerChildren: 0.08 }}>
            {stats.map((s) => (
              <motion.div className="au-stat-item" key={s.id} variants={revealCard}>
                <strong className="au-stat-val">{s.value}</strong>
                <span className="au-stat-label">{s.label}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Story */}
      <motion.section className="au-story section-pad" variants={revealUp} initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.2 }}>
        <div className="container">
          <div className="row g-5 align-items-center">
            <div className="col-lg-6">
              <div className="au-story-img-wrap">
                <img src={aboutSofa} alt="Our story" className="img-fluid rounded-4 au-story-img" />
                <div className="au-story-badge">
                  <span className="au-story-badge-year">45+</span>
                  <span className="au-story-badge-text">Years of<br />Excellence</span>
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <span className="section-label">About Shafisons</span>
              <h2 className="fs-2 fw-bold text-dark mt-2 mb-3">
                Timeless Interiors Since 1975
              </h2>
              <p className="mb-3 au-body-text">
                For over four decades, Shafisons has been crafting interior solutions that blend tradition with modern
                living. We specialize in a wide range of products including curtain fabrics, custom drapery, blinds,
                floor seating, and premium upholstery fabrics.
              </p>
              <p className="mb-4 au-body-text">
                Every space tells a story — and at Shafisons, we help you design it with the right textures, colors,
                and materials. Whether it's a modern home, office, or traditional setting, our collections are designed
                to suit every style.
              </p>
              <ul className="au-check-list">
                {[
                  "Premium Curtain Fabrics & Custom Drapery",
                  "Modern & Office Blinds Solutions",
                  "Floor Seating & Majlis Designs",
                  "Upholstery & Sofa Fabric Collection",
                  "Serving Since 1975",
                ].map((item, i) => (
                  <li key={i}>
                    <span className="au-check-icon"><CheckIcon /></span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Values */}
      <motion.section className="au-values-section section-pad" variants={revealUp} initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.2 }}>
        <div className="container">
          <div className="text-center mb-5">
            <span className="section-label">What Drives Us</span>
            <h2 className="fs-2 fw-bold text-dark mt-2">Our Core Values</h2>
            <p className="mt-2 hiw-subtitle">The principles behind every fabric, every design, and every space we create.</p>
          </div>
          <motion.div className="au-values-grid" initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.2 }} transition={{ staggerChildren: 0.08 }}>
            {values.map((v, i) => (
              <motion.div className="au-value-card" key={i} variants={revealCard}>
                <div className="au-value-icon">{v.icon}</div>
                <h3 className="au-value-title">{v.title}</h3>
                <p className="au-value-desc">{v.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Timeline */}
      <motion.section className="au-timeline-section section-pad" variants={revealUp} initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.2 }}>
        <div className="container">
          <div className="text-center mb-5">
            <span className="section-label">Our Journey</span>
            <h2 className="fs-2 fw-bold text-dark mt-2">How We Got Here</h2>
          </div>
          <div className="au-timeline">
            {timeline.map((item, i) => (
              <motion.div className={`au-timeline-item ${i % 2 === 0 ? "left" : "right"}`} key={i} variants={revealCard} initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.2 }}>
                <div className="au-timeline-card">
                  <span className="au-timeline-year">{item.year}</span>
                  <h3 className="au-timeline-title">{item.title}</h3>
                  <p className="au-timeline-desc">{item.desc}</p>
                </div>
                <div className="au-timeline-dot" />
              </motion.div>
            ))}
            <div className="au-timeline-line" />
          </div>
        </div>
      </motion.section>



      {/* Testimonials */}
      <TestimonialSlider />

      {/* CTA */}
      <motion.section className="au-cta-section" variants={revealUp} initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.2 }}>
        <div className="container">
          <div className="au-cta-inner">
            <div className="au-cta-left">
              <h2 className="au-cta-title">Transform your space with Shafisons today.</h2>
              <p className="au-cta-desc">Premium interior fabrics &amp; solutions — trusted since 1975.</p>
            </div>
            <div className="au-cta-btns">
              <Link to="/contact" className="au-cta-primary">Contact Us Now</Link>
            </div>
          </div>
        </div>
      </motion.section>

    </main>
  );
}
