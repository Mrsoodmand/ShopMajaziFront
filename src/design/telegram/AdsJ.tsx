"use client";
import type { CSSProperties } from "react";
import { useMoney } from "@/lib/money";
import { AD_MAX_BUDGET, AD_MIN_BUDGET, fmt } from "@/content/telegram-en";
import { AdContentFields, AdErrors, AdsNightPage, AudienceFields, CpmBudgetFields, focusRing, Money, muted, OrderCard, Panel, PlacementCards, ScheduleFields, useAdForm, type Ad } from "./adsKit";

// Ads J — "Reach Field": starts with money. One big budget with a slider, and a field of 200 dots where each lit
// dot is a fixed number of views; changing the budget or CPM lights the dots in one sweep. CPM and the daily limit
// sit under it; where, your ad and schedule follow. The sidebar keeps preview, summary and green Continue (the
// estimate lives in the field, so the sidebar leaves it out).

const DOTS = 200;
// Fixed steps so the field means something: 1,000 views a dot until it's full, then 10,000, then 100,000.
const units = [1000, 10000, 100000];

function ReachField({ a }: { a: Ad }) {
  const unit = units.find((u) => a.views / u <= DOTS) ?? units[units.length - 1];
  const lit = Math.min(DOTS, Math.max(a.views > 0 ? 1 : 0, Math.round(a.views / unit)));
  return (
    <figure className="rounded-2xl bg-black/25 p-4 sm:p-5">
      <div aria-hidden key={`${lit}-${unit}`} className="grid grid-cols-25 gap-1 sm:grid-cols-40 sm:gap-1.5">
        {Array.from({ length: DOTS }, (_, i) => (
          <span key={i} className={`aspect-square rounded-full ${i < lit ? "animate-pop bg-sky-300" : "bg-white/10"}`} style={i < lit ? ({ animationDelay: `${Math.min(i * 4, 700)}ms` } as CSSProperties) : undefined} />
        ))}
      </div>
      <figcaption aria-live="polite" className="mt-4 flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
        <span>
          <span className="block font-display text-3xl font-bold tabular-nums text-white">~{fmt(a.views)} views</span>
          <span className={`block text-sm ${muted}`}>about {fmt(a.lo)}–{fmt(a.hi)} clicks</span>
        </span>
        <span className={`flex items-center gap-2 text-sm ${muted}`}><span aria-hidden className="h-2.5 w-2.5 rounded-full bg-sky-300" />Each dot is about {fmt(unit)} views</span>
      </figcaption>
    </figure>
  );
}

function BudgetPanel({ a }: { a: Ad }) {
  const usd = useMoney().format;
  const { p, errors } = a;
  return (
    <Panel id={`${p}-money`} title="How much do you want to spend?">
      <div className="grid gap-5 sm:grid-cols-[minmax(0,14rem)_minmax(0,1fr)] sm:items-end">
        <div>
          <label htmlFor={`${p}-budget`} className="block text-base font-semibold text-white">Budget</label>
          <p id={`${p}-budget-hint`} className={`text-sm ${muted}`}>From {usd(AD_MIN_BUDGET)}. Unspent money is refunded.</p>
          {errors.budget && <p id={`${p}-budget-error`} className="mt-1 text-sm font-semibold text-red-300"><span className="sr-only">Error: </span>{errors.budget}</p>}
          <div className="mt-2"><Money id={`${p}-budget`} big value={a.budget} onChange={a.setBudget} onBlur={() => a.touch("budget")} error={errors.budget} hint /></div>
        </div>
        <div className="pb-3">
          <label htmlFor={`${p}-range`} className="sr-only">Budget slider</label>
          <input id={`${p}-range`} type="range" min={AD_MIN_BUDGET} max={AD_MAX_BUDGET} step={10} value={Math.min(AD_MAX_BUDGET, Math.max(AD_MIN_BUDGET, a.budget || AD_MIN_BUDGET))}
            onChange={(e) => a.setBudget(Number(e.target.value))} aria-valuetext={usd(a.budget)} className={`h-2 w-full cursor-pointer accent-sky-400 ${focusRing}`} />
          <div className={`mt-1.5 flex justify-between text-sm tabular-nums ${muted}`}><span>{usd(AD_MIN_BUDGET)}</span><span>{usd(AD_MAX_BUDGET)}</span></div>
        </div>
      </div>
      <ReachField a={a} />
      <CpmBudgetFields ad={a} budget={false} />
    </Panel>
  );
}

export default function AdsJ() {
  const a = useAdForm();
  return (
    <AdsNightPage ad={a} sub="Start with your budget and see how many people it can reach. We set up the campaign, so you don't need TON or a Fragment account."
      side={<OrderCard ad={a} estimate={false} />}
      left={<>
        <AdErrors ad={a} />
        <BudgetPanel a={a} />
        <Panel id={`${a.p}-where`} title="Where to show it"><PlacementCards ad={a} /><AudienceFields ad={a} /></Panel>
        <Panel id={`${a.p}-ad`} title="Your ad"><AdContentFields ad={a} /></Panel>
        <Panel id={`${a.p}-when`} title="Schedule"><ScheduleFields ad={a} /></Panel>
      </>} />
  );
}
