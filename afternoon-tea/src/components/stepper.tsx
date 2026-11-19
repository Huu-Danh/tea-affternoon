"use client";

import { Minus, Plus } from "lucide-react";
import { useT } from "@/i18n/use-lang";
import { cn } from "./ui";

export function Stepper({
  value,
  min,
  max,
  onChange,
  label,
  size = "md",
}: {
  value: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
  label: string;
  size?: "sm" | "md";
}) {
  const { t } = useT();
  const b = cn(
    "flex items-center justify-center rounded-full border border-line text-ink transition hover:border-navy hover:text-navy disabled:opacity-30 disabled:hover:border-line disabled:hover:text-ink",
    size === "md" ? "size-10" : "size-8",
  );
  return (
    <div className="inline-flex items-center gap-3" role="group" aria-label={label}>
      <button type="button" className={b} onClick={() => onChange(value - 1)} disabled={value <= min} aria-label={t.stepper.dec(label)}>
        <Minus className="size-4" />
      </button>
      <span className={cn("min-w-6 text-center tabular-nums", size === "md" ? "text-lg font-medium" : "text-sm")} aria-live="polite">
        {value}
      </span>
      <button type="button" className={b} onClick={() => onChange(value + 1)} disabled={value >= max} aria-label={t.stepper.inc(label)}>
        <Plus className="size-4" />
      </button>
    </div>
  );
}
