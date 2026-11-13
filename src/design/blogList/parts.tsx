"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState, type ReactNode } from "react";
import Link from "@/i18n/Link";
import { ArrowRight, ChevronLeft, ChevronRight, Clock, LayoutGrid, BookOpen, Smartphone, Apple, Send, Users, Newspaper, type LucideIcon } from "lucide-react";
import { blogCats, postHref, type BlogCat, type Post } from "@/content/blog-en";
import { archive, viewsOf } from "@/content/blog-list-en";
import Cover from "../blog/Cover";
import { Chip, Meta } from "../blog/parts";
import { textLang, useBlogPosts } from "../blog/live";
import { useT } from "@/i18n/client";
import { SearchInput } from "../search";
import { ring } from "../googleVoice/clean";

// Pieces shared by the blog list page offers.

export type CatId = BlogCat | "all";
export const catIcons: Record<CatId, LucideIcon> = { all: LayoutGrid, guides: BookOpen, numbers: Smartphone, apple: Apple, telegram: Send, social: Users, news: Newspaper };
// A list page needs a way back to everything, so the topic filters here keep an "All" option.
export const topics: { id: CatId; label: string }[] = [{ id: "all", label: "All" }, ...blogCats];

export const isCat = (v: string | undefined): v is CatId => topics.some((t) => t.id === v);

// Every post (live ones on the live page, else the placeholder archive), newest first, with counts per topic and the
// most read first. A live post knows its views.
export function useBlogArchive() {
  const all = useBlogPosts(archive);
  return useMemo(() => {
    const views = (p: Post) => p.views ?? viewsOf(p);
    return {
      all,
      views,
      countOf: (c: CatId) => (c === "all" ? all.length : all.filter((p) => p.cat === c).length),
      mostRead: [...all].sort((a, b) => views(b) - views(a)),
    };
  }, [all]);
}

// The topic filters that have posts ("All" always).
export function useTopics() {
  const tx = useT();
  const { countOf } = useBlogArchive();
  return tx.tr(topics).filter((t) => t.id === "all" || countOf(t.id) > 0);
}

// Topic + search + sort over the archive.
export function useArchive({ q = "", sort = "new", initial }: { q?: string; sort?: "new" | "popular"; initial?: string } = {}) {
  const { all, views } = useBlogArchive();
  const [cat, setCat] = useState<CatId>(isCat(initial) ? initial : "all");
  const list = useMemo(() => {
    const t = q.trim().toLowerCase();
    const out = all.filter((p) => (cat === "all" || p.cat === cat) && (!t || `${p.title} ${p.excerpt}`.toLowerCase().includes(t)));
    return sort === "popular" ? [...out].sort((a, b) => views(b) - views(a)) : out;
  }, [all, views, cat, q, sort]);
  return { cat, setCat, list };
}

