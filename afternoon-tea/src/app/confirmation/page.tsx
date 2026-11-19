import { dict } from "@/i18n/dict";
import { pageMeta } from "@/i18n/meta";
import { ConfirmationView } from "@/views/confirmation-view";

const t = dict.vi;

export const metadata = pageMeta("vi", "/confirmation/", t.confirmation.title, { noindex: true });

export default function ConfirmationPage() {
  return <ConfirmationView />;
}
