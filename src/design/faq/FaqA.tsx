"use client";

import { useState } from "react";
import Link from "next/link";
import { faqs } from "@/content/faq-en";
import Item from "./Item";
import FaqSchema from "./FaqSchema";

// Offer A — "Classic Accordion": one calm centered column, one question open at a time. The most familiar FAQ pattern.
export default function FaqA() {
  const [open, setOpen] = useState<string | null>(faqs[0].id);
  return (
    <section className="bg-white py-24 dark:bg-[#070B14]">
      <FaqSchema />
      <div className="mx-auto max-w-3xl px-6">
        <div className="text-center">
          <span className="text-sm font-semibold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">FAQ</span>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-5xl dark:text-white">Questions? Answered.</h2>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">Everything you need to know before your first order.</p>
        </div>
        <div className="mt-12 border-t border-slate-200 dark:border-white/10">
          {faqs.slice(0, 8).map((f) => (
            <Item key={f.id} id={`faq-a-${f.id}`} q={f.q} a={f.a} open={open === f.id} onToggle={() => setOpen(open === f.id ? null : f.id)} />
          ))}
        </div>
        <p className="mt-10 text-center text-sm text-slate-500 dark:text-slate-400">
          Can't find your answer? <Link href="/contact-us" className="font-semibold text-indigo-600 underline-offset-4 hover:underline dark:text-indigo-400">Talk to support</Link>, we reply 24/7.
        </p>
      </div>
    </section>
  );
}
