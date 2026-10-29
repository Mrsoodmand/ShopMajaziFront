"use client";

import { useState } from "react";
import { Search, ChevronRight, Check } from "lucide-react";
import type { OtpOffer } from "@/content/otp-en";
import { useMoney } from "@/lib/money";
import { AppTile, CC, SuccessBar } from "./parts";
import { useT } from "@/i18n/client";

function SearchBox({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder: string }) {
  return (
    <label className="relative block">
      <Search className="pointer-events-none absolute start-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
      <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} aria-label={placeholder}
        className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 ps-10 pe-3 text-sm outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100 dark:border-white/10 dark:bg-white/5 dark:text-white dark:focus:ring-indigo-500/20" />
    </label>
  );
}

// Price order for a list. "suggested" keeps the order the list came in (apps: the admin's sort).
type PriceSort = "suggested" | "low" | "high";

const sortByPrice = (list: OtpOffer[], sort: PriceSort) =>
  sort === "suggested" ? list : list.slice().sort((a, b) => (sort === "low" ? a.price - b.price : b.price - a.price));

const focusRing = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2 dark:focus-visible:ring-emerald-400 dark:focus-visible:ring-offset-[#0E1424]";

function PriceSortBar({ value, onChange, modes }: { value: PriceSort; onChange: (s: PriceSort) => void; modes: PriceSort[] }) {
  const tx = useT();
  const label: Record<PriceSort, string> = { suggested: tx("Suggested"), low: tx("Lowest price"), high: tx("Highest price") };
  return (
    <div role="group" aria-label={tx("Sort by price")} className="flex items-center gap-1.5 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {modes.map((m) => {
        const on = m === value;
        return (
          <button key={m} type="button" onClick={() => onChange(m)} aria-pressed={on}
            className={`flex h-8 shrink-0 items-center gap-1 rounded-full px-3 text-xs font-semibold transition-colors duration-150 ${focusRing} ${on
              ? "bg-indigo-600 text-white dark:bg-indigo-500"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white"}`}>
            {on && <Check className="h-3.5 w-3.5" aria-hidden />}{label[m]}
          </button>
        );
      })}
    </div>
  );
}

// Long lists scroll without a visible scrollbar; the bottom edge fades so it is clear there is more below.
const scrollList = "space-y-1 overflow-y-auto overscroll-contain p-1 pb-8 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden [mask-image:linear-gradient(to_bottom,black_calc(100%-2.5rem),transparent)]";

// The chosen row: solid indigo, white text and a check mark, so the choice reads at a glance.
const rowOn = "bg-indigo-600 text-white shadow-[0_6px_16px_-8px_rgba(79,70,229,.7)] dark:bg-indigo-500";
const rowOff = "text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/5";

function Picked() {
  return <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-white text-indigo-600"><Check className="h-3.5 w-3.5" strokeWidth={3} aria-hidden /></span>;
}

