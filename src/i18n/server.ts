import { cache } from "react";
import { AD_MIN_BUDGET_TOMAN } from "@/content/telegram-en";
import { headers } from "next/headers";
import { LOCALE_HEADER, type Locale } from "./config";
import { makeT, type Picks, type Prices } from "./translate";
import { storefront } from "@/lib/backend";

// The request's language, set by the middleware. Routes it skips (/design) stay English.
export async function getLocale(): Promise<Locale> {
  return (await headers()).get(LOCALE_HEADER) === "fa" ? "fa" : "en";
}

// The dollar rate and live lowest prices that the Persian site shows prices with (see translate.ts › Prices), plus
// the admin-chosen menu and home items both languages use (`picks`). Two backend sections, cached apart:
// - "prices" for 10 minutes (they follow the dollar rate and plan prices);
// - "picks" for an hour, and dropped at once whenever the admin saves an account, service, platform or
//   verification product (Back: CacheManager::refreshPicks); Laravel keeps its own copy until then.
// If the backend is down, prices stay in dollars and the built-in menu and home items stay.
export const getPrices = cache(async (): Promise<Prices | null> => {
  const [p, picks] = await Promise.all([
    storefront<Omit<Prices, "picks">>("prices", 600).catch((e) => { console.error("prices: backend unavailable", e); return null; }),
    storefront<Picks>("picks", 3600).catch((e) => { console.error("picks: backend unavailable", e); return null; }),
  ]);
  if (!p && !picks) return null;
  // Telegram Ads has no backend price: its "from" (home catalog) is the Persian minimum budget.
  return { usd: p?.usd ?? 0, from: { ...p?.from, "/telegram/ads": AD_MIN_BUDGET_TOMAN }, ...(picks ? { picks } : {}) };
});

export async function getT() {
  const [locale, prices] = await Promise.all([getLocale(), getPrices()]);
  return makeT(locale, prices);
}
