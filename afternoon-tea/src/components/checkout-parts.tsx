"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { Check, Clock3, CreditCard, Hourglass, QrCode, Wallet } from "lucide-react";
import type { Experience } from "@/data/experiences";
import { venue } from "@/data/venue";
import { localePath, tr } from "@/i18n/config";
import { useT } from "@/i18n/use-lang";
import { formatLongDate, formatVnd } from "@/lib/format";
import { computeTotals, type AddonQty } from "@/lib/pricing";
import { useNow, type PaymentMethod } from "@/lib/store";
import { Photo } from "./photo";
import { btn, cn } from "./ui";

export function CheckoutSteps({ current }: { current: 1 | 2 | 3 | 4 }) {
  const { t } = useT();
  const steps = t.checkout.steps;
  return (
    <ol className="flex items-center gap-2 text-xs sm:gap-3 sm:text-sm" aria-label={t.checkout.stepsAria}>
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
  const { t } = useT();
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
        {t.checkout.holdTimer}{" "}
        <strong className="tabular-nums">
          {String(m).padStart(2, "0")}:{String(s).padStart(2, "0")}
        </strong>
      </span>
    </div>
  );
}

export function HoldExpired({ slug }: { slug: string }) {
  const { lang, t } = useT();
  return (
    <div className="mx-auto max-w-md py-24 text-center">
      <Hourglass className="mx-auto size-10 text-gold" />
      <h1 className="mt-6 font-display text-4xl">{t.checkout.expiredTitle}</h1>
      <p className="mt-3 text-muted">{t.checkout.expiredText}</p>
      <Link href={localePath(lang, `/experiences/${slug}/#book`)} className={cn(btn.primary, "mt-8")}>
        {t.checkout.expiredCta}
      </Link>
    </div>
  );
}

export function EmptyState({ title, text }: { title: string; text: string }) {
  const { lang, t } = useT();
  return (
    <div className="mx-auto max-w-md py-24 text-center">
      <h1 className="font-display text-4xl">{title}</h1>
      <p className="mt-3 text-muted">{text}</p>
      <Link href={localePath(lang, "/#experiences")} className={cn(btn.primary, "mt-8")}>
        {t.common.viewPackages}
      </Link>
    </div>
  );
}

export function PageSkeleton() {
  return (
    <div className="mx-auto grid max-w-6xl animate-pulse gap-10 px-4 py-12 lg:grid-cols-[1fr_380px]" aria-hidden>
      <div className="h-[600px] rounded-sm bg-sand" />
      <div className="h-96 rounded-sm bg-sand" />
    </div>
  );
}

