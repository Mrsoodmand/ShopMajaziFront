"use client";

import { useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import { Search, MessageCircle, Send, Mail, SearchX } from "lucide-react";
import { faqCategories, faqs, faqSupport } from "@/content/faq-en";
import Item from "./Item";
import FaqSchema from "./FaqSchema";

// Wraps matches of `term` in <mark>.
function highlight(text: string, term: string): ReactNode {
  if (!term) return text;
  const i = text.toLowerCase().indexOf(term.toLowerCase());
  if (i < 0) return text;
  return <>{text.slice(0, i)}<mark className="rounded bg-amber-200 px-0.5 text-inherit dark:bg-amber-400/30">{text.slice(i, i + term.length)}</mark>{highlight(text.slice(i + term.length), term)}</>;
}

// Offer C — "Search FAQ": a sticky intro with support contacts on the side, and a live search that filters
// and highlights questions and answers. When nothing matches, it points straight to support.
export default function FaqC() {
  const [term, setTerm] = useState("");
  const [open, setOpen] = useState<string | null>(null);
  const t = term.trim();
  const shown = useMemo(() => (t ? faqs.filter((f) => `${f.q} ${f.a}`.toLowerCase().includes(t.toLowerCase())) : faqs), [t]);
  const catLabel = (id: string) => faqCategories.find((c) => c.id === id)!.label;

  return (
    <section className="bg-white py-24 dark:bg-[#070B14]">
      <FaqSchema />
      <div className="mx-auto grid max-w-6xl gap-12 px-6 lg:grid-cols-[1fr_1.6fr]">
        <div className="lg:sticky lg:top-24 lg:self-start">
          <span className="text-sm font-semibold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">Help center</span>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-white">How can we help?</h2>
          <p className="mt-4 text-slate-600 dark:text-slate-400">Search the most common questions, or reach a real person in minutes.</p>
          <div className="mt-8 space-y-2">
            {[[MessageCircle, "Live chat", "Average reply in 2 minutes", faqSupport.chat], [Send, "Telegram", "Message our support account", faqSupport.telegram], [Mail, "Email", faqSupport.email, `mailto:${faqSupport.email}`]].map(([I, l, d, h]) => {
              const Icon = I as typeof Mail;
              return (
                <Link key={l as string} href={h as string} className="flex items-center gap-3 rounded-2xl p-3 ring-1 ring-slate-200 transition hover:ring-indigo-300 dark:ring-white/10 dark:hover:ring-indigo-400/50">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-300"><Icon className="h-5 w-5" /></span>
                  <span><span className="block text-sm font-semibold text-slate-900 dark:text-white">{l as string}</span><span className="block text-xs text-slate-500 dark:text-slate-400">{d as string}</span></span>
                </Link>
              );
            })}
          </div>
        </div>

        <div>
          <label className="relative block">
            <Search className="pointer-events-none absolute start-5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input value={term} onChange={(e) => { setTerm(e.target.value); setOpen(null); }} placeholder="Search questions, e.g. refund, Apple ID, code…"
              className="h-14 w-full rounded-2xl border border-slate-200 bg-slate-50 ps-14 pe-5 text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100 dark:border-white/10 dark:bg-white/5 dark:text-white dark:focus:bg-white/10 dark:focus:ring-indigo-500/20" />
          </label>
          <div className="mt-3 text-xs text-slate-500 dark:text-slate-400">{t ? `${shown.length} result${shown.length === 1 ? "" : "s"} for “${t}”` : `${faqs.length} questions`}</div>

          {shown.length === 0 ? (
            <div className="mt-6 rounded-3xl border border-dashed border-slate-300 p-10 text-center dark:border-white/15">
              <SearchX className="mx-auto h-8 w-8 text-slate-400" />
              <div className="mt-3 font-display text-lg font-semibold text-slate-900 dark:text-white">No answer for that yet</div>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Ask our team. We usually reply within a couple of minutes.</p>
              <Link href={faqSupport.chat} className="mt-5 inline-flex rounded-full bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700">Ask support</Link>
            </div>
          ) : (
            <div className="mt-4">
              {shown.map((f) => (
                <Item key={f.id} id={`faq-c-${f.id}`}
                  q={<><span className="me-2 rounded-md bg-slate-100 px-1.5 py-0.5 align-middle text-[10px] font-semibold uppercase tracking-wide text-slate-500 dark:bg-white/10 dark:text-slate-400">{catLabel(f.cat)}</span>{highlight(f.q, t)}</>}
                  a={highlight(f.a, t)} open={open === f.id || (!!t && shown.length <= 2)} onToggle={() => setOpen(open === f.id ? null : f.id)} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
