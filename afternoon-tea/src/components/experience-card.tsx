import Link from "next/link";
import { ArrowRight, CalendarDays, Clock } from "lucide-react";
import type { Experience } from "@/data/experiences";
import { localePath, tr, type Lang } from "@/i18n/config";
import { dict } from "@/i18n/dict";
import { formatDays, formatDuration, formatVnd } from "@/lib/format";
import { Photo } from "./photo";

const arts = ["stand", "cup", "pot", "cup"] as const;

export function ExperienceCard({ exp, index, lang }: { exp: Experience; index: number; lang: Lang }) {
  const t = dict[lang];
  return (
    <Link
      href={localePath(lang, `/experiences/${exp.slug}/`)}
      className="group flex h-full flex-col bg-paper shadow-[0_1px_0_rgba(16,25,45,0.04)] ring-1 ring-line transition duration-500 hover:shadow-[0_40px_80px_-40px_rgba(16,25,45,0.45)] hover:ring-gold/40"
    >
      <div className="relative overflow-hidden">
        <Photo
          src={exp.image}
          alt={exp.name}
          tone={exp.tone}
          art={arts[index % arts.length]}
          className="aspect-[4/3] transition-transform duration-[1.4s] ease-out group-hover:scale-105"
        />
        <span className="pointer-events-none absolute inset-3 border border-paper/40 opacity-0 transition duration-500 group-hover:opacity-100" />
        {exp.badge && (
          <span className="absolute top-5 left-5 bg-navy/90 px-3 py-1.5 text-[10px] font-medium tracking-[0.25em] text-gold-soft uppercase backdrop-blur">
            {exp.badge}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col px-7 pt-7 pb-8 text-center">
        <h3 className="font-display text-[32px] leading-tight font-light text-ink">{exp.name}</h3>
        <p className="mt-2 text-sm leading-relaxed text-muted">{tr(exp.tagline, lang)}</p>

        <div className="mt-5 flex justify-center gap-x-5 text-[11px] tracking-wider text-muted uppercase">
          <span className="inline-flex items-center gap-1.5">
            <CalendarDays className="size-3.5 text-gold" strokeWidth={1.5} />
            {formatDays(exp.daysOfWeek, lang)}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Clock className="size-3.5 text-gold" strokeWidth={1.5} />
            {formatDuration(exp.durationMinutes, lang)}
          </span>
        </div>

        <div className="mx-auto mt-6 h-px w-16 bg-gold/50" />

        <div className="mt-6">
          <p className="font-display text-3xl text-navy">
            {formatVnd(exp.pricePerGuest, lang)}
            <span className="ml-1.5 font-sans text-xs text-muted">{t.common.perGuest}</span>
          </p>
          {exp.pairPrice && (
            <p className="mt-1.5 text-xs text-gold">
              {t.common.pairComboShort(formatVnd(exp.pairPrice, lang))}
            </p>
          )}
        </div>

        <span className="mt-auto inline-flex items-center justify-center gap-2 pt-7 text-[11px] font-medium tracking-[0.25em] text-navy uppercase">
          {lang === "en" ? "Explore & book" : "Khám phá & đặt chỗ"}
          <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}
