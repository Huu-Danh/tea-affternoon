"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Info, Lock } from "lucide-react";
import {
  CheckoutSteps,
  EmptyState,
  HoldExpired,
  HoldTimer,
  OrderSummary,
  PageSkeleton,
  PaymentMethodPicker,
  ProcessingOverlay,
  useHoldRemaining,
} from "@/components/checkout-parts";
import { btn, cn } from "@/components/ui";
import { getExperience, type Experience } from "@/data/experiences";
import { localePath } from "@/i18n/config";
import { useT } from "@/i18n/use-lang";
import { formatVnd } from "@/lib/format";
import { computeTotals } from "@/lib/pricing";
import { useBooking, useHydrated, type Draft, type PaymentMethod } from "@/lib/store";

type ReadyDraft = Draft & { guest: NonNullable<Draft["guest"]> };

export function PaymentView() {
  const { lang, t } = useT();
  const hydrated = useHydrated();
  const draft = useBooking((s) => s.draft);
  // Sau khi thanh toán, draft bị xoá: giữ skeleton trong lúc chuyển sang trang xác nhận
  const [paid, setPaid] = useState(false);

  if (!hydrated || paid) return <PageSkeleton />;
  const exp = draft ? getExperience(draft.slug) : undefined;
  if (!draft || !exp) return <EmptyState title={t.payment.emptyTitle} text={t.payment.emptyText} />;
  if (!draft.guest) {
    return (
      <div className="mx-auto max-w-md py-24 text-center">
        <h1 className="font-display text-4xl">{t.payment.missingGuest}</h1>
        <Link href={localePath(lang, "/checkout/")} className={cn(btn.primary, "mt-8")}>
          {t.payment.backToInfo}
        </Link>
      </div>
    );
  }
  return <Payment draft={draft as ReadyDraft} exp={exp} onPaid={() => setPaid(true)} />;
}

function Payment({ draft, exp, onPaid }: { draft: ReadyDraft; exp: Experience; onPaid: () => void }) {
  const { lang, t } = useT();
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
      router.replace(localePath(lang, "/confirmation/"));
    }, 2200);
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:py-14">
      <CheckoutSteps current={3} />
      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_380px]">
        <div className="min-w-0 space-y-8">
          <div>
            <Link href={localePath(lang, "/checkout/")} className="inline-flex items-center gap-2 text-sm text-muted hover:text-navy">
              <ArrowLeft className="size-4" />
              {t.payment.edit}
            </Link>
            <h1 className="mt-4 font-display text-4xl font-light sm:text-5xl">{t.payment.title}</h1>
            <div className="mt-6">
              <HoldTimer seconds={remaining} />
            </div>
          </div>

          <div className="rounded-sm border border-line bg-paper p-5 text-sm">
            <p className="text-muted">{t.payment.booker}</p>
            <p className="mt-1 font-medium">{draft.guest.fullName}</p>
            <p className="text-muted">
              {draft.guest.phone} · {draft.guest.email}
            </p>
          </div>

          <fieldset>
            <legend className="mb-4 font-display text-2xl">{t.payment.method}</legend>
            <PaymentMethodPicker value={method} onChange={setMethod} />
          </fieldset>

          <div className="flex gap-3 rounded-sm bg-gold/10 p-4 text-sm text-ink/80">
            <Info className="mt-0.5 size-4 shrink-0 text-gold" />
            {t.payment.demo}
          </div>

          <button type="button" onClick={pay} disabled={processing} className={cn(btn.primary, "w-full py-4")}>
            <Lock className="size-4" />
            {t.payment.pay(formatVnd(totals.total, lang))}
          </button>
        </div>

        <div className="lg:sticky lg:top-28 lg:self-start">
          <OrderSummary exp={exp} date={draft.date} time={draft.time} pax={draft.pax} addons={draft.addons} />
        </div>
      </div>

      <ProcessingOverlay show={processing} method={method} />
    </div>
  );
}
