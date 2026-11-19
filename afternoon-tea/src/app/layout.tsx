import type { Metadata, Viewport } from "next";
import { Be_Vietnam_Pro, Cormorant_Garamond, Pinyon_Script } from "next/font/google";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { BackgroundMusic } from "@/components/background-music";
import { SmoothScroll } from "@/components/smooth-scroll";
import { HtmlLang } from "@/components/html-lang";
import { venue } from "@/data/venue";
import { dict } from "@/i18n/dict";
import { withBasePath } from "@/lib/base-path";
import { siteUrl } from "@/lib/site";
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
  metadataBase: new URL(siteUrl),
  title: {
    default: dict.vi.meta.title,
    template: `%s | ${venue.name}`,
  },
  description: dict.vi.meta.description,
  openGraph: {
    title: dict.vi.meta.title,
    description: dict.vi.meta.description,
    siteName: `${venue.name} · ${venue.lounge}`,
    type: "website",
    locale: "vi_VN",
    alternateLocale: ["en_US"],
    images: [{ url: "/og/og-vi.jpg", width: 1200, height: 630, alt: dict.vi.meta.title }],
  },
  twitter: { card: "summary_large_image" },
};

/** Đặt <html lang> = "en" cho các trang /en/ ngay khi tải (layout gốc dùng chung cho 2 ngôn ngữ) */
const setLangScript = `(function(){var p=location.pathname.slice(${JSON.stringify(process.env.NEXT_PUBLIC_BASE_PATH ?? "")}.length);if(p==="/en"||p.indexOf("/en/")===0)document.documentElement.lang="en"})()`;

export const viewport: Viewport = {
  themeColor: "#1b2a4a",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="vi" suppressHydrationWarning className={`${display.variable} ${sans.variable} ${script.variable} h-full`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: setLangScript }} />
      </head>
      <body className="flex min-h-full flex-col">
        <HtmlLang />
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
