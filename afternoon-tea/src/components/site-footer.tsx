import Link from "next/link";
import { venue } from "@/data/venue";
import { withBasePath } from "@/lib/base-path";
import { Ornament } from "./photo";

export function SiteFooter() {
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
            <p className="text-[10px] tracking-[0.3em] text-gold-soft uppercase">Địa chỉ</p>
            <p className="mt-3 leading-relaxed">{venue.address}</p>
          </div>
          <div>
            <p className="text-[10px] tracking-[0.3em] text-gold-soft uppercase">Giờ phục vụ</p>
            <p className="mt-3">{venue.hours}</p>
          </div>
          <div>
            <p className="text-[10px] tracking-[0.3em] text-gold-soft uppercase">Liên hệ</p>
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

        <div className="mt-14 text-center">
          <Link
            href="/#experiences"
            className="inline-flex border border-gold-soft/40 px-8 py-3.5 text-[11px] tracking-[0.25em] text-cream uppercase transition hover:border-gold-soft hover:bg-cream/5"
          >
            Đặt chỗ trà chiều
          </Link>
        </div>
      </div>
      <div className="border-t border-cream/10 py-6 text-center text-[11px] text-cream/35">
        © {new Date().getFullYear()} {venue.name} · Bản demo frontend: dữ liệu và thanh toán đều là giả lập.
      </div>
    </footer>
  );
}