/** Ô nhập liệu có nhãn và thông báo lỗi */
export function Field({
  label,
  error,
  id,
  children,
}: {
  label: string;
  error?: string;
  id: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium">
        {label}
      </label>
      {children}
      {error && (
        <p className="mt-1.5 text-sm text-danger" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

const methodIcons = { vnpay: QrCode, momo: Wallet, card: CreditCard } as const;
export const paymentMethods: PaymentMethod[] = ["vnpay", "momo", "card"];

/** Chọn phương thức thanh toán (dùng cho đặt chỗ và voucher) */
export function PaymentMethodPicker({
  value,
  onChange,
}: {
  value: PaymentMethod;
  onChange: (m: PaymentMethod) => void;
}) {
  const { t } = useT();
  return (
    <div className="grid gap-3" role="radiogroup" aria-label={t.payment.method}>
      {paymentMethods.map((id) => {
        const sel = value === id;
        const Icon = methodIcons[id];
        const m = t.payment.methods[id];
        return (
          <label
            key={id}
            className={cn(
              "flex cursor-pointer items-center gap-4 rounded-sm border p-4 transition",
              sel ? "border-navy bg-navy/5 ring-1 ring-navy" : "border-line bg-paper hover:border-ink/30",
            )}
          >
            <input type="radio" name="method" value={id} checked={sel} onChange={() => onChange(id)} className="sr-only" />
            <span className={cn("flex size-11 items-center justify-center rounded-xs", sel ? "bg-navy text-cream" : "bg-sand text-navy")}>
              <Icon className="size-5" />
            </span>
            <span className="flex-1">
              <span className="block font-medium">{m.name}</span>
              <span className="block text-sm text-muted">{m.desc}</span>
            </span>
            <span
              className={cn(
                "size-5 rounded-full border-2 transition",
                sel ? "border-navy bg-navy shadow-[inset_0_0_0_3px_var(--color-paper)]" : "border-line",
              )}
            />
          </label>
        );
      })}
    </div>
  );
}

/** Lớp phủ "đang xử lý thanh toán" (giả lập cổng thanh toán) */
export function ProcessingOverlay({ show, method }: { show: boolean; method: PaymentMethod }) {
  const { t } = useT();
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-navy-dark/70 p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="alertdialog"
          aria-live="assertive"
          aria-label={t.payment.processing}
        >
          <motion.div
            initial={{ scale: 0.95, y: 10 }}
            animate={{ scale: 1, y: 0 }}
            className="w-full max-w-sm rounded-sm bg-paper p-8 text-center"
          >
            <div className="mx-auto size-12 animate-spin rounded-full border-2 border-line border-t-navy" />
            <p className="mt-6 font-display text-2xl">{t.payment.processing}</p>
            <p className="mt-2 text-sm text-muted">{t.payment.connecting(t.payment.methods[method].name)}</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
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
  const { lang, t } = useT();
  const totals = computeTotals(exp, pax, addons);
  return (
    <aside className="overflow-hidden rounded-sm border border-line bg-paper">
      <Photo src={exp.image} alt={exp.name} tone={exp.tone} art="stand" className="h-32" />
      <div className="p-6">
        <p className="font-display text-2xl leading-tight">{exp.name}</p>
        <dl className="mt-4 space-y-1.5 text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-muted">{t.common.date}</dt>
            <dd className="text-right">{formatLongDate(date, lang)}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-muted">{t.common.time}</dt>
            <dd>{time}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-muted">{t.common.guestsLabel}</dt>
            <dd>{pax}</dd>
          </div>
        </dl>
        <PriceLines exp={exp} pax={pax} addons={addons} totals={totals} />
      </div>
    </aside>
  );
}

/** Các dòng tiền: gói, ưu đãi combo, add-on, phí, VAT, tổng */
export function PriceLines({
  exp,
  pax,
  totals,
}: {
  exp: Experience;
  pax: number;
  addons?: AddonQty;
  totals: ReturnType<typeof computeTotals>;
}) {
  const { lang, t } = useT();
  const fmt = (n: number) => formatVnd(n, lang);
  return (
    <>
      <div className="mt-5 space-y-2 border-t border-line pt-5 text-sm">
        <Line label={`${exp.name} × ${pax}`} value={fmt(totals.listBase)} />
        {totals.pairDiscount > 0 && (
          <Line label={t.widget.comboLine(totals.pairs)} value={fmt(-totals.pairDiscount)} highlight />
        )}
        {totals.addonLines.map((l) => (
          <Line key={l.id} label={`${tr(l.name, lang)} × ${l.qty}`} value={fmt(l.amount)} />
        ))}
        <Line label={t.common.serviceCharge(venue.serviceChargeRate * 100)} value={fmt(totals.service)} muted />
        <Line label={t.common.vat(venue.vatRate * 100)} value={fmt(totals.vat)} muted />
      </div>
      <div className="mt-4 flex items-baseline justify-between border-t border-line pt-4">
        <span className="text-sm font-medium">{t.common.total}</span>
        <span className="font-display text-3xl text-navy">{fmt(totals.total)}</span>
      </div>
    </>
  );
}

function Line({ label, value, muted, highlight }: { label: string; value: string; muted?: boolean; highlight?: boolean }) {
  return (
    <div className={cn("flex justify-between gap-4", muted && "text-muted", highlight && "text-navy")}>
      <span>{label}</span>
      <span className="tabular-nums">{value}</span>
    </div>
  );
}
