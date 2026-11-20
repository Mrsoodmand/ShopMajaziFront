import type { Metadata } from "next";
import { getT } from "@/i18n/server";
import { getSection } from "@/design/registry";
import { readDecisions } from "@/components/design/decisions";
import { tgPaths } from "@/content/telegram-en";
import { PageHeadingProvider } from "@/components/seo/PageHeading";
import { pageSeo, seoMetadata } from "@/lib/seo";
import { ExtrasSlot } from "@/design/service/slot";
import LiveServiceExtras from "@/design/service/LiveServiceExtras";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getT();
  return seoMetadata("telegram-ads", {
    title: t("Telegram Ads: sponsored messages from $50, no TON needed — ShopMajazi"),
    description: t("Run a Telegram ad in channels, bots or search, paid in dollars from your wallet, card or crypto. No TON or Fragment account. Refunded if rejected."),
    alternates: { canonical: tgPaths.ads },
  });
}

// The live Telegram Ads page: renders whichever design is chosen in /design/page-tg-ads (G), followed by the shared
// sections like the other Telegram pages (how to use, guide, comments, FAQ, blog).
export default async function TelegramAdsPage() {
  const seo = await pageSeo("telegram-ads");
  const decisions = await readDecisions();
  const section = getSection("page-tg-ads")!;
  const offer = section.offers.find((o) => o.id === decisions["page-tg-ads"]?.offer) ?? section.offers.find((o) => o.id === "G")!;
  // The budget and rules picks (/design/tg-ads-budget, /design/tg-ads-rules) go to design G; others ignore them.
  const { Component } = offer;
  return <PageHeadingProvider h1={seo.h1}><ExtrasSlot extras={<LiveServiceExtras service="telegram-ads" />}><Component budget={decisions["tg-ads-budget"]?.offer} rules={decisions["tg-ads-rules"]?.offer} /></ExtrasSlot></PageHeadingProvider>;
}
