"use client";

import { usePathname } from "next/navigation";
import { splitLocale, type Lang } from "./config";
import { dict } from "./dict";

/** Ngôn ngữ hiện tại, suy ra từ URL (/en/... là tiếng Anh) */
export function useLang(): Lang {
  return splitLocale(usePathname() ?? "/").lang;
}

/** Ngôn ngữ + từ điển giao diện */
export function useT() {
  const lang = useLang();
  return { lang, t: dict[lang] };
}
