"use client";

import { useEffect, useRef, useState } from "react";
import { LayoutGrid, List } from "lucide-react";
import { PageShell, PageTitle } from "../otp/parts";
import { Empty, Pagination, PostCard, PostWide, Sidebar, topics, useArchive, type CatId } from "./parts";
import { useT } from "@/i18n/client";

const PER_PAGE = 6;
type View = "grid" | "list";
const VIEW_KEY = "blog-view";

// Page F — "Switchable View" (B + C): B's page with its sidebar filters (search, topics, most read), plus a
// Grid / List switch. Grid (the default on larger screens) is C's cards, two per row beside the sidebar; List (the
// default on phones) is B's wide rows.
// The chosen view is remembered in this browser.
export default function BlogListF({ topic }: { topic?: string }) {
  const tx = useT();
  const [q, setQ] = useState("");
  const [sort, setSort] = useState<"new" | "popular">("new");
  const { cat, setCat, list } = useArchive({ q, sort, initial: topic });
  const [page, setPage] = useState(1);
  const [view, setView] = useState<View>("grid");
  const top = useRef<HTMLDivElement>(null);

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

  const pages = Math.max(1, Math.ceil(list.length / PER_PAGE));
  const shown = list.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const pick = (c: CatId) => { setCat(c); setPage(1); };
  const go = (n: number) => { setPage(n); top.current?.scrollIntoView({ behavior: "smooth", block: "start" }); };

  const seg = (on: boolean) => `flex items-center gap-1.5 rounded-full px-3.5 py-1.5 font-medium transition-colors duration-300 ${on ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900" : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"}`;

  return (
    <PageShell>
      <div ref={top} className="mx-auto max-w-6xl scroll-mt-16 px-6 py-14">
        <PageTitle kicker={tx("Blog")} title={cat === "all" ? tx("All articles") : tx.tr(topics).find((t) => t.id === cat)!.label} sub={tx("Guides, news and how-tos for numbers, accounts and growing your channels.")} />

        <div className="mt-10 grid grid-cols-[minmax(0,1fr)] gap-10 lg:grid-cols-[minmax(0,1fr)_300px]">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="text-sm text-slate-500 dark:text-slate-400"><b className="text-slate-900 dark:text-white">{list.length}</b>{" "}{tx("article")}{list.length === 1 ? "" : "s"}{q && <>{" "}{tx("matching “")}{q}”</>}</span>
              <div className="flex items-center gap-2 text-sm">
                <div className="flex rounded-full bg-white p-1 ring-1 ring-slate-200 dark:bg-white/5 dark:ring-white/10">
                  <button onClick={() => { setSort("new"); setPage(1); }} className={seg(sort === "new")}>{tx("Newest")}</button>
                  <button onClick={() => { setSort("popular"); setPage(1); }} className={seg(sort === "popular")}>{tx("Most read")}</button>
                </div>
                <div role="group" aria-label={tx("View")} className="flex rounded-full bg-white p-1 ring-1 ring-slate-200 dark:bg-white/5 dark:ring-white/10">
                  <button onClick={() => pickView("grid")} aria-pressed={view === "grid"} aria-label={tx("Grid view")} title={tx("Grid view")} className={seg(view === "grid")}><LayoutGrid className="h-4 w-4" /></button>
                  <button onClick={() => pickView("list")} aria-pressed={view === "list"} aria-label={tx("List view")} title={tx("List view")} className={seg(view === "list")}><List className="h-4 w-4" /></button>
                </div>
              </div>
            </div>

            <div key={`${cat}-${q}-${sort}-${page}-${view}`} className="mt-6">
              {shown.length === 0 ? <Empty onReset={() => { setQ(""); pick("all"); }} /> : view === "grid" ? (
                <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2">
                  {shown.map((p, i) => <PostCard key={p.slug} p={p} delay={i * 50} />)}
                </div>
              ) : (
                <ul className="space-y-4">
                  {shown.map((p, i) => <li key={p.slug}><PostWide p={p} delay={i * 50} /></li>)}
                </ul>
              )}
            </div>
            <Pagination page={page} pages={pages} onChange={go} />
          </div>

          <Sidebar q={q} onQ={(v) => { setQ(v); setPage(1); }} cat={cat} onCat={pick} />
        </div>
      </div>
    </PageShell>
  );
}
