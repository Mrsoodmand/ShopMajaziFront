"use client";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { Check, Globe2, Loader2, Search, Smartphone } from "lucide-react";
import CheckoutModal, { type PayMethod } from "@/components/checkout/CheckoutModal";
import { useMoney } from "@/lib/money";
import {
  appFrom, appsFor, countriesFor, durations, endDate, priceApp, priceFor, rentCountries, sampleRentNumber, savingFor,
  type Duration, type RentApp, type RentCountry, type RentMethod,
} from "@/content/rent-en";
import { AppTile, CC } from "../otp/parts";
import { field, primary, ring } from "../googleVoice/clean";
import type { RentOrder } from "./parts";
import { useT } from "@/i18n/client";

// The rent flow, shared by offers F–J. Two ways to rent:
//   "all" (every app):  1 · period → countries available for that period load → 2 · country → payment window
//   "app" (one app):    1 · country → 2 · period → 3 · app → payment window
// The last choice opens the payment window (summary, method, price, Pay), like the virtual number page.
// Choices are buttons (each one is an action), marked with aria-pressed when chosen.

export type StepId = "period" | "country" | "app";
export const stepsOf = (m: RentMethod): StepId[] => (m === "all" ? ["period", "country"] : ["country", "period", "app"]);
export const stepTitle: Record<StepId, string> = { period: "Rental period", country: "Country", app: "App" };

const LOAD_MS = 700;

export function useRentFlow(initial: RentMethod = "all") {
  const [method, setMethodState] = useState<RentMethod>(initial);
  const [period, setPeriod] = useState<Duration | null>(null);
  const [country, setCountry] = useState<RentCountry | null>(null);
  const [app, setApp] = useState<RentApp | null>(null);
  const [loading, setLoading] = useState(false);
  const [payOpen, setPayOpen] = useState(false);
  const [order, setOrder] = useState<RentOrder | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);

  const setMethod = (m: RentMethod) => { clearTimeout(timer.current); setMethodState(m); setPeriod(null); setCountry(null); setApp(null); setLoading(false); };

  // "Getting countries": after the period is chosen, load the countries that have numbers for it (placeholder delay).
  const pickPeriod = (d: Duration) => {
    setPeriod(d);
    if (method === "all") {
      setCountry(null);
      setLoading(true);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setLoading(false), LOAD_MS);
    } else setApp(null);
  };
  const pickCountry = (c: RentCountry) => {
    setCountry(c);
    if (method === "all") setPayOpen(true);
    else setApp(null);
  };
  const pickApp = (a: RentApp) => { setApp(a); setPayOpen(true); };

  // Reopen a step: clears it and everything after it.
  const reopen = (s: StepId) => {
    const order = stepsOf(method);
    for (const x of order.slice(order.indexOf(s))) ({ period: () => setPeriod(null), country: () => setCountry(null), app: () => setApp(null) })[x]();
  };

  const value: Record<StepId, boolean> = { period: !!period, country: !!country, app: !!app };
  const steps = stepsOf(method);
  const current = steps.find((s) => !value[s]) ?? steps[steps.length - 1];
  const unlocked = (s: StepId) => steps.slice(0, steps.indexOf(s)).every((x) => value[x]);

  const ready = method === "all" ? !!(period && country) : !!(country && period && app);
  const price = !ready || !period || !country ? 0 : method === "all" ? priceFor(country, period) : priceApp(country, period, app!);

  const buy = (m: PayMethod) => {
    if (!ready || !period || !country) return;
    setOrder({ country, days: period.days, price, number: sampleRentNumber(country.cc), paidWith: m, app: method === "app" ? app! : undefined });
    setPayOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const reset = () => { setOrder(null); setMethod(method); };

  return {
    method, setMethod, period, country, app, loading, pickPeriod, pickCountry, pickApp, reopen, value, steps, current, unlocked,
    ready, price, payOpen, openPay: () => ready && setPayOpen(true), closePay: () => setPayOpen(false), order, buy, reset,
  };
}
export type RentFlow = ReturnType<typeof useRentFlow>;

// ---------- Payment window ----------

