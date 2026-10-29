"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { Smartphone, Apple, Sparkles, Send, Users, type LucideIcon } from "lucide-react";
import { ratingSummary, reviews, svcLabels, type Review } from "@/content/reviews-en";
import { ReviewCard, Stars } from "./parts";
import { useT } from "@/i18n/client";

// Offer D — "Score + Filter": the overall score with a star breakdown on the left; on the right, reviews filtered by
// service with the same tab bar as How to buy E (icons, sliding highlight).
export default function TestiD() {
  const tx = useT();
  const icons: Record<Review["svc"], LucideIcon> = { numbers: Smartphone, apple: Apple, subs: Sparkles, telegram: Send, social: Users };
  const tabs = (Object.keys(tx.tr(svcLabels)) as Review["svc"][]).map((id) => ({ id, label: tx.tr(svcLabels)[id] }));
  const [svc, setSvc] = useState<Review["svc"]>(tabs[0].id);

  // Highlight that slides behind the active tab.
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const [pill, setPill] = useState({ left: 0, width: 0 });
  useLayoutEffect(() => {
    const measure = () => { const b = tabRefs.current[svc]; if (b) setPill({ left: b.offsetLeft, width: b.offsetWidth }); };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [svc]);
  const shown = tx.tr(reviews).filter((r) => r.svc === svc).slice(0, 4);

  return (
    <section className="bg-[#F6F5F1] py-24 dark:bg-[#070B14]">
      <div className="mx-auto grid max-w-6xl grid-cols-[minmax(0,1fr)] gap-12 px-6 lg:grid-cols-[340px_minmax(0,1fr)]">
        <div className="lg:sticky lg:top-24 lg:self-start">
          <span className="text-sm font-semibold uppercase tracking-widest text-violet-600 dark:text-violet-400">{tx("Reviews")}</span>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-white">{tx("What buyers say")}</h2>
          <div className="mt-8 rounded-3xl bg-white p-6 ring-1 ring-slate-200 dark:bg-[#0E1424] dark:ring-white/10">
            <div className="flex items-end gap-3">
              <span className="font-display text-6xl font-bold leading-none text-slate-900 dark:text-white">{tx.tr(ratingSummary).average}</span>
              <div className="pb-1"><Stars n={tx.tr(ratingSummary).average} /><div className="mt-1 text-xs text-slate-500 dark:text-slate-400">{tx.tr(ratingSummary).total.toLocaleString("en-US")}{" "}{tx("reviews")}</div></div>
            </div>
            <ul className="mt-6 space-y-2">
              {tx.tr(ratingSummary).breakdown.map((pct, i) => (
                <li key={i} className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                  <span className="w-3">{5 - i}</span>
                  <span className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100 dark:bg-white/10"><span className="block h-full rounded-full bg-amber-400" style={{ width: `${pct}%` }} /></span>
                  <span className="w-9 text-end">{pct}%</span>
                </li>
              ))}
            </ul>
            {/* A "Write a review" button (to /reviews/new) goes here once there is a review form. */}
          </div>
        </div>

        <div>
          <div className="relative flex gap-1 overflow-x-auto rounded-2xl bg-white p-1 shadow-sm ring-1 ring-slate-200 [scrollbar-width:none] dark:bg-white/5 dark:ring-white/10">
            <span aria-hidden className="absolute inset-y-1 rounded-xl bg-slate-900 shadow-md transition-all duration-500 ease-[cubic-bezier(.3,1.3,.5,1)] dark:bg-white" style={{ left: pill.left, width: pill.width }} />
            {tabs.map((t) => {
              const Icon = icons[t.id];
              return (
                <button key={t.id} ref={(el) => { tabRefs.current[t.id] = el; }} onClick={() => setSvc(t.id)} aria-pressed={svc === t.id}
                  className={`relative z-10 flex shrink-0 flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-medium transition-colors duration-300 ${svc === t.id ? "text-white dark:text-slate-900" : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"}`}>
                  <Icon className="h-4 w-4" />{t.label}
                </button>
              );
            })}
          </div>
          <div key={svc} className="mt-6 grid animate-fade-up gap-4 [animation-duration:350ms] sm:grid-cols-2">
            {shown.map((r) => <ReviewCard key={r.id} r={r} />)}
          </div>
        </div>
      </div>
    </section>
  );
}
