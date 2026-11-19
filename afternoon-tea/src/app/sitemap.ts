import type { MetadataRoute } from "next";
import { experiences } from "@/data/experiences";
import { localePath } from "@/i18n/config";
import { siteUrl } from "@/lib/site";

export const dynamic = "force-static";

/** Các trang công khai, mỗi trang có bản vi và en (hreflang) */
export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ["/", "/gift-voucher/", "/private-events/", ...experiences.map((e) => `/experiences/${e.slug}/`)];
  return paths.map((p) => ({
    url: `${siteUrl}${p}`,
    changeFrequency: "weekly",
    priority: p === "/" ? 1 : 0.8,
    alternates: { languages: { vi: `${siteUrl}${p}`, en: `${siteUrl}${localePath("en", p)}` } },
  }));
}
