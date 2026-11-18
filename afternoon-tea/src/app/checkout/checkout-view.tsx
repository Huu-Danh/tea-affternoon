"use client";

import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowRight, Sparkles } from "lucide-react";
import {
  CheckoutSteps,
  EmptyState,
  HoldExpired,
  HoldTimer,
  OrderSummary,
  useHoldRemaining,
} from "@/components/checkout-parts";
import { Stepper } from "@/components/stepper";
import { btn, cn, input } from "@/components/ui";
import { addonsFor, getExperience, occasions, type Experience } from "@/data/experiences";
import { formatLongDate, formatVnd } from "@/lib/format";
import { useBooking, useHydrated, type Draft } from "@/lib/store";

const schema = z.object({
  fullName: z.string().trim().min(2, "Vui lòng nhập họ và tên"),
  phone: z
    .string()
    .trim()
    .refine((v) => /^(0|\+84)[35789]\d{8}$/.test(v.replace(/[\s.-]/g, "")), "Số điện thoại không hợp lệ"),
  email: z.string().trim().pipe(z.email("Email không hợp lệ")),
  occasion: z.string(),
  note: z.string().max(300, "Tối đa 300 ký tự"),
  cardMessage: z.string().max(200, "Tối đa 200 ký tự"),
  marketing: z.boolean(),
  agree: z.boolean().refine((v) => v, "Vui lòng đồng ý với điều khoản đặt chỗ"),
});

type FormValues = z.infer<typeof schema>;

export function CheckoutView() {
  const hydrated = useHydrated();
  const draft = useBooking((s) => s.draft);

  if (!hydrated) return <PageSkeleton />;
  const exp = draft ? getExperience(draft.slug) : undefined;
  if (!draft || !exp) {
    return <EmptyState title="Chưa có đặt chỗ" text="Hãy chọn một gói trà chiều và khung giờ trước khi thanh toán." />;
  }
  return <CheckoutForm draft={draft} exp={exp} />;
}

export function PageSkeleton() {
  return (
    <div className="mx-auto grid max-w-6xl animate-pulse gap-10 px-4 py-12 lg:grid-cols-[1fr_380px]" aria-hidden>
      <div className="h-[600px] rounded-3xl bg-sand" />
      <div className="h-96 rounded-3xl bg-sand" />
    </div>
  );
}

