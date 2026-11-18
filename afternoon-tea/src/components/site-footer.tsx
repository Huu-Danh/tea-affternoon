import Link from "next/link";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { venue } from "@/data/venue";
import { withBasePath } from "@/lib/base-path";

export function SiteFooter() {
  return (
    <footer className="bg-forest-dark text-cream/80">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
        <div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={withBasePath("/logo-white.png")} alt={venue.name} width={306} height={214} className="h-16 w-auto" />
          <p className="mt-4 text-[10px] uppercase tracking-[0.32em] text-gold-soft">
            {venue.lounge} · Afternoon Tea
          </p>
          <p className="mt-5 max-w-xs text-sm leading-relaxed">{venue.description}</p>
        </div>

        <ul className="space-y-3 text-sm">
          <li className="flex gap-3">
            <MapPin className="mt-0.5 size-4 shrink-0 text-gold-soft" />
            {venue.address}
          </li>
          <li className="flex gap-3">
            <Clock className="mt-0.5 size-4 shrink-0 text-gold-soft" />
            {venue.hours}
          </li>
          <li className="flex gap-3">
            <Phone className="mt-0.5 size-4 shrink-0 text-gold-soft" />
            <a href={`tel:${venue.phone.replace(/\s/g, "")}`} className="hover:text-cream">
              {venue.phone}
            </a>
          </li>
          <li className="flex gap-3">
            <Mail className="mt-0.5 size-4 shrink-0 text-gold-soft" />
            <a href={`mailto:${venue.email}`} className="hover:text-cream">
              {venue.email}
            </a>
          </li>
        </ul>

        <div className="text-sm md:text-right">
          <Link href="/#experiences" className="font-display text-2xl text-cream hover:text-gold-soft">
            Đặt chỗ trà chiều →
          </Link>
          <p className="mt-4 text-cream/50">
            Bản demo frontend. Dữ liệu và thanh toán đều là giả lập.
          </p>
        </div>
      </div>
      <div className="border-t border-cream/10 py-6 text-center text-xs text-cream/40">
        © {new Date().getFullYear()} {venue.name}
      </div>
    </footer>
  );
}
