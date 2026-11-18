"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { addDays, parseISO, startOfMonth } from "date-fns";
import { ArrowRight, Users } from "lucide-react";
import type { Experience } from "@/data/experiences";
import { venue } from "@/data/venue";
import { bookingWindow, getSlots, toIsoDate, type Slot } from "@/lib/availability";
import { formatLongDate, formatVnd } from "@/lib/format";
import { useBooking, useHydrated } from "@/lib/store";
import { Calendar } from "./calendar";
import { Stepper } from "./stepper";
import { btn, cn } from "./ui";

export function BookingWidget({ exp }: { exp: Experience }) {
  const hydrated = useHydrated();
  return (
    <div id="book" className="rounded-3xl border border-line bg-paper p-6 shadow-[0_24px_60px_-40px_rgba(35,64,58,0.5)] sm:p-7">
      <div className="flex items-baseline justify-between border-b border-line pb-5">
        <div>
          <p className="font-display text-3xl text-forest">{formatVnd(exp.pricePerGuest)}</p>
          <p className="text-xs text-muted">mỗi khách · chưa gồm phí phục vụ & VAT</p>
        </div>
      </div>
      {hydrated ? <WidgetBody exp={exp} /> : <WidgetSkeleton />}
    </div>
  );
}

function WidgetSkeleton() {
  return (
    <div className="animate-pulse space-y-4 pt-6" aria-hidden>
      <div className="h-10 rounded-xl bg-sand" />
      <div className="h-64 rounded-xl bg-sand" />
      <div className="h-24 rounded-xl bg-sand" />
    </div>
  );
}

function slotFits(s: Slot, pax: number) {
  return !s.closed && s.remaining >= pax;
}

function WidgetBody({ exp }: { exp: Experience }) {
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
    router.push("/checkout/");
  }

  return (
    <div className="space-y-7 pt-6">
      <section>
        <h3 className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-muted">1 · Số khách</h3>
        <div className="flex items-center justify-between rounded-2xl border border-line px-4 py-3">
          <span className="inline-flex items-center gap-2 text-sm">
            <Users className="size-4 text-gold" />
            {pax} khách
          </span>
          <Stepper value={pax} min={exp.minPax} max={exp.maxPax} onChange={changePax} label="số khách" />
        </div>
        {exp.minPax > 1 && <p className="mt-2 text-xs text-muted">Tối thiểu {exp.minPax} khách.</p>}
      </section>

      <section>
        <h3 className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-muted">2 · Chọn ngày</h3>
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
        <h3 className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-muted">3 · Chọn giờ</h3>
        {date ? (
          <>
            <p className="mb-3 text-sm text-ink">{formatLongDate(date)}</p>
            <div className="grid grid-cols-3 gap-2">
              {slots.map((s) => {
                const fits = slotFits(s, pax);
                const sel = s.time === time;
                let hint = "Còn chỗ";
                if (s.closed) hint = "Đã đóng";
                else if (s.remaining === 0) hint = "Hết chỗ";
                else if (s.remaining < pax) hint = `Chỉ còn ${s.remaining}`;
                else if (s.remaining <= 4) hint = `Còn ${s.remaining} chỗ`;
                return (
                  <button
                    key={s.time}
                    type="button"
                    disabled={!fits}
                    onClick={() => setTime(s.time)}
                    aria-pressed={sel}
                    className={cn(
                      "flex flex-col items-center rounded-2xl border px-2 py-3 transition",
                      sel
                        ? "border-forest bg-forest text-cream"
                        : fits
                          ? "border-line hover:border-forest"
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
          <p className="text-sm text-muted">Vui lòng chọn ngày để xem khung giờ.</p>
        )}
      </section>

      <div className="space-y-4 border-t border-line pt-5">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted">
            {formatVnd(exp.pricePerGuest)} × {pax} khách
          </span>
          <span className="font-medium">{formatVnd(exp.pricePerGuest * pax)}</span>
        </div>
        <button type="button" onClick={next} disabled={!canContinue} className={cn(btn.primary, "w-full py-4 text-[15px]")}>
          Giữ chỗ & tiếp tục
          <ArrowRight className="size-4" />
        </button>
        <p className="text-center text-xs text-muted">
          Chỗ được giữ trong {venue.holdMinutes} phút để bạn hoàn tất thanh toán.
        </p>
      </div>
    </div>
  );
}
