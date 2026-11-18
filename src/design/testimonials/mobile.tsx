"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { ChevronLeft, ChevronRight, Pause, Play, Quote } from "lucide-react";
import { reviews } from "@/content/reviews-en";
import { useLiveTestimonials, type LiveTestimonial } from "./live";
import { useSwipeRow } from "@/components/ui/useSwipeRow";
import SwipeDots from "@/components/ui/SwipeDots";
import { useT } from "@/i18n/client";

// Offers F–J: testimonials drawn for phones first (the live section, offer D, is a long stack of cards there).
// Every offer shows only what a real comment has: the name, the words, the date and what it was about. No stars,
// score or "verified" badge, since the live comments carry none. Without the live provider (the /design gallery)
// they show the placeholder reviews in the same shape.

type Item = LiveTestimonial;

function useItems(): Item[] {
  const live = useLiveTestimonials();
  const tx = useT();
  if (live) return live;
  return tx.tr(reviews).map((r) => ({ id: r.id, name: r.name, text: r.text, date: r.date, about: r.service }));
}

const tints = ["bg-slate-700", "bg-emerald-600", "bg-amber-500", "bg-sky-600", "bg-rose-500"];
const tintOf = (id: string) => tints[[...id].reduce((a, c) => a + c.charCodeAt(0), 0) % tints.length];

function Avatar({ it, size = "md", ring }: { it: Item; size?: "sm" | "md" | "lg"; ring?: boolean }) {
  const s = size === "lg" ? "h-16 w-16 text-xl" : size === "sm" ? "h-9 w-9 text-sm" : "h-11 w-11 text-base";
  return (
    <span aria-hidden className={`grid shrink-0 place-items-center rounded-full font-bold text-white ${tintOf(it.id)} ${s} ${ring ? "ring-2 ring-white dark:ring-[#070B14]" : ""}`}>
      {it.name.trim().slice(0, 1)}
    </span>
  );
}

function Who({ it, light }: { it: Item; light?: boolean }) {
  return (
    <figcaption className="flex min-w-0 items-center gap-3">
      <Avatar it={it} />
      <span className="min-w-0">
        <span className={`block truncate text-sm font-semibold ${light ? "text-white" : "text-slate-900 dark:text-white"}`}>{it.name}</span>
        <span className={`block truncate text-xs ${light ? "text-white/70" : "text-slate-500 dark:text-slate-400"}`}>{[it.about, it.date].filter(Boolean).join(" · ")}</span>
      </span>
    </figcaption>
  );
}

function Head({ center, aside }: { center?: boolean; aside?: ReactNode }) {
  const tx = useT();
  return (
    <div className={`flex flex-wrap items-end gap-4 ${center ? "justify-center text-center" : "justify-between"}`}>
      <div>
        <span className="text-sm font-semibold uppercase tracking-widest text-violet-600 dark:text-violet-400">{tx("Reviews")}</span>
        <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-white">{tx("What buyers say")}</h2>
      </div>
      {aside}
    </div>
  );
}

const section = "overflow-x-clip bg-[#F6F5F1] py-16 sm:py-24 dark:bg-[#070B14]";
const wrap = "mx-auto max-w-6xl px-4 sm:px-6";
const surface = "rounded-3xl bg-white ring-1 ring-slate-200 dark:bg-[#0E1424] dark:ring-white/10";
const arrow = "grid h-11 w-11 place-items-center rounded-full bg-white ring-1 ring-slate-300 text-slate-700 transition hover:bg-slate-900 hover:text-white hover:ring-slate-900 disabled:opacity-30 disabled:hover:bg-white disabled:hover:text-slate-700 dark:bg-transparent dark:ring-white/15 dark:text-slate-200 dark:hover:bg-white dark:hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600";
const reduced = () => typeof window !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches;

