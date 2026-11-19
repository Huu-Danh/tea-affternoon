import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, CalendarDays, Check, Clock, Users } from "lucide-react";
import { BookingWidget } from "@/components/booking-widget";
import { Ornament, Photo } from "@/components/photo";
import { Reveal, RevealMask } from "@/components/reveal";
import { btn, cn } from "@/components/ui";
import { experiences, getExperience, type Experience } from "@/data/experiences";
import { venue } from "@/data/venue";
import { alternatesFor, localePath, tr, type Lang } from "@/i18n/config";
import { dict } from "@/i18n/dict";
import { formatDays, formatDuration, formatVnd } from "@/lib/format";

export function experienceParams() {
  return experiences.map((e) => ({ slug: e.slug }));
}

export function experienceMetadata(slug: string, lang: Lang): Metadata {
  const exp = getExperience(slug);
  if (!exp) return {};
  const description = tr(exp.tagline, lang);
  return {
    title: exp.name,
    description,
    alternates: alternatesFor(`/experiences/${slug}/`, lang),
    openGraph: { title: `${exp.name} | Afternoon Tea`, description, images: exp.image ? [exp.image] : undefined },
  };
}

/** Thực đơn trình bày như một tấm thiệp in */
function MenuCard({ exp, lang }: { exp: Experience; lang: Lang }) {
  return (
    <div className="relative bg-paper px-6 py-14 text-center shadow-[0_30px_60px_-40px_rgba(16,25,45,0.35)] sm:px-14">
      <div className="pointer-events-none absolute inset-3 border border-gold/45" aria-hidden />
      <div className="pointer-events-none absolute inset-[18px] border border-gold/20" aria-hidden />
      <p className="font-script text-5xl text-gold">Menu</p>
      <p className="mt-2 text-[10px] tracking-[0.4em] text-muted uppercase">
        {exp.name} · {venue.lounge}
      </p>
      <Ornament className="mx-auto mt-6 text-gold" />
      <div className="mt-10 space-y-10">
        {exp.menu.map((sec) => (
          <div key={sec.title.vi}>
            <h3 className="text-[11px] font-medium tracking-[0.35em] text-navy uppercase">{tr(sec.title, lang)}</h3>
            <ul className="mt-4 space-y-2">
              {sec.items.map((it) => (
                <li key={it.vi} className="font-display text-xl font-light text-ink/85 italic">
                  {tr(it, lang)}
                </li>
              ))}
            </ul>
            <span className="mx-auto mt-6 block size-1.5 rotate-45 bg-gold/60" aria-hidden />
          </div>
        ))}
      </div>
      <p className="mt-4 text-[11px] text-muted">{dict[lang].detail.menuNote}</p>
    </div>
  );
}

