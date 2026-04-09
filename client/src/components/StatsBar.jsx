import { stats } from "../data/siteData";

export default function StatsBar() {
  return (
    <section className="stats-bar section-pad">
      <div className="container">
        <div className="row g-4 text-center">
          {stats.map((stat) => (
            <div className="col-6 col-md-3" key={stat.id}>
              <div className="stat-item">
                <h3 className="stat-number">{stat.value}</h3>
                <p className="stat-label mb-0">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