// ---------- F · Swipe Row ----------
// The same swipe row as the blog and How to use sections: one card and a peek of the next on phones, three across on
// wide screens, arrows by the heading, dots under the row on phones.
export function TestiF() {
  const tx = useT();
  const items = useItems();
  const { track, handlers, dragging, edges, index, count, nudge, go } = useSwipeRow();
  if (!items.length) return null;
  return (
    <section className={section}>
      <div className={wrap}>
        <Head aside={
          <div className="hidden gap-2 sm:flex">
            <button type="button" onClick={() => nudge(-1)} disabled={edges.start} aria-label={tx("Previous review")} className={arrow}><ChevronLeft aria-hidden className="h-5 w-5 rtl:rotate-180" /></button>
            <button type="button" onClick={() => nudge(1)} disabled={edges.end} aria-label={tx("Next review")} className={arrow}><ChevronRight aria-hidden className="h-5 w-5 rtl:rotate-180" /></button>
          </div>
        } />
        <div ref={track} {...handlers}
          className={`-mx-4 mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-4 px-4 pb-4 pt-1 select-none [scrollbar-width:none] sm:-mx-6 sm:gap-5 sm:scroll-px-6 sm:px-6 [&::-webkit-scrollbar]:hidden ${dragging ? "cursor-grabbing" : "cursor-grab"}`}>
          {items.map((it) => (
            <figure key={it.id} className={`${surface} flex w-[84%] shrink-0 snap-start flex-col p-6 sm:w-[46%] lg:w-[calc((100%-2.5rem)/3)]`}>
              <Quote aria-hidden className="h-7 w-7 fill-violet-100 text-violet-500 dark:fill-violet-500/15 dark:text-violet-400" />
              <blockquote className="mt-4 line-clamp-6 flex-1 text-[15px] leading-7 text-slate-700 dark:text-slate-300">{it.text}</blockquote>
              <div className="mt-6 border-t border-slate-100 pt-4 dark:border-white/10"><Who it={it} /></div>
            </figure>
          ))}
        </div>
        <SwipeDots count={count} index={index} go={go} label={tx("Reviews")} className="sm:hidden" tone="bg-violet-600 dark:bg-violet-400" />
      </div>
    </section>
  );
}

// ---------- G · Card Stack ----------
// A deck: the top card in front, the next two peeking out behind it. Swipe (or drag) the top card away and it goes
// to the back of the deck; the buttons do the same. Wide screens: the heading on one side, the deck on the other.
export function TestiG() {
  const tx = useT();
  const items = useItems();
  const n = items.length;
  const [top, setTop] = useState(0);
  const [dx, setDx] = useState(0);
  const [leaving, setLeaving] = useState<0 | 1 | -1>(0);
  const start = useRef<{ x: number; id: number } | null>(null);
  if (!n) return null;
  const advance = (dir: 1 | -1) => {
    if (leaving) return;
    if (reduced()) { setTop((t) => (t + (dir === 1 ? 1 : n - 1)) % n); return; }
    setLeaving(dir);
    setTimeout(() => { setTop((t) => (t + (dir === 1 ? 1 : n - 1)) % n); setLeaving(0); setDx(0); }, 260);
  };
  const onDown = (e: React.PointerEvent) => { start.current = { x: e.clientX, id: e.pointerId }; e.currentTarget.setPointerCapture(e.pointerId); };
  const onMove = (e: React.PointerEvent) => { if (start.current) setDx(e.clientX - start.current.x); };
  const onUp = () => {
    if (!start.current) return;
    start.current = null;
    if (Math.abs(dx) > 80) advance(1); else setDx(0);
  };
  const depth = Math.min(3, n);
  return (
    <section className={section}>
      <div className={`${wrap} grid grid-cols-[minmax(0,1fr)] items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]`}>
        <div>
          <Head />
          <p className="mt-4 max-w-md text-[15px] leading-7 text-slate-600 dark:text-slate-400">{tx("Comments our customers left on our product pages, shown as they wrote them. Every product page has its own comments and questions, with our team's answers.")}</p>
          <div className="mt-6 hidden items-center gap-3 lg:flex">
            <button type="button" onClick={() => advance(-1)} aria-label={tx("Previous review")} className={arrow}><ChevronRight aria-hidden className="h-5 w-5 ltr:rotate-180" /></button>
            <button type="button" onClick={() => advance(1)} aria-label={tx("Next review")} className={arrow}><ChevronLeft aria-hidden className="h-5 w-5 ltr:rotate-180" /></button>
            <span className="text-sm tabular-nums text-slate-500 dark:text-slate-400">{tx.num(top + 1)} / {tx.num(n)}</span>
          </div>
        </div>
        <div>
          <div className="relative mx-auto h-[300px] max-w-md touch-pan-y select-none sm:h-[280px]" aria-roledescription="carousel" aria-label={tx("Reviews")}>
            {Array.from({ length: depth }, (_, k) => depth - 1 - k).map((k) => {
              const it = items[(top + k) % n];
              const front = k === 0;
              const out = front && leaving ? leaving : 0;
              const style: CSSProperties = front
                ? { transform: out ? `translateX(${out * 120}%) rotate(${out * 12}deg)` : `translateX(${dx}px) rotate(${dx / 25}deg)`, opacity: out ? 0 : 1, transition: start.current ? "none" : "transform 260ms cubic-bezier(.2,.8,.2,1), opacity 260ms" }
                : { transform: `translateY(${k * 20}px) scale(${1 - k * 0.06})`, opacity: 1 - k * 0.3, transition: "transform 300ms cubic-bezier(.2,.8,.2,1), opacity 300ms" };
              return (
                <figure key={`${it.id}-${(top + k) % n}`} aria-hidden={!front} style={{ ...style, zIndex: depth - k }}
                  onPointerDown={front ? onDown : undefined} onPointerMove={front ? onMove : undefined} onPointerUp={front ? onUp : undefined} onPointerCancel={front ? onUp : undefined}
                  className={`${surface} absolute inset-x-0 top-0 flex h-[270px] flex-col p-6 shadow-[0_18px_40px_-24px_rgba(15,23,42,.35)] sm:h-[250px] ${front ? "cursor-grab active:cursor-grabbing" : ""}`}>
                  <Quote aria-hidden className="h-6 w-6 fill-violet-100 text-violet-500 dark:fill-violet-500/15 dark:text-violet-400" />
                  <blockquote className="mt-3 line-clamp-5 flex-1 text-[15px] leading-7 text-slate-700 dark:text-slate-300">{it.text}</blockquote>
                  <div className="mt-4"><Who it={it} /></div>
                </figure>
              );
            })}
          </div>
          <div className="mt-6 flex items-center justify-center gap-3 lg:hidden">
            <button type="button" onClick={() => advance(-1)} aria-label={tx("Previous review")} className={arrow}><ChevronRight aria-hidden className="h-5 w-5 ltr:rotate-180" /></button>
            <span className="min-w-14 text-center text-sm tabular-nums text-slate-500 dark:text-slate-400">{tx.num(top + 1)} / {tx.num(n)}</span>
            <button type="button" onClick={() => advance(1)} aria-label={tx("Next review")} className={arrow}><ChevronLeft aria-hidden className="h-5 w-5 ltr:rotate-180" /></button>
          </div>
          <p aria-live="polite" className="sr-only">{items[top].name}: {items[top].text}</p>
        </div>
      </div>
    </section>
  );
}

