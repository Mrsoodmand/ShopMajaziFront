import type { Metadata } from "next";
import { getT } from "@/i18n/server";
import { getSection } from "@/design/registry";
import { readDecisions } from "@/components/design/decisions";
import { applePaths, appleTitles, type AppleMethod } from "@/content/apple-en";
import { ExtrasSlot } from "@/design/service/slot";
import ServiceExtras from "@/design/service/ServiceExtras";
import { LiveAppleProvider, type LiveApple } from "@/design/appleId/live";
import { MoneyProvider } from "@/lib/money";
import { storefront } from "@/lib/backend";
import type { ApiAppleId } from "@/lib/apple-id";
import { PageHeadingProvider } from "@/components/seo/PageHeading";
import { pageSeo, seoMetadata, type SeoKey } from "@/lib/seo";

// Shared by /apple-id, /apple-id/usa (opens on Ready) and /apple-id/custom (opens on Custom).

const descriptions: Record<AppleMethod | "all", string> = {
  all: "Get a verified US Apple ID delivered instantly, or a custom one made with your own name, email and birthday in about 10 minutes.",
  ready: "A ready-made, verified USA Apple ID delivered the moment you pay. Buy 1 to 10, or partner packs for resellers.",
  custom: "A USA Apple ID created with your own name, email and birthday. Easier to recover, ready in about 10 minutes.",
};

// The admin's SEO entry for each address (React admin › SEO).
const seoKey = (method?: AppleMethod): SeoKey => (method === "ready" ? "apple-id-usa" : method === "custom" ? "apple-id-custom" : "apple-id");

export async function appleMetadata(method?: AppleMethod): Promise<Metadata> {
  const t = await getT();
  const key = method ?? "all";
  return seoMetadata(seoKey(method), { title: t(appleTitles[key]), description: t(descriptions[key]), alternates: { canonical: method ? applePaths[method] : "/apple-id" } });
}

// Prices and ready stock from the backend. Kept fresh: stock changes with every sale.
async function loadLive(): Promise<LiveApple> {
  const t = await getT();
  try {
    const d = await storefront<ApiAppleId>("apple-id", 0);
    return {
      readyPrice: d.ready_price, customPrice: d.custom_price, stock: d.stock, maxQty: d.max_qty,
      packs: d.packs.map((qty) => ({ qty, each: d.ready_price })),
      error: d.ready_price > 0 && d.custom_price > 0 ? undefined : t("Apple ID sales are paused for a moment. Please try again a little later."),
    };
  } catch (e) {
    console.error("apple-id: backend unavailable", e);
    return { readyPrice: 0, customPrice: 0, stock: 0, maxQty: 10, packs: [], error: t("Apple IDs are unavailable right now. Please try again in a minute.") };
  }
}

// Renders whichever page design is chosen in /design/page-apple-id (falls back to A), opened on `method`.
// Prices, stock and paying come from the backend (see design/appleId/parts.tsx useApple).
export async function ApplePage({ method }: { method?: AppleMethod }) {
  const [decisions, live, seo] = await Promise.all([readDecisions(), loadLive(), pageSeo(seoKey(method))]);
  const section = getSection("page-apple-id")!;
  const offer = section.offers.find((o) => o.id === decisions["page-apple-id"]?.offer) ?? section.offers.find((o) => o.id === "A")!;
  const { Component } = offer;
  // How to use, content, comments, FAQ and blog follow the design (see ServiceExtras).
  // Each address has its own how-to, guide, comments and FAQ (no duplicate content between the three pages).
  const service = method === "ready" ? "apple-id-usa" : method === "custom" ? "apple-id-custom" : "apple-id";
  return (
    <PageHeadingProvider h1={seo.h1}>
      <MoneyProvider currency="toman">
        <LiveAppleProvider value={live}>
          <ExtrasSlot extras={<ServiceExtras service={service} />} glow="sky"><Component method={method} /></ExtrasSlot>
        </LiveAppleProvider>
      </MoneyProvider>
    </PageHeadingProvider>
  );
}
