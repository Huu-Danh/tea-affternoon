"use client";

import Link from "next/link";
import { useState, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { venue } from "@/data/venue";
import { langs, localePath, splitLocale, switchLocalePath } from "@/i18n/config";
import { useT } from "@/i18n/use-lang";
import { withBasePath } from "@/lib/base-path";
import { btn, cn } from "./ui";

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

/** Nút chuyển ngôn ngữ VI | EN (giữ nguyên trang đang xem) */
function LangSwitch({ light, className }: { light?: boolean; className?: string }) {
  const pathname = usePathname() ?? "/";
  const { lang, t } = useT();
  return (
    <div className={cn("flex items-center gap-1 text-[11px] font-medium tracking-[0.2em]", className)} aria-label={t.nav.language}>
      {langs.map((l, i) => (
        <span key={l} className="flex items-center gap-1">
          {i > 0 && <span className={light ? "text-cream/30" : "text-line"}>|</span>}
          <Link
            href={switchLocalePath(pathname, l)}
            hrefLang={l}
            lang={l}
            aria-current={l === lang ? "true" : undefined}
            className={cn(
              "px-1 py-1 uppercase transition",
              l === lang
                ? light
                  ? "text-gold-soft"
                  : "text-navy"
                : light
                  ? "text-cream/60 hover:text-cream"
                  : "text-muted hover:text-navy",
            )}
          >
            {l}
          </Link>
        </span>
      ))}
    </div>
  );
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname() ?? "/";
  const { lang, t } = useT();
  const scrolled = useScrolled();
  // Trang chủ: header trong suốt nằm trên hero cho tới khi cuộn xuống
  const overHero = splitLocale(pathname).path === "/" && !scrolled && !open;

  const nav = [
    { href: "/#experiences", label: t.nav.experiences },
    { href: "/#offers", label: t.nav.offers },
    { href: "/gift-voucher/", label: t.nav.gift },
    { href: "/private-events/", label: t.nav.events },
    { href: "/my-bookings/", label: t.nav.myBookings },
  ];

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
          href={localePath(lang, "/")}
          className="flex items-center gap-3 lg:gap-4"
          onClick={() => setOpen(false)}
          aria-label={`${venue.name} Afternoon Tea – ${t.nav.home}`}
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
            <span className={cn("mt-1 text-[9px] tracking-[0.34em] uppercase", overHero ? "text-gold-soft" : "text-gold")}>
              {venue.lounge}
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-6 xl:flex" aria-label={lang === "en" ? "Main" : "Chính"}>
          {nav.map((n) => (
            <Link
              key={n.href}
              href={localePath(lang, n.href)}
              className={cn(
                "group relative text-[13px] tracking-wide whitespace-nowrap transition",
                overHero ? "text-cream/85 hover:text-cream" : "text-ink/75 hover:text-navy",
              )}
            >
              {n.label}
              <span className="absolute -bottom-1.5 left-0 h-px w-full origin-left scale-x-0 bg-gold transition-transform duration-300 group-hover:scale-x-100" />
            </Link>
          ))}
          <LangSwitch light={overHero} />
          <Link href={localePath(lang, "/#experiences")} className={cn(overHero ? btn.light : btn.primary, "py-3 whitespace-nowrap")}>
            {t.nav.book}
          </Link>
        </nav>

        <div className="flex items-center gap-2 xl:hidden">
          <LangSwitch light={overHero} />
          <button
            type="button"
            className={cn("-mr-2 rounded-full p-2", overHero ? "text-cream" : "text-ink")}
            aria-label={open ? t.nav.closeMenu : t.nav.openMenu}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-line bg-cream px-4 pt-2 pb-6 xl:hidden" aria-label={lang === "en" ? "Mobile" : "Di động"}>
          {nav.map((n) => (
            <Link
              key={n.href}
              href={localePath(lang, n.href)}
              onClick={() => setOpen(false)}
              className="block border-b border-line/60 py-4 font-display text-2xl text-ink"
            >
              {n.label}
            </Link>
          ))}
          <Link href={localePath(lang, "/#experiences")} onClick={() => setOpen(false)} className={cn(btn.primary, "mt-6 w-full")}>
            {t.nav.bookNow}
          </Link>
        </nav>
      )}
    </header>
  );
}
