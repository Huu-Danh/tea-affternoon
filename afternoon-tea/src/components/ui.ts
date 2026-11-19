import clsx, { type ClassValue } from "clsx";

export const cn = (...v: ClassValue[]) => clsx(v);

// Nút kiểu khách sạn cao cấp: góc vuông nhẹ, chữ in hoa giãn rộng
const btnBase =
  "inline-flex items-center justify-center gap-2.5 rounded-xs px-7 py-3.5 text-[12px] font-medium uppercase tracking-[0.18em] transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold disabled:cursor-not-allowed disabled:opacity-40";

export const btn = {
  primary: cn(btnBase, "bg-navy text-cream hover:bg-navy-dark hover:shadow-[0_12px_30px_-12px_rgba(16,25,45,0.6)]"),
  gold: cn(btnBase, "bg-gold text-paper hover:bg-[#9b7c4a] hover:shadow-[0_12px_30px_-12px_rgba(173,141,88,0.7)]"),
  outline: cn(btnBase, "border border-ink/25 text-ink hover:border-navy hover:bg-navy hover:text-cream"),
  light: cn(btnBase, "border border-cream/40 text-cream hover:border-gold-soft hover:bg-cream/10"),
  ghost: cn(btnBase, "px-3 text-ink hover:text-navy"),
};

export const eyebrow = "text-[11px] font-medium uppercase tracking-[0.32em] text-gold";

export const input =
  "w-full rounded-xs border border-line bg-paper px-4 py-3 text-[15px] text-ink placeholder:text-muted/60 outline-none transition focus:border-navy focus:ring-2 focus:ring-navy/15 aria-[invalid=true]:border-danger";
