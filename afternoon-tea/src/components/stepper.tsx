"use client";

import { Minus, Plus } from "lucide-react";
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
  const b = cn(
    "flex items-center justify-center rounded-full border border-line text-ink transition hover:border-forest hover:text-forest disabled:opacity-30 disabled:hover:border-line disabled:hover:text-ink",
    size === "md" ? "size-10" : "size-8",
  );
  return (
    <div className="inline-flex items-center gap-3" role="group" aria-label={label}>
      <button type="button" className={b} onClick={() => onChange(value - 1)} disabled={value <= min} aria-label={`Giảm ${label}`}>
        <Minus className="size-4" />
      </button>
      <span className={cn("min-w-6 text-center tabular-nums", size === "md" ? "text-lg font-medium" : "text-sm")} aria-live="polite">
        {value}
      </span>
      <button type="button" className={b} onClick={() => onChange(value + 1)} disabled={value >= max} aria-label={`Tăng ${label}`}>
        <Plus className="size-4" />
      </button>
    </div>
  );
}
