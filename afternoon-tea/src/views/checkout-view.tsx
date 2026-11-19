"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowRight, Sparkles } from "lucide-react";
import {
  CheckoutSteps,
  EmptyState,
  Field,
  HoldExpired,
  HoldTimer,
  OrderSummary,
  PageSkeleton,
  useHoldRemaining,
} from "@/components/checkout-parts";
import { Stepper } from "@/components/stepper";
import { btn, cn, input } from "@/components/ui";
import { addonsFor, getExperience, occasionKeys, type Experience } from "@/data/experiences";
import { localePath, tr } from "@/i18n/config";
import type { Dict } from "@/i18n/dict";
import { useT } from "@/i18n/use-lang";
import { formatLongDate, formatVnd } from "@/lib/format";
import { useBooking, useHydrated, type Draft } from "@/lib/store";

const phoneOk = (v: string) => /^(0|\+84)[35789]\d{8}$/.test(v.replace(/[\s.-]/g, "")) || /^\+\d{8,15}$/.test(v.replace(/[\s.-]/g, ""));

function makeSchema(t: Dict) {
  return z.object({
    fullName: z.string().trim().min(2, t.checkout.errName),
    phone: z.string().trim().refine(phoneOk, t.checkout.errPhone),
    email: z.string().trim().pipe(z.email(t.checkout.errEmail)),
    occasion: z.string(),
    note: z.string().max(300, t.checkout.errMax(300)),
    cardMessage: z.string().max(200, t.checkout.errMax(200)),
    marketing: z.boolean(),
    agree: z.boolean().refine((v) => v, t.checkout.errAgree),
  });
}

type FormValues = z.infer<ReturnType<typeof makeSchema>>;

export function CheckoutView() {
  const { t } = useT();
  const hydrated = useHydrated();
  const draft = useBooking((s) => s.draft);

  if (!hydrated) return <PageSkeleton />;
  const exp = draft ? getExperience(draft.slug) : undefined;
  if (!draft || !exp) return <EmptyState title={t.checkout.emptyTitle} text={t.checkout.emptyText} />;
  return <CheckoutForm draft={draft} exp={exp} />;
}

/** Dữ liệu cũ lưu nhãn tiếng Việt cho dịp đặc biệt: quy về khoá */
function occasionKeyOf(v?: string) {
  if (!v) return "none";
  if ((occasionKeys as readonly string[]).includes(v)) return v;
  const legacy: Record<string, string> = {
    "Không có": "none",
    "Sinh nhật": "birthday",
    "Kỷ niệm": "anniversary",
    "Hẹn hò": "date",
    "Gặp gỡ công việc": "business",
  };
  return legacy[v] ?? "other";
}

