"use client";
import { useEffect, useMemo, useState } from "react";
import { X, Globe2 } from "lucide-react";
import { offersFor, otpApps, otpCountries, type OtpCountry, type OtpOffer } from "@/content/otp-en";
import { useMoney } from "@/lib/money";
import SlidingTabs from "@/components/ui/SlidingTabs";
import { useOtpOrders } from "./order";
import { AppTile, Assurances, CC, OrderCard, PageShell, PageTitle, SuccessBar, WalletChip } from "./parts";

type Region = "All" | NonNullable<OtpCountry["region"]>;
const regions: Region[] = ["All", "Europe", "Americas", "Asia", "Middle East", "Africa"];
const cols = otpApps.filter((a) => a.popular);

// Page E — "Price Matrix": every country × the six most-used apps in one table, shaded from cheap (green) to
// pricey. Click any price to open a side panel and buy. Great for comparing at a glance, and very SEO friendly.
export default function OtpE() {
  const usd = useMoney().format;
  const [region, setRegion] = useState<Region>("All");
  const [pick, setPick] = useState<OtpOffer | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);
  const { orders, buy, cancel } = useOtpOrders();

  const table = useMemo(() => {
    const byApp = Object.fromEntries(cols.map((a) => [a.id, offersFor(a.id)]));
    return otpCountries
      .filter((c) => region === "All" || c.region === region)
      .map((c) => ({ c, cells: cols.map((a) => byApp[a.id].find((o) => o.country.cc === c.cc)!) }));
  }, [region]);
  const prices = table.flatMap((r) => r.cells.map((o) => o.price));
  const [lo, hi] = [Math.min(...prices), Math.max(...prices)];
  const shade = (p: number) => {
    const t = (p - lo) / (hi - lo || 1);
    return t < 0.25 ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-200" : t < 0.5 ? "bg-lime-100 text-lime-800 dark:bg-lime-500/15 dark:text-lime-200" : t < 0.75 ? "bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-200" : "bg-rose-100 text-rose-800 dark:bg-rose-500/15 dark:text-rose-200";
  };
  const order = orders.find((o) => o.id === orderId);
  const close = () => { setPick(null); setOrderId(null); };
  useEffect(() => {
    const k = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, []);

  return (
    <PageShell>
      <div className="mx-auto max-w-7xl px-6 py-14">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <PageTitle title="Virtual number prices by country" sub="Compare every country for the most popular apps. Click a price to buy." />
          <WalletChip />
        </div>
        <SlidingTabs className="mt-8 max-w-3xl" value={region} onChange={setRegion} tabs={regions.map((r) => ({ id: r, label: r, icon: r === "All" ? Globe2 : undefined }))} />

        <div className="mt-6 overflow-x-auto rounded-3xl bg-white ring-1 ring-slate-200 dark:bg-[#0E1424] dark:ring-white/10">
          <table className="w-full min-w-[760px] text-sm">
            <thead>
              <tr className="border-b border-slate-100 dark:border-white/10">
                <th className="sticky start-0 bg-white px-5 py-4 text-start text-xs font-semibold uppercase tracking-wide text-slate-500 dark:bg-[#0E1424] dark:text-slate-400">Country</th>
                {cols.map((a) => <th key={a.id} className="px-2 py-4"><span className="flex flex-col items-center gap-1.5 text-xs font-medium text-slate-600 dark:text-slate-300"><AppTile app={a} size="sm" />{a.name.split(" ")[0]}</span></th>)}
              </tr>
            </thead>
            <tbody key={region} className="animate-fade-up [animation-duration:300ms]">
              {table.map(({ c, cells }) => (
                <tr key={c.cc} className="border-b border-slate-50 last:border-0 dark:border-white/5">
                  <th scope="row" className="sticky start-0 bg-white px-5 py-2.5 text-start font-medium text-slate-900 dark:bg-[#0E1424] dark:text-white"><span className="flex items-center gap-2.5"><CC cc={c.cc} flag={c.flag} />{c.name}</span></th>
                  {cells.map((o) => (
                    <td key={o.app.id} className="px-2 py-2 text-center">
                      <button onClick={() => { setPick(o); setOrderId(null); }} aria-label={`Buy ${o.app.name} number in ${c.name} for ${usd(o.price)}`}
                        className={`w-full rounded-lg px-2 py-2 font-mono text-[13px] font-semibold transition duration-200 hover:scale-105 hover:shadow-md ${shade(o.price)}`}>{usd(o.price)}</button>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
          <span>Cheaper</span>{["bg-emerald-200", "bg-lime-200", "bg-amber-200", "bg-rose-200"].map((c) => <span key={c} className={`h-3 w-8 rounded ${c} dark:opacity-60`} />)}<span>Pricier</span>
        </div>
        <div className="mt-10"><Assurances /></div>
      </div>

      {/* Side panel for the picked price. */}
      <div className={`fixed inset-0 z-[60] ${pick ? "" : "pointer-events-none"}`} aria-hidden={!pick}>
        <div onClick={close} className={`absolute inset-0 bg-slate-950/40 backdrop-blur-sm transition-opacity duration-300 ${pick ? "opacity-100" : "opacity-0"}`} />
        <aside role="dialog" aria-label="Buy number" className={`absolute inset-y-0 end-0 w-full max-w-md overflow-y-auto bg-white p-6 shadow-2xl transition-transform duration-300 ease-out dark:bg-[#0B1020] ${pick ? "translate-x-0" : "translate-x-full rtl:-translate-x-full"}`}>
          {pick && (
            <>
              <div className="flex items-center justify-between">
                <h2 className="font-display text-xl font-semibold text-slate-900 dark:text-white">Your number</h2>
                <button onClick={close} aria-label="Close" className="grid h-9 w-9 place-items-center rounded-full bg-slate-100 dark:bg-white/10"><X className="h-5 w-5" /></button>
              </div>
              {!order ? (
                <div className="mt-6 space-y-5">
                  <div className="flex items-center gap-4 rounded-2xl bg-slate-50 p-4 dark:bg-white/5">
                    <AppTile app={pick.app} size="lg" />
                    <div className="min-w-0"><div className="font-semibold text-slate-900 dark:text-white">{pick.app.name}</div><div className="mt-1 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400"><CC cc={pick.country.cc} flag={pick.country.flag} />{pick.country.name}</div></div>
                  </div>
                  <dl className="grid grid-cols-2 gap-3 text-sm">
                    <div className="rounded-2xl p-4 ring-1 ring-slate-200 dark:ring-white/10"><dt className="text-xs text-slate-500 dark:text-slate-400">Success rate</dt><dd className="mt-2"><SuccessBar pct={pick.success} /></dd></div>
                    <div className="rounded-2xl p-4 ring-1 ring-slate-200 dark:ring-white/10"><dt className="text-xs text-slate-500 dark:text-slate-400">In stock</dt><dd className="mt-1 font-semibold text-slate-900 dark:text-white">{(pick.stock ?? 0).toLocaleString("en-US")}</dd></div>
                  </dl>
                  <button onClick={() => setOrderId(buy(pick).id)} className="w-full rounded-2xl bg-indigo-600 py-4 text-base font-semibold text-white transition hover:bg-indigo-700">Pay {usd(pick.price)} from wallet</button>
                  <p className="text-center text-xs text-slate-500 dark:text-slate-400">No code within 20 minutes? Full refund, automatically.</p>
                </div>
              ) : (
                <div className="mt-6"><OrderCard order={order} onCancel={() => cancel(order.id)} /></div>
              )}
            </>
          )}
        </aside>
      </div>
    </PageShell>
  );
}
