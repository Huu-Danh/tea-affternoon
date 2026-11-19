import type { Metadata } from "next";
import { ExperienceView, experienceMetadata, experienceParams } from "@/views/experience";

export const dynamicParams = false;

export function generateStaticParams() {
  return experienceParams();
}

export async function generateMetadata({ params }: PageProps<"/en/experiences/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  return experienceMetadata(slug, "en");
}

export default async function ExperiencePage({ params }: PageProps<"/en/experiences/[slug]">) {
  const { slug } = await params;
  return <ExperienceView slug={slug} lang="en" />;
}
