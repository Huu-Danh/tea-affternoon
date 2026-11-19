import type { Metadata } from "next";
import { venue } from "@/data/venue";
import { dict } from "@/i18n/dict";

const t = dict.en;

/** Metadata mặc định cho các trang tiếng Anh (/en/...) */
export const metadata: Metadata = {
  // absolute: không áp template của layout gốc lần nữa (tránh "... | Hilton Saigon | Hilton Saigon")
  title: { absolute: t.meta.title, template: `%s | ${venue.name}` },
  description: t.meta.description,
  openGraph: {
    title: t.meta.title,
    description: t.meta.description,
    siteName: `${venue.name} · ${venue.lounge}`,
    type: "website",
    locale: "en_US",
    alternateLocale: ["vi_VN"],
    images: [{ url: "/og/og-en.jpg", width: 1200, height: 630, alt: t.meta.title }],
  },
};

export default function EnglishLayout({ children }: { children: React.ReactNode }) {
  return children;
}
