"use client";
import { useMemo, useState } from "react";
import { Search, Sparkles, Heart, ArrowRight } from "lucide-react";
import { GV_PRICE, gvNumbers } from "@/content/gv-en";
import { useMoney } from "@/lib/money";
import { useGvOrder } from "./order";
import { EasyTag, GvCheckout, GvDelivery, NumberText, PageShell, PageTitle, WalletChip } from "./parts";

const quick = ["212", "415", "305", "777", "1234", "Texas"];

// Page E — "Number Search": find a number by what's in it: an area code, a city or state, or digits you like
// ("777", "2020"). Matches are highlighted; "Easy to remember" and saved favorites help narrow it down.
export default function GvE() {
  const usd = useMoney().format;
  const [q, setQ] = useState("");
  const [easy, setEasy] = useState(false);
  const [favs, setFavs] = useState<string[]>([]);
  const [onlyFavs, setOnlyFavs] = useState(false);
  const [sel, setSel] = useState<string | null>(null);
  const [pay, setPay] = useState(false);
  const { order, buy, reset } = useGvOrder();
  const n = gvNumbers.find((x) => x.id === sel) ?? null;

  const results = useMemo(() => {
    const t = q.trim().toLowerCase();
    const digits = t.replace(/\D/g, "");
    return gvNumbers.filter((x) => {
      if (easy && !x.easy) return false;
      if (onlyFavs && !favs.includes(x.id)) return false;
      if (!t) return true;
      return (digits && x.number.replace(/\D/g, "").slice(1).includes(digits)) || `${x.area.city} ${x.area.state} ${x.area.stateName}`.toLowerCase().includes(t);
    });
  }, [q, easy, onlyFavs, favs]);
  const fav = (id: string) => setFavs((f) => (f.includes(id) ? f.filter((x) => x !== id) : [...f, id]));

  return (
    <PageShell>
      <div className="mx-auto max-w-5xl px-6 py-14">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <PageTitle kicker="Google Voice" title="Find a number you'll remember" sub="Search by area code, city, state or any digits. Every number is a permanent US Google Voice line." />
          <WalletChip />
        </div>

        {order ? <div className="mt-10"><GvDelivery order={order} onAnother={() => { reset(); setSel(null); }} /></div> : (
          <>
            <label className="relative mt-10 block">
              <Search className="pointer-events-none absolute start-5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Try 212, Miami or 7777" aria-label="Search numbers"
                className="h-16 w-full rounded-2xl border border-slate-200 bg-white ps-14 pe-5 font-mono text-lg shadow-xl shadow-indigo-100/60 outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 dark:border-white/10 dark:bg-white/5 dark:text-white dark:shadow-black/30 dark:focus:ring-indigo-500/20" />
            </label>
            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
              {quick.map((x) => <button key={x} onClick={() => setQ(x)} className="rounded-full bg-white px-3 py-1.5 font-medium text-slate-600 ring-1 ring-slate-200 hover:ring-indigo-300 dark:bg-white/5 dark:text-slate-300 dark:ring-white/10">{x}</button>)}
              <span className="mx-1 h-4 w-px bg-slate-200 dark:bg-white/10" />
              <button onClick={() => setEasy((v) => !v)} aria-pressed={easy} className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 font-medium ring-1 transition ${easy ? "bg-fuchsia-600 text-white ring-fuchsia-600" : "bg-white text-slate-600 ring-slate-200 dark:bg-white/5 dark:text-slate-300 dark:ring-white/10"}`}><Sparkles className="h-3.5 w-3.5" />Easy to remember</button>
              <button onClick={() => setOnlyFavs((v) => !v)} aria-pressed={onlyFavs} className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 font-medium ring-1 transition ${onlyFavs ? "bg-rose-500 text-white ring-rose-500" : "bg-white text-slate-600 ring-slate-200 dark:bg-white/5 dark:text-slate-300 dark:ring-white/10"}`}><Heart className="h-3.5 w-3.5" />Saved {favs.length > 0 && `(${favs.length})`}</button>
            </div>

            <div className="mt-6 overflow-hidden rounded-3xl bg-white ring-1 ring-slate-200 dark:bg-[#0E1424] dark:ring-white/10">
              <div className="border-b border-slate-100 px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:border-white/10 dark:text-slate-400">{results.length} numbers</div>
              {results.length === 0 && <div className="p-10 text-center text-sm text-slate-500 dark:text-slate-400">No numbers match. Try fewer digits or another area code.</div>}
              <ul key={q + easy + onlyFavs} className="animate-fade-up divide-y divide-slate-100 [animation-duration:250ms] dark:divide-white/5">
                {results.map((x) => {
                  const on = x.id === sel;
                  return (
                    <li key={x.id} className={`flex items-center gap-4 px-5 py-3.5 transition ${on ? "bg-indigo-50 dark:bg-indigo-500/10" : "hover:bg-slate-50 dark:hover:bg-white/[.03]"}`}>
                      <button onClick={() => fav(x.id)} aria-pressed={favs.includes(x.id)} aria-label={favs.includes(x.id) ? "Remove from saved" : "Save"}><Heart className={`h-5 w-5 transition ${favs.includes(x.id) ? "fill-rose-500 text-rose-500" : "text-slate-300 hover:text-rose-400 dark:text-slate-600"}`} /></button>
                      <button onClick={() => setSel(x.id)} className="flex min-w-0 flex-1 flex-wrap items-center gap-x-3 gap-y-1 text-start">
                        <NumberText n={x} q={q} className="text-lg font-semibold text-slate-900 dark:text-white" />
                        <span className="text-xs text-slate-500 dark:text-slate-400">{x.area.city}, {x.area.state}</span>
                        {x.easy && <EasyTag />}
                      </button>
                      <button onClick={() => { setSel(x.id); setPay(true); }} className="flex shrink-0 items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-600 dark:bg-white dark:text-slate-900 dark:hover:bg-indigo-400 dark:hover:text-white">{usd(GV_PRICE)}<ArrowRight className="h-4 w-4 rtl:rotate-180" /></button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </>
        )}
      </div>
      <GvCheckout open={pay && !!n} onClose={() => setPay(false)} number={n} onPay={(m) => n && buy(n, m, GV_PRICE)} />
    </PageShell>
  );
}
