"use client";
import { ChevronRight, Home, ShoppingCart, Search } from "lucide-react";
import { useState } from "react";
import { useMoney } from "@/lib/money";
import { useOtpFlow } from "./flow";
import { FirstSwitch, OrderView, RecentOrders } from "./flowParts";
import { AppTile, Assurances, CC, PageShell, PageTitle, SuccessBar, WalletChip } from "./parts";

// Page N — "Drill-down Tiles": big tiles you drill into, with breadcrumbs on top (Numbers › WhatsApp › Germany › operator).
// Every level is a full grid, so it feels like browsing a store; breadcrumbs jump back to any level.
export default function OtpN() {
  const usd = useMoney().format;
  const f = useOtpFlow("app");
  const [q, setQ] = useState("");
  const t = q.trim().toLowerCase();
  const showApps = (f.step === "first" && f.first === "app") || (f.step === "second" && f.first === "country");
  const showCountries = (f.step === "first" && f.first === "country") || (f.step === "second" && f.first === "app");

  const crumbs = [
    { label: "Numbers", go: () => f.setFirst(f.first) },
    ...(f.first === "app"
      ? [f.app && { label: f.app.name, go: () => { f.clearCountry(); } }, f.country && { label: f.country.name, go: () => f.clearOperator() }]
      : [f.country && { label: f.country.name, go: () => { f.clearApp(); } }, f.app && { label: f.app.name, go: () => f.clearOperator() }]),
  ].filter(Boolean) as { label: string; go: () => void }[];

  return (
    <PageShell>
      <div className="mx-auto max-w-6xl px-6 py-14">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <PageTitle title="Find your number" sub="Browse by app or by country, then choose the operator." />
          <WalletChip />
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
          <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1 text-sm">
            {crumbs.map((c, i) => (
              <span key={c.label + i} className="flex items-center gap-1">
                {i > 0 && <ChevronRight className="h-4 w-4 text-slate-300 rtl:rotate-180 dark:text-slate-600" />}
                <button onClick={() => { c.go(); setQ(""); }} className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 font-medium transition ${i === crumbs.length - 1 ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900" : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/10"}`}>
                  {i === 0 && <Home className="h-3.5 w-3.5" />}{c.label}
                </button>
              </span>
            ))}
          </nav>
          {f.step === "first" && <FirstSwitch value={f.first} onChange={(v) => { f.setFirst(v); setQ(""); }} />}
        </div>

        {(showApps || showCountries) && (
          <label className="relative mt-6 block max-w-md">
            <Search className="pointer-events-none absolute start-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={showApps ? "Search apps" : "Search countries"} aria-label="Search" className="h-12 w-full rounded-2xl border border-slate-200 bg-white ps-11 pe-4 text-sm outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 dark:border-white/10 dark:bg-white/5 dark:text-white dark:focus:ring-indigo-500/20" />
          </label>
        )}

        <div key={f.step + f.first + (f.app?.id ?? "") + (f.country?.cc ?? "")} className="mt-6 animate-fade-up [animation-duration:350ms]">
          {showApps && (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {f.appOptions.filter((o) => o.app.name.toLowerCase().includes(t)).map((o) => (
                <button key={o.app.id} onClick={() => { f.pickApp(o.app.id); setQ(""); }} className="group relative overflow-hidden rounded-3xl bg-white p-5 text-start ring-1 ring-slate-200 transition duration-300 ease-out hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-100 dark:bg-[#0E1424] dark:ring-white/10 dark:hover:shadow-black/40">
                  <div aria-hidden className={`absolute -end-8 -top-8 h-24 w-24 rounded-full opacity-15 blur-xl transition duration-500 group-hover:opacity-30 ${o.app.color}`} />
                  <AppTile app={o.app} size="lg" />
                  <div className="mt-4 font-display text-lg font-semibold text-slate-900 dark:text-white">{o.app.name}</div>
                  <div className="mt-3 text-xs text-slate-500 dark:text-slate-400">{f.country ? "" : "from "}<span className="font-display text-lg font-bold text-slate-900 dark:text-white">{usd(o.price)}</span></div>
                </button>
              ))}
            </div>
          )}
          {showCountries && (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {f.countryOptions.filter((o) => `${o.country.name} ${o.country.cc}`.toLowerCase().includes(t)).map((o) => (
                <button key={o.country.cc} onClick={() => { f.pickCountry(o.country.cc); setQ(""); }} className="group rounded-3xl bg-white p-4 text-start ring-1 ring-slate-200 transition duration-300 hover:-translate-y-1 hover:shadow-lg hover:ring-indigo-300 dark:bg-[#0E1424] dark:ring-white/10 dark:hover:ring-indigo-400/50">
                  <span className="grid h-11 w-14 place-items-center rounded-xl bg-gradient-to-br from-slate-800 to-slate-950 font-mono text-base font-bold text-white">{o.country.cc}</span>
                  <div className="mt-3 truncate font-semibold text-slate-900 dark:text-white">{o.country.name}</div>
                  <div className="mt-1 flex items-center justify-between"><SuccessBar pct={o.success} /><span className="font-display font-bold text-slate-900 dark:text-white">{usd(o.price)}</span></div>
                </button>
              ))}
            </div>
          )}
          {f.step === "operator" && f.app && f.country && (
            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
              <div className="grid gap-3 sm:grid-cols-2">
                {f.operators.map((o) => (
                  <button key={o.id} onClick={() => f.pickOperator(o.id)} aria-pressed={f.operator?.id === o.id}
                    className={`rounded-3xl p-5 text-start transition duration-300 ${f.operator?.id === o.id ? "bg-indigo-600 text-white shadow-xl shadow-indigo-500/30" : "bg-white ring-1 ring-slate-200 hover:-translate-y-0.5 hover:shadow-lg dark:bg-[#0E1424] dark:ring-white/10"}`}>
                    <div className="flex items-center justify-between">
                      <span className={`font-display text-lg font-semibold ${f.operator?.id === o.id ? "" : "text-slate-900 dark:text-white"}`}>{o.name}</span>
                      {o.recommended && <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${f.operator?.id === o.id ? "bg-white/20" : "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300"}`}>Recommended</span>}
                    </div>
                    <div className={`mt-2 text-sm ${f.operator?.id === o.id ? "text-white/80" : "text-slate-500 dark:text-slate-400"}`}>{o.success}% success · {(o.stock ?? 0).toLocaleString("en-US")} left</div>
                    <div className={`mt-4 font-display text-2xl font-bold ${f.operator?.id === o.id ? "" : "text-slate-900 dark:text-white"}`}>{usd(o.price)}</div>
                  </button>
                ))}
              </div>
              <aside className="self-start rounded-3xl bg-white p-6 ring-1 ring-slate-200 lg:sticky lg:top-24 dark:bg-[#0E1424] dark:ring-white/10">
                <div className="flex items-center gap-3"><AppTile app={f.app} /><div><div className="font-semibold text-slate-900 dark:text-white">{f.app.name}</div><div className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400"><CC cc={f.country.cc} flag={f.country.flag} />{f.country.name}</div></div></div>
                <div className="mt-5 flex items-baseline justify-between border-t border-slate-100 pt-4 dark:border-white/10"><span className="text-sm text-slate-500 dark:text-slate-400">{f.operator?.name ?? "No operator yet"}</span><span className="font-display text-3xl font-bold text-slate-900 dark:text-white">{f.operator ? usd(f.operator.price) : "—"}</span></div>
                <button onClick={() => f.purchase()} disabled={!f.operator} className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-indigo-600 py-4 font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-40"><ShoppingCart className="h-5 w-5" />Buy number</button>
              </aside>
            </div>
          )}
          {f.step === "order" && f.order && (
            <div className="grid grid-cols-[minmax(0,1fr)] gap-6 lg:grid-cols-[minmax(0,1fr)_320px]"><OrderView order={f.order} flow={f} /><RecentOrders flow={f} /></div>
          )}
        </div>
        <div className="mt-12"><Assurances /></div>
      </div>
    </PageShell>
  );
}
