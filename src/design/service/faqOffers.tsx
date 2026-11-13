"use client";

import { useId, useMemo, useState, type CSSProperties } from "react";
import { ChevronDown, Headset, Mail, MessageCircle, Plus, Search, X } from "lucide-react";
import { supportEmail } from "@/content/footer-en";
import { useServiceExtras } from "../subs/live";
import { ring } from "../googleVoice/clean";
import { useT } from "@/i18n/client";
import { useGlow } from "./slot";
import type { GlowTone } from "./HeaderGlow";
import fq from "./faq.module.css";

// Five more designs for the service pages' FAQ (ServiceExtras › ServiceFaq), compared at /design/service-faq.
// Same data, same rules as the current one: every answer stays in the HTML (native <details> or always-visible text),
// the page's own colour as the accent (its header glow; brand indigo where there is none), and a way to reach support.
// Text is translated through `tx`, so each works in Persian (RTL) and English.

const wrap = "mx-auto max-w-6xl px-4 sm:px-6";
const kicker = "text-sm font-semibold uppercase tracking-widest text-[var(--t)]";
const h2 = "mt-2 font-display text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-white";
const faqTone: Record<GlowTone, [string, string]> = {
  violet: ["#7c3aed", "#c4b5fd"], emerald: ["#059669", "#6ee7b7"], amber: ["#d97706", "#fcd34d"], sky: ["#0284c7", "#7dd3fc"], rose: ["#db2777", "#f9a8d4"],
};

function useFaq(service: string) {
  const tx = useT();
  const s = useServiceExtras(service);
  const glow = useGlow();
  const [tone, toneDark] = glow ? faqTone[glow] : ["#4f46e5", "#a5b4fc"];
  const style = { "--tone": tone, "--tone-d": toneDark } as CSSProperties;
  return { tx, s, style };
}

function Head({ tx, name, center = false, id }: { tx: ReturnType<typeof useT>; name: string; center?: boolean; id: string }) {
  return (
    <div className={center ? "mx-auto max-w-2xl text-center" : ""}>
      <p className={kicker}>{tx("FAQ")}</p>
      <h2 id={id} className={h2}>{tx("{0} questions", { 0: name })}</h2>
      <p className={`mt-3 text-pretty text-[15px] leading-7 text-slate-600 dark:text-slate-400 ${center ? "mx-auto max-w-xl" : "max-w-sm"}`}>{tx("Short answers to what buyers ask most about {0}.", { 0: name })}</p>
    </div>
  );
}

function MailLink({ className = "" }: { className?: string }) {
  return (
    <a href={`mailto:${supportEmail}`} className={`inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-colors ${ring} ${className}`}>
      <Mail aria-hidden className="h-4 w-4 shrink-0" /><span dir="ltr" className="truncate">{supportEmail}</span>
    </a>
  );
}

// ---------- A · Answer Grid ----------
// No clicking: every question and answer is on show, as numbered cards in two columns. A slim support strip closes it.
export function FaqA({ service }: { service: string }) {
  const { tx, s, style } = useFaq(service);
  return (
    <section aria-labelledby="faq-a" className={`${wrap} ${fq.faq}`} style={style}>
      <Head tx={tx} name={s.name} id="faq-a" />
      <dl className="mt-10 grid gap-4 md:grid-cols-2">
        {s.faq.map((f, i) => (
          <div key={f.q} className="group rounded-2xl border border-slate-200 bg-white p-6 transition-colors hover:border-[color-mix(in_srgb,var(--t)_40%,transparent)] dark:border-white/10 dark:bg-[#0E1424]">
            <span aria-hidden className={`${fq.tile} inline-grid h-8 min-w-8 place-items-center rounded-lg px-2 font-display text-sm font-bold tabular-nums`}>{String(i + 1).padStart(2, "0")}</span>
            <dt className="mt-4 font-display text-lg font-semibold leading-7 text-slate-900 dark:text-white">{f.q}</dt>
            <dd className="mt-2 text-[15px] leading-7 text-slate-600 dark:text-slate-400">{f.a}</dd>
          </div>
        ))}
      </dl>
      <div className="mt-6 flex flex-col items-start gap-4 rounded-2xl bg-[color-mix(in_srgb,var(--t)_8%,transparent)] p-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p className="flex items-center gap-3 font-semibold text-slate-900 dark:text-white"><MessageCircle aria-hidden className="h-5 w-5 text-[var(--t)]" />{tx("Still have a question?")}<span className="hidden font-normal text-slate-600 sm:inline dark:text-slate-400">{tx("Write to our support team; we reply around the clock.")}</span></p>
        <MailLink className="bg-white px-4 py-2.5 text-sm text-slate-900 ring-1 ring-slate-200 hover:bg-slate-50 dark:bg-white/10 dark:text-white dark:ring-white/15" />
      </div>
    </section>
  );
}