// Vertical article card: "Framed" (blog card A, picked 2026-11-09). A bordered card with the image on a soft mat,
// the topic and reading time above the title, the excerpt, and a footer line with the date and "Read more". The same
// card on the home carousel, the blog list, the service pages' "Read more" row and the post page's "Keep reading".
// Cards in a row share one height (the footer sits at the bottom). `big`: a larger lead card.
export function PostCard({ p, delay, big = false }: { p: Post; delay?: number; big?: boolean }) {
  const t = useT();
  return (
    <Link href={postHref(p)} style={delay === undefined ? undefined : { animationDelay: `${delay}ms` }}
      className={`group flex h-full flex-col rounded-[28px] border border-slate-200 bg-white p-2 transition-[translate,box-shadow,border-color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:border-indigo-200 hover:shadow-[0_28px_50px_-30px_rgba(79,70,229,.55)] dark:border-white/10 dark:bg-[#0E1424] dark:hover:border-indigo-400/40 dark:hover:shadow-[0_28px_50px_-26px_rgba(0,0,0,.95)] ${ring} ${delay === undefined ? "" : "animate-fade-up [animation-duration:450ms]"}`}>
      <Cover cat={p.cat} src={p.image} size={big ? "lg" : "md"} className="aspect-video rounded-[20px]" />
      <div className="flex flex-1 flex-col px-3 pb-2.5 pt-4">
        <div className="flex items-center justify-between gap-3">
          <Chip p={p} />
          <span className="flex shrink-0 items-center gap-1 text-xs text-slate-500 dark:text-slate-400"><Clock aria-hidden className="h-3.5 w-3.5" />{p.read}{" "}{t("read")}</span>
        </div>
        <h3 {...textLang(p)} className={`mt-3 font-display font-semibold leading-snug text-slate-900 dark:text-white ${big ? "text-2xl sm:text-3xl" : "line-clamp-2 text-[17px]"}`}>{p.title}</h3>
        <p {...textLang(p)} className={`mt-1.5 text-slate-600 dark:text-slate-400 ${big ? "text-base" : "line-clamp-2 text-sm leading-6"}`}>{p.excerpt}</p>
        <div className="mt-auto pt-4">
          <div className="flex items-center justify-between gap-3 border-t border-slate-100 pt-3 text-xs dark:border-white/10">
            <time dateTime={p.iso} className="text-slate-500 dark:text-slate-400">{p.date}</time>
            <span className="flex items-center gap-1.5 font-semibold text-indigo-700 dark:text-indigo-300">
              {t("Read more")}<ArrowRight aria-hidden className="h-4 w-4 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

// Horizontal article row with a thumbnail.
export function PostRow({ p, compact = false }: { p: Post; compact?: boolean }) {
  return (
    <Link href={postHref(p)} className="group flex items-center gap-4">
      <Cover cat={p.cat} src={p.image} size="sm" className={`aspect-video shrink-0 ${compact ? "w-24 rounded-xl" : "w-32 rounded-2xl sm:w-44"}`} />
      <div className="min-w-0 flex-1">
        {!compact && <Chip p={p} />}
        <h3 {...textLang(p)} className={`line-clamp-2 font-display font-semibold leading-snug text-slate-900 transition-colors group-hover:text-indigo-700 dark:text-white dark:group-hover:text-indigo-300 ${compact ? "text-sm" : "mt-2 text-base sm:text-lg"}`}>{p.title}</h3>
        <div className="mt-1.5"><Meta p={p} /></div>
      </div>
    </Link>
  );
}

// Wide article row with a large thumbnail and excerpt (page B's list). On phones it shrinks to a compact row:
// small thumbnail beside the title, no excerpt.
export function PostWide({ p, delay }: { p: Post; delay?: number }) {
  return (
    <Link href={postHref(p)} style={delay === undefined ? undefined : { animationDelay: `${delay}ms` }}
      className={`group flex items-center gap-4 rounded-3xl bg-white p-3 ring-1 ring-slate-200 transition hover:-translate-y-0.5 hover:shadow-lg hover:ring-indigo-200 sm:gap-5 sm:p-4 dark:bg-[#0E1424] dark:ring-white/10 dark:hover:ring-indigo-400/40 ${delay === undefined ? "" : "animate-fade-up [animation-duration:400ms]"}`}>
      <Cover cat={p.cat} src={p.image} size="sm" className="aspect-video w-32 shrink-0 rounded-xl sm:w-60 sm:rounded-2xl" />
      <div className="min-w-0 flex-1 sm:pe-4">
        <div className="hidden flex-wrap items-center gap-3 sm:flex"><Chip p={p} /><Meta p={p} /></div>
        <div className="sm:hidden"><Chip p={p} /></div>
        <h2 {...textLang(p)} className="mt-2 line-clamp-3 font-display text-base font-semibold leading-snug sm:mt-3 sm:line-clamp-none text-slate-900 transition-colors group-hover:text-indigo-700 sm:text-xl dark:text-white dark:group-hover:text-indigo-300">{p.title}</h2>
        <div className="mt-1.5 sm:hidden"><Meta p={p} /></div>
        <p {...textLang(p)} className="mt-2 line-clamp-2 hidden text-sm text-slate-600 sm:block dark:text-slate-400">{p.excerpt}</p>
      </div>
    </Link>
  );
}

// Page B's sidebar: search, topics with counts, most read and the Telegram card. Below lg it sits under the list;
// `filtersAbove`: the page shows search and topics above the list there instead (infinite scroll never reaches the
// bottom until every post is loaded), so the sidebar keeps them for wide screens only.
export function Sidebar({ q, onQ, cat, onCat, filtersAbove = false }: { q: string; onQ: (q: string) => void; cat: CatId; onCat: (c: CatId) => void; filtersAbove?: boolean }) {
  const tx = useT();
  const { countOf, mostRead } = useBlogArchive();
  const shownTopics = useTopics();
  const wide = filtersAbove ? "hidden lg:block" : "";
  return (
    <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
      <SearchInput small value={q} onChange={onQ} label={tx("Search articles")} className={wide} />

      <div className={`rounded-3xl bg-white p-3 ring-1 ring-slate-200 dark:bg-[#0E1424] dark:ring-white/10 ${wide}`}>
        <div className="px-3 pb-2 pt-1 text-xs font-semibold uppercase tracking-widest text-slate-400">{tx("Topics")}</div>
        {shownTopics.map((t) => {
          const Icon = catIcons[t.id];
          const on = t.id === cat;
          return (
            <button key={t.id} onClick={() => onCat(t.id)} aria-pressed={on}
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors duration-300 ${on ? "bg-indigo-50 font-semibold text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300" : "text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-white/5"}`}>
              <Icon className="h-4 w-4" /><span className="flex-1 text-start">{t.label}</span><span className="text-xs text-slate-400">{countOf(t.id)}</span>
            </button>
          );
        })}
      </div>

      <div className="rounded-3xl bg-white p-5 ring-1 ring-slate-200 dark:bg-[#0E1424] dark:ring-white/10">
        <div className="text-xs font-semibold uppercase tracking-widest text-slate-400">{tx("Most read")}</div>
        <ol className="mt-4 space-y-4">
          {mostRead.slice(0, 5).map((p, i) => (
            <li key={p.slug}>
              <Link href={postHref(p)} className="group flex gap-3">
                <span className="font-display text-2xl font-bold leading-none text-indigo-200 dark:text-white/15">{i + 1}</span>
                <span {...textLang(p)} className="text-sm font-medium leading-snug text-slate-800 group-hover:text-indigo-700 dark:text-slate-200 dark:group-hover:text-indigo-300">{p.title}</span>
              </Link>
            </li>
          ))}
        </ol>
      </div>

      <FollowCard />
    </aside>
  );
}

// Topic tabs with the sliding highlight used across the site (How to buy, reviews, hero).
export function TopicTabs({ value, onChange, counts = false, className = "" }: { value: CatId; onChange: (c: CatId) => void; counts?: boolean; className?: string }) {
  const { countOf } = useBlogArchive();
  const shownTopics = useTopics();
  const refs = useRef<Record<string, HTMLButtonElement | null>>({});
  // `ready` stays false for the first placement so the pill doesn't grow in from nothing on page load.
  const [pill, setPill] = useState({ left: 0, width: 0, ready: false });
  useLayoutEffect(() => {
    const measure = () => { const b = refs.current[value]; if (b) setPill((o) => ({ left: b.offsetLeft, width: b.offsetWidth, ready: o.width > 0 })); };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [value]);
  return (
    <div className={`relative flex gap-1 overflow-x-auto rounded-2xl bg-white p-1 shadow-sm ring-1 ring-slate-200 [scrollbar-width:none] dark:bg-white/5 dark:ring-white/10 ${className}`}>
      <span aria-hidden className={`absolute inset-y-1 rounded-xl bg-slate-900 shadow-md dark:bg-white ${pill.ready ? "transition-all duration-500 ease-[cubic-bezier(.3,1.3,.5,1)]" : "transition-none"}`} style={{ left: pill.left, width: pill.width }} />
      {shownTopics.map((t) => {
        const Icon = catIcons[t.id];
        const on = t.id === value;
        return (
          <button key={t.id} ref={(el) => { refs.current[t.id] = el; }} onClick={() => onChange(t.id)} aria-pressed={on}
            className={`relative z-10 flex shrink-0 items-center gap-2 whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-medium transition-colors duration-300 ${on ? "text-white dark:text-slate-900" : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"}`}>
            <Icon className="h-4 w-4" />{t.label}
            {counts && <span className={`text-xs ${on ? "opacity-70" : "text-slate-400"}`}>{countOf(t.id)}</span>}
          </button>
        );
      })}
    </div>
  );
}

export function Pagination({ page, pages, onChange }: { page: number; pages: number; onChange: (p: number) => void }) {
  const tx = useT();
  if (pages < 2) return null;
  const btn = "grid h-10 min-w-10 place-items-center rounded-xl px-3 text-sm font-semibold transition";
  return (
    <nav aria-label={tx("Pages")} className="mt-12 flex items-center justify-center gap-1.5">
      <button onClick={() => onChange(page - 1)} disabled={page === 1} aria-label={tx("Previous page")} className={`${btn} text-slate-600 ring-1 ring-slate-200 hover:bg-white disabled:opacity-40 dark:text-slate-300 dark:ring-white/10 dark:hover:bg-white/5`}><ChevronLeft className="h-4 w-4 rtl:rotate-180" /></button>
      {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
        <button key={n} onClick={() => onChange(n)} aria-current={n === page ? "page" : undefined}
          className={`${btn} ${n === page ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900" : "text-slate-600 hover:bg-white dark:text-slate-300 dark:hover:bg-white/5"}`}>{n}</button>
      ))}
      <button onClick={() => onChange(page + 1)} disabled={page === pages} aria-label={tx("Next page")} className={`${btn} text-slate-600 ring-1 ring-slate-200 hover:bg-white disabled:opacity-40 dark:text-slate-300 dark:ring-white/10 dark:hover:bg-white/5`}><ChevronRight className="h-4 w-4 rtl:rotate-180" /></button>
    </nav>
  );
}

// Infinite scroll: sits under a list showing `shown` of `total` posts and asks for more (`onMore`) when it comes within
// about a screen of the viewport, so new posts are there before the reader reaches the end. It asks again after each
// batch while it is still in reach (tall screens). The button is the fallback for browsers without
// IntersectionObserver; the line above it tells screen readers how many are showing.
export function LoadMore({ shown, total, step, onMore }: { shown: number; total: number; step: number; onMore: () => void }) {
  const tx = useT();
  const ref = useRef<HTMLDivElement>(null);
  const done = shown >= total;
  useEffect(() => {
    const el = ref.current;
    if (done || !el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver((entries) => { if (entries.some((e) => e.isIntersecting)) onMore(); }, { rootMargin: "0px 0px 900px 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, [shown, done, onMore]);
  if (total <= step) return null;
  return (
    <div ref={ref} className="mt-12 flex flex-col items-center gap-3 text-center">
      <p aria-live="polite" className="text-sm text-slate-500 dark:text-slate-400">
        {done ? tx("You've seen all {0} articles.", { 0: total }) : tx("Showing {0} of {1}", { 0: shown, 1: total })}
      </p>
      {!done && (
        <button onClick={onMore} className="rounded-full px-5 py-2.5 text-sm font-semibold text-slate-700 ring-1 ring-slate-200 transition hover:bg-white dark:text-slate-200 dark:ring-white/10 dark:hover:bg-white/5">
          {tx("Show more ({0} left)", { 0: total - shown })}
        </button>
      )}
    </div>
  );
}

export function Empty({ onReset, children = "No articles match that yet." }: { onReset: () => void; children?: ReactNode }) {
  const tx = useT();
  if (typeof children === "string") children = tx(children);
  return (
    <div className="rounded-3xl border border-dashed border-slate-300 p-12 text-center dark:border-white/15">
      <p className="text-slate-600 dark:text-slate-400">{children}</p>
      <button onClick={onReset} className="mt-4 rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white dark:bg-white dark:text-slate-900">{tx("Show all articles")}</button>
    </div>
  );
}

// Newsletter-style call to follow the blog on Telegram.
export function FollowCard({ className = "" }: { className?: string }) {
  const tx = useT();
  return (
    <div className={`rounded-3xl bg-gradient-to-br from-indigo-600 to-fuchsia-500 p-6 text-white ${className}`}>
      <Send className="h-6 w-6" />
      <div className="mt-3 font-display text-lg font-semibold">{tx("New guides on Telegram")}</div>
      <p className="mt-1 text-sm text-white/80">{tx("One short post when something new is out. No spam.")}</p>
      <a href="#" className="mt-4 inline-flex items-center justify-center gap-1.5 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-indigo-700">{tx("Join the channel")}</a>
    </div>
  );
}
