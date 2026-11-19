"use client";

import Link from "next/link";
import { useState } from "react";
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

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-line/70 bg-cream/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:h-20 lg:px-8">
        <Link href="/" className="flex items-center gap-3 lg:gap-4" onClick={() => setOpen(false)} aria-label={`${venue.name} Afternoon Tea – Trang chủ`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={withBasePath("/logo.png")} alt={venue.name} width={306} height={214} className="h-10 w-auto lg:h-12" />
          <span className="h-8 w-px bg-line lg:h-10" aria-hidden />
          <span className="flex flex-col leading-none">
            <span className="font-display text-xl font-medium text-forest lg:text-2xl">Afternoon Tea</span>
            <span className="mt-1 text-[10px] uppercase tracking-[0.28em] text-gold">{venue.lounge}</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-7 xl:flex" aria-label="Chính">
          {nav.map((n) => (
            <Link key={n.href} href={n.href} className="whitespace-nowrap text-sm text-ink/80 transition hover:text-forest">
              {n.label}
            </Link>
          ))}
          <Link href="/#experiences" className={cn(btn.primary, "whitespace-nowrap py-2.5")}>
            Đặt chỗ
          </Link>
        </nav>

        <button
          type="button"
          className="-mr-2 rounded-full p-2 text-ink xl:hidden"
          aria-label={open ? "Đóng menu" : "Mở menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </div>

      {open && (
        <nav className="border-t border-line bg-cream px-4 pb-6 pt-2 xl:hidden" aria-label="Di động">
          {nav.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              onClick={() => setOpen(false)}
              className="block border-b border-line/60 py-4 font-display text-xl text-ink"
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
