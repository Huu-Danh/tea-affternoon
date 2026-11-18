import { venue } from "@/data/venue";

function stamp(d: Date) {
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}T${p(d.getHours())}${p(d.getMinutes())}00`;
}

/** Tạo và tải file .ics để khách thêm lịch hẹn vào Calendar */
export function downloadIcs(opts: { code: string; title: string; date: string; time: string; minutes: number }) {
  const [y, mo, d] = opts.date.split("-").map(Number);
  const [h, mi] = opts.time.split(":").map(Number);
  const start = new Date(y, mo - 1, d, h, mi);
  const end = new Date(start.getTime() + opts.minutes * 60000);

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
    `LOCATION:${venue.lounge}\\, ${venue.address.replace(/,/g, "\\,")}`,
    `DESCRIPTION:Mã đặt chỗ ${opts.code}`,
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
