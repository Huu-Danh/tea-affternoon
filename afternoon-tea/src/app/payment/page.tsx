import type { Metadata } from "next";
import { PaymentView } from "./payment-view";

export const metadata: Metadata = { title: "Thanh toán", robots: { index: false } };

export default function PaymentPage() {
  return <PaymentView />;
}
