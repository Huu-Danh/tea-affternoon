import { addons, type Experience } from "@/data/experiences";
import { venue } from "@/data/venue";

export type AddonQty = Record<string, number>;

/**
 * Tiền gói trước phí: mỗi cặp 2 khách tính theo giá combo (pairPrice) nếu gói có,
 * khách lẻ còn lại tính giá 1 người.
 */
export function packagePrice(exp: Experience, pax: number) {
  const listBase = exp.pricePerGuest * pax;
  const pairs = exp.pairPrice ? Math.floor(pax / 2) : 0;
  const pairDiscount = pairs * (exp.pricePerGuest * 2 - (exp.pairPrice ?? 0));
  return { listBase, pairs, pairDiscount, base: listBase - pairDiscount };
}

/** Số tiền tiết kiệm của combo 2 người so với mua 2 suất lẻ */
export function pairSaving(exp: Experience) {
  return exp.pairPrice ? exp.pricePerGuest * 2 - exp.pairPrice : 0;
}

export function computeTotals(exp: Experience, pax: number, addonQty: AddonQty = {}) {
  const pkg = packagePrice(exp, pax);
  const addonLines = addons
    .filter((a) => (addonQty[a.id] ?? 0) > 0)
    .map((a) => ({ ...a, qty: addonQty[a.id], amount: a.price * addonQty[a.id] }));
  const addonsTotal = addonLines.reduce((s, l) => s + l.amount, 0);
  const subtotal = pkg.base + addonsTotal;
  const service = Math.round(subtotal * venue.serviceChargeRate);
  const vat = Math.round((subtotal + service) * venue.vatRate);
  return { ...pkg, addonLines, addonsTotal, subtotal, service, vat, total: subtotal + service + vat };
}
