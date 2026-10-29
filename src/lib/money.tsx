"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import { WALLET_BALANCE } from "@/content/otp-en";
import { useLocale, useT } from "@/i18n/client";
import { toman } from "@/i18n/translate";
import { useAccount } from "./account";

export { toman };

// How prices are shown. Live pages (MoneyProvider currency="toman") get real Toman prices from the backend and the
// signed-in user's wallet. Everywhere else prices are still sample dollars: shown as dollars in English and as
// Toman in Persian (converted with the backend's dollar rate, see i18n/translate.ts › Prices).
// `format` takes a price in the page's own unit; `wallet` is in that unit too.
export type Currency = "usd" | "toman";
export type Money = { currency: Currency; format: (n: number) => string; wallet: number | null };

const Ctx = createContext<Money | null>(null);

export function MoneyProvider({ currency, children }: { currency: Currency; children: ReactNode }) {
  const locale = useLocale();
  const t = useT();
  const { wallet } = useAccount();
  const value = useMemo<Money>(() => currency === "toman"
    ? { currency, format: (n) => toman(n, locale), wallet }
    : { currency, format: t.usd, wallet: WALLET_BALANCE }, [currency, locale, t, wallet]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useMoney(): Money {
  const ctx = useContext(Ctx);
  const t = useT();
  const fallback = useMemo<Money>(() => ({ currency: "usd", format: t.usd, wallet: WALLET_BALANCE }), [t]);
  return ctx ?? fallback;
}
