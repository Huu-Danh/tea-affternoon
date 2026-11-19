"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ChevronLeft, ChevronRight, Expand, X } from "lucide-react";
import type { Tone } from "@/data/experiences";
import { useT } from "@/i18n/use-lang";
import { withBasePath } from "@/lib/base-path";
import { Photo } from "./photo";
import { RevealMask } from "./reveal";
import { getLenis } from "./smooth-scroll";
import { cn } from "./ui";

export type GalleryItem = {
  src?: string;
  alt: string;
  tone?: Tone;
  art?: "cup" | "stand" | "pot";
  className?: string;
};

/**
 * Lưới ảnh không gian. Ảnh thật (có src) bấm vào sẽ mở xem toàn màn hình:
 * phím ← → để chuyển ảnh, Esc để đóng; khoá cuộn trang khi đang xem.
 */
export function Gallery({ items }: { items: GalleryItem[] }) {
  const { t } = useT();
  const photos = items.filter((i) => i.src);
  const [index, setIndex] = useState<number | null>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const opener = useRef<HTMLElement | null>(null);

  const open = (src: string, el: HTMLElement) => {
    opener.current = el;
    setIndex(photos.findIndex((p) => p.src === src));
  };
  const count = photos.length;
  const isOpen = index !== null;
  const close = () => setIndex(null);
  const step = (d: number) => setIndex((i) => (i === null ? i : (i + d + count) % count));

  // Chỉ chạy khi mở/đóng (không chạy lại mỗi lần chuyển ảnh)
  useEffect(() => {
    if (!isOpen) return;
    // Khoá cuộn (kể cả Lenis) và đưa focus vào nút đóng
    getLenis()?.stop();
    const prevOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    closeBtn.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIndex(null);
      if (e.key === "ArrowRight") setIndex((i) => (i === null ? i : (i + 1) % count));
      if (e.key === "ArrowLeft") setIndex((i) => (i === null ? i : (i - 1 + count) % count));
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = prevOverflow;
      getLenis()?.start();
      opener.current?.focus();
    };
  }, [isOpen, count]);

  const current = index === null ? null : photos[index];

  return (
    <>
      <div className="mt-14 grid auto-rows-[180px] grid-cols-2 gap-3 md:auto-rows-[230px] md:grid-cols-4 md:gap-4">
        {items.map((item, i) => (
          <RevealMask key={item.alt} delay={i * 0.08} className={cn("relative overflow-hidden rounded-sm", item.className)}>
            {item.src ? (
              <button
                type="button"
                onClick={(e) => open(item.src!, e.currentTarget)}
                className="group absolute inset-0 block cursor-zoom-in"
                aria-label={t.gallery.view(item.alt)}
              >
                <Photo
                  src={item.src}
                  alt={item.alt}
                  className="h-full w-full transition-transform duration-[1.4s] ease-out group-hover:scale-105"
                />
                <span className="absolute inset-0 bg-navy-dark/0 transition group-hover:bg-navy-dark/25" />
                <span className="absolute right-3 bottom-3 flex size-9 items-center justify-center rounded-full bg-paper/85 text-navy opacity-0 transition group-hover:opacity-100">
                  <Expand className="size-4" />
                </span>
              </button>
            ) : (
              <Photo alt={item.alt} tone={item.tone} art={item.art} className="h-full w-full" />
            )}
          </RevealMask>
        ))}
      </div>

      <AnimatePresence>
        {current && (
          <motion.div
            className="fixed inset-0 z-[90] flex items-center justify-center bg-navy-dark/95 p-4 backdrop-blur-sm sm:p-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            role="dialog"
            aria-modal="true"
            aria-label={current.alt}
            onClick={close}
            data-lenis-prevent
          >
            <motion.figure
              key={current.src}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="flex max-h-full flex-col items-center"
              onClick={(e) => e.stopPropagation()}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={withBasePath(current.src!)}
                alt={current.alt}
                className="max-h-[78vh] w-auto max-w-full rounded-xs object-contain shadow-2xl"
              />
              <figcaption className="mt-5 text-center text-sm text-cream/70">
                {current.alt}
                {photos.length > 1 && (
                  <span className="ml-3 text-cream/40 tabular-nums">
                    {index! + 1} / {photos.length}
                  </span>
                )}
              </figcaption>
            </motion.figure>

            <button
              ref={closeBtn}
              type="button"
              onClick={close}
              className="absolute top-4 right-4 flex size-11 items-center justify-center rounded-full border border-cream/20 text-cream transition hover:bg-cream/10 sm:top-6 sm:right-6"
              aria-label={t.gallery.close}
            >
              <X className="size-5" />
            </button>
            {photos.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    step(-1);
                  }}
                  className="absolute left-3 flex size-11 items-center justify-center rounded-full border border-cream/20 text-cream transition hover:bg-cream/10 sm:left-6"
                  aria-label={t.gallery.prev}
                >
                  <ChevronLeft className="size-5" />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    step(1);
                  }}
                  className="absolute right-3 flex size-11 items-center justify-center rounded-full border border-cream/20 text-cream transition hover:bg-cream/10 sm:right-6"
                  aria-label={t.gallery.next}
                >
                  <ChevronRight className="size-5" />
                </button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