// ---------- H · Stories ----------
// Like phone stories: a row of round avatars (ringed until seen), and one story card below with segmented progress
// bars that move on by themselves. Tap the card's start half to go back, the end half to go on; hold to pause.
// The pause button and the avatars work from the keyboard. Reduced motion: no autoplay.
const STORY_MS = 6000;

export function TestiH() {
  const tx = useT();
  const items = useItems().slice(0, 10);
  const n = items.length;
  const [i, setI] = useState(0);
  const [seen, setSeen] = useState<Set<number>>(() => new Set([0]));
  const [paused, setPaused] = useState(false);
  const [held, setHeld] = useState(false);
  const [auto, setAuto] = useState(false);
  const [inView, setInView] = useState(false);
  const root = useRef<HTMLElement>(null);
  const avatars = useRef<HTMLDivElement>(null);
  useEffect(() => { setAuto(!reduced()); }, []);
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const running = auto && inView && !paused && !held;
  const go = (k: number) => { const j = (k + n) % n; setI(j); setSeen((s) => new Set(s).add(j)); };
  useEffect(() => {
    if (!running || !n) return;
    const t = setTimeout(() => go(i + 1), STORY_MS);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i, running, n]);
  // Keep the current avatar in view in the row.
  useEffect(() => {
    const b = avatars.current?.children[i] as HTMLElement | undefined;
    b?.scrollIntoView({ block: "nearest", inline: "center", behavior: reduced() ? "auto" : "smooth" });
  }, [i]);
  if (!n) return null;
  const it = items[i];
  const tap = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const rtl = getComputedStyle(e.currentTarget).direction === "rtl";
    const startHalf = rtl ? e.clientX > r.left + r.width / 2 : e.clientX < r.left + r.width / 2;
    go(i + (startHalf ? -1 : 1));
  };
  return (
    <section ref={root} className={section}>
      <div className={`${wrap} grid grid-cols-[minmax(0,1fr)] gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] lg:items-center`}>
        <div>
          <Head />
          <div ref={avatars} className="-mx-4 mt-6 flex gap-3 overflow-x-auto px-4 py-1 [scrollbar-width:none] lg:mx-0 lg:flex-wrap lg:px-0 [&::-webkit-scrollbar]:hidden">
            {items.map((x, k) => (
              <button key={x.id} type="button" onClick={() => go(k)} aria-label={x.name} aria-current={k === i ? "true" : undefined}
                className="flex w-16 shrink-0 flex-col items-center gap-1.5 rounded-xl focus-visible:outline-2 focus-visible:outline-violet-600">
                <span className={`rounded-full p-[2.5px] transition ${k === i ? "bg-slate-900 dark:bg-white" : seen.has(k) ? "bg-slate-300 dark:bg-white/20" : "bg-violet-600 dark:bg-violet-400"}`}>
                  <span className="block rounded-full bg-[#F6F5F1] p-[2px] dark:bg-[#070B14]"><Avatar it={x} size="lg" /></span>
                </span>
                <span className={`w-full truncate text-center text-xs ${k === i ? "font-semibold text-slate-900 dark:text-white" : "text-slate-500 dark:text-slate-400"}`}>{x.name}</span>
              </button>
            ))}
          </div>
        </div>
        <figure className="relative mx-auto w-full max-w-md overflow-hidden rounded-[28px] bg-slate-900 p-6 text-white ring-1 ring-white/10 shadow-[0_30px_60px_-30px_rgba(15,23,42,.6)] dark:bg-[#0E1424] sm:p-7">
          <div className="flex gap-1" aria-hidden>
            {items.map((x, k) => (
              <span key={x.id} className="h-1 flex-1 overflow-hidden rounded-full bg-white/25">
                <span key={k === i ? `${i}-${running}` : undefined}
                  className={`block h-full rounded-full bg-white ${k < i ? "w-full" : k > i ? "w-0" : running ? "w-0" : auto ? "w-0" : "w-full"}`}
                  style={k === i && running ? { animation: `story ${STORY_MS}ms linear both` } : undefined} />
              </span>
            ))}
          </div>
          <div className="mt-5 flex items-center justify-between gap-3">
            <Who it={it} light />
            {auto && (
              <button type="button" onClick={() => setPaused(!paused)} aria-label={tx(paused ? "Play" : "Pause")} className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white/15 transition hover:bg-white/25 focus-visible:outline-2 focus-visible:outline-white">
                {paused ? <Play aria-hidden className="h-4 w-4 fill-white" /> : <Pause aria-hidden className="h-4 w-4 fill-white" />}
              </button>
            )}
          </div>
          <div onClick={tap} onPointerDown={() => setHeld(true)} onPointerUp={() => setHeld(false)} onPointerLeave={() => setHeld(false)} onPointerCancel={() => setHeld(false)}
            className="mt-6 min-h-[200px] cursor-pointer select-none">
            <Quote aria-hidden className="h-8 w-8 fill-white/15 text-white/60" />
            <blockquote key={it.id} aria-live="polite" className="mt-3 animate-fade-up text-lg leading-8 [animation-duration:400ms] sm:text-xl sm:leading-9">{it.text}</blockquote>
          </div>
        </figure>
      </div>
      <style>{`@keyframes story{from{width:0}to{width:100%}}`}</style>
    </section>
  );
}

