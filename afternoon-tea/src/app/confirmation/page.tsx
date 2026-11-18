import type { Metadata } from "next";
import { ConfirmationView } from "./confirmation-view";

export const metadata: Metadata = { title: "Đặt chỗ thành công", robots: { index: false } };

export default function ConfirmationPage() {
  return <ConfirmationView />;
}
