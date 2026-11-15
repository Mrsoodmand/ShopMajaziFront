"use client";

import { createContext, useContext, type ReactNode } from "react";
import { premiumPlans, type PremiumPlan } from "@/content/telegram-en";
import { useT } from "@/i18n/client";

// The live /telegram/premium page sells the backend's "telegram-premium" subscription (admin › accounts): its plans
// and toman prices come through this provider, and buying goes through subscriptions/buy like /accounts. Without it
// (the /design previews) the designs keep the sample plans in content/telegram-en.ts.
export type LivePremium = { productId: number; field: string; plans: { id: number; months: number; price: number }[] };

const Ctx = createContext<LivePremium | null>(null);

export function LivePremiumProvider({ value, children }: { value: LivePremium | null; children: ReactNode }) {
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useLivePremium = () => useContext(Ctx);

export type ShownPlan = PremiumPlan & { planId?: number };

// The plans to show: the sample ones' labels and tags with the live plan's id and price (same number of months).
export function usePremiumPlans(): ShownPlan[] {
  const tx = useT();
  const live = useContext(Ctx);
  const sample = tx.tr(premiumPlans) as ShownPlan[];
  if (!live) return sample;
  return sample.flatMap((p) => {
    const l = live.plans.find((x) => x.months === p.months);
    return l ? [{ ...p, price: l.price, planId: l.id }] : [];
  });
}
