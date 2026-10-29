"use client";

import { useRef, useState } from "react";
import { archive } from "@/content/blog-list-en";
import { PageShell, PageTitle } from "../otp/parts";
import { Pagination, PostCard, PostRow, TopicTabs, useArchive, type CatId } from "./parts";

const PER_PAGE = 6;

// Page A — "Magazine Front": the newest article large with the next three beside it, then topic tabs over a
// three-column grid with numbered pages. The front block only shows on the first page of "All".
export default function BlogListA() {
  const { cat, setCat, list } = useArchive();
  const [page, setPage] = useState(1);
  const gridTop = useRef<HTMLDivElement>(null);

  const front = cat === "all" && page === 1;
  const rest = cat === "all" ? list.slice(4) : list;
  const pages = Math.max(1, Math.ceil(rest.length / PER_PAGE));
  const shown = rest.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const [lead, ...side] = archive.slice(0, 4);

  const pick = (c: CatId) => { setCat(c); setPage(1); };
  const go = (n: number) => { setPage(n); gridTop.current?.scrollIntoView({ behavior: "smooth", block: "start" }); };

  return (
    <PageShell>
      <div className="mx-auto max-w-6xl px-6 py-14">
        <PageTitle kicker="Blog" title="Guides, news and how-tos" sub="Practical help for numbers, accounts, subscriptions and growing your channels." />

        {front && (
          <div className="mt-12 grid animate-fade-up gap-10 lg:grid-cols-[1.45fr_1fr]">
            <PostCard p={lead} big />
            <div className="flex flex-col">
              <div className="text-xs font-semibold uppercase tracking-widest text-slate-400">Also new</div>
              <div className="mt-4 flex flex-1 flex-col justify-between gap-6 divide-y divide-slate-200 dark:divide-white/10 [&>*:not(:first-child)]:pt-6">
                {side.map((p) => <PostRow key={p.slug} p={p} />)}
              </div>
            </div>
          </div>
        )}

        <div ref={gridTop} className="scroll-mt-24 pt-16">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-white">{front ? "More articles" : "Articles"}</h2>
            <TopicTabs value={cat} onChange={pick} className="w-full sm:w-auto" />
          </div>
          <div key={`${cat}-${page}`} className="mt-8 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {shown.map((p, i) => <PostCard key={p.slug} p={p} delay={i * 50} />)}
          </div>
          <Pagination page={page} pages={pages} onChange={go} />
        </div>
      </div>
    </PageShell>
  );
}
