"use client";
import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { GV_PRICE, gvNumbers, gvStates } from "@/content/gv-en";
import { useMoney } from "@/lib/money";
import { useGvOrder } from "./order";
import { GvCheckout, GvDelivery, NumberChip, PageShell, PageTitle, WalletChip } from "./parts";

// Tile-map positions (column, row) for the 50 states + DC.
const tiles: Record<string, [number, number]> = {
  AK: [0, 0], ME: [10, 0], VT: [9, 1], NH: [10, 1],
  WA: [0, 2], ID: [1, 2], MT: [2, 2], ND: [3, 2], MN: [4, 2], IL: [5, 2], WI: [6, 2], MI: [7, 2], NY: [8, 2], RI: [9, 2], MA: [10, 2],
  OR: [0, 3], NV: [1, 3], WY: [2, 3], SD: [3, 3], IA: [4, 3], IN: [5, 3], OH: [6, 3], PA: [7, 3], NJ: [8, 3], CT: [9, 3],
  CA: [0, 4], UT: [1, 4], CO: [2, 4], NE: [3, 4], MO: [4, 4], KY: [5, 4], WV: [6, 4], VA: [7, 4], MD: [8, 4], DE: [9, 4],
  AZ: [1, 5], NM: [2, 5], KS: [3, 5], AR: [4, 5], TN: [5, 5], NC: [6, 5], SC: [7, 5], DC: [8, 5],
  OK: [3, 6], LA: [4, 6], MS: [5, 6], AL: [6, 6], GA: [7, 6], HI: [0, 7], TX: [3, 7], FL: [8, 7],
};

// Page B — "State Map": a tile map of the US where states with numbers in stock light up. Tap a state to see its
// numbers beside the map; pick one and buy.
export default function GvB() {
  const usd = useMoney().format;
  const [state, setState] = useState("NY");
  const [sel, setSel] = useState<string | null>(null);
  const [pay, setPay] = useState(false);
  const { order, buy, reset } = useGvOrder();
  const counts = Object.fromEntries(gvStates.map((s) => [s.state, s.count]));
  const list = gvNumbers.filter((n) => n.area.state === state);
  const n = gvNumbers.find((x) => x.id === sel) ?? null;
  const stateName = gvStates.find((s) => s.state === state)?.name ?? state;

  return (
    <PageShell>
      <div className="mx-auto max-w-7xl px-6 py-14">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <PageTitle kicker="Google Voice" title="Pick a state, then your number" sub="Permanent US numbers with the area code you want. Highlighted states have numbers in stock." />
          <WalletChip />
        </div>

        {order ? <div className="mt-10"><GvDelivery order={order} onAnother={() => { reset(); setSel(null); }} /></div> : (
          <div className="mt-10 grid grid-cols-[minmax(0,1fr)] gap-6 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
            <div className="rounded-[2rem] bg-white p-5 ring-1 ring-slate-200 sm:p-8 dark:bg-[#0E1424] dark:ring-white/10">
              <div className="grid grid-cols-11 gap-1 sm:gap-1.5" role="group" aria-label="United States map">
                {Array.from({ length: 8 }).flatMap((_, row) => Array.from({ length: 11 }).map((__, col) => {
                  const st = Object.keys(tiles).find((k) => tiles[k][0] === col && tiles[k][1] === row);
                  if (!st) return <span key={`${row}-${col}`} aria-hidden className="aspect-square" />;
                  const c = counts[st] ?? 0;
                  const on = st === state;
                  return (
                    <button key={st} disabled={!c} onClick={() => { setState(st); setSel(null); }} aria-pressed={on} title={c ? `${st}: ${c} numbers` : `${st}: none in stock`}
                      className={`relative grid aspect-square place-items-center rounded-md text-[9px] font-bold transition duration-200 sm:rounded-lg sm:text-xs ${on ? "z-10 scale-110 bg-indigo-600 text-white shadow-lg shadow-indigo-500/40" : c ? "bg-sky-100 text-sky-800 hover:scale-105 hover:bg-sky-200 dark:bg-sky-500/20 dark:text-sky-200" : "bg-slate-100 text-slate-300 dark:bg-white/5 dark:text-slate-600"}`}>
                      {st}
                      {c > 0 && !on && <span className="absolute -end-1 -top-1 grid h-3.5 min-w-3.5 place-items-center rounded-full bg-indigo-600 px-0.5 text-[8px] text-white sm:h-4 sm:min-w-4 sm:text-[9px]">{c}</span>}
                    </button>
                  );
                }))}
              </div>
              <div className="mt-5 flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded bg-sky-100 dark:bg-sky-500/20" />In stock</span>
                <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded bg-slate-100 dark:bg-white/5" />Not available</span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-3xl bg-white p-5 ring-1 ring-slate-200 dark:bg-[#0E1424] dark:ring-white/10">
                <h2 className="font-display text-lg font-semibold text-slate-900 dark:text-white">{stateName} <span className="text-sm font-normal text-slate-500 dark:text-slate-400">· {list.length} numbers</span></h2>
                <div key={state} className="mt-4 grid animate-fade-up gap-2 [animation-duration:300ms]">
                  {list.map((x) => <NumberChip key={x.id} n={x} on={x.id === sel} onPick={() => setSel(x.id)} />)}
                </div>
              </div>
              <div className="flex items-center justify-between gap-4 rounded-3xl bg-slate-900 p-5 text-white dark:bg-white/[.06]">
                <span><span className="block text-xs text-white/60">{n ? n.number : "Choose a number"}</span><span className="font-display text-2xl font-bold">{usd(GV_PRICE)}</span></span>
                <button onClick={() => setPay(true)} disabled={!n} className="flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-indigo-100 disabled:opacity-40">Buy<ArrowRight className="h-4 w-4 rtl:rotate-180" /></button>
              </div>
            </div>
          </div>
        )}
      </div>
      <GvCheckout open={pay && !!n} onClose={() => setPay(false)} number={n} onPay={(m) => n && buy(n, m, GV_PRICE)} />
    </PageShell>
  );
}
