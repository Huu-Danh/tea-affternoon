import type { Metadata } from "next";
import { alternatesFor } from "@/i18n/config";
import { HomeView } from "@/views/home";

export const metadata: Metadata = { alternates: alternatesFor("/", "vi") };

export default function HomePage() {
  return <HomeView lang="vi" />;
}
