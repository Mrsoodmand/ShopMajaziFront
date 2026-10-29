"use client";

import { tgHeadings } from "@/content/telegram-en";
import { PageShell } from "../otp/parts";
import { useHasExtras } from "../service/slot";
import { card, H2, PremiumCheckout, TgFaq, TgOrderView, Title, Trust, UsernameField, usePremium } from "./parts";
import { BuyPremium, CompareRows, FeatureGrid, PlanRadios } from "./premium";

// Premium A — "Pricing Page": centered title, the three plans as pricing cards (price per month and saving on each),
// the username right under them and one Buy button. Features and Free vs Premium below.
export default function PremiumA() {
  const pm = usePremium();
  const extras = useHasExtras();
  if (pm.order) return <PageShell><div className="px-6 py-14"><TgOrderView o={pm.order} onAgain={pm.reset} /></div></PageShell>;
  return (
    <PageShell>
      <div className="mx-auto max-w-6xl px-4 pb-24 pt-14 sm:px-6">
        <Title s="premium" center sub={tgHeadings.premium.sub}>{tgHeadings.premium.h1}</Title>
        <div className="mt-6 flex justify-center"><Trust items={["Gift to your username", "No password needed", "Active in minutes"]} /></div>

        <section aria-label="Choose a plan" className={`${card} mx-auto mt-10 max-w-3xl space-y-8 p-6 sm:p-8`}>
          <PlanRadios pm={pm} legend="Choose a plan" />
          <UsernameField r={pm.r} s="premium" />
          <BuyPremium pm={pm} className="py-4 text-lg" />
        </section>

        <section aria-labelledby="feat" className="mt-20"><H2 id="feat">Everything in Premium</H2><div className="mt-6"><FeatureGrid /></div></section>

        <section aria-labelledby="cmp" className="mx-auto mt-20 max-w-3xl">
          <H2 id="cmp">Free or Premium?</H2>
          <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-300 dark:border-white/15">
            <table className="w-full min-w-[440px] text-[15px]">
              <caption className="sr-only">Telegram Free and Premium compared</caption>
              <thead className="bg-slate-50 dark:bg-white/5"><tr><td className="px-4 py-3" /><th scope="col" className="px-4 py-3 text-center font-semibold text-slate-900 dark:text-white">Free</th><th scope="col" className="bg-violet-100 px-4 py-3 text-center font-semibold text-violet-900 dark:bg-violet-400/20 dark:text-violet-200">Premium</th></tr></thead>
              <tbody className="divide-y divide-slate-200 dark:divide-white/10"><CompareRows /></tbody>
            </table>
          </div>
        </section>
        {!extras && <section aria-labelledby="faq" className="mx-auto mt-16 max-w-3xl"><H2 id="faq">Common questions</H2><div className="mt-6"><TgFaq s="premium" /></div></section>}
      </div>
      <PremiumCheckout pm={pm} />
    </PageShell>
  );
}
