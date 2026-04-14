const WISHLIST_KEY = "shafisons_wishlist";
const WISHLIST_FALLBACK_KEY = "shafisons_wishlist_session";

export function getWishlist() {
  try {
    const raw = localStorage.getItem(WISHLIST_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    if (Array.isArray(parsed)) return parsed;
  } catch {
    // ignore
  }
  try {
    const raw = sessionStorage.getItem(WISHLIST_FALLBACK_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function setWishlist(items) {
  localStorage.setItem(WISHLIST_KEY, JSON.stringify(items));
  sessionStorage.setItem(WISHLIST_FALLBACK_KEY, JSON.stringify(items));
  window.dispatchEvent(new CustomEvent("wishlist:updated"));
}

export function hasInWishlist(id) {
  return getWishlist().some((item) => String(item.id) === String(id));
}

export function addToWishlist(item) {
  const list = getWishlist();
  if (list.some((entry) => String(entry.id) === String(item.id))) return;
  list.unshift({
    id: item.id,
    title: item.title,
    img: item.img,
    price: Number(item.price || 0),
    priceUnit: item.priceUnit || 'per yard',
    category: item.category || "",
  });
  setWishlist(list);
}

export function removeFromWishlist(id) {
  const list = getWishlist().filter((item) => String(item.id) !== String(id));
  setWishlist(list);
}

export function toggleWishlist(item) {
  if (hasInWishlist(item.id)) {
    removeFromWishlist(item.id);
    return false;
  }
  addToWishlist(item);
  return true;
}

export function getWishlistCount() {
  return getWishlist().length;
}