export function RentPayModal({ f }: { f: RentFlow }) {
  const t = useT();
  return (
    <CheckoutModal open={f.payOpen && f.ready} onClose={f.closePay} price={f.price} itemLabel={f.period ? t("Rental · {0}", { 0: f.period.label }) : t("Rental")} payLabel={t("Pay")}
      note={t("No SMS in the first hour? We replace the number.")} onPay={f.buy}
      summary={f.ready && f.country && f.period && (
        <>
          {f.method === "app" && f.app ? <AppTile app={f.app} /> : <span aria-hidden className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-emerald-700 text-white dark:bg-emerald-400 dark:text-emerald-950"><Globe2 className="h-5 w-5" /></span>}
          <div className="min-w-0 flex-1">
            <div className="truncate font-semibold text-slate-900 dark:text-white">{f.method === "app" && f.app ? `${f.app.name} number` : t("Number for all apps")}</div>
            <div className="flex items-center gap-1.5 truncate text-xs text-slate-500 dark:text-slate-400">
              <CC cc={f.country.cc} />{f.country.name} · {f.period.label}{" "}{t("· until")}{" "}{endDate(f.period.days)}
            </div>
          </div>
        </>
      )} />
  );
}

// ---------- Method switch ----------

const methods: { id: RentMethod; title: string; text: string; icon: typeof Globe2 }[] = [
  { id: "all", title: "All apps", text: "One number takes SMS from any app.", icon: Globe2 },
  { id: "app", title: "One app", text: "Cheaper, for a single app.", icon: Smartphone },
];

export function MethodSwitch({ f, variant = "tabs" }: { f: RentFlow; variant?: "tabs" | "cards" }) {
  const t = useT();
  if (variant === "cards") return (
    <div role="group" aria-label={t("How do you want to rent?")} className="grid gap-3 sm:grid-cols-2">
      {t.tr(methods).map((m) => {
        const on = f.method === m.id;
        return (
          <button key={m.id} onClick={() => f.setMethod(m.id)} aria-pressed={on}
            className={`flex items-start gap-4 rounded-3xl border-2 bg-white p-5 text-start transition-colors dark:bg-[#0E1424] ${on ? "border-emerald-700 dark:border-emerald-400" : "border-slate-200 hover:border-slate-400 dark:border-white/15 dark:hover:border-white/40"} ${ring}`}>
            <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-2xl ${on ? "bg-emerald-700 text-white dark:bg-emerald-400 dark:text-emerald-950" : "bg-slate-100 text-slate-700 dark:bg-white/10 dark:text-slate-200"}`}><m.icon aria-hidden className="h-5 w-5" /></span>
            <span className="flex-1"><span className="block font-display text-lg font-semibold text-slate-900 dark:text-white">{m.title}</span><span className="text-slate-600 dark:text-slate-400">{m.text}</span></span>
            {on && <Check aria-hidden className="h-5 w-5 text-emerald-700 dark:text-emerald-400" />}
          </button>
        );
      })}
    </div>
  );
  return (
    <div role="group" aria-label={t("How do you want to rent?")} className="inline-flex rounded-2xl border border-slate-300 bg-white p-1 dark:border-white/15 dark:bg-white/5">
      {t.tr(methods).map((m) => {
        const on = f.method === m.id;
        return (
          <button key={m.id} onClick={() => f.setMethod(m.id)} aria-pressed={on}
            className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-[15px] font-semibold transition-colors ${on ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900" : "text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"} ${ring}`}>
            <m.icon aria-hidden className="h-4 w-4" />{m.title}
          </button>
        );
      })}
    </div>
  );
}

// ---------- Choices ----------

export const choice = (on: boolean, disabled = false) =>
  `flex w-full items-center gap-3 rounded-2xl border-2 bg-white px-4 py-3 text-start transition-colors dark:bg-[#0E1424] ${ring} ${disabled
    ? "cursor-not-allowed border-dashed border-slate-200 opacity-60 dark:border-white/10"
    : on ? "border-emerald-700 dark:border-emerald-400" : "border-slate-200 hover:border-slate-400 dark:border-white/15 dark:hover:border-white/40"}`;

export function Picked({ on }: { on: boolean }) {
  return on ? <Check aria-hidden className="h-5 w-5 shrink-0 text-emerald-700 dark:text-emerald-400" /> : null;
}

const cols = (layout: "list" | "grid") => (layout === "grid" ? "grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3" : "grid gap-2.5");

