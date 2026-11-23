import type { Metadata } from "next";
import { getT } from "@/i18n/server";
import { FaqPageC } from "@/design/info/offers";
import { PageHeadingProvider } from "@/components/seo/PageHeading";
import { pageSeo, seoMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getT();
  return seoMetadata("faq", {
    title: t("Frequently asked questions — ShopMajazi"),
    description: t("Short, clear answers about virtual numbers, Apple ID, subscriptions, delivery, payment and refunds."),
    alternates: { canonical: "/faq" },
  });
}

// FAQ = page-faq C "Side Index" (decisions.json). Questions come from content/faq-en.ts, the same set as the home FAQ.
export default async function FaqPage() {
  const seo = await pageSeo("faq");
  return <PageHeadingProvider h1={seo.h1}><FaqPageC /></PageHeadingProvider>;
}
