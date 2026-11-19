"use client";

import { useState } from "react";
import { differenceInHours, parseISO } from "date-fns";
import { Gift, PartyPopper } from "lucide-react";
import { BookingDetails } from "@/components/booking-details";
import { EmptyState, PageSkeleton } from "@/components/checkout-parts";
import { btn, cn, eyebrow } from "@/components/ui";
import type { EventTypeKey } from "@/i18n/dict";
import { useT } from "@/i18n/use-lang";
import { formatLongDate, formatShortDate, formatVnd } from "@/lib/format";
import { useBooking, useHydrated, type Booking } from "@/lib/store";

function startOf(b: Booking) {
  const d = parseISO(b.date);
  const [h, m] = b.time.split(":").map(Number);
  d.setHours(h, m);
  return d;
}

export function MyBookingsView() {
  const { lang, t } = useT();
  const hydrated = useHydrated();
  const bookings = useBooking((s) => s.bookings);
  const vouchers = useBooking((s) => s.vouchers);
  const inquiries = useBooking((s) => s.inquiries);
  const cancel = useBooking((s) => s.cancel);
  const [confirming, setConfirming] = useState<string | null>(null);
  const m = t.myBookings;

  if (!hydrated) return <PageSkeleton />;
  if (bookings.length + vouchers.length + inquiries.length === 0) {
    return <EmptyState title={m.emptyTitle} text={m.emptyText} />;
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:py-16">
      <p className={eyebrow}>{m.eyebrow}</p>
      <h1 className="mt-3 font-display text-5xl font-light">{m.title}</h1>
      <p className="mt-3 text-sm text-muted">{m.note}</p>

      {bookings.length > 0 && (
        <section className="mt-12">
          <h2 className="font-display text-3xl font-light">{m.bookingsTitle}</h2>
          <ul className="mt-6 space-y-6">
            {bookings.map((b) => {
              const hoursLeft = differenceInHours(startOf(b), new Date());
              const past = hoursLeft < 0;
              const cancelled = b.status === "cancelled";
              let status = m.confirmed;
              let statusCls = "bg-navy/10 text-navy";
              if (cancelled) {
                status = m.cancelled;
                statusCls = "bg-danger/10 text-danger";
              } else if (past) {
                status = m.past;
                statusCls = "bg-sand text-muted";
              }
              return (
                <li key={b.code} className={cn("rounded-sm border border-line bg-paper p-6 sm:p-8", (cancelled || past) && "opacity-60")}>
                  <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                    <p className="font-display text-2xl tracking-[0.12em] text-navy">{b.code}</p>
                    <span className={cn("rounded-full px-3 py-1 text-xs font-medium", statusCls)}>{status}</span>
                  </div>
                  <BookingDetails b={b} />
                  {!cancelled && !past && (
                    <div className="mt-6 border-t border-line pt-5">
                      {confirming === b.code ? (
                        <div className="flex flex-wrap items-center gap-3">
                          <p className="text-sm">
                            {hoursLeft >= 24 ? m.freeCancel : m.lateCancel} {m.confirmCancel}
                          </p>
                          <button
                            type="button"
                            className={cn(btn.primary, "bg-danger py-2 hover:bg-danger/90")}
                            onClick={() => {
                              cancel(b.code);
                              setConfirming(null);
                            }}
                          >
                            {m.cancel}
                          </button>
                          <button type="button" className={cn(btn.ghost, "py-2")} onClick={() => setConfirming(null)}>
                            {m.keep}
                          </button>
                        </div>
                      ) : (
                        <button type="button" className={cn(btn.outline, "py-2")} onClick={() => setConfirming(b.code)}>
                          {m.cancel}
                        </button>
                      )}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {vouchers.length > 0 && (
        <section className="mt-14">
          <h2 className="font-display text-3xl font-light">{m.vouchersTitle}</h2>
          <ul className="mt-6 space-y-4">
            {vouchers.map((v) => (
              <li key={v.code} className="flex gap-4 rounded-sm border border-line bg-paper p-6">
                <Gift className="mt-1 size-5 shrink-0 text-gold" />
                <div className="min-w-0 flex-1 text-sm">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <p className="font-display text-2xl tracking-[0.12em] text-navy">{v.code}</p>
                    <span className="text-muted">{formatVnd(v.total, lang)}</span>
                  </div>
                  <p className="mt-1">
                    {v.experienceName} · {t.common.guests(v.pax)} · {m.voucherFor(v.recipientName)}
                  </p>
                  <p className="mt-1 text-muted">{m.validUntil(formatShortDate(new Date(v.expiresAt), lang))}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      {inquiries.length > 0 && (
        <section className="mt-14">
          <h2 className="font-display text-3xl font-light">{m.inquiriesTitle}</h2>
          <ul className="mt-6 space-y-4">
            {inquiries.map((q) => (
              <li key={q.ref} className="flex gap-4 rounded-sm border border-line bg-paper p-6">
                <PartyPopper className="mt-1 size-5 shrink-0 text-gold" />
                <div className="min-w-0 flex-1 text-sm">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <p className="font-display text-2xl tracking-[0.12em] text-navy">{q.ref}</p>
                    <span className="rounded-full bg-sand px-3 py-1 text-xs text-muted">{m.inquirySent}</span>
                  </div>
                  <p className="mt-1">
                    {t.events.eventTypes[q.eventType as EventTypeKey] ?? q.eventType} · {t.common.guests(q.guests)}
                  </p>
                  <p className="mt-1 text-muted">
                    {formatLongDate(q.date, lang)}
                    {q.time && ` · ${q.time}`}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
