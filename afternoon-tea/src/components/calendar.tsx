"use client";

import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameMonth,
  isToday,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import { vi } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { toIsoDate } from "@/lib/availability";
import { cn } from "./ui";

const weekdays = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];

export function Calendar({
  month,
  onMonthChange,
  minMonth,
  maxMonth,
  selected,
  onSelect,
  isAvailable,
}: {
  month: Date;
  onMonthChange: (m: Date) => void;
  minMonth: Date;
  maxMonth: Date;
  selected: string | null;
  onSelect: (iso: string) => void;
  isAvailable: (d: Date) => boolean;
}) {
  const days = eachDayOfInterval({
    start: startOfWeek(startOfMonth(month), { weekStartsOn: 1 }),
    end: endOfWeek(endOfMonth(month), { weekStartsOn: 1 }),
  });
  const canPrev = month > minMonth;
  const canNext = month < maxMonth;
  const title = format(month, "LLLL yyyy", { locale: vi });

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <button
          type="button"
          onClick={() => onMonthChange(addMonths(month, -1))}
          disabled={!canPrev}
          className="rounded-full p-2 text-ink transition hover:bg-ink/5 disabled:opacity-25"
          aria-label="Tháng trước"
        >
          <ChevronLeft className="size-4" />
        </button>
        <p className="font-display text-xl capitalize" aria-live="polite">
          {title}
        </p>
        <button
          type="button"
          onClick={() => onMonthChange(addMonths(month, 1))}
          disabled={!canNext}
          className="rounded-full p-2 text-ink transition hover:bg-ink/5 disabled:opacity-25"
          aria-label="Tháng sau"
        >
          <ChevronRight className="size-4" />
        </button>
      </div>

      <div className="grid grid-cols-7 text-center text-[11px] font-medium uppercase tracking-wider text-muted">
        {weekdays.map((w) => (
          <div key={w} className="pb-2">
            {w}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1" role="grid">
        {days.map((d) => {
          const iso = toIsoDate(d);
          const inMonth = isSameMonth(d, month);
          const available = inMonth && isAvailable(d);
          const isSel = selected === iso;
          return (
            <button
              key={iso}
              type="button"
              disabled={!available}
              onClick={() => onSelect(iso)}
              aria-pressed={isSel}
              aria-label={format(d, "EEEE dd/MM/yyyy", { locale: vi })}
              className={cn(
                "relative aspect-square rounded-full text-sm tabular-nums transition",
                !inMonth && "invisible",
                isSel && "bg-navy font-medium text-cream",
                !isSel && available && "text-ink hover:bg-navy/10",
                !isSel && !available && "cursor-not-allowed text-ink/25 line-through decoration-ink/15",
                isToday(d) && !isSel && "font-semibold",
              )}
            >
              {format(d, "d")}
              {isToday(d) && (
                <span className={cn("absolute bottom-1 left-1/2 size-1 -translate-x-1/2 rounded-full", isSel ? "bg-cream" : "bg-gold")} />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
