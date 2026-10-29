"use client";

import { useRef, useState } from "react";
import { PageShell, PageTitle } from "../otp/parts";
import { Empty, Pagination, PostWide, Sidebar, topics, useArchive, type CatId } from "./parts";

const PER_PAGE = 6;

// Page B — "Sidebar Archive": the classic blog. Articles as wide rows with a thumbnail and excerpt; a sticky sidebar
// holds search, topics with counts, the most-read list and a Telegram follow card.
export default function BlogListB() {
  const [q, setQ] = useState("");
  const { cat, setCat, list } = useArchive({ q });
  const [page, setPage] = useState(1);
  const top = useRef<HTMLDivElement>(null);

  const pages = Math.max(1, Math.ceil(list.length / PER_PAGE));
  const shown = list.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const pick = (c: CatId) => { setCat(c); setPage(1); };
  const go = (n: number) => { setPage(n); top.current?.scrollIntoView({ behavior: "smooth", block: "start" }); };

  return (
    <PageShell>
      <div ref={top} className="mx-auto max-w-6xl scroll-mt-16 px-6 py-14">
        <PageTitle kicker="Blog" title={cat === "all" ? "All articles" : topics.find((t) => t.id === cat)!.label} sub={`${list.length} article${list.length === 1 ? "" : "s"}${q ? ` matching “${q}”` : ""}`} />

        <div className="mt-10 grid grid-cols-[minmax(0,1fr)] gap-10 lg:grid-cols-[minmax(0,1fr)_300px]">
          <div key={`${cat}-${q}-${page}`}>
            {shown.length === 0 ? <Empty onReset={() => { setQ(""); pick("all"); }} /> : (
              <ul className="space-y-4">
                {shown.map((p, i) => (
                  <li key={p.slug}><PostWide p={p} delay={i * 50} /></li>
                ))}
              </ul>
            )}
            <Pagination page={page} pages={pages} onChange={go} />
          </div>

          <Sidebar q={q} onQ={(v) => { setQ(v); setPage(1); }} cat={cat} onCat={pick} />
        </div>
      </div>
    </PageShell>
  );
}
