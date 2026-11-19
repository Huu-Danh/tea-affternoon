import Link from "next/link";
import { ArrowUpRight, CalendarDays, Clock } from "lucide-react";
import type { Experience } from "@/data/experiences";
import { formatDays, formatDuration, formatVnd } from "@/lib/format";
import { Photo } from "./photo";

const arts = ["stand", "cup", "pot", "cup"] as const;

export function ExperienceCard({ exp, index }: { exp: Experience; index: number }) {
  return (
    <Link
      href={`/experiences/${exp.slug}/`}
      className="group flex h-full flex-col overflow-hidden rounded-3xl border border-line bg-paper transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_50px_-25px_rgba(35,64,58,0.45)]"
    >
      <Photo
        src={exp.image}
        alt={exp.name}
        tone={exp.tone}
        art={arts[index % arts.length]}
        className="aspect-[4/3] transition duration-700 group-hover:scale-[1.02]"
      >
        {exp.badge && (
          <span className="absolute left-4 top-4 rounded-full bg-paper/90 px-3 py-1 text-[11px] font-medium uppercase tracking-wider text-forest backdrop-blur">
            {exp.badge}
          </span>
        )}
      </Photo>

      <div className="flex flex-1 flex-col p-6">
        <h3 className="font-display text-[28px] leading-tight text-ink">{exp.name}</h3>
        <p className="mt-2 text-sm leading-relaxed text-muted">{exp.tagline}</p>

        <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-xs text-muted">
          <span className="inline-flex items-center gap-1.5">
            <CalendarDays className="size-3.5 text-gold" />
            {formatDays(exp.daysOfWeek)}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Clock className="size-3.5 text-gold" />
            {formatDuration(exp.durationMinutes)}
          </span>
        </div>

        <div className="mt-auto flex items-end justify-between pt-6">
          <div>
            <p className="text-[11px] uppercase tracking-wider text-muted">Từ</p>
            <p className="font-display text-2xl text-forest">
              {formatVnd(exp.pricePerGuest)}
              <span className="ml-1 font-sans text-xs text-muted">/ khách</span>
            </p>
            {exp.pairPrice && (
              <p className="mt-1 text-xs text-gold">
                Combo 2 người: <span className="font-medium">{formatVnd(exp.pairPrice)}</span>
              </p>
            )}
          </div>
          <span className="flex size-11 items-center justify-center rounded-full border border-forest/30 text-forest transition group-hover:bg-forest group-hover:text-cream">
            <ArrowUpRight className="size-5" />
          </span>
        </div>
      </div>
    </Link>
  );
}
