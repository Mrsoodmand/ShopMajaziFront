"use client";
import { useId, type ReactNode } from "react";
import { Check, MapPin } from "lucide-react";
import { useMoney } from "@/lib/money";
import { GV_PRICE, gvCities, type GvNumber } from "@/content/google-voice-en";
import type { Gv } from "./parts";
import { useT } from "@/i18n/client";

// Accessible building blocks for the "clean" Google Voice offers (F–J):
// real radio inputs in a labelled fieldset (arrow keys and screen readers work), a visible focus ring on every
// control, selection shown by a check mark and text as well as colour, and a polite live region for changes.

export const ring = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-emerald-400 dark:focus-visible:ring-offset-[#070B14]";
export const field = `w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base text-slate-900 placeholder:text-slate-500 dark:border-white/20 dark:bg-white/5 dark:text-white dark:placeholder:text-slate-400 ${ring}`;
export const primary = `inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-700 px-6 py-3.5 text-base font-semibold text-white transition-colors hover:bg-emerald-800 dark:bg-emerald-500 dark:text-emerald-950 dark:hover:bg-emerald-400 ${ring}`;
export const secondary = `inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 px-6 py-3.5 text-base font-semibold text-slate-800 transition-colors hover:bg-slate-50 dark:border-white/20 dark:text-slate-100 dark:hover:bg-white/5 ${ring}`;

// Screen-reader announcement for changes (result counts, selection).
export function Live({ children }: { children: ReactNode }) {
  return <p aria-live="polite" aria-atomic="true" className="sr-only">{children}</p>;
}

export function Label({ htmlFor, children, hint }: { htmlFor: string; children: ReactNode; hint?: string }) {
  return (
    <label htmlFor={htmlFor} className="block">
      <span className="text-sm font-semibold text-slate-900 dark:text-white">{children}</span>
      {hint && <span className="mt-0.5 block text-sm text-slate-600 dark:text-slate-400">{hint}</span>}
    </label>
  );
}

// City dropdown (native select: works with every keyboard and screen reader).
export function CitySelect({ id, value, onChange, allLabel = "All cities" }: { id: string; value: string; onChange: (v: string) => void; allLabel?: string }) {
  const t = useT();
  allLabel = t(allLabel);
  return (
    <select id={id} value={value} onChange={(e) => onChange(e.target.value)} className={`${field} appearance-auto`}>
      <option value="all">{allLabel}</option>
      {t.tr(gvCities).map((c) => <option key={c.city} value={c.city}>{c.city}, {c.state} ({c.numbers.length})</option>)}
    </select>
  );
}

// One radio option, styled as a card. The input itself is visually hidden but focusable.
// `tight` drops the visible "Selected" word for narrow columns (the check mark and border still show it).
export function NumberOption({ n, name, gv, size = "md", tight = false }: { n: GvNumber; name: string; gv: Gv; size?: "md" | "lg"; tight?: boolean }) {
  const t = useT();
  const on = gv.selected.id === n.id;
  return (
    <label className={`relative flex cursor-pointer items-center gap-4 rounded-2xl border-2 bg-white transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-emerald-600 has-[:focus-visible]:ring-offset-2 dark:bg-[#0E1424] dark:has-[:focus-visible]:ring-emerald-400 dark:has-[:focus-visible]:ring-offset-[#070B14] ${size === "lg" ? "p-5" : "px-4 py-3.5"} ${on ? "border-emerald-700 dark:border-emerald-400" : "border-slate-200 hover:border-slate-400 dark:border-white/15 dark:hover:border-white/40"}`}>
      <input type="radio" autoComplete="off" name={name} value={n.id} checked={on} onChange={() => gv.setSelected(n)} className="sr-only" />
      <span aria-hidden className={`grid h-6 w-6 shrink-0 place-items-center rounded-full border-2 ${on ? "border-emerald-700 bg-emerald-700 dark:border-emerald-400 dark:bg-emerald-400" : "border-slate-400 dark:border-white/30"}`}>
        {on && <Check className="h-3.5 w-3.5 text-white dark:text-emerald-950" strokeWidth={3} />}
      </span>
      <span className="min-w-0 flex-1">
        <span className={`block font-mono font-semibold text-slate-900 dark:text-white ${size === "lg" ? "text-xl" : "text-lg"}`}>{n.number}</span>
        <span className="flex items-center gap-1 text-sm text-slate-600 dark:text-slate-400"><MapPin aria-hidden className="h-3.5 w-3.5" />{n.city}, {n.state}{n.easy && <span>{" "}{t("· Easy to remember")}</span>}</span>
      </span>
      {on && !tight && <span aria-hidden className="text-sm font-semibold text-emerald-800 dark:text-emerald-300">{t("Selected")}</span>}
    </label>
  );
}

// A labelled group of number options. Pass the same `name` to several groups so they share one selection.
export function NumberRadios({ legend, list, gv, cols = 1, size = "md", hideLegend = false, name: shared }: { legend: string; list: GvNumber[]; gv: Gv; cols?: 1 | 2; size?: "md" | "lg"; hideLegend?: boolean; name?: string }) {
  const own = useId();
  const name = shared ?? own;
  return (
    <fieldset>
      <legend className={hideLegend ? "sr-only" : "text-sm font-semibold text-slate-900 dark:text-white"}>{legend}</legend>
      <div className={`grid gap-3 ${hideLegend ? "" : "mt-3"} ${cols === 2 ? "sm:grid-cols-2" : ""}`}>
        {list.map((n) => <NumberOption key={n.id} n={n} name={name} gv={gv} size={size} tight={cols === 2} />)}
      </div>
    </fieldset>
  );
}

// Order summary as a description list, with the buy button.
export function Summary({ gv, title = "Your order" }: { gv: Gv; title?: string }) {
  const usd = useMoney().format;
  const t = useT();
  title = t(title);
  const rows: [string, ReactNode][] = [
    [t("Number"), <span key="n" className="font-mono">{gv.selected.number}</span>],
    [t("Location"), `${gv.selected.city}, ${gv.selected.state}, USA`],
    [t("Delivery"), t("Instant, in your dashboard")],
    [t("Price"), <span key="p" className="text-lg font-bold">{usd(t.tr(GV_PRICE))}{" "}{t("one time")}</span>],
  ];
  return (
    <section aria-labelledby="summary-title" className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-white/15 dark:bg-[#0E1424]">
      <h2 id="summary-title" className="font-display text-lg font-semibold text-slate-900 dark:text-white">{title}</h2>
      <dl className="mt-4 divide-y divide-slate-200 text-[15px] dark:divide-white/10">
        {rows.map(([k, v]) => (
          <div key={k} className="flex justify-between gap-4 py-2.5">
            <dt className="text-slate-600 dark:text-slate-400">{k}</dt>
            <dd className="text-end font-medium text-slate-900 dark:text-white">{v}</dd>
          </div>
        ))}
      </dl>
      <button onClick={gv.openPay} className={`${primary} mt-5 w-full`}>{t("Continue to payment")}</button>
      <p className="mt-3 text-center text-sm text-slate-600 dark:text-slate-400">{t("Login not working? We replace it or refund you.")}</p>
    </section>
  );
}

export function H1({ children, sub }: { children: ReactNode; sub?: ReactNode }) {
  const t = useT();
  return (
    <div>
      <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-300">{t("Google Voice · United States")}</p>
      <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-5xl dark:text-white">{children}</h1>
      {sub && <p className="mt-4 max-w-2xl text-lg leading-relaxed text-slate-700 dark:text-slate-300">{sub}</p>}
    </div>
  );
}

export function H2({ id, children }: { id?: string; children: ReactNode }) {
  return <h2 id={id} className="font-display text-2xl font-bold tracking-tight text-slate-900 dark:text-white">{children}</h2>;
}
