import { useEffect, useState } from "react";
import { apiGet, apiPost } from "../util/api";

const emptyForm = { image: "", title: "", href: "", order: 0 };

export default function AdminInstagram() {
  const [posts, setPosts] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const load = () =>
    apiGet("/api/instagram-posts")
      .then((data) => setPosts(Array.isArray(data) ? data : []))
      .catch(() => {});

  useEffect(() => { load(); }, []);

  const onChange = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const submit = async (e) => {
    e.preventDefault();
    if (!form.image.trim()) { setError("Image URL is required."); return; }
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      await apiPost("/api/instagram-posts", {
        image: form.image.trim(),
        title: form.title.trim(),
        href: form.href.trim(),
        order: Number(form.order) || 0,
      });
      setForm(emptyForm);
      setSuccess("Post added successfully!");
      load();
    } catch (err) {
      setError(err.message || "Failed to add post.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this post?")) return;
    setDeletingId(id);
    try {
      await fetch(`/api/instagram-posts/${id}`, { method: "DELETE" });
      setPosts((prev) => prev.filter((p) => p._id !== id));
    } catch {
      setError("Failed to delete.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <main>
      <section className="section-pad">
        <div className="container">
          <div className="d-flex align-items-center justify-content-between mb-3">
            <div>
              <h2 className="mb-1 fw-semibold text-dark">Instagram Posts</h2>
              <p className="small text-muted mb-0">Manage home page Instagram section images</p>
            </div>
          </div>

          {/* Add Form */}
          <div className="bg-white rounded-3 border p-3 mb-4">
            <h5 className="fw-semibold text-dark mb-3">Add New Post</h5>
            {error && <div className="alert alert-danger py-2">{error}</div>}
            {success && <div className="alert alert-success py-2">{success}</div>}
            <form className="row g-3" onSubmit={submit}>
              <div className="col-md-6">
                <label className="form-label">Image URL *</label>
                <input
                  className="form-control"
                  placeholder="https://..."
                  value={form.image}
                  onChange={(e) => onChange("image", e.target.value)}
                  required
                />
              </div>
              <div className="col-md-3">
                <label className="form-label">Title</label>
                <input
                  className="form-control"
                  placeholder="e.g. Showroom Corners"
                  value={form.title}
                  onChange={(e) => onChange("title", e.target.value)}
                />
              </div>
              <div className="col-md-3">
                <label className="form-label">Order</label>
                <input
                  type="number"
                  className="form-control"
                  value={form.order}
                  onChange={(e) => onChange("order", e.target.value)}
                />
              </div>
              <div className="col-md-9">
                <label className="form-label">Instagram Link</label>
                <input
                  className="form-control"
                  placeholder="https://www.instagram.com/p/..."
                  value={form.href}
                  onChange={(e) => onChange("href", e.target.value)}
                />
              </div>
              {form.image && (
                <div className="col-12">
                  <label className="form-label">Preview</label>
                  <img
                    src={form.image}
                    alt="preview"
                    style={{ maxHeight: 160, maxWidth: 200, objectFit: "contain", borderRadius: 8, border: "1px solid #e5e7eb" }}
                  />
                </div>
              )}
              <div className="col-12">
                <button className="btn-dark" disabled={saving}>
                  {saving ? "Saving..." : "Add Post"}
                </button>
              </div>
            </form>
          </div>

          {/* Posts Grid */}
          <div className="bg-white rounded-3 border p-3">
            <h5 className="fw-semibold text-dark mb-3">All Posts ({posts.length})</h5>
            {posts.length === 0 ? (
              <p className="text-muted">No posts yet. Add one above.</p>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "1rem" }}>
                {posts.map((post) => (
                  <div key={post._id} style={{ border: "1px solid #e5e7eb", borderRadius: 8, overflow: "hidden", background: "#fafafa" }}>
                    <img
                      src={post.image}
                      alt={post.title}
                      style={{ width: "100%", height: "auto", display: "block" }}
                    />
                    <div style={{ padding: "10px 12px" }}>
                      <p style={{ fontSize: 13, fontWeight: 600, margin: "0 0 4px", color: "#111" }}>
                        {post.title || "Untitled"}
                      </p>
                      {post.href && (
                        <a
                          href={post.href}
                          target="_blank"
                          rel="noreferrer"
                          style={{ fontSize: 11, color: "#6b7280", wordBreak: "break-all" }}
                        >
                          {post.href.length > 40 ? post.href.slice(0, 40) + "..." : post.href}
                        </a>
                      )}
                      <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
                        <span style={{ fontSize: 11, color: "#9ca3af" }}>Order: {post.order}</span>
                        <button
                          onClick={() => handleDelete(post._id)}
                          disabled={deletingId === post._id}
                          style={{
                            marginLeft: "auto",
                            padding: "4px 10px",
                            fontSize: 12,
                            fontWeight: 600,
                            color: "#ef4444",
                            background: "transparent",
                            border: "1px solid #ef4444",
                            borderRadius: 4,
                            cursor: "pointer",
                          }}
                        >
                          {deletingId === post._id ? "..." : "Delete"}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
