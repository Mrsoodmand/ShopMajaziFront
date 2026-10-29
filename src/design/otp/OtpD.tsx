"use client";
import { useMemo, useState } from "react";
import { Search, Star } from "lucide-react";
import { cheapest, offersFor, otpApps } from "@/content/otp-en";
import { useMoney } from "@/lib/money";
import { useOtpOrders } from "./order";
import { AppTile, CC, EmptyOrders, OrderCard, PageShell, SuccessBar, WalletChip } from "./parts";

// Page D — "Power Dashboard": a three-pane workspace for heavy users. Apps down the left, the selected app's
// countries in the middle (filter + favorites), and every active number with its timer on the right.
export default function OtpD() {
  const usd = useMoney().format;
  const [appId, setAppId] = useState("telegram");
  const [qa, setQa] = useState("");
  const [qc, setQc] = useState("");
  const [favs, setFavs] = useState<string[]>(["US", "DE"]);
  const { orders, buy, cancel } = useOtpOrders();

  const apps = otpApps.filter((a) => a.name.toLowerCase().includes(qa.trim().toLowerCase()));
  const offers = useMemo(() => offersFor(appId)
    .filter((o) => `${o.country.name} ${o.country.cc}`.toLowerCase().includes(qc.trim().toLowerCase()))
    .sort((a, b) => Number(favs.includes(b.country.cc)) - Number(favs.includes(a.country.cc)) || a.price - b.price), [appId, qc, favs]);
  const toggleFav = (cc: string) => setFavs((f) => (f.includes(cc) ? f.filter((x) => x !== cc) : [...f, cc]));
  const active = orders.filter((o) => o.status === "waiting").length;
  const field = "h-10 w-full rounded-xl border border-slate-200 bg-slate-50 ps-9 pe-3 text-sm outline-none focus:border-indigo-400 focus:bg-white dark:border-white/10 dark:bg-white/5 dark:text-white";

  return (
    <PageShell>
      <div className="mx-auto max-w-[1400px] px-4 py-10 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="font-display text-2xl font-bold text-slate-900 sm:text-3xl dark:text-white">Virtual numbers</h1>
          <div className="flex items-center gap-2"><span className="rounded-full bg-amber-100 px-3 py-1.5 text-xs font-semibold text-amber-700 dark:bg-amber-500/15 dark:text-amber-300">{active} waiting</span><WalletChip /></div>
        </div>

        <div className="mt-6 grid grid-cols-[minmax(0,1fr)] gap-4 lg:h-[calc(100vh-13rem)] lg:min-h-[560px] lg:grid-cols-[240px_minmax(0,1fr)_340px]">
          <aside className="flex min-h-0 flex-col rounded-3xl bg-white p-3 ring-1 ring-slate-200 dark:bg-[#0E1424] dark:ring-white/10">
            <label className="relative"><Search className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input value={qa} onChange={(e) => setQa(e.target.value)} placeholder="Apps" aria-label="Search apps" className={field} /></label>
            <ul className="mt-2 flex gap-1 overflow-x-auto lg:block lg:flex-1 lg:space-y-1 lg:overflow-y-auto">
              {apps.map((a) => {
                const on = a.id === appId;
                return (
                  <li key={a.id} className="shrink-0">
                    <button onClick={() => setAppId(a.id)} className={`flex w-full items-center gap-3 rounded-xl px-2.5 py-2 text-start text-sm transition ${on ? "bg-indigo-50 font-semibold text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-200" : "text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-white/5"}`}>
                      <AppTile app={a} size="sm" /><span className="flex-1 truncate">{a.name}</span><span className="hidden text-xs text-slate-400 lg:inline">{usd(cheapest(a.id).price)}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </aside>

          <section className="flex min-h-0 flex-col overflow-hidden rounded-3xl bg-white ring-1 ring-slate-200 dark:bg-[#0E1424] dark:ring-white/10">
            <div className="flex items-center gap-3 border-b border-slate-100 p-3 dark:border-white/10">
              <label className="relative flex-1"><Search className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input value={qc} onChange={(e) => setQc(e.target.value)} placeholder="Filter countries" aria-label="Filter countries" className={field} /></label>
              <span className="hidden text-xs text-slate-500 sm:block dark:text-slate-400">{offers.length} countries · ★ favorites first</span>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-slate-50 text-xs uppercase tracking-wide text-slate-500 dark:bg-[#111830] dark:text-slate-400">
                  <tr><th className="w-10 px-3 py-2.5" /><th className="py-2.5 text-start">Country</th><th className="hidden py-2.5 text-start md:table-cell">Success</th><th className="hidden py-2.5 text-end md:table-cell">Stock</th><th className="py-2.5 pe-3 text-end">Price</th><th className="w-24 pe-3" /></tr>
                </thead>
                <tbody key={appId} className="animate-fade-up divide-y divide-slate-100 [animation-duration:250ms] dark:divide-white/5">
                  {offers.map((o) => {
                    const fav = favs.includes(o.country.cc);
                    return (
                      <tr key={o.country.cc} className="transition hover:bg-indigo-50/40 dark:hover:bg-white/[.03]">
                        <td className="px-3"><button onClick={() => toggleFav(o.country.cc)} aria-pressed={fav} aria-label={fav ? "Remove favorite" : "Add favorite"}><Star className={`h-4 w-4 transition ${fav ? "fill-amber-400 text-amber-400" : "text-slate-300 hover:text-amber-400 dark:text-slate-600"}`} /></button></td>
                        <td className="py-2.5"><span className="flex items-center gap-2.5"><CC cc={o.country.cc} flag={o.country.flag} /><span className="truncate font-medium text-slate-900 dark:text-white">{o.country.name}</span></span></td>
                        <td className="hidden py-2.5 md:table-cell"><SuccessBar pct={o.success} /></td>
                        <td className="hidden py-2.5 text-end text-xs text-slate-500 md:table-cell dark:text-slate-400">{o.stock.toLocaleString("en-US")}</td>
                        <td className="py-2.5 pe-3 text-end font-display font-bold text-slate-900 dark:text-white">{usd(o.price)}</td>
                        <td className="pe-3 text-end"><button onClick={() => buy(o)} className="rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-indigo-600 dark:bg-white dark:text-slate-900 dark:hover:bg-indigo-400 dark:hover:text-white">Buy</button></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>

          <aside className="flex min-h-0 flex-col rounded-3xl bg-slate-100/70 p-3 ring-1 ring-slate-200 dark:bg-white/[.03] dark:ring-white/10">
            <div className="px-1 pb-2 text-sm font-semibold text-slate-900 dark:text-white">Active & recent</div>
            <div className="min-h-0 flex-1 space-y-3 overflow-y-auto">
              {orders.length === 0 ? <EmptyOrders /> : orders.map((o) => <OrderCard key={o.id} order={o} onCancel={() => cancel(o.id)} compact />)}
            </div>
          </aside>
        </div>
      </div>
    </PageShell>
  );
}
