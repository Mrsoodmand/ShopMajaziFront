"use client";
import { useId, type ComponentType } from "react";
import { Check, Lock, RotateCcw, Zap } from "lucide-react";
import { useMoney } from "@/lib/money";
import { savePct, type SubPlan } from "@/content/subs-en";
import { ring } from "../googleVoice/clean";
import { ActivationBadge, BuyButton, FieldsForm, Notes, PopularBadge, ProductPanel, Tile, type Subs } from "./parts";
import { useT } from "@/i18n/client";
import { PLAN_TONE, planTones } from "./planSelect";

// Five versions of the product panel on the Subscriptions page (the box with plans, the account field and Buy).
// All keep real radio buttons for plans, labelled fields with errors, and work for 1 to 4 plans, select fields
// and products with no fields. `focusable` lets the page move focus to the product heading after a pick.

export type PanelProps = { s: Subs; focusable?: boolean };

// Plans with no known length (months 0, live data) count as one month here.
const perMonth = (pl: SubPlan, usd: (n: number) => string) => usd(pl.price / (pl.months || 1));
const best = (plans: SubPlan[]) => plans.reduce((a, b) => (b.price / (b.months || 1) < a.price / (a.months || 1) ? b : a));

function Heading({ s, focusable, size = "md" }: PanelProps & { size?: "sm" | "md" }) {
  const p = s.product!;
  return (
    <div className="flex items-center gap-3">
      <Tile p={p} size={size === "sm" ? "sm" : "md"} />
      <div className="min-w-0 flex-1">
        <h2 tabIndex={focusable ? -1 : undefined} className={`font-display font-bold tracking-tight text-slate-900 outline-none dark:text-white ${size === "sm" ? "text-lg" : "text-xl"}`}>{p.name}</h2>
        <p className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-slate-600 dark:text-slate-400"><ActivationBadge p={p} />{p.delivery}</p>
      </div>
    </div>
  );
}

