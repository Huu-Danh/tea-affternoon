import type { Metadata } from "next";
import { alternatesFor } from "@/i18n/config";
import { HomeView } from "@/views/home";

export const metadata: Metadata = { alternates: alternatesFor("/", "en") };

export default function HomePage() {
  return <HomeView lang="en" />;
}
