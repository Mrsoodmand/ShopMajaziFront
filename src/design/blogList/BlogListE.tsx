"use client";

import { useMemo } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { catLabel, postHref, type Post } from "@/content/blog-en";
import Cover from "../blog/Cover";
import { PageShell } from "../otp/parts";
import { FollowCard, topics, useArchive } from "./parts";

// "Oct 12, 2026" → "October 2026"
const monthOf = (p: Post) => new Date(p.date).toLocaleDateString("en-US", { month: "long", year: "numeric" });
const dayOf = (p: Post) => new Date(p.date).toLocaleDateString("en-US", { month: "short", day: "numeric" });

// Page E — "Editorial Index": text first and calm. Topics are a line of underlined words; articles are listed by
// month as big title rows, and hovering a row slides in its cover. Fast to scan, and it scales to hundreds of posts.
export default function BlogListE() {
  const { cat, setCat, list } = useArchive();
  const months = useMemo(() => {
    const out: { month: string; items: Post[] }[] = [];
    for (const p of list) {
      const m = monthOf(p);
      if (out.at(-1)?.month === m) out.at(-1)!.items.push(p);
      else out.push({ month: m, items: [p] });
    }
    return out;
  }, [list]);

  return (
    <PageShell>
      <div className="mx-auto max-w-5xl px-6 py-16">
        <span className="text-sm font-semibold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">The ShopMajazi blog</span>
        <h1 className="mt-4 max-w-3xl font-display text-4xl font-bold leading-[1.05] tracking-tight text-slate-900 sm:text-7xl dark:text-white">Notes on numbers, accounts and growth.</h1>

        <nav aria-label="Topics" className="mt-10 flex flex-wrap gap-x-6 gap-y-2 border-b border-slate-200 pb-5 text-lg dark:border-white/10">
          {topics.map((t) => {
            const on = t.id === cat;
            return (
              <button key={t.id} onClick={() => setCat(t.id)} aria-pressed={on}
                className={`relative font-medium transition-colors duration-300 after:absolute after:-bottom-1 after:start-0 after:h-0.5 after:bg-indigo-600 after:transition-all after:duration-500 after:ease-[cubic-bezier(.2,.7,.2,1)] dark:after:bg-indigo-400 ${on ? "text-slate-900 after:w-full dark:text-white" : "text-slate-400 after:w-0 hover:text-slate-700 dark:text-slate-500 dark:hover:text-slate-200"}`}>
                {t.label}
              </button>
            );
          })}
        </nav>

        <div key={cat}>
          {months.map(({ month, items }, mi) => (
            <section key={month} className="animate-fade-up pt-10 [animation-duration:450ms]" style={{ animationDelay: `${mi * 80}ms` }}>
              <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-400">{month}</h2>
              <ul className="mt-3 divide-y divide-slate-200 dark:divide-white/10">
                {items.map((p) => (
                  <li key={p.slug}>
                    <Link href={postHref(p)} className="group grid grid-cols-[64px_minmax(0,1fr)_auto] items-center gap-4 py-5 sm:grid-cols-[80px_minmax(0,1fr)_auto] sm:gap-6">
                      <time className="text-sm tabular-nums text-slate-400">{dayOf(p)}</time>
                      <div className="min-w-0">
                        <h3 className="font-display text-lg font-semibold leading-snug text-slate-900 transition duration-300 group-hover:translate-x-1 group-hover:text-indigo-700 sm:text-2xl rtl:group-hover:-translate-x-1 dark:text-white dark:group-hover:text-indigo-300">{p.title}</h3>
                        <div className="mt-1 text-sm text-slate-500 dark:text-slate-400">{catLabel(p.cat)} · {p.read} read</div>
                      </div>
                      <span className="relative hidden h-16 w-24 sm:block">
                        <Cover cat={p.cat} size="sm" className="absolute inset-0 scale-90 rounded-xl opacity-0 transition duration-300 group-hover:scale-100 group-hover:opacity-100" />
                        <ArrowUpRight className="absolute inset-0 m-auto h-5 w-5 text-slate-300 transition duration-300 group-hover:opacity-0 dark:text-slate-600 rtl:-scale-x-100" />
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        <FollowCard className="mt-16" />
      </div>
    </PageShell>
  );
}
