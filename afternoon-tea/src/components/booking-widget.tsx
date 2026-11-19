"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { addDays, parseISO, startOfMonth } from "date-fns";
import { ArrowRight, Tag, Users } from "lucide-react";
import type { Experience } from "@/data/experiences";
import { venue } from "@/data/venue";
import { localePath } from "@/i18n/config";
import { useT } from "@/i18n/use-lang";
import { bookingWindow, getSlots, toIsoDate, type Slot } from "@/lib/availability";
import { formatLongDate, formatVnd } from "@/lib/format";
import { packagePrice, pairSaving } from "@/lib/pricing";
import { useBooking, useHydrated } from "@/lib/store";
import { Calendar } from "./calendar";
import { Stepper } from "./stepper";
import { btn, cn } from "./ui";

export function BookingWidget({ exp }: { exp: Experience }) {
  const { lang, t } = useT();
  const hydrated = useHydrated();
  return (
    <div id="book" className="rounded-sm border border-line bg-paper p-6 shadow-[0_24px_60px_-40px_rgba(35,64,58,0.5)] sm:p-7">
      <div className="flex items-baseline justify-between border-b border-line pb-5">
        <div>
          <p className="font-display text-3xl text-navy">{formatVnd(exp.pricePerGuest, lang)}</p>
          <p className="text-xs text-muted">
            {t.common.eachGuest} · {t.common.exclFees}
          </p>
          {exp.pairPrice && (
            <p className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-gold/10 px-3 py-1 text-xs text-ink">
              <Tag className="size-3.5 text-gold" />
              {t.common.pairCombo} <strong className="font-semibold">{formatVnd(exp.pairPrice, lang)}</strong>
              <span className="text-muted">· {t.common.save(formatVnd(pairSaving(exp), lang)).toLowerCase()}</span>
            </p>
          )}
        </div>
      </div>
      {hydrated ? <WidgetBody exp={exp} /> : <WidgetSkeleton />}
    </div>
  );
}

function WidgetSkeleton() {
  return (
    <div className="animate-pulse space-y-4 pt-6" aria-hidden>
      <div className="h-10 rounded-xs bg-sand" />
      <div className="h-64 rounded-xs bg-sand" />
      <div className="h-24 rounded-xs bg-sand" />
    </div>
  );
}

function slotFits(s: Slot, pax: number) {
  return !s.closed && s.remaining >= pax;
}

