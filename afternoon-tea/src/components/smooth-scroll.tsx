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
    // Khoảng chừa cho header lấy từ `scroll-padding-top` (globals.css); Lenis tự trừ giá trị này
    const lenis = new Lenis({ autoRaf: true, lerp: 0.085, anchors: true });
    instance = lenis;
    return () => {
      lenis.destroy();
      instance = null;
    };
  }, []);

  // Chuyển trang: tính lại kích thước trang mới (nếu không Lenis vẫn giới hạn cuộn theo
  // chiều cao trang cũ), rồi đưa về đầu trang hoặc tới #hash nếu có
  useEffect(() => {
    const lenis = instance;
    if (!lenis) return;
    const id = requestAnimationFrame(() => {
      lenis.resize();
      const hash = window.location.hash;
      const target = hash ? document.getElementById(decodeURIComponent(hash.slice(1))) : null;
      if (target) lenis.scrollTo(target, { immediate: true });
      else lenis.scrollTo(0, { immediate: true });
    });
    return () => cancelAnimationFrame(id);
  }, [pathname]);

  return null;
}