// Periods. "from" hints: all apps → cheapest country for that period; one app → cheapest app in the chosen country.
export function PeriodChoices({ f, layout = "list" }: { f: RentFlow; layout?: "list" | "grid" | "chips" }) {
  const usd = useMoney().format;
  const t = useT();
  const hint = (d: Duration) => f.method === "all"
    ? Math.min(...countriesFor(d).map((x) => x.price))
    : f.country ? appFrom(f.country, d) : 0;
  if (layout === "chips") return (
    <div role="group" aria-label={t("Rental period")} className="flex flex-wrap gap-2">
      {t.tr(durations).map((d) => {
        const on = f.period?.days === d.days;
        return (
          <button key={d.days} onClick={() => f.pickPeriod(d)} aria-pressed={on}
            className={`rounded-full border-2 px-5 py-2.5 text-[15px] font-semibold transition-colors ${on ? "border-emerald-700 bg-emerald-700 text-white dark:border-emerald-400 dark:bg-emerald-400 dark:text-emerald-950" : "border-slate-300 text-slate-800 hover:border-slate-500 dark:border-white/20 dark:text-slate-100"} ${ring}`}>
            {d.label}<span className={`ms-1.5 font-normal ${on ? "opacity-90" : "text-slate-600 dark:text-slate-400"}`}>{t("from")}{" "}{usd(hint(d))}</span>
          </button>
        );
      })}
    </div>
  );
  return (
    <ul className={layout === "grid" ? "grid gap-2.5 sm:grid-cols-3" : "grid gap-2.5"}>
      {t.tr(durations).map((d) => {
        const on = f.period?.days === d.days;
        const save = savingFor(d);
        return (
          <li key={d.days}>
            <button onClick={() => f.pickPeriod(d)} aria-pressed={on} className={choice(on)}>
              <span className="flex-1">
                <span className="block font-semibold text-slate-900 dark:text-white">{d.label}</span>
                <span className="text-sm text-slate-600 dark:text-slate-400">{d.days}{" "}{t("days")}{save > 0 && <>{" "}{t("· save")}{" "}{save}%</>}</span>
              </span>
              <span className="text-end text-sm text-slate-700 dark:text-slate-300">{t("from")}<span className="block text-base font-bold text-slate-900 dark:text-white">{usd(hint(d))}</span></span>
              <Picked on={on} />
            </button>
          </li>
        );
      })}
    </ul>
  );
}

// Class for a list that scrolls inside its card (the search box above it stays put). The padding keeps focus rings
// from being clipped.
export const scrollList = "max-h-[440px] overflow-y-auto overscroll-contain -m-1 p-1 pe-2 [scrollbar-width:thin]";

function Searchable({ label, children, q, setQ, scroll = "" }: { label: string; children: ReactNode; q: string; setQ: (v: string) => void; scroll?: string }) {
  return (
    <div>
      <label className="relative block">
        <span className="sr-only">{label}</span>
        <Search aria-hidden className="pointer-events-none absolute start-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
        <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder={label} autoComplete="off" className={`${field} ps-11`} />
      </label>
      <div className={`mt-3 ${scroll}`}>{children}</div>
    </div>
  );
}

