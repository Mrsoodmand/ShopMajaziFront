"use client";

import type { CSSProperties } from "react";
import Link from "@/i18n/Link";
import { ArrowRight, CircleX } from "lucide-react";
import { categoryFrom, categoryHref, serviceHref, type SocialCategory } from "@/content/social-categories-en";
import { PageShell } from "../otp/parts";
import { CategoryLogo, fmtFrom, ListBelow, NoMatch, ring, useCategorySearch, wash } from "./listKit";
import { listHeroes } from "./listHero";
import { isRich } from "./heroBackdrops";
import { useLiveSocial } from "./live";
import { useT } from "@/i18n/client";
import { useMoney } from "@/lib/money";

// List F — "Colour Grid" (A × E): A's cards (logo, one-liner, top services as direct links, number of services and
// the lowest price) washed in each platform's own brand colour like E. Featured platforms take E's big tiles in
// the first row; every other platform follows as a smaller card in the same style. The whole card opens the
// platform's page; the service chips sit above that link and open the service directly.
// `hero` picks the top of the page from listHero.tsx (chosen in /design/page-social-list-hero).
// Motion: the cards settle in once, a few at a time; on hover a card lifts slowly, its colour glow swells and the
// logo and arrow follow, all on one long ease-out so it never snaps.

const ease = "ease-[cubic-bezier(0.22,1,0.36,1)]";
const enter = (i: number): CSSProperties => ({ animationName: "card-in", animationDuration: "0.9s", animationTimingFunction: "cubic-bezier(0.22,1,0.36,1)", animationFillMode: "backwards", animationDelay: `${Math.min(i, 10) * 55}ms` });

function Card({ c, big = false, i }: { c: SocialCategory; big?: boolean; i: number }) {
  const tx = useT();
  const money = useMoney();
  return (
    <li style={{ ...wash(c, big ? 14 : 9), ...enter(i) }}
      className={`group relative flex flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white transition-[translate,scale,rotate,box-shadow,border-color] duration-700 ${ease} hover:-translate-y-1 hover:border-slate-300 hover:shadow-[0_18px_40px_-18px_rgba(15,23,42,.28)] dark:border-white/10 dark:bg-[#0E1424] dark:hover:border-white/25 dark:hover:shadow-[0_18px_40px_-18px_rgba(0,0,0,.8)] has-[a.main:focus-visible]:ring-2 has-[a.main:focus-visible]:ring-emerald-600 dark:has-[a.main:focus-visible]:ring-emerald-400 ${big ? "p-6 sm:p-7" : "p-5"}`}>
      <span aria-hidden style={{ backgroundColor: c.color }} className={`pointer-events-none absolute -end-10 -top-10 rounded-full opacity-15 blur-2xl transition-[translate,scale,rotate,opacity] duration-1000 ${ease} group-hover:scale-150 group-hover:opacity-30 ${big ? "h-48 w-48" : "h-32 w-32"}`} />
      <div className={`relative flex gap-4 ${big ? "flex-col" : "items-start"}`}>
        <CategoryLogo c={c} size={big ? "xl" : "lg"} className={`transition-[translate,scale,rotate] duration-700 ${ease} group-hover:-translate-y-0.5 group-hover:scale-[1.06]`} />
        <div className="min-w-0 flex-1">
          <h3 className={`font-display font-bold text-slate-900 dark:text-white ${big ? "text-2xl" : "text-lg"}`}>
            <Link href={categoryHref(c)} className="main outline-none after:absolute after:inset-0 after:rounded-3xl">{tx(c.name)}</Link>
          </h3>
          <p className={`text-slate-700 dark:text-slate-300 ${big ? "mt-1" : "text-sm"}`}>{tx(c.short)}</p>
        </div>
        {!big && <ArrowRight aria-hidden className={`mt-1 h-5 w-5 shrink-0 text-slate-500 transition-[translate,scale,rotate,color] duration-700 ${ease} group-hover:translate-x-1 group-hover:text-slate-900 rtl:rotate-180 rtl:group-hover:-translate-x-1 dark:group-hover:text-white`} />}
      </div>
      <ul aria-label={tx("Popular {0} services", { 0: tx(c.name) })} className="relative z-10 mb-5 mt-5 flex flex-wrap gap-2">
        {c.services.slice(0, 3).map((x) => (
          <li key={x.slug}><Link href={serviceHref(c, x)} className={`inline-flex rounded-full border border-slate-900/10 bg-white/70 px-3 py-1 text-sm font-medium text-slate-800 backdrop-blur-sm transition-[border-color,background-color,color,translate,scale,rotate] duration-500 ${ease} hover:-translate-y-px hover:border-slate-900/30 hover:bg-white dark:border-white/15 dark:bg-white/5 dark:text-slate-200 dark:hover:border-white/40 dark:hover:bg-white/10 ${ring}`}>{tx(x.name)}</Link></li>
        ))}
      </ul>
      <p className="relative mt-auto flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1 border-t border-slate-900/10 pt-4 text-sm dark:border-white/10 [&>span]:whitespace-nowrap">
        <span className="text-slate-700 dark:text-slate-300">{c.services.length === 1 ? tx("1 service") : tx("{0} services", { 0: c.services.length })}</span>
        <span className="flex items-center gap-2 font-semibold tabular-nums text-slate-900 dark:text-white">{fmtFrom(tx, categoryFrom(c), money.format)}{big && <ArrowRight aria-hidden className={`h-4 w-4 text-slate-500 transition-[translate,scale,rotate,color] duration-700 ${ease} group-hover:translate-x-1 group-hover:text-slate-900 rtl:rotate-180 rtl:group-hover:-translate-x-1 dark:group-hover:text-white`} />}</span>
      </p>
    </li>
  );
}

