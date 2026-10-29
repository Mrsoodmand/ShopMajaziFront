"use client";
import { useState } from "react";
import { Star } from "lucide-react";
import { useMoney } from "@/lib/money";
import { GV_PRICE, gvNumbers } from "@/content/google-voice-en";
import { PageShell } from "../otp/parts";
import { BuyButton, Faq, Features, GvCheckout, Guarantees, Included, NumberTile, OrderView, PhoneMock, Steps, useGv } from "./parts";

const tabs = [{ id: "about", label: "About" }, { id: "included", label: "What you get" }, { id: "how", label: "How it works" }, { id: "faq", label: "FAQ" }] as const;
type Tab = (typeof tabs)[number]["id"];

// Page B — "Product Page": a familiar shop product page. A phone showing the chosen number on the left; title,
// rating, price, a short scrolling list of numbers and Buy on the right. Details sit in tabs underneath.
export default function GvB() {
  const usd = useMoney().format;
  const gv = useGv();
  const [tab, setTab] = useState<Tab>("about");

  if (gv.order) return <PageShell><div className="px-6 py-14"><OrderView gv={gv} /></div></PageShell>;

  return (
    <PageShell>
      <div className="mx-auto max-w-6xl px-6 pb-24 pt-14">
        <div className="grid items-start gap-12 lg:grid-cols-2">
          <div className="relative rounded-[2.5rem] bg-gradient-to-br from-emerald-100 via-teal-50 to-sky-100 py-12 dark:from-emerald-500/15 dark:via-teal-500/5 dark:to-sky-500/10 lg:sticky lg:top-24">
            <PhoneMock n={gv.selected} />
          </div>

          <div>
            <span className="text-sm font-semibold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">Google Voice · USA</span>
            <h1 className="mt-3 font-display text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl dark:text-white">Permanent US phone number</h1>
            <div className="mt-4 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
              <span className="flex text-amber-400">{Array.from({ length: 5 }, (_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}</span>4.9 · 2,310 sold
            </div>
            <p className="mt-5 text-lg text-slate-600 dark:text-slate-400">Make calls and receive texts with a real US number, on its own Google account that you fully control.</p>
            <div className="mt-6 flex items-baseline gap-3"><span className="font-display text-4xl font-bold text-slate-900 dark:text-white">{usd(GV_PRICE)}</span><span className="text-sm text-slate-500 dark:text-slate-400">one-time · no monthly fee</span></div>

            <div className="mt-8 flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-900 dark:text-white">Choose your number</span>
              <span className="text-xs text-slate-500 dark:text-slate-400">{gvNumbers.length} in stock</span>
            </div>
            <div className="mt-3 max-h-[300px] space-y-2 overflow-y-auto rounded-2xl pe-1 [scrollbar-width:thin]">
              {gvNumbers.map((n) => <NumberTile key={n.id} n={n} compact on={gv.selected.id === n.id} onPick={() => gv.setSelected(n)} />)}
            </div>

            <BuyButton gv={gv} className="mt-6 w-full" />
            <Guarantees className="mt-5" />
          </div>
        </div>

        <div className="mt-20">
          <div role="tablist" className="flex gap-1 overflow-x-auto border-b border-slate-200 [scrollbar-width:none] dark:border-white/10">
            {tabs.map((t) => (
              <button key={t.id} role="tab" aria-selected={tab === t.id} onClick={() => setTab(t.id)}
                className={`relative shrink-0 px-4 py-3 text-sm font-semibold transition-colors after:absolute after:inset-x-3 after:-bottom-px after:h-0.5 after:rounded-full after:transition-all after:duration-300 ${tab === t.id ? "text-slate-900 after:bg-emerald-500 dark:text-white" : "text-slate-500 after:bg-transparent hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"}`}>
                {t.label}
              </button>
            ))}
          </div>
          {/* Every panel stays in the HTML (hidden, not removed) so search engines read all of it. */}
          {tabs.map((t) => (
            <div key={t.id} role="tabpanel" hidden={tab !== t.id} className="mt-8 animate-fade-up [animation-duration:350ms]">
              {t.id === "about" && <Features />}
              {t.id === "included" && <div className="max-w-2xl rounded-3xl bg-white p-6 ring-1 ring-slate-200 dark:bg-[#0E1424] dark:ring-white/10"><Included /></div>}
              {t.id === "how" && <Steps />}
              {t.id === "faq" && <div className="max-w-3xl"><Faq /></div>}
            </div>
          ))}
        </div>
      </div>
      <GvCheckout gv={gv} />
    </PageShell>
  );
}
