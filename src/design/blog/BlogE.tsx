"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { blogCats, catLabel, postHref, posts } from "@/content/blog-en";
import Cover from "./Cover";
import { Meta, ViewAll } from "./parts";

// Offer E — "Topic List": category tabs (like FAQ F) over an editorial list. Each row: thumbnail, topic, title,
// excerpt and date. Quiet and text-led, easy to scan.
export default function BlogE() {
  const [cat, setCat] = useState<string>("all");
  const tabs = [{ id: "all", label: "Latest" }, ...blogCats];
  const shown = (cat === "all" ? posts : posts.filter((p) => p.cat === cat)).slice(0, 5);

  return (
    <section className="bg-white py-24 dark:bg-[#070B14]">
      <div className="mx-auto max-w-5xl px-6">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <span className="text-sm font-semibold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">Blog</span>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-5xl dark:text-white">Latest articles</h2>
          </div>
          <ViewAll />
        </div>

        <div className="mt-10 flex gap-1 overflow-x-auto rounded-full bg-slate-100 p-1 [scrollbar-width:none] sm:w-fit dark:bg-white/5">
          {tabs.map((t) => (
            <button key={t.id} onClick={() => setCat(t.id)}
              className={`shrink-0 whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition ${cat === t.id ? "bg-white text-slate-900 shadow-sm dark:bg-white/15 dark:text-white" : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"}`}>
              {t.label}
            </button>
          ))}
        </div>

        <ul key={cat} className="mt-6 animate-fade-up divide-y divide-slate-200 border-y border-slate-200 [animation-duration:350ms] dark:divide-white/10 dark:border-white/10">
          {shown.map((p) => (
            <li key={p.slug}>
              <Link href={postHref(p)} className="group grid items-center gap-5 py-6 sm:grid-cols-[150px_1fr_auto]">
                <Cover cat={p.cat} size="sm" className="hidden aspect-[4/3] rounded-2xl sm:block" />
                <div>
                  <div className="flex items-center gap-3 text-xs">
                    <span className="font-semibold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">{catLabel(p.cat)}</span>
                    <Meta p={p} />
                  </div>
                  <h3 className="mt-2 font-display text-xl font-semibold leading-snug text-slate-900 group-hover:text-indigo-700 dark:text-white dark:group-hover:text-indigo-300">{p.title}</h3>
                  <p className="mt-1.5 line-clamp-1 text-sm text-slate-600 dark:text-slate-400">{p.excerpt}</p>
                </div>
                <span className="hidden h-11 w-11 place-items-center rounded-full ring-1 ring-slate-200 transition group-hover:bg-slate-900 group-hover:text-white group-hover:ring-slate-900 sm:grid dark:ring-white/15 dark:text-slate-300 dark:group-hover:bg-white dark:group-hover:text-slate-900">
                  <ArrowRight className="h-4 w-4 rtl:rotate-180" />
                </span>
              </Link>
            </li>
          ))}
          {shown.length === 0 && <li className="py-10 text-center text-sm text-slate-500 dark:text-slate-400">No articles in this topic yet.</li>}
        </ul>
      </div>
    </section>
  );
}
