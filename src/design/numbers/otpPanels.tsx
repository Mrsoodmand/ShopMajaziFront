"use client";

import { useEffect, useId, useRef, useState, type ComponentType, type ReactNode } from "react";
import { ArrowRight, Check, ChevronDown, Pencil, Radio, Search, ShieldCheck, Trophy, Zap, Coins } from "lucide-react";
import type { OtpFlow } from "../otp/flow";
import { AppChoices, CountryChoices, LoadingRows } from "../otp/Choices";
import { OperatorList } from "../otp/flowParts";
import { AppTile, CC, SuccessBar } from "../otp/parts";
import { PanelStep, searchFocus, searchIcon } from "./kit";
import { useMoney } from "@/lib/money";
import { useT } from "@/i18n/client";

// Five versions of the virtual number catalog's panel (page P), chosen in /design/page-otp-panel. Each gets the
// same flow: the card picked in the grid is fixed (an app, or a country with "By country"); the panel asks for the
// other one (country or app), then the operator, then opens the payment window.

// One choice in the panel's list: a country (app first) or an app (country first).
export type Item = { id: string; name: string; alt?: string; visual: ReactNode; price: number; success?: number; stock?: number };
export type PanelProps = {
  f: OtpFlow; byApp: boolean; items: Item[]; value: string | null; pick: (id: string) => void; loading: boolean;
  listTitle: string; searchLabel: string; onPay: () => void;
};

