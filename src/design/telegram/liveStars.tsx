"use client";

import { createContext, useContext, type ReactNode } from "react";

// The live /telegram/stars page sells the backend's "telegram-stars" service (Laravel App\Services\TelegramStars,
// admin › خدمات مجازی › تلگرام استارز): the admin's plans, the any-amount range, and the dollar price per Star. Buying
// goes through services/buy like the other social services. `off`: sales are switched off or the backend is down.
// Without the provider (the /design previews) the designs keep the sample prices in content/telegram-en.ts.
export type LiveStars =
  | { off: false; serviceId: number; field: string; min: number; max: number; dollarPer1000: number; rate: number; plans: { id: number; count: number; name: string; price: number }[] }
  | { off: true };

const Ctx = createContext<LiveStars | null>(null);

export function LiveStarsProvider({ value, children }: { value: LiveStars; children: ReactNode }) {
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useLiveStars = () => useContext(Ctx);

// Toman for `n` Stars the way the server prices it (VirtualServiceOrders::dollarPrice): dollars × rate, rounded to
// the toman, then the last two digits to 00 or 50. A plan's own price when `n` is a plan.
export function liveStarPrice(live: Extract<LiveStars, { off: false }>, n: number): number {
  const plan = live.plans.find((p) => p.count === n);
  if (plan) return plan.price;
  const t = Math.round((live.dollarPer1000 / 1000) * n * live.rate);
  return t - (t % 100) + (t % 100 >= 50 ? 50 : 0);
}
