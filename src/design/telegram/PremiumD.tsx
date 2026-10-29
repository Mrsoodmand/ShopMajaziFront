"use client";
import { Crown } from "lucide-react";
import { useMoney } from "@/lib/money";
import { perMonth, tgHeadings } from "@/content/telegram-en";
import { PageShell } from "../otp/parts";
import { useHasExtras } from "../service/slot";
import { accent, H2, PremiumCheckout, TgFaq, TgOrderView, Title, UsernameField, usePremium } from "./parts";
import { CompareRows, PlanRadios } from "./premium";

// Premium D — "Free vs Premium": the page is the comparison. A table with Free and Premium side by side; the Premium
// column is highlighted and its header holds the price. Plans and the username sit in a bar right under the table,
// so you decide and buy in one place.
export default function PremiumD() {
  const usd = useMoney().format;
  const pm = usePremium();
  const extras = useHasExtras();
  if (pm.order) return <PageShell><div className="px-6 py-14"><TgOrderView o={pm.order} onAgain={pm.reset} /></div></PageShell>;
  return (
    <PageShell>
      <div className="mx-auto max-w-4xl px-4 pb-24 pt-14 sm:px-6">
        <Title s="premium" center sub="See what changes, then pick a plan. Gifted to your username, no login needed.">{`${tgHeadings.premium.h1}: what you get`}</Title>

        <div className="mt-10 overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-xl shadow-slate-900/5 dark:border-white/15 dark:bg-[#0E1424]">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[480px] text-[15px]">
              <caption className="sr-only">Telegram Free and Premium compared</caption>
              <thead>
                <tr>
                  <td className="w-1/2 px-4 py-5" />
                  <th scope="col" className="px-4 py-5 text-center align-bottom"><span className="block font-display text-lg font-semibold text-slate-900 dark:text-white">Free</span><span className="text-sm font-normal text-slate-500">$0</span></th>
                  <th scope="col" className={`px-4 py-5 text-center align-bottom text-white ${accent.premium.hero}`}>
                    <Crown aria-hidden className="mx-auto h-6 w-6" />
                    <span className="mt-1 block font-display text-lg font-semibold">Premium</span>
                    <span aria-live="polite" className="text-sm font-normal text-white/85">{usd(perMonth(pm.plan))}/mo</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-white/10"><CompareRows /></tbody>
            </table>
          </div>
          <section aria-label="Buy Premium" className="grid gap-6 border-t border-slate-200 bg-slate-50 p-6 sm:p-8 md:grid-cols-2 dark:border-white/10 dark:bg-white/[.03]">
            <PlanRadios pm={pm} layout="list" legend="Plan" />
            <div className="flex flex-col gap-5">
              <UsernameField r={pm.r} s="premium" />
              <button type="button" onClick={pm.proceed} className={`${accent.premium.btn} mt-auto w-full py-4`}>Upgrade · {usd(pm.total)}</button>
            </div>
          </section>
        </div>
        {!extras && <section aria-labelledby="faq" className="mt-16"><H2 id="faq">Common questions</H2><div className="mt-6"><TgFaq s="premium" /></div></section>}
      </div>
      <PremiumCheckout pm={pm} />
    </PageShell>
  );
}
