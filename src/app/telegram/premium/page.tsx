import type { Metadata } from "next";
import { getT } from "@/i18n/server";
import { getSection } from "@/design/registry";
import { readDecisions } from "@/components/design/decisions";
import { tgPaths } from "@/content/telegram-en";
import { ExtrasSlot } from "@/design/service/slot";
import LiveServiceExtras from "@/design/service/LiveServiceExtras";
import { PageHeadingProvider } from "@/components/seo/PageHeading";
import { pageSeo, seoMetadata } from "@/lib/seo";
import { storefront } from "@/lib/backend";
import { MoneyProvider } from "@/lib/money";
import { LivePremiumProvider, type LivePremium } from "@/design/telegram/livePremium";

// The backend's Telegram Premium subscription (admin › accounts › telegram-premium): plans with months and toman
// prices, and the field the username goes in. null when the backend is down or the product is off.
async function loadPremium(): Promise<LivePremium | null> {
  try {
    const { account } = await storefront<{ account: { id: number; plans: { id: number; months: number | null; price: number }[]; fields: { name: string }[] } }>("accounts/telegram-premium", 60);
    const plans = account.plans.filter((p) => p.months && p.price > 0).map((p) => ({ id: p.id, months: p.months!, price: p.price }));
    return plans.length && account.fields[0] ? { productId: account.id, field: account.fields[0].name, plans } : null;
  } catch {
    return null;
  }
}

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
  const [seo, live] = await Promise.all([pageSeo("telegram-premium"), loadPremium()]);
  const decisions = await readDecisions();
  const section = getSection("page-tg-premium")!;
  const offer = section.offers.find((o) => o.id === decisions["page-tg-premium"]?.offer) ?? section.offers.find((o) => o.id === "S")!;
  const { Component } = offer;
  const page = <PageHeadingProvider h1={seo.h1}><ExtrasSlot extras={<LiveServiceExtras service="telegram-premium" />}><Component /></ExtrasSlot></PageHeadingProvider>;
  // Live: real plans in toman, bought as the telegram-premium subscription. Backend down: the sample page as before.
  return live ? <MoneyProvider currency="toman"><LivePremiumProvider value={live}>{page}</LivePremiumProvider></MoneyProvider> : page;
}
