// ─── UTILITY HELPERS ─────────────────────────────────────────────────────────

export const formatPrice   = n      => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);
export const discountPct   = (o, s) => o > s ? Math.round((1 - s / o) * 100) : 0;
export const stockStatus   = stock  => stock === 0 ? "out_of_stock" : stock < 10 ? "low_stock" : "active";
export const truncate      = (str, n = 60) => str?.length > n ? str.slice(0, n) + "…" : str;
export const getInitials   = (name = "") => name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
export const calcAvgRating = (list = []) => list.length ? parseFloat((list.reduce((s, r) => s + r.rating, 0) / list.length).toFixed(1)) : 0;