// Countries. All apps: the ones available for the chosen period, with its price and stock (after loading).
// One app: every country, with the cheapest one-app weekly price as a hint.
// `scroll`: a class (e.g. scrollList) that makes the list scroll inside its card instead of growing the page.
export function CountryChoices({ f, layout = "list", search = true, scroll = "" }: { f: RentFlow; layout?: "list" | "grid"; search?: boolean; scroll?: string }) {
  const usd = useMoney().format;
  const t = useT();
  const [q, setQ] = useState("");
  if (f.method === "all" && f.loading) return (
    <div role="status" aria-live="polite" className="flex items-center gap-3 rounded-2xl border border-dashed border-slate-300 p-6 text-slate-700 dark:border-white/20 dark:text-slate-300">
      <Loader2 aria-hidden className="h-5 w-5 animate-spin text-emerald-700 dark:text-emerald-400" />{t("Finding countries with numbers for")}{" "}{f.period?.label}…
    </div>
  );
  const rows = f.method === "all" && f.period
    ? countriesFor(f.period).map((x) => ({ c: x.country, price: x.price, note: `${x.stock} available` }))
    : t.tr(rentCountries).map((c) => ({ c, price: appFrom(c, t.tr(durations)[0]), note: t("per week, one app") }));
  const list = rows.filter((r) => r.c.name.toLowerCase().includes(q.trim().toLowerCase()));
  const body = (
    <>
      {f.method === "all" && <p aria-live="polite" className="sr-only">{rows.length}{" "}{t("countries available for")}{" "}{f.period?.label}.</p>}
      <ul className={cols(layout)}>
        {list.map(({ c, price, note }) => {
          const on = f.country?.cc === c.cc;
          return (
            <li key={c.cc}>
              <button onClick={() => f.pickCountry(c)} aria-pressed={on} className={choice(on)}>
                <CC cc={c.cc} />
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-semibold text-slate-900 dark:text-white">{c.name}</span>
                  <span className="text-sm text-slate-600 dark:text-slate-400">{note}</span>
                </span>
                <span className="text-end font-bold text-slate-900 dark:text-white">{f.method === "app" && <span className="block text-xs font-normal text-slate-600 dark:text-slate-400">{t("from")}</span>}{usd(price)}</span>
                <Picked on={on} />
              </button>
            </li>
          );
        })}
      </ul>
      {list.length === 0 && <p className="text-slate-600 dark:text-slate-400">{t("No country matches “")}{q}”.</p>}
    </>
  );
  return search ? <Searchable label={t("Search countries")} q={q} setQ={setQ} scroll={scroll}>{body}</Searchable> : <div className={scroll}>{body}</div>;
}

// Apps for the chosen country and period, with exact prices; out-of-stock apps are shown but disabled.
export function AppChoices({ f, layout = "list", search = true, scroll = "" }: { f: RentFlow; layout?: "list" | "grid"; search?: boolean; scroll?: string }) {
  const usd = useMoney().format;
  const t = useT();
  const [q, setQ] = useState("");
  if (!f.country || !f.period) return null;
  const list = appsFor(f.country, f.period).filter((x) => x.app.name.toLowerCase().includes(q.trim().toLowerCase()));
  const body = (
    <ul className={cols(layout)}>
      {list.map(({ app, price, stock }) => {
        const on = f.app?.id === app.id;
        const out = stock <= 0;
        return (
          <li key={app.id}>
            <button onClick={() => f.pickApp(app)} aria-pressed={on} disabled={out} className={choice(on, out)}>
              <AppTile app={app} size="sm" />
              <span className="min-w-0 flex-1">
                <span className="block truncate font-semibold text-slate-900 dark:text-white">{app.name}</span>
                <span className="text-sm text-slate-600 dark:text-slate-400">{out ? t("Out of stock") : `${stock} available`}</span>
              </span>
              {!out && <span className="font-bold text-slate-900 dark:text-white">{usd(price)}</span>}
              <Picked on={on} />
            </button>
          </li>
        );
      })}
    </ul>
  );
  return search ? <Searchable label={t("Search apps")} q={q} setQ={setQ} scroll={scroll}>{body}</Searchable> : <div className={scroll}>{body}</div>;
}

// Renders the picker for a step.
export function StepChoices({ f, step, layout = "list", scroll }: { f: RentFlow; step: StepId; layout?: "list" | "grid"; scroll?: string }) {
  if (step === "period") return <PeriodChoices f={f} layout={layout} />;
  if (step === "country") return <CountryChoices f={f} layout={layout} scroll={scroll} />;
  return <AppChoices f={f} layout={layout} scroll={scroll} />;
}

// Shown once everything is chosen, to reopen the payment window if it was closed.
export function PayAgain({ f, className = "" }: { f: RentFlow; className?: string }) {
  const usd = useMoney().format;
  const t = useT();
  if (!f.ready) return null;
  return <button onClick={f.openPay} className={`${primary} w-full ${className}`}>{t("Continue to payment ·")}{" "}{usd(f.price)}</button>;
}

// One-line summary of a finished step.
export function StepValue({ f, step }: { f: RentFlow; step: StepId }) {
  if (step === "period" && f.period) return <>{f.period.label}</>;
  if (step === "country" && f.country) return <span className="inline-flex items-center gap-2"><CC cc={f.country.cc} />{f.country.name}</span>;
  if (step === "app" && f.app) return <span className="inline-flex items-center gap-2"><AppTile app={f.app} size="sm" />{f.app.name}</span>;
  return null;
}
