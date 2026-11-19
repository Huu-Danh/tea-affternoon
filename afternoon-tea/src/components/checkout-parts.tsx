"use client";

import Link from "next/link";
import { Check, Clock3, Hourglass } from "lucide-react";
import type { Experience } from "@/data/experiences";
import { venue } from "@/data/venue";
import { formatLongDate, formatVnd } from "@/lib/format";
import { computeTotals, type AddonQty } from "@/lib/pricing";
import { useNow } from "@/lib/store";
import { Photo } from "./photo";
import { btn, cn } from "./ui";

const steps = ["Chọn giờ", "Thông tin", "Thanh toán", "Xác nhận"];

export function CheckoutSteps({ current }: { current: 1 | 2 | 3 | 4 }) {
  return (
    <ol className="flex items-center gap-2 text-xs sm:gap-3 sm:text-sm" aria-label="Các bước đặt chỗ">
      {steps.map((s, i) => {
        const n = i + 1;
        const done = n < current;
        const active = n === current;
        return (
          <li key={s} className="flex items-center gap-2 sm:gap-3">
            <span
              className={cn(
                "flex size-7 shrink-0 items-center justify-center rounded-full border text-xs",
                done && "border-navy bg-navy text-cream",
                active && "border-navy text-navy",
                !done && !active && "border-line text-muted",
              )}
              aria-current={active ? "step" : undefined}
            >
              {done ? <Check className="size-3.5" /> : n}
            </span>
            <span className={cn("hidden sm:inline", active ? "text-ink" : "text-muted")}>{s}</span>
            {n < steps.length && <span className="h-px w-4 bg-line sm:w-8" />}
          </li>
        );
      })}
    </ol>
  );
}

/** Trả về số giây còn lại của thời gian giữ chỗ */
export function useHoldRemaining(expiresAt: number) {
  const now = useNow();
  return now === 0 ? venue.holdMinutes * 60 : Math.max(0, Math.round((expiresAt - now) / 1000));
}

export function HoldTimer({ seconds }: { seconds: number }) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  const urgent = seconds < 120;
  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-sm border px-4 py-3 text-sm",
        urgent ? "border-danger/30 bg-danger/5 text-danger" : "border-gold/30 bg-gold/5 text-ink",
      )}
      role="timer"
    >
      <Clock3 className={cn("size-4 shrink-0", urgent ? "text-danger" : "text-gold")} />
      <span>
        Chỗ của bạn được giữ trong{" "}
        <strong className="tabular-nums">
          {String(m).padStart(2, "0")}:{String(s).padStart(2, "0")}
        </strong>
      </span>
    </div>
  );
}

export function HoldExpired({ slug }: { slug: string }) {
  return (
    <div className="mx-auto max-w-md py-24 text-center">
      <Hourglass className="mx-auto size-10 text-gold" />
      <h1 className="mt-6 font-display text-4xl">Hết thời gian giữ chỗ</h1>
      <p className="mt-3 text-muted">
        Khung giờ bạn chọn đã được trả lại. Vui lòng chọn lại để tiếp tục đặt chỗ.
      </p>
      <Link href={`/experiences/${slug}/#book`} className={cn(btn.primary, "mt-8")}>
        Chọn lại ngày giờ
      </Link>
    </div>
  );
}

export function EmptyState({ title, text }: { title: string; text: string }) {
  return (
    <div className="mx-auto max-w-md py-24 text-center">
      <h1 className="font-display text-4xl">{title}</h1>
      <p className="mt-3 text-muted">{text}</p>
      <Link href="/#experiences" className={cn(btn.primary, "mt-8")}>
        Xem các gói trà chiều
      </Link>
    </div>
  );
}

export function OrderSummary({
  exp,
  date,
  time,
  pax,
  addons,
}: {
  exp: Experience;
  date: string;
  time: string;
  pax: number;
  addons: AddonQty;
}) {
  const t = computeTotals(exp, pax, addons);
  return (
    <aside className="overflow-hidden rounded-sm border border-line bg-paper">
      <Photo src={exp.image} alt={exp.name} tone={exp.tone} art="stand" className="h-32" />
      <div className="p-6">
        <p className="font-display text-2xl leading-tight">{exp.name}</p>
        <dl className="mt-4 space-y-1.5 text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-muted">Ngày</dt>
            <dd className="text-right">{formatLongDate(date)}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-muted">Giờ</dt>
            <dd>{time}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-muted">Số khách</dt>
            <dd>{pax}</dd>
          </div>
        </dl>

        <div className="mt-5 space-y-2 border-t border-line pt-5 text-sm">
          <Line label={`${exp.name} × ${pax}`} value={t.listBase} />
          {t.pairDiscount > 0 && (
            <Line label={`Ưu đãi combo 2 người × ${t.pairs}`} value={-t.pairDiscount} highlight />
          )}
          {t.addonLines.map((l) => (
            <Line key={l.id} label={`${l.name} × ${l.qty}`} value={l.amount} />
          ))}
          <Line label={`Phí phục vụ ${venue.serviceChargeRate * 100}%`} value={t.service} muted />
          <Line label={`VAT ${venue.vatRate * 100}%`} value={t.vat} muted />
        </div>
        <div className="mt-4 flex items-baseline justify-between border-t border-line pt-4">
          <span className="text-sm font-medium">Tổng cộng</span>
          <span className="font-display text-3xl text-navy">{formatVnd(t.total)}</span>
        </div>
      </div>
    </aside>
  );
}

function Line({ label, value, muted, highlight }: { label: string; value: number; muted?: boolean; highlight?: boolean }) {
  return (
    <div className={cn("flex justify-between gap-4", muted && "text-muted", highlight && "text-navy")}>
      <span>{label}</span>
      <span className="tabular-nums">{formatVnd(value)}</span>
    </div>
  );
}