export default function ListF({ hero = "plain", texture, icons, object, bg }: { hero?: string; texture?: string; icons?: string; object?: string; bg?: string }) {
  const tx = useT();
  const money = useMoney();
  const s = useCategorySearch();
  const live = useLiveSocial();
  const H = listHeroes[hero] ?? listHeroes.plain;
  const featured = s.searching ? [] : s.list.filter((c) => c.featured);
  const overlap = H.overlap || (hero === "C" && isRich(bg));
  const rest = s.searching ? s.list : s.list.filter((c) => !c.featured);
  return (
    <PageShell heroDark={H.dark || (hero === "C" && isRich(bg))}>
      <H.Component s={s} texture={texture} icons={icons} object={object} bg={bg} />
      {live?.error && (
        <div className={`mx-auto max-w-6xl px-4 sm:px-6 ${overlap ? "relative z-10 -mt-32 mb-36" : "mt-10"}`}>
          <p role="alert" className="flex items-start gap-2 rounded-2xl border border-red-200 bg-white p-4 font-semibold text-red-700 dark:border-red-400/30 dark:bg-[#0E1424] dark:text-red-400">
            <CircleX aria-hidden className="mt-0.5 h-5 w-5 shrink-0" />
            {live.error}
          </p>
        </div>
      )}
      <div id="platforms" className="mx-auto max-w-6xl scroll-mt-24 px-4 sm:px-6">
        {featured.length > 0 && (
          <section aria-labelledby="pop-h" className={overlap ? "relative z-10 -mt-32" : "mt-10"}>
            <h2 id="pop-h" className="sr-only">{tx("Most popular")}</h2>
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {featured.map((c, i) => <Card key={c.slug} c={c} big i={i} />)}
            </ul>
          </section>
        )}
        <section aria-labelledby="all-h" className={featured.length ? "mt-12" : overlap ? "relative z-10 -mt-32" : "mt-10"}>
          <h2 id="all-h" className={`font-display text-2xl font-bold tracking-tight ${!featured.length && overlap ? "text-white" : "text-slate-900 dark:text-white"}`}>{s.searching ? tx("Results") : tx("More platforms")}</h2>
          {rest.length ? (
            <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {rest.map((c, i) => <Card key={c.slug} c={c} i={i + featured.length} />)}
            </ul>
          ) : s.searching ? <div className="mt-6"><NoMatch s={s} /></div> : null}
        </section>
      </div>
      <ListBelow />
    </PageShell>
  );
}
