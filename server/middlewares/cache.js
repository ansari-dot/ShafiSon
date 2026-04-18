const store = new Map();
const MAX_CACHE_SIZE = 500;

/**
 * Simple in-memory cache middleware.
 * @param {number} ttlSeconds - how long to cache the response
 */
export function cache(ttlSeconds = 30) {
  return (req, res, next) => {
    if (req.method !== "GET") return next();

    const key = req.originalUrl;
    const hit = store.get(key);

    if (hit && Date.now() < hit.expiresAt) {
      res.setHeader("X-Cache", "HIT");
      res.setHeader("Content-Type", "application/json");
      res.setHeader("Cache-Control", `public, max-age=${Math.floor((hit.expiresAt - Date.now()) / 1000)}`);
      return res.send(hit.body);
    }

    const originalJson = res.json.bind(res);
    res.json = (data) => {
      if (store.size >= MAX_CACHE_SIZE) {
        const firstKey = store.keys().next().value;
        store.delete(firstKey);
      }
      store.set(key, {
        body: JSON.stringify(data),
        expiresAt: Date.now() + ttlSeconds * 1000,
      });
      res.setHeader("X-Cache", "MISS");
      res.setHeader("Cache-Control", `public, max-age=${ttlSeconds}`);
      return originalJson(data);
    };

    next();
  };
}

/** Call this to invalidate all cached entries matching a prefix */
export function invalidateCache(prefix) {
  for (const key of store.keys()) {
    if (key.startsWith(prefix)) store.delete(key);
  }
}
