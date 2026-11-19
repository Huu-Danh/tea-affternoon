"use client";

import { EmptyState } from "@/components/checkout-parts";
import { useT } from "@/i18n/use-lang";

export default function NotFound() {
  const { t } = useT();
  return <EmptyState title={t.notFound.title} text={t.notFound.text} />;
}
