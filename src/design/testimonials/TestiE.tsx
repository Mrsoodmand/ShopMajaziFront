"use client";

import { useEffect, useRef, useState } from "react";
import { CheckCheck, Send } from "lucide-react";
import { reviews } from "@/content/reviews-en";
import { Avatar, Stars } from "./parts";

// Offer E — "Chat Thread": reviews appear one by one as messages in a support-chat window, like the thank-you notes
// customers actually send. Feels personal; plays once when scrolled into view.
export default function TestiE() {
  const list = reviews.slice(0, 5);
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { setShown(list.length); return; }
    let timer: ReturnType<typeof setInterval>;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      timer = setInterval(() => setShown((n) => { if (n >= list.length) { clearInterval(timer); return n; } return n + 1; }), 900);
    }, { rootMargin: "0px 0px -20% 0px" });
    io.observe(el);
    return () => { io.disconnect(); clearInterval(timer); };
  }, [list.length]);

  return (
    <section className="relative overflow-hidden bg-[#F5F6FB] py-24 dark:bg-[#070B14]">
      <div aria-hidden className="pointer-events-none absolute -bottom-24 end-[15%] h-80 w-80 rounded-full bg-sky-300/30 blur-[110px] dark:bg-sky-600/15" />
      <div className="relative mx-auto grid max-w-6xl items-center gap-14 px-6 lg:grid-cols-2">
        <div>
          <span className="text-sm font-semibold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">Reviews</span>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-5xl dark:text-white">Straight from our inbox.</h2>
          <p className="mt-5 max-w-md text-lg text-slate-600 dark:text-slate-400">Thank-you notes from customers after their orders were delivered.</p>
        </div>

        <div ref={ref} className="overflow-hidden rounded-[2rem] bg-white shadow-2xl shadow-indigo-200/50 ring-1 ring-slate-200 dark:bg-[#0E1424] dark:shadow-black/40 dark:ring-white/10">
          <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-4 dark:border-white/10">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-indigo-600 to-fuchsia-500 text-sm font-bold text-white">S</span>
            <div><div className="text-sm font-semibold text-slate-900 dark:text-white">ShopMajazi Support</div><div className="text-xs text-emerald-600 dark:text-emerald-400">online</div></div>
          </div>
          <div className="flex h-[440px] flex-col justify-end gap-4 overflow-hidden bg-[radial-gradient(rgba(99,102,241,.08)_1px,transparent_1px)] bg-[size:18px_18px] p-5">
            {list.slice(0, shown).map((r) => (
              <div key={r.id} className="flex animate-fade-up items-end gap-2 [animation-duration:400ms]">
                <Avatar r={r} />
                <div className="max-w-[80%] rounded-2xl rounded-es-md bg-slate-100 px-4 py-3 dark:bg-white/10">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-300">{r.name}</span>
                    <Stars n={r.rating} />
                  </div>
                  <p className="mt-1 text-sm leading-6 text-slate-700 dark:text-slate-200">{r.text}</p>
                  <div className="mt-1 flex items-center justify-end gap-1 text-[10px] text-slate-400">{r.service} · {r.date}<CheckCheck className="h-3 w-3 text-sky-500" /></div>
                </div>
              </div>
            ))}
            {shown < list.length && (
              <div className="flex items-center gap-1.5 ps-12" aria-hidden>
                {[0, 1, 2].map((d) => <span key={d} className="h-2 w-2 animate-bounce rounded-full bg-slate-300 dark:bg-white/30" style={{ animationDelay: `${d * 150}ms` }} />)}
              </div>
            )}
          </div>
          <div className="flex items-center gap-2 border-t border-slate-100 px-4 py-3 dark:border-white/10">
            <div className="flex-1 rounded-full bg-slate-100 px-4 py-2.5 text-sm text-slate-400 dark:bg-white/5">Write a message…</div>
            <span className="grid h-10 w-10 place-items-center rounded-full bg-indigo-600 text-white"><Send className="h-4 w-4" /></span>
          </div>
        </div>
      </div>
    </section>
  );
}