// ---------- I · Focus Carousel ----------
// One card in the middle in full, its neighbours smaller and faded either side. Swipe or drag; it moves on by itself
// every few seconds while on screen and untouched. Dots below.
const FOCUS_MS = 5500;

export function TestiI() {
  const tx = useT();
  const items = useItems();
  const { track, handlers, dragging, index, count, go } = useSwipeRow();
  const [hold, setHold] = useState(false);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, [track]);
  useEffect(() => {
    if (hold || !inView || dragging || count < 2 || reduced()) return;
    const t = setTimeout(() => go((index + 1) % count), FOCUS_MS);
    return () => clearTimeout(t);
  }, [index, hold, inView, dragging, count, go]);
  if (!items.length) return null;
  return (
    <section className={section} onPointerEnter={(e) => { if (e.pointerType === "mouse") setHold(true); }} onPointerLeave={() => setHold(false)} onTouchStart={() => setHold(true)} onFocus={() => setHold(true)} onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) setHold(false); }}>
      <div className={wrap}><Head center /></div>
      <div ref={track} {...handlers}
        className={`mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto px-[8%] pb-6 pt-2 select-none [scroll-padding-inline:8%] [scrollbar-width:none] sm:px-[calc(50%-15rem)] sm:[scroll-padding-inline:calc(50%-15rem)] [&::-webkit-scrollbar]:hidden ${dragging ? "cursor-grabbing" : "cursor-grab"}`}>
        {items.map((it, k) => {
          const on = k === index;
          return (
            <figure key={it.id} aria-hidden={!on || undefined}
              className={`${surface} flex w-[84%] shrink-0 snap-start flex-col items-center p-7 text-center transition-[transform,opacity,box-shadow] duration-500 ease-[cubic-bezier(.2,.8,.2,1)] sm:w-[30rem] ${on ? "scale-100 opacity-100 shadow-[0_24px_50px_-28px_rgba(76,29,149,.45)]" : "scale-[.92] opacity-45"}`}>
              <Avatar it={it} size="lg" />
              <blockquote className="mt-5 line-clamp-6 text-[16px] leading-8 text-slate-700 dark:text-slate-200">{it.text}</blockquote>
              <p className="mt-5 text-sm font-semibold text-slate-900 dark:text-white">{it.name}</p>
              <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{[it.about, it.date].filter(Boolean).join(" · ")}</p>
            </figure>
          );
        })}
      </div>
      <SwipeDots count={count} index={index} go={go} label={tx("Reviews")} tone="bg-violet-600 dark:bg-violet-400" />
    </section>
  );
}

