"use client";

import { createContext, useContext, type ReactNode } from "react";
import { subs, type SubProduct } from "@/content/subs-en";
import { extrasFor } from "@/content/service-extras-en";
import { useMoney } from "@/lib/money";
import { useT } from "@/i18n/client";

// The live Subscriptions pages (/accounts, /accounts/{slug}) get their products from the backend through this
// provider (lib/subs.ts; prices in toman). Without it (the /design previews) the designs use the placeholder
// catalog in content/subs-en.ts.
export type LiveSubs = { products: SubProduct[]; error?: string };

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
