"use client";
import { useMemo, useState } from "react";
import { Globe2, ChevronDown } from "lucide-react";
import { offersFor, otpApps, otpCountries, type OtpCountry } from "@/content/otp-en";
import { useMoney } from "@/lib/money";
import SlidingTabs from "@/components/ui/SlidingTabs";
import { useOtpOrders } from "./order";
import { AppTile, Assurances, CC, OrderCard, PageShell, PageTitle, WalletChip } from "./parts";

type Region = "All" | NonNullable<OtpCountry["region"]>;
const regions: Region[] = ["All", "Europe", "Americas", "Asia", "Middle East", "Africa"];

// Page I — "Country First": for people who need a number from a specific country. Country cards come first;
// opening one shows every app with its price for that country, and the number appears right in the card.
export default function OtpI() {
  const usd = useMoney().format;
  const [region, setRegion] = useState<Region>("All");
  const [open, setOpen] = useState<string | null>("DE");
  const { orders, buy, cancel } = useOtpOrders();
  const byCountry = useMemo(() => {
    const all = otpApps.flatMap((a) => offersFor(a.id));
    return Object.fromEntries(otpCountries.map((c) => [c.cc, all.filter((o) => o.country.cc === c.cc).sort((a, b) => a.price - b.price)]));
  }, []);
  const countries = otpCountries.filter((c) => region === "All" || c.region === region);

  return (
    <PageShell>
      <div className="mx-auto max-w-6xl px-6 py-14">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <PageTitle kicker="Virtual numbers by country" title="Where should your number be from?" sub="Pick a country first, then the app. Every country lists all apps with live prices." />
          <WalletChip />
        </div>
        <SlidingTabs className="mt-8 max-w-3xl" value={region} onChange={(r) => { setRegion(r); setOpen(null); }} tabs={regions.map((r) => ({ id: r, label: r, icon: r === "All" ? Globe2 : undefined }))} />

        <div key={region} className="mt-6 grid animate-fade-up items-start gap-4 [animation-duration:300ms] md:grid-cols-2">
          {countries.map((c) => {
            const list = byCountry[c.cc];
            const isOpen = open === c.cc;
            const mine = orders.filter((o) => o.offer.country.cc === c.cc);
            return (
              <div key={c.cc} className={`overflow-hidden rounded-3xl bg-white ring-1 transition duration-300 dark:bg-[#0E1424] ${isOpen ? "shadow-xl shadow-indigo-100 ring-indigo-300 md:col-span-2 dark:shadow-black/30 dark:ring-indigo-400/40" : "ring-slate-200 hover:ring-slate-300 dark:ring-white/10"}`}>
                <button onClick={() => setOpen(isOpen ? null : c.cc)} aria-expanded={isOpen} className="flex w-full items-center gap-4 p-5 text-start">
                  <span className="grid h-12 w-14 place-items-center rounded-xl bg-gradient-to-br from-slate-800 to-slate-950 font-mono text-lg font-bold text-white">{c.cc}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-display text-lg font-semibold text-slate-900 dark:text-white">{c.name}</span>
                    <span className="block text-sm text-slate-500 dark:text-slate-400">{c.region} · {list.length} apps · from <span className="font-semibold text-slate-900 dark:text-white">{usd(list[0].price)}</span></span>
                  </span>
                  <span className="hidden -space-x-2 sm:flex">{list.slice(0, 4).map((o) => <span key={o.app.id} className="rounded-xl ring-2 ring-white dark:ring-[#0E1424]"><AppTile app={o.app} size="sm" /></span>)}</span>
                  <ChevronDown className={`h-5 w-5 text-slate-400 transition duration-300 ${isOpen ? "rotate-180" : ""}`} />
                </button>
                <div className={`grid transition-all duration-500 ease-out ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                  <div className="overflow-hidden">
                    <div className="border-t border-slate-100 p-5 dark:border-white/10">
                      {mine.length > 0 && <div className="mb-4 grid gap-3 md:grid-cols-2">{mine.map((o) => <OrderCard key={o.id} order={o} onCancel={() => cancel(o.id)} compact />)}</div>}
                      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
                        {list.map((o) => (
                          <button key={o.app.id} onClick={() => buy(o)} className="group flex items-center gap-3 rounded-2xl p-3 text-start ring-1 ring-slate-200 transition hover:bg-indigo-50/60 hover:ring-indigo-300 dark:ring-white/10 dark:hover:bg-white/[.03] dark:hover:ring-indigo-400/50">
                            <AppTile app={o.app} size="sm" />
                            <span className="min-w-0 flex-1"><span className="block truncate text-sm font-medium text-slate-900 dark:text-white">{o.app.name}</span><span className="text-xs text-slate-500 dark:text-slate-400">{o.success}% success</span></span>
                            <span className="font-display text-sm font-bold text-slate-900 dark:text-white">{usd(o.price)}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-10"><Assurances /></div>
      </div>
    </PageShell>
  );
}
