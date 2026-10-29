"use client";

import { useLayoutEffect, useMemo, useRef, useState, type ReactNode } from "react";
import Link from "@/i18n/Link";
import { ChevronLeft, ChevronRight, Search, LayoutGrid, BookOpen, Smartphone, Apple, Send, Users, Newspaper, type LucideIcon } from "lucide-react";
import { blogCats, postHref, type BlogCat, type Post } from "@/content/blog-en";
import { archive, countOf, mostRead, viewsOf } from "@/content/blog-list-en";
import Cover from "../blog/Cover";
import { Chip, Meta } from "../blog/parts";
import { useT } from "@/i18n/client";

// Pieces shared by the blog list page offers.

export type CatId = BlogCat | "all";
export const catIcons: Record<CatId, LucideIcon> = { all: LayoutGrid, guides: BookOpen, numbers: Smartphone, apple: Apple, telegram: Send, social: Users, news: Newspaper };
// A list page needs a way back to everything, so the topic filters here keep an "All" option.
export const topics: { id: CatId; label: string }[] = [{ id: "all", label: "All" }, ...blogCats];

// Topic + search + sort over the archive.
export const isCat = (v: string | undefined): v is CatId => topics.some((t) => t.id === v);

export function useArchive({ q = "", sort = "new", initial }: { q?: string; sort?: "new" | "popular"; initial?: string } = {}) {
  const tx = useT();
  const [cat, setCat] = useState<CatId>(isCat(initial) ? initial : "all");
  const list = useMemo(() => {
    const t = q.trim().toLowerCase();
    const out = tx.tr(archive).filter((p) => (cat === "all" || p.cat === cat) && (!t || `${p.title} ${p.excerpt}`.toLowerCase().includes(t)));
    return sort === "popular" ? [...out].sort((a, b) => viewsOf(b) - viewsOf(a)) : out;
  }, [cat, q, sort]);
  return { cat, setCat, list };
}

// Vertical article card.
export function PostCard({ p, delay, big = false }: { p: Post; delay?: number; big?: boolean }) {
  return (
    <Link href={postHref(p)} style={delay === undefined ? undefined : { animationDelay: `${delay}ms` }}
      className={`group flex flex-col ${delay === undefined ? "" : "animate-fade-up [animation-duration:450ms]"}`}>
      <Cover cat={p.cat} size={big ? "lg" : "md"} className={`rounded-3xl ${big ? "aspect-[16/10]" : "aspect-[4/3]"}`} />
      <div className="mt-4 px-1">
        <div className="flex flex-wrap items-center gap-3"><Chip p={p} /><Meta p={p} /></div>
        <h3 className={`mt-3 font-display font-semibold leading-snug text-slate-900 transition-colors group-hover:text-indigo-700 dark:text-white dark:group-hover:text-indigo-300 ${big ? "text-2xl sm:text-3xl" : "line-clamp-2 text-lg"}`}>{p.title}</h3>
        <p className={`mt-2 text-slate-600 dark:text-slate-400 ${big ? "text-base" : "line-clamp-2 text-sm"}`}>{p.excerpt}</p>
      </div>
    </Link>
  );
}

// Horizontal article row with a thumbnail.
export function PostRow({ p, compact = false }: { p: Post; compact?: boolean }) {
  return (
    <Link href={postHref(p)} className="group flex items-center gap-4">
      <Cover cat={p.cat} size="sm" className={`shrink-0 rounded-2xl ${compact ? "h-16 w-20" : "h-24 w-32 sm:h-28 sm:w-40"}`} />
      <div className="min-w-0 flex-1">
        {!compact && <Chip p={p} />}
        <h3 className={`line-clamp-2 font-display font-semibold leading-snug text-slate-900 transition-colors group-hover:text-indigo-700 dark:text-white dark:group-hover:text-indigo-300 ${compact ? "text-sm" : "mt-2 text-base sm:text-lg"}`}>{p.title}</h3>
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
      <Cover cat={p.cat} size="sm" className="h-24 w-24 shrink-0 rounded-2xl sm:h-36 sm:w-52" />
      <div className="min-w-0 flex-1 sm:pe-4">
        <div className="hidden flex-wrap items-center gap-3 sm:flex"><Chip p={p} /><Meta p={p} /></div>
        <div className="sm:hidden"><Chip p={p} /></div>
        <h2 className="mt-2 line-clamp-3 font-display text-base font-semibold leading-snug sm:mt-3 sm:line-clamp-none text-slate-900 transition-colors group-hover:text-indigo-700 sm:text-xl dark:text-white dark:group-hover:text-indigo-300">{p.title}</h2>
        <div className="mt-1.5 sm:hidden"><Meta p={p} /></div>
        <p className="mt-2 line-clamp-2 hidden text-sm text-slate-600 sm:block dark:text-slate-400">{p.excerpt}</p>
      </div>
    </Link>
  );
}

// Page B's sidebar: search, topics with counts, most read and the Telegram card.
export function Sidebar({ q, onQ, cat, onCat }: { q: string; onQ: (q: string) => void; cat: CatId; onCat: (c: CatId) => void }) {
  const tx = useT();
  return (
    <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
      <label className="flex items-center gap-2 rounded-2xl bg-white px-4 py-3 ring-1 ring-slate-200 focus-within:ring-2 focus-within:ring-indigo-500 dark:bg-white/5 dark:ring-white/10">
        <Search className="h-4 w-4 text-slate-400" />
        <input value={q} onChange={(e) => onQ(e.target.value)} placeholder={tx("Search articles")} className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400 dark:text-white" />
      </label>

      <div className="rounded-3xl bg-white p-3 ring-1 ring-slate-200 dark:bg-[#0E1424] dark:ring-white/10">
        <div className="px-3 pb-2 pt-1 text-xs font-semibold uppercase tracking-widest text-slate-400">{tx("Topics")}</div>
        {tx.tr(topics).map((t) => {
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
          {tx.tr(mostRead).slice(0, 5).map((p, i) => (
            <li key={p.slug}>
              <Link href={postHref(p)} className="group flex gap-3">
                <span className="font-display text-2xl font-bold leading-none text-indigo-200 dark:text-white/15">{i + 1}</span>
                <span className="text-sm font-medium leading-snug text-slate-800 group-hover:text-indigo-700 dark:text-slate-200 dark:group-hover:text-indigo-300">{p.title}</span>
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
  const tx = useT();
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
      {tx.tr(topics).map((t) => {
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