// App choices. `options` come from the flow: per-country prices once a country is picked, else "from" prices.
// `sortable` adds the price-order buttons (the page shows them on step two).
export function AppChoices({ options, value, onPick, layout = "grid", priced = "from", loading = false, sortable = false }: { options: OtpOffer[]; value: string | null; onPick: (id: string) => void; layout?: "grid" | "list"; priced?: "from" | "exact"; loading?: boolean; sortable?: boolean }) {
  const tx = useT();
  const usd = useMoney().format;
  const [q, setQ] = useState("");
  const [sort, setSort] = useState<PriceSort>("suggested");
  const list = sortByPrice(options.filter((o) => `${o.app.name} ${o.app.alt ?? ""}`.toLowerCase().includes(q.trim().toLowerCase())), sortable ? sort : "suggested");
  return (
    <div className="space-y-3">
      <SearchBox value={q} onChange={setQ} placeholder={tx("Search apps")} />
      {sortable && !loading && <PriceSortBar value={sort} onChange={setSort} modes={["suggested", "low", "high"]} />}
      {loading ? <LoadingRows /> : layout === "grid" ? (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {list.map((o) => {
            const on = o.app.id === value;
            return (
              <button key={o.app.id} onClick={() => onPick(o.app.id)} aria-pressed={on}
                className={`flex flex-col items-center gap-2 rounded-2xl p-3 text-center transition duration-200 ${on ? "bg-indigo-50 ring-2 ring-indigo-500 dark:bg-indigo-500/15" : "ring-1 ring-slate-200 hover:-translate-y-0.5 hover:ring-slate-300 dark:ring-white/10 dark:hover:ring-white/25"}`}>
                <AppTile app={o.app} />
                <span className="text-xs font-semibold text-slate-900 dark:text-white">{o.app.name}</span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">{priced === "from" ? tx("from ") : ""}{usd(o.price)}</span>
              </button>
            );
          })}
        </div>
      ) : (
        <ul className={`-m-1 max-h-[420px] ${scrollList}`}>
          {list.map((o) => {
            const on = o.app.id === value;
            return (
              <li key={o.app.id}>
                <button onClick={() => onPick(o.app.id)} aria-pressed={on} className={`flex w-full items-center gap-3 rounded-xl px-2.5 py-2 text-start text-sm transition-colors duration-150 ${focusRing} ${on ? `${rowOn} font-semibold` : rowOff}`}>
                  <AppTile app={o.app} size="sm" /><span className="min-w-0 flex-1 truncate">{o.app.name}</span>
                  <span className={`shrink-0 whitespace-nowrap text-xs tabular-nums ${on ? "text-white" : "text-slate-500 dark:text-slate-400"}`}>{usd(o.price)}</span>
                  {on ? <Picked /> : <ChevronRight className="h-4 w-4 text-slate-300 rtl:rotate-180 dark:text-slate-600" />}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

// Country choices, cheapest first, with success rate. `sortable` adds the price-order buttons (step two).
export function CountryChoices({ options, value, onPick, priced = "exact", compact = false, loading = false, sortable = false }: { options: OtpOffer[]; value: string | null; onPick: (cc: string) => void; priced?: "from" | "exact"; compact?: boolean; loading?: boolean; sortable?: boolean }) {
  const tx = useT();
  const usd = useMoney().format;
  const [q, setQ] = useState("");
  const [sort, setSort] = useState<PriceSort>("low");
  const t = q.trim().toLowerCase();
  const list = sortByPrice(options.filter((o) => `${o.country.name} ${o.country.alt ?? ""} ${o.country.cc}`.toLowerCase().includes(t)), sortable ? sort : "suggested");
  const min = options.reduce((m, o) => Math.min(m, o.price), Infinity);
  return (
    <div className="space-y-3">
      <SearchBox value={q} onChange={setQ} placeholder={tx("Search countries")} />
      {sortable && !loading && <PriceSortBar value={sort} onChange={setSort} modes={["low", "high"]} />}
      {loading ? <LoadingRows /> : <ul className={`-m-1 ${compact ? "max-h-[420px]" : "max-h-[460px]"} ${scrollList}`}>
        {list.map((o) => {
          const on = o.country.cc === value;
          const cheapest = o.price === min && !t;
          return (
            <li key={o.country.cc}>
              <button onClick={() => onPick(o.country.cc)} aria-pressed={on} className={`flex w-full items-center gap-3 rounded-xl px-2.5 py-2.5 text-start transition-colors duration-150 ${focusRing} ${on ? rowOn : rowOff}`}>
                <CC cc={o.country.cc} flag={o.country.flag} />
                <span className="min-w-0 flex-1">
                  {/* The badge wraps under the name when the column is narrow, so the name is never cut short. */}
                  <span className={`flex min-w-0 flex-wrap items-center gap-x-2 gap-y-0.5 text-sm font-medium ${on ? "text-white" : "text-slate-900 dark:text-white"}`}>
                    <span className="max-w-full truncate">{o.country.name}</span>
                    {cheapest && <span className={`shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${on ? "bg-white/20 text-white" : "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300"}`}>{tx("Cheapest")}</span>}
                  </span>
                  {!compact && <SuccessBar pct={o.success} />}
                </span>
                <span className={`shrink-0 whitespace-nowrap text-sm font-bold tabular-nums ${on ? "text-white" : "text-slate-900 dark:text-white"}`}>
                  {priced === "from" ? <span className={`me-1 text-[11px] font-normal ${on ? "text-indigo-100" : "text-slate-400"}`}>{tx("from")}</span> : null}{usd(o.price)}
                </span>
                {on && <Picked />}
              </button>
            </li>
          );
        })}
      </ul>}
    </div>
  );
}

// Placeholder rows while live prices load.
export function LoadingRows({ rows = 6 }: { rows?: number }) {
  const tx = useT();
  return (
    <ul aria-busy="true" aria-label={tx("Loading")} className="space-y-1">
      {Array.from({ length: rows }, (_, i) => (
        <li key={i} className="flex items-center gap-3 px-2.5 py-2.5">
          <span className="h-6 w-8 animate-pulse rounded-md bg-slate-200 dark:bg-white/10" />
          <span className="h-3 flex-1 animate-pulse rounded bg-slate-200 dark:bg-white/10" style={{ maxWidth: `${55 + ((i * 17) % 35)}%` }} />
          <span className="h-3 w-14 animate-pulse rounded bg-slate-200 dark:bg-white/10" />
        </li>
      ))}
    </ul>
  );
}
