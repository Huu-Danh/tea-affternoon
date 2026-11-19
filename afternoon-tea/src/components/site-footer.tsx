"use client";

import Link from "next/link";
import { venue } from "@/data/venue";
import { localePath, tr } from "@/i18n/config";
import { useT } from "@/i18n/use-lang";
import { withBasePath } from "@/lib/base-path";
import { Ornament } from "./photo";

export function SiteFooter() {
  const { lang, t } = useT();
  const links = [
    { href: "/#experiences", label: t.nav.experiences },
    { href: "/gift-voucher/", label: t.nav.gift },
    { href: "/private-events/", label: t.nav.events },
    { href: "/#faq", label: t.footer.faq },
    { href: "/my-bookings/", label: t.nav.myBookings },
  ];
  return (
    <footer className="lattice bg-navy-dark text-cream/75">
      <div className="mx-auto max-w-7xl px-4 pt-20 pb-12 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={withBasePath("/logo-white.webp")} alt={venue.name} width={306} height={214} className="h-16 w-auto" />
          <p className="mt-5 font-script text-4xl text-gold-soft">Afternoon Tea</p>
          <p className="mt-1 text-[10px] tracking-[0.4em] text-cream/50 uppercase">{venue.lounge}</p>
          <Ornament className="mt-6 text-gold-soft/50" />
        </div>

        <div className="mt-14 grid gap-10 text-center text-sm md:grid-cols-3">
          <div>
            <p className="text-[10px] tracking-[0.3em] text-gold-soft uppercase">{t.footer.address}</p>
            <p className="mt-3 leading-relaxed">{tr(venue.address, lang)}</p>
          </div>
          <div>
            <p className="text-[10px] tracking-[0.3em] text-gold-soft uppercase">{t.footer.hours}</p>
            <p className="mt-3">{tr(venue.hours, lang)}</p>
          </div>
          <div>
            <p className="text-[10px] tracking-[0.3em] text-gold-soft uppercase">{t.footer.contact}</p>
            <p className="mt-3">
              <a href={`tel:${venue.phone.replace(/\s/g, "")}`} className="transition hover:text-gold-soft">
                {venue.phone}
              </a>
            </p>
            <p className="mt-1">
              <a href={`mailto:${venue.email}`} className="transition hover:text-gold-soft">
                {venue.email}
              </a>
            </p>
          </div>
        </div>

        <nav className="mt-12 flex flex-wrap justify-center gap-x-8 gap-y-3 text-[11px] tracking-[0.2em] uppercase" aria-label="Footer">
          {links.map((l) => (
            <Link key={l.href} href={localePath(lang, l.href)} className="text-cream/60 transition hover:text-gold-soft">
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="mt-12 text-center">
          <Link
            href={localePath(lang, "/#experiences")}
            className="inline-flex border border-gold-soft/40 px-8 py-3.5 text-[11px] tracking-[0.25em] text-cream uppercase transition hover:border-gold-soft hover:bg-cream/5"
          >
            {t.footer.book}
          </Link>
        </div>
      </div>
      <div className="border-t border-cream/10 py-6 text-center text-[11px] text-cream/35">
        © {new Date().getFullYear()} {venue.name} · {t.common.demoNote}
      </div>
    </footer>
  );
}
