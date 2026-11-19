"use client";

import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format, addYears } from "date-fns";
import { CheckCircle2, Mail, Phone, Send, Sparkles, UtensilsCrossed, Users } from "lucide-react";
import { Field } from "@/components/checkout-parts";
import { Ornament } from "@/components/photo";
import { btn, cn, input } from "@/components/ui";
import { experiences } from "@/data/experiences";
import { venue } from "@/data/venue";
import type { Dict, EventTypeKey } from "@/i18n/dict";
import { useT } from "@/i18n/use-lang";
import { formatLongDate } from "@/lib/format";
import { useBooking, useHydrated, type Inquiry } from "@/lib/store";

const eventTypeKeys: EventTypeKey[] = ["birthday", "anniversary", "corporate", "bridal", "other"];
const phoneOk = (v: string) => /^(0|\+84)[35789]\d{8}$/.test(v.replace(/[\s.-]/g, "")) || /^\+\d{8,15}$/.test(v.replace(/[\s.-]/g, ""));

function makeSchema(t: Dict) {
  return z.object({
    name: z.string().trim().min(2, t.checkout.errName),
    company: z.string().trim().max(120, t.checkout.errMax(120)),
    phone: z.string().trim().refine(phoneOk, t.checkout.errPhone),
    email: z.string().trim().pipe(z.email(t.checkout.errEmail)),
    eventType: z.string(),
    date: z.string().min(1, t.events.errDate),
    time: z.string(),
    guests: z.number({ error: t.events.errGuests }).int().min(9, t.events.errGuests).max(100, t.events.errGuests),
    pkg: z.string(),
    message: z.string().max(600, t.checkout.errMax(600)),
    agree: z.boolean().refine((v) => v, t.checkout.errAgree),
  });
}

type FormValues = z.infer<ReturnType<typeof makeSchema>>;

