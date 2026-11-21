import { cache } from "react";
import { AD_MIN_BUDGET_TOMAN } from "@/content/telegram-en";
import { headers } from "next/headers";
import { LOCALE_HEADER, type Locale } from "./config";
import { makeT, type Prices } from "./translate";
import { storefront } from "@/lib/backend";

// The request's language, set by the middleware. Routes it skips (/design) stay English.
export async function getLocale(): Promise<Locale> {
  return (await headers()).get(LOCALE_HEADER) === "fa" ? "fa" : "en";
}

// The dollar rate and live lowest prices that the Persian site shows prices with (see translate.ts › Prices), and
// the admin-chosen menu and home items both languages use. Cached for 10 minutes; if the backend is down, prices
// stay in dollars and the built-in menu stays.
export const getPrices = cache(async (): Promise<Prices | null> => {
  try {
    const p = await storefront<Prices>("prices", 600);
    // Telegram Ads has no backend price: its "from" (menu, home catalog) is the Persian minimum budget.
    return { ...p, from: { ...p.from, "/telegram/ads": AD_MIN_BUDGET_TOMAN } };
  } catch (e) {
    console.error("prices: backend unavailable", e);
    return null;
  }
});

export async function getT() {
  const [locale, prices] = await Promise.all([getLocale(), getPrices()]);
  return makeT(locale, prices);
}
