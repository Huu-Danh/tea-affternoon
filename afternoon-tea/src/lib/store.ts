"use client";

import { useSyncExternalStore } from "react";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { venue } from "@/data/venue";
import type { AddonQty } from "@/lib/pricing";

export type Guest = {
  fullName: string;
  phone: string;
  email: string;
  occasion: string;
  note: string;
  marketing: boolean;
};

export type PaymentMethod = "vnpay" | "momo" | "card";

export type Draft = {
  slug: string;
  date: string;
  time: string;
  pax: number;
  holdExpiresAt: number;
  addons: AddonQty;
  guest?: Guest;
};

export type Booking = {
  code: string;
  slug: string;
  experienceName: string;
  date: string;
  time: string;
  pax: number;
  addons: AddonQty;
  guest: Guest;
  total: number;
  paymentMethod: PaymentMethod;
  status: "confirmed" | "cancelled";
  createdAt: number;
};

type State = {
  draft: Draft | null;
  bookings: Booking[];
  lastCode: string | null;
  startHold: (d: Pick<Draft, "slug" | "date" | "time" | "pax">) => void;
  setAddonQty: (id: string, qty: number) => void;
  setGuest: (g: Guest) => void;
  clearDraft: () => void;
  confirm: (b: Omit<Booking, "code" | "createdAt" | "status">) => string;
  cancel: (code: string) => void;
};

function makeCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let s = "";
  for (let i = 0; i < 6; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return `AT-${s}`;
}

/**
 * Toàn bộ "dữ liệu" đặt chỗ nằm ở trình duyệt (localStorage).
 * Khi nối backend: startHold -> POST /holds, confirm -> POST /bookings.
 */
export const useBooking = create<State>()(
  persist(
    (set, get) => ({
      draft: null,
      bookings: [],
      lastCode: null,
      startHold: (d) =>
        set({
          draft: {
            ...d,
            holdExpiresAt: Date.now() + venue.holdMinutes * 60 * 1000,
            addons: get().draft?.slug === d.slug ? get().draft!.addons : {},
            guest: get().draft?.guest,
          },
        }),
      setAddonQty: (id, qty) => {
        const draft = get().draft;
        if (!draft) return;
        set({ draft: { ...draft, addons: { ...draft.addons, [id]: qty } } });
      },
      setGuest: (guest) => {
        const draft = get().draft;
        if (!draft) return;
        set({ draft: { ...draft, guest } });
      },
      clearDraft: () => set({ draft: null }),
      confirm: (b) => {
        const code = makeCode();
        set({
          bookings: [{ ...b, code, status: "confirmed", createdAt: Date.now() }, ...get().bookings],
          lastCode: code,
          draft: null,
        });
        return code;
      },
      cancel: (code) =>
        set({
          bookings: get().bookings.map((b) => (b.code === code ? { ...b, status: "cancelled" } : b)),
        }),
    }),
    { name: "afternoon-tea-booking", storage: createJSONStorage(() => localStorage) },
  ),
);

const noop = () => () => {};

/** true sau khi đã render ở client: tránh lệch HTML giữa bản build tĩnh và localStorage */
export function useHydrated() {
  return useSyncExternalStore(
    noop,
    () => true,
    () => false,
  );
}

/** Đồng hồ đếm ngược thời gian giữ chỗ (giây còn lại) */
export function useNow(intervalMs = 1000) {
  return useSyncExternalStore(
    (cb) => {
      const id = setInterval(cb, intervalMs);
      return () => clearInterval(id);
    },
    () => Math.floor(Date.now() / intervalMs) * intervalMs,
    () => 0,
  );
}