export function PrivateEventsView() {
  const { lang, t } = useT();
  const e = t.events;
  const hydrated = useHydrated();
  const addInquiry = useBooking((s) => s.addInquiry);
  const schema = useMemo(() => makeSchema(t), [t]);
  const [sent, setSent] = useState<Inquiry | null>(null);
  const icons = [Users, UtensilsCrossed, Sparkles];

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      company: "",
      phone: "",
      email: "",
      eventType: "birthday",
      date: "",
      time: "14:00",
      guests: 12,
      pkg: experiences[0].slug,
      message: "",
      agree: false,
    },
  });

  const onSubmit = (v: FormValues) => {
    setSent(
      addInquiry({
        name: v.name,
        company: v.company,
        phone: v.phone,
        email: v.email,
        eventType: v.eventType,
        date: v.date,
        time: v.time,
        guests: v.guests,
        pkg: v.pkg,
        message: v.message,
      }),
    );
    window.scrollTo({ top: 0 });
  };

  // Giới hạn chọn ngày: từ hôm nay đến 1 năm tới (chỉ tính ở client để không lệch ngày lúc build)
  const today = hydrated ? format(new Date(), "yyyy-MM-dd") : undefined;
  const maxDate = hydrated ? format(addYears(new Date(), 1), "yyyy-MM-dd") : undefined;

  return (
    <>
      <section className="lattice relative bg-navy text-cream">
        <div className="pointer-events-none absolute inset-6 border border-gold-soft/15" aria-hidden />
        <div className="relative mx-auto max-w-3xl px-6 py-20 text-center lg:py-24">
          <p className="font-script text-5xl text-gold-soft sm:text-6xl">{e.script}</p>
          <h1 className="mt-3 font-display text-4xl font-light sm:text-5xl lg:text-6xl">{e.title}</h1>
          <Ornament className="mx-auto mt-6 text-gold-soft/70" />
          <p className="mx-auto mt-6 max-w-2xl leading-relaxed text-cream/70">{e.intro}</p>
        </div>
      </section>

      <section className="border-b border-line bg-paper">
        <div className="mx-auto grid max-w-6xl divide-y divide-line px-4 sm:px-6 md:grid-cols-3 md:divide-x md:divide-y-0 lg:px-8">
          {e.points.map((p, i) => {
            const Icon = icons[i];
            return (
              <div key={p.title} className="flex flex-col items-center px-6 py-10 text-center">
                <Icon className="size-6 text-gold" strokeWidth={1.3} />
                <p className="mt-4 font-display text-2xl">{p.title}</p>
                <p className="mt-2 max-w-xs text-sm leading-relaxed text-muted">{p.text}</p>
              </div>
            );
          })}
        </div>
      </section>

      <div className="mx-auto grid max-w-6xl gap-12 px-4 py-14 sm:px-6 lg:grid-cols-[1fr_340px] lg:gap-16 lg:py-20">
        {sent ? (
          <div className="py-10 text-center lg:text-left">
            <CheckCircle2 className="mx-auto size-12 text-gold lg:mx-0" strokeWidth={1.3} />
            <h2 className="mt-6 font-display text-4xl font-light">{e.successTitle}</h2>
            <p className="mt-3 max-w-xl text-muted">{e.successText}</p>
            <p className="mt-8 text-[11px] tracking-[0.3em] text-muted uppercase">{e.ref}</p>
            <p className="mt-1 font-display text-3xl tracking-[0.15em] text-navy">{sent.ref}</p>
            <p className="mt-4 text-sm text-muted">
              {t.events.eventTypes[sent.eventType as EventTypeKey]} · {t.common.guests(sent.guests)} · {formatLongDate(sent.date, lang)}
            </p>
            <button
              type="button"
              className={cn(btn.outline, "mt-10")}
              onClick={() => {
                reset();
                setSent(null);
              }}
            >
              {e.another}
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} noValidate className="min-w-0 space-y-6">
            <h2 className="font-display text-4xl font-light">{e.formTitle}</h2>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label={e.name} error={errors.name?.message} id="ev-name">
                <input id="ev-name" autoComplete="name" className={input} aria-invalid={!!errors.name} {...register("name")} />
              </Field>
              <Field label={e.company} error={errors.company?.message} id="ev-company">
                <input id="ev-company" autoComplete="organization" className={input} {...register("company")} />
              </Field>
              <Field label={t.checkout.phone} error={errors.phone?.message} id="ev-phone">
                <input id="ev-phone" type="tel" autoComplete="tel" className={input} aria-invalid={!!errors.phone} {...register("phone")} />
              </Field>
              <Field label={t.checkout.email} error={errors.email?.message} id="ev-email">
                <input id="ev-email" type="email" autoComplete="email" className={input} aria-invalid={!!errors.email} {...register("email")} />
              </Field>
              <Field label={e.eventType} id="ev-type">
                <select id="ev-type" className={input} {...register("eventType")}>
                  {eventTypeKeys.map((k) => (
                    <option key={k} value={k}>
                      {e.eventTypes[k]}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label={e.guests} error={errors.guests?.message} id="ev-guests">
                <input
                  id="ev-guests"
                  type="number"
                  min={9}
                  max={100}
                  className={input}
                  aria-invalid={!!errors.guests}
                  {...register("guests", { valueAsNumber: true })}
                />
              </Field>
              <Field label={e.date} error={errors.date?.message} id="ev-date">
                <input id="ev-date" type="date" min={today} max={maxDate} className={input} aria-invalid={!!errors.date} {...register("date")} />
              </Field>
              <Field label={e.time} id="ev-time">
                <select id="ev-time" className={input} {...register("time")}>
                  {["14:00", "14:30", "15:00"].map((x) => (
                    <option key={x} value={x}>
                      {x}
                    </option>
                  ))}
                  <option value="">{e.timeFlexible}</option>
                </select>
              </Field>
            </div>
            <Field label={e.pkg} id="ev-pkg">
              <select id="ev-pkg" className={input} {...register("pkg")}>
                {experiences.map((x) => (
                  <option key={x.slug} value={x.slug}>
                    {x.name}
                  </option>
                ))}
                <option value="undecided">{e.pkgUndecided}</option>
              </select>
            </Field>
            <Field label={e.message} error={errors.message?.message} id="ev-message">
              <textarea id="ev-message" rows={4} className={cn(input, "resize-none")} {...register("message")} />
            </Field>
            <label className="flex cursor-pointer gap-3 text-sm">
              <input type="checkbox" className="mt-0.5 size-4 accent-navy" {...register("agree")} />
              <span>
                {e.agree}
                {errors.agree && <span className="mt-1 block text-danger">{errors.agree.message}</span>}
              </span>
            </label>
            <button type="submit" disabled={isSubmitting} className={cn(btn.primary, "w-full py-4 sm:w-auto sm:px-12")}>
              <Send className="size-4" />
              {e.submit}
            </button>
          </form>
        )}

        <aside className="lg:sticky lg:top-28 lg:self-start">
          <div className="lattice relative bg-navy px-8 py-10 text-center text-cream">
            <span className="pointer-events-none absolute inset-3 border border-gold-soft/25" aria-hidden />
            <p className="font-script text-4xl text-gold-soft">{venue.lounge}</p>
            <p className="mt-3 text-[10px] tracking-[0.3em] text-cream/60 uppercase">{e.directContact}</p>
            <Ornament className="mx-auto mt-5 text-gold-soft/60" />
            <a href={`tel:${venue.phone.replace(/\s/g, "")}`} className="mt-6 flex items-center justify-center gap-2 transition hover:text-gold-soft">
              <Phone className="size-4 text-gold-soft" />
              {venue.phone}
            </a>
            <a href={`mailto:${venue.email}`} className="mt-3 flex items-center justify-center gap-2 text-sm break-all transition hover:text-gold-soft">
              <Mail className="size-4 shrink-0 text-gold-soft" />
              {venue.email}
            </a>
          </div>
        </aside>
      </div>
    </>
  );
}
