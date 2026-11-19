"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";

/** Lenis dùng chung để các component khác tạm dừng cuộn (vd. lightbox) */
let instance: Lenis | null = null;
export const getLenis = () => instance;

/**
 * Cuộn mượt toàn trang bằng Lenis.
 * - Tắt khi khách bật "giảm chuyển động" của hệ điều hành.
 * - Cảm ứng (điện thoại) giữ cuộn gốc của hệ điều hành.
 * - Link neo (#offers...) cuộn mượt, trừ chiều cao header.
 */
export function SmoothScroll() {
  const pathname = usePathname();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({ autoRaf: true, lerp: 0.085, anchors: { offset: -96 } });
    instance = lenis;
    return () => {
      lenis.destroy();
      instance = null;
    };
  }, []);

  // Chuyển trang: đồng bộ vị trí cuộn của Lenis (lên đầu, hoặc tới #hash nếu có)
  useEffect(() => {
    const lenis = instance;
    if (!lenis) return;
    const hash = window.location.hash;
    const target = hash ? document.querySelector(hash) : null;
    requestAnimationFrame(() => {
      if (target) lenis.scrollTo(target as HTMLElement, { offset: -96, immediate: true });
      else lenis.scrollTo(0, { immediate: true });
    });
  }, [pathname]);

  return null;
}
