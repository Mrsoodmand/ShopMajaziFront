"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import { premiumFeatures, tgHeadings } from "@/content/telegram-en";
import { PageShell } from "../otp/parts";
import { useHasExtras } from "../service/slot";
import { accent, card, H2, PremiumCheckout, ring, TgFaq, TgOrderView, Title, UsernameField, usePremium } from "./parts";
import { BuyPremium, featureIcons, PlanRadios, PremiumSummary } from "./premium";

// Premium C — "Feature Tour": a purple hero; below it the features as keyboard tabs (arrow keys move between them),
// each with a large picture of what changes. The buy box with plans and username stays beside the tour.
export default function PremiumC() {
  const pm = usePremium();
  const extras = useHasExtras();
  const [tab, setTab] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  if (pm.order) return <PageShell><div className="px-6 py-14"><TgOrderView o={pm.order} onAgain={pm.reset} /></div></PageShell>;
  const f = premiumFeatures[tab];
  const I = featureIcons[f.id];
  const onKey = (e: KeyboardEvent) => {
    const n = premiumFeatures.length;
    const to = e.key === "ArrowDown" || e.key === "ArrowRight" ? (tab + 1) % n : e.key === "ArrowUp" || e.key === "ArrowLeft" ? (tab - 1 + n) % n : e.key === "Home" ? 0 : e.key === "End" ? n - 1 : -1;
    if (to < 0) return;
    e.preventDefault(); setTab(to); tabs.current[to]?.focus();
  };
  return (
    <PageShell>
      <section className={`relative -mt-16 overflow-hidden pb-28 pt-32 ${accent.premium.hero}`}>
        <div aria-hidden className="absolute -end-20 -top-20 h-96 w-96 rounded-full bg-fuchsia-400/30 blur-3xl" />
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6"><Title s="premium" light sub={tgHeadings.premium.sub}>{tgHeadings.premium.h1}</Title></div>
      </section>

      <div className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
        <div className="grid grid-cols-[minmax(0,1fr)] gap-10 lg:grid-cols-[minmax(0,1fr)_380px]">
          <aside className="relative z-10 -mt-16 lg:col-start-2 lg:row-start-1">
            <div className="lg:sticky lg:top-24">
              <PremiumSummary pm={pm}>
                <div className="mt-5 space-y-6"><PlanRadios pm={pm} layout="row" legend="Plan" /><UsernameField r={pm.r} s="premium" hint="We never need your login." /><BuyPremium pm={pm} label="Get Premium" /></div>
              </PremiumSummary>
            </div>
          </aside>

          <section aria-labelledby="tour" className="lg:col-start-1 lg:row-start-1 lg:pt-10">
            <H2 id="tour">What you get</H2>
            <div className="mt-6 grid gap-5 md:grid-cols-[220px_minmax(0,1fr)]">
              <div role="tablist" aria-orientation="vertical" aria-label="Premium features" onKeyDown={onKey} className="flex gap-1.5 overflow-x-auto pb-1 md:flex-col md:overflow-visible">
                {premiumFeatures.map((x, i) => {
                  const on = i === tab;
                  const Ic = featureIcons[x.id];
                  return (
                    <button key={x.id} ref={(el) => { tabs.current[i] = el; }} role="tab" id={`pt-${x.id}`} aria-selected={on} aria-controls="pt-panel" tabIndex={on ? 0 : -1} onClick={() => setTab(i)}
                      className={`flex shrink-0 items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-start text-[15px] font-semibold transition-colors ${on ? "bg-violet-600 text-white dark:bg-violet-500" : "text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/5"} ${ring}`}>
                      <Ic aria-hidden className="h-4 w-4" />{x.title}
                    </button>
                  );
                })}
              </div>
              <div role="tabpanel" id="pt-panel" aria-labelledby={`pt-${f.id}`} tabIndex={0} className={`${card} flex min-h-[320px] flex-col items-center justify-center overflow-hidden p-8 text-center ${ring}`}>
                <div key={f.id} className="animate-fade-up [animation-duration:400ms]">
                  <span aria-hidden className={`mx-auto grid h-24 w-24 place-items-center rounded-[2rem] ${accent.premium.hero} text-white shadow-xl shadow-violet-600/30`}><I className="h-11 w-11" /></span>
                  <h3 className="mt-6 font-display text-2xl font-bold text-slate-900 dark:text-white">{f.title}</h3>
                  <p className="mx-auto mt-2 max-w-sm text-lg text-slate-700 dark:text-slate-300">{f.text}</p>
                  <p className="mt-6 text-sm text-slate-500">{tab + 1} of {premiumFeatures.length}</p>
                </div>
              </div>
            </div>
          </section>
        </div>
        {!extras && <section aria-labelledby="faq" className="mt-20 max-w-3xl"><H2 id="faq">Common questions</H2><div className="mt-6"><TgFaq s="premium" /></div></section>}
      </div>
      <PremiumCheckout pm={pm} />
    </PageShell>
  );
}
