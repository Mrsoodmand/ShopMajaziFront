"use client";

import { CalendarDays, Clock, Eye } from "lucide-react";
import Cover from "../blog/Cover";
import { textLang } from "../blog/live";
import { Chip } from "../blog/parts";
import BlogPostB, { HeroOriginal } from "./BlogPostB";
import { Byline, Crumbs, Share, useArticle } from "./parts";
import { useT } from "@/i18n/client";

// Gallery section "blog-post-hero": the top of a blog post, shown inside the live post layout (BlogPostB) so each
// offer is seen with the real contents, article and sidebar under it. Post images are 16:9 and often have text in
// them, so every offer shows the cover whole (never cropped, never under text).
// Shared: the title is a size smaller than before (it took three lines on wide screens) with Persian-friendly line
// height, and the lead is capped at three lines in the hero; the full lead stays in the HTML.

const title = "font-display font-bold tracking-tight text-balance text-slate-900 dark:text-white";
const lead = "text-pretty leading-8 text-slate-600 dark:text-slate-400";

// Date, reading time and views as small icon facts; views only when the post has them.
function Facts({ light = false, className = "" }: { light?: boolean; className?: string }) {
  const tx = useT();
  const { post } = useArticle();
  const c = light ? "text-white/75" : "text-slate-500 dark:text-slate-400";
  return (
    <ul className={`flex flex-wrap items-center gap-x-5 gap-y-2 text-sm ${c} ${className}`}>
      <li className="flex items-center gap-1.5"><CalendarDays aria-hidden className="h-4 w-4" /><time>{post.date}</time></li>
      <li className="flex items-center gap-1.5"><Clock aria-hidden className="h-4 w-4" />{post.read}{" "}{tx("read")}</li>
      {!!post.views && <li className="flex items-center gap-1.5"><Eye aria-hidden className="h-4 w-4" />{post.views.toLocaleString()}{" "}{tx("views")}</li>}
    </ul>
  );
}

// A · Split Cover: text on the start side, the cover whole on the other; one screen on desktop, stacked on phones.
function HeroSplit() {
  const article = useArticle();
  const { post } = article;
  return (
    <header className="grid items-center gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-12">
      <div>
        <Crumbs />
        <div className="mt-6 flex flex-wrap items-center gap-3"><Chip p={post} /><Facts /></div>
        <h1 {...textLang(post)} className={`${title} mt-4 text-3xl leading-[1.35] sm:text-4xl sm:leading-[1.3] xl:text-[2.6rem]`}>{post.title}</h1>
        <p {...textLang(post)} className={`${lead} mt-4 line-clamp-3 text-base sm:text-lg`}>{article.lead}</p>
        <div className="mt-7"><Byline meta={false} /></div>
      </div>
      <Cover cat={post.cat} src={post.image} priority size="lg" className="aspect-[16/9] rounded-3xl shadow-[0_30px_60px_-35px_rgba(15,23,42,0.45)] ring-1 ring-slate-200 dark:ring-white/10" />
    </header>
  );
}

// B · Panel Banner: a white panel with a faint grid and a soft glow holds the header; facts as pills. The cover stays
// at the top of the article, under the panel.
function HeroPanel() {
  const article = useArticle();
  const { post } = article;
  return (
    <header className="relative isolate overflow-hidden rounded-[2rem] bg-white px-6 py-10 ring-1 ring-slate-200 sm:px-10 sm:py-12 dark:bg-[#0E1424] dark:ring-white/10">
      <div aria-hidden className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,rgba(148,163,184,0.12)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.12)_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_at_top,black,transparent_75%)]" />
      <div aria-hidden className="absolute -top-24 start-1/4 -z-10 h-64 w-64 rounded-full bg-indigo-400/20 blur-3xl dark:bg-indigo-500/20" />
      <div className="max-w-3xl">
        <Crumbs />
        <div className="mt-6"><Chip p={post} /></div>
        <h1 {...textLang(post)} className={`${title} mt-4 text-3xl leading-[1.35] sm:text-4xl sm:leading-[1.3]`}>{post.title}</h1>
        <p {...textLang(post)} className={`${lead} mt-4 line-clamp-3 text-base sm:text-lg`}>{article.lead}</p>
      </div>
      <div className="mt-8 flex flex-wrap items-center justify-between gap-5 border-t border-slate-200 pt-6 dark:border-white/10">
        <Byline updated={false} />
        <Share label={false} />
      </div>
    </header>
  );
}

