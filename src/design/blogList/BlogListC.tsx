"use client";

import { useState } from "react";
import { Search, X, ArrowDown } from "lucide-react";
import { PageShell } from "../otp/parts";
import { Empty, PostCard, TopicTabs, useArchive, type CatId } from "./parts";

const STEP = 6;

// Page C — "Search & Filter": opens like the home hero, with one big search field. Topic tabs, a Newest / Most read
// switch and the result count sit above the grid; "Load more" adds six at a time instead of page numbers.
export default function BlogListC() {
  const [q, setQ] = useState("");
  const [sort, setSort] = useState<"new" | "popular">("new");
  const { cat, setCat, list } = useArchive({ q, sort });
  const [count, setCount] = useState(STEP);
  const shown = list.slice(0, count);

  const pick = (c: CatId) => { setCat(c); setCount(STEP); };
  const reset = () => { setQ(""); pick("all"); };

  return (
    <PageShell>
      <section className="relative overflow-hidden">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute -top-32 start-[10%] h-[380px] w-[380px] rounded-full bg-indigo-300/50 blur-[110px] dark:bg-indigo-600/25" />
          <div className="absolute -top-20 end-[8%] h-[340px] w-[340px] rounded-full bg-fuchsia-300/40 blur-[110px] dark:bg-fuchsia-600/15" />
          <div className="absolute inset-0 bg-[radial-gradient(rgba(15,23,42,.12)_1px,transparent_1px)] bg-[size:22px_22px] dark:bg-[radial-gradient(rgba(255,255,255,.08)_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_at_top,black_20%,transparent_70%)]" />
        </div>
        <div className="relative mx-auto max-w-3xl px-6 pb-10 pt-16 text-center">
          <span className="text-sm font-semibold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">Blog</span>
          <h1 className="mt-3 font-display text-4xl font-bold tracking-tight text-slate-900 sm:text-6xl dark:text-white">What do you want to learn?</h1>
          <label className="mx-auto mt-8 flex max-w-xl items-center gap-3 rounded-2xl bg-white/90 px-5 py-4 shadow-xl shadow-indigo-200/50 ring-1 ring-slate-200 backdrop-blur focus-within:ring-2 focus-within:ring-indigo-500 dark:bg-white/5 dark:shadow-black/30 dark:ring-white/10">
            <Search className="h-5 w-5 text-slate-400" />
            <input value={q} onChange={(e) => { setQ(e.target.value); setCount(STEP); }} placeholder="Try “WhatsApp”, “Apple ID” or “Telegram”" className="w-full bg-transparent text-base text-slate-900 outline-none placeholder:text-slate-400 dark:text-white" />
            {q && <button onClick={() => setQ("")} aria-label="Clear search" className="grid h-7 w-7 place-items-center rounded-full bg-slate-100 text-slate-500 dark:bg-white/10 dark:text-slate-300"><X className="h-3.5 w-3.5" /></button>}
          </label>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-6 pb-20">
        <TopicTabs value={cat} onChange={pick} counts className="mx-auto w-fit max-w-full" />
        <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
          <span className="text-sm text-slate-500 dark:text-slate-400"><b className="text-slate-900 dark:text-white">{list.length}</b> article{list.length === 1 ? "" : "s"}</span>
          <div className="flex rounded-full bg-white p-1 text-sm ring-1 ring-slate-200 dark:bg-white/5 dark:ring-white/10">
            {(["new", "popular"] as const).map((s) => (
              <button key={s} onClick={() => setSort(s)} className={`rounded-full px-4 py-1.5 font-medium transition-colors ${sort === s ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900" : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"}`}>
                {s === "new" ? "Newest" : "Most read"}
              </button>
            ))}
          </div>
        </div>

        {list.length === 0 ? <div className="mt-8"><Empty onReset={reset}>Nothing matches “{q}” yet. Try a shorter word or another topic.</Empty></div> : (
          <div key={`${cat}-${q}-${sort}`} className="mt-8 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {shown.map((p, i) => <PostCard key={p.slug} p={p} delay={(i % STEP) * 50} />)}
          </div>
        )}

        {count < list.length && (
          <div className="mt-12 text-center">
            <button onClick={() => setCount((c) => c + STEP)} className="group inline-flex items-center gap-2 rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200">
              Load more<span className="text-white/60 dark:text-slate-500">{list.length - count} left</span><ArrowDown className="h-4 w-4 transition group-hover:translate-y-0.5" />
            </button>
          </div>
        )}
      </div>
    </PageShell>
  );
}