const ring = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2 dark:focus-visible:ring-indigo-400 dark:focus-visible:ring-offset-[#0E1424]";
const cta = `flex w-full items-center justify-center gap-2 rounded-2xl bg-indigo-600 py-3.5 font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-40 ${ring}`;

// Turns the flow's offers into panel items.
export function itemsOf(f: OtpFlow, byApp: boolean): Item[] {
  return byApp
    ? f.countryOptions.map((o) => ({ id: o.country.cc, name: o.country.name, alt: `${o.country.alt ?? ""} ${o.country.cc}`, visual: <CC cc={o.country.cc} flag={o.country.flag} />, price: o.price, success: o.success, stock: o.stock }))
    : f.appOptions.map((o) => ({ id: o.app.id, name: o.app.name, alt: o.app.alt, visual: <AppTile app={o.app} size="sm" />, price: o.price, success: o.success, stock: o.stock }));
}

function useSearch(items: Item[]) {
  const [q, setQ] = useState("");
  const t = q.trim().toLowerCase();
  return { q, setQ, list: t ? items.filter((i) => `${i.name} ${i.alt ?? ""}`.toLowerCase().includes(t)) : items };
}

function SearchInput({ q, setQ, label }: { q: string; setQ: (v: string) => void; label: string }) {
  return (
    <label className="group relative block">
      <span className="sr-only">{label}</span>
      <Search aria-hidden className={`pointer-events-none absolute start-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500 ${searchIcon}`} />
      <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder={label} autoComplete="off"
        className={`h-11 w-full rounded-xl border border-slate-300 bg-white pe-3 ps-10 text-sm text-slate-900 placeholder:text-slate-500 dark:border-white/15 dark:bg-white/5 dark:text-white dark:placeholder:text-slate-400 ${searchFocus}`} />
    </label>
  );
}

const ready = (f: OtpFlow) => !!f.app && !!f.country;

// A list that scrolls inside the panel with no scrollbar. It shows that it scrolls instead: the edge with more
// rows beyond it fades out, and while there is more below, a small "More countries" button sits at the bottom
// (a tap scrolls one screen down). Both update as the list scrolls or changes size.
function ScrollList({ className = "", more, children }: { className?: string; more: string; children: ReactNode }) {
  const ref = useRef<HTMLUListElement>(null);
  const [edge, setEdge] = useState({ top: true, bottom: true });
  const update = () => {
    const el = ref.current;
    if (!el) return;
    const top = el.scrollTop <= 2;
    const bottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 2;
    setEdge((e) => (e.top === top && e.bottom === bottom ? e : { top, bottom }));
  };
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    for (const c of Array.from(el.children)) ro.observe(c);
    return () => ro.disconnect();
  });
  const fade = 48;
  const mask = `linear-gradient(to bottom, ${edge.top ? "black" : "transparent"} 0, black ${edge.top ? 0 : fade}px, black calc(100% - ${edge.bottom ? 0 : fade}px), ${edge.bottom ? "black" : "transparent"} 100%)`;
  const down = () => {
    const el = ref.current;
    if (!el) return;
    el.scrollBy({ top: el.clientHeight * 0.8, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  };
  return (
    <div className="relative">
      <ul ref={ref} onScroll={update} style={{ maskImage: mask, WebkitMaskImage: mask }}
        className={`-m-1 overflow-y-auto overscroll-contain p-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${className}`}>
        {children}
      </ul>
      <button type="button" onClick={down} tabIndex={edge.bottom ? -1 : 0} aria-hidden={edge.bottom}
        className={`absolute bottom-1 left-1/2 flex -translate-x-1/2 items-center gap-1 rounded-full bg-slate-900/90 px-3 py-1 text-xs font-semibold text-white shadow-lg backdrop-blur transition-[opacity,translate] duration-300 dark:bg-white/90 dark:text-slate-900 ${ring} ${edge.bottom ? "pointer-events-none translate-y-2 opacity-0" : "opacity-100"}`}>
        {more}<ChevronDown aria-hidden className="h-3.5 w-3.5 animate-[more-hint_1.6s_ease-in-out_infinite]" />
      </button>
    </div>
  );
}

function PayButton({ f, onPay, className = "" }: { f: OtpFlow; onPay: () => void; className?: string }) {
  const t = useT();
  const usd = useMoney().format;
  return (
    <button type="button" onClick={onPay} disabled={!f.operator} className={`${cta} ${className}`}>
      {f.operator ? <>{t("Continue to payment ·")}{" "}{usd(f.operator.price)}<ArrowRight aria-hidden className="h-4 w-4 rtl:rotate-180" /></> : t("Pick an operator")}
    </button>
  );
}

// ---------- A · Steps (the first version) ----------
// Numbered steps: the full searchable list with price sorting, then operator cards and Continue.
function Steps({ f, byApp, pick, onPay }: PanelProps) {
  const t = useT();
  return (
    <>
      <PanelStep n={1} title={byApp ? t("Country") : t("App")} done={byApp ? !!f.country : !!f.app}>
        {byApp
          ? <CountryChoices compact options={f.countryOptions} value={f.country?.cc ?? null} onPick={pick} priced="exact" loading={f.countriesLoading} sortable />
          : <AppChoices layout="list" options={f.appOptions} value={f.app?.id ?? null} onPick={pick} priced="exact" loading={f.appsLoading} sortable />}
      </PanelStep>
      <PanelStep n={2} title={t("Operator")} done={!!f.operator}>
        {!ready(f) ? <p className="text-sm text-slate-600 dark:text-slate-400">{t("Choose step")}{" "}1{" "}{t("first")}</p>
          : f.operatorsLoading ? <LoadingRows rows={3} />
          : <div className="[&_[role=radiogroup]]:sm:grid-cols-1"><OperatorList ops={f.operators} value={f.operator?.id ?? null} onPick={(id) => { f.pickOperator(id); onPay(); }} /></div>}
        <PayButton f={f} onPay={onPay} className="mt-4" />
      </PanelStep>
    </>
  );
}

// ---------- B · Compact ----------
// Fits a phone screen: the country (or app) as one native dropdown with prices, operators as small segments,
// and the price with Continue side by side at the bottom.
function Compact({ f, byApp, items, value, pick, loading, listTitle, onPay }: PanelProps) {
  const t = useT();
  const usd = useMoney().format;
  const id = useId();
  return (
    <div className="space-y-5">
      <div>
        <label htmlFor={id} className="block text-sm font-semibold text-slate-900 dark:text-white">{listTitle}</label>
        {loading ? <div className="mt-2"><LoadingRows rows={1} /></div> : (
          <div className="relative mt-2">
            <select id={id} value={value ?? ""} onChange={(e) => e.target.value && pick(e.target.value)}
              className={`h-12 w-full appearance-none rounded-xl border border-slate-300 bg-white pe-10 ps-4 text-[15px] font-medium text-slate-900 dark:border-white/15 dark:bg-[#0E1424] dark:text-white ${ring}`}>
              <option value="" disabled>{byApp ? t("Choose a country") : t("Choose an app")}</option>
              {items.map((i) => <option key={i.id} value={i.id}>{i.name} — {usd(i.price)}</option>)}
            </select>
            <ChevronDown aria-hidden className="pointer-events-none absolute end-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          </div>
        )}
        <p className="mt-1.5 text-xs text-slate-600 dark:text-slate-400">{byApp ? t("Cheapest countries first.") : t("Prices for this country.")}</p>
      </div>
      <fieldset disabled={!ready(f)} className="disabled:opacity-50">
        <legend className="text-sm font-semibold text-slate-900 dark:text-white">{t("Operator")}</legend>
        {ready(f) && f.operatorsLoading ? <div className="mt-2"><LoadingRows rows={2} /></div> : (
          <div className="mt-2 grid gap-1.5 rounded-2xl bg-slate-100 p-1.5 dark:bg-white/5">
            {(ready(f) ? f.operators : []).map((o) => {
              const on = f.operator?.id === o.id;
              return (
                <label key={o.id} className={`flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-indigo-600 ${on ? "bg-white font-semibold text-slate-900 shadow-sm dark:bg-[#0E1424] dark:text-white" : "text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"}`}>
                  <input type="radio" name={`${id}-op`} checked={on} onChange={() => f.pickOperator(o.id)} className="sr-only" />
                  <span className="min-w-0 flex-1 truncate">{o.name}{o.recommended && <span className="ms-2 rounded-full bg-emerald-100 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-300">{t("Recommended")}</span>}</span>
                  <span className="tabular-nums">{usd(o.price)}</span>
                </label>
              );
            })}
            {!ready(f) && <p className="px-3 py-2.5 text-sm text-slate-600 dark:text-slate-400">{byApp ? t("Choose a country first") : t("Choose an app first")}</p>}
          </div>
        )}
      </fieldset>
      <div className="flex items-center gap-3 border-t border-slate-200 pt-4 dark:border-white/10">
        <div className="min-w-0 flex-1">
          <div className="text-xs text-slate-600 dark:text-slate-400">{t("Total")}</div>
          <div className="font-display text-2xl font-bold tabular-nums text-slate-900 dark:text-white">{f.operator ? usd(f.operator.price) : "—"}</div>
        </div>
        <button type="button" onClick={onPay} disabled={!f.operator} className={`${cta} w-auto px-6`}>{t("Continue")}<ArrowRight aria-hidden className="h-4 w-4 rtl:rotate-180" /></button>
      </div>
    </div>
  );
}

// ---------- C · Best Picks ----------
// Three suggestions up top (cheapest, best success rate, most numbers) as big cards; the full list folds away
// below them. Operators as chips with their price.
function BestPicks({ f, byApp, items, value, pick, loading, listTitle, searchLabel, onPay }: PanelProps) {
  const t = useT();
  const usd = useMoney().format;
  const s = useSearch(items);
  const [open, setOpen] = useState(false);
  const by = (score: (i: Item) => number) => items.slice().sort((a, b) => score(b) - score(a))[0];
  const picks = items.length ? [
    { label: t("Cheapest"), icon: Coins, item: by((i) => -i.price) },
    { label: t("Best success rate"), icon: Trophy, item: items.some((i) => i.success != null) ? by((i) => i.success ?? 0) : undefined },
    { label: t("Most numbers"), icon: Zap, item: items.some((i) => i.stock != null) ? by((i) => i.stock ?? 0) : undefined },
  ].filter((p, i, all) => p.item && all.findIndex((x) => x.item?.id === p.item?.id) === i) : [];
  const chosenElsewhere = value && !picks.some((p) => p.item?.id === value) ? items.find((i) => i.id === value) : undefined;
  return (
    <div className="space-y-6">
      <section>
        <h3 className="font-display text-[15px] font-semibold text-slate-900 dark:text-white">{listTitle}</h3>
        {loading ? <div className="mt-3"><LoadingRows rows={3} /></div> : (
          <>
            <ul className="mt-3 grid gap-2.5">
              {[...picks.map((p) => ({ ...p, item: p.item! })), ...(chosenElsewhere ? [{ label: t("Your choice"), icon: Check, item: chosenElsewhere }] : [])].map(({ label, icon: Icon, item }) => {
                const on = value === item.id;
                return (
                  <li key={item.id}>
                    <button type="button" onClick={() => pick(item.id)} aria-pressed={on}
                      className={`flex w-full items-center gap-3 rounded-2xl border-2 p-3.5 text-start transition-colors ${ring} ${on ? "border-indigo-600 bg-indigo-50 dark:border-indigo-400 dark:bg-indigo-500/10" : "border-slate-200 hover:border-slate-400 dark:border-white/15 dark:hover:border-white/40"}`}>
                      {item.visual}
                      <span className="min-w-0 flex-1">
                        <span className="flex items-center gap-1.5 text-xs font-semibold text-indigo-700 dark:text-indigo-300"><Icon aria-hidden className="h-3.5 w-3.5" />{label}</span>
                        <span className="block truncate font-semibold text-slate-900 dark:text-white">{item.name}</span>
                        <SuccessBar pct={item.success} />
                      </span>
                      <span className="shrink-0 font-display text-lg font-bold tabular-nums text-slate-900 dark:text-white">{usd(item.price)}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
            <button type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open}
              className={`mt-3 flex w-full items-center justify-between rounded-xl px-1 py-2 text-sm font-semibold text-indigo-700 hover:text-indigo-900 dark:text-indigo-300 dark:hover:text-indigo-200 ${ring}`}>
              {byApp ? t("All {0} countries", { 0: items.length }) : t("All {0} apps", { 0: items.length })}<ChevronDown aria-hidden className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`} />
            </button>
            {open && (
              <div className="mt-2 space-y-2">
                <SearchInput q={s.q} setQ={s.setQ} label={searchLabel} />
                <ul className="-m-1 max-h-72 space-y-1 overflow-y-auto overscroll-contain p-1 [scrollbar-width:thin]">
                  {s.list.map((i) => {
                    const on = value === i.id;
                    return (
                      <li key={i.id}>
                        <button type="button" onClick={() => pick(i.id)} aria-pressed={on}
                          className={`flex w-full items-center gap-3 rounded-xl px-2.5 py-2 text-start text-sm transition-colors ${ring} ${on ? "bg-indigo-600 font-semibold text-white" : "text-slate-800 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-white/5"}`}>
                          {i.visual}<span className="min-w-0 flex-1 truncate">{i.name}</span><span className="tabular-nums">{usd(i.price)}</span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </>
        )}
      </section>
      <section>
        <h3 className="font-display text-[15px] font-semibold text-slate-900 dark:text-white">{t("Operator")}</h3>
        {!ready(f) ? <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{byApp ? t("Choose a country first") : t("Choose an app first")}</p>
          : f.operatorsLoading ? <div className="mt-3"><LoadingRows rows={2} /></div> : (
            <div role="radiogroup" aria-label={t("Operator")} className="mt-3 flex flex-wrap gap-2">
              {f.operators.map((o) => {
                const on = f.operator?.id === o.id;
                return (
                  <button key={o.id} type="button" role="radio" aria-checked={on} onClick={() => f.pickOperator(o.id)}
                    className={`inline-flex items-center gap-2 rounded-full border-2 px-4 py-2 text-sm font-semibold transition-colors ${ring} ${on ? "border-indigo-600 bg-indigo-600 text-white dark:border-indigo-400 dark:bg-indigo-500" : "border-slate-300 text-slate-800 hover:border-slate-500 dark:border-white/20 dark:text-slate-100"}`}>
                    {o.recommended && <ShieldCheck aria-hidden className="h-4 w-4" />}{o.name}<span className={`font-normal tabular-nums ${on ? "text-indigo-100" : "text-slate-600 dark:text-slate-400"}`}>{usd(o.price)}</span>
                  </button>
                );
              })}
            </div>
          )}
      </section>
      <PayButton f={f} onPay={onPay} />
    </div>
  );
}

// ---------- D · One at a Time ----------
// Only the current question is open. A finished one folds to a line with its answer and Change; at the end, a
// short summary with Continue.
function OneAtATime({ f, byApp, items, value, pick, loading, listTitle, searchLabel, onPay }: PanelProps) {
  const t = useT();
  const usd = useMoney().format;
  const s = useSearch(items);
  const [editing, setEditing] = useState(false);
  const chosen = items.find((i) => i.id === value);
  const firstOpen = !chosen || editing;
  const Row = ({ n, title, answer, onChange }: { n: number; title: string; answer: ReactNode; onChange: () => void }) => (
    <div className="flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3 dark:bg-white/5">
      <span aria-hidden className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-emerald-700 text-white dark:bg-emerald-400 dark:text-emerald-950"><Check className="h-3.5 w-3.5" /></span>
      <span className="min-w-0 flex-1"><span className="block text-xs text-slate-600 dark:text-slate-400">{n}. {title}</span><span className="flex items-center gap-2 truncate font-semibold text-slate-900 dark:text-white">{answer}</span></span>
      <button type="button" onClick={onChange} className={`flex items-center gap-1 rounded-lg px-2 py-1 text-sm font-semibold text-indigo-700 hover:bg-indigo-50 dark:text-indigo-300 dark:hover:bg-indigo-500/10 ${ring}`}><Pencil aria-hidden className="h-3.5 w-3.5" />{t("Change")}<span className="sr-only">{" "}{title}</span></button>
    </div>
  );
  return (
    <div className="space-y-3">
      {firstOpen ? (
        <section className="rounded-2xl border border-slate-200 p-4 dark:border-white/10">
          <h3 className="font-display text-[15px] font-semibold text-slate-900 dark:text-white">1. {listTitle}</h3>
          <div className="mt-3 space-y-2">
            <SearchInput q={s.q} setQ={s.setQ} label={searchLabel} />
            {loading ? <LoadingRows /> : (
              <ul className="-m-1 max-h-80 space-y-1 overflow-y-auto overscroll-contain p-1 [scrollbar-width:thin]">
                {s.list.map((i) => (
                  <li key={i.id}>
                    <button type="button" onClick={() => { pick(i.id); setEditing(false); }} aria-pressed={value === i.id}
                      className={`flex w-full items-center gap-3 rounded-xl px-2.5 py-2.5 text-start text-sm transition-colors ${ring} ${value === i.id ? "bg-indigo-600 font-semibold text-white" : "text-slate-800 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-white/5"}`}>
                      {i.visual}<span className="min-w-0 flex-1 truncate">{i.name}</span><span className="font-semibold tabular-nums">{usd(i.price)}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      ) : <Row n={1} title={listTitle} answer={<>{chosen.visual}<span className="truncate">{chosen.name}</span></>} onChange={() => setEditing(true)} />}

      {!firstOpen && (f.operator && !f.operatorsLoading ? (
        <Row n={2} title={t("Operator")} answer={<><Radio aria-hidden className="h-4 w-4 text-slate-500" />{f.operator.name}</>} onChange={() => f.clearOperator()} />
      ) : (
        <section className="rounded-2xl border border-slate-200 p-4 dark:border-white/10">
          <h3 className="font-display text-[15px] font-semibold text-slate-900 dark:text-white">2. {t("Operator")}</h3>
          <div className="mt-3">{f.operatorsLoading ? <LoadingRows rows={3} /> : <div className="[&_[role=radiogroup]]:sm:grid-cols-1"><OperatorList ops={f.operators} value={null} onPick={(id) => f.pickOperator(id)} /></div>}</div>
        </section>
      ))}
      {firstOpen && <p className="px-1 text-sm text-slate-600 dark:text-slate-400">2. {t("Operator")}{" "}·{" "}{byApp ? t("Choose a country first") : t("Choose an app first")}</p>}

      {f.operator && !firstOpen && (
        <dl className="mt-2 space-y-1 border-t border-slate-200 pt-4 text-[15px] dark:border-white/10">
          <div className="flex justify-between gap-4"><dt className="text-slate-600 dark:text-slate-400">{t("Number for")}</dt><dd className="font-medium text-slate-900 dark:text-white">{f.app?.name} · {f.country?.name}</dd></div>
          <div className="flex justify-between gap-4"><dt className="text-slate-600 dark:text-slate-400">{t("Total")}</dt><dd className="font-display text-xl font-bold tabular-nums text-slate-900 dark:text-white">{usd(f.operator.price)}</dd></div>
        </dl>
      )}
      <PayButton f={f} onPay={onPay} className="mt-2" />
    </div>
  );
}

// ---------- E · Quick Buy ----------
// Two taps: the list shows every country (or app) with its price; the chosen row opens in place with its operators,
// each with its own Buy button that goes straight to payment. No separate Continue.
function QuickBuy({ f, byApp, items, value, pick, loading, searchLabel, listTitle, onPay }: PanelProps) {
  const t = useT();
  const usd = useMoney().format;
  const s = useSearch(items);
  return (
    <div className="space-y-3">
      <h3 className="font-display text-[15px] font-semibold text-slate-900 dark:text-white">{listTitle}</h3>
      <SearchInput q={s.q} setQ={s.setQ} label={searchLabel} />
      {loading ? <LoadingRows /> : (
        <ScrollList className="max-h-[520px] space-y-1.5" more={byApp ? t("More countries") : t("More apps")}>
          {s.list.map((i) => {
            const on = value === i.id;
            return (
              <li key={i.id} className={`rounded-2xl transition-colors ${on ? "bg-indigo-50 ring-2 ring-indigo-600 dark:bg-indigo-500/10 dark:ring-indigo-400" : ""}`}>
                <button type="button" onClick={() => pick(i.id)} aria-expanded={on}
                  className={`flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-start text-sm transition-colors ${ring} ${on ? "font-semibold text-slate-900 dark:text-white" : "text-slate-800 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-white/5"}`}>
                  {i.visual}
                  <span className="min-w-0 flex-1"><span className="block truncate">{i.name}</span>{i.success != null && <SuccessBar pct={i.success} />}</span>
                  <span className="text-xs text-slate-600 dark:text-slate-400">{t("from")}</span><span className="font-semibold tabular-nums">{usd(i.price)}</span>
                  <ChevronDown aria-hidden className={`h-4 w-4 shrink-0 text-slate-500 transition-transform ${on ? "rotate-180" : ""}`} />
                </button>
                {on && (
                  <div className="px-3 pb-3">
                    {f.operatorsLoading || !ready(f) ? <LoadingRows rows={2} /> : (
                      <ul className="space-y-1.5" aria-label={t("Operator")}>
                        {f.operators.map((o) => (
                          <li key={o.id} className="flex items-center gap-3 rounded-xl bg-white px-3 py-2 ring-1 ring-slate-200 dark:bg-[#0E1424] dark:ring-white/10">
                            <span className="min-w-0 flex-1">
                              <span className="flex flex-wrap items-center gap-x-2 text-sm font-semibold text-slate-900 dark:text-white">{o.name}{o.recommended && <span className="rounded-full bg-emerald-100 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-300">{t("Recommended")}</span>}</span>
                              <SuccessBar pct={o.success} />
                            </span>
                            <button type="button" onClick={() => { f.pickOperator(o.id); onPay(); }}
                              className={`shrink-0 rounded-xl bg-indigo-600 px-3.5 py-2 text-sm font-semibold tabular-nums text-white transition hover:bg-indigo-700 ${ring}`}>
                              {t("Buy ·")}{" "}{usd(o.price)}<span className="sr-only">{" "}{o.name}</span>
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </li>
            );
          })}
        </ScrollList>
      )}
      {!loading && s.list.length === 0 && <p role="status" className="rounded-2xl border border-dashed border-slate-300 p-5 text-center text-sm text-slate-600 dark:border-white/15 dark:text-slate-400">{s.q ? <>{t("Nothing matches “")}{s.q}”.</> : byApp ? t("No country has numbers for this app right now.") : t("No numbers in this country right now. Try another one.")}</p>}
    </div>
  );
}

export const otpPanels: Record<string, ComponentType<PanelProps>> = { A: Steps, B: Compact, C: BestPicks, D: OneAtATime, E: QuickBuy };
