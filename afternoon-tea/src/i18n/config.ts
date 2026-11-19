/**
 * Song ngữ: tiếng Việt ở gốc (/...), tiếng Anh dưới /en/... — cùng một root layout,
 * nên chuyển ngôn ngữ là chuyển trang phía client (nhạc nền không bị ngắt).
 */
export type Lang = "vi" | "en";
export const langs: Lang[] = ["vi", "en"];

/** Chuỗi có bản dịch */
export type L = { vi: string; en: string };

/** Lấy chuỗi theo ngôn ngữ; chuỗi thường (không dịch) trả về nguyên văn */
export function tr(v: L | string, lang: Lang) {
  return typeof v === "string" ? v : v[lang];
}

/** "/checkout/" -> "/en/checkout/" khi lang = en. Path phải bắt đầu bằng "/" */
export function localePath(lang: Lang, path: string) {
  if (lang === "vi") return path;
  if (path === "/") return "/en/";
  if (path.startsWith("/#")) return `/en/${path.slice(1)}`;
  return `/en${path}`;
}

/** Tách ngôn ngữ khỏi pathname: "/en/checkout/" -> { lang: "en", path: "/checkout/" } */
export function splitLocale(pathname: string): { lang: Lang; path: string } {
  if (pathname === "/en" || pathname.startsWith("/en/")) {
    return { lang: "en", path: pathname.slice(3) || "/" };
  }
  return { lang: "vi", path: pathname || "/" };
}

/** Cùng trang ở ngôn ngữ còn lại (dùng cho nút VI / EN) */
export function switchLocalePath(pathname: string, to: Lang) {
  return localePath(to, splitLocale(pathname).path);
}

/** Metadata hreflang cho một trang (path theo bản tiếng Việt, vd "/gift-voucher/") */
export function alternatesFor(path: string, lang: Lang) {
  return {
    canonical: localePath(lang, path),
    languages: { vi: path, en: localePath("en", path), "x-default": path },
  };
}
