import { dict } from "@/i18n/dict";
import { pageMeta } from "@/i18n/meta";
import { ConfirmationView } from "@/views/confirmation-view";

const t = dict.en;

export const metadata = pageMeta("en", "/confirmation/", t.confirmation.title, { noindex: true });

export default function ConfirmationPage() {
  return <ConfirmationView />;
}
