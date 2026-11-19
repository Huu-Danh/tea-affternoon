import { venue } from "@/data/venue";
import { tr, type Lang } from "@/i18n/config";
import { dict } from "@/i18n/dict";

function stamp(d: Date) {
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}T${p(d.getHours())}${p(d.getMinutes())}00`;
}

/** Tạo và tải file .ics để khách thêm lịch hẹn vào Calendar */
export function downloadIcs(opts: { code: string; title: string; date: string; time: string; minutes: number; lang: Lang }) {
  const [y, mo, d] = opts.date.split("-").map(Number);
  const [h, mi] = opts.time.split(":").map(Number);
  const start = new Date(y, mo - 1, d, h, mi);
  const end = new Date(start.getTime() + opts.minutes * 60000);
  const address = tr(venue.address, opts.lang).replace(/,/g, "\\,");

  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Afternoon Tea Demo//VI",
    "BEGIN:VEVENT",
    `UID:${opts.code}@afternoon-tea.demo`,
    `DTSTAMP:${stamp(new Date())}`,
    `DTSTART:${stamp(start)}`,
    `DTEND:${stamp(end)}`,
    `SUMMARY:${opts.title} – ${venue.name}`,
    `LOCATION:${venue.lounge}\\, ${address}`,
    `DESCRIPTION:${dict[opts.lang].confirmation.icsDesc(opts.code)}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  const url = URL.createObjectURL(new Blob([ics], { type: "text/calendar;charset=utf-8" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = `${opts.code}.ics`;
  a.click();
  URL.revokeObjectURL(url);
}
