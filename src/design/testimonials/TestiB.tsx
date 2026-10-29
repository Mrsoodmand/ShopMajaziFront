"use client";

import { useEffect, useState } from "react";
import { BadgeCheck, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { reviews } from "@/content/reviews-en";
import { Avatar, Stars } from "./parts";

const AUTO_MS = 6000;

// Offer B — "Spotlight": one big quote at a time, centered, with the reviewer below. Moves on by itself every
// few seconds (pauses on hover), with arrows and dots to jump around.
export default function TestiB() {
  const list = reviews.slice(0, 6);
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setTimeout(() => setI((n) => (n + 1) % list.length), AUTO_MS);
    return () => clearTimeout(t);
  }, [i, paused, list.length]);
  const r = list[i];
  const go = (d: number) => setI((n) => (n + d + list.length) % list.length);
  const arrow = "grid h-11 w-11 place-items-center rounded-full ring-1 ring-slate-300 text-slate-700 transition hover:bg-slate-900 hover:text-white hover:ring-slate-900 dark:ring-white/15 dark:text-slate-200 dark:hover:bg-white dark:hover:text-slate-900";

  return (
    <section className="relative overflow-hidden bg-white py-24 dark:bg-[#070B14]" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <div aria-hidden className="pointer-events-none absolute start-1/2 top-10 h-80 w-[600px] -translate-x-1/2 rounded-full bg-indigo-300/30 blur-[120px] dark:bg-indigo-600/20" />
      <div className="relative mx-auto max-w-4xl px-6 text-center">
        <span className="text-sm font-semibold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">Reviews</span>
        <Quote className="mx-auto mt-8 h-12 w-12 text-indigo-200 dark:text-indigo-500/40" />
        <figure key={r.id} className="animate-fade-up [animation-duration:500ms]" aria-live="polite">
          <blockquote className="mt-6 font-display text-2xl font-semibold leading-snug text-slate-900 sm:text-4xl dark:text-white">“{r.text}”</blockquote>
          <figcaption className="mt-10 flex flex-col items-center gap-3">
            <Avatar r={r} size="lg" />
            <div className="flex items-center gap-1 font-semibold text-slate-900 dark:text-white">{r.name}<BadgeCheck className="h-4 w-4 text-sky-500" aria-label="Verified buyer" /></div>
            <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400"><Stars n={r.rating} /><span>{r.service}</span></div>
          </figcaption>
        </figure>

        <div className="mt-12 flex items-center justify-center gap-6">
          <button onClick={() => go(-1)} aria-label="Previous review" className={arrow}><ChevronLeft className="h-5 w-5 rtl:rotate-180" /></button>
          <div className="flex gap-2">
            {list.map((x, n) => (
              <button key={x.id} onClick={() => setI(n)} aria-label={`Review ${n + 1}`} aria-current={n === i}
                className={`h-2 rounded-full transition-all duration-500 ${n === i ? "w-8 bg-indigo-600 dark:bg-indigo-400" : "w-2 bg-slate-300 hover:bg-slate-400 dark:bg-white/20"}`} />
            ))}
          </div>
          <button onClick={() => go(1)} aria-label="Next review" className={arrow}><ChevronRight className="h-5 w-5 rtl:rotate-180" /></button>
        </div>
      </div>
    </section>
  );
}
