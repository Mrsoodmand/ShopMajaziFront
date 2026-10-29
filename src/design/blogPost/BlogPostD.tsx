"use client";

import Link from "next/link";
import { ArrowRight, Check, Lightbulb, ShieldCheck, Zap, RotateCcw } from "lucide-react";
import Cover from "../blog/Cover";
import { Chip } from "../blog/parts";
import { PageShell } from "../otp/parts";
import { ArticleProvider, Body, Byline, Crumbs, FaqList, ProductCta, ProgressBar, RelatedPosts, Share, useArticle, useProgress } from "./parts";

// Post D — "Guide + Buy": built to turn readers into buyers without getting in the way. Key takeaways up top,
// the article with the product box inline, a sticky buy card beside it on desktop, a slim buy bar on phones,
// and the guide's FAQ at the end.
export default function BlogPostD({ slug }: { slug?: string }) {
  return <ArticleProvider slug={slug}><Page /></ArticleProvider>;
}

function Page() {
  const article = useArticle();
  const { post } = article;
  const pct = useProgress();
  const { product } = article;
  const bar = pct > 0.04 && pct < 0.98;

  return (
    <PageShell>
      <ProgressBar pct={pct} />
      <div className="mx-auto max-w-6xl px-6 pb-28 pt-12">
        <Crumbs />
        <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-end">
          <div>
            <Chip p={post} />
            <h1 className="mt-4 font-display text-4xl font-bold leading-[1.1] tracking-tight text-slate-900 sm:text-5xl dark:text-white">{post.title}</h1>
            <p className="mt-5 text-lg leading-relaxed text-slate-600 dark:text-slate-400">{article.lead}</p>
            <div className="mt-8"><Byline /></div>
          </div>
          <div className="rounded-3xl bg-amber-50 p-6 ring-1 ring-amber-200 dark:bg-amber-500/10 dark:ring-amber-400/25">
            <div className="flex items-center gap-2 font-display font-semibold text-slate-900 dark:text-white"><Lightbulb className="h-5 w-5 text-amber-500" />Key takeaways</div>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-700 dark:text-slate-300">
              {article.takeaways.map((t) => <li key={t} className="flex gap-2.5"><Check className="mt-1 h-4 w-4 shrink-0 text-emerald-500" />{t}</li>)}
            </ul>
          </div>
        </div>

        <div className="mt-12 grid grid-cols-[minmax(0,1fr)] gap-12 lg:grid-cols-[minmax(0,1fr)_340px]">
          <article id="article" className="max-w-3xl">
            <Cover cat={post.cat} size="lg" className="aspect-[16/9] rounded-3xl" />
            <Body cta={<ProductCta />} />
            <FaqList title="Frequently asked" />
            <div className="mt-10"><Share /></div>
          </article>

          <aside className="hidden lg:block">
            <div className="sticky top-28 rounded-3xl bg-white p-6 shadow-xl shadow-indigo-200/40 ring-1 ring-slate-200 dark:bg-[#0E1424] dark:shadow-black/30 dark:ring-white/10">
              <div className="text-xs font-semibold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">Used in this guide</div>
              <div className="mt-3 font-display text-xl font-semibold text-slate-900 dark:text-white">{product.name}</div>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{product.desc}</p>
              <div className="mt-5 text-sm text-slate-500 dark:text-slate-400">from <span className="font-display text-3xl font-bold text-slate-900 dark:text-white">{product.from}</span></div>
              <Link href={product.href} className="mt-5 flex items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/30 hover:bg-indigo-700">Get a number<ArrowRight className="h-4 w-4 rtl:rotate-180" /></Link>
              <ul className="mt-5 space-y-2.5 border-t border-slate-100 pt-5 text-sm text-slate-600 dark:border-white/10 dark:text-slate-300">
                <li className="flex items-center gap-2.5"><Zap className="h-4 w-4 text-amber-500" />Delivered in seconds</li>
                <li className="flex items-center gap-2.5"><RotateCcw className="h-4 w-4 text-emerald-500" />Refund if no SMS arrives</li>
                <li className="flex items-center gap-2.5"><ShieldCheck className="h-4 w-4 text-indigo-500" />No personal SIM needed</li>
              </ul>
            </div>
          </aside>
        </div>

        <div className="mt-20"><RelatedPosts title="More guides like this" /></div>
      </div>

      {/* Phones: a slim buy bar while reading. */}
      <div className={`fixed inset-x-0 bottom-0 z-30 border-t border-slate-200 bg-white/90 p-3 backdrop-blur-xl transition-transform duration-500 ease-[cubic-bezier(.2,.7,.2,1)] lg:hidden dark:border-white/10 dark:bg-[#0B1020]/90 ${bar ? "translate-y-0" : "translate-y-full"}`}>
        <div className="mx-auto flex max-w-md items-center gap-3">
          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-semibold text-slate-900 dark:text-white">{product.name}</div>
            <div className="text-xs text-slate-500 dark:text-slate-400">from <b className="text-slate-900 dark:text-white">{product.from}</b> · refund if no SMS</div>
          </div>
          <Link href={product.href} className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white">Get a number</Link>
        </div>
      </div>
    </PageShell>
  );
}
