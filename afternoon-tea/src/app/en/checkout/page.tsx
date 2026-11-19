import { dict } from "@/i18n/dict";
import { pageMeta } from "@/i18n/meta";
import { CheckoutView } from "@/views/checkout-view";

const t = dict.en;

export const metadata = pageMeta("en", "/checkout/", t.checkout.title, { noindex: true });

export default function CheckoutPage() {
  return <CheckoutView />;
}
