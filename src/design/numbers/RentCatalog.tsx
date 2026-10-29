"use client";

import { useRef, useState } from "react";
import { ArrowRight, Globe2, Inbox, Smartphone } from "lucide-react";
import CheckoutModal, { type PayMethod } from "@/components/checkout/CheckoutModal";
import { appFrom, appsFor, durations, endDate, priceApp, priceFor, rentCountries, sampleRentNumber, savingFor, stockFor, type Duration, type RentApp, type RentCountry, type RentMethod } from "@/content/rent-en";
import { AppTile, CC, PageShell } from "../otp/parts";
import { choice, Picked } from "../rent/flow";
import { Heading, Points, RentFaq, RentOrderView, type RentOrder } from "../rent/parts";
import { useHasExtras } from "../service/slot";
import { primary } from "../googleVoice/clean";
import { CatalogCard, CatalogHero, CatalogLayout, CatalogPanel, NoMatch, PanelStep, PopularBadge, Segmented, showPanel } from "./kit";
import { useMoney } from "@/lib/money";
import { useT } from "@/i18n/client";

// Rent K — "Catalog + Panel": opens like /accounts and /virtual-service (brand-colour band, big search, popular
// countries as quick picks). Every country is a card; picking one fills the panel beside the grid: all apps or one
// app, how long, then the app (one app only), and Continue opens the payment window.
// Placeholder prices and stock (rent-en.ts), like the other rent designs.

// The band's colours: emerald (unlimited SMS), sky, violet, amber.
const BAND = ["#10b981", "#0ea5e9", "#8b5cf6", "#f59e0b"];