function WidgetBody({ exp }: { exp: Experience }) {
  const { lang, t } = useT();
  const w = t.widget;
  const router = useRouter();
  const bookings = useBooking((s) => s.bookings);
  const draft = useBooking((s) => s.draft);
  const startHold = useBooking((s) => s.startHold);

  const own = useMemo(() => bookings.filter((b) => b.status === "confirmed"), [bookings]);
  const slotsOf = (iso: string) => getSlots(exp, iso, own);

  const resumeDraft = draft?.slug === exp.slug ? draft : null;
  const [pax, setPax] = useState(() => resumeDraft?.pax ?? Math.min(Math.max(2, exp.minPax), exp.maxPax));
  const [date, setDate] = useState<string | null>(() => {
    if (resumeDraft) return resumeDraft.date;
    const { first } = bookingWindow();
    for (let i = 0; i <= venue.bookingWindowDays; i++) {
      const iso = toIsoDate(addDays(first, i));
      if (slotsOf(iso).some((s) => slotFits(s, pax))) return iso;
    }
    return null;
  });
  const [time, setTime] = useState<string | null>(resumeDraft?.time ?? null);
  const [month, setMonth] = useState(() => startOfMonth(date ? parseISO(date) : new Date()));

  const { first, last } = bookingWindow();
  const price = packagePrice(exp, pax);
  const slots = date ? slotsOf(date) : [];
  const selectedSlot = slots.find((s) => s.time === time);
  const canContinue = !!date && !!selectedSlot && slotFits(selectedSlot, pax);

  function changePax(n: number) {
    setPax(n);
    if (selectedSlot && !slotFits(selectedSlot, n)) setTime(null);
  }

  function pickDate(iso: string) {
    setDate(iso);
    const s = slotsOf(iso).find((x) => x.time === time);
    if (!s || !slotFits(s, pax)) setTime(null);
  }

  function next() {
    if (!canContinue || !date || !time) return;
    startHold({ slug: exp.slug, date, time, pax });
    router.push(localePath(lang, "/checkout/"));
  }

  return (
    <div className="space-y-7 pt-6">
      <section>
        <h3 className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-muted">{w.step1}</h3>
        <div className="flex items-center justify-between rounded-sm border border-line px-4 py-3">
          <span className="inline-flex items-center gap-2 text-sm">
            <Users className="size-4 text-gold" />
            {t.common.guests(pax)}
          </span>
          <Stepper value={pax} min={exp.minPax} max={exp.maxPax} onChange={changePax} label={w.guestsAria} />
        </div>
        {exp.minPax > 1 && <p className="mt-2 text-xs text-muted">{w.minGuests(exp.minPax)}</p>}
        <p className="mt-2 text-xs text-muted">
          {w.bigGroup}{" "}
          <Link href={localePath(lang, "/private-events/")} className="text-navy underline decoration-gold underline-offset-4">
            {w.bigGroupLink}
          </Link>
        </p>
      </section>

      <section>
        <h3 className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-muted">{w.step2}</h3>
        <Calendar
          month={month}
          onMonthChange={setMonth}
          minMonth={startOfMonth(first)}
          maxMonth={startOfMonth(last)}
          selected={date}
          onSelect={pickDate}
          isAvailable={(d) => slotsOf(toIsoDate(d)).some((s) => slotFits(s, pax))}
        />
      </section>

      <section>
        <h3 className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-muted">{w.step3}</h3>
        {date ? (
          <>
            <p className="mb-3 text-sm text-ink">{formatLongDate(date, lang)}</p>
            <div className="grid grid-cols-3 gap-2">
              {slots.map((s) => {
                const fits = slotFits(s, pax);
                const sel = s.time === time;
                let hint = w.available;
                if (s.closed) hint = w.closed;
                else if (s.remaining === 0) hint = w.full;
                else if (s.remaining < pax) hint = w.onlyLeft(s.remaining);
                else if (s.remaining <= 4) hint = w.left(s.remaining);
                return (
                  <button
                    key={s.time}
                    type="button"
                    disabled={!fits}
                    onClick={() => setTime(s.time)}
                    aria-pressed={sel}
                    className={cn(
                      "flex flex-col items-center rounded-sm border px-2 py-3 transition",
                      sel
                        ? "border-navy bg-navy text-cream"
                        : fits
                          ? "border-line hover:border-navy"
                          : "cursor-not-allowed border-line/60 bg-sand/40 text-ink/35",
                    )}
                  >
                    <span className="text-[15px] font-medium tabular-nums">{s.time}</span>
                    <span
                      className={cn(
                        "mt-0.5 text-[11px]",
                        sel ? "text-cream/70" : fits && s.remaining <= 4 ? "text-gold" : "text-muted",
                      )}
                    >
                      {hint}
                    </span>
                  </button>
                );
              })}
            </div>
          </>
        ) : (
          <p className="text-sm text-muted">{w.pickDateFirst}</p>
        )}
      </section>

      <div className="space-y-4 border-t border-line pt-5">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted">
            {w.lineGuests(formatVnd(exp.pricePerGuest, lang), pax)}
          </span>
          <span className={cn(price.pairDiscount > 0 ? "text-muted line-through" : "font-medium")}>
            {formatVnd(price.listBase, lang)}
          </span>
        </div>
        {price.pairDiscount > 0 && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-navy">{w.comboLine(price.pairs)}</span>
            <span className="font-medium text-navy">{formatVnd(price.base, lang)}</span>
          </div>
        )}
        <button type="button" onClick={next} disabled={!canContinue} className={cn(btn.primary, "w-full py-4 text-[15px]")}>
          {w.hold}
          <ArrowRight className="size-4" />
        </button>
        <p className="text-center text-xs text-muted">
          {w.holdNote(venue.holdMinutes)}
        </p>
      </div>
    </div>
  );
}
