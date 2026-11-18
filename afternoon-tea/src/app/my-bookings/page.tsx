import type { Metadata } from "next";
import { MyBookingsView } from "./my-bookings-view";

export const metadata: Metadata = { title: "Đặt chỗ của tôi", robots: { index: false } };

export default function MyBookingsPage() {
  return <MyBookingsView />;
}
