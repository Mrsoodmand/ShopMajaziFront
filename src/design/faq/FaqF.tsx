"use client";

import { useState } from "react";
import Link from "@/i18n/Link";
import { ChevronRight, MessageCircle } from "lucide-react";
import { faqCategories, faqs } from "@/content/faq-en";
import Item from "./Item";
import FaqSchema from "./FaqSchema";
import { useT } from "@/i18n/client";

// Offer F — "Tabs × Split" (B + D): B's topic tabs on top, D's split reader underneath.
// Desktop: the tab's questions are listed on the left and the chosen answer shows large on the right. Phones: accordion.
export default function FaqF() {
  const tx = useT();
  const tabs = tx.tr(faqCategories);
  const [cat, setCat] = useState(tabs[0].id);
  const shown = tx.tr(faqs).filter((f) => f.cat === cat);
  const [sel, setSel] = useState(shown[0].id);
  const [open, setOpen] = useState<string | null>(shown[0].id);
  const cur = shown.find((f) => f.id === sel) ?? shown[0];
  const catLabel = (id: string) => tx.tr(faqCategories).find((c) => c.id === id)!.label;

  const pickTab = (id: string) => {
    const first = tx.tr(faqs).filter((f) => f.cat === id)[0].id;
    setCat(id); setSel(first); setOpen(first);
  };

  return (
    <section className="bg-[#F6F5F1] py-24 dark:bg-[#070B14]">
      <FaqSchema />
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl">
            <span className="text-sm font-semibold uppercase tracking-widest text-violet-600 dark:text-violet-400">{tx("FAQ")}</span>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-5xl dark:text-white">{tx("Good questions, straight answers.")}</h2>
          </div>
        </div>

        <div className="mt-10 flex gap-1 overflow-x-auto rounded-full bg-white p-1 shadow-sm ring-1 ring-slate-200 [scrollbar-width:none] sm:w-fit dark:bg-white/5 dark:ring-white/10">
          {tabs.map((t) => (
            <button key={t.id} onClick={() => pickTab(t.id)}
              className={`shrink-0 whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition ${cat === t.id ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900" : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"}`}>
              {t.label}
            </button>
          ))}
        </div>

        <div key={cat} className="mt-8 hidden animate-fade-up gap-6 [animation-duration:350ms] lg:grid lg:grid-cols-[1fr_1.2fr]">
          <ul className="space-y-1">
            {shown.map((f, i) => {
              const on = f.id === cur.id;
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
              <span className="rounded-full bg-violet-100 px-3 py-1 text-xs font-semibold text-violet-700 dark:bg-violet-500/15 dark:text-violet-300">{catLabel(cur.cat)}</span>
              <h3 className="mt-5 font-display text-2xl font-semibold leading-snug text-slate-900 dark:text-white">{cur.q}</h3>
              <p className="mt-4 text-[17px] leading-8 text-slate-600 dark:text-slate-400">{cur.a}</p>
              <div className="mt-8 flex items-center gap-3 border-t border-slate-100 pt-6 text-sm text-slate-500 dark:border-white/10 dark:text-slate-400">
                <MessageCircle className="h-4 w-4" />{tx("Still unsure?")}
                <Link href="/contact-us" className="font-semibold text-violet-600 hover:underline dark:text-violet-400">{tx("Ask support")}</Link>
              </div>
            </article>
          </div>
        </div>

        <div className="mt-8 border-t border-slate-300/60 lg:hidden dark:border-white/10">
          {shown.map((f) => <Item key={f.id} id={`faq-f-${f.id}`} q={f.q} a={f.a} open={open === f.id} onToggle={() => setOpen(open === f.id ? null : f.id)} />)}
        </div>
      </div>
    </section>
  );
}
