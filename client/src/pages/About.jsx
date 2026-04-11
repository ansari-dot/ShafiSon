import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import TestimonialSlider from "../components/TestimonialSlider";
import { team, stats } from "../data/siteData";
import { apiGet } from "../util/api";
import usePageMeta from "../util/usePageMeta";

/* â”€â”€ Icons â”€â”€ */
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
    desc: "Every piece passes a 12-point quality inspection. We use only sustainably sourced materials and time-tested construction methods.",
  },
  {
    icon: (
      <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
        <circle cx="12" cy="12" r="10" strokeLinecap="round" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3" />
      </svg>
    ),
    title: "Built to Last",
    desc: "We design furniture for decades, not seasons. Our pieces are backed by industry-leading warranties and built with heirloom-quality craftsmanship.",
  },
  {
    icon: (
      <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 0 1 2 2v1a2 2 0 0 0 2 2 2 2 0 0 1 2 2v2.945M8 3.935V5.5A2.5 2.5 0 0 0 10.5 8h.5a2 2 0 0 1 2 2 2 2 0 1 0 4 0 2 2 0 0 1 2-2h1.064M15 20.488V18a2 2 0 0 1 2-2h3.064" />
      </svg>
    ),
    title: "Sustainably Sourced",
    desc: "All wood comes from FSC-certified forests. Our packaging is 100% recyclable and we offset carbon emissions on every order shipped.",
  },
  {
    icon: (
      <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 0 0-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 0 1 5.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 0 1 9.288 0" />
      </svg>
    ),
    title: "Customer Obsessed",
    desc: "From first browse to white-glove delivery, we're with you every step. Our 98% satisfaction rate speaks for itself.",
  },
];

