"use client";

import { useState } from "react";
import { differenceInHours, parseISO } from "date-fns";
import { BookingDetails } from "@/components/booking-details";
import { EmptyState } from "@/components/checkout-parts";
import { btn, cn, eyebrow } from "@/components/ui";
import { useBooking, useHydrated, type Booking } from "@/lib/store";
import { PageSkeleton } from "../checkout/checkout-view";

function startOf(b: Booking) {
  const d = parseISO(b.date);
  const [h, m] = b.time.split(":").map(Number);
  d.setHours(h, m);
  return d;
}

export function MyBookingsView() {
  const hydrated = useHydrated();
  const bookings = useBooking((s) => s.bookings);
  const cancel = useBooking((s) => s.cancel);
  const [confirming, setConfirming] = useState<string | null>(null);

  if (!hydrated) return <PageSkeleton />;
  if (bookings.length === 0) {
    return <EmptyState title="Chưa có đặt chỗ" text="Các đặt chỗ bạn thực hiện trên trình duyệt này sẽ hiển thị ở đây." />;
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:py-16">
      <p className={eyebrow}>Quản lý</p>
      <h1 className="mt-3 font-display text-5xl">Đặt chỗ của tôi</h1>
      <p className="mt-3 text-sm text-muted">Bản demo lưu đặt chỗ trong trình duyệt (localStorage).</p>

      <ul className="mt-10 space-y-6">
        {bookings.map((b) => {
          const hoursLeft = differenceInHours(startOf(b), new Date());
          const past = hoursLeft < 0;
          const cancelled = b.status === "cancelled";
          const freeCancel = hoursLeft >= 24;
          return (
            <li key={b.code} className={cn("rounded-sm border border-line bg-paper p-6 sm:p-8", (cancelled || past) && "opacity-60")}>
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <p className="font-display text-2xl tracking-[0.12em] text-navy">{b.code}</p>
                <span
                  className={cn(
                    "rounded-full px-3 py-1 text-xs font-medium",
                    cancelled ? "bg-danger/10 text-danger" : past ? "bg-sand text-muted" : "bg-navy/10 text-navy",
                  )}
                >
                  {cancelled ? "Đã huỷ" : past ? "Đã diễn ra" : "Đã xác nhận"}
                </span>
              </div>
              <BookingDetails b={b} />

              {!cancelled && !past && (
                <div className="mt-6 border-t border-line pt-5">
                  {confirming === b.code ? (
                    <div className="flex flex-wrap items-center gap-3">
                      <p className="text-sm">
                        {freeCancel ? "Huỷ miễn phí và hoàn tiền 100%." : "Huỷ trong vòng 24 giờ sẽ không được hoàn tiền."} Xác nhận huỷ?
                      </p>
                      <button
                        type="button"
                        className={cn(btn.primary, "bg-danger py-2 hover:bg-danger/90")}
                        onClick={() => {
                          cancel(b.code);
                          setConfirming(null);
                        }}
                      >
                        Huỷ đặt chỗ
                      </button>
                      <button type="button" className={cn(btn.ghost, "py-2")} onClick={() => setConfirming(null)}>
                        Giữ lại
                      </button>
                    </div>
                  ) : (
                    <button type="button" className={cn(btn.outline, "py-2")} onClick={() => setConfirming(b.code)}>
                      Huỷ đặt chỗ
                    </button>
                  )}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