function CheckoutForm({ draft, exp }: { draft: Draft; exp: Experience }) {
  const { lang, t } = useT();
  const router = useRouter();
  const setGuest = useBooking((s) => s.setGuest);
  const setAddonQty = useBooking((s) => s.setAddonQty);
  const remaining = useHoldRemaining(draft.holdExpiresAt);
  const schema = useMemo(() => makeSchema(t), [t]);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      fullName: draft.guest?.fullName ?? "",
      phone: draft.guest?.phone ?? "",
      email: draft.guest?.email ?? "",
      occasion: occasionKeyOf(draft.guest?.occasion),
      note: draft.guest?.note ?? "",
      cardMessage: draft.guest?.cardMessage ?? "",
      marketing: draft.guest?.marketing ?? false,
      agree: false,
    },
  });

  const occasion = useWatch({ control, name: "occasion" }) as keyof Dict["occasions"];
  const hasOccasion = occasion !== "none";

  if (remaining === 0) return <HoldExpired slug={exp.slug} />;

  const onSubmit = (v: FormValues) => {
    setGuest({
      fullName: v.fullName,
      phone: v.phone,
      email: v.email,
      occasion: v.occasion,
      note: v.note,
      marketing: v.marketing,
      cardMessage: exp.perks?.greetingCard ? v.cardMessage.trim() : undefined,
    });
    router.push(localePath(lang, "/payment/"));
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:py-14">
      <CheckoutSteps current={2} />
      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_380px]">
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="min-w-0 space-y-10">
          <div>
            <h1 className="font-display text-4xl font-light sm:text-5xl">{t.checkout.title}</h1>
            <p className="mt-2 text-muted">
              {exp.name} · {formatLongDate(draft.date, lang)} · {draft.time} · {t.common.guests(draft.pax)}
            </p>
            <div className="mt-6">
              <HoldTimer seconds={remaining} />
            </div>
          </div>

          <fieldset className="space-y-5">
            <legend className="mb-5 font-display text-2xl">{t.checkout.contact}</legend>
            <Field label={t.checkout.fullName} error={errors.fullName?.message} id="fullName">
              <input id="fullName" autoComplete="name" className={input} aria-invalid={!!errors.fullName} {...register("fullName")} />
            </Field>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label={t.checkout.phone} error={errors.phone?.message} id="phone">
                <input
                  id="phone"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder={lang === "en" ? "+84 9xx xxx xxx" : "09xx xxx xxx"}
                  className={input}
                  aria-invalid={!!errors.phone}
                  {...register("phone")}
                />
              </Field>
              <Field label={t.checkout.email} error={errors.email?.message} id="email">
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@email.com"
                  className={input}
                  aria-invalid={!!errors.email}
                  {...register("email")}
                />
              </Field>
            </div>
            <Field label={t.checkout.occasion} id="occasion">
              <select id="occasion" className={input} {...register("occasion")}>
                {occasionKeys.map((k) => (
                  <option key={k} value={k}>
                    {t.occasions[k]}
                  </option>
                ))}
              </select>
            </Field>
            {exp.perks?.tableDecor && hasOccasion && (
              <p className="flex gap-3 rounded-sm bg-gold/10 p-4 text-sm text-ink/80">
                <Sparkles className="mt-0.5 size-4 shrink-0 text-gold" />
                {t.checkout.decorNote(exp.name, t.occasions[occasion].toLowerCase())}
              </p>
            )}
            {exp.perks?.greetingCard && (
              <Field label={t.checkout.cardMessage} error={errors.cardMessage?.message} id="cardMessage">
                <textarea
                  id="cardMessage"
                  rows={2}
                  placeholder={t.checkout.cardPlaceholder}
                  className={cn(input, "resize-none")}
                  aria-invalid={!!errors.cardMessage}
                  {...register("cardMessage")}
                />
              </Field>
            )}
            <Field label={t.checkout.note} error={errors.note?.message} id="note">
              <textarea id="note" rows={3} className={cn(input, "resize-none")} aria-invalid={!!errors.note} {...register("note")} />
            </Field>
          </fieldset>

          <fieldset>
            <legend className="font-display text-2xl">{t.checkout.addonsTitle}</legend>
            <p className="mt-1 text-sm text-muted">{t.checkout.addonsText}</p>
            <div className="mt-5 grid gap-3">
              {addonsFor(exp.slug).map((a) => {
                const qty = draft.addons[a.id] ?? 0;
                const name = tr(a.name, lang);
                return (
                  <div
                    key={a.id}
                    className={cn(
                      "flex items-center justify-between gap-4 rounded-sm border p-4 transition",
                      qty > 0 ? "border-navy bg-navy/5" : "border-line bg-paper",
                    )}
                  >
                    <div className="min-w-0">
                      <p className="font-medium">{name}</p>
                      <p className="text-sm text-muted">{tr(a.description, lang)}</p>
                      <p className="mt-1 text-sm text-navy">{formatVnd(a.price, lang)}</p>
                    </div>
                    <Stepper size="sm" value={qty} min={0} max={a.maxQty} onChange={(n) => setAddonQty(a.id, n)} label={name} />
                  </div>
                );
              })}
            </div>
          </fieldset>

          <div className="space-y-3 rounded-sm border border-line bg-paper p-5 text-sm">
            <label className="flex cursor-pointer gap-3">
              <input type="checkbox" className="mt-0.5 size-4 accent-navy" {...register("agree")} />
              <span>
                {t.checkout.agree}
                {errors.agree && <span className="mt-1 block text-danger">{errors.agree.message}</span>}
              </span>
            </label>
            <label className="flex cursor-pointer gap-3 text-muted">
              <input type="checkbox" className="mt-0.5 size-4 accent-navy" {...register("marketing")} />
              {t.checkout.marketing}
            </label>
          </div>

          <button type="submit" disabled={isSubmitting} className={cn(btn.primary, "w-full py-4 sm:w-auto sm:px-10")}>
            {t.checkout.submit}
            <ArrowRight className="size-4" />
          </button>
        </form>

        <div className="lg:sticky lg:top-28 lg:self-start">
          <OrderSummary exp={exp} date={draft.date} time={draft.time} pax={draft.pax} addons={draft.addons} />
        </div>
      </div>
    </div>
  );
}
