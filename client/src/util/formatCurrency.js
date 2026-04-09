const PKR_FORMATTER = new Intl.NumberFormat("en-PK", {
  style: "currency",
  currency: "PKR",
  maximumFractionDigits: 0,
});

export function formatPKR(value) {
  const numeric = typeof value === "number" ? value : Number(value);
  if (Number.isNaN(numeric)) return PKR_FORMATTER.format(0);
  return PKR_FORMATTER.format(numeric);
}