export function ExperienceView({ slug, lang }: { slug: string; lang: Lang }) {
  const exp = getExperience(slug);
  if (!exp) notFound();
  const t = dict[lang];
  const d = t.detail;
  const others = experiences.filter((e) => e.slug !== exp.slug).slice(0, 3);

  return (
    <>
      <section className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
        <Link
          href={localePath(lang, "/#experiences")}
          className="inline-flex items-center gap-2 text-[11px] tracking-[0.25em] text-muted uppercase transition hover:text-navy"
        >
          <ArrowLeft className="size-3.5" />
          {d.allExperiences}
        </Link>
        <RevealMask className="relative mt-6 overflow-hidden rounded-xs">
          <Photo
            src={exp.image}
            alt={exp.name}
            tone={exp.tone}
            art="stand"
            fit="contain"
            kenBurns
            className="aspect-[16/9] sm:aspect-[21/8]"
          >
            <span className="pointer-events-none absolute inset-3 border border-paper/30 sm:inset-5" />
            {exp.badge && (
              <span className="absolute top-7 left-7 bg-navy/90 px-3.5 py-1.5 text-[10px] font-medium tracking-[0.25em] text-gold-soft uppercase sm:top-9 sm:left-9">
                {exp.badge}
              </span>
            )}
          </Photo>
        </RevealMask>
      </section>

      <section className="mx-auto grid max-w-7xl gap-14 px-4 py-14 sm:px-6 lg:grid-cols-[1fr_420px] lg:gap-20 lg:px-8 lg:py-20">
        <div className="min-w-0">
          <Reveal>
            <p className="font-script text-4xl text-gold sm:text-5xl">Afternoon Tea</p>
            <h1 className="mt-2 font-display text-5xl leading-tight font-light sm:text-6xl lg:text-7xl">{exp.name}</h1>
            <p className="mt-4 text-lg text-muted">{tr(exp.tagline, lang)}</p>
            <Ornament className="mt-7 text-gold" />

            <dl className="mt-9 grid grid-cols-3 divide-x divide-line border-y border-line">
              {[
                { icon: CalendarDays, label: d.served, text: formatDays(exp.daysOfWeek, lang) },
                { icon: Clock, label: d.duration, text: formatDuration(exp.durationMinutes, lang) },
                { icon: Users, label: d.guests, text: `${exp.minPax} – ${exp.maxPax}` },
              ].map(({ icon: Icon, label, text }) => (
                <div key={label} className="flex flex-col items-center gap-1.5 py-5 text-center">
                  <Icon className="size-4 text-gold" strokeWidth={1.5} />
                  <dt className="text-[10px] tracking-[0.25em] text-muted uppercase">{label}</dt>
                  <dd className="font-display text-xl">{text}</dd>
                </div>
              ))}
            </dl>
          </Reveal>

          <Reveal delay={0.1}>
            <p className="mt-10 text-[17px] leading-[1.8] text-ink/85">{tr(exp.description, lang)}</p>
            <ul className="mt-8 grid gap-3 sm:grid-cols-2">
              {exp.highlights.map((hl) => (
                <li key={hl.vi} className="flex gap-3 text-[15px]">
                  <Check className="mt-0.5 size-4 shrink-0 text-gold" strokeWidth={2} />
                  {tr(hl, lang)}
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal className="mt-20">
            <MenuCard exp={exp} lang={lang} />
          </Reveal>

          <Reveal className="mt-20">
            <h2 className="font-display text-4xl font-light">{d.terms}</h2>
            <Ornament className="mt-5 text-gold" />
            <ul className="mt-7 space-y-3 text-[15px] text-muted">
              {exp.terms.map((term) => (
                <li key={term.vi} className="flex gap-3">
                  <span className="mt-2.5 size-1.5 shrink-0 rotate-45 bg-gold" />
                  {tr(term, lang)}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        <div className="lg:sticky lg:top-28 lg:self-start">
          <BookingWidget exp={exp} />
        </div>
      </section>

      {/* Thanh đặt chỗ cố định trên mobile */}
      <div className="sticky bottom-0 z-30 border-t border-line bg-paper/95 px-4 py-3 backdrop-blur lg:hidden">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="font-display text-2xl leading-none text-navy">{formatVnd(exp.pricePerGuest, lang)}</p>
            <p className="mt-1 text-xs text-muted">
              {t.common.eachGuest}
              {exp.pairPrice ? ` · ${t.common.pairComboShort(formatVnd(exp.pairPrice, lang))}` : ""}
            </p>
          </div>
          <a href="#book" className={cn(btn.primary, "px-6")}>
            {d.pickDateTime}
          </a>
        </div>
      </div>

      {others.length > 0 && (
        <section className="border-t border-line bg-sand/50">
          <div className="mx-auto max-w-7xl px-4 py-24 text-center sm:px-6 lg:px-8">
            <p className="font-script text-4xl text-gold">You may also like</p>
            <h2 className="mt-2 font-display text-4xl font-light">{others.length === 1 ? d.others1 : d.othersN}</h2>
            <Ornament className="mx-auto mt-5 text-gold" />
            <div className="mt-12 flex flex-wrap justify-center gap-6">
              {others.map((o) => (
                <Link
                  key={o.slug}
                  href={localePath(lang, `/experiences/${o.slug}/`)}
                  className="group flex w-full max-w-lg items-center gap-6 bg-paper p-4 text-left ring-1 ring-line transition duration-500 hover:shadow-[0_30px_60px_-40px_rgba(16,25,45,0.5)] hover:ring-gold/40"
                >
                  <div className="overflow-hidden">
                    <Photo
                      src={o.image}
                      alt={o.name}
                      tone={o.tone}
                      art="cup"
                      className="size-28 shrink-0 transition-transform duration-[1.2s] group-hover:scale-110"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="font-display text-3xl leading-tight font-light group-hover:text-navy">{o.name}</p>
                    <p className="mt-1 text-sm text-muted">
                      {t.common.fromPrice(formatVnd(o.pricePerGuest, lang))} {t.common.perGuest}
                    </p>
                    <span className="mt-3 inline-flex items-center gap-2 text-[10px] tracking-[0.25em] text-navy uppercase">
                      {d.viewDetail}
                      <ArrowRight className="size-3 transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
