"use client";
import { useId, useState } from "react";
import { useMoney } from "@/lib/money";
import { useT } from "@/i18n/client";
import { PopularBadge } from "./parts";

// The colour of the chosen plan row in the subscription buy box (product panel J · Filled Rows). Gallery section
// "subs-plan-select" (/design/subs-plan-select) shows each tone on sample rows; the live panel (panels.tsx ›
// PanelSplit) reads the picked one from PLAN_TONE below.
// `row`: the chosen row. `price`: its price. `fill`: true when the row is a solid colour (the badge then gets a
// deeper shadow to lift off it).
export type PlanTone = { row: string; price: string; fill: boolean };

export const planTones: Record<string, PlanTone> = {
  // A · Violet fill (as it was)
  A: { row: "border-violet-600 bg-violet-600 text-white dark:border-violet-400 dark:bg-violet-400 dark:text-violet-950", price: "font-bold", fill: true },
  // B · Emerald fill, the site's own green
  B: { row: "border-emerald-600 bg-emerald-600 text-white dark:border-emerald-400 dark:bg-emerald-400 dark:text-emerald-950", price: "font-bold", fill: true },
  // C · Indigo fill, the colour of the pay buttons
  C: { row: "border-indigo-600 bg-indigo-600 text-white dark:border-indigo-500 dark:bg-indigo-500 dark:text-white", price: "font-bold", fill: true },
  // D · Violet outline on a soft tint: quieter, so the gold badge leads
  D: { row: "border-violet-600 bg-violet-50 text-violet-950 ring-1 ring-violet-600 dark:border-violet-400 dark:bg-violet-400/15 dark:text-white dark:ring-violet-400", price: "font-bold text-violet-800 dark:text-violet-200", fill: false },
  // E · Emerald outline on a soft tint
  E: { row: "border-emerald-600 bg-emerald-50 text-emerald-950 ring-1 ring-emerald-600 dark:border-emerald-400 dark:bg-emerald-400/15 dark:text-white dark:ring-emerald-400", price: "font-bold text-emerald-800 dark:text-emerald-200", fill: false },
  // F · Ink: black in light theme, white in dark. No colour at all; the badge is the only accent
  F: { row: "border-slate-900 bg-slate-900 text-white dark:border-white dark:bg-white dark:text-slate-950", price: "font-bold", fill: true },
};

// The tone the live panel uses (design/decisions.json › subs-plan-select).
export const PLAN_TONE: keyof typeof planTones = "E";

const sample = [
  { id: "1", name: "1 month", price: 660000 },
  { id: "3", name: "3 months", price: 1100000 },
  { id: "6", name: "6 months", price: 1760000, popular: true },
  { id: "12", name: "12 months", price: 2640000 },
];

// Sample rows in one tone; click a row to see the chosen state on it (try the «محبوب‌ترین» row too).
function Demo({ tone }: { tone: keyof typeof planTones }) {
  const t = useT();
  const usd = useMoney().format;
  const name = useId();
  const [picked, setPicked] = useState("1");
  const c = planTones[tone];
  return (
    <div className="mx-auto w-full max-w-sm rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-white/15 dark:bg-[#0E1424]">
      <fieldset>
        <legend className="text-sm font-semibold text-slate-900 dark:text-white">{t("Plan")}</legend>
        <div className="mt-2 space-y-1.5">
          {sample.map((pl) => {
            const on = picked === pl.id;
            return (
              <label key={pl.id} className={`flex min-h-10 cursor-pointer items-center justify-between gap-3 rounded-lg border px-3 py-2 text-sm transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-violet-600 ${on ? c.row : "border-slate-200 text-slate-700 hover:border-slate-400 dark:border-white/15 dark:text-slate-300 dark:hover:border-white/40"}`}>
                <input type="radio" name={name} checked={on} onChange={() => setPicked(pl.id)} className="sr-only" />
                <span className="flex min-w-0 items-center gap-2"><span className="truncate font-semibold">{t(pl.name)}</span>{pl.popular && <PopularBadge on={on && c.fill} />}</span>
                <span className={`whitespace-nowrap tabular-nums ${on ? c.price : "text-slate-500 dark:text-slate-400"}`}>{usd(pl.price)}</span>
              </label>
            );
          })}
        </div>
      </fieldset>
    </div>
  );
}

export const PlanSelectA = () => <Demo tone="A" />;
export const PlanSelectB = () => <Demo tone="B" />;
export const PlanSelectC = () => <Demo tone="C" />;
export const PlanSelectD = () => <Demo tone="D" />;
export const PlanSelectE = () => <Demo tone="E" />;
export const PlanSelectF = () => <Demo tone="F" />;
