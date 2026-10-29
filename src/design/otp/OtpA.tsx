"use client";
import { useMemo, useState } from "react";
import { Search, ArrowUpDown } from "lucide-react";
import { offersFor, otpApps, type OtpCountry } from "@/content/otp-en";
import { useMoney } from "@/lib/money";
import { useOtpOrders } from "./order";
import { AppTile, Assurances, CC, EmptyOrders, OrderCard, PageShell, PageTitle, SuccessBar, WalletChip } from "./parts";

type Sort = "price" | "success" | "stock";
const regions: ("All" | OtpCountry["region"])[] = ["All", "Europe", "Americas", "Asia", "Middle East", "Africa"];

// Page A — "Picker + Sidebar": pick the app from a tile grid, then a country from a sortable table; your live
// numbers stay in a sticky sidebar on the right. Closest to today's page, cleaned up.
export default function OtpA() {
  const usd = useMoney().format;
  const [appId, setAppId] = useState("whatsapp");
  const [q, setQ] = useState("");
  const [sort, setSort] = useState<Sort>("price");
  const [region, setRegion] = useState<(typeof regions)[number]>("All");
  const { orders, buy, cancel } = useOtpOrders();

  const apps = otpApps.filter((a) => a.name.toLowerCase().includes(q.trim().toLowerCase()));
  const app = otpApps.find((a) => a.id === appId)!;
  const offers = useMemo(() => offersFor(appId)
    .filter((o) => region === "All" || o.country.region === region)
    .sort((a, b) => (sort === "price" ? a.price - b.price : sort === "success" ? b.success - a.success : b.stock - a.stock)), [appId, sort, region]);

  const sortBtn = (s: Sort, label: string) => (
    <button onClick={() => setSort(s)} className={`flex items-center gap-1 ${sort === s ? "text-indigo-600 dark:text-indigo-300" : "hover:text-slate-900 dark:hover:text-white"}`}>
      {label}{sort === s && <ArrowUpDown className="h-3 w-3" />}
    </button>
  );

  return (
    <PageShell>
      <div className="mx-auto max-w-7xl px-6 py-14">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <PageTitle title="Buy a virtual number for SMS verification" sub="Pick the app, pick a country, get your code in seconds." />
          <WalletChip />
        </div>

        <div className="mt-10 grid grid-cols-[minmax(0,1fr)] gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="space-y-6">
            <div className="rounded-3xl bg-white p-5 ring-1 ring-slate-200 dark:bg-[#0E1424] dark:ring-white/10">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="font-display text-lg font-semibold text-slate-900 dark:text-white">1. Choose the app</h2>
                <label className="relative w-full sm:w-64">
                  <Search className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search apps…" aria-label="Search apps" className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 ps-9 pe-3 text-sm outline-none focus:border-indigo-400 focus:bg-white dark:border-white/10 dark:bg-white/5 dark:text-white" />
                </label>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4 xl:grid-cols-8">
                {apps.map((a) => {
                  const on = a.id === appId;
                  return (
                    <button key={a.id} onClick={() => setAppId(a.id)} aria-pressed={on}
                      className={`flex flex-col items-center gap-2 rounded-2xl p-3 text-center text-xs font-medium transition duration-300 ${on ? "bg-indigo-50 text-indigo-700 ring-2 ring-indigo-500 dark:bg-indigo-500/15 dark:text-indigo-200" : "text-slate-600 ring-1 ring-slate-200 hover:-translate-y-0.5 hover:ring-slate-300 dark:text-slate-300 dark:ring-white/10 dark:hover:ring-white/25"}`}>
                      <AppTile app={a} />{a.name}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="rounded-3xl bg-white ring-1 ring-slate-200 dark:bg-[#0E1424] dark:ring-white/10">
              <div className="flex flex-wrap items-center justify-between gap-3 p-5 pb-3">
                <h2 className="flex items-center gap-2 font-display text-lg font-semibold text-slate-900 dark:text-white">2. Choose a country for <AppTile app={app} size="sm" />{app.name}</h2>
                <div className="flex gap-1 overflow-x-auto [scrollbar-width:none]">
                  {regions.map((r) => (
                    <button key={r} onClick={() => setRegion(r)} className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition ${region === r ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900" : "text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-white/10"}`}>{r}</button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-[1fr_auto] gap-4 border-y border-slate-100 bg-slate-50 px-5 py-2.5 text-xs font-semibold uppercase tracking-wide text-slate-500 sm:grid-cols-[1fr_110px_90px_90px_auto] dark:border-white/10 dark:bg-white/[.03] dark:text-slate-400">
                <span>Country</span>
                <span className="hidden sm:block">{sortBtn("success", "Success")}</span>
                <span className="hidden sm:block">{sortBtn("stock", "In stock")}</span>
                <span className="hidden sm:block">{sortBtn("price", "Price")}</span>
                <span className="sm:w-20" />
              </div>
              <ul key={appId + region + sort} className="max-h-[520px] animate-fade-up divide-y divide-slate-100 overflow-y-auto [animation-duration:300ms] dark:divide-white/5">
                {offers.map((o) => (
                  <li key={o.country.cc} className="grid grid-cols-[1fr_auto] items-center gap-4 px-5 py-3 transition hover:bg-indigo-50/40 sm:grid-cols-[1fr_110px_90px_90px_auto] dark:hover:bg-white/[.03]">
                    <span className="flex min-w-0 items-center gap-3"><CC cc={o.country.cc} flag={o.country.flag} /><span className="truncate text-sm font-medium text-slate-900 dark:text-white">{o.country.name}</span></span>
                    <span className="hidden sm:block"><SuccessBar pct={o.success} /></span>
                    <span className="hidden text-xs text-slate-500 sm:block dark:text-slate-400">{o.stock.toLocaleString("en-US")}</span>
                    <span className="hidden font-display font-bold text-slate-900 sm:block dark:text-white">{usd(o.price)}</span>
                    <button onClick={() => buy(o)} className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-600 dark:bg-white dark:text-slate-900 dark:hover:bg-indigo-400 dark:hover:text-white">
                      <span className="sm:hidden">{usd(o.price)} · </span>Buy
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <aside className="space-y-3 lg:sticky lg:top-24 lg:self-start">
            <h2 className="font-display text-lg font-semibold text-slate-900 dark:text-white">Your numbers</h2>
            {orders.length === 0 ? <EmptyOrders /> : orders.map((o) => <OrderCard key={o.id} order={o} onCancel={() => cancel(o.id)} />)}
          </aside>
        </div>

        <div className="mt-10"><Assurances /></div>
      </div>
    </PageShell>
  );
}
