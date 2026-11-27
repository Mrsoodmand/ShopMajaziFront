import type { Metadata } from "next";
import { getT } from "@/i18n/server";
import { section } from "@/design/chosen/page-tg-stars";
import { readDecisions } from "@/components/design/decisions";
import { tgPaths } from "@/content/telegram-en";
import { ExtrasSlot } from "@/design/service/slot";
import LiveServiceExtras from "@/design/service/LiveServiceExtras";
import { PageHeadingProvider } from "@/components/seo/PageHeading";
import { pageSeo, seoMetadata } from "@/lib/seo";
import { storefront } from "@/lib/backend";
import { MoneyProvider } from "@/lib/money";
import { LiveStarsProvider, type LiveStars } from "@/design/telegram/liveStars";

// The backend's Telegram Stars (admin › خدمات مجازی › تلگرام استارز). Off in admin or backend down: `off`, and the page
// says sales are paused instead of taking orders it can't fill.
async function loadStars(): Promise<LiveStars> {
  try {
    const d = await storefront<{ enabled: boolean; service_id: number; field: string; min: number; max: number; dollar_per_1000: number; rate: number; plans: { id: number; count: number; name: string; price: number }[] }>("telegram-stars", 60);
    if (!d.enabled) return { off: true };
    return { off: false, serviceId: d.service_id, field: d.field, min: d.min, max: d.max, dollarPer1000: d.dollar_per_1000, rate: d.rate, plans: d.plans };
  } catch (e) {
    console.error("telegram-stars: backend unavailable", e);
    return { off: true };
  }
}

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
  const [seo, live] = await Promise.all([pageSeo("telegram-stars"), loadStars()]);
  const decisions = await readDecisions();
  const offer = section.offers.find((o) => o.id === decisions["page-tg-stars"]?.offer) ?? section.offers.find((o) => o.id === "L")!;
  const { Component } = offer;
  return (
    <MoneyProvider currency="toman">
      <LiveStarsProvider value={live}>
        <PageHeadingProvider h1={seo.h1}><ExtrasSlot extras={<LiveServiceExtras service="telegram-stars" />}><Component /></ExtrasSlot></PageHeadingProvider>
      </LiveStarsProvider>
    </MoneyProvider>
  );
}
