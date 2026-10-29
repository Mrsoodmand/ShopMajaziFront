"use client";

import { useEffect, useRef, useState } from "react";
import { reasons } from "@/content/why-en";

// Offer E — "Scroll Story": the heading stays pinned on the left while the reasons scroll past on the right.
// The reason in the middle of the screen lights up, and a progress rail and counter track where you are.
export default function WhyE() {
  const items = useRef<(HTMLDivElement | null)[]>([]);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.i)); }),
      { rootMargin: "-45% 0px -45% 0px" },
    );
    items.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  const cur = reasons[active];
  return (
    <section className="bg-[#F6F5F1] py-24 dark:bg-[#070B14]">
      <div className="mx-auto grid max-w-6xl gap-12 px-6 lg:grid-cols-2">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <span className="text-sm font-semibold uppercase tracking-widest text-violet-600 dark:text-violet-400">Why ShopMajazi</span>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-5xl dark:text-white">Six reasons people stay with us.</h2>
          <div className="mt-10 hidden items-center gap-5 lg:flex">
            <span key={cur.id} className={`grid h-16 w-16 animate-fade-up place-items-center rounded-2xl [animation-duration:400ms] ${cur.tint}`}><cur.icon className="h-8 w-8" /></span>
            <div>
              <div className="font-mono text-sm text-slate-400">{String(active + 1).padStart(2, "0")} / {String(reasons.length).padStart(2, "0")}</div>
              <div className="mt-1 h-1 w-48 overflow-hidden rounded-full bg-slate-200 dark:bg-white/10">
                <div className="h-full rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 transition-[width] duration-500 ease-out" style={{ width: `${((active + 1) / reasons.length) * 100}%` }} />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4 lg:py-[20vh]">
          {reasons.map((r, i) => {
            const on = i === active;
            return (
              <div key={r.id} ref={(el) => { items.current[i] = el; }} data-i={i}
                className={`rounded-3xl p-7 ring-1 transition duration-500 ease-out ${on ? "bg-white shadow-xl shadow-violet-200/50 ring-violet-200 dark:bg-[#0E1424] dark:shadow-black/40 dark:ring-violet-400/40" : "bg-white/40 ring-transparent lg:opacity-50 dark:bg-white/[.02]"}`}>
                <div className="flex items-center gap-4">
                  <span className={`grid h-11 w-11 place-items-center rounded-xl ${r.tint}`}><r.icon className="h-5 w-5" /></span>
                  <h3 className="font-display text-xl font-semibold text-slate-900 dark:text-white">{r.title}</h3>
                </div>
                <p className="mt-3 text-[15px] leading-7 text-slate-600 dark:text-slate-400">{r.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
