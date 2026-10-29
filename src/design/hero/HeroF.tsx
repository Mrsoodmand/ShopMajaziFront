"use client";

import { useState } from "react";
import { Star, ChevronRight, MessageSquare, Check, Zap } from "lucide-react";
import { brand, services } from "@/content/en";
import { serviceIcons } from "./serviceIcons";

const quick: Record<string, { label: string; options: string[]; cta: string }> = {
  "virtual-number": { label: "Country", options: ["US", "GB", "DE", "NL", "CA", "TR"], cta: "Get number" },
  "google-voice": { label: "Area", options: ["NY", "CA", "TX", "FL"], cta: "Buy line" },
  "apple-id": { label: "Region", options: ["US", "GB", "CA", "TR"], cta: "Get Apple ID" },
  subscriptions: { label: "Plan", options: ["ChatGPT", "Netflix", "Spotify", "Canva"], cta: "Subscribe" },
  social: { label: "Platform", options: ["Telegram", "Instagram", "YouTube", "TikTok"], cta: "Boost now" },
};

// Offer F — "A × B": A's dark glow background, B's layout and copy, with a glass quick-order panel on the right instead of the bento grid.
export default function HeroF() {
  const list = services.slice(0, 5);
  const [active, setActive] = useState(list[0].id);
  const [opt, setOpt] = useState(0);
  const q = quick[active];
  const current = list.find((s) => s.id === active)!;

  return (
    <section className="relative overflow-hidden bg-[#070B14] text-white">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 end-0 h-[520px] w-[760px] rounded-full bg-indigo-600/30 blur-[120px]" />
        <div className="absolute bottom-0 -start-20 h-72 w-72 rounded-full bg-cyan-500/20 blur-[100px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,.04)_1px,transparent_1px)] bg-[size:56px_56px] [mask-image:radial-gradient(ellipse_at_top,black_30%,transparent_75%)]" />
      </div>

      <nav className="relative mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        <span className="flex items-center gap-2 font-display text-xl font-bold">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-indigo-400 to-cyan-300 text-sm text-slate-950">S</span>{brand.name}
        </span>
        <div className="hidden gap-7 text-sm text-slate-300 md:flex">
          <a href="#" className="hover:text-white">Services</a><a href="#" className="hover:text-white">Pricing</a><a href="#" className="hover:text-white">Blog</a><a href="#" className="hover:text-white">Support</a>
        </div>
        <a href="#" className="rounded-full bg-white px-4 py-2 text-sm font-medium text-slate-900">My account</a>
      </nav>

      <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-6 pb-24 pt-10 lg:grid-cols-[1fr_1fr] lg:pt-16">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300 backdrop-blur">
            <span className="flex">{[0, 1, 2, 3, 4].map((i) => <Star key={i} className="h-3 w-3 fill-amber-400 text-amber-400" />)}</span>
            Rated 4.9 by 38,000+ customers
          </div>
          <h1 className="mt-6 font-display text-4xl font-bold leading-[1.05] tracking-tight sm:text-6xl">
            The digital store for everything{" "}
            <span className="relative whitespace-nowrap bg-gradient-to-r from-indigo-300 via-cyan-200 to-emerald-200 bg-clip-text text-transparent">
              online
              <svg aria-hidden viewBox="0 0 200 12" className="absolute -bottom-2 start-0 w-full text-cyan-300/70"><path d="M2 9c50-6 140-8 196-3" stroke="currentColor" strokeWidth="4" fill="none" strokeLinecap="round" /></svg>
            </span>.
          </h1>
          <p className="mt-6 max-w-lg text-lg text-slate-400">
            Numbers, accounts, subscriptions and growth — pick a service, pay once, and get it delivered to your dashboard in seconds.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#" className="rounded-full bg-indigo-500 px-6 py-3.5 text-sm font-semibold shadow-lg shadow-indigo-500/30 hover:bg-indigo-400">Browse all services</a>
            <a href="#" className="rounded-full border border-white/15 bg-white/5 px-6 py-3.5 text-sm font-semibold hover:border-white/30">Top up wallet</a>
          </div>
          <div className="mt-10 flex items-center gap-6 text-sm text-slate-400">
            <div><span className="block font-display text-2xl font-bold text-white">1.2M+</span>orders</div>
            <div className="h-10 w-px bg-white/10" />
            <div><span className="block font-display text-2xl font-bold text-white">150+</span>countries</div>
            <div className="h-10 w-px bg-white/10" />
            <div><span className="block font-display text-2xl font-bold text-white">24/7</span>support</div>
          </div>
        </div>

        <div className="relative">
          <div className="rounded-3xl border border-white/10 bg-white/[.05] p-3 shadow-2xl shadow-indigo-950/60 backdrop-blur-xl">
            <div className="flex items-center justify-between px-3 py-2">
              <span className="text-sm font-semibold">Quick order</span>
              <span className="flex items-center gap-1.5 text-xs text-emerald-300"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />All systems online</span>
            </div>
            <ul className="space-y-1">
              {list.map((s) => {
                const Icon = serviceIcons[s.id];
                const on = s.id === active;
                return (
                  <li key={s.id}>
                    <button
                      onClick={() => { setActive(s.id); setOpt(0); }}
                      className={`flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-start transition ${on ? "bg-white/10 ring-1 ring-indigo-400/50" : "hover:bg-white/5"}`}
                    >
                      <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${on ? "bg-indigo-500 text-white" : "bg-white/5 text-slate-300"}`}><Icon className="h-5 w-5" /></span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-semibold">{s.name}</span>
                        <span className="block truncate text-xs text-slate-400">{s.short}</span>
                      </span>
                      <span className="text-xs text-slate-400">from <span className="font-semibold text-white">{s.from}</span></span>
                      <ChevronRight className={`h-4 w-4 transition ${on ? "rotate-90 text-indigo-300" : "text-slate-600"}`} />
                    </button>
                  </li>
                );
              })}
            </ul>
            <div className="mt-2 rounded-2xl bg-slate-950/60 p-4">
              <div className="text-[11px] font-medium uppercase tracking-wide text-slate-500">{q.label}</div>
              <div className="mt-2 flex flex-wrap gap-2">
                {q.options.map((o, i) => (
                  <button key={o} onClick={() => setOpt(i)} className={`rounded-lg px-3 py-1.5 font-mono text-xs font-semibold ${i === opt ? "bg-white text-slate-900" : "bg-white/5 text-slate-300 hover:bg-white/10"}`}>{o}</button>
                ))}
              </div>
              <button className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-500 py-3 text-sm font-semibold hover:bg-indigo-400">
                <Zap className="h-4 w-4" />{q.cta} · {current.from}
              </button>
            </div>
          </div>

          <div className="absolute -top-14 -end-6 hidden animate-float rounded-2xl border border-white/10 bg-emerald-500/90 px-4 py-3 text-sm shadow-xl backdrop-blur sm:block">
            <div className="flex items-center gap-1.5 text-xs text-emerald-50"><MessageSquare className="h-3.5 w-3.5" />Telegram · now</div>
            <div className="font-mono text-xl font-bold tracking-widest">71 904</div>
          </div>
          <div className="absolute -bottom-5 -start-6 hidden animate-float items-center gap-2 rounded-full border border-white/10 bg-slate-900/90 px-4 py-2 text-xs shadow-xl backdrop-blur [animation-delay:2s] sm:flex">
            <Check className="h-4 w-4 text-emerald-400" />ChatGPT Plus delivered · 12s
          </div>
        </div>
      </div>
    </section>
  );
}
