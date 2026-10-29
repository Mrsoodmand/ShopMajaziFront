"use client";

import { faqs } from "@/content/faq-en";
import { useT } from "@/i18n/client";

// FAQPage structured data, so search results can show these questions as rich results.
// Render it once on the real page (the comparison page shows it under every offer, which is fine for previewing).
export default function FaqSchema() {
  const t = useT();
  const data = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: t.tr(faqs).map((f) => ({ "@type": t("Question"), name: f.q, acceptedAnswer: { "@type": t("Answer"), text: f.a } })),
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}
