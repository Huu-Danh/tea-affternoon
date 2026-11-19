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

/** Ảnh "mở màn" từ dưới lên khi cuộn tới, kèm thu nhỏ nhẹ */
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
    <motion.div
      className={className}
      initial={{ clipPath: "inset(100% 0% 0% 0%)", scale: 1.06 }}
      whileInView={{ clipPath: "inset(0% 0% 0% 0%)", scale: 1 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 1.3, delay, ease: [0.65, 0, 0.2, 1] }}
    >
      {children}
    </motion.div>
  );
}
