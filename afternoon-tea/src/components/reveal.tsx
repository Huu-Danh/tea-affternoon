"use client";

import { motion } from "motion/react";

const ease = [0.2, 0.7, 0.2, 1] as const;

/** Hiệu ứng hiện dần khi cuộn tới */
export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.9, delay, ease }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Ảnh "mở màn" từ dưới lên khi cuộn tới, kèm thu nhỏ nhẹ.
 * Lớp ngoài (không bị cắt) theo dõi việc vào màn hình; lớp trong mới bị cắt.
 * Nếu đặt clip-path ngay trên phần tử được theo dõi, phần tử nằm sẵn trong màn hình
 * lúc tải trang sẽ bị coi là "không nhìn thấy" và không bao giờ hiện ra.
 */
export function RevealMask({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div className={className} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-60px" }}>
      <motion.div
        className="relative h-full w-full"
        variants={{
          hidden: { clipPath: "inset(100% 0% 0% 0%)", scale: 1.06 },
          show: {
            clipPath: "inset(0% 0% 0% 0%)",
            scale: 1,
            transition: { duration: 1.3, delay, ease: [0.65, 0, 0.2, 1] },
          },
        }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}
