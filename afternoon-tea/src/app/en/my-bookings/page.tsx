import { dict } from "@/i18n/dict";
import { pageMeta } from "@/i18n/meta";
import { MyBookingsView } from "@/views/my-bookings-view";

const t = dict.en;

export const metadata = pageMeta("en", "/my-bookings/", t.myBookings.title, { noindex: true });

export default function MyBookingsPage() {
  return <MyBookingsView />;
}
