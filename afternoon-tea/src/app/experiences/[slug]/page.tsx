import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarDays, Check, Clock, Users } from "lucide-react";
import { BookingWidget } from "@/components/booking-widget";
import { Photo } from "@/components/photo";
import { btn, cn, eyebrow } from "@/components/ui";
import { experiences, getExperience } from "@/data/experiences";
import { formatDays, formatDuration, formatVnd } from "@/lib/format";

export const dynamicParams = false;

export function generateStaticParams() {
  return experiences.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({ params }: PageProps<"/experiences/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const exp = getExperience(slug);
  if (!exp) return {};
  return { title: exp.name, description: exp.tagline };
}

export default async function ExperiencePage({ params }: PageProps<"/experiences/[slug]">) {
  const { slug } = await params;
  const exp = getExperience(slug);
  if (!exp) notFound();

  const others = experiences.filter((e) => e.slug !== exp.slug).slice(0, 3);

  return (
    <>
      <section className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
        <Link href="/#experiences" className="inline-flex items-center gap-2 text-sm text-muted hover:text-forest">
          <ArrowLeft className="size-4" />
          Tất cả trải nghiệm
        </Link>
        <Photo
          src={exp.image}
          alt={exp.name}
          tone={exp.tone}
          art="stand"
          className="mt-6 aspect-[16/9] rounded-[2rem] sm:aspect-[21/8]"
        >
          {exp.badge && (
            <span className="absolute left-6 top-6 rounded-full bg-paper/90 px-4 py-1.5 text-xs font-medium uppercase tracking-wider text-forest">
              {exp.badge}
            </span>
          )}
        </Photo>
      </section>

      <section className="mx-auto grid max-w-7xl gap-12 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_420px] lg:gap-16 lg:px-8 lg:py-16">
        <div className="min-w-0">
          <p className={eyebrow}>Afternoon Tea</p>
          <h1 className="mt-3 font-display text-5xl leading-tight sm:text-6xl">{exp.name}</h1>
          <p className="mt-3 text-lg text-muted">{exp.tagline}</p>

          <div className="mt-8 flex flex-wrap gap-3">
            {[
              { icon: CalendarDays, text: formatDays(exp.daysOfWeek) },
              { icon: Clock, text: `${exp.timeSlots[0]} – ${exp.timeSlots.at(-1)} · ${formatDuration(exp.durationMinutes)}` },
              { icon: Users, text: `${exp.minPax} – ${exp.maxPax} khách` },
            ].map(({ icon: Icon, text }) => (
              <span key={text} className="inline-flex items-center gap-2 rounded-full border border-line bg-paper px-4 py-2 text-sm">
                <Icon className="size-4 text-gold" />
                {text}
              </span>
            ))}
          </div>

          <p className="mt-10 text-[17px] leading-relaxed text-ink/85">{exp.description}</p>

          <ul className="mt-8 space-y-3">
            {exp.highlights.map((h) => (
              <li key={h} className="flex gap-3">
                <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-forest/10 text-forest">
                  <Check className="size-3" />
                </span>
                {h}
              </li>
            ))}
          </ul>

          <div className="mt-16">
            <h2 className="font-display text-4xl">Thực đơn</h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2">
              {exp.menu.map((sec) => (
                <div key={sec.title} className="rounded-3xl border border-line bg-paper p-7">
                  <h3 className="font-display text-2xl text-forest">{sec.title}</h3>
                  <ul className="mt-4 space-y-2.5 text-[15px] text-ink/80">
                    {sec.items.map((it) => (
                      <li key={it} className="flex gap-3">
                        <span className="mt-2.5 h-px w-3 shrink-0 bg-gold" />
                        {it}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <p className="mt-4 text-xs text-muted">Thực đơn có thể thay đổi theo mùa.</p>
          </div>

          <div className="mt-16">
            <h2 className="font-display text-4xl">Điều khoản</h2>
            <ul className="mt-6 space-y-3 text-[15px] text-muted">
              {exp.terms.map((t) => (
                <li key={t} className="flex gap-3">
                  <span className="mt-2 size-1.5 shrink-0 rounded-full bg-gold" />
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="lg:sticky lg:top-28 lg:self-start">
          <BookingWidget exp={exp} />
        </div>
      </section>

      {/* Thanh đặt chỗ cố định trên mobile */}
      <div className="sticky bottom-0 z-30 border-t border-line bg-paper/95 px-4 py-3 backdrop-blur lg:hidden">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="font-display text-2xl leading-none text-forest">{formatVnd(exp.pricePerGuest)}</p>
            <p className="text-xs text-muted">mỗi khách</p>
          </div>
          <a href="#book" className={cn(btn.primary, "px-8")}>
            Chọn ngày & giờ
          </a>
        </div>
      </div>

      <section className="border-t border-line bg-sand/50">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <h2 className="font-display text-4xl">Có thể bạn cũng thích</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {others.map((o) => (
              <Link
                key={o.slug}
                href={`/experiences/${o.slug}/`}
                className="group flex items-center gap-5 rounded-3xl border border-line bg-paper p-4 transition hover:shadow-md"
              >
                <Photo src={o.image} alt={o.name} tone={o.tone} art="cup" className="size-24 shrink-0 rounded-2xl" />
                <div>
                  <p className="font-display text-2xl leading-tight group-hover:text-forest">{o.name}</p>
                  <p className="mt-1 text-sm text-muted">từ {formatVnd(o.pricePerGuest)}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
