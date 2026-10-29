"use client";
import { useMemo, useState } from "react";
import { Search, Sparkles, X } from "lucide-react";
import { useMoney } from "@/lib/money";
import { digits, GV_PRICE, gvNumbers, matches, type GvNumber } from "@/content/google-voice-en";
import { PageShell } from "../otp/parts";
import { BuyButton, Faq, GvCheckout, GvIcon, Guarantees, Included, OrderView, SectionTitle, Steps, useGv } from "./parts";

// Shows the number with the searched digits highlighted.
function Highlight({ n, q }: { n: GvNumber; q: string }) {
  const d = digits(q);
  if (!d) return <>{n.number}</>;
  const all = digits(n.number);
  const at = all.indexOf(d);
  if (at < 0) return <>{n.number}</>;
  let seen = 0;
  return <>{[...n.number].map((ch, i) => {
    const isDigit = /\d/.test(ch);
    const hit = isDigit && seen >= at && seen < at + d.length;
    if (isDigit) seen++;
    return <span key={i} className={hit ? "rounded bg-emerald-400/30 text-emerald-700 dark:text-emerald-300" : ""}>{ch}</span>;
  })}</>;
}

const ideas = ["212", "415", "0100", "77", "Miami"];

// Page D — "Digit Search": like searching for a domain name. A dark hero with one big search for the digits, area
// code or city you want; results highlight the match, and "Easy to remember" numbers get their own row.
export default function GvD() {
  const usd = useMoney().format;
  const gv = useGv();
  const [q, setQ] = useState("");
  const list = useMemo(() => gvNumbers.filter((n) => matches(n, q)), [q]);
  const easy = gvNumbers.filter((n) => n.easy);

  if (gv.order) return <PageShell><div className="px-6 py-14"><OrderView gv={gv} /></div></PageShell>;

  const row = (n: GvNumber) => {
    const on = gv.selected.id === n.id;
    return (
      <li key={n.id}>
        <button onClick={() => gv.setSelected(n)} aria-pressed={on}
          className={`flex w-full items-center gap-4 px-5 py-4 text-start transition-colors ${on ? "bg-emerald-50 dark:bg-emerald-500/10" : "hover:bg-slate-50 dark:hover:bg-white/5"}`}>
          <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${on ? "bg-emerald-500" : "bg-slate-200 dark:bg-white/15"}`} />
          <span className="flex-1 font-mono text-lg font-semibold tracking-tight text-slate-900 dark:text-white"><Highlight n={n} q={q} /></span>
          <span className="hidden text-sm text-slate-500 sm:block dark:text-slate-400">{n.city}, {n.state}</span>
          {n.easy && <Sparkles className="h-4 w-4 text-amber-500" aria-label="Easy to remember" />}
          <span className="w-16 text-end text-sm font-semibold text-slate-900 dark:text-white">{usd(GV_PRICE)}</span>
        </button>
      </li>
    );
  };

  return (
    <PageShell>
      <section className="relative -mt-16 overflow-hidden bg-[#06110E] pb-20 pt-32 text-white">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute -top-20 start-1/2 h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-emerald-500/25 blur-[120px]" />
          <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,.07)_1px,transparent_1px)] bg-[size:22px_22px] [mask-image:radial-gradient(ellipse_at_top,black_30%,transparent_75%)]" />
        </div>
        <div className="relative mx-auto max-w-3xl px-6 text-center">
          <span className="text-sm font-semibold uppercase tracking-widest text-emerald-400">Google Voice · USA</span>
          <h1 className="mt-3 font-display text-4xl font-bold tracking-tight sm:text-6xl">Find a US number you&apos;ll remember</h1>
          <label className="mx-auto mt-10 flex max-w-xl items-center gap-3 rounded-2xl bg-white/10 px-5 py-4 ring-1 ring-white/15 backdrop-blur focus-within:ring-2 focus-within:ring-emerald-400">
            <Search className="h-5 w-5 text-white/50" />
            <input value={q} onChange={(e) => setQ(e.target.value)} inputMode="search" placeholder="Digits, area code or city" className="w-full bg-transparent font-mono text-lg outline-none placeholder:font-sans placeholder:text-base placeholder:text-white/40" />
            {q && <button onClick={() => setQ("")} aria-label="Clear" className="grid h-7 w-7 place-items-center rounded-full bg-white/10"><X className="h-3.5 w-3.5" /></button>}
          </label>
          <div className="mt-4 flex flex-wrap justify-center gap-2 text-sm">
            <span className="text-white/50">Try</span>
            {ideas.map((i) => <button key={i} onClick={() => setQ(i)} className="rounded-full bg-white/10 px-3 py-1 font-mono text-white/80 transition hover:bg-white/20">{i}</button>)}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-6 pb-24">
        <div className="relative -mt-10 grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="overflow-hidden rounded-3xl bg-white shadow-xl shadow-slate-900/5 ring-1 ring-slate-200 dark:bg-[#0E1424] dark:ring-white/10">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3 text-sm dark:border-white/10">
              <span className="text-slate-500 dark:text-slate-400">{q ? <>Results for <b className="font-mono text-slate-900 dark:text-white">{q}</b></> : "All numbers"}</span>
              <span className="text-slate-500 dark:text-slate-400"><b className="text-slate-900 dark:text-white">{list.length}</b> available</span>
            </div>
            {list.length ? <ul className="max-h-[520px] divide-y divide-slate-100 overflow-y-auto dark:divide-white/5">{list.map(row)}</ul>
              : <p className="p-10 text-center text-slate-500 dark:text-slate-400">Nothing with those digits right now. New numbers are added every week.</p>}
          </div>

          <aside className="h-fit space-y-4 lg:sticky lg:top-24">
            <div className="rounded-3xl bg-white p-6 shadow-xl shadow-slate-900/5 ring-1 ring-slate-200 dark:bg-[#0E1424] dark:ring-white/10">
              <div className="flex items-center gap-3"><GvIcon /><div><div className="text-xs text-slate-500 dark:text-slate-400">Selected</div><div key={gv.selected.id} className="animate-fade-up font-mono font-bold text-slate-900 [animation-duration:300ms] dark:text-white">{gv.selected.number}</div></div></div>
              <BuyButton gv={gv} className="mt-5 w-full" />
              <Guarantees className="mt-5 flex-col" />
            </div>
            <div className="rounded-3xl bg-amber-50 p-5 ring-1 ring-amber-200 dark:bg-amber-500/10 dark:ring-amber-400/25">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white"><Sparkles className="h-4 w-4 text-amber-500" />Easy to remember</div>
              <div className="mt-3 flex flex-wrap gap-2">
                {easy.map((n) => <button key={n.id} onClick={() => gv.setSelected(n)} className={`rounded-lg px-2.5 py-1.5 font-mono text-xs font-semibold transition ${gv.selected.id === n.id ? "bg-amber-500 text-white" : "bg-white text-slate-700 ring-1 ring-amber-200 hover:ring-amber-400 dark:bg-white/5 dark:text-slate-200 dark:ring-amber-400/25"}`}>{n.number}</button>)}
              </div>
            </div>
          </aside>
        </div>

        <section className="mt-20 grid gap-10 lg:grid-cols-2">
          <div><SectionTitle kicker="Included" title="Everything you get" /><div className="mt-8 rounded-3xl bg-white p-6 ring-1 ring-slate-200 dark:bg-[#0E1424] dark:ring-white/10"><Included /></div></div>
          <div><SectionTitle kicker="FAQ" title="Before you buy" /><div className="mt-8"><Faq /></div></div>
        </section>
        <section className="mt-20"><SectionTitle kicker="How it works" title="Ready in under a minute" /><div className="mt-8"><Steps /></div></section>
      </div>
      <GvCheckout gv={gv} />
    </PageShell>
  );
}
