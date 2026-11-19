import type { Metadata } from "next";
import { alternatesFor, type Lang } from "./config";

/** Metadata cho một trang: tiêu đề, mô tả, hreflang; trang đặt chỗ thì không cho index */
export function pageMeta(
  lang: Lang,
  path: string,
  title: string,
  opts: { description?: string; noindex?: boolean } = {},
): Metadata {
  return {
    title,
    description: opts.description,
    alternates: alternatesFor(path, lang),
    robots: opts.noindex ? { index: false } : undefined,
  };
}
