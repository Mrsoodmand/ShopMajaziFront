"use client";
import { useMoney } from "@/lib/money";
import { AD_MAX_BUDGET, AD_MIN_BUDGET, tgHeadings } from "@/content/telegram-en";
import { PageShell } from "../otp/parts";
import { useHasExtras } from "../service/slot";
import { accent, AdErrorSummary, AdPreview, AdsCheckout, card, ContactField, GoalRadios, H2, LinkField, ring, TargetingFields, TextField, TgFaq, TgOrderView, Title, Trust, useAds } from "./parts";
import { Estimate, HowItWorks, SubmitAd } from "./ads";

// Ads D — "Budget Calculator": a blue hero that starts with money: drag the budget and see estimated views and
// clicks change. Quick amounts under the slider. The ad form and preview come next, then how it works.

const quick = [50, 100, 250, 500, 1000];

export default function AdsD() {
  const usd = useMoney().format;
  const a = useAds({ budget: 250 });
  const extras = useHasExtras();
  if (a.order) return <PageShell><div className="px-6 py-14"><TgOrderView o={a.order} onAgain={a.reset} /></div></PageShell>;
  return (
    <PageShell>
      <section className={`relative -mt-16 overflow-hidden pb-20 pt-32 ${accent.ads.hero}`}>
        <div aria-hidden className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,.12)_1px,transparent_1px)] bg-[size:22px_22px]" />
        <div className="relative mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:items-center">
          <div>
            <Title s="ads" light sub={tgHeadings.ads.sub}>How many people can you reach?</Title>
            <div className="mt-6"><Trust light items={["No TON needed", "Refund if rejected", "Unspent budget back"]} /></div>
          </div>
          <div className="rounded-[2rem] border border-white/20 bg-white/10 p-6 backdrop-blur-md sm:p-8">
            <label htmlFor="ad-budget-hero" className="text-sm font-semibold uppercase tracking-widest text-white/80">Your budget</label>
            <div className="mt-2 flex items-center gap-3">
              <span aria-hidden className="font-display text-5xl font-bold text-white">$</span>
              <input id="ad-budget-hero" type="number" inputMode="numeric" min={AD_MIN_BUDGET} max={AD_MAX_BUDGET} value={a.f.budget || ""} onChange={(e) => a.set("budget", Number(e.target.value))} aria-describedby="ad-budget-hero-hint"
                className={`w-full rounded-xl bg-transparent font-display text-5xl font-bold tabular-nums text-white [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none ${ring}`} />
            </div>
            <p id="ad-budget-hero-hint" className={`text-sm ${a.allErrors.budget ? "font-semibold text-amber-200" : "text-white/70"}`}>{a.allErrors.budget ?? `${usd(AD_MIN_BUDGET)} to ${usd(AD_MAX_BUDGET)}`}</p>
            <input type="range" aria-label="Budget slider" min={AD_MIN_BUDGET} max={2000} step={10} value={Math.min(2000, Math.max(AD_MIN_BUDGET, a.f.budget || 0))} onChange={(e) => a.set("budget", Number(e.target.value))} className="mt-6 w-full accent-white" />
            <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label="Quick amounts">
              {quick.map((q) => <button key={q} type="button" aria-pressed={a.f.budget === q} onClick={() => a.set("budget", q)} className={`rounded-full border px-3.5 py-1.5 text-sm font-semibold ${a.f.budget === q ? "border-white bg-white text-sky-800" : "border-white/30 text-white hover:border-white/70"} ${ring}`}>{usd(q).replace(".00", "")}</button>)}
            </div>
            <div className="mt-6"><Estimate a={a} dark big /></div>
            <a href="#create" className={`mt-6 flex w-full items-center justify-center rounded-xl bg-white px-6 py-3.5 font-semibold text-sky-800 hover:bg-sky-50 ${ring}`}>Create the ad</a>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 pb-24 pt-20 sm:px-6">
        <section id="create" aria-labelledby="create-h" className="scroll-mt-24">
          <H2 id="create-h">Your ad</H2>
          <div className="mt-6 grid grid-cols-[minmax(0,1fr)] gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
            <div className={`${card} space-y-6 p-6 sm:p-8`}>
              <AdErrorSummary a={a} />
              <GoalRadios a={a} />
              <LinkField a={a} />
              <TextField a={a} />
              <TargetingFields a={a} />
              <ContactField a={a} />
            </div>
            <div className="space-y-5 lg:sticky lg:top-24 lg:self-start">
              <AdPreview a={a} />
              <SubmitAd a={a} className="py-4" />
              <p className="text-center text-sm text-slate-600 dark:text-slate-400">Budget {usd(a.f.budget || 0)} · change it above</p>
            </div>
          </div>
        </section>
        <section aria-labelledby="how" className="mt-20"><H2 id="how">How it works</H2><div className="mt-6"><HowItWorks /></div></section>
        {!extras && <section aria-labelledby="faq" className="mt-16 max-w-3xl"><H2 id="faq">Common questions</H2><div className="mt-6"><TgFaq s="ads" /></div></section>}
      </div>
      <AdsCheckout a={a} />
    </PageShell>
  );
}
