import type { Tone } from "@/data/experiences";
import { cn } from "./ui";

const tones: Record<Tone, string> = {
  forest: "from-[#35574f] via-[#23403a] to-[#132420] text-gold-soft",
  gold: "from-[#d6b47c] via-[#b08d57] to-[#7a5c31] text-paper",
  blush: "from-[#f3e2d6] via-[#e3c2b0] to-[#c19280] text-[#7a4a3a]",
  ink: "from-[#4a3f3a] via-[#2f2825] to-[#1a1514] text-gold-soft",
};

type Art = "cup" | "stand" | "pot";

/**
 * Khung ảnh. Có `src` thì hiển thị ảnh thật; chưa có thì hiển thị
 * nền gradient + hình minh hoạ nét mảnh để demo vẫn đẹp.
 */
export function Photo({
  src,
  alt,
  tone = "forest",
  art = "cup",
  className,
  artClassName,
  children,
}: {
  src?: string;
  alt: string;
  tone?: Tone;
  art?: Art;
  className?: string;
  /** Vị trí/kích thước hình minh hoạ (khi chưa có ảnh thật) */
  artClassName?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className={cn("relative overflow-hidden bg-linear-to-br", tones[tone], className)}>
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={alt} className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
      ) : (
        <div role="img" aria-label={alt} className="grain absolute inset-0 flex items-center justify-center">
          <Illustration art={art} className={artClassName ?? "h-[46%] max-h-56 w-auto opacity-70"} />
        </div>
      )}
      {children}
    </div>
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