// ---------- J · Fold List ----------
// The calm one. Phones: three compact cards, each folded to three lines with "Read more" to open it, and a button
// that shows three more. Wide screens: the same cards in tidy masonry columns. No motion beyond the folds.
const FOLD_STEP = 3;

function FoldCard({ it }: { it: Item }) {
  const tx = useT();
  const [open, setOpen] = useState(false);
  const [long, setLong] = useState(true);
  const p = useRef<HTMLQuoteElement>(null);
  useEffect(() => { const el = p.current; if (el) setLong(el.scrollHeight > el.clientHeight + 2); }, []);
  return (
    <figure className={`${surface} mb-4 break-inside-avoid p-5 sm:p-6`}>
      <Who it={it} />
      <blockquote ref={p} className={`mt-4 text-[15px] leading-7 text-slate-700 dark:text-slate-300 ${open ? "" : "line-clamp-3 sm:line-clamp-none"}`}>{it.text}</blockquote>
      {long && <button type="button" onClick={() => setOpen(!open)} aria-expanded={open} className="mt-2 text-sm font-semibold text-violet-700 sm:hidden dark:text-violet-300">{tx(open ? "Show less" : "Read more")}</button>}
    </figure>
  );
}

export function TestiJ() {
  const tx = useT();
  const items = useItems();
  const [shown, setShown] = useState(FOLD_STEP);
  if (!items.length) return null;
  return (
    <section className={section}>
      <div className={wrap}>
        <Head />
        <p className="mt-4 max-w-2xl text-[15px] leading-7 text-slate-600 dark:text-slate-400">{tx("Comments our customers left on our product pages, shown as they wrote them. Every product page has its own comments and questions, with our team's answers.")}</p>
        <div className="mt-8 sm:columns-2 sm:gap-4 lg:columns-3">
          {items.map((it, k) => <div key={it.id} className={k >= shown ? "hidden sm:block" : undefined}><FoldCard it={it} /></div>)}
        </div>
        {shown < items.length && (
          <button type="button" onClick={() => setShown(shown + FOLD_STEP)} className="mt-2 w-full rounded-2xl bg-white py-3.5 text-sm font-semibold text-slate-900 ring-1 ring-slate-200 transition hover:bg-slate-50 sm:hidden dark:bg-white/5 dark:text-white dark:ring-white/10">
            {tx("Show more reviews")} ({tx.num(items.length - shown)})
          </button>
        )}
      </div>
    </section>
  );
}
