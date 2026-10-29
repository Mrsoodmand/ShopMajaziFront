"use client";
import { useEffect, useState } from "react";
import { Search, X, ArrowLeft } from "lucide-react";
import { cheapest, offersFor, otpApps, otpCountries, type OtpApp } from "@/content/otp-en";
import { useMoney } from "@/lib/money";
import { useOtpOrders } from "./order";
import { AppTile, CC, OrderCard, PageShell, PageTitle, SuccessBar, WalletChip } from "./parts";

// Page G — "App Store + Sheet": big, friendly app cards like an app store. Tapping one opens a sheet (bottom sheet on
// phones, dialog on desktop) with that app's countries; buying shows the number right in the sheet. A floating pill
// keeps count of active numbers.
export default function OtpG() {
  const usd = useMoney().format;
  const [q, setQ] = useState("");
  const [sheet, setSheet] = useState<OtpApp | null>(null);
  const [cq, setCq] = useState("");
  const [orderId, setOrderId] = useState<string | null>(null);
  const [tray, setTray] = useState(false);
  const { orders, buy, cancel } = useOtpOrders();
  const apps = otpApps.filter((a) => a.name.toLowerCase().includes(q.trim().toLowerCase()));
  const order = orders.find((o) => o.id === orderId);
  const waiting = orders.filter((o) => o.status === "waiting").length;
  const close = () => { setSheet(null); setOrderId(null); setCq(""); };
  useEffect(() => {
    const k = (e: KeyboardEvent) => { if (e.key === "Escape") { close(); setTray(false); } };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, []);

  return (
    <PageShell>
      <div className="mx-auto max-w-6xl px-6 py-14">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <PageTitle title="Pick the app you need a code for" sub="Every app works with numbers from 150+ countries." />
          <WalletChip />
        </div>
        <label className="relative mt-8 block max-w-md">
          <Search className="pointer-events-none absolute start-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search apps…" aria-label="Search apps" className="h-12 w-full rounded-2xl border border-slate-200 bg-white ps-11 pe-4 text-sm outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 dark:border-white/10 dark:bg-white/5 dark:text-white dark:focus:ring-indigo-500/20" />
        </label>

        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {apps.map((a) => (
            <button key={a.id} onClick={() => setSheet(a)} className="group relative overflow-hidden rounded-3xl bg-white p-5 text-start ring-1 ring-slate-200 transition duration-300 ease-out hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-100 dark:bg-[#0E1424] dark:ring-white/10 dark:hover:shadow-black/40">
              <div aria-hidden className={`absolute -end-8 -top-8 h-24 w-24 rounded-full opacity-15 blur-xl transition duration-500 group-hover:opacity-30 ${a.color}`} />
              <AppTile app={a} size="lg" />
              <div className="mt-4 font-display text-lg font-semibold text-slate-900 dark:text-white">{a.name}</div>
              <div className="mt-1 text-sm text-slate-500 dark:text-slate-400">{otpCountries.length} countries</div>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-xs text-slate-500 dark:text-slate-400">from <span className="font-display text-lg font-bold text-slate-900 dark:text-white">{usd(cheapest(a.id).price)}</span></span>
                {a.popular && <span className="rounded-full bg-orange-100 px-2 py-0.5 text-[10px] font-semibold text-orange-700 dark:bg-orange-500/15 dark:text-orange-300">Popular</span>}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* App sheet */}
      <div className={`fixed inset-0 z-[60] ${sheet ? "" : "pointer-events-none"}`} aria-hidden={!sheet}>
        <div onClick={close} className={`absolute inset-0 bg-slate-950/40 backdrop-blur-sm transition-opacity duration-300 ${sheet ? "opacity-100" : "opacity-0"}`} />
        <div role="dialog" aria-label={sheet ? `${sheet.name} numbers` : undefined}
          className={`absolute inset-x-0 bottom-0 max-h-[85vh] overflow-y-auto rounded-t-[2rem] bg-white p-6 shadow-2xl transition-transform duration-300 ease-out sm:inset-x-auto sm:start-1/2 sm:top-1/2 sm:bottom-auto sm:w-[520px] sm:rounded-[2rem] dark:bg-[#0B1020] ${sheet ? "translate-y-0 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rtl:translate-x-1/2" : "translate-y-full sm:pointer-events-none sm:-translate-x-1/2 sm:-translate-y-[45%] sm:opacity-0 sm:rtl:translate-x-1/2"}`}>
          <span aria-hidden className="mx-auto mb-4 block h-1.5 w-12 rounded-full bg-slate-200 sm:hidden dark:bg-white/15" />
          {sheet && (
            <>
              <div className="flex items-center gap-3">
                {order && <button onClick={() => setOrderId(null)} aria-label="Back to countries" className="grid h-9 w-9 place-items-center rounded-full bg-slate-100 dark:bg-white/10"><ArrowLeft className="h-4 w-4 rtl:rotate-180" /></button>}
                <AppTile app={sheet} />
                <div className="flex-1"><div className="font-display text-lg font-semibold text-slate-900 dark:text-white">{sheet.name}</div><div className="text-xs text-slate-500 dark:text-slate-400">{order ? "Your number" : "Choose a country"}</div></div>
                <button onClick={close} aria-label="Close" className="grid h-9 w-9 place-items-center rounded-full bg-slate-100 dark:bg-white/10"><X className="h-5 w-5" /></button>
              </div>
              {order ? (
                <div className="mt-5"><OrderCard order={order} onCancel={() => cancel(order.id)} /></div>
              ) : (
                <>
                  <label className="relative mt-5 block"><Search className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input value={cq} onChange={(e) => setCq(e.target.value)} placeholder="Search countries" aria-label="Search countries" className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 ps-9 pe-3 text-sm outline-none focus:border-indigo-400 dark:border-white/10 dark:bg-white/5 dark:text-white" /></label>
                  <ul className="mt-3 space-y-1">
                    {offersFor(sheet.id).filter((o) => o.country.name.toLowerCase().includes(cq.trim().toLowerCase())).sort((a, b) => a.price - b.price).map((o) => (
                      <li key={o.country.cc}>
                        <button onClick={() => setOrderId(buy(o).id)} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-start transition hover:bg-indigo-50 dark:hover:bg-white/5">
                          <CC cc={o.country.cc} flag={o.country.flag} /><span className="flex-1 truncate text-sm font-medium text-slate-900 dark:text-white">{o.country.name}</span>
                          <SuccessBar pct={o.success} /><span className="w-16 text-end font-display font-bold text-slate-900 dark:text-white">{usd(o.price)}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </>
          )}
        </div>
      </div>

      {/* Active-numbers pill and tray */}
      {orders.length > 0 && (
        <button onClick={() => setTray(true)} className="fixed bottom-6 end-6 z-50 flex animate-fade-up items-center gap-2 rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-2xl transition hover:bg-indigo-600 dark:bg-white dark:text-slate-900">
          {waiting > 0 && <span className="relative flex h-2.5 w-2.5"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-70" /><span className="relative h-2.5 w-2.5 rounded-full bg-amber-400" /></span>}
          My numbers · {orders.length}
        </button>
      )}
      <div className={`fixed inset-0 z-[60] ${tray ? "" : "pointer-events-none"}`} aria-hidden={!tray}>
        <div onClick={() => setTray(false)} className={`absolute inset-0 bg-slate-950/30 transition-opacity duration-300 ${tray ? "opacity-100" : "opacity-0"}`} />
        <aside className={`absolute inset-y-0 end-0 w-full max-w-sm space-y-3 overflow-y-auto bg-slate-50 p-5 shadow-2xl transition-transform duration-300 dark:bg-[#0B1020] ${tray ? "translate-x-0" : "translate-x-full rtl:-translate-x-full"}`}>
          <div className="flex items-center justify-between"><h2 className="font-display text-lg font-semibold text-slate-900 dark:text-white">My numbers</h2><button onClick={() => setTray(false)} aria-label="Close" className="grid h-9 w-9 place-items-center rounded-full bg-white dark:bg-white/10"><X className="h-5 w-5" /></button></div>
          {orders.map((o) => <OrderCard key={o.id} order={o} onCancel={() => cancel(o.id)} compact />)}
        </aside>
      </div>
    </PageShell>
  );
}
