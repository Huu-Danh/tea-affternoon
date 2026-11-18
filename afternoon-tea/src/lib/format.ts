import { format, parseISO } from "date-fns";
import { vi } from "date-fns/locale";

const vnd = new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND", maximumFractionDigits: 0 });

export function formatVnd(amount: number) {
  return vnd.format(amount);
}

/** "2026-11-21" -> "Thứ Bảy, 21/11/2026" */
export function formatLongDate(isoDate: string) {
  const s = format(parseISO(isoDate), "EEEE, dd/MM/yyyy", { locale: vi });
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function formatDuration(minutes: number) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m ? `${h} giờ ${m} phút` : `${h} giờ`;
}

const dayNames = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];

export function formatDays(days: number[]) {
  if (days.length === 7) return "Hằng ngày";
  if (days.length === 2 && days.includes(0) && days.includes(6)) return "Thứ bảy & Chủ nhật";
  return [...days]
    .sort((a, b) => ((a + 6) % 7) - ((b + 6) % 7))
    .map((d) => dayNames[d])
    .join(", ");
}