const timeline = [
  { year: "2010", title: "Founded in Lahore", desc: "Shafi Sons was born in a small Lahore workshop with a simple belief â€” beautiful furniture should be accessible to everyone." },
  { year: "2014", title: "First Flagship Store", desc: "We opened our first physical showroom in London, welcoming thousands of customers to experience our pieces in person." },
  { year: "2018", title: "Went Global Online", desc: "Launched our e-commerce platform, bringing Furni to customers across 40+ countries with free international shipping." },
  { year: "2021", title: "Sustainability Pledge", desc: "Committed to carbon-neutral operations by 2025. Switched to 100% renewable energy across all warehouses." },
  { year: "2024", title: "15,000+ Happy Homes", desc: "Crossed 15,000 satisfied customers and launched our custom furniture program for bespoke orders." },
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
      .then((doc) => {
        if (!active) return;
        setTeamSection(doc || null);
      })
      .catch(() => {
        if (!active) return;
        setTeamSection(null);
      });
    return () => {
      active = false;
    };
  }, []);

  const activeTeam = Array.isArray(teamSection?.members)
    ? teamSection.members.filter((m) => m?.active !== false)
    : team;

  return (
    <main className="au-page">

      {/* â”€â”€ Hero â”€â”€ */}
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
                About <span className="au-hero-accent">shafisons</span>
              </h1>
              <p className="au-hero-desc">
                Founded in 1972, shafisons has become a trusted name in curtain cloth, sofa fabrics, and office blinds.
                With decades of experience, shafisons is committed to delivering premium quality products that combine
                elegance, durability, and comfort.
              </p>
              <div className="au-hero-btns">
                <Link to="/shop" className="btn-brand d-inline-block">Shop Collection</Link>
                <Link to="/contact" className="au-contact-link">Contact Us â†’</Link>
              </div>
            </div>
            <div className="au-hero-right">
              <div className="au-hero-img-grid">
                <div className="au-img-main">
                  <img src="/images/why-choose-us-img.jpg" alt="Our workshop" className="img-fluid rounded-4" />
                </div>
                <div className="au-img-stack">
                  <img src="/images/img-grid-1.jpg" alt="Craftsmanship" className="img-fluid rounded-4" />
                  <img src="/images/img-grid-2.jpg" alt="Design" className="img-fluid rounded-4" />
                </div>
              </div>
              {/* Floating stat card */}
              <div className="au-float-card">
                <strong>15K+</strong>
                <span>Happy Customers Worldwide</span>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* â”€â”€ Stats â”€â”€ */}
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

      {/* â”€â”€ Our Story â”€â”€ */}
      <motion.section className="au-story section-pad" variants={revealUp} initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.2 }}>
        <div className="container">
          <div className="row g-5 align-items-center">
            <div className="col-lg-6">
              <div className="au-story-img-wrap">
                <img src="/images/img-grid-3.jpg" alt="Our story" className="img-fluid rounded-4 au-story-img" />
                <div className="au-story-badge">
                  <span className="au-story-badge-year">14</span>
                  <span className="au-story-badge-text">Years of<br />Excellence</span>
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <span className="section-label">About shafisons</span>
              <h2 className="fs-2 fw-bold text-dark mt-2 mb-3">
                Timeless Interiors Since 1972
              </h2>
              <p className="mb-3 au-body-text">
                Founded in 1972, shafisons has become a trusted name in curtain cloth, sofa fabrics, and office blinds.
                With decades of experience, shafisons is committed to delivering premium quality products that combine
                elegance, durability, and comfort.
              </p>
              <p className="mb-4 au-body-text">
                At shafisons, we understand that every space tells a story. That's why we provide a wide range of designs,
                textures, and styles to suit every home and office.
              </p>
              <ul className="au-check-list">
                {[
                  "Curtain Cloth by shafisons",
                  "Sofa Fabrics by shafisons",
                  "Office Blinds by shafisons",
                  "Serving Since 1972",
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

      {/* â”€â”€ Values â”€â”€ */}
      <motion.section className="au-values-section section-pad" variants={revealUp} initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.2 }}>
        <div className="container">
          <div className="text-center mb-5">
            <span className="section-label">What Drives Us</span>
            <h2 className="fs-2 fw-bold text-dark mt-2">Our Core Values</h2>
            <p className="mt-2 hiw-subtitle">The principles behind every piece we design and every decision we make.</p>
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

      {/* â”€â”€ Timeline â”€â”€ */}
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

      {/* â”€â”€ Team â”€â”€ */}
      <motion.section className="au-team-section section-pad" variants={revealUp} initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.2 }}>
        <div className="container">
          <div className="text-center mb-5">
            <span className="section-label">{teamSection?.title || "The People"}</span>
            <h2 className="fs-2 fw-bold text-dark mt-2">{teamSection?.heading || "Meet Our Team"}</h2>
            <p className="mt-2 hiw-subtitle">{teamSection?.text || "The talented individuals behind every Shafi Sons piece."}</p>
          </div>
          <motion.div className="au-team-grid" initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.2 }} transition={{ staggerChildren: 0.08 }}>
            {activeTeam.map((person, idx) => (
              <motion.div className="au-team-card" key={person.id || `${person.name}-${idx}`} variants={revealCard}>
                <div className="au-team-img-wrap">
                  <img src={person.img} alt={person.name} className="au-team-img" />
                  <div className="au-team-socials">
                    <a href="#" className="au-social-btn" aria-label="LinkedIn"><LinkedInIcon /></a>
                    <a href="#" className="au-social-btn" aria-label="Twitter"><TwitterIcon /></a>
                  </div>
                </div>
                <div className="au-team-info">
                  <h3 className="au-team-name">{person.name}</h3>
                  <span className="au-team-role">{person.role}</span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* â”€â”€ Testimonials â”€â”€ */}
      <TestimonialSlider />

      {/* â”€â”€ CTA Banner â”€â”€ */}
      <motion.section className="au-cta-section" variants={revealUp} initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.2 }}>
        <div className="container">
          <div className="au-cta-inner">
            <div className="au-cta-left">
              <h2 className="au-cta-title">Transform your space with shafisons today.</h2>
              <p className="au-cta-desc">Premium curtain cloth, sofa fabrics, and office blinds â€” trusted since 1972.</p>
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






