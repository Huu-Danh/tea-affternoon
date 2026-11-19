import { dict } from "@/i18n/dict";
import { pageMeta } from "@/i18n/meta";
import { PaymentView } from "@/views/payment-view";

const t = dict.en;

export const metadata = pageMeta("en", "/payment/", t.payment.title, { noindex: true });

export default function PaymentPage() {
  return <PaymentView />;
}
