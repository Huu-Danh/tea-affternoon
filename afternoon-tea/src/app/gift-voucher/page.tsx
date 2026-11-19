import { dict } from "@/i18n/dict";
import { pageMeta } from "@/i18n/meta";
import { GiftVoucherView } from "@/views/gift-voucher-view";

const t = dict.vi;

export const metadata = pageMeta("vi", "/gift-voucher/", t.voucher.metaTitle, { description: t.voucher.metaDesc });

export default function GiftVoucherPage() {
  return <GiftVoucherView />;
}
