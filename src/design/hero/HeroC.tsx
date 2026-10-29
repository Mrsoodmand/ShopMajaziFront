"use client";

import { useEffect, useState } from "react";
import { Check, ChevronDown, Copy, MessageSquare, Wifi, BatteryFull, Signal } from "lucide-react";
import { brand } from "@/content/en";

const flow = [
  { cc: "DE", country: "Germany", app: "WhatsApp", number: "+49 1521 448 0937", code: "482 913", price: "$0.42" },
  { cc: "US", country: "United States", app: "Telegram", number: "+1 (415) 552 0184", code: "77015", price: "$0.65" },
  { cc: "GB", country: "United Kingdom", app: "Google", number: "+44 7700 900 461", code: "G-308412", price: "$0.38" },
];

// Offer C — "Live Demo": copy on the left, an animated phone that receives an OTP on the right. Shows the product working.
export default function HeroC() {
  const [i, setI] = useState(0);
  const [stage, setStage] = useState<0 | 1 | 2>(0); // 0 number issued, 1 waiting, 2 code received
  const item = flow[i];

  useEffect(() => {
    const t = setTimeout(() => {
      if (stage < 2) setStage((s) => (s + 1) as 0 | 1 | 2);
      else { setStage(0); setI((n) => (n + 1) % flow.length); }
    }, stage === 2 ? 3200 : 1400);
    return () => clearTimeout(t);
  }, [stage]);

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-emerald-50 via-white to-white">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        <span className="font-display text-xl font-bold text-slate-900">{brand.name}<span className="text-emerald-500">.</span></span>
        <div className="hidden items-center gap-7 text-sm text-slate-600 md:flex">
          <a href="#" className="flex items-center gap-1">Services <ChevronDown className="h-4 w-4" /></a>
          <a href="#">How it works</a><a href="#">API</a><a href="#">Help</a>
        </div>
        <div className="flex gap-2 text-sm">
          <a href="#" className="rounded-lg px-4 py-2 font-medium text-slate-700 hover:bg-slate-100">Log in</a>
          <a href="#" className="rounded-lg bg-slate-900 px-4 py-2 font-medium text-white">Sign up</a>
        </div>
      </nav>

      <div className="mx-auto grid max-w-7xl items-center gap-16 px-6 pb-24 pt-12 lg:grid-cols-2 lg:pt-20">
        <div>
          <span className="rounded-md bg-emerald-100 px-2.5 py-1 font-mono text-xs font-medium text-emerald-700">SMS verification · 2,000+ apps</span>
          <h1 className="mt-6 font-display text-4xl font-bold leading-[1.08] tracking-tight text-slate-900 sm:text-6xl">
            Get a number.<br />Get the code.<br /><span className="text-emerald-600">Get on with it.</span>
          </h1>
          <p className="mt-6 max-w-md text-lg text-slate-600">
            Receive verification codes on real numbers from 150+ countries — plus permanent Google Voice lines, Apple IDs and premium subscriptions.
          </p>

          <div className="mt-8 max-w-md rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
            <div className="grid grid-cols-2 gap-2">
              <label className="rounded-xl bg-slate-50 px-4 py-2.5">
                <span className="block text-[11px] font-medium uppercase tracking-wide text-slate-400">Service</span>
                <span className="flex items-center justify-between text-sm font-semibold text-slate-800">WhatsApp <ChevronDown className="h-4 w-4 text-slate-400" /></span>
              </label>
              <label className="rounded-xl bg-slate-50 px-4 py-2.5">
                <span className="block text-[11px] font-medium uppercase tracking-wide text-slate-400">Country</span>
                <span className="flex items-center justify-between text-sm font-semibold text-slate-800"><span><span className="me-1.5 rounded bg-slate-900 px-1 font-mono text-[10px] text-white">DE</span>Germany</span> <ChevronDown className="h-4 w-4 text-slate-400" /></span>
              </label>
            </div>
            <button className="mt-2 w-full rounded-xl bg-emerald-600 py-3 text-sm font-semibold text-white hover:bg-emerald-700">Get number — $0.42</button>
          </div>
          <p className="mt-3 text-xs text-slate-500">No code within 20 minutes? Automatic refund to your wallet.</p>
        </div>

        <div className="relative mx-auto w-full max-w-sm">
          <div aria-hidden className="absolute -inset-10 rounded-full bg-emerald-300/30 blur-3xl" />
          <div className="relative rounded-[2.75rem] border-[10px] border-slate-900 bg-slate-900 shadow-2xl">
            <div className="overflow-hidden rounded-[2rem] bg-slate-50">
              <div className="flex items-center justify-between px-6 pb-2 pt-3 text-[11px] font-semibold text-slate-700">
                <span>9:41</span>
                <span className="h-5 w-24 rounded-full bg-slate-900" />
                <span className="flex gap-1"><Signal className="h-3 w-3" /><Wifi className="h-3 w-3" /><BatteryFull className="h-3 w-3" /></span>
              </div>
              <div className="space-y-3 px-4 pb-6 pt-3">
                <div className="rounded-2xl bg-white p-4 shadow-sm">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span className="flex items-center gap-1.5"><span className="rounded bg-slate-900 px-1 font-mono text-[10px] font-bold text-white">{item.cc}</span>{item.country}</span><span className="rounded bg-slate-100 px-1.5 py-0.5">{item.app}</span>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="font-mono text-lg font-semibold text-slate-900">{item.number}</span>
                    <Copy className="h-4 w-4 text-slate-400" />
                  </div>
                  <div className="mt-3 flex items-center gap-2 text-xs">
                    {stage === 0 && <span className="flex items-center gap-1.5 text-slate-500"><Check className="h-3.5 w-3.5 text-emerald-500" />Number issued · {item.price}</span>}
                    {stage === 1 && <span className="flex items-center gap-1.5 text-amber-600"><span className="h-2 w-2 animate-ping rounded-full bg-amber-500" />Waiting for SMS…</span>}
                    {stage === 2 && <span className="flex items-center gap-1.5 text-emerald-600"><Check className="h-3.5 w-3.5" />Code received</span>}
                  </div>
                </div>

                <div className={`rounded-2xl bg-emerald-600 p-4 text-white shadow-lg transition-all duration-500 ${stage === 2 ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}>
                  <div className="flex items-center gap-2 text-xs text-emerald-100"><MessageSquare className="h-3.5 w-3.5" />{item.app} · now</div>
                  <div className="mt-1 text-sm">Your verification code is</div>
                  <div className="mt-1 font-mono text-3xl font-bold tracking-widest">{item.code}</div>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-2 text-center text-[11px] text-slate-500">
                  {["Instant", "Refundable", "Private"].map((x) => <div key={x} className="rounded-xl bg-white py-2 shadow-sm">{x}</div>)}
                </div>
              </div>
            </div>
          </div>
          <div className="absolute -start-20 -top-6 hidden animate-float rounded-xl bg-white px-3 py-2 text-xs shadow-lg sm:block">
            <div className="font-semibold text-slate-900">Google Voice</div><div className="text-slate-500">Permanent US line</div>
          </div>
          <div className="absolute -end-16 bottom-2 hidden animate-float rounded-xl bg-white px-3 py-2 text-xs shadow-lg [animation-delay:1.5s] sm:block">
            <div className="font-semibold text-slate-900">ChatGPT Plus</div><div className="text-slate-500">Delivered ✓</div>
          </div>
        </div>
      </div>
    </section>
  );
}
