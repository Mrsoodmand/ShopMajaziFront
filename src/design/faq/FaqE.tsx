"use client";

import { useState } from "react";
import Link from "next/link";
import { Zap, ShieldCheck, Wallet, Smartphone, Apple, Users, MessageCircle, Send, ArrowRight, type LucideIcon } from "lucide-react";
import { faqs, faqSupport } from "@/content/faq-en";
import FaqSchema from "./FaqSchema";

const picks: { id: string; icon: LucideIcon; tint: string }[] = [
  { id: "speed", icon: Zap, tint: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300" },
  { id: "nocode", icon: ShieldCheck, tint: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300" },
  { id: "pay", icon: Wallet, tint: "bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300" },
  { id: "gv", icon: Smartphone, tint: "bg-indigo-100 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300" },
  { id: "custom", icon: Apple, tint: "bg-slate-200 text-slate-800 dark:bg-white/10 dark:text-slate-200" },
  { id: "password", icon: Users, tint: "bg-pink-100 text-pink-700 dark:bg-pink-500/15 dark:text-pink-300" },
];

// Offer E — "Answer Cards": the six questions people ask most, as cards in a grid. Each card shows the question and a
// teaser; click to expand the full answer. A support banner sits underneath.
export default function FaqE() {
  const [open, setOpen] = useState<string | null>(null);
  return (
    <section className="bg-white py-24 dark:bg-[#070B14]">
      <FaqSchema />
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-xl">
            <span className="text-sm font-semibold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">FAQ</span>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-5xl dark:text-white">What people ask us most</h2>
          </div>
          <Link href="/faq" className="flex items-center gap-1.5 rounded-full border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-800 hover:border-slate-400 dark:border-white/15 dark:text-slate-200 dark:hover:border-white/30">
            All {faqs.length} questions<ArrowRight className="h-4 w-4 rtl:rotate-180" />
          </Link>
        </div>

        <div className="mt-12 grid items-start gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {picks.map(({ id, icon: Icon, tint }) => {
            const f = faqs.find((x) => x.id === id)!;
            const on = open === id;
            return (
              <div key={id}
                className={`group relative rounded-3xl p-6 text-start ring-1 transition duration-300 ${on ? "bg-slate-900 text-white ring-slate-900 dark:bg-white dark:text-slate-900 dark:ring-white" : "bg-slate-50 ring-slate-200 hover:-translate-y-0.5 hover:shadow-lg dark:bg-[#0E1424] dark:ring-white/10 dark:hover:shadow-black/30"}`}>
                <span className={`grid h-11 w-11 place-items-center rounded-xl ${on ? "bg-white/15 text-white dark:bg-slate-900/10 dark:text-slate-900" : tint}`}><Icon className="h-5 w-5" /></span>
                <h3 className={`mt-5 font-display text-lg font-semibold ${on ? "" : "text-slate-900 dark:text-white"}`}>
                  {/* The button stretches over the whole card, so the card is clickable while the markup stays valid. */}
                  <button onClick={() => setOpen(on ? null : id)} aria-expanded={on} className="text-start after:absolute after:inset-0 after:rounded-3xl focus-visible:outline-none focus-visible:after:ring-2 focus-visible:after:ring-indigo-500">{f.q}</button>
                </h3>
                <p className={`mt-2 text-sm leading-6 ${on ? "opacity-80" : "line-clamp-2 text-slate-500 dark:text-slate-400"}`}>{f.a}</p>
                <span className={`mt-4 inline-block text-xs font-semibold ${on ? "opacity-70" : "text-indigo-600 dark:text-indigo-400"}`}>{on ? "Show less" : "Read answer"}</span>
              </div>
            );
          })}
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-between gap-6 rounded-3xl bg-gradient-to-r from-indigo-600 to-fuchsia-500 p-8 text-white">
          <div>
            <div className="font-display text-xl font-semibold">Still have a question?</div>
            <p className="mt-1 text-sm text-white/80">Real people on support, 24 hours a day, in English and Persian.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href={faqSupport.chat} className="flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-indigo-700"><MessageCircle className="h-4 w-4" />Live chat</Link>
            <a href={faqSupport.telegram} className="flex items-center gap-2 rounded-full bg-white/15 px-5 py-3 text-sm font-semibold ring-1 ring-white/30 hover:bg-white/25"><Send className="h-4 w-4" />Telegram</a>
          </div>
        </div>
      </div>
    </section>
  );
}
