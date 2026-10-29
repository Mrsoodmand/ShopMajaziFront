"use client";

import { useState } from "react";
import { ChevronDown, ListOrdered } from "lucide-react";
import Cover from "../blog/Cover";
import { Chip } from "../blog/parts";
import { PageShell } from "../otp/parts";
import { ArticleProvider, AuthorBox, Body, Byline, Crumbs, FaqList, ProductCta, ProgressBar, RelatedPosts, Share, Tags, Toc, useActiveSection, useArticle, useProgress } from "./parts";
import { useT } from "@/i18n/client";

// Post B — "Guide with Contents": a docs-style three-column read. Contents on the left highlight the section you're
// in; the article sits in the middle; the product card and share buttons stay in view on the right (wide screens).
// On phones the contents fold into a "Jump to section" panel under the title.
export default function BlogPostB({ slug }: { slug?: string }) {
  return <ArticleProvider slug={slug}><Page /></ArticleProvider>;
}

function Page() {
  const t = useT();
  const article = useArticle();
  const { post, toc } = article;
  const pct = useProgress();
  const active = useActiveSection();
  const [open, setOpen] = useState(false);

  return (
    <PageShell>
      <ProgressBar pct={pct} />
      <div className="mx-auto max-w-7xl px-6 pb-24 pt-12">
        <header className="mx-auto max-w-3xl lg:mx-0 lg:ms-[240px] lg:max-w-[720px] xl:ms-[260px]">
          <Crumbs />
          <div className="mt-8"><Chip p={post} /></div>
          <h1 className="mt-4 font-display text-4xl font-bold leading-[1.1] tracking-tight text-slate-900 sm:text-5xl dark:text-white">{post.title}</h1>
          <p className="mt-5 text-lg leading-relaxed text-slate-600 dark:text-slate-400">{article.lead}</p>
          <div className="mt-8"><Byline /></div>
        </header>

        <div className="mt-10 grid grid-cols-[minmax(0,1fr)] gap-10 lg:grid-cols-[200px_minmax(0,1fr)] xl:grid-cols-[220px_minmax(0,720px)_minmax(0,1fr)]">
          <aside className="hidden lg:block">
            <div className="sticky top-28"><Toc active={active} /></div>
          </aside>

          <article id="article" className="mx-auto w-full max-w-3xl lg:max-w-none">
            <div className="rounded-2xl bg-white ring-1 ring-slate-200 lg:hidden dark:bg-white/5 dark:ring-white/10">
              <button onClick={() => setOpen(!open)} aria-expanded={open} className="flex w-full items-center gap-3 px-5 py-4 text-sm font-semibold text-slate-900 dark:text-white">
                <ListOrdered className="h-4 w-4 text-indigo-500" /><span className="flex-1 text-start">{t("Jump to section")}</span><span className="text-xs font-normal text-slate-400">{toc.length}</span>
                <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
              </button>
              <div className={`grid transition-all duration-300 ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                <div className="overflow-hidden"><div className="px-5 pb-5"><Toc active={active} title="" /></div></div>
              </div>
            </div>

            <Cover cat={post.cat} size="lg" className="mt-8 aspect-[16/9] rounded-3xl lg:mt-0" />
            <Body />

            <FaqList title={t("Questions about this guide")} />

            <div className="mt-10 xl:hidden"><ProductCta /></div>
            <div className="mt-10 flex flex-wrap items-center justify-between gap-4"><Tags /><div className="xl:hidden"><Share /></div></div>
            <div className="mt-8"><AuthorBox /></div>
          </article>

          <aside className="hidden xl:block">
            <div className="sticky top-28 space-y-8">
              <ProductCta stacked />
              <Share />
            </div>
          </aside>
        </div>

        <div className="mt-20"><RelatedPosts /></div>
      </div>
    </PageShell>
  );
}
