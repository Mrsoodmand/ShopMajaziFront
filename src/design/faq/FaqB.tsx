"use client";

import { useState } from "react";
import { faqCategories, faqs } from "@/content/faq-en";
import Item from "./Item";
import FaqSchema from "./FaqSchema";

// Offer B — "Category Tabs": pill tabs by topic filter a two-column grid of boxed questions. Matches the hero G tabs.
export default function FaqB() {
  const [cat, setCat] = useState("all");
  const [open, setOpen] = useState<string | null>(null);
  const tabs = [{ id: "all", label: "All" }, ...faqCategories];
  const shown = cat === "all" ? faqs : faqs.filter((f) => f.cat === cat);
  const half = Math.ceil(shown.length / 2);

  return (
    <section className="relative overflow-hidden bg-[#F5F6FB] py-24 dark:bg-[#070B14]">
      <FaqSchema />
      <div aria-hidden className="pointer-events-none absolute -top-24 start-1/2 h-80 w-[700px] -translate-x-1/2 rounded-full bg-indigo-300/40 blur-[120px] dark:bg-indigo-600/20" />
      <div className="relative mx-auto max-w-6xl px-6">
        <div className="text-center">
          <span className="text-sm font-semibold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">FAQ</span>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-5xl dark:text-white">Frequently asked questions</h2>
        </div>

        <div className="mt-10 flex justify-center">
          <div className="flex gap-1 overflow-x-auto rounded-full bg-white p-1 shadow-sm ring-1 ring-slate-200 [scrollbar-width:none] dark:bg-white/5 dark:ring-white/10">
            {tabs.map((t) => (
              <button key={t.id} onClick={() => { setCat(t.id); setOpen(null); }}
                className={`shrink-0 whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition ${cat === t.id ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900" : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"}`}>
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div key={cat} className="mt-10 grid animate-fade-up items-start gap-4 [animation-duration:350ms] md:grid-cols-2">
          {[shown.slice(0, half), shown.slice(half)].map((col, c) => (
            <div key={c} className="space-y-4">
              {col.map((f) => <Item key={f.id} id={`faq-b-${f.id}`} q={f.q} a={f.a} open={open === f.id} onToggle={() => setOpen(open === f.id ? null : f.id)} boxed />)}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
