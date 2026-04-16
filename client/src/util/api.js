const API_BASE = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/$/, "");
const GET_CACHE_TTL_MS = 15000;
const responseCache = new Map();
const inflightRequests = new Map();

function buildUrl(path) {
  return `${API_BASE}${path}`;
}

function clearGetCache() {
  responseCache.clear();
  inflightRequests.clear();
}

export async function apiGet(path) {
  const url = buildUrl(path);
  const now = Date.now();
  const cached = responseCache.get(url);

  if (cached && cached.expiresAt > now) {
    return cached.data;
  }

  if (inflightRequests.has(url)) {
    return inflightRequests.get(url);
  }

  const request = fetch(url)
    .then(async (res) => {
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Request failed: ${res.status}`);
      }

      const data = await res.json();
      responseCache.set(url, {
        data,
        expiresAt: Date.now() + GET_CACHE_TTL_MS,
      });
      return data;
    })
    .finally(() => {
      inflightRequests.delete(url);
    });

  inflightRequests.set(url, request);
  return request;
}

export async function apiPost(path, body) {
  const res = await fetch(buildUrl(path), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Request failed: ${res.status}`);
  }
  clearGetCache();
  return res.json();
}

export async function apiPut(path, body) {
  const res = await fetch(buildUrl(path), {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Request failed: ${res.status}`);
  }
  clearGetCache();
  return res.json();
}

export async function apiDelete(path) {
  const res = await fetch(buildUrl(path), { method: "DELETE" });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Request failed: ${res.status}`);
  }
  clearGetCache();
  return res.json();
}
