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
  return seoMetadata("telegram-stars", {
    title: t("Buy Telegram Stars: sent to any username in minutes — ShopMajazi"),
    description: t("Telegram Stars delivered to any username in 1–5 minutes. No login, no Fragment account, no TON. Pay less per Star from 1,000 Stars."),
    alternates: { canonical: tgPaths.stars },
  });
}

// The live Telegram Stars page: renders whichever design is chosen in /design/page-tg-stars (L), followed by the
// shared sections (how to use, guide, comments, FAQ, blog).
export default async function TelegramStarsPage() {
  const seo = await pageSeo("telegram-stars");
  const decisions = await readDecisions();
  const section = getSection("page-tg-stars")!;
  const offer = section.offers.find((o) => o.id === decisions["page-tg-stars"]?.offer) ?? section.offers.find((o) => o.id === "L")!;
  const { Component } = offer;
  return <PageHeadingProvider h1={seo.h1}><ExtrasSlot extras={<ServiceExtras service="telegram-stars" />}><Component /></ExtrasSlot></PageHeadingProvider>;
}
