"use client";

import { useId, useRef, useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import { fromPrice, subCats, subs, type SubCat } from "@/content/subs-en";
import { PageShell } from "../otp/parts";
import { field, primary, ring, secondary } from "../googleVoice/clean";
import { catIcon, countIn, ProductButton, ProductSheet, SubsCheckout, SubsFaq, SubsOrderView, SubsTitle, useSubs } from "./parts";

type Kind = "any" | "own" | "ready";
type Sort = "popular" | "low" | "high";

// Page G — "Filter Sidebar": shop-style filters. Categories are checkboxes (pick several) with counts, plus how it's
// delivered and a sort; results update as you change them and the count is announced. On phones the filters open
// in a sheet with a "Show N results" button. Picking a subscription opens its plans in a sheet.
export default function SubsG({ slug }: { slug?: string }) {
  const s = useSubs(slug);
  const [cats, setCats] = useState<SubCat[]>([]);
  const [kind, setKind] = useState<Kind>("any");
  const [sort, setSort] = useState<Sort>("popular");
  const filters = useRef<HTMLDialogElement>(null);
  const sheet = useRef<HTMLDialogElement>(null);
  const sortId = useId(), kindName = useId();
  if (s.order) return <PageShell><div className="px-6 py-14"><SubsOrderView s={s} /></div></PageShell>;

  let list = subs.filter((p) => (!cats.length || cats.includes(p.cat)) && (kind === "any" || p.activation === kind));
  if (sort === "popular") list = [...list].sort((a, b) => Number(!!b.popular) - Number(!!a.popular));
  else list = [...list].sort((a, b) => (fromPrice(a) - fromPrice(b)) * (sort === "low" ? 1 : -1));
  const active = cats.length + (kind !== "any" ? 1 : 0);
  const toggle = (c: SubCat) => setCats((x) => (x.includes(c) ? x.filter((y) => y !== c) : [...x, c]));
  const clear = () => { setCats([]); setKind("any"); };

  // Plain markup (not a component defined here), so ticking a box doesn't rebuild the list and lose keyboard focus.
  // Rendered twice (sidebar, phone sheet), each with its own radio group name.
  const filtersUI = (where: string) => (
    <div className="space-y-8">
      <fieldset>
        <legend className="text-base font-semibold text-slate-900 dark:text-white">Category</legend>
        <div className="mt-3 space-y-1">
          {subCats.map((c) => {
            const Icon = catIcon[c.id];
            return (
              <label key={c.id} className="flex cursor-pointer items-center gap-3 rounded-xl px-2 py-2 hover:bg-slate-100 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-violet-600 dark:hover:bg-white/5 dark:has-[:focus-visible]:ring-violet-400">
                <input type="checkbox" checked={cats.includes(c.id)} onChange={() => toggle(c.id)} className="h-5 w-5 rounded accent-violet-700 dark:accent-violet-400" />
                <Icon aria-hidden className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                <span className="flex-1 text-[15px] text-slate-900 dark:text-white">{c.label}</span>
                <span className="text-sm text-slate-600 dark:text-slate-400">{countIn(c.id)}</span>
              </label>
            );
          })}
        </div>
      </fieldset>
      <fieldset>
        <legend className="text-base font-semibold text-slate-900 dark:text-white">How it's delivered</legend>
        <div className="mt-3 space-y-1">
          {([["any", "Any"], ["own", "On your own account"], ["ready", "Ready account"]] as [Kind, string][]).map(([k, label]) => (
            <label key={k} className="flex cursor-pointer items-center gap-3 rounded-xl px-2 py-2 hover:bg-slate-100 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-violet-600 dark:hover:bg-white/5 dark:has-[:focus-visible]:ring-violet-400">
              <input type="radio" autoComplete="off" name={`${kindName}-${where}`} checked={kind === k} onChange={() => setKind(k)} className="h-5 w-5 accent-violet-700 dark:accent-violet-400" />
              <span className="text-[15px] text-slate-900 dark:text-white">{label}</span>
            </label>
          ))}
        </div>
      </fieldset>
      {active > 0 && <button onClick={clear} className={`${secondary} w-full`}>Clear filters</button>}
    </div>
  );

  return (
    <PageShell>
      <div className="mx-auto max-w-6xl px-4 pb-24 pt-10 sm:px-6 sm:pt-14">
        <SubsTitle>Subscriptions</SubsTitle>

        <div className="mt-8 grid gap-8 lg:grid-cols-[240px_minmax(0,1fr)]">
          <aside aria-label="Filters" className="hidden lg:block"><div className="sticky top-24">{filtersUI("side")}</div></aside>

          <section aria-label="Results">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <p aria-live="polite" className="text-slate-700 dark:text-slate-300"><b className="text-slate-900 dark:text-white">{list.length}</b> {list.length === 1 ? "subscription" : "subscriptions"}</p>
              <div className="flex items-end gap-2">
                <button onClick={() => filters.current?.showModal()} aria-haspopup="dialog" className={`${secondary} py-2.5 lg:hidden`}><SlidersHorizontal aria-hidden className="h-4 w-4" />Filters{active > 0 && ` (${active})`}</button>
                <div>
                  <label htmlFor={sortId} className="block text-sm font-semibold text-slate-900 dark:text-white">Sort by</label>
                  <select id={sortId} value={sort} onChange={(e) => setSort(e.target.value as Sort)} className={`${field} mt-1 appearance-auto py-2.5`}>
                    <option value="popular">Most popular</option><option value="low">Price: low to high</option><option value="high">Price: high to low</option>
                  </select>
                </div>
              </div>
            </div>
            {list.length ? (
              <ul className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {list.map((p) => <li key={p.slug}><ProductButton p={p} on={false} onPick={() => { s.select(p); sheet.current?.showModal(); }} /></li>)}
              </ul>
            ) : (
              <div className="mt-6 rounded-3xl border border-dashed border-slate-300 p-10 text-center dark:border-white/20">
                <p className="text-slate-700 dark:text-slate-300">No subscriptions match these filters.</p>
                <button onClick={clear} className={`${secondary} mt-4`}>Clear filters</button>
              </div>
            )}
          </section>
        </div>

        <section aria-labelledby="faq" className="mt-20 max-w-3xl"><h2 id="faq" className="font-display text-2xl font-bold text-slate-900 dark:text-white">Common questions</h2><div className="mt-6"><SubsFaq /></div></section>
      </div>

      <dialog ref={filters} aria-label="Filters" className="m-0 mt-auto w-full max-w-none rounded-t-[2rem] bg-white p-0 text-slate-900 backdrop:bg-slate-950/50 sm:m-auto sm:max-w-md sm:rounded-[2rem] dark:bg-[#0B1020] dark:text-white">
        <div className="max-h-[88vh] overflow-y-auto p-6">
          <div className="flex items-center justify-between"><h2 className="font-display text-xl font-semibold">Filters</h2><button onClick={() => filters.current?.close()} aria-label="Close" className={`grid h-10 w-10 place-items-center rounded-full bg-slate-100 dark:bg-white/10 ${ring}`}><X aria-hidden className="h-5 w-5" /></button></div>
          <div className="mt-5">{filtersUI("sheet")}</div>
          <button onClick={() => filters.current?.close()} className={`${primary} mt-6 w-full`}>Show {list.length} {list.length === 1 ? "result" : "results"}</button>
        </div>
      </dialog>
      <ProductSheet s={s} dref={sheet} />
      <SubsCheckout s={s} />
    </PageShell>
  );
}
