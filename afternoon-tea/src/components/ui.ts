import clsx, { type ClassValue } from "clsx";

export const cn = (...v: ClassValue[]) => clsx(v);

const btnBase =
  "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-medium tracking-wide transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold disabled:cursor-not-allowed disabled:opacity-40";

export const btn = {
  primary: cn(btnBase, "bg-forest text-cream hover:bg-forest-dark shadow-sm hover:shadow-md"),
  gold: cn(btnBase, "bg-gold text-paper hover:brightness-95 shadow-sm"),
  outline: cn(btnBase, "border border-ink/20 text-ink hover:border-ink/50 hover:bg-ink/5"),
  light: cn(btnBase, "border border-cream/50 text-cream hover:bg-cream/10"),
  ghost: cn(btnBase, "px-3 text-ink hover:bg-ink/5"),
};

export const eyebrow = "text-[11px] font-medium uppercase tracking-[0.28em] text-gold";

export const input =
  "w-full rounded-xl border border-line bg-paper px-4 py-3 text-[15px] text-ink placeholder:text-muted/60 outline-none transition focus:border-forest focus:ring-2 focus:ring-forest/15 aria-[invalid=true]:border-danger";
