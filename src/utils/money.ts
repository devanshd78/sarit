export const toMoney = (v: unknown) => Number(v ?? 0).toFixed(2);
// Optional: prettier INR formatting
export const formatINR = (v: unknown) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(Number(v ?? 0));