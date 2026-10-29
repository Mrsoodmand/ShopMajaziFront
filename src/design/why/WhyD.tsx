"use client";

import { useEffect, useRef, useState } from "react";
import { reasons, whyStats } from "@/content/why-en";
import { useT } from "@/i18n/client";

// Counts from 0 to `to` with an ease-out once `run` turns true.
function useCount(to: number, run: boolean, ms = 1600) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!run) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { setN(to); return; }
    let frame = 0;
    const t0 = performance.now();
    const step = (now: number) => {
      const t = Math.min(1, (now - t0) / ms);
      setN(to * (1 - Math.pow(1 - t, 3)));
      if (t < 1) frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [to, run, ms]);
  return n;
}

function Stat({ s, run }: { s: (typeof whyStats)[number]; run: boolean }) {
  const t = useT();
  const fa = t.locale === "fa";
  const n = useCount(s.value, run);
  const text = s.format === "compact"
    ? new Intl.NumberFormat(fa ? "fa-IR" : "en-US", { notation: "compact", maximumFractionDigits: 1 }).format(n)
    : t.num(n, { minimumFractionDigits: s.decimals ?? 0, maximumFractionDigits: s.decimals ?? 0, useGrouping: false });
  // Persian: "<3s" becomes "زیر ۳ ثانیه" (a "<" would flip in right-to-left text).
  const prefix = fa && s.prefix === "<" ? "زیر " : s.prefix;
  const suffix = fa && s.suffix === "s" ? " ثانیه" : s.suffix;
  return (
    <div className="text-center">
      <div className="font-display text-4xl font-bold tabular-nums tracking-tight sm:text-5xl">{prefix}{text}{suffix}</div>
      <div className="mt-2 text-xs uppercase tracking-widest text-white/60">{s.label}</div>
    </div>
  );
}

// Offer D — "Live Counters": a dark band of big numbers that count up when scrolled into view, then the reasons
// as a compact list underneath.
export default function WhyD() {
  const tx = useT();
  const ref = useRef<HTMLDivElement>(null);
  const [run, setRun] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setRun(true); io.disconnect(); } }, { rootMargin: "0px 0px -15% 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section className="bg-white py-24 dark:bg-[#070B14]">
      <div className="mx-auto max-w-6xl px-6">
        <div ref={ref} className="relative overflow-hidden rounded-[2rem] bg-[#070B14] px-6 py-14 text-white ring-1 ring-white/10 sm:px-12">
          <div aria-hidden className="pointer-events-none absolute -top-24 start-1/2 h-72 w-[700px] -translate-x-1/2 rounded-full bg-indigo-600/30 blur-[110px]" />
          <div className="relative text-center">
            <span className="text-sm font-semibold uppercase tracking-widest text-cyan-300">{tx("Why ShopMajazi")}</span>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl">{tx("Numbers that speak for themselves")}</h2>
          </div>
          <div className="relative mt-12 grid grid-cols-2 gap-y-10 lg:grid-cols-4">
            {tx.tr(whyStats).map((s) => <Stat key={s.label} s={s} run={run} />)}
          </div>
        </div>

        <div className="mt-12 grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
          {tx.tr(reasons).map((r) => (
            <div key={r.id} className="flex gap-4">
              <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ${r.tint}`}><r.icon className="h-5 w-5" /></span>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white">{r.title}</h3>
                <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-400">{r.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
