import { useEffect, useState } from "react";
import { apiGet } from "../util/api";

export default function AdminCategories() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [items, setItems] = useState([]);

  useEffect(() => {
    let active = true;
    apiGet("/api/categories")
      .then((data) => {
        if (!active) return;
        setItems(Array.isArray(data) ? data : []);
        setError("");
      })
      .catch((err) => {
        if (!active) return;
        setError(err.message || "Failed to load categories");
      })
      .finally(() => {
        if (!active) return;
        setLoading(false);
      });
    return () => { active = false; };
  }, []);

  return (
    <main>
      <section className="section-pad">
        <div className="container">
          <div className="d-flex align-items-center justify-content-between mb-3">
            <div>
              <h2 className="mb-1 fw-semibold text-dark">Admin Categories</h2>
              <p className="small text-muted mb-0">Live data from REST API</p>
            </div>
          </div>

          {loading && <div className="alert alert-light">Loading categories...</div>}
          {error && <div className="alert alert-danger">{error}</div>}

          {!loading && !error && (
            <div className="table-responsive bg-white rounded-3">
              <table className="table align-middle mb-0">
                <thead className="border-bottom">
                  <tr className="text-sm text-dark">
                    {["Name", "Count", "Image URL", "Created"].map((head) => (
                      <th key={head} className="py-3 fw-semibold">{head}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {items.map((c) => (
                    <tr key={c._id}>
                      <td className="py-3 text-dark">{c.name}</td>
                      <td className="py-3 text-muted">{c.count ?? 0}</td>
                      <td className="py-3 text-muted">{c.img || "-"}</td>
                      <td className="py-3 text-muted">{c.createdAt ? new Date(c.createdAt).toLocaleDateString() : "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
