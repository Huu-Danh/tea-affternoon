"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, CreditCard, Info, Lock, QrCode, Wallet } from "lucide-react";
import {
  CheckoutSteps,
  EmptyState,
  HoldExpired,
  HoldTimer,
  OrderSummary,
  useHoldRemaining,
} from "@/components/checkout-parts";
import { btn, cn } from "@/components/ui";
import { getExperience, type Experience } from "@/data/experiences";
import { formatVnd } from "@/lib/format";
import { computeTotals } from "@/lib/pricing";
import { useBooking, useHydrated, type Draft, type PaymentMethod } from "@/lib/store";
import { PageSkeleton } from "../checkout/checkout-view";

const methods: { id: PaymentMethod; name: string; desc: string; icon: typeof QrCode }[] = [
  { id: "vnpay", name: "VNPay QR", desc: "Quét mã bằng ứng dụng ngân hàng", icon: QrCode },
  { id: "momo", name: "Ví MoMo", desc: "Thanh toán qua ví điện tử MoMo", icon: Wallet },
  { id: "card", name: "Thẻ quốc tế", desc: "Visa, Mastercard, JCB, Amex", icon: CreditCard },
];

export function PaymentView() {
  const hydrated = useHydrated();
  const draft = useBooking((s) => s.draft);
  // Sau khi thanh toán, draft bị xoá: giữ skeleton trong lúc chuyển sang trang xác nhận
  const [paid, setPaid] = useState(false);

  if (!hydrated || paid) return <PageSkeleton />;
  const exp = draft ? getExperience(draft.slug) : undefined;
  if (!draft || !exp) {
    return <EmptyState title="Không có đơn cần thanh toán" text="Đơn đặt chỗ đã hoàn tất hoặc chưa được tạo." />;
  }
  if (!draft.guest) {
    return (
      <div className="mx-auto max-w-md py-24 text-center">
        <h1 className="font-display text-4xl">Thiếu thông tin liên hệ</h1>
        <Link href="/checkout/" className={cn(btn.primary, "mt-8")}>
          Quay lại bước thông tin
        </Link>
      </div>
    );
  }
  return (
    <Payment
      draft={draft as Draft & { guest: NonNullable<Draft["guest"]> }}
      exp={exp}
      onPaid={() => setPaid(true)}
    />
  );
}

function Payment({
  draft,
  exp,
  onPaid,
}: {
  draft: Draft & { guest: NonNullable<Draft["guest"]> };
  exp: Experience;
  onPaid: () => void;
}) {
  const router = useRouter();
  const confirm = useBooking((s) => s.confirm);
  const remaining = useHoldRemaining(draft.holdExpiresAt);
  const [method, setMethod] = useState<PaymentMethod>("vnpay");
  const [processing, setProcessing] = useState(false);

  const totals = computeTotals(exp, draft.pax, draft.addons);

  if (remaining === 0 && !processing) return <HoldExpired slug={exp.slug} />;

  function pay() {
    setProcessing(true);
    // Giả lập chuyển sang cổng thanh toán rồi nhận callback thành công
    setTimeout(() => {
      onPaid();
      confirm({
        slug: exp.slug,
        experienceName: exp.name,
        date: draft.date,
        time: draft.time,
        pax: draft.pax,
        addons: draft.addons,
        guest: draft.guest,
        total: totals.total,
        paymentMethod: method,
      });
      router.replace("/confirmation/");
    }, 2200);
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:py-14">
      <CheckoutSteps current={3} />
      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_380px]">
        <div className="min-w-0 space-y-8">
          <div>
            <Link href="/checkout/" className="inline-flex items-center gap-2 text-sm text-muted hover:text-navy">
              <ArrowLeft className="size-4" />
              Sửa thông tin
            </Link>
            <h1 className="mt-4 font-display text-4xl sm:text-5xl">Thanh toán</h1>
            <div className="mt-6">
              <HoldTimer seconds={remaining} />
            </div>
          </div>

          <div className="rounded-sm border border-line bg-paper p-5 text-sm">
            <p className="text-muted">Người đặt</p>
            <p className="mt-1 font-medium">{draft.guest.fullName}</p>
            <p className="text-muted">
              {draft.guest.phone} · {draft.guest.email}
            </p>
          </div>

          <fieldset>
            <legend className="mb-4 font-display text-2xl">Phương thức thanh toán</legend>
            <div className="grid gap-3" role="radiogroup">
              {methods.map((m) => {
                const sel = method === m.id;
                return (
                  <label
                    key={m.id}
                    className={cn(
                      "flex cursor-pointer items-center gap-4 rounded-sm border p-4 transition",
                      sel ? "border-navy bg-navy/5 ring-1 ring-navy" : "border-line bg-paper hover:border-ink/30",
                    )}
                  >
                    <input
                      type="radio"
                      name="method"
                      value={m.id}
                      checked={sel}
                      onChange={() => setMethod(m.id)}
                      className="sr-only"
                    />
                    <span
                      className={cn(
                        "flex size-11 items-center justify-center rounded-xs",
                        sel ? "bg-navy text-cream" : "bg-sand text-navy",
                      )}
                    >
                      <m.icon className="size-5" />
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
          </fieldset>

          <div className="flex gap-3 rounded-sm bg-gold/10 p-4 text-sm text-ink/80">
            <Info className="mt-0.5 size-4 shrink-0 text-gold" />
            Bản demo: bấm thanh toán sẽ giả lập chuyển sang cổng thanh toán và trả về kết quả thành công. Không phát sinh giao dịch thật.
          </div>

          <button type="button" onClick={pay} disabled={processing} className={cn(btn.primary, "w-full py-4 text-[15px]")}>
            <Lock className="size-4" />
            Thanh toán {formatVnd(totals.total)}
          </button>
        </div>

        <div className="lg:sticky lg:top-28 lg:self-start">
          <OrderSummary exp={exp} date={draft.date} time={draft.time} pax={draft.pax} addons={draft.addons} />
        </div>
      </div>

      <AnimatePresence>
        {processing && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-navy-dark/70 p-4 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            role="alertdialog"
            aria-live="assertive"
            aria-label="Đang xử lý thanh toán"
          >
            <motion.div
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              className="w-full max-w-sm rounded-sm bg-paper p-8 text-center"
            >
              <div className="mx-auto size-12 animate-spin rounded-full border-2 border-line border-t-navy" />
              <p className="mt-6 font-display text-2xl">Đang xử lý thanh toán</p>
              <p className="mt-2 text-sm text-muted">
                Đang kết nối {methods.find((m) => m.id === method)?.name}… Vui lòng không đóng trang.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
