"use client";

import { useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Gift, Info, Lock, Printer } from "lucide-react";
import { Field, PaymentMethodPicker, PriceLines, ProcessingOverlay } from "@/components/checkout-parts";
import { Ornament, Photo } from "@/components/photo";
import { Stepper } from "@/components/stepper";
import { btn, cn, input } from "@/components/ui";
import { experiences, getExperience } from "@/data/experiences";
import { venue } from "@/data/venue";
import { tr } from "@/i18n/config";
import type { Dict } from "@/i18n/dict";
import { useT } from "@/i18n/use-lang";
import { withBasePath } from "@/lib/base-path";
import { formatShortDate, formatVnd } from "@/lib/format";
import { computeTotals } from "@/lib/pricing";
import { useBooking, type PaymentMethod, type Voucher } from "@/lib/store";

const phoneOk = (v: string) => /^(0|\+84)[35789]\d{8}$/.test(v.replace(/[\s.-]/g, "")) || /^\+\d{8,15}$/.test(v.replace(/[\s.-]/g, ""));

function makeSchema(t: Dict) {
  return z
    .object({
      slug: z.string(),
      recipientName: z.string().trim().min(2, t.voucher.errName),
      message: z.string().max(200, t.checkout.errMax(200)),
      deliverTo: z.enum(["recipient", "me"]),
      recipientEmail: z.string().trim(),
      senderName: z.string().trim().min(2, t.voucher.errName),
      senderEmail: z.string().trim().pipe(z.email(t.checkout.errEmail)),
      senderPhone: z.string().trim().refine(phoneOk, t.checkout.errPhone),
      agree: z.boolean().refine((v) => v, t.checkout.errAgree),
    })
    .refine((v) => v.deliverTo === "me" || z.email().safeParse(v.recipientEmail).success, {
      path: ["recipientEmail"],
      message: t.voucher.errRecipientEmail,
    });
}

type FormValues = z.infer<ReturnType<typeof makeSchema>>;

/** Thẻ voucher: dùng cho bản xem trước, trang thành công và bản in */
function VoucherCard({
  slug,
  pax,
  recipientName,
  senderName,
  message,
  code,
  expiresAt,
}: {
  slug: string;
  pax: number;
  recipientName: string;
  senderName: string;
  message: string;
  code?: string;
  expiresAt?: number;
}) {
  const { lang, t } = useT();
  const v = t.voucher;
  const exp = getExperience(slug);
  return (
    <div className="lattice relative overflow-hidden bg-navy px-7 py-10 text-center text-cream shadow-[0_40px_80px_-40px_rgba(16,25,45,0.8)] [print-color-adjust:exact] sm:px-10">
      <div className="pointer-events-none absolute inset-3 border border-gold-soft/40" aria-hidden />
      <div className="pointer-events-none absolute inset-[18px] border border-gold-soft/15" aria-hidden />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={withBasePath("/logo-white.webp")} alt={venue.name} width={306} height={214} className="mx-auto h-12 w-auto" />
      <p className="mt-5 font-script text-5xl leading-none text-gold-soft">Afternoon Tea</p>
      <p className="mt-2 text-[10px] tracking-[0.45em] text-cream/60 uppercase">{v.giftVoucher}</p>
      <Ornament className="mx-auto mt-5 text-gold-soft/60" />
      <p className="mt-6 font-display text-3xl font-light">{exp?.name}</p>
      <p className="mt-1 text-sm text-cream/70">{v.forGuests(pax)}</p>
      <div className="mx-auto mt-6 grid max-w-xs grid-cols-2 gap-4 text-left text-sm">
        <div>
          <p className="text-[10px] tracking-[0.3em] text-gold-soft uppercase">{v.to}</p>
          <p className="mt-1 truncate font-display text-xl">{recipientName || "—"}</p>
        </div>
        <div>
          <p className="text-[10px] tracking-[0.3em] text-gold-soft uppercase">{v.from}</p>
          <p className="mt-1 truncate font-display text-xl">{senderName || "—"}</p>
        </div>
      </div>
      {message && <p className="mx-auto mt-6 max-w-xs font-display text-lg leading-snug text-cream/85 italic">“{message}”</p>}
      <div className="mx-auto mt-7 max-w-xs border-t border-gold-soft/25 pt-5">
        <p className="text-[10px] tracking-[0.3em] text-gold-soft uppercase">{v.code}</p>
        <p className="mt-1 font-display text-2xl tracking-[0.2em]">{code ?? "GV-••••••"}</p>
        <p className="mt-2 text-[11px] text-cream/55">
          {expiresAt ? v.validUntil(formatShortDate(new Date(expiresAt), lang)) : v.validity}
        </p>
      </div>
      <p className="mt-6 text-[10px] tracking-[0.25em] text-cream/45 uppercase">
        {venue.lounge} · {venue.name}
      </p>
    </div>
  );
}

