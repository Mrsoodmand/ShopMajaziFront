"use client";
import { useState } from "react";
import { Zap, ShieldCheck, ArrowRight } from "lucide-react";
import { cheapest, offersFor, otpApps, otpCountries } from "@/content/otp-en";
import { useMoney } from "@/lib/money";
import { faqs } from "@/content/faq-en";
import FaqItem from "../faq/Item";
import Combo from "./Combo";
import { useOtpOrders } from "./order";
import { AppTile, Assurances, CC, OrderCard, PageShell } from "./parts";

const combos = [["whatsapp", "DE"], ["telegram", "US"], ["openai", "GB"], ["instagram", "NL"], ["google", "TR"], ["tiktok", "ID"]] as const;

// Page F — "Quick-Buy Hero": the page opens like the home hero (soft mesh, big headline) with one glass card holding
// two searchable dropdowns and a Get number button. Popular one-click combos, the cheapest countries and a short FAQ follow.
export default function OtpF() {
  const usd = useMoney().format;
  const [appId, setAppId] = useState("whatsapp");
  const [cc, setCc] = useState(() => cheapest("whatsapp").country.cc);
  const [open, setOpen] = useState<string | null>(null);
  const { orders, buy, cancel } = useOtpOrders();
  const offers = offersFor(appId);
  const offer = offers.find((o) => o.country.cc === cc)!;
  const top = [...offers].sort((a, b) => a.price - b.price).slice(0, 8);
  const app = otpApps.find((a) => a.id === appId)!;
  const pickApp = (id: string) => { setAppId(id); setCc(cheapest(id).country.cc); };

  return (
    <PageShell>
      <section className="relative overflow-hidden">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute -top-32 start-[8%] h-[420px] w-[420px] rounded-full bg-indigo-300/50 blur-[110px] dark:bg-indigo-600/30" />
          <div className="absolute -top-20 end-[6%] h-[380px] w-[380px] rounded-full bg-fuchsia-300/40 blur-[110px] dark:bg-fuchsia-600/20" />
          <div className="absolute inset-0 bg-[radial-gradient(rgba(15,23,42,.12)_1px,transparent_1px)] bg-[size:22px_22px] [mask-image:radial-gradient(ellipse_at_top,black_20%,transparent_70%)] dark:bg-[radial-gradient(rgba(255,255,255,.08)_1px,transparent_1px)]" />
        </div>
        <div className="relative mx-auto max-w-4xl px-6 pb-16 pt-16 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-white bg-white/70 px-3 py-1 text-xs font-medium text-slate-600 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
            <Zap className="h-3.5 w-3.5 text-amber-500" />Number in seconds<span className="text-slate-300 dark:text-slate-600">·</span><ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />Refund if no code
          </span>
          <h1 className="mt-6 font-display text-4xl font-bold leading-[1.05] tracking-tight text-slate-900 sm:text-6xl dark:text-white">
            Virtual numbers for <span className="bg-gradient-to-r from-indigo-600 to-fuchsia-500 bg-clip-text text-transparent dark:from-indigo-300 dark:to-fuchsia-300">any app.</span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg text-slate-600 dark:text-slate-400">Receive verification codes from 150+ countries. Pick, pay, paste the code.</p>

          <div className="mt-10 rounded-[2rem] border border-white bg-white/80 p-3 text-start shadow-2xl shadow-indigo-200/60 backdrop-blur-xl dark:border-white/10 dark:bg-white/[.04] dark:shadow-black/40">
            <div className="grid gap-3 md:grid-cols-[1fr_1fr_auto]">
              <Combo label="App" value={appId} onChange={pickApp} placeholder="Choose app"
                items={otpApps.map((a) => ({ id: a.id, label: a.name, hint: `from ${usd(cheapest(a.id).price)}`, icon: <AppTile app={a} size="sm" /> }))} />
              <Combo label="Country" value={cc} onChange={setCc} placeholder="Choose country"
                items={[...offers].sort((a, b) => a.price - b.price).map((o) => ({ id: o.country.cc, label: o.country.name, search: o.country.cc, hint: usd(o.price), icon: <CC cc={o.country.cc} flag={o.country.flag} /> }))} />
              <button onClick={() => buy(offer)} className="group flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-7 py-4 text-base font-semibold text-white shadow-lg shadow-indigo-600/30 transition hover:bg-indigo-700">
                Get number · {usd(offer.price)}<ArrowRight className="h-5 w-5 transition group-hover:translate-x-1 rtl:rotate-180" />
              </button>
            </div>
            {orders.length > 0 && <div className="mt-3 grid gap-3 md:grid-cols-2">{orders.slice(0, 2).map((o) => <OrderCard key={o.id} order={o} onCancel={() => cancel(o.id)} />)}</div>}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl space-y-16 px-6 pb-20">
        <section>
          <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-white">Popular right now</h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {combos.map(([a, c]) => {
              const o = offersFor(a).find((x) => x.country.cc === c)!;
              return (
                <button key={a + c} onClick={() => buy(o)} className="group flex items-center gap-4 rounded-2xl bg-white p-4 text-start ring-1 ring-slate-200 transition duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:ring-indigo-300 dark:bg-[#0E1424] dark:ring-white/10 dark:hover:ring-indigo-400/50">
                  <AppTile app={o.app} />
                  <span className="min-w-0 flex-1"><span className="block truncate font-semibold text-slate-900 dark:text-white">{o.app.name}</span><span className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400"><CC cc={c} />{o.country.name}</span></span>
                  <span className="text-end"><span className="block font-display font-bold text-slate-900 dark:text-white">{usd(o.price)}</span><span className="text-xs font-semibold text-indigo-600 opacity-0 transition group-hover:opacity-100 dark:text-indigo-300">Buy now</span></span>
                </button>
              );
            })}
          </div>
        </section>

        <section>
          <h2 className="flex items-center gap-2 font-display text-2xl font-bold text-slate-900 dark:text-white">Cheapest countries for <AppTile app={app} size="sm" />{app.name}</h2>
          <div className="mt-5 flex flex-wrap gap-2">
            {top.map((o) => (
              <button key={o.country.cc} onClick={() => setCc(o.country.cc)} className={`flex items-center gap-2 rounded-full py-1.5 pe-4 ps-1.5 text-sm ring-1 transition ${o.country.cc === cc ? "bg-indigo-600 text-white ring-indigo-600" : "bg-white text-slate-700 ring-slate-200 hover:ring-indigo-300 dark:bg-white/5 dark:text-slate-200 dark:ring-white/10"}`}>
                <CC cc={o.country.cc} flag={o.country.flag} />{o.country.name}<span className="font-semibold">{usd(o.price)}</span>
              </button>
            ))}
            <span className="self-center text-sm text-slate-500 dark:text-slate-400">+{otpCountries.length - top.length} more in the country list</span>
          </div>
        </section>

        <Assurances />

        <section className="mx-auto max-w-3xl">
          <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-white">Questions about virtual numbers</h2>
          <div className="mt-4 border-t border-slate-200 dark:border-white/10">
            {faqs.filter((f) => f.cat === "numbers").map((f) => <FaqItem key={f.id} id={`otpf-${f.id}`} q={f.q} a={f.a} open={open === f.id} onToggle={() => setOpen(open === f.id ? null : f.id)} />)}
          </div>
        </section>
      </div>
    </PageShell>
  );
}
