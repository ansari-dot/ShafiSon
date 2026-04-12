import { useEffect, useState } from "react";
import { apiGet, apiPost, apiPut, apiDelete } from "../util/api";

const emptyForm = { name: "", img: "", subcategories: "" };

export default function AdminCategories() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    apiGet("/api/categories")
      .then((data) => { setItems(Array.isArray(data) ? data : []); setError(""); })
      .catch((err) => setError(err.message || "Failed to load categories"))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const onChange = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const startEdit = (c) => {
    setEditId(c._id);
    setForm({ name: c.name, img: c.img || "", subcategories: (c.subcategories || []).join(", ") });
  };

  const cancelEdit = () => { setEditId(null); setForm(emptyForm); };

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    const payload = {
      name: form.name.trim(),
      img: form.img.trim(),
      subcategories: form.subcategories ? form.subcategories.split(",").map((s) => s.trim()).filter(Boolean) : [],
    };
    try {
      if (editId) {
        const updated = await apiPut(`/api/categories/${editId}`, payload);
        setItems((prev) => prev.map((c) => (c._id === editId ? updated : c)));
        cancelEdit();
      } else {
        const created = await apiPost("/api/categories", payload);
        setItems((prev) => [created, ...prev]);
        setForm(emptyForm);
      }
    } catch (err) {
      setError(err.message || "Failed to save category");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this category?")) return;
    try {
      await apiDelete(`/api/categories/${id}`);
      setItems((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      setError(err.message || "Failed to delete");
    }
  };

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

          <div className="bg-white rounded-3 border p-3 mb-4">
            <h5 className="fw-semibold text-dark mb-3">{editId ? "Edit Category" : "Add Category"}</h5>
            <form className="row g-3" onSubmit={submit}>
              <div className="col-md-4">
                <label className="form-label">Name *</label>
                <input className="form-control" value={form.name} onChange={(e) => onChange("name", e.target.value)} required />
              </div>
              <div className="col-md-4">
                <label className="form-label">Image URL</label>
                <input className="form-control" value={form.img} onChange={(e) => onChange("img", e.target.value)} />
              </div>
              <div className="col-md-4">
                <label className="form-label">Subcategories (comma separated)</label>
                <input className="form-control" value={form.subcategories} onChange={(e) => onChange("subcategories", e.target.value)} placeholder="e.g. Sofas, Chairs, Tables" />
              </div>
              <div className="col-12 d-flex gap-2">
                <button className="btn-dark" disabled={saving}>{saving ? "Saving..." : editId ? "Update Category" : "Add Category"}</button>
                {editId && <button type="button" className="btn btn-outline-secondary" onClick={cancelEdit}>Cancel</button>}
              </div>
            </form>
          </div>

          {loading && <div className="alert alert-light">Loading categories...</div>}
          {error && <div className="alert alert-danger">{error}</div>}

          {!loading && !error && (
            <div className="table-responsive bg-white rounded-3">
              <table className="table align-middle mb-0">
                <thead className="border-bottom">
                  <tr className="text-sm text-dark">
                    {["Name", "Subcategories", "Count", "Image URL", "Created", "Actions"].map((head) => (
                      <th key={head} className="py-3 fw-semibold">{head}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {items.map((c) => (
                    <tr key={c._id}>
                      <td className="py-3 text-dark">{c.name}</td>
                      <td className="py-3 text-muted">
                        {(c.subcategories || []).length
                          ? (c.subcategories || []).map((s) => (
                              <span key={s} className="badge text-bg-light border me-1">{s}</span>
                            ))
                          : <span className="text-muted">-</span>}
                      </td>
                      <td className="py-3 text-muted">{c.count ?? 0}</td>
                      <td className="py-3 text-muted">{c.img || "-"}</td>
                      <td className="py-3 text-muted">{c.createdAt ? new Date(c.createdAt).toLocaleDateString() : "-"}</td>
                      <td className="py-3">
                        <div className="d-flex gap-2">
                          <button className="btn btn-sm btn-outline-dark" onClick={() => startEdit(c)}>Edit</button>
                          <button className="btn btn-sm btn-outline-danger" onClick={() => remove(c._id)}>Delete</button>
                        </div>
                      </td>
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
