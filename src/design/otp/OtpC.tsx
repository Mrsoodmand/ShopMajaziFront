"use client";
import { useMemo, useState } from "react";
import { Search, Sparkles, Wifi, BatteryFull, Signal } from "lucide-react";
import { offersFor, otpApps, type OtpOffer } from "@/content/otp-en";
import { useMoney } from "@/lib/money";
import { useOtpOrders } from "./order";
import { AppTile, Assurances, CC, OrderCard, PageShell, PageTitle, SuccessBar, WalletChip } from "./parts";

const quick = [["whatsapp", "DE"], ["telegram", "US"], ["openai", "GB"], ["instagram", "NL"], ["google", "TR"]] as const;

// Page C — "One Search": a single smart search box that understands "app + country" ("telegram germany",
// "whatsapp uk"). Results show instantly; the live order plays on a phone mock beside them, like hero C.
export default function OtpC() {
  const usd = useMoney().format;
  const [q, setQ] = useState("");
  const { orders, buy, cancel } = useOtpOrders();
  const all = useMemo(() => otpApps.flatMap((a) => offersFor(a.id)), []);

  const results = useMemo(() => {
    const words = q.trim().toLowerCase().split(/\s+/).filter(Boolean);
    if (!words.length) return all.filter((o) => o.app.popular).sort((a, b) => a.price - b.price).slice(0, 8);
    const alias: Record<string, string> = { uk: "gb", usa: "us", america: "us", gmail: "google", chatgpt: "openai", gpt: "openai" };
    const ws = words.map((w) => alias[w] ?? w);
    return all
      .filter((o) => ws.every((w) => `${o.app.name} ${o.app.id} ${o.country.name} ${o.country.cc}`.toLowerCase().includes(w)))
      .sort((a, b) => a.price - b.price)
      .slice(0, 10);
  }, [q, all]);

  const run = (o: OtpOffer) => buy(o);
  const latest = orders[0];

  return (
    <PageShell>
      <div className="relative overflow-hidden">
        <div aria-hidden className="pointer-events-none absolute -top-24 start-[10%] h-96 w-96 rounded-full bg-indigo-300/40 blur-[120px] dark:bg-indigo-600/20" />
        <div className="relative mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)] gap-12 px-6 py-14 lg:grid-cols-[minmax(0,1fr)_380px]">
          <div>
            <PageTitle title="Which app, which country?" sub="Type both in one go, like “telegram germany”. Prices update live." />

            <label className="relative mt-8 block">
              <Search className="pointer-events-none absolute start-5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="e.g. whatsapp netherlands" aria-label="Search app and country"
                className="h-16 w-full rounded-2xl border border-white bg-white/90 ps-14 pe-5 text-lg shadow-xl shadow-indigo-100 outline-none backdrop-blur transition focus:ring-4 focus:ring-indigo-200 dark:border-white/10 dark:bg-white/5 dark:text-white dark:shadow-black/30 dark:focus:ring-indigo-500/30" />
            </label>
            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
              <span className="flex items-center gap-1 text-slate-500 dark:text-slate-400"><Sparkles className="h-3.5 w-3.5" />Try:</span>
              {quick.map(([a, cc]) => {
                const label = `${otpApps.find((x) => x.id === a)!.name.split(" ")[0]} ${cc}`;
                return <button key={label} onClick={() => setQ(label.toLowerCase())} className="rounded-full bg-white px-3 py-1.5 font-medium text-slate-600 ring-1 ring-slate-200 hover:ring-indigo-300 dark:bg-white/5 dark:text-slate-300 dark:ring-white/10">{label}</button>;
              })}
            </div>

            <div className="mt-6 overflow-hidden rounded-3xl bg-white ring-1 ring-slate-200 dark:bg-[#0E1424] dark:ring-white/10">
              <div className="border-b border-slate-100 px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:border-white/10 dark:text-slate-400">{q.trim() ? `${results.length} matches, cheapest first` : "Popular right now"}</div>
              {results.length === 0 && <div className="p-8 text-center text-sm text-slate-500 dark:text-slate-400">No match for “{q}”. Try just the app name.</div>}
              <ul key={q} className="animate-fade-up divide-y divide-slate-100 [animation-duration:250ms] dark:divide-white/5">
                {results.map((o) => (
                  <li key={o.app.id + o.country.cc} className="flex items-center gap-4 px-5 py-3.5 transition hover:bg-indigo-50/40 dark:hover:bg-white/[.03]">
                    <AppTile app={o.app} size="sm" />
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white"><span className="truncate">{o.app.name}</span><CC cc={o.country.cc} flag={o.country.flag} /><span className="hidden truncate font-normal text-slate-500 sm:inline dark:text-slate-400">{o.country.name}</span></span>
                      <SuccessBar pct={o.success} />
                    </span>
                    <span className="font-display text-lg font-bold text-slate-900 dark:text-white">{usd(o.price)}</span>
                    <button onClick={() => run(o)} className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700">Get number</button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="lg:sticky lg:top-24 lg:self-start">
            <div className="mb-3 flex justify-end"><WalletChip /></div>
            <div className="mx-auto w-full max-w-[340px] rounded-[2.75rem] border-[10px] border-slate-900 bg-slate-900 shadow-2xl dark:border-slate-700">
              <div className="overflow-hidden rounded-[2rem] bg-slate-50 dark:bg-[#0B1020]">
                <div className="flex items-center justify-between px-6 pb-2 pt-3 text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                  <span>9:41</span><span className="h-5 w-24 rounded-full bg-slate-900" /><span className="flex gap-1"><Signal className="h-3 w-3" /><Wifi className="h-3 w-3" /><BatteryFull className="h-3 w-3" /></span>
                </div>
                <div className="min-h-[420px] space-y-3 p-4">
                  {latest ? orders.slice(0, 2).map((o) => <OrderCard key={o.id} order={o} onCancel={() => cancel(o.id)} compact />) : (
                    <div className="grid h-[380px] place-items-center text-center text-sm text-slate-500 dark:text-slate-400">
                      <span>Your number and code<br />will appear here.</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="relative mx-auto max-w-7xl px-6 pb-14"><Assurances /></div>
      </div>
    </PageShell>
  );
}