export default function RentCatalog() {
  const t = useT();
  const usd = useMoney().format;
  const extras = useHasExtras();
  const countries = t.tr(rentCountries);
  const periods = t.tr(durations);
  const [q, setQ] = useState("");
  const [country, setCountry] = useState<RentCountry>(countries.find((c) => c.popular) ?? countries[0]);
  const [method, setMethodRaw] = useState<RentMethod>("all");
  const [period, setPeriod] = useState<Duration | null>(null);
  const [app, setApp] = useState<RentApp | null>(null);
  const [payOpen, setPayOpen] = useState(false);
  const [order, setOrder] = useState<RentOrder | null>(null);
  const panel = useRef<HTMLDivElement>(null);

  const setMethod = (m: RentMethod) => { setMethodRaw(m); setApp(null); };
  const pickCountry = (c: RentCountry) => { setCountry(c); setPeriod(null); setApp(null); showPanel(panel.current); };
  const needle = q.trim().toLowerCase();
  const list = countries.filter((c) => `${c.name} ${c.cc}`.toLowerCase().includes(needle));
  const week = periods[0];

  const ready = !!period && (method === "all" || !!app);
  const price = !period ? 0 : method === "all" ? priceFor(country, period) : app ? priceApp(country, period, app) : 0;
  const buy = (m: PayMethod) => {
    if (!ready || !period) return;
    setOrder({ country, days: period.days, price, number: sampleRentNumber(country.cc), paidWith: m, app: method === "app" ? app! : undefined });
    setPayOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (order) return <PageShell><div className="px-6 py-14"><RentOrderView order={order} onReset={() => { setOrder(null); setPeriod(null); setApp(null); }} /></div></PageShell>;

  return (
    <PageShell heroDark>
      <CatalogHero id="rent-h1" title={t("Rent a number")} colors={BAND}
        sub={t("Your own number for a week to a month, with unlimited SMS. For all your apps, or cheaper for just one.")}
        q={q} setQ={setQ} label={t("Search countries")} placeholder={t("Search a country, e.g. United Kingdom")}
        popular={countries.filter((c) => c.popular).map((c) => ({ key: c.cc, name: c.name, on: country.cc === c.cc, onPick: () => pickCountry(c), icon: <CC cc={c.cc} /> }))}
        stats={t("{0} countries · unlimited SMS · extend any time", { 0: countries.length })} />

      <div className="mx-auto max-w-7xl px-4 pb-24 pt-2 sm:px-6">
        <CatalogLayout label={t("Countries")}
          toolbar={<p aria-live="polite" className="text-sm text-slate-600 dark:text-slate-400">{t("{0} countries", { 0: list.length })}</p>}
          panel={
            <CatalogPanel ref={panel}>
              <div key={country.cc} className="animate-fade-up [animation-duration:250ms]">
                <h2 tabIndex={-1} className="flex items-center gap-3 font-display text-xl font-bold text-slate-900 outline-none dark:text-white"><CC cc={country.cc} />{t("Number in {0}", { 0: country.name })}</h2>
                <div className="mt-5">
                  <Segmented label={t("How do you want to rent?")} value={method} onChange={setMethod}
                    options={[{ id: "all", label: t("All apps"), icon: <Globe2 aria-hidden className="h-4 w-4" /> }, { id: "app", label: t("One app"), icon: <Smartphone aria-hidden className="h-4 w-4" /> }]} />
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{method === "all" ? t("One number takes SMS from any app.") : t("Cheaper, for a single app.")}</p>
                </div>
                <div className="mt-6">
                  <PanelStep n={1} title={t("Rental period")} done={!!period}>
                    <ul className="grid gap-2.5">
                      {periods.map((d) => {
                        const on = period?.days === d.days;
                        const out = stockFor(country, d.days) <= 0;
                        const save = savingFor(d);
                        return (
                          <li key={d.days}>
                            <button type="button" onClick={() => { setPeriod(d); setApp(null); }} aria-pressed={on} disabled={out} className={choice(on, out)}>
                              <span className="flex-1">
                                <span className="block font-semibold text-slate-900 dark:text-white">{d.label}</span>
                                <span className="text-sm text-slate-600 dark:text-slate-400">{out ? t("Out of stock") : <>{d.days}{" "}{t("days")}{save > 0 && <>{" "}{t("· save")}{" "}{save}%</>}</>}</span>
                              </span>
                              {!out && <span className="text-end text-sm text-slate-700 dark:text-slate-300">{method === "app" && t("from")}<span className="block text-base font-bold tabular-nums text-slate-900 dark:text-white">{usd(method === "all" ? priceFor(country, d) : appFrom(country, d))}</span></span>}
                              <Picked on={on} />
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  </PanelStep>
                  {method === "app" && (
                    <PanelStep n={2} title={t("App")} done={!!app}>
                      {!period ? <p className="text-sm text-slate-600 dark:text-slate-400">{t("Choose step")}{" "}1{" "}{t("first")}</p> : (
                        <ul className="-m-1 grid max-h-[340px] gap-2.5 overflow-y-auto overscroll-contain p-1 [scrollbar-width:thin]">
                          {appsFor(country, period).map(({ app: a, price: p, stock }) => {
                            const on = app?.id === a.id;
                            const out = stock <= 0;
                            return (
                              <li key={a.id}>
                                <button type="button" onClick={() => setApp(a)} aria-pressed={on} disabled={out} className={choice(on, out)}>
                                  <AppTile app={a} size="sm" />
                                  <span className="min-w-0 flex-1"><span className="block truncate font-semibold text-slate-900 dark:text-white">{a.name}</span><span className="text-sm text-slate-600 dark:text-slate-400">{out ? t("Out of stock") : t("{0} available", { 0: stock })}</span></span>
                                  {!out && <span className="font-bold tabular-nums text-slate-900 dark:text-white">{usd(p)}</span>}
                                  <Picked on={on} />
                                </button>
                              </li>
                            );
                          })}
                        </ul>
                      )}
                    </PanelStep>
                  )}
                </div>
                <button type="button" onClick={() => setPayOpen(true)} disabled={!ready} className={`${primary} mt-6 w-full disabled:cursor-not-allowed disabled:opacity-40`}>
                  {ready ? <>{t("Continue to payment ·")}{" "}{usd(price)}<ArrowRight aria-hidden className="h-4 w-4 rtl:rotate-180" /></> : method === "app" && period ? t("Pick an app") : t("Pick how long")}
                </button>
                {period && <p className="mt-3 text-center text-sm text-slate-600 dark:text-slate-400">{t("Until")}{" "}{t(endDate(period.days))}{t(" · extend any time")}</p>}
              </div>
            </CatalogPanel>
          }>
          {list.length === 0 ? <NoMatch q={q} /> : (
            <ul className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3">
              {list.map((c, i) => (
                <li key={c.cc}>
                  <CatalogCard i={i} accent="emerald" on={country.cc === c.cc} onPick={() => pickCountry(c)} tint="#10b981"
                    label={t("{0}, from {1} a week", { 0: c.name, 1: usd(priceFor(c, week)) })}
                    visual={<span className="[&>span]:!h-10 [&>span]:!min-w-12 [&>span]:!rounded-lg [&>span]:!text-sm"><CC cc={c.cc} /></span>}
                    badge={c.popular ? <PopularBadge /> : undefined} title={c.name}
                    sub={<span className="inline-flex items-center gap-1.5"><Inbox aria-hidden className="h-3.5 w-3.5" />{t("{0} numbers free", { 0: c.stock })}</span>}
                    price={<>{t("from")}{" "}<b className="text-base text-slate-900 dark:text-white">{usd(priceFor(c, week))}</b>{" "}<span className="whitespace-nowrap">{t("/week")}</span></>} />
                </li>
              ))}
            </ul>
          )}
        </CatalogLayout>

        <section aria-labelledby="why" className="mt-20"><Heading id="why">{t("Why rent a number")}</Heading><div className="mt-6"><Points /></div></section>
        {!extras && <section aria-labelledby="faq" className="mt-16 max-w-3xl"><Heading id="faq">{t("Common questions")}</Heading><div className="mt-6"><RentFaq /></div></section>}
      </div>

      <CheckoutModal open={payOpen && ready} onClose={() => setPayOpen(false)} price={price} itemLabel={period ? t("Rental · {0}", { 0: period.label }) : t("Rental")} payLabel={t("Pay")}
        note={t("No SMS in the first hour? We replace the number.")} onPay={buy}
        summary={period && (
          <>
            {method === "app" && app ? <AppTile app={app} /> : <span aria-hidden className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-emerald-700 text-white dark:bg-emerald-400 dark:text-emerald-950"><Globe2 className="h-5 w-5" /></span>}
            <div className="min-w-0 flex-1">
              <div className="truncate font-semibold text-slate-900 dark:text-white">{method === "app" && app ? t("{0} number", { 0: app.name }) : t("Number for all apps")}</div>
              <div className="flex items-center gap-1.5 truncate text-xs text-slate-500 dark:text-slate-400"><CC cc={country.cc} />{country.name} · {period.label}{" "}{t("· until")}{" "}{t(endDate(period.days))}</div>
            </div>
          </>
        )} />
    </PageShell>
  );
}
