"use client";

import { useEffect } from "react";
import { useLang } from "@/i18n/use-lang";

/** Cập nhật <html lang> khi chuyển ngôn ngữ phía client (không tải lại trang) */
export function HtmlLang() {
  const lang = useLang();
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);
  return null;
}
