"use client";

import { useId, useState, type CSSProperties, type KeyboardEvent } from "react";
import { HelpCircle, Mail, MessageSquare, Plus, Truck } from "lucide-react";
import type { SubProduct } from "@/content/subs-en";
import { supportEmail } from "@/content/footer-en";
import { useT } from "@/i18n/client";
import { Comments, type LiveComments } from "../service/ServiceExtras";
import { useServiceExtras } from "../subs/live";
import { ring } from "../googleVoice/clean";
import fq from "../service/faq.module.css";
import { HowDelivered } from "./parts";

// The product page's tabbed box: short details (how it's delivered), FAQ and testimonials (the page's comments, with
// the form). These replace the shared FAQ and comments sections lower on the page (ServiceExtras `omit`).
// All three panels stay in the HTML (inactive ones `hidden`), so search engines still read the FAQ and comments.
// Keyboard: arrow keys move between tabs (following the page direction), Home / End jump to the ends.
export function ProductTabs({ p, live }: { p: SubProduct; live?: LiveComments }) {
  const tx = useT();
  const service = `subs:${p.slug}`;
  const s = useServiceExtras(service);
  const count = live ? live.list.length : s.comments.length;
  const base = useId();
  const [on, setOn] = useState(0);
  const tabs = [
    { label: tx("Short details"), Icon: Truck },
    { label: tx("FAQ"), Icon: HelpCircle },
    { label: tx("Testimonials"), Icon: MessageSquare, badge: count },
  ];
  const go = (i: number) => { setOn(i); document.getElementById(`${base}-t${i}`)?.focus(); };
  const onKey = (e: KeyboardEvent, i: number) => {
    const rtl = getComputedStyle(e.currentTarget).direction === "rtl";
    const next = { ArrowRight: rtl ? -1 : 1, ArrowLeft: rtl ? 1 : -1 }[e.key];
    if (next) { e.preventDefault(); go((i + next + tabs.length) % tabs.length); }
    else if (e.key === "Home") { e.preventDefault(); go(0); }
    else if (e.key === "End") { e.preventDefault(); go(tabs.length - 1); }
  };
  return (
    <section aria-label={p.name} className={`relative z-10 ${fq.faq}`} style={{ "--tone": "#7c3aed", "--tone-d": "#c4b5fd" } as CSSProperties}>
      {/* Underline tabs (option A, /design preview): plain labels over a hairline, with a violet line under the active
          tab that slides across (logical inset, so it follows the page direction; still under reduced motion). */}
      <div role="tablist" aria-label={tx("{0} details", { 0: p.name })} className="relative flex border-b border-slate-200 dark:border-white/10">
        {tabs.map(({ label, Icon, badge }, i) => (
          <button key={i} type="button" role="tab" id={`${base}-t${i}`} aria-selected={on === i} aria-controls={`${base}-p${i}`} tabIndex={on === i ? 0 : -1}
            onClick={() => setOn(i)} onKeyDown={(e) => onKey(e, i)}
            className={`flex min-w-0 flex-1 items-center justify-center gap-1.5 rounded-t-lg px-1 pb-3.5 pt-2 text-sm font-semibold transition-colors sm:gap-2 sm:px-2 sm:text-[15px] ${ring} ${on === i ? "text-slate-900 dark:text-white" : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"}`}>
            <Icon aria-hidden className={`hidden h-4 w-4 shrink-0 transition-colors sm:block ${on === i ? "text-violet-700 dark:text-violet-300" : ""}`} />
            <span className="truncate">{label}</span>
            {badge ? <span className={`rounded-full px-1.5 text-xs tabular-nums ${on === i ? "bg-violet-100 text-violet-800 dark:bg-violet-500/25 dark:text-violet-200" : "bg-slate-100 text-slate-600 dark:bg-white/10 dark:text-slate-300"}`}>{tx.locale === "fa" ? badge.toLocaleString("fa-IR") : badge}</span> : null}
          </button>
        ))}
        <span aria-hidden className="absolute -bottom-px h-0.5 rounded-full bg-violet-600 transition-[inset-inline-start] duration-300 ease-[cubic-bezier(.2,.8,.2,1)] motion-reduce:transition-none dark:bg-violet-400"
          style={{ width: `${100 / tabs.length}%`, insetInlineStart: `${(on * 100) / tabs.length}%` }} />
      </div>

      <div role="tabpanel" id={`${base}-p0`} aria-labelledby={`${base}-t0`} hidden={on !== 0} className="mt-6">
        <HowDelivered p={p} />
      </div>

      <div role="tabpanel" id={`${base}-p1`} aria-labelledby={`${base}-t1`} hidden={on !== 1} className="mt-6 space-y-3">
        {s.faq.map((f, i) => (
          <details key={f.q} name={`${base}-faq`} open={i === 0}
            className={`${fq.item} rounded-2xl border border-slate-200 bg-white dark:border-white/10 dark:bg-[#0E1424] [&_summary::-webkit-details-marker]:hidden`}>
            <summary className={`flex cursor-pointer list-none items-center justify-between gap-4 rounded-2xl px-5 py-4 text-base font-semibold leading-7 text-slate-900 dark:text-white ${ring}`}>
              <span>{f.q}</span>
              <span aria-hidden className={`${fq.icon} grid h-8 w-8 shrink-0 place-items-center rounded-full bg-slate-100 text-slate-600 dark:bg-white/10 dark:text-slate-300`}><Plus className="h-4 w-4" /></span>
            </summary>
            <div className={fq.answer}><p className="max-w-[65ch] px-5 pb-5 text-[15px] leading-7 text-slate-700 dark:text-slate-300">{f.a}</p></div>
          </details>
        ))}
        <p className="flex flex-wrap items-center gap-x-3 gap-y-1 pt-2 text-[15px] text-slate-600 dark:text-slate-400">
          {tx("Still have a question?")}
          <a href={`mailto:${supportEmail}`} className={`inline-flex items-center gap-1.5 rounded font-semibold text-[var(--t)] hover:underline ${ring}`}><Mail aria-hidden className="h-4 w-4" /><span dir="ltr">{supportEmail}</span></a>
        </p>
      </div>

      <div role="tabpanel" id={`${base}-p2`} aria-labelledby={`${base}-t2`} hidden={on !== 2} className="mt-6">
        <Comments service={service} live={live} embedded />
      </div>
    </section>
  );
}
