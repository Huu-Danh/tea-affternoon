import { dict } from "@/i18n/dict";
import { pageMeta } from "@/i18n/meta";
import { PrivateEventsView } from "@/views/private-events-view";

const t = dict.vi;

export const metadata = pageMeta("vi", "/private-events/", t.events.metaTitle, { description: t.events.metaDesc });

export default function PrivateEventsPage() {
  return <PrivateEventsView />;
}
