"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronRight, MessageCircle } from "lucide-react";
import { faqCategories, faqs } from "@/content/faq-en";
import Item from "./Item";
import FaqSchema from "./FaqSchema";

// Offer D — "Split Q&A": on desktop the questions are a list on the left and the chosen answer shows large on the right,
// like a help-center reader. On phones it falls back to a normal accordion.
export default function FaqD() {
  const list = faqs.slice(0, 9);
  const [sel, setSel] = useState(list[0].id);
  const [open, setOpen] = useState<string | null>(list[0].id);
  const cur = list.find((f) => f.id === sel)!;
  const catLabel = faqCategories.find((c) => c.id === cur.cat)!.label;

  return (
    <section className="bg-[#F6F5F1] py-24 dark:bg-[#070B14]">
      <FaqSchema />
      <div className="mx-auto max-w-6xl px-6">
        <div className="max-w-2xl">
          <span className="text-sm font-semibold uppercase tracking-widest text-violet-600 dark:text-violet-400">FAQ</span>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-5xl dark:text-white">Good questions, straight answers.</h2>
        </div>

        <div className="mt-12 hidden gap-6 lg:grid lg:grid-cols-[1fr_1.2fr]">
          <ul className="space-y-1">
            {list.map((f, i) => {
              const on = f.id === sel;
              return (
                <li key={f.id}>
                  <button onClick={() => setSel(f.id)} onMouseEnter={() => setSel(f.id)}
                    className={`flex w-full items-center gap-4 rounded-2xl px-4 py-3.5 text-start transition ${on ? "bg-white shadow-sm ring-1 ring-slate-200 dark:bg-[#0E1424] dark:ring-white/10" : "hover:bg-white/60 dark:hover:bg-white/5"}`}>
                    <span className={`font-mono text-xs ${on ? "text-violet-600 dark:text-violet-400" : "text-slate-400"}`}>{String(i + 1).padStart(2, "0")}</span>
                    <span className={`flex-1 text-sm font-medium ${on ? "text-slate-900 dark:text-white" : "text-slate-600 dark:text-slate-400"}`}>{f.q}</span>
                    <ChevronRight className={`h-4 w-4 transition rtl:rotate-180 ${on ? "translate-x-0.5 text-violet-600 dark:text-violet-400" : "text-slate-300 dark:text-slate-600"}`} />
                  </button>
                </li>
              );
            })}
          </ul>

          <div className="lg:sticky lg:top-24 lg:self-start">
            <article key={cur.id} className="animate-fade-up rounded-3xl bg-white p-10 shadow-sm ring-1 ring-slate-200 [animation-duration:300ms] dark:bg-[#0E1424] dark:ring-white/10">
              <span className="rounded-full bg-violet-100 px-3 py-1 text-xs font-semibold text-violet-700 dark:bg-violet-500/15 dark:text-violet-300">{catLabel}</span>
              <h3 className="mt-5 font-display text-2xl font-semibold leading-snug text-slate-900 dark:text-white">{cur.q}</h3>
              <p className="mt-4 text-[17px] leading-8 text-slate-600 dark:text-slate-400">{cur.a}</p>
              <div className="mt-8 flex items-center gap-3 border-t border-slate-100 pt-6 text-sm text-slate-500 dark:border-white/10 dark:text-slate-400">
                <MessageCircle className="h-4 w-4" />Still unsure?
                <Link href="/contact-us" className="font-semibold text-violet-600 hover:underline dark:text-violet-400">Ask support</Link>
              </div>
            </article>
          </div>
        </div>

        <div className="mt-10 border-t border-slate-300/60 lg:hidden dark:border-white/10">
          {list.map((f) => <Item key={f.id} id={`faq-d-${f.id}`} q={f.q} a={f.a} open={open === f.id} onToggle={() => setOpen(open === f.id ? null : f.id)} />)}
        </div>
      </div>
    </section>
  );
}
