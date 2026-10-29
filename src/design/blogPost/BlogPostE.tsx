"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, ListOrdered, PartyPopper, Type } from "lucide-react";
import { catLabel, postHref } from "@/content/blog-en";
import { PageShell } from "../otp/parts";
import { ArticleProvider, Body, Byline, ProductCta, RelatedPosts, Share, Tags, useActiveSection, useArticle, useProgress } from "./parts";

const SIZE_KEY = "post-text-size";

// Post E — "Focus Reader": text first, no big cover. A floating reader bar at the bottom shows a progress ring with
// the minutes left, a contents menu and a text-size switch (remembered in this browser). Finishing the article
// swaps in a "You made it" card pointing to the next one.
export default function BlogPostE({ slug }: { slug?: string }) {
  return <ArticleProvider slug={slug}><Page /></ArticleProvider>;
}

function Page() {
  const article = useArticle();
  const { post, toc, next: nextPost } = article;
  const pct = useProgress();
  const active = useActiveSection();
  const [size, setSize] = useState<"md" | "lg">("md");
  const [menu, setMenu] = useState(false);

  useEffect(() => { try { if (localStorage.getItem(SIZE_KEY) === "lg") setSize("lg"); } catch {} }, []);
  const toggleSize = () => { const s = size === "md" ? "lg" : "md"; setSize(s); try { localStorage.setItem(SIZE_KEY, s); } catch {} };

  const minutes = parseInt(post.read, 10);
  const left = Math.max(0, Math.ceil(minutes * (1 - pct)));
  const done = pct > 0.97;
  const R = 15, C = 2 * Math.PI * R;

  return (
    <PageShell>
      <article id="article" className="mx-auto max-w-2xl px-6 pb-16 pt-16">
        <div className="text-center">
          <span className="text-sm font-semibold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">{catLabel(post.cat)}</span>
          <h1 className="mt-4 font-display text-4xl font-bold leading-[1.1] tracking-tight text-slate-900 sm:text-5xl dark:text-white">{post.title}</h1>
          <div className="mt-8 flex justify-center"><Byline updated={false} /></div>
        </div>
        <p className="mt-12 border-s-4 border-indigo-500 ps-5 text-xl leading-relaxed text-slate-700 dark:text-slate-300">{article.lead}</p>
        <Body size={size} cta={<ProductCta compact />} />
        <div className="mt-12"><Tags /></div>

        <div className={`mt-12 rounded-3xl p-8 text-center ring-1 transition-all duration-700 ${done ? "bg-emerald-50 ring-emerald-200 dark:bg-emerald-500/10 dark:ring-emerald-400/25" : "bg-white ring-slate-200 dark:bg-[#0E1424] dark:ring-white/10"}`}>
          <PartyPopper className={`mx-auto h-8 w-8 transition duration-700 ${done ? "scale-110 text-emerald-500" : "text-slate-300 dark:text-slate-600"}`} />
          <div className="mt-3 font-display text-xl font-semibold text-slate-900 dark:text-white">You made it to the end</div>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Up next: {nextPost.title}</p>
          <Link href={postHref(nextPost)} className="mt-5 inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white dark:bg-white dark:text-slate-900">Read next<ArrowRight className="h-4 w-4 rtl:rotate-180" /></Link>
          <div className="mt-6 flex justify-center"><Share /></div>
        </div>
      </article>

      <div className="mx-auto max-w-6xl px-6 pb-32"><RelatedPosts /></div>

      {/* Floating reader bar */}
      <div className="fixed inset-x-0 bottom-5 z-30 flex justify-center px-4">
        <div className="relative flex items-center gap-1 rounded-full bg-slate-900/90 p-1.5 text-white shadow-2xl shadow-slate-900/30 backdrop-blur-xl dark:bg-white/10 dark:ring-1 dark:ring-white/15">
          {menu && (
            <div className="absolute bottom-full start-1/2 mb-3 w-72 -translate-x-1/2 rtl:translate-x-1/2">
            <div className="animate-fade-up rounded-2xl bg-white p-4 text-slate-900 shadow-2xl ring-1 ring-slate-200 [animation-duration:250ms] dark:bg-[#0E1424] dark:text-white dark:ring-white/10">
              <ol className="space-y-1">
                {toc.map((h) => (
                  <li key={h.id}><a href={`#${h.id}`} onClick={() => setMenu(false)} className={`block rounded-lg px-3 py-2 text-sm transition-colors ${h.id === active ? "bg-indigo-50 font-semibold text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300" : "hover:bg-slate-50 dark:hover:bg-white/5"}`}>{h.text}</a></li>
                ))}
              </ol>
            </div>
            </div>
          )}
          <span className="flex items-center gap-2 py-1 pe-3 ps-1.5 text-sm">
            <svg viewBox="0 0 36 36" className="h-8 w-8 -rotate-90" aria-hidden>
              <circle cx="18" cy="18" r={R} fill="none" stroke="currentColor" strokeOpacity=".2" strokeWidth="3" />
              <circle cx="18" cy="18" r={R} fill="none" stroke="url(#ring)" strokeWidth="3" strokeLinecap="round" strokeDasharray={C} strokeDashoffset={C * (1 - pct)} />
              <defs><linearGradient id="ring"><stop offset="0" stopColor="#6366f1" /><stop offset="1" stopColor="#d946ef" /></linearGradient></defs>
            </svg>
            <span className="tabular-nums">{done ? "Done" : `${left} min left`}</span>
          </span>
          <button onClick={() => setMenu(!menu)} aria-expanded={menu} aria-label="Contents" title="Contents" className={`grid h-10 w-10 place-items-center rounded-full transition ${menu ? "bg-white/20" : "hover:bg-white/10"}`}><ListOrdered className="h-4 w-4" /></button>
          <button onClick={toggleSize} aria-label={size === "md" ? "Larger text" : "Smaller text"} title="Text size" className="flex h-10 items-center gap-1 rounded-full px-3 transition hover:bg-white/10">
            <Type className={`transition-all ${size === "lg" ? "h-5 w-5" : "h-4 w-4"}`} /><span className="text-xs">{size === "lg" ? "Large" : "Normal"}</span>
          </button>
        </div>
      </div>
    </PageShell>
  );
}
