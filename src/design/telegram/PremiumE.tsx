"use client";
import { ChevronDown, Crown } from "lucide-react";
import { useMoney } from "@/lib/money";
import { PageShell } from "../otp/parts";
import { useHasExtras } from "../service/slot";
import { accent, H2, PremiumCheckout, ring, TgFaq, TgOrderView, Trust, UsernameField, usePremium } from "./parts";
import { FeatureList, PlanRadios } from "./premium";

// Premium E — "One Card": the whole purchase in one small card that fits a phone screen: a purple header, the plan
// as three segments, the username, Buy. Features fold away under the card.
export default function PremiumE() {
  const usd = useMoney().format;
  const pm = usePremium();
  const extras = useHasExtras();
  if (pm.order) return <PageShell><div className="px-6 py-14"><TgOrderView o={pm.order} onAgain={pm.reset} /></div></PageShell>;
  return (
    <PageShell>
      <div className="mx-auto max-w-md px-4 pb-24 pt-10 sm:pt-16">
        <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-2xl shadow-violet-900/10 dark:border-white/15 dark:bg-[#0E1424]">
          <div className={`relative px-6 pb-8 pt-8 text-center text-white ${accent.premium.hero}`}>
            <div aria-hidden className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,.15)_1px,transparent_1px)] bg-[size:14px_14px]" />
            <Crown aria-hidden className="relative mx-auto h-10 w-10" />
            <h1 className="relative mt-3 font-display text-3xl font-bold">Telegram Premium</h1>
            <p className="relative mt-1 text-white/85">Gifted to your username</p>
          </div>
          <div className="space-y-6 p-6">
            <PlanRadios pm={pm} layout="row" legend="Plan" />
            <UsernameField r={pm.r} s="premium" hint="" />
            <button type="button" onClick={pm.proceed} className={`${accent.premium.btn} w-full py-4 text-lg`}>Buy · {usd(pm.total)}</button>
            <Trust items={["No login", "Minutes", "Refund if it fails"]} />
          </div>
        </div>

        <details className="group mt-5 rounded-3xl border border-slate-200 bg-white p-5 dark:border-white/15 dark:bg-[#0E1424] [&_summary::-webkit-details-marker]:hidden">
          <summary className={`flex cursor-pointer list-none items-center justify-between rounded-lg font-semibold text-slate-900 dark:text-white ${ring}`}>What&apos;s included<ChevronDown aria-hidden className="h-4 w-4 transition group-open:rotate-180" /></summary>
          <div className="mt-4"><FeatureList /></div>
        </details>
        {!extras && <section aria-labelledby="faq" className="mt-12"><H2 id="faq" className="text-xl">Questions</H2><div className="mt-4"><TgFaq s="premium" /></div></section>}
      </div>
      <PremiumCheckout pm={pm} />
    </PageShell>
  );
}
