import type { Metadata, Viewport } from "next";
import { Be_Vietnam_Pro, Cormorant_Garamond, Pinyon_Script } from "next/font/google";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { BackgroundMusic } from "@/components/background-music";
import { SmoothScroll } from "@/components/smooth-scroll";
import { venue } from "@/data/venue";
import { withBasePath } from "@/lib/base-path";
import "./globals.css";

const display = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin", "vietnamese"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
});

const sans = Be_Vietnam_Pro({
  variable: "--font-bevn",
  subsets: ["latin", "vietnamese"],
  weight: ["300", "400", "500", "600"],
});

const script = Pinyon_Script({
  variable: "--font-pinyon",
  subsets: ["latin", "vietnamese"],
  weight: "400",
});

export const metadata: Metadata = {
  title: {
    default: `Afternoon Tea | ${venue.name}`,
    template: `%s | ${venue.name}`,
  },
  description: venue.description,
  openGraph: {
    title: `Afternoon Tea | ${venue.name}`,
    description: venue.description,
    type: "website",
    locale: "vi_VN",
  },
};

export const viewport: Viewport = {
  themeColor: "#1b2a4a",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="vi" className={`${display.variable} ${sans.variable} ${script.variable} h-full`}>
      <body className="flex min-h-full flex-col">
        <Intro />
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
        <BackgroundMusic />
        <SmoothScroll />
      </body>
    </html>
  );
}

/** Màn mở đầu: chỉ chạy khi tải trang lần đầu (layout giữ nguyên khi chuyển trang). CSS thuần. */
function Intro() {
  return (
    <div className="intro lattice fixed inset-0 z-[100] flex items-center justify-center bg-navy" aria-hidden>
      <div className="intro__mark flex flex-col items-center text-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={withBasePath("/logo-white.webp")} alt="" width={306} height={214} className="h-20 w-auto" />
        <span className="intro__line mt-6 block h-px w-40 bg-gold-soft/60" />
        <span className="mt-4 font-script text-5xl text-gold-soft">Afternoon Tea</span>
        <span className="mt-2 text-[10px] uppercase tracking-[0.4em] text-cream/60">{venue.lounge}</span>
      </div>
    </div>
  );
}
