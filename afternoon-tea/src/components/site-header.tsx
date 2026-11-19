"use client";

import Link from "next/link";
import { useState, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { venue } from "@/data/venue";
import { withBasePath } from "@/lib/base-path";
import { btn, cn } from "./ui";

const nav = [
  { href: "/#experiences", label: "Trải nghiệm" },
  { href: "/#offers", label: "Ưu đãi" },
  { href: "/#menu", label: "Thực đơn" },
  { href: "/#gallery", label: "Không gian" },
  { href: "/#faq", label: "Hỏi đáp" },
  { href: "/my-bookings/", label: "Đặt chỗ của tôi" },
];

const subscribeScroll = (cb: () => void) => {
  window.addEventListener("scroll", cb, { passive: true });
  return () => window.removeEventListener("scroll", cb);
};

/** true khi đã cuộn khỏi đầu trang */
function useScrolled(threshold = 40) {
  return useSyncExternalStore(
    subscribeScroll,
    () => window.scrollY > threshold,
    () => false,
  );
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const scrolled = useScrolled();
  // Trang chủ: header trong suốt nằm trên hero cho tới khi cuộn xuống
  const overHero = pathname === "/" && !scrolled && !open;

  return (
    <header
      className={cn(
        "sticky top-0 z-40 transition-[background-color,border-color,box-shadow] duration-500",
        overHero
          ? "border-b border-transparent bg-transparent"
          : "border-b border-line/70 bg-cream/90 shadow-[0_10px_30px_-20px_rgba(16,25,45,0.25)] backdrop-blur-md",
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:h-20 lg:px-8">
        <Link
          href="/"
          className="flex items-center gap-3 lg:gap-4"
          onClick={() => setOpen(false)}
          aria-label={`${venue.name} Afternoon Tea – Trang chủ`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={withBasePath(overHero ? "/logo-white.webp" : "/logo.webp")}
            alt={venue.name}
            width={306}
            height={214}
            className="h-10 w-auto lg:h-12"
          />
          <span className={cn("h-8 w-px lg:h-10", overHero ? "bg-cream/30" : "bg-line")} aria-hidden />
          <span className="flex flex-col leading-none">
            <span className={cn("font-script text-[26px] leading-none lg:text-[30px]", overHero ? "text-cream" : "text-navy")}>
              Afternoon Tea
            </span>
            <span className={cn("mt-1 text-[9px] uppercase tracking-[0.34em]", overHero ? "text-gold-soft" : "text-gold")}>
              {venue.lounge}
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-7 xl:flex" aria-label="Chính">
          {nav.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className={cn(
                "group relative whitespace-nowrap text-[13px] tracking-wide transition",
                overHero ? "text-cream/85 hover:text-cream" : "text-ink/75 hover:text-navy",
              )}
            >
              {n.label}
              <span className="absolute -bottom-1.5 left-0 h-px w-full origin-left scale-x-0 bg-gold transition-transform duration-300 group-hover:scale-x-100" />
            </Link>
          ))}
          <Link href="/#experiences" className={cn(overHero ? btn.light : btn.primary, "py-3 whitespace-nowrap")}>
            Đặt chỗ
          </Link>
        </nav>

        <button
          type="button"
          className={cn("-mr-2 rounded-full p-2 xl:hidden", overHero ? "text-cream" : "text-ink")}
          aria-label={open ? "Đóng menu" : "Mở menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </div>

      {open && (
        <nav className="border-t border-line bg-cream px-4 pt-2 pb-6 xl:hidden" aria-label="Di động">
          {nav.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              onClick={() => setOpen(false)}
              className="block border-b border-line/60 py-4 font-display text-2xl text-ink"
            >
              {n.label}
            </Link>
          ))}
          <Link href="/#experiences" onClick={() => setOpen(false)} className={cn(btn.primary, "mt-6 w-full")}>
            Đặt chỗ ngay
          </Link>
        </nav>
      )}
    </header>
  );
}
