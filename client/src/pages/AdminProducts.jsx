import { useEffect, useState } from "react";
import { apiGet, apiPost } from "../util/api";
import { formatPKR } from "../util/formatCurrency";

const emptyForm = {
  title: "",
  price: "",
  category: "",
  subcategory: "",
  material: "",
  img: "",
  imgs: "",
  rating: "",
  reviews: "",
  badge: "",
  colors: "",
  sizes: "",
  description: "",
  inStock: true,
};

export default function AdminProducts() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    let active = true;
    Promise.all([apiGet("/api/products"), apiGet("/api/categories")])
      .then(([products, cats]) => {
        if (!active) return;
        setItems(Array.isArray(products) ? products : []);
        setCategories(Array.isArray(cats) ? cats : []);
        setError("");
      })
      .catch((err) => {
        if (!active) return;
        setError(err.message || "Failed to load data");
      })
      .finally(() => {
        if (!active) return;
        setLoading(false);
      });
    return () => { active = false; };
  }, []);

  const onChange = (key, val) => {
    setForm((f) => ({ ...f, [key]: val }));
  };

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    const payload = {
      title: form.title.trim(),
      price: Number(form.price),
      category: form.category.trim(),
      subcategory: form.subcategory.trim(),
      material: form.material.trim(),
      img: form.img.trim(),
      imgs: form.imgs ? form.imgs.split(",").map((s) => s.trim()).filter(Boolean) : [],
      rating: form.rating ? Number(form.rating) : 0,
      reviews: form.reviews ? Number(form.reviews) : 0,
      badge: form.badge ? form.badge.trim() : null,
      colors: form.colors ? form.colors.split(",").map((s) => s.trim()).filter(Boolean) : [],
      sizes: form.sizes ? form.sizes.split(",").map((s) => s.trim()).filter(Boolean) : [],
      description: form.description.trim(),
      inStock: Boolean(form.inStock),
    };

    try {
      const created = await apiPost("/api/products", payload);
      setItems((prev) => [created, ...prev]);
      setForm(emptyForm);
    } catch (err) {
      setError(err.message || "Failed to create product");
    } finally {
      setSaving(false);
    }
  };

  return (
    <main>
      <section className="section-pad">
        <div className="container">
          <div className="d-flex align-items-center justify-content-between mb-3">
            <div>
              <h2 className="mb-1 fw-semibold text-dark">Admin Products</h2>
              <p className="small text-muted mb-0">Live data from REST API</p>
            </div>
          </div>

          <div className="bg-white rounded-3 border p-3 mb-4">
            <h5 className="fw-semibold text-dark mb-3">Add Product</h5>
            <form className="row g-3" onSubmit={submit}>
              <div className="col-md-6">
                <label className="form-label">Title *</label>
                <input className="form-control" value={form.title} onChange={(e) => onChange("title", e.target.value)} required />
              </div>
              <div className="col-md-3">
                <label className="form-label">Price *</label>
                <input type="number" className="form-control" value={form.price} onChange={(e) => onChange("price", e.target.value)} required />
              </div>
              <div className="col-md-3">
                <label className="form-label">Material *</label>
                <input className="form-control" value={form.material} onChange={(e) => onChange("material", e.target.value)} required />
              </div>

              <div className="col-md-3">
                <label className="form-label">Category *</label>
                <select className="form-select" value={form.category} onChange={(e) => { onChange("category", e.target.value); onChange("subcategory", ""); }} required>
                  <option value="">Select category</option>
                  {categories.map((c) => (
                    <option key={c._id} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div className="col-md-3">
                <label className="form-label">Subcategory</label>
                <select className="form-select" value={form.subcategory} onChange={(e) => onChange("subcategory", e.target.value)}>
                  <option value="">Select subcategory</option>
                  {(categories.find((c) => c.name === form.category)?.subcategories || []).map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div className="col-md-6">
                <label className="form-label">Badge</label>
                <input className="form-control" value={form.badge} onChange={(e) => onChange("badge", e.target.value)} placeholder="New, Sale, Popular" />
              </div>

              <div className="col-md-6">
                <label className="form-label">Main Image URL</label>
                <input className="form-control" value={form.img} onChange={(e) => onChange("img", e.target.value)} />
              </div>
              <div className="col-md-6">
                <label className="form-label">Gallery Image URLs (comma separated)</label>
                <input className="form-control" value={form.imgs} onChange={(e) => onChange("imgs", e.target.value)} />
              </div>

              <div className="col-md-4">
                <label className="form-label">Colors (comma separated)</label>
                <input className="form-control" value={form.colors} onChange={(e) => onChange("colors", e.target.value)} />
              </div>
              <div className="col-md-4">
                <label className="form-label">Sizes (comma separated)</label>
                <input className="form-control" value={form.sizes} onChange={(e) => onChange("sizes", e.target.value)} />
              </div>
              <div className="col-md-2">
                <label className="form-label">Rating</label>
                <input type="number" step="0.1" className="form-control" value={form.rating} onChange={(e) => onChange("rating", e.target.value)} />
              </div>
              <div className="col-md-2">
                <label className="form-label">Reviews</label>
                <input type="number" className="form-control" value={form.reviews} onChange={(e) => onChange("reviews", e.target.value)} />
              </div>

              <div className="col-12">
                <label className="form-label">Description</label>
                <textarea className="form-control" rows="3" value={form.description} onChange={(e) => onChange("description", e.target.value)} />
              </div>

              <div className="col-12 d-flex align-items-center gap-2">
                <input type="checkbox" className="form-check-input" id="inStock" checked={form.inStock} onChange={(e) => onChange("inStock", e.target.checked)} />
                <label className="form-check-label" htmlFor="inStock">In Stock</label>
              </div>

              <div className="col-12">
                <button className="btn-dark" disabled={saving}>
                  {saving ? "Saving..." : "Add Product"}
                </button>
              </div>
            </form>
          </div>

          {loading && <div className="alert alert-light">Loading products...</div>}
          {error && <div className="alert alert-danger">{error}</div>}

          {!loading && !error && (
            <div className="table-responsive bg-white rounded-3">
              <table className="table align-middle mb-0">
                <thead className="border-bottom">
                  <tr className="text-sm text-dark">
                    {["Title", "Category", "Price", "Stock", "Rating", "Reviews", "Created"].map((head) => (
                      <th key={head} className="py-3 fw-semibold">{head}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {items.map((p) => (
                    <tr key={p._id}>
                      <td className="py-3 text-dark">{p.title}</td>
                      <td className="py-3 text-muted">{p.category}{p.subcategory ? ` / ${p.subcategory}` : ""}</td>
                      <td className="py-3 text-dark">{formatPKR(p.price)}</td>
                      <td className="py-3">
                        <span className={p.inStock ? "badge text-bg-success" : "badge text-bg-secondary"}>
                          {p.inStock ? "In Stock" : "Out"}
                        </span>
                      </td>
                      <td className="py-3 text-muted">{p.rating ?? 0}</td>
                      <td className="py-3 text-muted">{p.reviews ?? 0}</td>
                      <td className="py-3 text-muted">{p.createdAt ? new Date(p.createdAt).toLocaleDateString() : "-"}</td>
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
