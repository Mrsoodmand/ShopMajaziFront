"use client";
import { useEffect, useState, type ReactNode } from "react";
import { Check, ChevronDown, X } from "lucide-react";
import { useMoney } from "@/lib/money";
import { AdContentFields, AdsNightPage, AudienceFields, CpmBudgetFields, focusRing, ghostBtn, muted, panel, PlacementCards, ScheduleFields, useAdForm, type Ad, type ErrKey } from "./adsKit";

// Ads K — "Ad Checklist": the whole form is one panel of four rows, one open at a time. A closed row shows its
// answer in one line and a tick once it's complete, or an X and the problem after Continue. "Next" moves on;
// Continue with problems opens the first bad row and puts focus on the field. Preview, summary and green Continue
// in the sidebar.

type Sec = "where" | "ad" | "budget" | "when";
const order: Sec[] = ["where", "ad", "budget", "when"];
const keysOf: Record<Sec, ErrKey[]> = { where: ["target"], ad: ["text", "url", "media"], budget: ["cpm", "budget", "daily"], when: ["start"] };
const secOf = (k: ErrKey) => order.find((s) => keysOf[s].includes(k))!;

function Row({ a, sec, title, summary, open, visited, onToggle, onNext, children }: {
  a: Ad; sec: Sec; title: string; summary: ReactNode; open: boolean; visited: boolean; onToggle: () => void; onNext?: () => void; children: ReactNode;
}) {
  const bad = keysOf[sec].filter((k) => a.all[k]);
  const shownBad = a.submitted ? bad : [];
  const done = !bad.length && (visited || a.submitted > 0);
  const i = order.indexOf(sec) + 1;
  return (
    <li className="border-b border-white/10 last:border-0">
      <h3>
        <button type="button" id={`${a.p}-${sec}-btn`} aria-expanded={open} aria-controls={`${a.p}-${sec}-body`} onClick={onToggle}
          className={`flex w-full items-center gap-4 px-5 py-5 text-start sm:px-7 ${focusRing} rounded-3xl`}>
          <span aria-hidden className={`grid h-9 w-9 shrink-0 place-items-center rounded-full border-2 font-display font-bold tabular-nums transition-colors ${shownBad.length ? "border-red-300 text-red-300" : done ? "border-sky-400 bg-sky-400 text-[#0a1930]" : open ? "border-sky-400 text-sky-300" : "border-white/30 text-white/70"}`}>
            {shownBad.length ? <X className="h-4 w-4" strokeWidth={3} /> : done ? <Check key="done" className="h-4 w-4 animate-pop" strokeWidth={3} /> : i}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block font-display text-lg font-semibold text-white">{title}</span>
            {!open && <span className={`block truncate text-sm ${shownBad.length ? "font-semibold text-red-300" : muted}`}>{shownBad.length ? a.all[shownBad[0]] : summary}</span>}
          </span>
          <span className="sr-only">{shownBad.length ? ", needs attention" : done ? ", complete" : ""}</span>
          <ChevronDown aria-hidden className={`h-5 w-5 shrink-0 text-sky-100/70 transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
        </button>
      </h3>
      <div id={`${a.p}-${sec}-body`} role="region" aria-labelledby={`${a.p}-${sec}-btn`} hidden={!open} className="space-y-6 px-5 pb-7 sm:px-7">
        {children}
        {onNext && <div className="flex justify-end"><button type="button" onClick={onNext} className={ghostBtn}>Next</button></div>}
      </div>
    </li>
  );
}

export default function AdsK() {
  const usd = useMoney().format;
  const a = useAdForm();
  const [open, setOpen] = useState<Sec | null>("where");
  const [visited, setVisited] = useState<Set<Sec>>(new Set());
  const leave = (s: Sec) => setVisited((v) => new Set(v).add(s));
  const toggle = (s: Sec) => { if (open) leave(open); setOpen(open === s ? null : s); };
  const next = (s: Sec) => { leave(s); const n = order[order.indexOf(s) + 1]; setOpen(n ?? null); requestAnimationFrame(() => document.getElementById(`${a.p}-${n}-btn`)?.focus()); };

  // Continue with problems: open the first bad row (in page order) and, once it's open, focus its field.
  const [focusKey, setFocusKey] = useState<ErrKey | null>(null);
  useEffect(() => {
    if (!a.submitted || !a.errList.length) return;
    const k = order.flatMap((s) => keysOf[s]).find((x) => a.all[x])!;
    setOpen(secOf(k)); setFocusKey(k);
  }, [a.submitted]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!focusKey) return;
    document.getElementById(a.ids[focusKey])?.focus();
    setFocusKey(null);
  }, [focusKey, open]); // eslint-disable-line react-hooks/exhaustive-deps

  const adSummary = a.text.trim() ? `“${a.text.trim().slice(0, 60)}${a.text.trim().length > 60 ? "…" : ""}”` : "Text, link, picture";
  const rows: { sec: Sec; title: string; summary: ReactNode; body: ReactNode }[] = [
    { sec: "where", title: "Where to show it", summary: `${a.placement.label}${a.reach ? ` · ${a.reach}` : ""}`, body: <><PlacementCards ad={a} /><AudienceFields ad={a} /></> },
    { sec: "ad", title: "Your ad", summary: adSummary, body: <AdContentFields ad={a} /> },
    { sec: "budget", title: "Budget", summary: `${usd(a.budget || 0)} at ${usd(a.cpm || 0)} CPM${a.dailyOn && a.daily ? ` · ${usd(a.daily)} a day` : ""}`, body: <CpmBudgetFields ad={a} /> },
    { sec: "when", title: "Schedule", summary: `${a.perUser} view${a.perUser > 1 ? "s" : ""} a day per person · ${a.startsLabel}`, body: <ScheduleFields ad={a} /> },
  ];

  return (
    <AdsNightPage ad={a} left={
      <section aria-label="Your ad, step by step" className={panel}>
        <ol>
          {rows.map((r, i) => (
            <Row key={r.sec} a={a} sec={r.sec} title={r.title} summary={r.summary} open={open === r.sec} visited={visited.has(r.sec)} onToggle={() => toggle(r.sec)} onNext={i < rows.length - 1 ? () => next(r.sec) : undefined}>{r.body}</Row>
          ))}
        </ol>
      </section>
    } />
  );
}
