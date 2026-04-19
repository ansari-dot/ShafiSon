import app from "./app.js";

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  warmupCache();
});

// Pre-populate server cache so first real visitor gets instant responses
async function warmupCache() {
  const base = `http://localhost:${PORT}`;
  const routes = [
    "/api/home",
    "/api/products/navigation",
    "/api/products?limit=50",
    "/api/categories",
    "/api/hero-banner",
    "/api/home-collection",
    "/api/popular-picks",
    "/api/deal-section",
    "/api/category-sections",
    "/api/testimonials?active=true",
    "/api/compare-section",
  ];
  for (const route of routes) {
    try {
      await fetch(`${base}${route}`);
    } catch {
      // ignore — server may not be fully ready yet
    }
  }
  console.log("Cache warmed up");
}
