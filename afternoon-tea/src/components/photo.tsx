import type { Tone } from "@/data/experiences";
import { withBasePath } from "@/lib/base-path";
import { cn } from "./ui";

const tones: Record<Tone, string> = {
  navy: "from-[#2d4170] via-[#1b2a4a] to-[#0d1526] text-gold-soft",
  gold: "from-[#d9c08f] via-[#ad8d58] to-[#6f5530] text-paper",
  blush: "from-[#f4e6dc] via-[#e3c8b8] to-[#bf9686] text-[#6f4436]",
  ink: "from-[#3a3f52] via-[#232838] to-[#121520] text-gold-soft",
};

type Art = "cup" | "stand" | "pot";

/**
 * Khung ảnh. Có `src` thì hiển thị ảnh thật; chưa có thì hiển thị
 * nền gradient + hình minh hoạ nét mảnh để demo vẫn đẹp.
 */
export function Photo({
  src,
  alt,
  tone = "navy",
  art = "cup",
  className,
  artClassName,
  fit = "cover",
  kenBurns = false,
  children,
}: {
  src?: string;
  alt: string;
  tone?: Tone;
  art?: Art;
  className?: string;
  /** Vị trí/kích thước hình minh hoạ (khi chưa có ảnh thật) */
  artClassName?: string;
  /**
   * "contain": hiện trọn ảnh ở giữa, nền là chính ảnh đó làm mờ.
   * Dùng cho khung rộng khi ảnh nhỏ hoặc ảnh dọc để không bị cắt/vỡ.
   */
  fit?: "cover" | "contain";
  /** Zoom rất chậm (hiệu ứng Ken Burns) */
  kenBurns?: boolean;
  children?: React.ReactNode;
}) {
  const motionCls = kenBurns ? "animate-kenburns will-change-transform" : undefined;
  let media: React.ReactNode;
  if (src && fit === "contain") {
    media = (
      <>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={withBasePath(src)}
          alt=""
          aria-hidden
          className={cn("absolute inset-0 h-full w-full scale-110 object-cover opacity-70 blur-2xl", motionCls)}
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={withBasePath(src)} alt={alt} className="absolute inset-0 h-full w-full object-contain drop-shadow-2xl" />
      </>
    );
  } else if (src) {
    media = (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={withBasePath(src)} alt={alt} className={cn("absolute inset-0 h-full w-full object-cover", motionCls)} loading="lazy" />
    );
  } else {
    media = (
      <div role="img" aria-label={alt} className={cn("grain absolute inset-0 flex items-center justify-center", motionCls)}>
        <Illustration art={art} className={artClassName ?? "h-[46%] max-h-56 w-auto opacity-70"} />
      </div>
    );
  }
  return (
    <div className={cn("relative overflow-hidden bg-linear-to-br", tones[tone], className)}>
      {media}
      {children}
    </div>
  );
}

/** Đường trang trí: vạch mảnh – hình thoi – vạch mảnh */
export function Ornament({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 160 12" className={cn("h-3 w-40", className)} fill="none" stroke="currentColor" aria-hidden>
      <path d="M0 6h62M98 6h62" strokeWidth="0.75" />
      <path d="M80 1l5 5-5 5-5-5z" strokeWidth="0.9" />
      <circle cx="68" cy="6" r="1.2" fill="currentColor" stroke="none" />
      <circle cx="92" cy="6" r="1.2" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function Illustration({ art, className }: { art: Art; className?: string }) {
  return (
    <svg
      viewBox="0 0 120 120"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.1"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      {art === "cup" && (
        <>
          <path d="M46 46c-4-5 4-8 0-14M57 44c-4-5 4-8 0-14M68 46c-4-5 4-8 0-14" opacity=".7" />
          <path d="M30 56h54v6c0 15-12 27-27 27S30 77 30 62v-6z" />
          <path d="M84 62h5a9 9 0 0 1 0 18h-8" />
          <path d="M36 66c2 8 8 14 16 16" opacity=".5" />
          <ellipse cx="57" cy="94" rx="38" ry="5" />
          <ellipse cx="57" cy="93" rx="22" ry="2.5" opacity=".5" />
        </>
      )}
      {art === "stand" && (
        <>
          <circle cx="60" cy="14" r="3" />
          <path d="M60 17v87M50 106h20" />
          <ellipse cx="60" cy="40" rx="18" ry="3" />
          <path d="M50 37a5 5 0 0 1 10 0M61 37a5 5 0 0 1 10 0" />
          <ellipse cx="60" cy="66" rx="28" ry="4" />
          <path d="M37 62a6 6 0 0 1 12 0M50 62a6 6 0 0 1 12 0M63 62a6 6 0 0 1 12 0" />
          <ellipse cx="60" cy="94" rx="38" ry="5" />
          <path d="M28 90l7-7 7 7M44 90l7-7 7 7M62 90l7-7 7 7M78 90l7-7 7 7" />
        </>
      )}
      {art === "pot" && (
        <>
          <circle cx="60" cy="27" r="3" />
          <path d="M47 39c2-6 7-9 13-9s11 3 13 9" />
          <path d="M34 60c0-14 12-21 26-21s26 7 26 21v8c0 13-11 21-26 21s-26-8-26-21z" />
          <path d="M34 62c-9-1-15-8-18-17 5 1 9 5 13 6" />
          <path d="M86 52c10 0 14 6 14 12s-5 12-14 13" />
          <path d="M42 56c6-6 30-6 36 0" opacity=".5" />
          <ellipse cx="60" cy="96" rx="34" ry="4" />
        </>
      )}
    </svg>
  );
}
