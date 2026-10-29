"use client";
import { useState } from "react";
import { Star, Check, Phone, MessageSquare, ShieldCheck, Zap, Wifi, BatteryFull, Signal, ShoppingCart } from "lucide-react";
import { GV_PRICE, gvFeatures, gvNumbers, gvSetup } from "@/content/gv-en";
import { faqs } from "@/content/faq-en";
import { useMoney } from "@/lib/money";
import Combo from "../otp/Combo";
import FaqItem from "../faq/Item";
import SlidingTabs from "@/components/ui/SlidingTabs";
import { useGvOrder } from "./order";
import { EasyTag, GvCheckout, GvDelivery, PageShell } from "./parts";

type Tab = "details" | "setup" | "faq";

// Page C — "Product Page": a classic store product page. A phone mock shows the chosen number; beside it the title,
// rating, price, a searchable number dropdown, what's included and Buy. Tabs below for details, setup and FAQ.
export default function GvC() {
  const usd = useMoney().format;
  const [sel, setSel] = useState(gvNumbers[0].id);
  const [tab, setTab] = useState<Tab>("details");
  const [open, setOpen] = useState<string | null>(null);
  const [pay, setPay] = useState(false);
  const { order, buy, reset } = useGvOrder();
  const n = gvNumbers.find((x) => x.id === sel)!;

  return (
    <PageShell>
      <div className="mx-auto max-w-6xl px-6 py-14">
        <nav aria-label="Breadcrumb" className="text-sm text-slate-500 dark:text-slate-400">Home <span className="mx-1">/</span> Virtual Numbers <span className="mx-1">/</span> <span className="text-slate-900 dark:text-white">Google Voice</span></nav>
        {order ? <div className="mt-8"><GvDelivery order={order} onAnother={reset} /></div> : (
          <>
            <div className="mt-8 grid items-start gap-10 lg:grid-cols-2">
              <div className="relative mx-auto w-full max-w-sm">
                <div aria-hidden className="absolute -inset-8 rounded-full bg-sky-300/30 blur-3xl dark:bg-sky-600/20" />
                <div className="relative rounded-[2.75rem] border-[10px] border-slate-900 bg-slate-900 shadow-2xl dark:border-slate-700">
                  <div className="overflow-hidden rounded-[2rem] bg-gradient-to-b from-sky-50 to-white dark:from-[#0B1730] dark:to-[#0B1020]">
                    <div className="flex items-center justify-between px-6 pb-2 pt-3 text-[11px] font-semibold text-slate-700 dark:text-slate-300"><span>9:41</span><span className="h-5 w-24 rounded-full bg-slate-900" /><span className="flex gap-1"><Signal className="h-3 w-3" /><Wifi className="h-3 w-3" /><BatteryFull className="h-3 w-3" /></span></div>
                    <div className="px-6 pb-10 pt-8 text-center">
                      <span className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-sky-500 text-white shadow-lg shadow-sky-500/30"><Phone className="h-8 w-8" /></span>
                      <div className="mt-4 text-sm text-slate-500 dark:text-slate-400">Google Voice</div>
                      <div key={n.id} className="mt-1 animate-fade-up font-mono text-2xl font-bold text-slate-900 [animation-duration:300ms] dark:text-white">{n.number}</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">{n.area.city}, {n.area.state}</div>
                      <div className="mt-8 grid grid-cols-2 gap-3 text-xs">
                        <span className="flex flex-col items-center gap-1.5 rounded-2xl bg-white p-3 shadow-sm dark:bg-white/5"><Phone className="h-4 w-4 text-sky-500" />Calls</span>
                        <span className="flex flex-col items-center gap-1.5 rounded-2xl bg-white p-3 shadow-sm dark:bg-white/5"><MessageSquare className="h-4 w-4 text-sky-500" />Texts</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h1 className="font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-white">Google Voice number (USA)</h1>
                <div className="mt-3 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400"><span className="flex">{[0, 1, 2, 3, 4].map((i) => <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />)}</span>4.8 · 940 sold this week</div>
                <div className="mt-6 flex items-baseline gap-3"><span className="font-display text-4xl font-bold text-slate-900 dark:text-white">{usd(GV_PRICE)}</span><span className="text-sm text-slate-500 dark:text-slate-400">one-time · no monthly fee</span></div>
                <div className="mt-6">
                  <Combo label="Number" value={sel} onChange={setSel} placeholder="Choose a number"
                    items={gvNumbers.map((x) => ({ id: x.id, label: x.number, search: `${x.area.city} ${x.area.state} ${x.area.code}`, hint: `${x.area.city}, ${x.area.state}`, icon: x.easy ? <span className="h-2 w-2 rounded-full bg-fuchsia-500" title="Easy to remember" /> : <span className="h-2 w-2 rounded-full bg-slate-300 dark:bg-white/20" /> }))} />
                  {n.easy && <div className="mt-2"><EasyTag /></div>}
                </div>
                <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                  {gvFeatures.map((f) => <li key={f.title} className="flex gap-2.5 text-sm"><Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" /><span><span className="block font-semibold text-slate-900 dark:text-white">{f.title}</span><span className="text-slate-500 dark:text-slate-400">{f.desc}</span></span></li>)}
                </ul>
                <button onClick={() => setPay(true)} className="mt-8 flex w-full items-center justify-center gap-2 rounded-2xl bg-indigo-600 py-4 text-base font-semibold text-white shadow-lg shadow-indigo-600/25 transition hover:bg-indigo-700 sm:w-auto sm:px-10"><ShoppingCart className="h-5 w-5" />Buy now</button>
                <div className="mt-4 flex flex-wrap gap-4 text-xs text-slate-500 dark:text-slate-400"><span className="flex items-center gap-1.5"><Zap className="h-3.5 w-3.5 text-amber-500" />Delivered in minutes</span><span className="flex items-center gap-1.5"><ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />Replacement guarantee</span></div>
              </div>
            </div>

            <div className="mt-16">
              <SlidingTabs className="max-w-xl" value={tab} onChange={setTab} tabs={[{ id: "details", label: "Details" }, { id: "setup", label: "Setup" }, { id: "faq", label: "FAQ" }]} />
              <div key={tab} className="mt-6 animate-fade-up rounded-3xl bg-white p-6 ring-1 ring-slate-200 [animation-duration:300ms] sm:p-8 dark:bg-[#0E1424] dark:ring-white/10">
                {tab === "details" && <div className="max-w-3xl space-y-4 text-[15px] leading-7 text-slate-600 dark:text-slate-400"><p>Google Voice gives you a real, permanent United States phone number. Use it to call and text the US and Canada, to receive verification codes from apps and websites, and to stay reachable by clients abroad.</p><p>You receive the full Google account that owns the number, so the line is entirely under your control. Change the password and recovery details as soon as you sign in.</p></div>}
                {tab === "setup" && <ol className="max-w-2xl space-y-4">{gvSetup.map((s, i) => <li key={i} className="flex gap-3 text-[15px] text-slate-600 dark:text-slate-300"><span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-indigo-600 text-sm font-bold text-white">{i + 1}</span>{s}</li>)}</ol>}
                {tab === "faq" && <div className="max-w-3xl border-t border-slate-200 dark:border-white/10">{faqs.filter((f) => ["gv", "otp", "refund"].includes(f.id)).map((f) => <FaqItem key={f.id} id={`gvc-${f.id}`} q={f.q} a={f.a} open={open === f.id} onToggle={() => setOpen(open === f.id ? null : f.id)} />)}</div>}
              </div>
            </div>
          </>
        )}
      </div>
      <GvCheckout open={pay} onClose={() => setPay(false)} number={n} onPay={(m) => buy(n, m, GV_PRICE)} />
    </PageShell>
  );
}
