const steps = [
  {
    step: "01",
    title: "Browse & Choose",
    desc: "Explore our curated collection. Filter by room, style, or material to find your perfect match.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
        <circle cx="11" cy="11" r="7" strokeLinecap="round" strokeLinejoin="round" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35" />
      </svg>
    ),
  },
  {
    step: "02",
    title: "Customize & Order",
    desc: "Pick your size, fabric, and finish. Place your order securely with flexible payment options.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2v-5" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.586 3.586a2 2 0 0 1 2.828 2.828L12 15l-4 1 1-4 8.586-8.414z" />
      </svg>
    ),
  },
  {
    step: "03",
    title: "Delivered to Your Door",
    desc: "White-glove delivery and in-home setup included. Sit back and enjoy your new space.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 8h14M5 8a2 2 0 1 0 0-4h14a2 2 0 1 0 0 4M5 8v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 12h4" />
      </svg>
    ),
  },
];

export default function HowItWorks() {
  return (
    <section className="hiw-section">
      <div className="container">

        <div className="text-center mb-5">
          <span className="section-label">Simple Process</span>
          <h2 className="fs-2 fw-bold text-dark mt-2 mb-2">How It Works</h2>
          <p className="hiw-subtitle">
            Getting your dream furniture is easier than you think.
          </p>
        </div>

        <div className="hiw-grid">
          {steps.map((s, i) => (
            <div className="hiw-item" key={s.step}>

              {/* Step number + icon */}
              <div className="hiw-icon-col">
                <div className="hiw-icon-circle">
                  {s.icon}
                </div>
                {i < steps.length - 1 && (
                  <span className="hiw-line" aria-hidden="true" />
                )}
              </div>

              {/* Text */}
              <div className="hiw-text-col">
                <span className="hiw-num">{s.step}</span>
                <h3 className="hiw-title">{s.title}</h3>
                <p className="hiw-desc">{s.desc}</p>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