function CheckoutForm({ draft, exp }: { draft: Draft; exp: Experience }) {
  const router = useRouter();
  const setGuest = useBooking((s) => s.setGuest);
  const setAddonQty = useBooking((s) => s.setAddonQty);
  const remaining = useHoldRemaining(draft.holdExpiresAt);

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
      occasion: draft.guest?.occasion ?? occasions[0],
      note: draft.guest?.note ?? "",
      cardMessage: draft.guest?.cardMessage ?? "",
      marketing: draft.guest?.marketing ?? false,
      agree: false,
    },
  });

  const occasion = useWatch({ control, name: "occasion" });
  const hasOccasion = occasion !== occasions[0];

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
    router.push("/payment/");
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:py-14">
      <CheckoutSteps current={2} />
      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_380px]">
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="min-w-0 space-y-10">
          <div>
            <h1 className="font-display text-4xl sm:text-5xl">Thông tin đặt chỗ</h1>
            <p className="mt-2 text-muted">
              {exp.name} · {formatLongDate(draft.date)} · {draft.time} · {draft.pax} khách
            </p>
            <div className="mt-6">
              <HoldTimer seconds={remaining} />
            </div>
          </div>

          <fieldset className="space-y-5">
            <legend className="mb-5 font-display text-2xl">Liên hệ</legend>
            <Field label="Họ và tên" error={errors.fullName?.message} id="fullName">
              <input id="fullName" autoComplete="name" className={input} aria-invalid={!!errors.fullName} {...register("fullName")} />
            </Field>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Số điện thoại" error={errors.phone?.message} id="phone">
                <input
                  id="phone"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder="09xx xxx xxx"
                  className={input}
                  aria-invalid={!!errors.phone}
                  {...register("phone")}
                />
              </Field>
              <Field label="Email" error={errors.email?.message} id="email">
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="ban@email.com"
                  className={input}
                  aria-invalid={!!errors.email}
                  {...register("email")}
                />
              </Field>
            </div>
            <Field label="Dịp đặc biệt" id="occasion">
              <select id="occasion" className={input} {...register("occasion")}>
                {occasions.map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </select>
            </Field>
            {exp.perks?.tableDecor && hasOccasion && (
              <p className="flex gap-3 rounded-2xl bg-gold/10 p-4 text-sm text-ink/80">
                <Sparkles className="mt-0.5 size-4 shrink-0 text-gold" />
                Gói {exp.name} bao gồm trang trí bàn cho dịp {occasion.toLowerCase()} của bạn.
              </p>
            )}
            {exp.perks?.greetingCard && (
              <Field label="Lời chúc trên thiệp chúc mừng (tuỳ chọn)" error={errors.cardMessage?.message} id="cardMessage">
                <textarea
                  id="cardMessage"
                  rows={2}
                  placeholder="Ví dụ: Chúc mừng sinh nhật mẹ!"
                  className={cn(input, "resize-none")}
                  aria-invalid={!!errors.cardMessage}
                  {...register("cardMessage")}
                />
              </Field>
            )}
            <Field label="Ghi chú (dị ứng, yêu cầu chỗ ngồi...)" error={errors.note?.message} id="note">
              <textarea id="note" rows={3} className={cn(input, "resize-none")} aria-invalid={!!errors.note} {...register("note")} />
            </Field>
          </fieldset>

          <fieldset>
            <legend className="font-display text-2xl">Thêm trải nghiệm</legend>
            <p className="mt-1 text-sm text-muted">Tuỳ chọn, giúp buổi chiều thêm trọn vẹn.</p>
            <div className="mt-5 grid gap-3">
              {addonsFor(exp.slug).map((a) => {
                const qty = draft.addons[a.id] ?? 0;
                return (
                  <div
                    key={a.id}
                    className={cn(
                      "flex items-center justify-between gap-4 rounded-2xl border p-4 transition",
                      qty > 0 ? "border-forest bg-forest/5" : "border-line bg-paper",
                    )}
                  >
                    <div className="min-w-0">
                      <p className="font-medium">{a.name}</p>
                      <p className="text-sm text-muted">{a.description}</p>
                      <p className="mt-1 text-sm text-forest">{formatVnd(a.price)}</p>
                    </div>
                    <Stepper
                      size="sm"
                      value={qty}
                      min={0}
                      max={a.maxQty}
                      onChange={(n) => setAddonQty(a.id, n)}
                      label={a.name}
                    />
                  </div>
                );
              })}
            </div>
          </fieldset>

          <div className="space-y-3 rounded-2xl border border-line bg-paper p-5 text-sm">
            <label className="flex cursor-pointer gap-3">
              <input type="checkbox" className="mt-0.5 size-4 accent-forest" {...register("agree")} />
              <span>
                Tôi đồng ý với điều khoản đặt chỗ và chính sách huỷ (miễn phí huỷ trước 24 giờ).
                {errors.agree && <span className="mt-1 block text-danger">{errors.agree.message}</span>}
              </span>
            </label>
            <label className="flex cursor-pointer gap-3 text-muted">
              <input type="checkbox" className="mt-0.5 size-4 accent-forest" {...register("marketing")} />
              Nhận thông tin ưu đãi qua email.
            </label>
          </div>

          <button type="submit" disabled={isSubmitting} className={cn(btn.primary, "w-full py-4 text-[15px] sm:w-auto sm:px-10")}>
            Tiếp tục thanh toán
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

function Field({
  label,
  error,
  id,
  children,
}: {
  label: string;
  error?: string;
  id: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium">
        {label}
      </label>
      {children}
      {error && (
        <p className="mt-1.5 text-sm text-danger" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
