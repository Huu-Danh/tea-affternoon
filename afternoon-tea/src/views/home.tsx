import Link from "next/link";
import { ArrowRight, Check, Clock, Gift, MapPin, Minus, PartyPopper, Shirt } from "lucide-react";
import { ExperienceCard } from "@/components/experience-card";
import { Gallery, type GalleryItem } from "@/components/gallery";
import { Illustration, Ornament, Photo } from "@/components/photo";
import { Reveal, RevealMask } from "@/components/reveal";
import { btn, cn, eyebrow } from "@/components/ui";
import { comparison, experiences } from "@/data/experiences";
import { venue } from "@/data/venue";
import { localePath, tr, type Lang } from "@/i18n/config";
import { dict } from "@/i18n/dict";
import { withBasePath } from "@/lib/base-path";
import { formatVnd } from "@/lib/format";
import { pairSaving } from "@/lib/pricing";

const offers = experiences.filter((e) => e.pairPrice && e.offerPoster);
const tierArts = ["stand", "cup", "pot"] as const;
const tierNums = ["I", "II", "III"];

/** Tiêu đề khu vực: chữ viết tay + tiêu đề serif + đường trang trí */
function SectionTitle({
  script,
  title,
  text,
  light,
  align = "center",
}: {
  script: string;
  title: string;
  text?: string;
  light?: boolean;
  align?: "center" | "left";
}) {
  return (
    <Reveal className={cn("max-w-2xl", align === "center" && "mx-auto text-center")}>
      <p className={cn("font-script text-4xl leading-none sm:text-5xl", light ? "text-gold-soft" : "text-gold")}>{script}</p>
      <h2
        className={cn(
          "mt-3 font-display text-4xl font-light tracking-tight text-balance sm:text-5xl",
          align === "center" && "lg:text-6xl",
        )}
      >
        {title}
      </h2>
      <Ornament className={cn("mt-6", align === "center" && "mx-auto", light ? "text-gold-soft/70" : "text-gold")} />
      {text && <p className={cn("mt-6 leading-relaxed", light ? "text-cream/70" : "text-muted")}>{text}</p>}
    </Reveal>
  );
}

