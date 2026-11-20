"use client";

import { useCallback, useEffect, useState } from "react";
import { LayoutGrid, List } from "lucide-react";
import { PageShell, PageTitle } from "../otp/parts";
import { Empty, LoadMore, PostCard, PostWide, Sidebar, TopicTabs, topics, useArchive, type CatId } from "./parts";
import { SearchInput } from "../search";
import { useT } from "@/i18n/client";
import { useLiveBlog } from "../blog/live";

// Posts shown at first, and added each time the reader nears the end (infinite scroll). Even, for the two-column grid.
const STEP = 8;
type View = "grid" | "list";
const VIEW_KEY = "blog-view";

// Page F — "Switchable View" (B + C): B's page with its sidebar filters (search, topics, most read), plus a
// Grid / List switch. Grid (the default on larger screens) is C's cards, two per row beside the sidebar; List (the
// default on phones) is B's wide rows.
// The chosen view is remembered in this browser. More posts load as you scroll; a new topic, search or sort starts
// again from the top of the list. Below lg, search and topic tabs sit above the list (the sidebar is under it there,
// out of reach while posts keep loading).
export default function BlogListF({ topic }: { topic?: string }) {
  const tx = useT();
  const live = useLiveBlog();
  const [q, setQ] = useState("");
  const [sort, setSort] = useState<"new" | "popular">("new");
  const { cat, setCat, list } = useArchive({ q, sort, initial: topic });
  const [count, setCount] = useState(STEP);
  const [view, setView] = useState<View>("grid");

  // A saved choice wins; otherwise phones start in the list view and larger screens in the grid.
  useEffect(() => {
    let saved: string | null = null;
    try { saved = localStorage.getItem(VIEW_KEY); } catch {}
    if (saved === "grid" || saved === "list") setView(saved);
    else if (window.matchMedia("(max-width: 767px)").matches) setView("list");
  }, []);
  // Keep ?topic= in the address bar so a filtered list can be shared or bookmarked.
  useEffect(() => {
    const url = new URL(window.location.href);
    if (cat === "all") url.searchParams.delete("topic"); else url.searchParams.set("topic", cat);
    window.history.replaceState(null, "", url);
    if (url.pathname === "/blog") document.title = cat === "all" ? tx("Blog: guides, news and how-tos — ShopMajazi") : tx("{0} articles — ShopMajazi blog", { 0: tx.tr(topics).find((t) => t.id === cat)!.label });
  }, [cat]);
  const pickView = (v: View) => { setView(v); try { localStorage.setItem(VIEW_KEY, v); } catch {} };

  const shown = list.slice(0, count);
  const more = useCallback(() => setCount((n) => n + STEP), []);
  const restart = () => setCount(STEP);
  const pick = (c: CatId) => { setCat(c); restart(); };

  const seg = (on: boolean) => `flex items-center gap-1.5 rounded-full px-3.5 py-1.5 font-medium transition-colors duration-300 ${on ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900" : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"}`;

  return (
    <PageShell>
      <div className="mx-auto max-w-6xl px-6 py-14">
        <PageTitle kicker={tx("Blog")} title={cat === "all" ? tx("All articles") : tx.tr(topics).find((t) => t.id === cat)!.label} sub={tx("Guides, news and how-tos for numbers, accounts and growing your channels.")} />

        <div className="mt-10 grid grid-cols-[minmax(0,1fr)] gap-10 lg:grid-cols-[minmax(0,1fr)_300px]">
          <div>
            <div className="mb-6 space-y-3 lg:hidden">
              <SearchInput small value={q} onChange={(v) => { setQ(v); restart(); }} label={tx("Search articles")} />
              <TopicTabs value={cat} onChange={pick} />
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="text-sm text-slate-500 dark:text-slate-400"><b className="text-slate-900 dark:text-white">{list.length}</b>{" "}{list.length === 1 ? tx("article") : tx("articles")}{q && <>{" "}{tx("matching “")}{q}”</>}</span>
              <div className="flex items-center gap-2 text-sm">
                <div className="flex rounded-full bg-white p-1 ring-1 ring-slate-200 dark:bg-white/5 dark:ring-white/10">
                  <button onClick={() => { setSort("new"); restart(); }} className={seg(sort === "new")}>{tx("Newest")}</button>
                  <button onClick={() => { setSort("popular"); restart(); }} className={seg(sort === "popular")}>{tx("Most read")}</button>
                </div>
                <div role="group" aria-label={tx("View")} className="flex rounded-full bg-white p-1 ring-1 ring-slate-200 dark:bg-white/5 dark:ring-white/10">
                  <button onClick={() => pickView("grid")} aria-pressed={view === "grid"} aria-label={tx("Grid view")} title={tx("Grid view")} className={seg(view === "grid")}><LayoutGrid className="h-4 w-4" /></button>
                  <button onClick={() => pickView("list")} aria-pressed={view === "list"} aria-label={tx("List view")} title={tx("List view")} className={seg(view === "list")}><List className="h-4 w-4" /></button>
                </div>
              </div>
            </div>

            <div key={`${cat}-${q}-${sort}-${view}`} className="mt-6">
              {live?.error ? (
                <p role="alert" className="rounded-3xl border border-dashed border-slate-300 p-12 text-center text-slate-600 dark:border-white/15 dark:text-slate-400">{live.error}</p>
              ) : shown.length === 0 ? <Empty onReset={() => { setQ(""); pick("all"); }} /> : view === "grid" ? (
                <div className="grid gap-6 sm:grid-cols-2">
                  {shown.map((p, i) => <PostCard key={p.slug} p={p} delay={(i % STEP) * 50} />)}
                </div>
              ) : (
                <ul className="space-y-4">
                  {shown.map((p, i) => <li key={p.slug}><PostWide p={p} delay={(i % STEP) * 50} /></li>)}
                </ul>
              )}
            </div>
            {!live?.error && <LoadMore shown={shown.length} total={list.length} step={STEP} onMore={more} />}
          </div>

          <Sidebar q={q} onQ={(v) => { setQ(v); restart(); }} cat={cat} onCat={pick} filtersAbove />
        </div>
      </div>
    </PageShell>
  );
}
