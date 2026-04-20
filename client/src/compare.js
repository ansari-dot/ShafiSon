const COMPARE_KEY = "shafisons_compare";
const COMPARE_FALLBACK_KEY = "shafisons_compare_session";
const MAX_COMPARE = 4;

export function getCompare() {
    try {
        const raw = localStorage.getItem(COMPARE_KEY);
        const parsed = raw ? JSON.parse(raw) : [];
        if (Array.isArray(parsed)) return parsed;
    } catch {
        // ignore
    }
    try {
        const raw = sessionStorage.getItem(COMPARE_FALLBACK_KEY);
        const parsed = raw ? JSON.parse(raw) : [];
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}

export function setCompare(items) {
    localStorage.setItem(COMPARE_KEY, JSON.stringify(items));
    sessionStorage.setItem(COMPARE_FALLBACK_KEY, JSON.stringify(items));
    window.dispatchEvent(new CustomEvent("compare:updated"));
}

export function hasInCompare(id) {
    return getCompare().some((item) => String(item.id) === String(id));
}

export function addToCompare(item) {
    const list = getCompare();
    if (list.some((entry) => String(entry.id) === String(item.id))) return false;
    if (list.length >= MAX_COMPARE) return false;
    list.unshift({
        id: item.id,
        title: item.title,
        img: item.img,
        price: Number(item.price || 0),
        priceUnit: item.priceUnit || 'per yard',
        category: item.category || "",
        material: item.material || "",
        rating: item.rating || 0,
        reviews: item.reviews || 0,
    });
    setCompare(list);
    return true;
}

export function removeFromCompare(id) {
    const list = getCompare().filter((item) => String(item.id) !== String(id));
    setCompare(list);
}

export function toggleCompare(item) {
    if (hasInCompare(item.id)) {
        removeFromCompare(item.id);
        return false;
    }
    return addToCompare(item);
}

export function getCompareCount() {
    return getCompare().length;
}

export function clearCompare() {
    setCompare([]);
}
