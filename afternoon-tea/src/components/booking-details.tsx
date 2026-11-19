"use client";

import { addons } from "@/data/experiences";
import { tr } from "@/i18n/config";
import type { Dict } from "@/i18n/dict";
import { useT } from "@/i18n/use-lang";
import { formatLongDate, formatVnd } from "@/lib/format";
import type { Booking } from "@/lib/store";

/** Dịp đặc biệt: dữ liệu mới lưu khoá, dữ liệu cũ lưu nhãn tiếng Việt */
function occasionLabel(v: string, t: Dict) {
  if (v in t.occasions) return t.occasions[v as keyof Dict["occasions"]];
  return v;
}

export function BookingDetails({ b }: { b: Booking }) {
  const { lang, t } = useT();
  const extras = addons.filter((a) => (b.addons[a.id] ?? 0) > 0);
  const rows: [string, string][] = [
    [t.details.package, b.experienceName],
    [t.common.date, formatLongDate(b.date, lang)],
    [t.common.time, b.time],
    [t.common.guestsLabel, String(b.pax)],
    [t.details.booker, b.guest.fullName],
    [t.details.contact, `${b.guest.phone} · ${b.guest.email}`],
  ];
  if (b.guest.occasion && !["none", "Không có"].includes(b.guest.occasion)) {
    rows.push([t.details.occasion, occasionLabel(b.guest.occasion, t)]);
  }
  if (b.guest.cardMessage) rows.push([t.details.card, `“${b.guest.cardMessage}”`]);
  if (extras.length) rows.push([t.details.extras, extras.map((a) => `${tr(a.name, lang)} × ${b.addons[a.id]}`).join(", ")]);
  if (b.guest.note) rows.push([t.details.note, b.guest.note]);
  rows.push([t.details.payment, `${formatVnd(b.total, lang)} · ${t.payment.methods[b.paymentMethod].name}`]);

  return (
    <dl className="divide-y divide-line text-sm">
      {rows.map(([k, v]) => (
        <div key={k} className="grid grid-cols-[110px_1fr] gap-4 py-3">
          <dt className="text-muted">{k}</dt>
          <dd className="break-words">{v}</dd>
        </div>
      ))}
    </dl>
  );
}
