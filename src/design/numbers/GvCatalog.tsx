"use client";

import { useMemo, useRef, useState } from "react";
import { AlertCircle, ArrowRight, CheckCircle2, MapPin } from "lucide-react";
import { matches, type GvNumber } from "@/content/google-voice-en";
import { PageShell } from "../otp/parts";
import { useHasExtras } from "../service/slot";
import { Faq, Features, GvCheckout, GvIcon, Guarantees, gvPrice, OrderView, SectionTitle, Steps, useGv } from "../googleVoice/parts";
import { NumberRadios, primary } from "../googleVoice/clean";
import { useLiveGv } from "../googleVoice/live";
import { GreenMesh } from "../social/heroBackdrops";
import { CatalogCard, CatalogHero, CatalogLayout, CatalogPanel, NoMatch, PanelStep, showPanel } from "./kit";
import { cityCards, cityGrid, type City } from "./gvCityCards";
import { useMoney } from "@/lib/money";
import { useT } from "@/i18n/client";

// Google Voice K — "Catalog + Panel": opens like /accounts and /virtual-service (a green and white band, one big
// search for digits, area code or city, the cities with the most numbers as quick picks). Every city in stock is a
// card; picking one lists its numbers in the panel beside the grid, with the price and Buy.
// Live on /google-voice (backend stock and prices); samples in /design previews.
// `card` picks the city card version (gvCityCards.tsx; chosen in /design/page-google-voice-card); none keeps the first card.

const keyOf = (n: GvNumber) => `${n.city}|${n.state}`;