export function HomeView({ lang }: { lang: Lang }) {
  const t = dict[lang];
  const h = t.home;
  const lp = (p: string) => localePath(lang, p);
  const fmt = (n: number) => formatVnd(n, lang);

  const gallery: GalleryItem[] = [
    { src: "/images/european-premium.webp", alt: h.galleryAlts[0], className: "col-span-2 row-span-2" },
    { src: "/images/european-classic.webp", alt: h.galleryAlts[1], className: "col-span-2" },
    { alt: h.galleryAlts[2], tone: "gold", art: "pot" },
    { alt: h.galleryAlts[3], tone: "navy", art: "cup" },
  ];

  return (
    <>
      {/* HERO: nằm dưới header trong suốt */}
      <section className="relative -mt-16 lg:-mt-20">
        <Photo
          alt={`${venue.lounge} Afternoon Tea`}
          tone="navy"
          art="stand"
          kenBurns
          className="h-svh min-h-[640px]"
          artClassName="h-[78%] w-auto opacity-[0.06]"
        >
          <div className="lattice absolute inset-0" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(10,16,30,0.75)_100%)]" />
          {/* Khung viền vàng mảnh, bắt đầu dưới header để không cắt qua logo */}
          <div className="pointer-events-none absolute inset-x-3 top-[4.5rem] bottom-3 border border-gold-soft/25 sm:inset-x-6 sm:bottom-6 lg:inset-x-8 lg:top-24 lg:bottom-8" />
          <div className="pointer-events-none absolute inset-x-4 top-[4.75rem] bottom-4 border border-gold-soft/10 sm:inset-x-7 sm:bottom-7 lg:inset-x-9 lg:top-[6.25rem] lg:bottom-9" />

          <div className="absolute inset-0 flex flex-col items-center justify-center px-6 pt-16 text-center text-cream">
            <p className={cn(eyebrow, "animate-fade-up text-gold-soft")} style={{ animationDelay: "0.2s" }}>
              {venue.name} · {venue.lounge}
            </p>
            <p
              className="mt-6 animate-fade-up font-script text-6xl leading-none text-gold-soft sm:text-8xl lg:text-[9.5rem]"
              style={{ animationDelay: "0.35s" }}
            >
              Afternoon Tea
            </p>
            <h1
              className="mt-4 animate-fade-up font-display text-3xl font-light tracking-wide text-balance sm:text-4xl lg:text-5xl"
              style={{ animationDelay: "0.5s" }}
            >
              {tr(venue.tagline, lang)}
            </h1>
            <Ornament className="mt-7 animate-fade-up text-gold-soft/70" />
            <p
              className="mt-7 max-w-2xl animate-fade-up text-sm leading-relaxed text-balance text-cream/75 sm:text-base"
              style={{ animationDelay: "0.65s" }}
            >
              {h.heroDesc}
            </p>
            <div className="mt-10 flex animate-fade-up flex-wrap justify-center gap-3" style={{ animationDelay: "0.8s" }}>
              <Link href={lp("/#experiences")} className={btn.gold}>
                {h.heroCta}
              </Link>
              <Link href={lp("/#offers")} className={btn.light}>
                {h.heroOffers}
              </Link>
            </div>
          </div>

          <a
            href="#info"
            className="absolute bottom-10 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-3 text-[10px] tracking-[0.3em] text-cream/60 uppercase transition hover:text-cream sm:flex"
          >
            {h.explore}
            <span className="relative h-12 w-px overflow-hidden bg-cream/20">
              <span className="absolute inset-x-0 top-0 h-1/2 animate-[scroll-cue_2.2s_ease-in-out_infinite] bg-gold-soft" />
            </span>
          </a>
        </Photo>
      </section>

      {/* INFO STRIP */}
      <section id="info" className="border-b border-line bg-paper">
        <div className="mx-auto grid max-w-6xl divide-y divide-line px-4 sm:grid-cols-3 sm:divide-x sm:divide-y-0 sm:px-6 lg:px-8">
          {[
            { icon: Clock, label: h.infoHours, value: tr(venue.hours, lang) },
            { icon: MapPin, label: h.infoPlace, value: venue.lounge },
            { icon: Shirt, label: h.infoDress, value: tr(venue.dressCode, lang) },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex flex-col items-center gap-2 py-8 text-center">
              <Icon className="size-4 text-gold" strokeWidth={1.5} />
              <p className="text-[10px] tracking-[0.3em] text-muted uppercase">{label}</p>
              <p className="font-display text-2xl">{value}</p>
            </div>
          ))}
        </div>
      </section>

      {/* EXPERIENCES */}
      <section id="experiences" className="mx-auto max-w-7xl px-4 py-28 sm:px-6 lg:px-8 lg:py-36">
        <SectionTitle script="Our Experiences" title={h.expTitle} text={h.expText(venue.lounge)} />
        <div className="mt-16 flex flex-wrap justify-center gap-8">
          {experiences.map((exp, i) => (
            <Reveal key={exp.slug} delay={i * 0.12} className="w-full sm:w-[27rem]">
              <ExperienceCard exp={exp} index={i} lang={lang} />
            </Reveal>
          ))}
        </div>

        {experiences.length > 1 && (
          <Reveal className="mx-auto mt-24 max-w-4xl">
            <h3 className="text-center font-display text-3xl font-light sm:text-4xl">{h.compareTitle}</h3>
            <Ornament className="mx-auto mt-5 text-gold" />
            <div className="mt-10 overflow-hidden rounded-sm border border-line bg-paper">
              <table className="w-full table-fixed text-left text-sm">
                <caption className="sr-only">{h.compareCaption}</caption>
                <thead>
                  <tr className="border-b border-line bg-sand/40">
                    <th scope="col" className="w-[34%] p-4 sm:p-6">
                      <span className="sr-only">{h.compareItem}</span>
                    </th>
                    {experiences.map((e) => (
                      <th key={e.slug} scope="col" className="p-4 align-bottom font-normal sm:p-6">
                        <Link href={lp(`/experiences/${e.slug}/`)} className="font-display text-xl leading-tight hover:text-navy sm:text-2xl">
                          {e.name}
                        </Link>
                        <p className="mt-1 font-display text-lg text-navy sm:text-xl">{fmt(e.pricePerGuest)}</p>
                        <p className="text-xs text-muted">{t.common.eachGuest}</p>
                        {e.pairPrice && <p className="mt-2 text-xs text-gold">{t.common.pairComboShort(fmt(e.pairPrice))}</p>}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {comparison.map((row) => (
                    <tr key={row.label.vi} className="border-b border-line/70 last:border-0">
                      <th scope="row" className="p-4 font-medium sm:px-6">
                        {tr(row.label, lang)}
                      </th>
                      {experiences.map((e) => {
                        const v = row.values[e.slug];
                        let cell: React.ReactNode;
                        if (v === true) cell = <Check className="size-5 text-gold" aria-label={h.yes} />;
                        else if (v === false || v === undefined) cell = <Minus className="size-5 text-ink/20" aria-label={h.no} />;
                        else cell = tr(v, lang);
                        return (
                          <td key={e.slug} className="p-4 text-ink/80 sm:px-6">
                            {cell}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Reveal>
        )}
      </section>

      {/* OFFERS */}
      {offers.length > 0 && (
        <section id="offers" className="lattice relative bg-navy text-cream">
          <div className="mx-auto max-w-7xl px-4 py-28 sm:px-6 lg:px-8 lg:py-36">
            <SectionTitle light script="Special Offers" title={h.offersTitle} text={h.offersText(venue.lounge)} />
            <div className="mt-20 grid gap-14 md:grid-cols-2 lg:gap-20">
              {offers.map((e, i) => (
                <div key={e.slug} className="flex flex-col">
                  <RevealMask delay={i * 0.15} className="mx-auto w-full max-w-md">
                    <Link
                      href={lp(`/experiences/${e.slug}/`)}
                      className="group relative block overflow-hidden rounded-sm shadow-[0_40px_80px_-40px_rgba(0,0,0,0.8)]"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={withBasePath(e.offerPoster!)}
                        alt={h.posterAlt(e.name, fmt(e.pricePerGuest), fmt(e.pairPrice!), venue.lounge, venue.name)}
                        className="aspect-3/4 w-full object-cover transition duration-[1.4s] ease-out group-hover:scale-[1.03]"
                        loading="lazy"
                      />
                      <span className="pointer-events-none absolute inset-3 border border-gold-soft/30" />
                    </Link>
                  </RevealMask>
                  <Reveal delay={0.2 + i * 0.15} className="mx-auto mt-10 w-full max-w-md text-center">
                    <p className="font-display text-3xl font-light">{e.name}</p>
                    <p className="mt-3 flex flex-wrap items-baseline justify-center gap-x-3">
                      <span className="font-display text-4xl text-gold-soft">{fmt(e.pairPrice!)}</span>
                      <span className="text-sm text-cream/60">{h.perTwo}</span>
                    </p>
                    <p className="mt-2 text-sm text-cream/50">
                      <span className="line-through">{fmt(e.pricePerGuest * 2)}</span>
                      <span className="mx-2">·</span>
                      <span className="text-gold-soft">{t.common.save(fmt(pairSaving(e)))}</span>
                    </p>
                    <Link href={lp(`/experiences/${e.slug}/`)} className={cn(btn.light, "mt-7")}>
                      {h.bookCombo}
                    </Link>
                  </Reveal>
                </div>
              ))}
            </div>
            <p className="mt-16 text-center text-xs text-cream/35">{t.common.illustrative}</p>
          </div>
        </section>
      )}

      {/* STORY */}
      <section className="bg-sand/50">
        <div className="mx-auto grid max-w-7xl items-center gap-16 px-4 py-28 sm:px-6 lg:grid-cols-2 lg:gap-24 lg:px-8 lg:py-36">
          <div className="relative">
            <div className="absolute -inset-4 translate-x-6 translate-y-6 border border-gold/40 sm:-inset-5" aria-hidden />
            <RevealMask className="relative overflow-hidden rounded-xs">
              <Photo src="/images/european-premium.webp" alt={h.storyAlt} kenBurns className="aspect-[4/3]" />
            </RevealMask>
          </div>
          <div>
            <SectionTitle align="left" script="Our Story" title={h.storyTitle(venue.name)} />
            <Reveal delay={0.15} className="mt-8 space-y-4 leading-relaxed text-muted">
              <p>{h.storyP1(venue.name, venue.lounge)}</p>
              <p>{h.storyP2}</p>
            </Reveal>
            <Reveal delay={0.25}>
              <dl className="mt-12 grid grid-cols-3 gap-6 border-t border-gold/30 pt-8">
                {h.stats.map(([n, l]) => (
                  <div key={l}>
                    <dt className="font-display text-4xl font-light text-navy sm:text-5xl">{n}</dt>
                    <dd className="mt-2 text-[10px] tracking-[0.25em] text-muted uppercase">{l}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>
        </div>
      </section>

      {/* MENU */}
      <section id="menu" className="lattice bg-navy text-cream">
        <div className="mx-auto max-w-7xl px-4 py-28 sm:px-6 lg:px-8 lg:py-36">
          <SectionTitle light script="The Menu" title={h.menuTitle} />
          <div className="mt-20 grid gap-12 md:grid-cols-3 md:gap-0 md:divide-x md:divide-gold-soft/15">
            {h.tiers.map((tier, i) => (
              <Reveal key={tier.title} delay={i * 0.12} className="flex flex-col items-center px-8 text-center lg:px-12">
                <Illustration art={tierArts[i]} className="size-20 text-gold-soft/80" />
                <p className="mt-8 font-display text-2xl text-gold-soft italic">{tierNums[i]}</p>
                <h3 className="mt-2 font-display text-4xl font-light">{tier.title}</h3>
                <p className="mt-5 max-w-xs leading-relaxed text-cream/65">{tier.text}</p>
              </Reveal>
            ))}
          </div>
          <div className="mt-20 text-center">
            <Link href={lp(`/experiences/${experiences[0].slug}/`)} className={btn.light}>
              {h.fullMenu}
            </Link>
          </div>
        </div>
      </section>

      {/* GALLERY */}
      <section id="gallery" className="mx-auto max-w-7xl px-4 py-28 sm:px-6 lg:px-8 lg:py-36">
        <SectionTitle script="The Lounge" title={venue.lounge} text={h.galleryText} />
        <Gallery items={gallery} />
      </section>

      {/* GIFTS & EVENTS */}
      <section className="border-t border-line bg-sand/50">
        <div className="mx-auto max-w-7xl px-4 py-28 sm:px-6 lg:px-8 lg:py-32">
          <SectionTitle script="Gifts & Celebrations" title={h.moreTitle} />
          <div className="mt-16 grid gap-6 md:grid-cols-2">
            {[
              { icon: Gift, title: h.giftCardTitle, text: h.giftCardText, cta: h.giftCardCta, href: "/gift-voucher/", dark: true },
              { icon: PartyPopper, title: h.eventsCardTitle, text: h.eventsCardText, cta: h.eventsCardCta, href: "/private-events/", dark: false },
            ].map((c, i) => (
              <Reveal key={c.href} delay={i * 0.12}>
                <Link
                  href={lp(c.href)}
                  className={cn(
                    "group relative flex h-full flex-col items-center px-8 py-14 text-center transition duration-500 sm:px-14",
                    c.dark ? "lattice bg-navy text-cream" : "bg-paper ring-1 ring-line hover:ring-gold/40",
                  )}
                >
                  <span className={cn("pointer-events-none absolute inset-3 border", c.dark ? "border-gold-soft/25" : "border-gold/30")} />
                  <c.icon className={cn("size-8", c.dark ? "text-gold-soft" : "text-gold")} strokeWidth={1.2} />
                  <h3 className="mt-6 font-display text-4xl font-light">{c.title}</h3>
                  <p className={cn("mt-4 max-w-sm leading-relaxed", c.dark ? "text-cream/70" : "text-muted")}>{c.text}</p>
                  <span
                    className={cn(
                      "mt-8 inline-flex items-center gap-2 text-[11px] font-medium tracking-[0.25em] uppercase",
                      c.dark ? "text-gold-soft" : "text-navy",
                    )}
                  >
                    {c.cta}
                    <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="border-t border-line bg-paper">
        <div className="mx-auto grid max-w-6xl gap-14 px-4 py-28 sm:px-6 lg:grid-cols-[1fr_1.6fr] lg:px-8 lg:py-36">
          <div>
            <SectionTitle align="left" script="Good to Know" title={h.faqTitle} />
            <Reveal delay={0.1}>
              <p className="mt-8 text-muted">
                {h.faqHelp}{" "}
                <a href={`tel:${venue.phone.replace(/\s/g, "")}`} className="text-navy underline decoration-gold underline-offset-4">
                  {venue.phone}
                </a>
              </p>
            </Reveal>
          </div>
          <Reveal delay={0.1} className="divide-y divide-line border-y border-line">
            {h.faqs.map((f) => (
              <details key={f.q} className="group py-7">
                <summary className="flex cursor-pointer items-center justify-between gap-6 font-display text-2xl font-light transition hover:text-navy">
                  {f.q}
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-full border border-gold/50 text-lg text-gold transition duration-300 group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-4 max-w-2xl leading-relaxed text-muted">{f.a}</p>
              </details>
            ))}
          </Reveal>
        </div>
      </section>

      {/* CTA */}
      <section className="lattice relative overflow-hidden bg-navy-dark text-cream">
        <div className="pointer-events-none absolute inset-6 border border-gold-soft/15 lg:inset-10" aria-hidden />
        <div className="relative mx-auto flex max-w-3xl flex-col items-center px-6 py-28 text-center lg:py-36">
          <Reveal>
            <p className="font-script text-5xl text-gold-soft sm:text-6xl">An Afternoon to Remember</p>
            <h2 className="mt-4 font-display text-4xl font-light sm:text-5xl">{h.ctaTitle}</h2>
            <Ornament className="mx-auto mt-7 text-gold-soft/70" />
            <Link href={lp("/#experiences")} className={cn(btn.gold, "mt-10")}>
              {t.nav.bookNow}
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
