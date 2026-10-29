import type { Metadata } from "next";
import { getT } from "@/i18n/server";
import { getSection } from "@/design/registry";
import { readDecisions } from "@/components/design/decisions";
import { tgPaths } from "@/content/telegram-en";
import { ExtrasSlot } from "@/design/service/slot";
import ServiceExtras from "@/design/service/ServiceExtras";
import { PageHeadingProvider } from "@/components/seo/PageHeading";
import { pageSeo, seoMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getT();
  return seoMetadata("telegram-premium", {
    title: t("Telegram Premium: gifted to your username, 3 to 12 months — ShopMajazi"),
    description: t("Telegram Premium on your own account or as a gift, active in minutes. Only the username is needed, never a password. 3, 6 or 12 months."),
    alternates: { canonical: tgPaths.premium },
  });
}

// The live Telegram Premium page: renders whichever design is chosen in /design/page-tg-premium (S), followed by
// the shared sections (how to use, guide, comments, FAQ, blog).
export default async function TelegramPremiumPage() {
  const seo = await pageSeo("telegram-premium");
  const decisions = await readDecisions();
  const section = getSection("page-tg-premium")!;
  const offer = section.offers.find((o) => o.id === decisions["page-tg-premium"]?.offer) ?? section.offers.find((o) => o.id === "S")!;
  const { Component } = offer;
  return <PageHeadingProvider h1={seo.h1}><ExtrasSlot extras={<ServiceExtras service="telegram-premium" />}><Component /></ExtrasSlot></PageHeadingProvider>;
}
