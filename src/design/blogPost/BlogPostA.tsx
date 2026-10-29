"use client";

import Cover from "../blog/Cover";
import { Chip } from "../blog/parts";
import { PageShell } from "../otp/parts";
import { ArticleProvider, AuthorBox, Body, Byline, Crumbs, ProductCta, ProgressBar, RelatedPosts, Share, Tags, useArticle, useProgress } from "./parts";

// Post A — "Classic Read": one calm centered column. Title, lead and byline, a wide cover, then the article with the
// product box where it fits the steps. Tags, share, author and related posts at the end. A thin bar tracks progress.
export default function BlogPostA({ slug }: { slug?: string }) {
  return <ArticleProvider slug={slug}><Page /></ArticleProvider>;
}

function Page() {
  const article = useArticle();
  const { post } = article;
  const pct = useProgress();
  return (
    <PageShell>
      <ProgressBar pct={pct} />
      <article id="article" className="pb-20 pt-12">
        <header className="mx-auto max-w-3xl px-6">
          <Crumbs />
          <div className="mt-8"><Chip p={post} /></div>
          <h1 className="mt-4 font-display text-4xl font-bold leading-[1.1] tracking-tight text-slate-900 sm:text-5xl dark:text-white">{post.title}</h1>
          <p className="mt-5 text-xl leading-relaxed text-slate-600 dark:text-slate-400">{article.lead}</p>
          <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-y border-slate-200 py-5 dark:border-white/10">
            <Byline />
            <Share label={false} />
          </div>
        </header>

        <Cover cat={post.cat} size="lg" className="mx-auto mt-10 aspect-[16/8] max-w-5xl rounded-none sm:mx-6 sm:rounded-[2rem] lg:mx-auto" />

        <div className="mx-auto max-w-3xl px-6">
          <Body cta={<ProductCta />} />
          <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-slate-200 pt-8 dark:border-white/10">
            <Tags />
            <Share />
          </div>
          <div className="mt-10"><AuthorBox /></div>
        </div>
      </article>

      <div className="mx-auto max-w-6xl px-6 pb-24"><RelatedPosts /></div>
    </PageShell>
  );
}
