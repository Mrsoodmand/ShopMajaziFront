"use client";

import type { ComponentType } from "react";
import { ArrowRight, Clock, PackageCheck, RotateCcw, Wallet } from "lucide-react";
import { useT } from "@/i18n/client";
import { MoneyProvider, useMoney } from "@/lib/money";
import { GvIcon } from "./parts";
import { primary } from "./clean";

// The Google Voice pre-order card: shown on /google-voice in place of the number list when Numberland is down or has
// nothing to sell (and pre-orders are on in admin). Three versions, compared in /design/gv-preorder; the live page
// shows the one chosen there (falls back to A).
// `reason`: why there are no numbers (the page's message); `price`: the pre-order price; `onStart`: opens payment.

export type PreorderCardProps = { price: number; reason?: string; onStart: () => void };

function useSteps() {
  const t = useT();
  return [
    { icon: Wallet, title: t("Pay now"), text: t("Wallet or bank card, at one fixed price.") },
    { icon: PackageCheck, title: t("We get your number"), text: t("The first number that comes in is yours, usually within a few hours.") },
    { icon: RotateCcw, title: t("Or your money back"), text: t("If we can't deliver, the full amount goes back to your wallet.") },
  ];
}

// A · Steps card: one calm card, the three steps in a row, the price and the button under them.
export function PreorderA({ price, reason, onStart }: PreorderCardProps) {
  const t = useT();
  const money = useMoney();
  const steps = useSteps();
  return (
    <section aria-labelledby="gv-preorder-a" className="rounded-3xl bg-white p-6 ring-1 ring-slate-200 sm:p-10 dark:bg-[#0E1424] dark:ring-white/10">
      {reason && <p className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400"><Clock aria-hidden className="h-4 w-4 shrink-0 text-amber-500" />{reason}</p>}
      <h2 id="gv-preorder-a" className="mt-3 font-display text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-white">{t("Pre-order your Google Voice number")}</h2>
      <ol className="mt-8 grid gap-4 sm:grid-cols-3">
        {steps.map(({ icon: I, title, text }, i) => (
          <li key={title} className="rounded-2xl bg-slate-50 p-5 dark:bg-white/5">
            <span className="flex items-center gap-2 text-sm font-semibold text-emerald-700 dark:text-emerald-400"><I aria-hidden className="h-4 w-4" />{i + 1}</span>
            <div className="mt-2 font-semibold text-slate-900 dark:text-white">{title}</div>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{text}</p>
          </li>
        ))}
      </ol>
      <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-slate-200 pt-6 dark:border-white/10">
        <div>
          <div className="text-sm text-slate-600 dark:text-slate-400">{t("Pre-order price")}</div>
          <div className="font-display text-3xl font-bold tabular-nums text-slate-900 dark:text-white">{money.format(price)}</div>
        </div>
        <button type="button" onClick={onStart} className={primary}>{t("Pre-order now")}<ArrowRight aria-hidden className="h-4 w-4 rtl:rotate-180" /></button>
      </div>
    </section>
  );
}

// B · Reserved line: a phone-line strip with the number still blank, "reserved for you", beside the price and button.
export function PreorderB({ price, reason, onStart }: PreorderCardProps) {
  const t = useT();
  const money = useMoney();
  const steps = useSteps();
  return (
    <section aria-labelledby="gv-preorder-b" className="grid items-center gap-8 rounded-3xl bg-white p-6 ring-1 ring-slate-200 sm:p-10 lg:grid-cols-[1fr_380px] dark:bg-[#0E1424] dark:ring-white/10">
      <div>
        <h2 id="gv-preorder-b" className="font-display text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-white">{t("No numbers in stock. Reserve the next one.")}</h2>
        {reason && <p className="mt-2 text-slate-600 dark:text-slate-400">{reason}</p>}
        <ul className="mt-6 space-y-3">
          {steps.map(({ icon: I, title, text }) => (
            <li key={title} className="flex items-start gap-3">
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300"><I aria-hidden className="h-4 w-4" /></span>
              <span><b className="text-slate-900 dark:text-white">{title}.</b>{" "}<span className="text-slate-600 dark:text-slate-400">{text}</span></span>
            </li>
          ))}
        </ul>
      </div>
      <div className="rounded-2xl bg-slate-50 p-5 ring-1 ring-slate-200 dark:bg-white/5 dark:ring-white/10">
        <div className="flex items-center gap-3">
          <GvIcon />
          <div className="min-w-0">
            <div dir="ltr" className="font-mono text-xl font-bold tracking-tight text-slate-400 rtl:text-end dark:text-white/40">+1 (···) ···-····</div>
            <div className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">{t("Reserved for you once you pay")}</div>
          </div>
        </div>
        <dl className="mt-5 flex items-baseline justify-between border-t border-slate-200 pt-4 dark:border-white/10">
          <dt className="text-slate-600 dark:text-slate-400">{t("Pre-order price")}</dt>
          <dd className="font-display text-2xl font-bold tabular-nums text-slate-900 dark:text-white">{money.format(price)}</dd>
        </dl>
        <button type="button" onClick={onStart} className={`${primary} mt-4 w-full`}>{t("Pre-order now")}</button>
      </div>
    </section>
  );
}

// C · Notice bar: the page's "unavailable" message as one slim bar with the price and a button at its end.
export function PreorderC({ price, reason, onStart }: PreorderCardProps) {
  const t = useT();
  const money = useMoney();
  return (
    <section aria-labelledby="gv-preorder-c" className="flex flex-wrap items-center gap-4 rounded-3xl bg-amber-50 p-5 ring-1 ring-amber-200 sm:p-6 dark:bg-amber-500/10 dark:ring-amber-400/25">
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-amber-400 text-amber-950"><Clock aria-hidden className="h-5 w-5" /></span>
      <div className="min-w-[220px] flex-1">
        <h2 id="gv-preorder-c" className="font-semibold text-slate-900 dark:text-white">{reason ?? t("All Google Voice numbers are sold right now.")}</h2>
        <p className="mt-0.5 text-sm text-slate-700 dark:text-slate-300">{t("Pre-order for {0}: we deliver the first number that comes in, or refund you in full.", { 0: money.format(price) })}</p>
      </div>
      <button type="button" onClick={onStart} className={primary}>{t("Pre-order now")}</button>
    </section>
  );
}

export const preorderCards: Record<string, ComponentType<PreorderCardProps>> = { A: PreorderA, B: PreorderB, C: PreorderC };

// Gallery previews (/design/gv-preorder): each version on the page colour, as the live page shows it.
const sample = { price: 1500000, reason: "Numbers are unavailable right now. Please try again in a minute.", onStart: () => {} };
const preview = (Card: ComponentType<PreorderCardProps>) => function Preview() {
  const t = useT();
  return <MoneyProvider currency="toman"><div className="bg-[#F5F6FB] px-4 py-16 sm:px-6 dark:bg-[#070B14]"><div className="mx-auto max-w-7xl"><Card {...sample} reason={t(sample.reason)} /></div></div></MoneyProvider>;
};
export const PreorderPreviewA = preview(PreorderA);
export const PreorderPreviewB = preview(PreorderB);
export const PreorderPreviewC = preview(PreorderC);
