"use client";

import { createContext, useContext, type ReactNode } from "react";
import { TELEGRAM_PREMIUM, type OrgFamily } from "@/lib/account";
import { subCats, subs, verifyCats, type SubProduct } from "@/content/subs-en";
import { extrasFor } from "@/content/service-extras-en";
import { useMoney } from "@/lib/money";
import { useT } from "@/i18n/client";

// The live Subscriptions pages (/accounts, /accounts/{slug}) get their products from the backend through this
// provider (lib/subs.ts; prices in toman). Without it (the /design previews) the designs use the placeholder
// catalog in content/subs-en.ts.
// `flavor: "verify"`: the Verification pages (/verify, lib/verify.ts) use these same designs with their own products,
// links, buy endpoints and wording (see useFlavor).
export type LiveSubs = { products: SubProduct[]; error?: string; flavor?: "subs" | "verify" };

const Ctx = createContext<LiveSubs | null>(null);

export function LiveSubsProvider({ value, children }: { value: LiveSubs; children: ReactNode }) {
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useLiveSubs(): LiveSubs | null {
  return useContext(Ctx);
}

// Every subscription the page offers: the live ones, or the placeholders (translated) on the design pages.
export function useSubsList(): SubProduct[] {
  const live = useContext(Ctx);
  const tx = useT();
  return live ? live.products : tx.tr(subs);
}

// The sections under a service page (ServiceExtras). "subs:{slug}" pages of live products are written from the
// live product, with its toman prices.
export function useServiceExtras(service: string) {
  const tx = useT();
  const live = useContext(Ctx);
  const money = useMoney();
  return extrasFor(service, tx, live ? { products: live.products, format: money.format } : undefined);
}

// What differs between the Subscriptions pages and the Verification pages that reuse their designs.
export function useFlavor() {
  const verify = useContext(Ctx)?.flavor === "verify";
  return {
    verify,
    base: verify ? "/verify" : "/accounts",
    api: verify ? "verification" : "subscriptions",
    // Business accounts: which of the company's percents applies to a product (App\Services\Organizations::FAMILIES).
    // Telegram Premium is sold here too but takes the Telegram percent (Organizations::TELEGRAM_PREMIUM).
    org: (slug?: string): OrgFamily => (verify ? "verification" : slug === TELEGRAM_PREMIUM ? "telegram" : "subscriptions"),
    // ServiceExtras key for a product's own page (content/service-extras-en.ts extrasFor).
    extras: (slug: string) => `${verify ? "verify" : "subs"}:${slug}`,
    cats: verify ? verifyCats : subCats,
    title: verify ? "Verification" : "Subscriptions",
    all: verify ? "All verification products" : "All subscriptions",
    more: verify ? "More verification products" : "More subscriptions",
    noun: verify ? "products" : "subscriptions",
    search: verify ? "Search verification products" : "Search subscriptions",
    pick: verify ? "Pick a product" : "Pick a subscription",
    again: verify ? "Buy another product" : "Buy another subscription",
  };
}
