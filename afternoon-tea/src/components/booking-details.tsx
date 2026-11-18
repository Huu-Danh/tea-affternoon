import { addons } from "@/data/experiences";
import { formatLongDate, formatVnd } from "@/lib/format";
import type { Booking } from "@/lib/store";

const methodName = { vnpay: "VNPay QR", momo: "Ví MoMo", card: "Thẻ quốc tế" } as const;

export function BookingDetails({ b }: { b: Booking }) {
  const extras = addons.filter((a) => (b.addons[a.id] ?? 0) > 0);
  const rows: [string, string][] = [
    ["Gói", b.experienceName],
    ["Ngày", formatLongDate(b.date)],
    ["Giờ", b.time],
    ["Số khách", String(b.pax)],
    ["Người đặt", b.guest.fullName],
    ["Liên hệ", `${b.guest.phone} · ${b.guest.email}`],
  ];
  if (b.guest.occasion && b.guest.occasion !== "Không có") rows.push(["Dịp", b.guest.occasion]);
  if (extras.length) rows.push(["Thêm", extras.map((a) => `${a.name} × ${b.addons[a.id]}`).join(", ")]);
  if (b.guest.note) rows.push(["Ghi chú", b.guest.note]);
  rows.push(["Thanh toán", `${formatVnd(b.total)} · ${methodName[b.paymentMethod]}`]);

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
