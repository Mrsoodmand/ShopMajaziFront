import { cache } from "react";
import { headers } from "next/headers";
import { LOCALE_HEADER, type Locale } from "./config";
import { makeT, type Prices } from "./translate";
import { storefront } from "@/lib/backend";

// The request's language, set by the middleware. Routes it skips (/design) stay English.
export async function getLocale(): Promise<Locale> {
  return (await headers()).get(LOCALE_HEADER) === "fa" ? "fa" : "en";
}

// The dollar rate and live lowest prices that the Persian site shows prices with (see translate.ts › Prices).
// Only Persian needs them. Cached for 10 minutes; if the backend is down, prices stay in dollars.
export const getPrices = cache(async (): Promise<Prices | null> => {
  if ((await getLocale()) !== "fa") return null;
  try {
    return await storefront<Prices>("prices", 600);
  } catch (e) {
    console.error("prices: backend unavailable", e);
    return null;
  }
});

export async function getT() {
  const [locale, prices] = await Promise.all([getLocale(), getPrices()]);
  return makeT(locale, prices);
}
