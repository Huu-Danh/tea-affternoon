import { addDays, format, isAfter, isBefore, parseISO, startOfDay } from "date-fns";
import type { Experience } from "@/data/experiences";
import { venue } from "@/data/venue";

/**
 * Giả lập tình trạng chỗ trống (không có backend).
 * Số chỗ đã đặt được sinh ngẫu nhiên nhưng cố định theo (gói, ngày, giờ),
 * trừ thêm các booking mà chính người dùng đã đặt trong trình duyệt này.
 * Khi có API thật, chỉ cần thay hàm getSlots bằng lời gọi API.
 */

export type Slot = {
  time: string;
  remaining: number;
  /** Đã qua giờ (hoặc sát giờ) nên không nhận đặt */
  closed: boolean;
};

function hash(input: string) {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function toIsoDate(d: Date) {
  return format(d, "yyyy-MM-dd");
}

export function bookingWindow(now = new Date()) {
  const first = startOfDay(now);
  const last = addDays(first, venue.bookingWindowDays);
  return { first, last };
}

export function isDateOffered(exp: Experience, day: Date, now = new Date()) {
  const { first, last } = bookingWindow(now);
  if (isBefore(day, first) || isAfter(day, last)) return false;
  return exp.daysOfWeek.includes(day.getDay());
}

export function getSlots(
  exp: Experience,
  isoDate: string,
  ownBookings: { slug: string; date: string; time: string; pax: number }[] = [],
  now = new Date(),
): Slot[] {
  const day = parseISO(isoDate);
  if (!isDateOffered(exp, day, now)) return [];

  return exp.timeSlots.map((time) => {
    const [h, m] = time.split(":").map(Number);
    const start = new Date(day);
    start.setHours(h, m, 0, 0);
    // Ngừng nhận đặt 30 phút trước giờ bắt đầu
    const closed = start.getTime() - now.getTime() < 30 * 60 * 1000;

    const seed = hash(`${exp.slug}|${isoDate}|${time}`);
    // Cuối tuần đông hơn
    const weekend = day.getDay() === 0 || day.getDay() === 6;
    const busy = (seed % 100) / 100 + (weekend ? 0.25 : 0);
    let taken = Math.round(Math.min(1, busy) * exp.capacityPerSlot);
    if (seed % 7 === 0) taken = exp.capacityPerSlot; // thỉnh thoảng hết chỗ

    const mine = ownBookings
      .filter((b) => b.slug === exp.slug && b.date === isoDate && b.time === time)
      .reduce((sum, b) => sum + b.pax, 0);

    return { time, closed, remaining: Math.max(0, exp.capacityPerSlot - taken - mine) };
  });
}
