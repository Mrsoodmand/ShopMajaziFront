"use client";
import { useRef, useState } from "react";
import { Check, X, ArrowDown, ArrowRight } from "lucide-react";
import { GV_PRICE, gvNumbers, gvStates } from "@/content/gv-en";
import { useMoney } from "@/lib/money";
import { useGvOrder } from "./order";
import { GvCheckout, GvDelivery, NumberChip, PageShell, PageTitle, WalletChip } from "./parts";

const rowsFor = (usd: (n: number) => string): { label: string; gv: string | boolean; otp: string | boolean; rent: string | boolean }[] => [
  { label: "How long it's yours", gv: "Permanent", otp: "One code", rent: "7–30 days" },
  { label: "Receive verification codes", gv: true, otp: true, rent: true },
  { label: "Make calls", gv: true, otp: false, rent: false },
  { label: "Send texts", gv: true, otp: false, rent: false },
  { label: "Full account login", gv: true, otp: false, rent: false },
  { label: "Price", gv: usd(GV_PRICE), otp: "from $0.30", rent: "from $4.90" },
];

function Cell({ v, strong }: { v: string | boolean; strong?: boolean }) {
  if (typeof v === "string") return <span className={strong ? "font-semibold text-slate-900 dark:text-white" : "text-slate-500 dark:text-slate-400"}>{v}</span>;
  return v ? <Check className="mx-auto h-5 w-5 text-emerald-500" aria-label="Yes" /> : <X className="mx-auto h-5 w-5 text-slate-300 dark:text-slate-600" aria-label="No" />;
}

// Page D — "Compare, then pick": opens by showing how Google Voice differs from one-time and rented numbers, so
// buyers know it's the right product; then the numbers, grouped by state, with a sticky buy bar.
export default function GvD() {
  const usd = useMoney().format;
  const rows = rowsFor(usd);
  const [sel, setSel] = useState<string | null>(null);
  const [pay, setPay] = useState(false);
  const { order, buy, reset } = useGvOrder();
  const picker = useRef<HTMLDivElement>(null);
  const n = gvNumbers.find((x) => x.id === sel) ?? null;

  return (
    <PageShell>
      <div className="mx-auto max-w-6xl px-6 py-14">
        <PageTitle kicker="Google Voice" title="Need a number you can keep?" sub="Google Voice is the only option here that stays yours, with calls and texts. Compare, then pick your number." />

        {order ? <div className="mt-10"><GvDelivery order={order} onAnother={() => { reset(); setSel(null); }} /></div> : (
          <>
            <div className="mt-10 overflow-x-auto rounded-3xl bg-white ring-1 ring-slate-200 dark:bg-[#0E1424] dark:ring-white/10">
              <table className="w-full min-w-[620px] border-separate border-spacing-0 text-sm">
                <thead><tr>
                  <th className="w-2/5 p-5 text-start text-xs font-semibold uppercase tracking-wide text-slate-400" />
                  <th className="rounded-t-2xl bg-sky-500 p-5 font-display text-base font-semibold text-white">Google Voice</th>
                  <th className="p-5 font-medium text-slate-500 dark:text-slate-400">One-time number</th>
                  <th className="p-5 font-medium text-slate-500 dark:text-slate-400">Rented number</th>
                </tr></thead>
                <tbody>
                  {rows.map((r, i) => (
                    <tr key={r.label}>
                      <td className="border-t border-slate-100 px-5 py-4 font-medium text-slate-700 dark:border-white/10 dark:text-slate-300">{r.label}</td>
                      <td className={`border-t border-sky-500/20 bg-sky-50 px-5 py-4 text-center dark:bg-sky-500/10 ${i === rows.length - 1 ? "rounded-b-2xl" : ""}`}><Cell v={r.gv} strong /></td>
                      <td className="border-t border-slate-100 px-5 py-4 text-center dark:border-white/10"><Cell v={r.otp} /></td>
                      <td className="border-t border-slate-100 px-5 py-4 text-center dark:border-white/10"><Cell v={r.rent} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-6 flex justify-center"><button onClick={() => picker.current?.scrollIntoView({ behavior: "smooth", block: "start" })} className="flex items-center gap-2 rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white hover:bg-indigo-600 dark:bg-white dark:text-slate-900">Pick your number<ArrowDown className="h-4 w-4" /></button></div>

            <div ref={picker} className="mt-16 scroll-mt-24">
              <div className="flex flex-wrap items-center justify-between gap-3"><h2 className="font-display text-2xl font-bold text-slate-900 dark:text-white">Available numbers</h2><WalletChip /></div>
              <div className="mt-6 space-y-8">
                {gvStates.map((s) => (
                  <section key={s.state}>
                    <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">{s.name} · {s.count}</h3>
                    <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                      {gvNumbers.filter((x) => x.area.state === s.state).map((x) => <NumberChip key={x.id} n={x} on={x.id === sel} onPick={() => setSel(x.id)} />)}
                    </div>
                  </section>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {!order && (
        <div className={`fixed inset-x-0 bottom-0 z-40 p-4 transition duration-300 ${n ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-full opacity-0"}`}>
          <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 rounded-2xl bg-slate-900 px-5 py-3.5 text-white shadow-2xl dark:bg-[#111830] dark:ring-1 dark:ring-white/10">
            <span className="min-w-0"><span className="block truncate font-mono font-semibold">{n?.number}</span><span className="block text-xs text-white/60">{n?.area.city}, {n?.area.state} · {usd(GV_PRICE)}</span></span>
            <button onClick={() => setPay(true)} className="flex shrink-0 items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 hover:bg-indigo-100">Buy<ArrowRight className="h-4 w-4 rtl:rotate-180" /></button>
          </div>
        </div>
      )}
      <GvCheckout open={pay && !!n} onClose={() => setPay(false)} number={n} onPay={(m) => n && buy(n, m, GV_PRICE)} />
    </PageShell>
  );
}
