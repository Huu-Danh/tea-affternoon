"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { CalendarPlus, Check } from "lucide-react";
import { BookingDetails } from "@/components/booking-details";
import { CheckoutSteps, EmptyState, PageSkeleton } from "@/components/checkout-parts";
import { btn, cn } from "@/components/ui";
import { getExperience } from "@/data/experiences";
import { venue } from "@/data/venue";
import { localePath, tr } from "@/i18n/config";
import { useT } from "@/i18n/use-lang";
import { downloadIcs } from "@/lib/ics";
import { useBooking, useHydrated } from "@/lib/store";

export function ConfirmationView() {
  const { lang, t } = useT();
  const hydrated = useHydrated();
  const lastCode = useBooking((s) => s.lastCode);
  const booking = useBooking((s) => s.bookings.find((b) => b.code === s.lastCode));

  if (!hydrated) return <PageSkeleton />;
  if (!lastCode || !booking) return <EmptyState title={t.confirmation.notFoundTitle} text={t.confirmation.notFoundText} />;
  const exp = getExperience(booking.slug);

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 lg:py-14">
      <div className="flex justify-center">
        <CheckoutSteps current={4} />
      </div>

      <div className="mt-12 text-center">
        <motion.div
          initial={{ scale: 0.4, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 18 }}
          className="mx-auto flex size-20 items-center justify-center rounded-full bg-navy text-cream"
        >
          <Check className="size-9" strokeWidth={1.6} />
        </motion.div>
        <p className="mt-8 font-script text-4xl text-gold">Thank you</p>
        <h1 className="mt-1 font-display text-5xl font-light">{t.confirmation.title}</h1>
        <p className="mt-3 text-muted">{t.confirmation.text(booking.guest.email)}</p>
        <p className="mt-8 text-[11px] tracking-[0.3em] text-muted uppercase">{t.confirmation.code}</p>
        <p className="mt-2 font-display text-4xl tracking-[0.15em] text-navy">{booking.code}</p>
      </div>

      <div className="mt-10 rounded-sm border border-line bg-paper p-6 sm:p-8">
        <BookingDetails b={booking} />
        <p className="mt-6 border-t border-line pt-5 text-sm text-muted">
          {venue.lounge}, {venue.name} · {tr(venue.address, lang)}
        </p>
      </div>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <button
          type="button"
          className={btn.primary}
          onClick={() =>
            downloadIcs({
              code: booking.code,
              title: booking.experienceName,
              date: booking.date,
              time: booking.time,
              minutes: exp?.durationMinutes ?? 120,
              lang,
            })
          }
        >
          <CalendarPlus className="size-4" />
          {t.confirmation.addCalendar}
        </button>
        <Link href={localePath(lang, "/my-bookings/")} className={btn.outline}>
          {t.confirmation.myBookings}
        </Link>
        <Link href={localePath(lang, "/")} className={cn(btn.ghost, "sm:px-6")}>
          {t.common.backHome}
        </Link>
      </div>
    </div>
  );
}