export function GiftVoucherView() {
  const { lang, t } = useT();
  const v = t.voucher;
  const addVoucher = useBooking((s) => s.addVoucher);
  const schema = useMemo(() => makeSchema(t), [t]);
  const [pax, setPax] = useState(2);
  const [method, setMethod] = useState<PaymentMethod>("vnpay");
  const [processing, setProcessing] = useState(false);
  const [done, setDone] = useState<Voucher | null>(null);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      slug: experiences[0].slug,
      recipientName: "",
      message: "",
      deliverTo: "recipient",
      recipientEmail: "",
      senderName: "",
      senderEmail: "",
      senderPhone: "",
      agree: false,
    },
  });
  const w = useWatch({ control });
  const exp = getExperience(w.slug ?? experiences[0].slug) ?? experiences[0];
  const clampedPax = Math.min(Math.max(pax, exp.minPax), exp.maxPax);
  const totals = computeTotals(exp, clampedPax);

  const onSubmit = (f: FormValues) => {
    setProcessing(true);
    // Giả lập cổng thanh toán; khi có backend: tạo voucher sau khi nhận IPN thành công
    setTimeout(() => {
      const voucher = addVoucher({
        slug: exp.slug,
        experienceName: exp.name,
        pax: clampedPax,
        recipientName: f.recipientName,
        recipientEmail: f.deliverTo === "recipient" ? f.recipientEmail : undefined,
        message: f.message.trim(),
        senderName: f.senderName,
        senderEmail: f.senderEmail,
        senderPhone: f.senderPhone,
        deliverTo: f.deliverTo,
        total: totals.total,
        paymentMethod: method,
      });
      setProcessing(false);
      setDone(voucher);
      window.scrollTo({ top: 0 });
    }, 2000);
  };

  if (done) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-14 text-center sm:px-6 lg:py-20">
        <p className="font-script text-5xl text-gold print:hidden">Thank you</p>
        <h1 className="mt-2 font-display text-5xl font-light print:hidden">{v.successTitle}</h1>
        <p className="mx-auto mt-4 max-w-xl text-muted print:hidden">
          {v.successText(done.deliverTo === "recipient" && done.recipientEmail ? done.recipientEmail : done.senderEmail)}
        </p>
        <div className="print-area mx-auto mt-10 max-w-md text-left">
          <VoucherCard
            slug={done.slug}
            pax={done.pax}
            recipientName={done.recipientName}
            senderName={done.senderName}
            message={done.message}
            code={done.code}
            expiresAt={done.expiresAt}
          />
        </div>
        <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row print:hidden">
          <button type="button" className={btn.primary} onClick={() => window.print()}>
            <Printer className="size-4" />
            {v.print}
          </button>
          <button
            type="button"
            className={btn.outline}
            onClick={() => {
              reset();
              setPax(2);
              setDone(null);
            }}
          >
            {v.buyAnother}
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <section className="lattice relative bg-navy text-cream">
        <div className="pointer-events-none absolute inset-x-6 inset-y-6 border border-gold-soft/15" aria-hidden />
        <div className="relative mx-auto max-w-3xl px-6 py-20 text-center lg:py-24">
          <p className="font-script text-5xl text-gold-soft sm:text-6xl">{v.script}</p>
          <h1 className="mt-3 font-display text-4xl font-light sm:text-5xl lg:text-6xl">{v.title}</h1>
          <Ornament className="mx-auto mt-6 text-gold-soft/70" />
          <p className="mx-auto mt-6 max-w-2xl leading-relaxed text-cream/70">{v.intro}</p>
        </div>
      </section>

      <div className="mx-auto grid max-w-6xl gap-12 px-4 py-14 sm:px-6 lg:grid-cols-[1fr_420px] lg:gap-16 lg:py-20">
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="min-w-0 space-y-12">
          {/* 1. Chọn gói */}
          <fieldset>
            <legend className="mb-5 text-xs font-medium tracking-[0.2em] text-muted uppercase">{v.s1}</legend>
            <div className="grid gap-4 sm:grid-cols-2">
              {experiences.map((e) => {
                const sel = e.slug === exp.slug;
                return (
                  <label
                    key={e.slug}
                    className={cn(
                      "group cursor-pointer overflow-hidden bg-paper ring-1 transition",
                      sel ? "ring-2 ring-navy" : "ring-line hover:ring-gold/50",
                    )}
                  >
                    <input type="radio" value={e.slug} className="sr-only" {...register("slug")} />
                    <Photo src={e.image} alt={e.name} tone={e.tone} className="aspect-[16/9]" />
                    <div className="p-5">
                      <p className="font-display text-2xl">{e.name}</p>
                      <p className="mt-1 text-sm text-muted">{tr(e.tagline, lang)}</p>
                      <p className="mt-3 text-sm text-navy">
                        {formatVnd(e.pricePerGuest, lang)} {t.common.perGuest}
                        {e.pairPrice && <span className="text-gold"> · {t.common.pairComboShort(formatVnd(e.pairPrice, lang))}</span>}
                      </p>
                    </div>
                  </label>
                );
              })}
            </div>
          </fieldset>

          {/* 2. Số khách */}
          <fieldset>
            <legend className="mb-5 text-xs font-medium tracking-[0.2em] text-muted uppercase">{v.s2}</legend>
            <div className="flex items-center justify-between rounded-sm border border-line bg-paper px-5 py-4">
              <span className="font-display text-xl">{t.common.guests(clampedPax)}</span>
              <Stepper value={clampedPax} min={exp.minPax} max={exp.maxPax} onChange={setPax} label={t.widget.guestsAria} />
            </div>
          </fieldset>

          {/* 3. Người nhận */}
          <fieldset className="space-y-5">
            <legend className="mb-5 text-xs font-medium tracking-[0.2em] text-muted uppercase">{v.s3}</legend>
            <Field label={v.recipientName} error={errors.recipientName?.message} id="recipientName">
              <input id="recipientName" className={input} aria-invalid={!!errors.recipientName} {...register("recipientName")} />
            </Field>
            <Field label={v.message} error={errors.message?.message} id="message">
              <textarea
                id="message"
                rows={2}
                maxLength={200}
                placeholder={v.messagePlaceholder}
                className={cn(input, "resize-none")}
                {...register("message")}
              />
            </Field>
            <div>
              <p className="mb-2 text-sm font-medium">{v.delivery}</p>
              <div className="grid gap-2 sm:grid-cols-2">
                {(["recipient", "me"] as const).map((d) => (
                  <label
                    key={d}
                    className={cn(
                      "flex cursor-pointer items-center gap-3 rounded-sm border p-4 text-sm transition",
                      w.deliverTo === d ? "border-navy bg-navy/5" : "border-line bg-paper",
                    )}
                  >
                    <input type="radio" value={d} className="accent-navy" {...register("deliverTo")} />
                    {d === "recipient" ? v.deliverRecipient : v.deliverMe}
                  </label>
                ))}
              </div>
            </div>
            {w.deliverTo === "recipient" && (
              <Field label={v.recipientEmail} error={errors.recipientEmail?.message} id="recipientEmail">
                <input
                  id="recipientEmail"
                  type="email"
                  className={input}
                  aria-invalid={!!errors.recipientEmail}
                  {...register("recipientEmail")}
                />
              </Field>
            )}
          </fieldset>

          {/* 4. Người tặng */}
          <fieldset className="space-y-5">
            <legend className="mb-5 text-xs font-medium tracking-[0.2em] text-muted uppercase">{v.s4}</legend>
            <Field label={v.senderName} error={errors.senderName?.message} id="senderName">
              <input id="senderName" autoComplete="name" className={input} aria-invalid={!!errors.senderName} {...register("senderName")} />
            </Field>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label={t.checkout.email} error={errors.senderEmail?.message} id="senderEmail">
                <input
                  id="senderEmail"
                  type="email"
                  autoComplete="email"
                  className={input}
                  aria-invalid={!!errors.senderEmail}
                  {...register("senderEmail")}
                />
              </Field>
              <Field label={t.checkout.phone} error={errors.senderPhone?.message} id="senderPhone">
                <input
                  id="senderPhone"
                  type="tel"
                  autoComplete="tel"
                  className={input}
                  aria-invalid={!!errors.senderPhone}
                  {...register("senderPhone")}
                />
              </Field>
            </div>
          </fieldset>

          {/* 5. Thanh toán */}
          <fieldset className="space-y-5">
            <legend className="mb-5 text-xs font-medium tracking-[0.2em] text-muted uppercase">{v.s5}</legend>
            <PaymentMethodPicker value={method} onChange={setMethod} />
            <div className="flex gap-3 rounded-sm bg-gold/10 p-4 text-sm text-ink/80">
              <Info className="mt-0.5 size-4 shrink-0 text-gold" />
              {t.payment.demo}
            </div>
            <div className="rounded-sm border border-line bg-paper p-5 text-sm">
              <p className="font-medium">{v.termsTitle}</p>
              <ul className="mt-3 space-y-1.5 text-muted">
                {v.terms.map((term) => (
                  <li key={term} className="flex gap-2.5">
                    <span className="mt-2 size-1 shrink-0 rotate-45 bg-gold" />
                    {term}
                  </li>
                ))}
              </ul>
              <label className="mt-4 flex cursor-pointer gap-3">
                <input type="checkbox" className="mt-0.5 size-4 accent-navy" {...register("agree")} />
                <span>
                  {v.agree}
                  {errors.agree && <span className="mt-1 block text-danger">{errors.agree.message}</span>}
                </span>
              </label>
            </div>
          </fieldset>

          <button type="submit" disabled={processing} className={cn(btn.primary, "w-full py-4")}>
            <Lock className="size-4" />
            {v.buy(formatVnd(totals.total, lang))}
          </button>
        </form>

        <aside className="space-y-6 lg:sticky lg:top-28 lg:self-start">
          <p className="flex items-center gap-2 text-xs font-medium tracking-[0.2em] text-muted uppercase">
            <Gift className="size-4 text-gold" />
            {v.previewLabel}
          </p>
          <VoucherCard
            slug={exp.slug}
            pax={clampedPax}
            recipientName={w.recipientName ?? ""}
            senderName={w.senderName ?? ""}
            message={(w.message ?? "").trim()}
          />
          <div className="rounded-sm border border-line bg-paper px-6 pb-6">
            <PriceLines exp={exp} pax={clampedPax} totals={totals} />
          </div>
        </aside>
      </div>

      <ProcessingOverlay show={processing} method={method} />
    </>
  );
}
