import { useState } from "react";
import { roomStyles } from "../data/siteData";

const tabIcons = [
  // Sofa / Living Room
  <svg key="living" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 10.5V8a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v2.5M3 10.5a2 2 0 0 0-2 2V17h22v-4.5a2 2 0 0 0-2-2M3 10.5h18M1 17v2m22-2v2M7 10.5V17m10-6.5V17" />
  </svg>,
  // Bed / Bedroom
  <svg key="bedroom" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10M3 12h18M21 7v10M3 9a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4" />
  </svg>,
  // Monitor / Office
  <svg key="office" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
    <rect x="2" y="3" width="20" height="14" rx="2" strokeLinecap="round" strokeLinejoin="round" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 21h8M12 17v4" />
  </svg>,
];

const highlightIcons = {
  style: (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h10" />
    </svg>
  ),
  palette: (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="12" r="9" strokeLinecap="round" />
      <circle cx="9" cy="9" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="15" cy="9" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="9" cy="15" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="15" cy="15" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  ),
  lighting: (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 18h6M10 22h4M12 2a7 7 0 0 1 7 7c0 2.5-1.3 4.7-3.3 6H8.3A7 7 0 0 1 12 2z" />
    </svg>
  ),
  size: (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 8V4m0 0h4M4 4l5 5M20 8V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5M20 16v4m0 0h-4m4 0l-5-5" />
    </svg>
  ),
};

const iconKeys = ["style", "palette", "lighting", "size"];

export default function RoomInspiration() {
  const [active, setActive] = useState(0);
  const room = roomStyles[active];

  return (
    <section className="room-section">
      <div className="container">

        <div className="text-center mb-5">
          <span className="section-label">Get Inspired</span>
          <h2 className="fs-2 fw-bold text-dark mt-2 mb-2">Room Inspiration</h2>
          <p className="hiw-subtitle">Explore curated looks for every room in your home.</p>
        </div>

        {/* Tabs */}
        <div className="room-tabs mb-5">
          {roomStyles.map((r, i) => (
            <button
              key={r.id}
              className={`room-tab-btn ${i === active ? "active" : ""}`}
              onClick={() => setActive(i)}
            >
              <span className="room-tab-icon">{tabIcons[i]}</span>
              {r.name}
            </button>
          ))}
        </div>

        <div className="row g-5 align-items-center">

          {/* Image */}
          <div className="col-lg-7">
            <div className="room-img-wrap">
              <img src={room.img} alt={room.name} className="img-fluid rounded-4 room-main-img" />
              <span className="room-badge">{room.tag}</span>
            </div>
          </div>

          {/* Info */}
          <div className="col-lg-5">
            <span className="section-label">{room.name}</span>
            <h3 className="fs-2 fw-bold text-dark mt-2 mb-3">{room.title}</h3>
            <p className="mb-4 room-desc">{room.desc}</p>

            <div className="room-highlights-grid mb-4">
              {room.highlights.map((h, i) => (
                <div className="room-highlight-card" key={i}>
                  <div className="room-hl-icon">
                    {highlightIcons[iconKeys[i]]}
                  </div>
                  <div>
                    <strong className="room-hl-label">{h.label}</strong>
                    <span className="room-hl-value">{h.value}</span>
                  </div>
                </div>
              ))}
            </div>

            <a href="/shop" className="btn-brand d-inline-block">
              Shop This Look
            </a>
          </div>

        </div>
      </div>
    </section>
  );
}
