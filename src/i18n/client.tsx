"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import { DEFAULT_LOCALE, type Locale } from "./config";
import { makeT, type Prices, type T } from "./translate";

const Ctx = createContext<{ locale: Locale; prices: Prices | null }>({ locale: "en", prices: null });

// Set once in the root layout from the request's locale. `prices`: the dollar rate and live lowest prices the
// Persian site shows prices with (i18n/server.ts getPrices).
export function LocaleProvider({ locale, prices = null, children }: { locale: Locale; prices?: Prices | null; children: ReactNode }) {
  const value = useMemo(() => ({ locale, prices }), [locale, prices]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useLocale = () => useContext(Ctx).locale;
export const isDefaultLocale = (l: Locale) => l === DEFAULT_LOCALE;

// t("English text", { vars }) → text in the current language; t.tr(content) translates a whole content object;
// t.usd(n) shows a dollar price the way this language shows prices.
// One T per language (and per prices object, which stays the same while the layout is mounted), shared by every
// component, so translated content objects keep their identity.
const plain: Partial<Record<Locale, T>> = {};
const priced: Record<Locale, WeakMap<Prices, T>> = { en: new WeakMap(), fa: new WeakMap() };
function tFor(locale: Locale, prices: Prices | null): T {
  if (!prices) return (plain[locale] ??= makeT(locale));
  let t = priced[locale].get(prices);
  if (!t) priced[locale].set(prices, (t = makeT(locale, prices)));
  return t;
}

export function useT(): T {
  const { locale, prices } = useContext(Ctx);
  return tFor(locale, prices);
}
