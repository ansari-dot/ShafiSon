export const LOW_STOCK_THRESHOLD = 5;

export function getQuantity(product) {
  const qty = Number(product?.quantity ?? 0);
  return Number.isFinite(qty) ? qty : 0;
}

export function isOutOfStock(product) {
  return !product?.inStock || getQuantity(product) <= 0;
}

export function isLowStock(product) {
  const qty = getQuantity(product);
  return product?.inStock && qty > 0 && qty <= LOW_STOCK_THRESHOLD;
}