// ---------- B · Search & List ----------
// Centred heading with a search box that narrows the questions as you type; a clean ruled list with chevrons below,
// no boxes. Support sits on the last line.
export function FaqB({ service }: { service: string }) {
  const { tx, s, style } = useFaq(service);
  const [q, setQ] = useState("");
  const id = useId();
  const list = useMemo(() => {
    const k = q.trim().toLowerCase();
    return k ? s.faq.filter((f) => (f.q + " " + f.a).toLowerCase().includes(k)) : s.faq;
  }, [q, s.faq]);
  return (
    <section aria-labelledby="faq-b" className={`${wrap} ${fq.faq}`} style={style}>
      <Head tx={tx} name={s.name} id="faq-b" center />
      <div className="mx-auto mt-8 max-w-3xl">
        <label htmlFor={id} className="sr-only">{tx("Search")}</label>
        <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 shadow-sm focus-within:border-[var(--t)] dark:border-white/10 dark:bg-[#0E1424]">
          <Search aria-hidden className="h-5 w-5 text-slate-400" />
          <input id={id} type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder={tx("Search")} className="h-14 w-full bg-transparent text-base text-slate-900 outline-none placeholder:text-slate-400 dark:text-white" />
          {q && <button type="button" onClick={() => setQ("")} aria-label={tx("Clear search")} className={`grid h-8 w-8 place-items-center rounded-full text-slate-500 hover:bg-slate-100 dark:hover:bg-white/10 ${ring}`}><X className="h-4 w-4" /></button>}
        </div>
        <div className="mt-6 divide-y divide-slate-200 border-y border-slate-200 dark:divide-white/10 dark:border-white/10">
          {list.map((f, i) => (
            <details key={f.q} name={`faq-b-${service}`} open={i === 0 && !q} className={`${fq.item} group rounded-xl [&_summary::-webkit-details-marker]:hidden`}>
              <summary className={`flex cursor-pointer list-none items-center justify-between gap-4 rounded-xl px-4 py-5 text-base font-semibold leading-7 text-slate-900 sm:text-[17px] dark:text-white ${ring}`}>
                <span className="transition-colors group-open:text-[var(--t)]">{f.q}</span>
                <ChevronDown aria-hidden className="h-5 w-5 shrink-0 text-slate-400 transition-transform duration-300 group-open:rotate-180 group-open:text-[var(--t)]" />
              </summary>
              <div className={fq.answer}><p className="max-w-[65ch] px-4 pb-6 text-[15px] leading-7 text-slate-600 dark:text-slate-400">{f.a}</p></div>
            </details>
          ))}
          {list.length === 0 && <p role="status" className="py-8 text-center text-slate-600 dark:text-slate-400">{tx("Nothing matches “")}{q}”.</p>}
        </div>
        <p className="mt-6 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-[15px] text-slate-600 dark:text-slate-400">
          {tx("Still have a question?")}<MailLink className="text-[var(--t)] underline-offset-4 hover:underline" />
        </p>
      </div>
    </section>
  );
}

// ---------- C · Index & Answer ----------
// Wide screens: the questions as a numbered index on one side, the chosen answer large on the other with support under
// it. Phones get the same questions as an accordion. Both are in the HTML; the panel is a tab panel for screen readers.
export function FaqC({ service }: { service: string }) {
  const { tx, s, style } = useFaq(service);
  const [on, setOn] = useState(0);
  const base = useId();
  const cur = s.faq[on] ?? s.faq[0];
  return (
    <section aria-labelledby="faq-c" className={`${wrap} ${fq.faq}`} style={style}>
      <Head tx={tx} name={s.name} id="faq-c" />
      <div className="mt-10 hidden gap-6 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)]">
        <div role="tablist" aria-orientation="vertical" aria-label={tx("FAQ")} className="space-y-1">
          {s.faq.map((f, i) => (
            <button key={f.q} role="tab" id={`${base}-t${i}`} aria-selected={i === on} aria-controls={`${base}-p`} onClick={() => setOn(i)}
              onKeyDown={(e) => { if (e.key === "ArrowDown" || e.key === "ArrowUp") { e.preventDefault(); const n = (i + (e.key === "ArrowDown" ? 1 : -1) + s.faq.length) % s.faq.length; setOn(n); document.getElementById(`${base}-t${n}`)?.focus(); } }}
              tabIndex={i === on ? 0 : -1}
              className={`flex w-full items-start gap-4 rounded-2xl px-4 py-4 text-start transition-colors ${ring} ${i === on ? "bg-white shadow-sm ring-1 ring-[color-mix(in_srgb,var(--t)_35%,transparent)] dark:bg-[#0E1424]" : "hover:bg-white/60 dark:hover:bg-white/5"}`}>
              <span className={`mt-0.5 font-display text-sm font-bold tabular-nums ${i === on ? "text-[var(--t)]" : "text-slate-400"}`}>{String(i + 1).padStart(2, "0")}</span>
              <span className={`font-semibold leading-7 ${i === on ? "text-slate-900 dark:text-white" : "text-slate-600 dark:text-slate-400"}`}>{f.q}</span>
            </button>
          ))}
        </div>
        <div role="tabpanel" id={`${base}-p`} aria-labelledby={`${base}-t${on}`} className="flex flex-col rounded-3xl border border-slate-200 bg-white p-8 dark:border-white/10 dark:bg-[#0E1424]">
          <div key={on} className="animate-fade-up [animation-duration:300ms]">
            <p className="font-display text-sm font-bold tabular-nums text-[var(--t)]">{String(on + 1).padStart(2, "0")} / {String(s.faq.length).padStart(2, "0")}</p>
            <h3 className="mt-3 font-display text-2xl font-bold leading-snug text-slate-900 dark:text-white">{cur.q}</h3>
            <p className="mt-4 text-[17px] leading-8 text-slate-700 dark:text-slate-300">{cur.a}</p>
          </div>
          <div className="mt-auto flex flex-wrap items-center gap-3 border-t border-slate-200 pt-6 text-[15px] text-slate-600 dark:border-white/10 dark:text-slate-400">
            <span className={`${fq.tile} grid h-9 w-9 place-items-center rounded-xl`}><Headset aria-hidden className="h-4 w-4" /></span>
            {tx("Still have a question?")}<MailLink className="ms-auto text-sm text-[var(--t)] hover:underline" />
          </div>
        </div>
      </div>
      {/* Phones: the same questions as an accordion. */}
      <div className="mt-8 space-y-3 lg:hidden">
        {s.faq.map((f, i) => (
          <details key={f.q} name={`faq-c-${service}`} open={i === 0} className={`${fq.item} rounded-2xl border border-slate-200 bg-white dark:border-white/10 dark:bg-[#0E1424] [&_summary::-webkit-details-marker]:hidden`}>
            <summary className={`flex cursor-pointer list-none items-start gap-3 rounded-2xl px-5 py-4 font-semibold leading-7 text-slate-900 dark:text-white ${ring}`}>
              <span className="font-display text-sm font-bold tabular-nums text-[var(--t)]">{String(i + 1).padStart(2, "0")}</span><span>{f.q}</span>
            </summary>
            <div className={fq.answer}><p className="px-5 pb-5 text-[15px] leading-7 text-slate-700 dark:text-slate-300">{f.a}</p></div>
          </details>
        ))}
        <MailLink className="w-full border border-slate-200 px-4 py-3 text-[15px] text-slate-900 dark:border-white/15 dark:text-white" />
      </div>
    </section>
  );
}

// ---------- D · Support Chat ----------
// The FAQ as a conversation: each question is a bubble from the buyer; open it and the support team's answer appears
// under it, as their reply. It ends in a "write to us" bubble.
export function FaqD({ service }: { service: string }) {
  const { tx, s, style } = useFaq(service);
  return (
    <section aria-labelledby="faq-d" className={`${wrap} ${fq.faq}`} style={style}>
      <div className="mx-auto max-w-3xl">
        <Head tx={tx} name={s.name} id="faq-d" center />
        <div className="mt-10 space-y-4 rounded-[2rem] border border-slate-200 bg-slate-50/80 p-4 sm:p-6 dark:border-white/10 dark:bg-white/[.03]">
          {s.faq.map((f, i) => (
            <details key={f.q} name={`faq-d-${service}`} open={i === 0} className={`${fq.item} group [&_summary::-webkit-details-marker]:hidden`}>
              <summary className={`ms-auto flex w-fit max-w-[90%] cursor-pointer list-none items-center gap-3 rounded-3xl rounded-ee-md bg-[var(--t)] px-5 py-3 text-[15px] font-semibold leading-7 text-white shadow-sm transition-opacity hover:opacity-90 sm:text-base dark:text-[#0B1020] ${ring}`}>
                <span>{f.q}</span>
                <Plus aria-hidden className="h-4 w-4 shrink-0 transition-transform duration-300 group-open:rotate-45" />
              </summary>
              <div className={fq.answer}>
                <div className="mt-3 flex max-w-[90%] items-end gap-2.5">
                  <span aria-hidden className={`${fq.tile} grid h-8 w-8 shrink-0 place-items-center rounded-full`}><Headset className="h-4 w-4" /></span>
                  <p className="rounded-3xl rounded-es-md bg-white px-5 py-3 text-[15px] leading-7 text-slate-700 shadow-sm ring-1 ring-slate-200 dark:bg-[#0E1424] dark:text-slate-300 dark:ring-white/10">{f.a}</p>
                </div>
              </div>
            </details>
          ))}
          <div className="flex items-end gap-2.5 pt-2">
            <span aria-hidden className={`${fq.tile} grid h-8 w-8 shrink-0 place-items-center rounded-full`}><Headset className="h-4 w-4" /></span>
            <div className="rounded-3xl rounded-es-md bg-white px-5 py-4 shadow-sm ring-1 ring-slate-200 dark:bg-[#0E1424] dark:ring-white/10">
              <p className="font-semibold text-slate-900 dark:text-white">{tx("Still have a question?")}</p>
              <p className="mt-1 text-[15px] leading-7 text-slate-600 dark:text-slate-400">{tx("Write to our support team; we reply around the clock.")}</p>
              <MailLink className="mt-3 text-sm text-[var(--t)] hover:underline" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ---------- E · Two Columns & Band ----------
// Centred heading, the questions split into two accordion columns (shorter page on wide screens), then a full-width
// band in the page colour with the support email as a button.
export function FaqE({ service }: { service: string }) {
  const { tx, s, style } = useFaq(service);
  const half = Math.ceil(s.faq.length / 2);
  const cols = [s.faq.slice(0, half), s.faq.slice(half)];
  return (
    <section aria-labelledby="faq-e" className={`${wrap} ${fq.faq}`} style={style}>
      <Head tx={tx} name={s.name} id="faq-e" center />
      <div className="mt-10 grid gap-3 md:grid-cols-2 md:gap-5">
        {cols.map((col, c) => (
          <div key={c} className="space-y-3">
            {col.map((f, i) => (
              <details key={f.q} name={`faq-e-${service}`} open={c === 0 && i === 0} className={`${fq.item} rounded-2xl border border-slate-200 bg-white dark:border-white/10 dark:bg-[#0E1424] [&_summary::-webkit-details-marker]:hidden`}>
                <summary className={`flex cursor-pointer list-none items-center justify-between gap-4 rounded-2xl px-5 py-4 font-semibold leading-7 text-slate-900 dark:text-white ${ring}`}>
                  <span>{f.q}</span>
                  <span aria-hidden className={`${fq.icon} grid h-7 w-7 shrink-0 place-items-center rounded-full bg-slate-100 text-slate-600 dark:bg-white/10 dark:text-slate-300`}><Plus className="h-3.5 w-3.5" /></span>
                </summary>
                <div className={fq.answer}><p className="px-5 pb-5 text-[15px] leading-7 text-slate-700 dark:text-slate-300">{f.a}</p></div>
              </details>
            ))}
          </div>
        ))}
      </div>
      <div className="relative mt-10 overflow-hidden rounded-3xl bg-[var(--t)] px-6 py-8 text-white sm:px-10 dark:text-[#0B1020]">
        <div aria-hidden className="absolute -end-10 -top-16 h-48 w-48 rounded-full bg-white/15 blur-2xl" />
        <div className="relative flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-display text-xl font-bold">{tx("Still have a question?")}</p>
            <p className="mt-1 text-[15px] leading-7 opacity-90">{tx("Write to our support team; we reply around the clock.")}</p>
          </div>
          <MailLink className="bg-white px-5 py-3 text-[15px] text-slate-900 shadow-sm hover:bg-white/90 focus-visible:ring-white" />
        </div>
      </div>
    </section>
  );
}

export const faqOffers = [
  { id: "A", name: "Answer Grid", note: "Every answer on show as numbered cards in two columns, no clicking; slim support strip.", C: FaqA },
  { id: "B", name: "Search & List", note: "Centred, a search box that narrows the questions, a clean ruled list with chevrons.", C: FaqB },
  { id: "C", name: "Index & Answer", note: "Questions as a numbered index beside a large answer panel with support under it (accordion on phones).", C: FaqC },
  { id: "D", name: "Support Chat", note: "Questions as buyer bubbles; open one and support's reply appears under it.", C: FaqD },
  { id: "E", name: "Two Columns & Band", note: "Questions in two accordion columns, then a full-width band in the page colour for support.", C: FaqE },
] as const;
