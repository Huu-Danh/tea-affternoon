"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { getExperience } from "@/data/experiences";
import { venue } from "@/data/venue";
import { withBasePath } from "@/lib/base-path";
import { useBooking } from "@/lib/store";

/**
 * Nhạc nền tự phát, không có nút điều khiển. Nằm trong root layout nên
 * nhạc không bị ngắt khi chuyển trang; bài nhạc đổi theo trang (crossfade):
 * - /experiences/[slug]          -> nhạc riêng của gói (experience.music)
 * - /checkout, /payment,
 *   /confirmation                -> nhạc của gói đang đặt (draft), hoặc gói vừa đặt
 * - các trang khác               -> venue.music.src
 *
 * Trình duyệt thường chặn tự phát nhạc có tiếng khi khách chưa tương tác:
 * thử phát ngay; bị chặn thì phát ở lần bấm / chạm / gõ phím đầu tiên
 * (cuộn trang không được tính là tương tác). Tạm dừng khi ẩn tab.
 */

const ACTIVATION_EVENTS = ["pointerdown", "pointerup", "touchend", "click", "keydown"] as const;

function musicOf(slug?: string | null) {
  return (slug && getExperience(slug)?.music) || venue.music.src;
}

function trackFor(pathname: string, draftSlug?: string, lastSlug?: string) {
  const path = pathname.replace(/\/+$/, "");
  const detail = path.match(/^\/experiences\/([^/]+)$/);
  if (detail) return musicOf(detail[1]);
  // Thanh toán xong, draft bị xoá trước khi chuyển sang /confirmation:
  // rơi về gói vừa đặt để nhạc không nhảy bài giữa chừng
  if (path === "/checkout" || path === "/payment" || path === "/confirmation") {
    return musicOf(draftSlug ?? lastSlug);
  }
  return venue.music.src;
}

/** Tên file có thể chứa dấu cách hoặc dấu tiếng Việt -> mã hoá URL */
const urlOf = (src: string) => encodeURI(withBasePath(src));

function createPlayer() {
  const audio = new Audio();
  audio.loop = true;
  audio.volume = 0;
  audio.preload = "none"; // chỉ tải khi thực sự phát

  const target = venue.music.volume;
  let track: string | null = null;
  let unlocked = false; // đã phát thành công ít nhất 1 lần (trình duyệt cho phép)
  let fade: ReturnType<typeof setInterval> | null = null;
  let switchId = 0;

  function fadeTo(to: number, ms: number, done?: () => void) {
    if (fade) clearInterval(fade);
    const steps = Math.max(1, Math.round(ms / 50));
    const delta = (to - audio.volume) / steps;
    let i = 0;
    fade = setInterval(() => {
      i++;
      audio.volume = Math.min(1, Math.max(0, i >= steps ? to : audio.volume + delta));
      if (i >= steps) {
        clearInterval(fade!);
        fade = null;
        done?.();
      }
    }, 50);
  }

  function tryStart() {
    if (unlocked || !track) return;
    audio
      .play()
      .then(() => {
        if (unlocked) return;
        unlocked = true;
        removeListeners();
        fadeTo(target, 1500);
      })
      .catch(() => {
        /* bị chặn: chờ tương tác tiếp theo */
      });
  }

  function addListeners() {
    ACTIVATION_EVENTS.forEach((e) => window.addEventListener(e, tryStart, true));
  }
  function removeListeners() {
    ACTIVATION_EVENTS.forEach((e) => window.removeEventListener(e, tryStart, true));
  }

  function setTrack(src: string) {
    if (src === track) return;
    track = src;
    if (!unlocked) {
      audio.src = urlOf(src);
      tryStart();
      return;
    }
    // Đang phát: giảm dần bài cũ rồi tăng dần bài mới
    const id = ++switchId;
    fadeTo(0, 700, () => {
      if (id !== switchId) return; // đã có lần đổi bài mới hơn
      audio.src = urlOf(src);
      audio
        .play()
        .then(() => fadeTo(target, 1500))
        .catch(() => {
          unlocked = false;
          addListeners();
        });
    });
  }

  const onVisibility = () => {
    if (!unlocked) return;
    if (document.hidden) audio.pause();
    else void audio.play().catch(() => {});
  };

  addListeners();
  document.addEventListener("visibilitychange", onVisibility);

  return {
    setTrack,
    destroy() {
      removeListeners();
      document.removeEventListener("visibilitychange", onVisibility);
      if (fade) clearInterval(fade);
      audio.pause();
      audio.removeAttribute("src");
      audio.load();
    },
  };
}

export function BackgroundMusic() {
  const pathname = usePathname();
  const draftSlug = useBooking((s) => s.draft?.slug);
  const lastSlug = useBooking((s) => s.bookings.find((b) => b.code === s.lastCode)?.slug);
  const player = useRef<ReturnType<typeof createPlayer> | null>(null);

  useEffect(() => {
    player.current = createPlayer();
    return () => {
      player.current?.destroy();
      player.current = null;
    };
  }, []);

  const track = trackFor(pathname, draftSlug, lastSlug);
  useEffect(() => {
    player.current?.setTrack(track);
  }, [track]);

  return null;
}
