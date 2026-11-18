import { addons, type Experience } from "@/data/experiences";
import { venue } from "@/data/venue";

export type AddonQty = Record<string, number>;

export function computeTotals(exp: Experience, pax: number, addonQty: AddonQty = {}) {
  const base = exp.pricePerGuest * pax;
  const addonLines = addons
    .filter((a) => (addonQty[a.id] ?? 0) > 0)
    .map((a) => ({ ...a, qty: addonQty[a.id], amount: a.price * addonQty[a.id] }));
  const addonsTotal = addonLines.reduce((s, l) => s + l.amount, 0);
  const subtotal = base + addonsTotal;
  const service = Math.round(subtotal * venue.serviceChargeRate);
  const vat = Math.round((subtotal + service) * venue.vatRate);
  return { base, addonLines, addonsTotal, subtotal, service, vat, total: subtotal + service + vat };
}
