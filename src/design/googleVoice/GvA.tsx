"use client";

import { useMemo, useState } from "react";
import { AlertCircle, CheckCircle2, Search } from "lucide-react";
import { matches } from "@/content/google-voice-en";
import { useMoney } from "@/lib/money";
import { PageShell, PageTitle } from "../otp/parts";
import { useHasExtras } from "../service/slot";
import { BuyButton, Faq, Features, GvCheckout, Guarantees, gvPrice, NumberTile, OrderView, SectionTitle, Steps, useGv } from "./parts";
import { useT } from "@/i18n/client";
import { useLiveGv } from "./live";

// Page A — "Number Picker": the whole stock as a grid you filter by state or search by digits. The chosen number,
// price and Buy stay in a bar at the bottom of the screen. Features, steps and FAQ below.
// Live: the numbers and their prices come from the backend (Numberland); each number has its own price.
export default function GvA() {
  const t = useT();
  const gv = useGv();
  const money = useMoney();
  // On the live page the shared sections (how to use, FAQ, …) follow, so this design's own copies are dropped.
  const extras = useHasExtras();
  const live = useLiveGv();
  const [state, setState] = useState(() => (live?.initialState && gv.numbers.some((n) => n.state === live.initialState) ? live.initialState : "all"));
  const [q, setQ] = useState("");
  const states = useMemo(() => [...new Set(gv.numbers.map((n) => n.state))].sort(), [gv.numbers]);
  const list = gv.numbers.filter((n) => (state === "all" || n.state === state) && matches(n, q));
  const prices = gv.numbers.map(gvPrice);
  const from = prices.length ? Math.min(...prices) : 0;
  const empty = gv.numbers.length === 0;

  if (gv.order) return <PageShell><div className="px-6 py-14"><OrderView gv={gv} /></div></PageShell>;

  return (
    <PageShell>
      <div className="mx-auto max-w-6xl px-6 pb-32 pt-14">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <PageTitle kicker={t("Google Voice")} title={t("Your own permanent US number")} sub={empty ? t("Calls and texts, on a Google account you control. One payment, no monthly fee.") : t("Calls and texts, on a Google account you control. One payment, from {0}.", { 0: money.format(from) })} />
          <Guarantees />
        </div>

        {gv.notice && (
          <p role="status" className={`mt-8 flex items-start gap-3 rounded-2xl px-4 py-3 text-sm ring-1 ${gv.notice.good ? "bg-emerald-50 text-emerald-900 ring-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-200 dark:ring-emerald-400/25" : "bg-amber-50 text-amber-900 ring-amber-200 dark:bg-amber-500/10 dark:text-amber-200 dark:ring-amber-400/25"}`}>
            {gv.notice.good ? <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" /> : <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />}{gv.notice.text}
          </p>
        )}

        <div className="mt-10 flex flex-wrap items-center gap-3">
          <label className="flex min-w-60 flex-1 items-center gap-2 rounded-2xl bg-white px-4 py-3 ring-1 ring-slate-200 focus-within:ring-2 focus-within:ring-emerald-500 sm:max-w-xs dark:bg-white/5 dark:ring-white/10">
            <Search className="h-4 w-4 text-slate-400" />
            <input value={q} onChange={(e) => setQ(e.target.value)} inputMode="search" placeholder={t("Area code, digits or city")} className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400 dark:text-white" />
          </label>
          <div className="flex gap-1.5 overflow-x-auto [scrollbar-width:none]">
            {["all", ...states].map((s) => (
              <button key={s} onClick={() => setState(s)} className={`shrink-0 rounded-full px-3.5 py-2 text-sm font-medium transition-colors ${state === s ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900" : "bg-white text-slate-600 ring-1 ring-slate-200 hover:text-slate-900 dark:bg-white/5 dark:text-slate-300 dark:ring-white/10"}`}>
                {s === "all" ? t("All states") : s}
              </button>
            ))}
          </div>
          <span className="ms-auto text-sm text-slate-500 dark:text-slate-400"><b className="text-slate-900 dark:text-white">{list.length}</b>{" "}{t("in stock")}</span>
        </div>

        <div key={`${state}-${q}`} className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((n, i) => (
            <div key={n.id} className="animate-fade-up [animation-duration:350ms]" style={{ animationDelay: `${Math.min(i, 8) * 30}ms` }}>
              <NumberTile n={n} on={gv.selected.id === n.id} onPick={() => gv.setSelected(n)} price={gv.live ? money.format(gvPrice(n)) : undefined} />
            </div>
          ))}
          {list.length === 0 && <p className="col-span-full rounded-3xl border border-dashed border-slate-300 p-10 text-center text-slate-500 dark:border-white/15 dark:text-slate-400">{gv.error ?? (empty ? t("All Google Voice numbers are sold right now. New ones are added often; check back soon.") : t("No number matches that. Try another area code."))}</p>}
        </div>

        <section className="mt-20"><Features /></section>
        {!extras && <section className="mt-20"><SectionTitle kicker={t("How it works")} title={t("Three steps to your US number")} /><div className="mt-8"><Steps /></div></section>}
        {!extras && <section className="mt-20 max-w-3xl"><SectionTitle kicker="FAQ" title={t("Questions about Google Voice")} /><div className="mt-8"><Faq /></div></section>}
      </div>

      {!empty && <div className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-200 bg-white/90 backdrop-blur-xl dark:border-white/10 dark:bg-[#0B1020]/90">
        <div className="mx-auto flex max-w-6xl items-center gap-4 px-6 py-3">
          <div className="min-w-0 flex-1">
            <div className="text-xs text-slate-500 dark:text-slate-400">{t("Selected")}</div>
            <div className="truncate font-mono font-semibold text-slate-900 dark:text-white">{gv.selected.number} <span className="font-sans text-sm font-normal text-slate-500 dark:text-slate-400">· {gv.selected.city}</span></div>
          </div>
          <BuyButton gv={gv}>{t("Buy ·")}{" "}{money.format(gvPrice(gv.selected))}</BuyButton>
        </div>
      </div>}
      {!empty && <GvCheckout gv={gv} />}
    </PageShell>
  );
}
