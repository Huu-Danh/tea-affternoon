"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { CalendarPlus, Check } from "lucide-react";
import { BookingDetails } from "@/components/booking-details";
import { CheckoutSteps, EmptyState } from "@/components/checkout-parts";
import { btn, cn } from "@/components/ui";
import { getExperience } from "@/data/experiences";
import { venue } from "@/data/venue";
import { downloadIcs } from "@/lib/ics";
import { useBooking, useHydrated } from "@/lib/store";
import { PageSkeleton } from "../checkout/checkout-view";

export function ConfirmationView() {
  const hydrated = useHydrated();
  const lastCode = useBooking((s) => s.lastCode);
  const booking = useBooking((s) => s.bookings.find((b) => b.code === s.lastCode));

  if (!hydrated) return <PageSkeleton />;
  if (!lastCode || !booking) {
    return <EmptyState title="Không tìm thấy đặt chỗ" text="Có thể bạn đã mở trang này trên một trình duyệt khác." />;
  }
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
        <h1 className="mt-8 font-display text-5xl">Hẹn gặp bạn!</h1>
        <p className="mt-3 text-muted">
          Đặt chỗ đã được xác nhận. Email xác nhận đã được gửi tới {booking.guest.email} (giả lập).
        </p>
        <p className="mt-8 text-[11px] uppercase tracking-[0.3em] text-muted">Mã đặt chỗ</p>
        <p className="mt-2 font-display text-4xl tracking-[0.15em] text-navy">{booking.code}</p>
      </div>

      <div className="mt-10 rounded-sm border border-line bg-paper p-6 sm:p-8">
        <BookingDetails b={booking} />
        <p className="mt-6 border-t border-line pt-5 text-sm text-muted">
          {venue.lounge}, {venue.name} · {venue.address}
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
            })
          }
        >
          <CalendarPlus className="size-4" />
          Thêm vào lịch
        </button>
        <Link href="/my-bookings/" className={btn.outline}>
          Xem đặt chỗ của tôi
        </Link>
        <Link href="/" className={cn(btn.ghost, "sm:px-6")}>
          Về trang chủ
        </Link>
      </div>
    </div>
  );
}
