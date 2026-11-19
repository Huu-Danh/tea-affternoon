import { dict } from "@/i18n/dict";
import { pageMeta } from "@/i18n/meta";
import { CheckoutView } from "@/views/checkout-view";

const t = dict.vi;

export const metadata = pageMeta("vi", "/checkout/", t.checkout.title, { noindex: true });

export default function CheckoutPage() {
  return <CheckoutView />;
}
