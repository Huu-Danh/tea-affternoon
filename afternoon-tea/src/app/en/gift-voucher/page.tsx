import { dict } from "@/i18n/dict";
import { pageMeta } from "@/i18n/meta";
import { GiftVoucherView } from "@/views/gift-voucher-view";

const t = dict.en;

export const metadata = pageMeta("en", "/gift-voucher/", t.voucher.metaTitle, { description: t.voucher.metaDesc });

export default function GiftVoucherPage() {
  return <GiftVoucherView />;
}
