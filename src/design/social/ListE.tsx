"use client";

import Link from "@/i18n/Link";
import { ArrowRight } from "lucide-react";
import { categoryFrom, categoryHref, type SocialCategory } from "@/content/social-categories-en";
import { PageShell } from "../otp/parts";
import { CategoryLogo, fmtFrom, ListBelow, ListTitle, NoMatch, ring, SearchField, SearchStatus, useCategorySearch, wash } from "./listKit";
import { useT } from "@/i18n/client";
import { useMoney } from "@/lib/money";

// List E — "Colour Bento": every platform is a tile washed in its own brand colour (the one the admin picks), so
// the page reads like a wall of the apps people know. Featured platforms take the big tiles (the first one twice as
// wide), the rest fill a tighter grid; any number of platforms flows into it. Plain site theme around the tiles.

function Tile({ c, big = false, wide = false }: { c: SocialCategory; big?: boolean; wide?: boolean }) {
  const tx = useT();
  const money = useMoney();
  return (
    <li className={wide ? "sm:col-span-2" : ""}>
      <Link href={categoryHref(c)} style={wash(c, big ? 14 : 10)}
        className={`group relative flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 transition-[translate,scale,rotate,box-shadow] hover:-translate-y-0.5 hover:shadow-lg hover:shadow-slate-900/10 dark:border-white/10 dark:bg-[#0E1424] ${big ? "min-h-56 sm:p-7" : "min-h-36"} ${ring}`}>
        <span aria-hidden style={{ backgroundColor: c.color }} className={`pointer-events-none absolute -end-10 -top-10 rounded-full opacity-15 blur-2xl ${big ? "h-48 w-48" : "h-28 w-28"}`} />
        <CategoryLogo c={c} size={big ? "xl" : "md"} />
        <span className={`mt-auto pt-5 font-display font-bold text-slate-900 dark:text-white ${big ? "text-2xl" : "text-lg"}`}>{tx(c.name)}</span>
        {big && <span className="mt-1 text-slate-700 dark:text-slate-300">{tx(c.short)}</span>}
        <span className="mt-1 flex items-center justify-between gap-2 text-sm tabular-nums text-slate-700 dark:text-slate-300">
          {fmtFrom(tx, categoryFrom(c), money.format)}
          <ArrowRight aria-hidden className="h-4 w-4 text-slate-500 transition-[translate,scale,rotate] group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5" />
        </span>
      </Link>
    </li>
  );
}

export default function ListE() {
  const tx = useT();
  const money = useMoney();
  const s = useCategorySearch();
  const featured = s.searching ? [] : s.list.filter((c) => c.featured);
  const rest = s.searching ? s.list : s.list.filter((c) => !c.featured);
  return (
    <PageShell>
      <div className="mx-auto max-w-6xl px-4 pt-12 sm:px-6">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-end">
          <div><ListTitle /></div>
          <SearchField s={s} />
        </div>
        <SearchStatus s={s} />
        {featured.length > 0 && (
          <section aria-labelledby="pop-h" className="mt-10">
            <h2 id="pop-h" className="sr-only">{tx("Most popular")}</h2>
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {featured.map((c, i) => <Tile key={c.slug} c={c} big wide={i === 0 && featured.length % 2 === 1} />)}
            </ul>
          </section>
        )}
        <section aria-labelledby="all-h" className="mt-10">
          <h2 id="all-h" className="font-display text-2xl font-bold tracking-tight text-slate-900 dark:text-white">{s.searching ? tx("Results") : tx("More platforms")}</h2>
          {rest.length ? (
            <ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
              {rest.map((c) => <Tile key={c.slug} c={c} />)}
            </ul>
          ) : s.searching ? <div className="mt-6"><NoMatch s={s} /></div> : null}
        </section>
      </div>
      <ListBelow />
    </PageShell>
  );
}
