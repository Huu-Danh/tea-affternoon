import { format, parseISO } from "date-fns";
import { enGB, vi } from "date-fns/locale";
import type { Lang } from "@/i18n/config";

const vnd = {
  vi: new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND", maximumFractionDigits: 0 }),
  en: new Intl.NumberFormat("en-US", { style: "currency", currency: "VND", maximumFractionDigits: 0 }),
};

export const dateLocale = { vi, en: enGB };

/** 499000 -> "499.000 ₫" (vi) / "₫499,000" (en) */
export function formatVnd(amount: number, lang: Lang = "vi") {
  return vnd[lang].format(amount);
}

/** "2026-11-21" -> "Thứ Bảy, 21/11/2026" (vi) / "Saturday, 21 Nov 2026" (en) */
export function formatLongDate(isoDate: string, lang: Lang = "vi") {
  const d = parseISO(isoDate);
  if (lang === "en") return format(d, "EEEE, d MMM yyyy", { locale: enGB });
  const s = format(d, "EEEE, dd/MM/yyyy", { locale: vi });
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/** Ngày ngắn: 19/05/2027 (vi) / 19 May 2027 (en) */
export function formatShortDate(d: Date, lang: Lang = "vi") {
  return lang === "en" ? format(d, "d MMM yyyy", { locale: enGB }) : format(d, "dd/MM/yyyy");
}

export function formatDuration(minutes: number, lang: Lang = "vi") {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (lang === "en") {
    const hs = `${h} hour${h === 1 ? "" : "s"}`;
    return m ? `${hs} ${m} min` : hs;
  }
  return m ? `${h} giờ ${m} phút` : `${h} giờ`;
}

const dayNames = {
  vi: ["CN", "T2", "T3", "T4", "T5", "T6", "T7"],
  en: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
};

export function formatDays(days: number[], lang: Lang = "vi") {
  if (days.length === 7) return lang === "en" ? "Daily" : "Hằng ngày";
  if (days.length === 2 && days.includes(0) && days.includes(6)) return lang === "en" ? "Weekends" : "Thứ bảy & Chủ nhật";
  return [...days]
    .sort((a, b) => ((a + 6) % 7) - ((b + 6) % 7))
    .map((d) => dayNames[lang][d])
    .join(", ");
}
