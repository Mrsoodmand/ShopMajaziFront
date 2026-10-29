"use client";

import Link from "next/link";
import { ArrowDown, ArrowRight } from "lucide-react";
import { catLabel, postHref } from "@/content/blog-en";
import Cover from "../blog/Cover";
import { PageShell } from "../otp/parts";
import { ArticleProvider, AuthorBox, Body, Byline, Crumbs, ProductCta, ProgressBar, Share, Tags, useArticle, useProgress } from "./parts";

// Post C — "Immersive Cover": the cover fills the first screen with the title written over it, like a magazine
// feature. Larger reading type below, share buttons floating beside the text on wide screens, and a full-width
// "Next article" cover to keep people reading.
export default function BlogPostC({ slug }: { slug?: string }) {
  return <ArticleProvider slug={slug}><Page /></ArticleProvider>;
}

function Page() {
  const article = useArticle();
  const { post, next: nextPost } = article;
  const pct = useProgress();
  return (
    <PageShell>
      <ProgressBar pct={pct} />
      <header className="relative -mt-16 flex min-h-[88vh] items-end overflow-hidden">
        <Cover cat={post.cat} size="lg" corner className="absolute inset-0 [&>svg]:top-28 [&>svg]:end-[8%]" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-slate-950/10" />
        <div className="relative mx-auto w-full max-w-4xl px-6 pb-16 pt-32">
          <Crumbs light />
          <span className="mt-6 inline-block rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white backdrop-blur">{catLabel(post.cat)}</span>
          <h1 className="mt-4 font-display text-4xl font-bold leading-[1.05] tracking-tight text-white sm:text-6xl">{post.title}</h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/80">{article.lead}</p>
          <div className="mt-8 flex flex-wrap items-center justify-between gap-6">
            <Byline light />
            <a href="#article" className="flex items-center gap-2 text-sm font-semibold text-white/80 hover:text-white">Start reading<ArrowDown className="h-4 w-4 animate-bounce" /></a>
          </div>
        </div>
      </header>

      <div className="relative mx-auto max-w-6xl px-6">
        <div className="absolute inset-y-0 start-6 hidden xl:block">
          <div className="sticky top-32 pt-16"><Share vertical /></div>
        </div>
        <article id="article" className="mx-auto max-w-2xl scroll-mt-20 pb-16 pt-6">
          <Body size="lg" cta={<ProductCta />} />
          <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-slate-200 pt-8 dark:border-white/10">
            <Tags /><div className="xl:hidden"><Share /></div>
          </div>
          <div className="mt-10"><AuthorBox /></div>
        </article>
      </div>

      <Link href={postHref(nextPost)} className="group relative mt-8 block overflow-hidden">
        <Cover cat={nextPost.cat} size="lg" corner className="absolute inset-0 transition duration-700 group-hover:scale-105" />
        <div className="absolute inset-0 bg-slate-950/60 transition group-hover:bg-slate-950/50" />
        <div className="relative mx-auto max-w-4xl px-6 py-24 text-white">
          <div className="text-xs font-semibold uppercase tracking-widest text-white/70">Next article</div>
          <div className="mt-4 font-display text-3xl font-bold leading-tight sm:text-5xl">{nextPost.title}</div>
          <span className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 transition group-hover:gap-3">Read next<ArrowRight className="h-4 w-4 rtl:rotate-180" /></span>
        </div>
      </Link>
    </PageShell>
  );
}