export default function GvCatalog({ card }: { card?: string }) {
  const Card = card ? cityCards[card] : undefined;
  const t = useT();
  const money = useMoney();
  const gv = useGv();
  const live = useLiveGv();
  const extras = useHasExtras();
  const [q, setQ] = useState("");
  const panel = useRef<HTMLDivElement>(null);

  // Cities in stock, the ones with the most numbers first.
  const cities = useMemo<City[]>(() => {
    const by = new Map<string, GvNumber[]>();
    for (const n of gv.numbers) by.set(keyOf(n), [...(by.get(keyOf(n)) ?? []), n]);
    return [...by.entries()].map(([key, numbers]) => ({
      key, city: numbers[0].city, state: numbers[0].state, numbers,
      areas: [...new Set(numbers.map((n) => n.area))].sort(), from: Math.min(...numbers.map(gvPrice)),
    })).sort((a, b) => b.numbers.length - a.numbers.length || a.city.localeCompare(b.city));
  }, [gv.numbers]);

  const firstCity = () => (live?.initialState && cities.find((c) => c.state === live.initialState)?.key) || keyOf(gv.selected);
  const [cityKey, setCityKey] = useState<string>(firstCity);
  const city = cities.find((c) => c.key === cityKey) ?? cities[0];
  const needle = q.trim();
  const list = cities.filter((c) => !needle || c.numbers.some((n) => matches(n, needle)));
  const shownNumbers = city ? city.numbers.filter((n) => !needle || matches(n, needle) || !list.includes(city)) : [];
  const empty = gv.numbers.length === 0;

  const pickCity = (c: City) => {
    setCityKey(c.key);
    if (keyOf(gv.selected) !== c.key) gv.setSelected(c.numbers.find((n) => !needle || matches(n, needle)) ?? c.numbers[0]);
    showPanel(panel.current);
  };

  if (gv.order) return <PageShell><div className="px-6 py-14"><OrderView gv={gv} /></div></PageShell>;

  const from = cities.length ? Math.min(...cities.map((c) => c.from)) : 0;
  const inCity = city && keyOf(gv.selected) === city.key;

  return (
    <PageShell heroDark>
      <CatalogHero id="gv-h1" title={t("Your own permanent US number")} backdrop={<GreenMesh />}
        sub={empty ? t("Calls and texts, on a Google account you control. One payment, no monthly fee.") : t("Calls and texts, on a Google account you control. One payment, from {0}.", { 0: money.format(from) })}
        q={q} setQ={setQ} label={t("Search numbers")} placeholder={t("Area code, digits or city")}
        popular={cities.slice(0, 4).map((c) => ({ key: c.key, name: c.city, on: city?.key === c.key, onPick: () => pickCity(c), icon: <span aria-hidden className="grid h-7 w-7 place-items-center rounded-full bg-emerald-600 text-white"><MapPin className="h-3.5 w-3.5" /></span> }))}
        stats={!empty && (
          // A live dot: the stock comes straight from the supplier.
          <span className="inline-flex animate-fade-up items-center gap-2 rounded-full bg-emerald-800 px-3.5 py-1.5 font-semibold text-white shadow-lg shadow-emerald-900/20 [animation-delay:200ms] [animation-fill-mode:backwards] dark:bg-white/10">
            <span aria-hidden className="relative flex h-2 w-2"><span className="absolute inset-0 animate-[ping-soft_1.8s_ease-out_infinite] rounded-full bg-emerald-300" /><span className="relative h-2 w-2 rounded-full bg-emerald-300" /></span>
            {t("{0} numbers in {1} cities", { 0: gv.numbers.length, 1: cities.length })}
          </span>
        )}>
        <Guarantees animated className="mt-5 justify-center" />
      </CatalogHero>

      <div className="mx-auto max-w-7xl px-4 pb-24 pt-2 sm:px-6">
        {gv.notice && (
          <p role="status" className={`mb-6 flex items-start gap-3 rounded-2xl px-4 py-3 text-sm ring-1 ${gv.notice.good ? "bg-emerald-50 text-emerald-900 ring-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-200 dark:ring-emerald-400/25" : "bg-amber-50 text-amber-900 ring-amber-200 dark:bg-amber-500/10 dark:text-amber-200 dark:ring-amber-400/25"}`}>
            {gv.notice.good ? <CheckCircle2 aria-hidden className="mt-0.5 h-4 w-4 shrink-0" /> : <AlertCircle aria-hidden className="mt-0.5 h-4 w-4 shrink-0" />}{gv.notice.text}
          </p>
        )}

        {empty ? (
          <p className="rounded-3xl border border-dashed border-slate-300 p-10 text-center text-slate-600 dark:border-white/15 dark:text-slate-400">{gv.error ?? t("All Google Voice numbers are sold right now. New ones are added often; check back soon.")}</p>
        ) : (
          <CatalogLayout label={t("Cities")}
            toolbar={<p aria-live="polite" className="text-sm text-slate-600 dark:text-slate-400">{t("{0} cities", { 0: list.length })}</p>}
            panel={city && (
              <CatalogPanel ref={panel}>
                <div key={city.key} className="animate-fade-up [animation-duration:250ms]">
                  <h2 tabIndex={-1} className="flex items-center gap-3 font-display text-xl font-bold text-slate-900 outline-none dark:text-white"><GvIcon />{t("Numbers in {0}", { 0: `${city.city}, ${city.state}` })}</h2>
                  <div className="mt-6">
                    <PanelStep n={1} title={t("Number")} done={!!inCity}>
                      <div className="-m-1 max-h-[420px] overflow-y-auto overscroll-contain p-1 [scrollbar-width:thin]">
                        <NumberRadios legend={t("Numbers in {0}", { 0: city.city })} hideLegend list={shownNumbers} gv={gv} />
                      </div>
                    </PanelStep>
                  </div>
                  <dl className="mt-6 flex items-baseline justify-between gap-4 border-t border-slate-200 pt-4 dark:border-white/10">
                    <dt className="text-slate-600 dark:text-slate-400">{t("One-time price")}</dt>
                    <dd className="font-display text-2xl font-bold tabular-nums text-slate-900 dark:text-white">{money.format(gvPrice(inCity ? gv.selected : shownNumbers[0] ?? city.numbers[0]))}</dd>
                  </dl>
                  <button type="button" onClick={gv.openPay} disabled={!inCity} className={`${primary} mt-4 w-full disabled:cursor-not-allowed disabled:opacity-40`}>
                    {inCity ? <>{t("Buy")}{" "}<span dir="ltr" className="font-mono">{gv.selected.number}</span><ArrowRight aria-hidden className="h-4 w-4 rtl:rotate-180" /></> : t("Pick a number")}
                  </button>
                  <p className="mt-3 text-center text-sm text-slate-600 dark:text-slate-400">{t("Login not working? We replace it or refund you.")}</p>
                </div>
              </CatalogPanel>
            )}>
            {list.length === 0 ? <NoMatch q={q} /> : (
              <ul className={Card && card ? cityGrid[card] : "mt-6 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3"}>
                {list.map((c, i) => (
                  <li key={c.key}>
                    {Card ? (
                      <Card c={c} i={i} price={money.format(c.from)} on={city?.key === c.key} onPick={() => pickCity(c)}
                        label={t("{0}, {1} numbers, from {2}", { 0: `${c.city}, ${c.state}`, 1: c.numbers.length, 2: money.format(c.from) })} />
                    ) : <CatalogCard i={i} accent="emerald" on={city?.key === c.key} onPick={() => pickCity(c)} tint="#34A853"
                      label={t("{0}, {1} numbers, from {2}", { 0: `${c.city}, ${c.state}`, 1: c.numbers.length, 2: money.format(c.from) })}
                      visual={<span aria-hidden className="grid h-12 w-12 place-items-center rounded-2xl bg-white font-display text-sm font-bold text-slate-900 ring-1 ring-slate-200 dark:bg-white/10 dark:text-white dark:ring-white/15">{c.state}</span>}
                      title={c.city} sub={<span dir="ltr" className="inline-block font-mono text-[13px]">{c.areas.map((a) => `(${a})`).join(" ")}</span>}
                      price={<span className="flex flex-wrap items-baseline justify-between gap-x-2"><span>{c.numbers.length === 1 ? t("1 number") : t("{0} numbers", { 0: c.numbers.length })}</span><span>{t("from")}{" "}<b className="text-base text-slate-900 dark:text-white">{money.format(c.from)}</b></span></span>} />}
                  </li>
                ))}
              </ul>
            )}
          </CatalogLayout>
        )}

        <section className="mt-20"><Features /></section>
        {!extras && <section className="mt-20"><SectionTitle kicker={t("How it works")} title={t("Three steps to your US number")} /><div className="mt-8"><Steps /></div></section>}
        {!extras && <section className="mt-20 max-w-3xl"><SectionTitle kicker="FAQ" title={t("Questions about Google Voice")} /><div className="mt-8"><Faq /></div></section>}
      </div>
      {!empty && <GvCheckout gv={gv} />}
    </PageShell>
  );
}