// Plans as option cards (DESIGN.md "Option cards"): radio dot, name, the saving as an in-card pill, the main price
// and, for plans longer than a month, the other price as a quiet second line. Two columns; an odd last card spans
// both so nothing sits alone in half a row.
function Segments({ s, show = "price" }: { s: Subs; show?: "price" | "month" }) {
  const usd = useMoney().format;
  const t = useT();
  const name = useId();
  const plans = s.product!.plans;
  return (
    <fieldset>
      <legend className="text-sm font-semibold text-slate-900 dark:text-white">{t("Plan")}</legend>
      <div className={`mt-2 grid gap-2 ${plans.length > 1 ? "grid-cols-2" : "grid-cols-1"}`}>
        {plans.map((pl, i) => {
          const on = s.plan?.id === pl.id;
          const save = savePct(pl);
          const month = `${perMonth(pl, usd)}${t("/mo")}`;
          const main = show === "price" ? usd(pl.price) : month;
          const sub = pl.months > 1 ? (show === "price" ? month : usd(pl.price)) : null;
          const wide = plans.length > 1 && plans.length % 2 === 1 && i === plans.length - 1;
          return (
            <label key={pl.id} className={`relative flex min-w-0 cursor-pointer flex-col gap-2 rounded-2xl border-2 p-3 transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-violet-600 has-[:focus-visible]:ring-offset-2 dark:has-[:focus-visible]:ring-violet-400 dark:has-[:focus-visible]:ring-offset-[#0E1424] ${wide ? "col-span-2" : ""} ${on ? "border-violet-700 bg-violet-50/70 dark:border-violet-400 dark:bg-violet-400/10" : "border-slate-200 bg-white hover:border-slate-400 dark:border-white/15 dark:bg-transparent dark:hover:border-white/40"}`}>
              <input type="radio" autoComplete="off" name={name} checked={on} onChange={() => s.setPlan(pl)} className="sr-only" />
              <span className="flex items-center gap-2">
                <span aria-hidden className={`grid h-5 w-5 shrink-0 place-items-center rounded-full border-2 transition-colors ${on ? "border-violet-700 bg-violet-700 dark:border-violet-400 dark:bg-violet-400" : "border-slate-400 dark:border-white/30"}`}>{on && <Check className="h-3 w-3 text-white dark:text-violet-950" strokeWidth={3.5} />}</span>
                <span className="min-w-0 flex-1 text-[15px] font-semibold text-slate-900 dark:text-white">{pl.name}</span>
              </span>
              <span className="min-w-0 sm:ps-7">
                {/* May wrap before the currency: two cards side by side on a phone are too narrow for "5,937,800 Toman". */}
                <span className="block text-base font-bold tabular-nums text-slate-900 dark:text-white">{main}</span>
                {(sub || save > 0) && (
                  <span className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1">
                    {sub && <span className="whitespace-nowrap text-xs tabular-nums text-slate-600 dark:text-slate-400">{sub}</span>}
                    {save > 0 && <span className="whitespace-nowrap rounded-full bg-amber-100 px-2 py-0.5 text-xs font-bold text-amber-900 dark:bg-amber-400/15 dark:text-amber-300">{t("{0}% off", { 0: save })}</span>}
                  </span>
                )}
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

function Total({ s, label = "Total" }: { s: Subs; label?: string }) {
  const usd = useMoney().format;
  const t = useT();
  label = t(label);
  return (
    <div aria-live="polite" className="flex items-baseline justify-between">
      <span className="text-slate-700 dark:text-slate-300">{label}</span>
      <span className="font-display text-2xl font-bold text-slate-900 dark:text-white">{s.plan ? usd(s.plan.price) : "—"}</span>
    </div>
  );
}

// ---------- A · Compact ----------
// Small header, plans as one row of segments, the field, then total and Buy side by side. Fits a phone screen.
function PanelCompact({ s, focusable }: PanelProps) {
  const usd = useMoney().format;
  const t = useT();
  const p = s.product!;
  return (
    <div className="space-y-5">
      <Heading s={s} focusable={focusable} size="sm" />
      <Segments s={s} />
      <FieldsForm s={s} />
      <div className="flex items-center gap-4 border-t border-slate-200 pt-4 dark:border-white/10">
        <div aria-live="polite" className="min-w-0">
          <p className="text-sm text-slate-600 dark:text-slate-400">{s.plan?.name}</p>
          <p className="font-display text-2xl font-bold text-slate-900 dark:text-white">{s.plan ? usd(s.plan.price) : "—"}</p>
        </div>
        <BuyButton s={s} className="flex-1" label={t("Continue")} />
      </div>
      {p.notes[0] && <p className="text-center text-sm text-slate-600 dark:text-slate-400">{p.notes[0]}</p>}
    </div>
  );
}

// ---------- B · Monthly price first ----------
// Plans as a simple list where the price per month is the big number and the total is the small one, so longer
// plans are easy to compare. A one-line summary sits above Buy.
function PanelList({ s, focusable }: PanelProps) {
  const usd = useMoney().format;
  const t = useT();
  const p = s.product!;
  const name = useId();
  return (
    <div className="space-y-6">
      <Heading s={s} focusable={focusable} />
      <fieldset>
        <legend className="text-sm font-semibold text-slate-900 dark:text-white">{t("Choose a plan")}</legend>
        <div className="mt-2 divide-y divide-slate-200 overflow-hidden rounded-2xl border border-slate-300 dark:divide-white/10 dark:border-white/15">
          {p.plans.map((pl) => {
            const on = s.plan?.id === pl.id;
            const save = savePct(pl);
            return (
              <label key={pl.id} className={`flex cursor-pointer items-center gap-3 px-4 py-3 transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-inset has-[:focus-visible]:ring-violet-600 dark:has-[:focus-visible]:ring-violet-400 ${on ? "bg-violet-50 dark:bg-violet-500/10" : "hover:bg-slate-50 dark:hover:bg-white/5"}`}>
                <input type="radio" autoComplete="off" name={name} checked={on} onChange={() => s.setPlan(pl)} className="h-5 w-5 shrink-0 accent-violet-700 dark:accent-violet-400" />
                <span className="flex-1">
                  <span className="block font-semibold text-slate-900 dark:text-white">{pl.name}</span>
                  <span className="text-sm text-slate-600 dark:text-slate-400">{usd(pl.price)}{" "}{t("total")}{save > 0 && <span className="font-semibold text-amber-800 dark:text-amber-300">{" "}{t("· save")}{" "}{save}%</span>}</span>
                </span>
                <span className="text-end"><span className="block font-display text-xl font-bold text-slate-900 dark:text-white">{perMonth(pl, usd)}</span><span className="text-xs text-slate-600 dark:text-slate-400">{t("a month")}</span></span>
              </label>
            );
          })}
        </div>
      </fieldset>
      <FieldsForm s={s} />
      <p aria-live="polite" className="rounded-xl bg-slate-100 px-4 py-3 text-[15px] text-slate-800 dark:bg-white/5 dark:text-slate-200">
        {t("You pay")}{" "}<b>{s.plan ? usd(s.plan.price) : "—"}</b>{" "}{t("once for")}{" "}{s.plan?.name.toLowerCase()}{t(". No automatic renewal.")}
      </p>
      <BuyButton s={s} label={t("Continue to payment")} />
    </div>
  );
}

// ---------- C · Three steps ----------
// The panel reads as three numbered steps (plan → account → pay); finished steps show a check.
function PanelSteps({ s, focusable }: PanelProps) {
  const t = useT();
  const p = s.product!;
  const hasField = true; // the call question is always asked
  const filled = s.night !== null && p.fields.every((f) => f.optional || (s.values[f.id] ?? "").trim());
  const steps = [
    { n: 1, title: t("Choose a plan"), done: !!s.plan, body: <Segments s={s} show="price" /> },
    ...(hasField ? [{ n: 2, title: t("Your account"), done: filled, body: <FieldsForm s={s} /> }] : []),
    { n: hasField ? 3 : 2, title: t("Pay"), done: false, body: <div className="space-y-4"><Total s={s} /><BuyButton s={s} label={t("Continue to payment")} /></div> },
  ];
  return (
    <div className="space-y-6">
      <Heading s={s} focusable={focusable} />
      <ol className="space-y-5">
        {steps.map((st) => (
          <li key={st.n} className="flex gap-3">
            <span aria-hidden className={`grid h-7 w-7 shrink-0 place-items-center rounded-full text-sm font-bold ${st.done ? "bg-emerald-600 text-white dark:bg-emerald-400 dark:text-emerald-950" : "bg-slate-900 text-white dark:bg-white dark:text-slate-900"}`}>{st.done ? <Check className="h-4 w-4" /> : st.n}</span>
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-slate-900 dark:text-white">{st.title}<span className="sr-only">{st.done ? t(", done") : ""}</span></h3>
              <div className="mt-3 [&_legend]:sr-only">{st.body}</div>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

// ---------- D · Big price ----------
// The price per month is the hero; switching the period changes it and shows the saving. Details fold away.
function PanelPrice({ s, focusable }: PanelProps) {
  const usd = useMoney().format;
  const t = useT();
  const p = s.product!;
  const pl = s.plan;
  const save = pl ? savePct(pl) : 0;
  return (
    <div className="space-y-6">
      <Heading s={s} focusable={focusable} size="sm" />
      <div aria-live="polite" className="rounded-2xl bg-gradient-to-br from-violet-600 to-fuchsia-500 p-5 text-white">
        <p className="text-sm text-white/85">{pl?.name}</p>
        <p className="mt-1 flex items-baseline gap-1.5"><span className="font-display text-5xl font-bold">{pl ? perMonth(pl, usd) : "—"}</span><span className="text-white/85">{t("/ month")}</span></p>
        <p className="mt-2 text-sm text-white/90">{pl ? `${usd(pl.price)} total` : ""}{save > 0 && <> · <b>{t("you save")}{" "}{save}%</b>{pl?.was && <>{" "}{t("(was")}{" "}{usd(pl.was)})</>}</>}</p>
      </div>
      <Segments s={s} show="month" />
      <FieldsForm s={s} />
      <BuyButton s={s} label={pl ? t("Continue · {0}", { 0: usd(pl.price) }) : t("Continue")} />
      <details className="group rounded-xl border border-slate-200 px-4 py-3 dark:border-white/15 [&_summary::-webkit-details-marker]:hidden">
        <summary className={`cursor-pointer list-none rounded-lg font-semibold text-slate-900 dark:text-white ${ring}`}>{t("What's included")}</summary>
        <div className="mt-3"><Notes p={p} /></div>
      </details>
    </div>
  );
}

// ---------- E · Detailed ----------
// Plans as cards with "Popular" and "Best value" ribbons, what's included with icons, and a reassurance strip
// under Buy (secure payment, refund, delivery time).
function PanelDetails({ s, focusable }: PanelProps) {
  const usd = useMoney().format;
  const t = useT();
  const p = s.product!;
  const name = useId();
  const bestPlan = best(p.plans);
  return (
    <div className="space-y-6">
      <Heading s={s} focusable={focusable} />
      <fieldset>
        <legend className="text-sm font-semibold text-slate-900 dark:text-white">{t("Choose a plan")}</legend>
        <div className="mt-3 space-y-3">
          {p.plans.map((pl, i) => {
            const on = s.plan?.id === pl.id;
            const tag = p.plans.length > 1 && pl.id === bestPlan.id ? t("Best value") : i === 0 && p.plans.length > 1 ? t("Popular") : null;
            return (
              <label key={pl.id} className={`relative flex cursor-pointer items-center gap-3 rounded-2xl border-2 px-4 py-3.5 transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-violet-600 has-[:focus-visible]:ring-offset-2 dark:has-[:focus-visible]:ring-violet-400 dark:has-[:focus-visible]:ring-offset-[#0E1424] ${on ? "border-violet-700 bg-violet-50/60 dark:border-violet-400 dark:bg-violet-500/10" : "border-slate-200 hover:border-slate-400 dark:border-white/15 dark:hover:border-white/40"}`}>
                <input type="radio" autoComplete="off" name={name} checked={on} onChange={() => s.setPlan(pl)} className="sr-only" />
                {tag && <span className={`absolute -top-2.5 start-4 rounded-full px-2 py-0.5 text-[11px] font-bold ${tag === "Best value" ? "bg-violet-700 text-white dark:bg-violet-400 dark:text-violet-950" : "bg-slate-900 text-white dark:bg-white dark:text-slate-900"}`}>{tag}</span>}
                <span aria-hidden className={`grid h-5 w-5 shrink-0 place-items-center rounded-full border-2 ${on ? "border-violet-700 bg-violet-700 dark:border-violet-400 dark:bg-violet-400" : "border-slate-400 dark:border-white/30"}`}>{on && <span className="h-2 w-2 rounded-full bg-white dark:bg-violet-950" />}</span>
                <span className="flex-1"><span className="block font-semibold text-slate-900 dark:text-white">{pl.name}</span><span className="text-sm text-slate-600 dark:text-slate-400">{perMonth(pl, usd)}{" "}{t("a month")}</span></span>
                <span className="text-end">{pl.was && <span className="block text-sm text-slate-500 line-through"><span className="sr-only">{t("Was")}{" "}</span>{usd(pl.was)}</span>}<span className="font-bold text-slate-900 dark:text-white">{usd(pl.price)}</span></span>
              </label>
            );
          })}
        </div>
      </fieldset>
      <FieldsForm s={s} />
      <div className="rounded-2xl bg-slate-50 p-4 dark:bg-white/5"><p className="mb-2 text-sm font-semibold text-slate-900 dark:text-white">{t("Included")}</p><Notes p={p} /></div>
      <div className="space-y-3 border-t border-slate-200 pt-5 dark:border-white/10">
        <Total s={s} />
        <BuyButton s={s} label={t("Continue to payment")} />
        <ul className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs text-slate-600 dark:text-slate-400">
          <li className="flex items-center gap-1"><Lock aria-hidden className="h-3.5 w-3.5" />{t("Secure payment")}</li>
          <li className="flex items-center gap-1"><RotateCcw aria-hidden className="h-3.5 w-3.5" />{t("Refund if it fails")}</li>
          {p.delivery && <li className="flex items-center gap-1"><Zap aria-hidden className="h-3.5 w-3.5" />{p.delivery}</li>}
        </ul>
      </div>
    </div>
  );
}

// ---------- Compact set (F–J): smaller panels, one price shown where the decision is made ----------

// One-line header: small tile, name, and the activation badge + delivery under it in small text.
function MiniHead({ s, focusable }: PanelProps) {
  const p = s.product!;
  return (
    <div className="flex items-center gap-2.5">
      <Tile p={p} size="sm" />
      <div className="min-w-0 flex-1">
        <h2 tabIndex={focusable ? -1 : undefined} className="font-display text-base font-bold leading-tight text-slate-900 outline-none dark:text-white">{p.name}</h2>
        <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-600 dark:text-slate-400"><ActivationBadge p={p} />{p.delivery}</p>
      </div>
    </div>
  );
}

// The account fields at a smaller size (same component, tighter input and label).
function MiniFields({ s }: { s: Subs }) {
  return <div className="[&_input]:py-2.5 [&_input]:text-[15px] [&_label]:text-sm [&_select]:py-2.5 [&_select]:text-[15px]"><FieldsForm s={s} /></div>;
}

const focusRing = "has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-violet-600 dark:has-[:focus-visible]:ring-violet-400";

// ---------- F · Tight rows ----------
// Plans as one bordered list of 44px rows: dot, name, price at the end. Price repeats inside Continue.
function PanelRows({ s, focusable }: PanelProps) {
  const usd = useMoney().format;
  const t = useT();
  const name = useId();
  const plans = s.product!.plans;
  return (
    <div className="space-y-4">
      <MiniHead s={s} focusable={focusable} />
      <fieldset>
        <legend className="text-sm font-semibold text-slate-900 dark:text-white">{t("Plan")}</legend>
        <div className="mt-2 divide-y divide-slate-200 overflow-hidden rounded-xl border border-slate-200 dark:divide-white/10 dark:border-white/15">
          {plans.map((pl) => {
            const on = s.plan?.id === pl.id;
            return (
              <label key={pl.id} className={`flex min-h-11 cursor-pointer items-center gap-2.5 px-3 py-2 transition-colors has-[:focus-visible]:ring-inset ${focusRing} ${on ? "bg-violet-50 dark:bg-violet-400/10" : "hover:bg-slate-50 dark:hover:bg-white/5"}`}>
                <input type="radio" autoComplete="off" name={name} checked={on} onChange={() => s.setPlan(pl)} className="sr-only" />
                <span aria-hidden className={`grid h-4 w-4 shrink-0 place-items-center rounded-full border-2 ${on ? "border-violet-600 dark:border-violet-400" : "border-slate-400 dark:border-white/30"}`}>{on && <span className="h-1.5 w-1.5 rounded-full bg-violet-600 dark:bg-violet-400" />}</span>
                <span className={`min-w-0 flex-1 text-sm ${on ? "font-semibold text-slate-900 dark:text-white" : "text-slate-700 dark:text-slate-300"}`}>{pl.name}</span>
                <span className={`whitespace-nowrap text-sm tabular-nums ${on ? "font-bold text-slate-900 dark:text-white" : "text-slate-600 dark:text-slate-400"}`}>{usd(pl.price)}</span>
              </label>
            );
          })}
        </div>
      </fieldset>
      <MiniFields s={s} />
      <BuyButton s={s} className="!py-3" />
    </div>
  );
}

// ---------- G · Segmented ----------
// Plan names in a pill switch; the chosen plan's price shows once, large, right under it.
function PanelSegmented({ s, focusable }: PanelProps) {
  const usd = useMoney().format;
  const t = useT();
  const name = useId();
  const plans = s.product!.plans;
  const save = s.plan ? savePct(s.plan) : 0;
  return (
    <div className="space-y-4">
      <MiniHead s={s} focusable={focusable} />
      <fieldset>
        <legend className="sr-only">{t("Plan")}</legend>
        <div className="flex gap-1 rounded-xl bg-slate-100 p-1 dark:bg-white/5">
          {plans.map((pl) => {
            const on = s.plan?.id === pl.id;
            return (
              <label key={pl.id} className={`min-w-0 flex-1 cursor-pointer rounded-lg px-2 py-2 text-center text-sm transition-colors ${focusRing} ${on ? "bg-white font-semibold text-slate-900 shadow-sm dark:bg-violet-500/25 dark:text-white" : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"}`}>
                <input type="radio" autoComplete="off" name={name} checked={on} onChange={() => s.setPlan(pl)} className="sr-only" />
                <span className="block truncate">{pl.name}</span>
              </label>
            );
          })}
        </div>
        <p aria-live="polite" className="mt-3 flex flex-wrap items-baseline justify-center gap-x-2 text-center">
          <span className="font-display text-2xl font-bold tabular-nums text-slate-900 dark:text-white">{s.plan ? usd(s.plan.price) : "—"}</span>
          {save > 0 && <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-bold text-amber-900 dark:bg-amber-400/15 dark:text-amber-300">{t("{0}% off", { 0: save })}</span>}
        </p>
      </fieldset>
      <MiniFields s={s} />
      <BuyButton s={s} className="!py-3" label={t("Continue")} />
    </div>
  );
}

// ---------- H · Dropdown ----------
// The smallest: plan as a native select (name — price), the field, and Continue with the price.
function PanelSelect({ s, focusable }: PanelProps) {
  const usd = useMoney().format;
  const t = useT();
  const id = useId();
  const plans = s.product!.plans;
  return (
    <div className="space-y-4">
      <MiniHead s={s} focusable={focusable} />
      <div>
        <label htmlFor={id} className="block text-sm font-semibold text-slate-900 dark:text-white">{t("Plan")}</label>
        <select id={id} value={s.plan?.id ?? ""} onChange={(e) => { const pl = plans.find((x) => String(x.id) === e.target.value); if (pl) s.setPlan(pl); }}
          className="mt-2 w-full appearance-auto rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-[15px] text-slate-900 focus:border-slate-500 focus:outline-none dark:border-white/20 dark:bg-white/5 dark:text-white">
          {plans.map((pl) => <option key={pl.id} value={pl.id}>{pl.name} — {usd(pl.price)}</option>)}
        </select>
      </div>
      <MiniFields s={s} />
      <BuyButton s={s} className="!py-3" />
    </div>
  );
}

// ---------- I · Mini tiles ----------
// Small tiles in one row (wrap when narrow): name and price in small type, a violet outline on the chosen one.
function PanelTiles({ s, focusable }: PanelProps) {
  const usd = useMoney().format;
  const t = useT();
  const name = useId();
  const plans = s.product!.plans;
  return (
    <div className="space-y-4">
      <MiniHead s={s} focusable={focusable} />
      <fieldset>
        <legend className="text-sm font-semibold text-slate-900 dark:text-white">{t("Plan")}</legend>
        <div className="mt-2 grid grid-cols-[repeat(auto-fit,minmax(7rem,1fr))] gap-2">
          {plans.map((pl) => {
            const on = s.plan?.id === pl.id;
            return (
              <label key={pl.id} className={`relative cursor-pointer rounded-xl border px-2.5 py-2 transition-colors ${focusRing} ${on ? "border-violet-600 bg-violet-50 ring-1 ring-violet-600 dark:border-violet-400 dark:bg-violet-400/10 dark:ring-violet-400" : "border-slate-200 hover:border-slate-400 dark:border-white/15 dark:hover:border-white/40"}`}>
                <input type="radio" autoComplete="off" name={name} checked={on} onChange={() => s.setPlan(pl)} className="sr-only" />
                {on && <Check aria-hidden className="absolute end-2 top-2 h-3.5 w-3.5 text-violet-600 dark:text-violet-400" strokeWidth={3} />}
                <span className="block truncate pe-4 text-xs text-slate-600 dark:text-slate-400">{pl.name}</span>
                <span className="mt-0.5 block whitespace-nowrap text-sm font-bold tabular-nums text-slate-900 dark:text-white">{usd(pl.price)}</span>
              </label>
            );
          })}
        </div>
      </fieldset>
      <MiniFields s={s} />
      <BuyButton s={s} className="!py-3" label={t("Continue")} />
    </div>
  );
}

// ---------- J · Split button ----------
// Short rows where the chosen plan fills violet, so the pick is obvious at a glance; Continue carries the price.
function PanelSplit({ s, focusable }: PanelProps) {
  const usd = useMoney().format;
  const t = useT();
  const name = useId();
  const plans = s.product!.plans;
  const tone = planTones[PLAN_TONE]; // the chosen row's colour (gallery: subs-plan-select)
  return (
    <div className="space-y-4">
      <MiniHead s={s} focusable={focusable} />
      <fieldset>
        <legend className="text-sm font-semibold text-slate-900 dark:text-white">{t("Plan")}</legend>
        <div className="mt-2 space-y-1.5">
          {plans.map((pl) => {
            const on = s.plan?.id === pl.id;
            return (
              <label key={pl.id} className={`flex min-h-10 cursor-pointer items-center justify-between gap-3 rounded-lg border px-3 py-2 text-sm transition-colors ${focusRing} ${on ? tone.row : "border-slate-200 text-slate-700 hover:border-slate-400 dark:border-white/15 dark:text-slate-300 dark:hover:border-white/40"}`}>
                <input type="radio" autoComplete="off" name={name} checked={on} onChange={() => s.setPlan(pl)} className="sr-only" />
                <span className="flex min-w-0 items-center gap-2"><span className="truncate font-semibold">{pl.name}</span>{pl.popular && <PopularBadge on={on && tone.fill} />}</span>
                <span className={`whitespace-nowrap tabular-nums ${on ? tone.price : "text-slate-500 dark:text-slate-400"}`}>{usd(pl.price)}</span>
              </label>
            );
          })}
        </div>
      </fieldset>
      <MiniFields s={s} />
      <BuyButton s={s} className="!py-3" />
    </div>
  );
}

// The current panel (before the redesign), kept as the default.
function PanelOriginal({ s, focusable }: PanelProps) {
  return <ProductPanel s={s} cols={1} focusable={focusable} />;
}

export const panels: Record<string, ComponentType<PanelProps>> = {
  original: PanelOriginal, A: PanelCompact, B: PanelList, C: PanelSteps, D: PanelPrice, E: PanelDetails,
  F: PanelRows, G: PanelSegmented, H: PanelSelect, I: PanelTiles, J: PanelSplit,
};

