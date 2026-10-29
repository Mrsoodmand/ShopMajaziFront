"use client";
import { useId, type ReactNode } from "react";
import { Bot, Check, Gift, Heart, Image as ImageIcon } from "lucide-react";
import { useMoney } from "@/lib/money";
import { POPULAR_PACK, starEach, starPacks, starPrice, starTiers, starUses } from "@/content/telegram-en";
import { accent, card, Shine, StarGlyph, SumRows, Tweened, type StarsState } from "./parts";
import { useT } from "@/i18n/client";

// Pieces used only by the Stars offers.

const fmt = (n: number) => n.toLocaleString("en-US");
// Saving per Star against the smallest-tier price, in whole percent.
export const savePct = (n: number) => Math.round((1 - starEach(n) / starTiers[0].each) * 100);

// `packs` picks which packs show; `savings` adds a "Save x%" line to the packs that cost less per Star.
// The selected pack shows a check mark as well as its colour.
export function PackRadios({ st, cols = 4, legend = "How many Stars?", dark = false, packs = starPacks, savings = false }: { st: StarsState; cols?: 2 | 3 | 4; legend?: string; dark?: boolean; packs?: number[]; savings?: boolean }) {
  const usd = useMoney().format;
  const tx = useT();
  legend = tx(legend);
  packs = tx.tr(packs);
  const name = useId();
  const grid = cols === 4 ? "grid-cols-2 sm:grid-cols-4" : cols === 3 ? "grid-cols-2 sm:grid-cols-3" : "grid-cols-2";
  return (
    <fieldset>
      <legend className={`text-base font-semibold ${dark ? "text-white" : "text-slate-900 dark:text-white"}`}>{legend}</legend>
      <div className={`mt-3 grid gap-2.5 ${grid}`}>
        {packs.map((n) => {
          const on = st.amount === n;
          const save = savings ? savePct(n) : 0;
          return (
            <label key={n} className={`relative flex cursor-pointer flex-col rounded-2xl border-2 px-4 py-3 transition-colors duration-200 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-emerald-600 has-[:focus-visible]:ring-offset-2 dark:has-[:focus-visible]:ring-emerald-400 dark:has-[:focus-visible]:ring-offset-[#0E1424] ${on ? `animate-pop ${tx.tr(accent).stars.border} ${dark ? "bg-amber-400/10" : "bg-amber-50 dark:bg-amber-400/10"}` : dark ? "border-white/15 hover:border-white/40" : "border-slate-400/70 hover:border-slate-500 dark:border-white/20 dark:hover:border-white/40"}`}>
              <input type="radio" name={name} checked={on} onChange={() => st.setAmount(n)} className="sr-only" />
              {on && <span aria-hidden className="absolute end-2.5 top-2.5 grid h-5 w-5 place-items-center rounded-full bg-amber-500 text-white dark:bg-amber-400 dark:text-amber-950"><Check className="h-3 w-3" strokeWidth={3} /></span>}
              {n === tx.tr(POPULAR_PACK) && <span className="absolute -top-2.5 start-3 rounded-full bg-amber-400 px-2 py-0.5 text-[11px] font-bold text-amber-950">{tx("Popular")}</span>}
              <span className={`flex items-center gap-1.5 font-display text-lg font-bold ${dark ? "text-white" : "text-slate-900 dark:text-white"}`}><StarGlyph className={`h-4 w-4 transition-transform duration-500 ${on ? "rotate-[144deg] scale-125" : ""}`} />{fmt(n)}<span className="sr-only">{" "}{tx("Stars")}</span></span>
              <span className={`text-sm tabular-nums ${dark ? "text-white/70" : "text-slate-600 dark:text-slate-400"}`}>{usd(starPrice(n))}</span>
              {savings && <span className={`text-xs font-semibold ${save > 0 ? "text-emerald-700 dark:text-emerald-400" : "invisible"}`}>{tx("Save")}{" "}{save}%</span>}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

export function TierTable({ st }: { st?: StarsState }) {
  const usd = useMoney().format;
  const tx = useT();
  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-300 dark:border-white/15">
      <table className="w-full min-w-[420px] text-[15px]">
        <caption className="sr-only">{tx("Price per Star by amount")}</caption>
        <thead className="bg-slate-50 dark:bg-white/5"><tr>{[tx("Amount"), tx("Price per Star"), tx("1,000 Stars cost")].map((h) => <th key={h} scope="col" className="px-4 py-3 text-start font-semibold text-slate-900 dark:text-white">{h}</th>)}</tr></thead>
        <tbody className="divide-y divide-slate-200 dark:divide-white/10">
          {tx.tr(starTiers).map((t, i) => {
            const on = st && st.amount >= t.from && (i === tx.tr(starTiers).length - 1 || st.amount < tx.tr(starTiers)[i + 1].from);
            return (
              <tr key={t.from} className={on ? "bg-amber-50 dark:bg-amber-400/10" : ""}>
                <th scope="row" className="px-4 py-3 text-start font-medium text-slate-900 dark:text-white">{fmt(t.from)}+ {on && <span className="ms-2 rounded-full bg-amber-400 px-2 py-0.5 text-xs font-bold text-amber-950">{tx("Your price")}</span>}</th>
                <td className="px-4 py-3 text-slate-900 dark:text-white">${t.each.toFixed(4)}</td>
                <td className="px-4 py-3 text-slate-900 dark:text-white">{usd(t.each * 1000)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

const useIcons = [Bot, Gift, Heart, ImageIcon];
export function UsesGrid({ dark = false }: { dark?: boolean }) {
  const tx = useT();
  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {tx.tr(starUses).map((u, i) => {
        const I = useIcons[i];
        return (
          <li key={u.title} className={dark ? "rounded-3xl border border-white/10 bg-white/5 p-5" : `${card} p-5`}>
            <span aria-hidden className={`grid h-10 w-10 place-items-center rounded-xl ${dark ? "bg-amber-400/15 text-amber-300" : tx.tr(accent).stars.soft}`}><I className="h-5 w-5" /></span>
            <h3 className={`mt-4 font-semibold ${dark ? "text-white" : "text-slate-900 dark:text-white"}`}>{u.title}</h3>
            <p className={`mt-1 text-[15px] ${dark ? "text-white/70" : "text-slate-600 dark:text-slate-400"}`}>{u.text}</p>
          </li>
        );
      })}
    </ul>
  );
}

// The price steps in one line, the current one in bold.
export function TierLine({ st }: { st: StarsState }) {
  const tx = useT();
  const steps = tx.tr(starTiers).slice(1);
  return (
    <p className="text-sm text-slate-600 dark:text-slate-400">
      {tx("Pay less per Star:")}{" "}
      {steps.map((t, i) => {
        const on = st.amount >= t.from && (i === steps.length - 1 || st.amount < steps[i + 1].from);
        return <span key={t.from}>{i > 0 && " · "}<span className={on ? "font-semibold text-emerald-700 dark:text-emerald-400" : ""}>{savePct(t.from)}{tx("% off from")}{" "}{fmt(t.from)}</span></span>;
      })}
    </p>
  );
}

// Just below a price step: "Add N more Stars and pay $X less" (when the bigger order costs less), or
// "N more Stars saves x% per Star" when it is close. One tap moves to the step.
export function TierNudge({ st }: { st: StarsState }) {
  const usd = useMoney().format;
  const tx = useT();
  const next = tx.tr(starTiers).find((t) => t.from > st.amount);
  if (!st.valid || !next) return null;
  const more = next.from - st.amount;
  const cheaper = st.total - starPrice(next.from);
  if (cheaper <= 0 && more > next.from * 0.1) return null;
  return (
    <div role="status" className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-900 dark:bg-emerald-400/10 dark:text-emerald-200">
      <span>{cheaper > 0 ? <>{tx("Add")}{" "}<strong>{fmt(more)}</strong>{" "}{tx("more")}{" "}{more === 1 ? tx("Star") : tx("Stars")}{" "}{tx("and pay")}{" "}<strong>{usd(cheaper)}{" "}{tx("less")}</strong>.</> : <>{tx("Add")}{" "}<strong>{fmt(more)}</strong>{" "}{tx("more")}{" "}{more === 1 ? tx("Star") : tx("Stars")}{" "}{tx("to save")}{" "}{savePct(next.from)}{tx("% per Star.")}</>}</span>
      <button type="button" onClick={() => st.setAmount(next.from)} className="rounded-lg bg-emerald-700 px-3 py-1.5 font-semibold text-white hover:bg-emerald-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2 dark:bg-emerald-500 dark:text-emerald-950">{tx("Make it")}{" "}{fmt(next.from)}</button>
    </div>
  );
}

// What Stars are for, as a plain two-column list (no boxed cards): a small icon beside each title.
export function UsesList() {
  const tx = useT();
  return (
    <ul className="grid gap-x-12 sm:grid-cols-2">
      {tx.tr(starUses).map((u, i) => {
        const I = useIcons[i];
        return (
          <li key={u.title} className="flex gap-4 border-t border-slate-200 py-5 dark:border-white/10">
            <I aria-hidden className="mt-0.5 h-5 w-5 shrink-0 text-amber-600 dark:text-amber-300" />
            <div><h3 className="text-balance font-semibold text-slate-900 dark:text-white">{u.title}</h3><p className="mt-1 text-[15px] leading-relaxed text-slate-600 dark:text-slate-400">{u.text}</p></div>
          </li>
        );
      })}
    </ul>
  );
}

export function StarsSummary({ st, children, title = "Your order", className = card }: { st: StarsState; children?: ReactNode; title?: string; className?: string }) {
  const usd = useMoney().format;
  const tx = useT();
  title = tx(title);
  return (
    <section aria-labelledby="stars-sum" className={`${className} p-6`}>
      <h2 id="stars-sum" className="font-display text-lg font-semibold text-slate-900 dark:text-white">{title}</h2>
      <div className="mt-3">
        <SumRows rows={[
          [tx("Stars"), <span key="s" className="inline-flex items-center gap-1"><StarGlyph className="h-3.5 w-3.5" />{st.amount > 0 ? <span className={st.valid ? "" : "text-red-700 dark:text-red-400"}>{fmt(st.amount)}</span> : "—"}</span>],
          [tx("To"), st.r.user ? `@${st.r.user.username}` : "—"],
          ...(st.valid && savePct(st.amount) > 0 ? [[tx("You save"), <span key="v" className="tabular-nums text-emerald-700 dark:text-emerald-400">{savePct(st.amount)}% · {usd(st.amount * tx.tr(starTiers)[0].each - st.total)}</span>] as [string, ReactNode]] : []),
          [tx("Delivery"), tx("1–5 minutes")],
        ]} />
      </div>
      <div aria-live="polite" className="mt-3 flex items-baseline justify-between border-t border-slate-200 pt-4 dark:border-white/10">
        <span className="text-slate-600 dark:text-slate-400">{tx("Total")}</span><span className="font-display text-2xl font-bold tabular-nums text-slate-900 dark:text-white">{st.valid ? <Tweened value={st.total} /> : "—"}</span>
      </div>
      {children}
    </section>
  );
}

// What the buy button says: the price when the order is valid, otherwise what to change.
// (When the order is invalid the button just names its action; the field error and the line under it explain.)
export const starsLabel = (st: StarsState, ok: string, usd: (n: number) => string) => (st.valid ? `${ok} · ${usd(st.total)}` : ok);

// The line under the buy button after a failed try: says what is missing. Announced to screen readers.
export const StarsBlocker = ({ st }: { st: StarsState }) => (
  <p role="status" aria-live="polite" className="mt-2.5 min-h-5 text-center text-sm font-semibold text-red-700 empty:hidden dark:text-red-400">{st.blocker ?? ""}</p>
);

// `shine` adds a light sweep and a soft pulsing glow (used on the night-sky pages).
export const BuyStars = ({ st, className = "", shine = false }: { st: StarsState; className?: string; shine?: boolean }) => {
  const usd = useMoney().format;
  const tx = useT();
  return (
  <button type="button" onClick={st.proceed} className={`${tx.tr(accent).stars.btn} relative w-full overflow-hidden ${shine ? "animate-glow [--glow:rgba(251,191,36,.5)]" : ""} ${className}`}>
    {shine && <Shine />}<span className="relative">{starsLabel(st, st.valid ? tx("Buy {0} Stars", { 0: fmt(st.amount) }) : tx("Buy Stars"), usd)}</span>
  </button>
);
};
