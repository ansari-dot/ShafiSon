const CART_KEY = "shafisons_cart";
const CART_FALLBACK_KEY = "shafisons_cart_session";

export function getCart() {
    try {
        const raw = localStorage.getItem(CART_KEY);
        const parsed = raw ? JSON.parse(raw) : [];
        if (Array.isArray(parsed)) return parsed;
    } catch {
        // ignore
    }
    try {
        const raw = sessionStorage.getItem(CART_FALLBACK_KEY);
        const parsed = raw ? JSON.parse(raw) : [];
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}

export function setCart(items) {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
    sessionStorage.setItem(CART_FALLBACK_KEY, JSON.stringify(items));
    window.dispatchEvent(new CustomEvent("cart:updated"));
}

export function addToCart(item, qty = 1) {
    const cart = getCart();
    const idx = cart.findIndex((c) => c.id === item.id && c.size === item.size && c.color === item.color);
    if (idx >= 0) {
        cart[idx].qty += qty;
        cart[idx].isDeal = !!item.isDeal;
    } else {
        cart.push({...item, qty, isDeal: !!item.isDeal });
    }
    setCart(cart);
}

export function updateQty(id, qty, size, color) {
    const cart = getCart().map((c) =>
        c.id === id && c.size === size && c.color === color ? {...c, qty } : c
    );
    setCart(cart.filter((c) => c.qty > 0));
}

export function removeFromCart(id, size, color) {
    const cart = getCart().filter((c) => !(c.id === id && c.size === size && c.color === color));
    setCart(cart);
}

export function clearCart() {
    setCart([]);
}

export function getCartCount() {
    return getCart().reduce((sum, item) => sum + (item.qty || 0), 0);
}

export function getCartSubtotal() {
    return getCart().reduce((sum, item) => sum + (item.qty || 0) * (item.unitPrice || 0), 0);
}