const posts = [
  { image: "/images/img-grid-1.jpg",       title: "Showroom Corners", href: "https://www.instagram.com/p/DU0_wQuABW2/" },
  { image: "/images/img-grid-2.jpg",       title: "Luxury Seating",   href: "https://www.instagram.com/reel/DU0-g-oCMMn/" },
  { image: "/images/img-grid-3.jpg",       title: "Light & Texture",  href: "https://www.instagram.com/p/DQuHkPqiJki/" },
  { image: "/images/why-choose-us-img.jpg",title: "Interior Mood",    href: "https://www.instagram.com/p/DU09aEpCATl/" },
  { image: "/images/post-1.jpg",           title: "Fabric Styling",   href: "https://www.instagram.com/p/DQgqrsECKfd/" },
  { image: "/images/post-2.jpg",           title: "Curtain Details",  href: "https://www.instagram.com/p/DQgqJbBiAb7/" },
  { image: "/images/post-3.jpg",           title: "Elegant Layers",   href: "https://www.instagram.com/p/DQeDENDAHR0/" },
  { image: "/images/couch.png",            title: "Signature Pieces", href: "https://www.instagram.com/p/DFXsHVFI-oL/" },
];

const InstagramIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.8" />
    <circle cx="12" cy="12" r="4.2" stroke="currentColor" strokeWidth="1.8" />
    <circle cx="17.3" cy="6.7" r="1.1" fill="currentColor" />
  </svg>
);

export default function HomeInstagramSection() {
  return (
    <section className="home-instagram-section">
      <div className="container">
        <div className="home-instagram-head text-center">
          <span className="section-label">View On Instagram</span>
          <h2 className="home-collection-modern-title">Daily Interior Inspiration</h2>
          <p className="home-collection-modern-sub">
            Hover any image to reveal the Instagram link and open our profile.
          </p>
        </div>

        <div className="home-instagram-grid">
          {posts.map((post, index) => (
            <a
              key={`${post.title}-${index}`}
              href={post.href}
              target="_blank"
              rel="noreferrer"
              className="home-instagram-card"
              aria-label={`Open Instagram: ${post.title}`}
            >
              <img src={post.image} alt={post.title} loading="lazy" />
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
