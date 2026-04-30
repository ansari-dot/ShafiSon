import { useEffect, useState } from "react";

const API_BASE = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/$/, "");

const InstagramIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.8" />
    <circle cx="12" cy="12" r="4.2" stroke="currentColor" strokeWidth="1.8" />
    <circle cx="17.3" cy="6.7" r="1.1" fill="currentColor" />
  </svg>
);

export default function HomeInstagramSection() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE}/api/instagram-posts`)
      .then((r) => r.json())
      .then((data) => setPosts(Array.isArray(data) ? data : []))
      .catch(() => setPosts([]));
  }, []);

  if (!posts.length) return null;

  return (
    <section className="home-instagram-section">
      <div className="container">
        <div className="home-instagram-head text-center">
          <span className="section-label">
            <InstagramIcon />
            View On Instagram
          </span>
          <h2 className="home-collection-modern-title">Daily Interior Inspiration</h2>
          <p className="home-collection-modern-sub">
            Follow us on Instagram for daily interior ideas and fabric inspiration.
          </p>
        </div>

        <div className="home-instagram-grid">
          {posts.map((post, index) => (
            <a
              key={post._id}
              href={post.href || "https://www.instagram.com/shafisons?igsh=aHF5YXE0aDgwcmlh"}
              target="_blank"
              rel="noreferrer"
              className="home-instagram-card"
              aria-label={post.title || `Instagram post ${index + 1}`}
            >
              <img
                src={post.image}
                alt={post.title || `Shafisons Instagram ${index + 1}`}
                loading={index === 0 ? "eager" : "lazy"}
              />
              <div className="home-instagram-overlay">
                <span className="home-instagram-chip">
                  <InstagramIcon />
                  <span>@shafisons</span>
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