// C · Blurred Backdrop: a dark panel coloured by the post's own cover (the image blurred behind), white text, and the
// sharp cover whole beside it.
function HeroBackdrop() {
  const article = useArticle();
  const { post } = article;
  return (
    <header className="relative isolate overflow-hidden rounded-[2rem] bg-slate-900 p-6 sm:p-10">
      {post.image
        ? <img aria-hidden src={post.image} alt="" className="absolute inset-0 -z-20 h-full w-full scale-125 object-cover opacity-60 blur-3xl" />
        : <div aria-hidden className="absolute inset-0 -z-20 bg-gradient-to-br from-slate-700 to-slate-900" />}
      <div aria-hidden className="absolute inset-0 -z-10 bg-slate-950/55" />
      <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-12">
        <div>
          <Crumbs light />
          <div className="mt-6 flex flex-wrap items-center gap-3"><Chip p={post} light /><Facts light /></div>
          <h1 {...textLang(post)} className="mt-4 text-balance font-display text-3xl font-bold leading-[1.35] tracking-tight text-white sm:text-4xl sm:leading-[1.3]">{post.title}</h1>
          <p {...textLang(post)} className="mt-4 line-clamp-3 text-pretty text-base leading-8 text-white/80 sm:text-lg">{article.lead}</p>
          <div className="mt-7"><Byline light meta={false} /></div>
        </div>
        <Cover cat={post.cat} src={post.image} priority size="lg" className="aspect-[16/9] rounded-2xl shadow-2xl ring-1 ring-white/15" />
      </div>
    </header>
  );
}

// D · Meta Strip: a compact header, then one strip with author, facts and share, and the cover wide under it.
function HeroStrip() {
  const article = useArticle();
  const { post } = article;
  return (
    <header className="mx-auto max-w-5xl">
      <Crumbs />
      <div className="mt-6"><Chip p={post} /></div>
      <h1 {...textLang(post)} className={`${title} mt-4 max-w-4xl text-3xl leading-[1.35] sm:text-4xl sm:leading-[1.3]`}>{post.title}</h1>
      <p {...textLang(post)} className={`${lead} mt-4 line-clamp-3 max-w-3xl text-base sm:text-lg`}>{article.lead}</p>
      <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4 rounded-2xl bg-white px-5 py-4 ring-1 ring-slate-200 dark:bg-white/5 dark:ring-white/10">
        <Byline meta={false} />
        <span aria-hidden className="hidden h-8 w-px bg-slate-200 sm:block dark:bg-white/10" />
        <Facts />
        <div className="ms-auto"><Share label={false} /></div>
      </div>
      <Cover cat={post.cat} src={post.image} priority size="lg" className="mt-8 aspect-[16/9] rounded-3xl ring-1 ring-slate-200 dark:ring-white/10" />
    </header>
  );
}

// E · Centered Editorial: everything centred like a magazine opener, the cover under it.
function HeroCentered() {
  const article = useArticle();
  const { post } = article;
  return (
    <header className="mx-auto max-w-4xl text-center">
      <div className="flex justify-center"><Crumbs /></div>
      <div className="mt-6 flex justify-center"><Chip p={post} /></div>
      <h1 {...textLang(post)} className={`${title} mt-4 text-3xl leading-[1.35] sm:text-4xl sm:leading-[1.3] xl:text-[2.6rem]`}>{post.title}</h1>
      <p {...textLang(post)} className={`${lead} mx-auto mt-4 line-clamp-3 max-w-3xl text-base sm:text-lg`}>{article.lead}</p>
      <div className="mt-6 flex flex-col items-center gap-4"><Byline meta={false} /><Facts className="justify-center" /></div>
      <Cover cat={post.cat} src={post.image} priority size="lg" className="mt-10 aspect-[16/9] rounded-3xl ring-1 ring-slate-200 dark:ring-white/10" />
    </header>
  );
}

export const postHeroes = {
  A: { Hero: HeroSplit, coverInHero: true },
  B: { Hero: HeroPanel, coverInHero: false },
  C: { Hero: HeroBackdrop, coverInHero: true },
  D: { Hero: HeroStrip, coverInHero: true },
  E: { Hero: HeroCentered, coverInHero: true },
  F: { Hero: HeroOriginal, coverInHero: false },
} as const;
export type PostHeroId = keyof typeof postHeroes;

// The live post page (a server component) can't read `postHeroes` from this client file, so it renders this with
// the chosen id (decisions.json › blog-post-hero).
export function PostWithHero({ slug, hero }: { slug: string; hero: PostHeroId }) {
  return <BlogPostB slug={slug} {...(postHeroes[hero] ?? postHeroes.F)} />;
}

// The gallery's offers: the live post layout with each hero.
const offer = (id: PostHeroId) => function HeroOffer({ slug }: { slug?: string }) { return <BlogPostB slug={slug} {...postHeroes[id]} />; };
export const HeroOfferA = offer("A");
export const HeroOfferB = offer("B");
export const HeroOfferC = offer("C");
export const HeroOfferD = offer("D");
export const HeroOfferE = offer("E");
export const HeroOfferF = offer("F");
