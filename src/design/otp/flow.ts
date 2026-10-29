"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { offersFor, offersInCountry, operatorsFor, otpApps, otpCountries, type OtpApp, type OtpCountry, type OtpOffer, type OtpOperator } from "@/content/otp-en";
import { useOtpOrders, type Order, type OrderStore, type PayMethod } from "./order";

// The buying flow shared by the page designs:
//   app ⇄ country (either can come first) → operator → buy → order view.
export type First = "app" | "country";
export type Step = "first" | "second" | "operator" | "order";

// Where apps, countries, prices and operators come from. `null` means "still loading".
// The mock source (placeholder data) serves the design previews; the live page uses useLiveOtpSource (backend).
export type OtpSource = {
  apps: OtpApp[];
  countries: OtpCountry[];
  appsFrom: OtpOffer[]; // cheapest offer per app, before a country is picked
  countriesFrom: OtpOffer[]; // cheapest offer per country, before an app is picked
  forApp: (appId: string) => OtpOffer[] | null; // countries for one app, exact prices
  inCountry: (cc: string) => OtpOffer[] | null; // apps in one country, exact prices
  operators: (appId: string, cc: string) => OtpOperator[] | null;
  need?: (appId: string | null, cc: string | null) => void; // load what these choices need
  error?: string | null;
};

const cheapestOf = (list: OtpOffer[]) => list.reduce((x, y) => (y.price < x.price ? y : x));
let mock: OtpSource | null = null;
export const mockOtpSource = (): OtpSource => (mock ??= {
  apps: otpApps, countries: otpCountries,
  appsFrom: otpApps.map((a) => cheapestOf(offersFor(a.id))),
  countriesFrom: otpCountries.map((c) => cheapestOf(offersInCountry(c.cc))),
  forApp: offersFor, inCountry: offersInCountry, operators: operatorsFor,
});

// `defaults` pre-selects an app and/or country (e.g. Telegram), so the page can open on a later step;
// `codeAfterMs` sets how long the demo takes to "receive" the code. `store` replaces the demo orders (live page).
export function useOtpFlow(initialFirst: First = "app", defaults: { appId?: string; cc?: string; codeAfterMs?: number } = {}, source: OtpSource = mockOtpSource(), store?: OrderStore) {
  const [first, setFirstRaw] = useState<First>(initialFirst);
  const [appId, setAppId] = useState<string | null>(defaults.appId ?? null);
  const [cc, setCc] = useState<string | null>(defaults.cc ?? null);
  const [opId, setOpId] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);
  const demo = useOtpOrders(defaults.codeAfterMs);
  const { orders, buy, cancel, minutes } = store ?? demo;
  const check = store?.check ?? (async () => {});
  // Active numbers: every order seen waiting during this visit, so one keeps its card after its code arrives.
  const seenWaiting = useRef(new Set<string>());
  for (const o of orders) if (o.status === "waiting") seenWaiting.current.add(o.id);
  const activeOrders = orders.filter((o) => seenWaiting.current.has(o.id));

  const { need } = source;
  // App first: the app's offers cover the country list and the operators, so a country's offers aren't needed.
  const needCc = first === "app" && appId ? null : cc;
  useEffect(() => { need?.(appId, needCc); }, [need, appId, needCc]);

  const app = source.apps.find((a) => a.id === appId) ?? null;
  const country = source.countries.find((c) => c.cc === cc) ?? null;

  // Lists for each step. Apps keep the catalog order (the admin's sort); countries go cheapest first.
  // App first: the app list is always the whole catalog with "from" prices, so it never waits on a country.
  // Country first: it lists only the apps sold in that country, at that country's prices.
  const appsByCountry = first === "country" && !!cc;
  const appExact = appsByCountry ? source.inCountry(cc!) : null;
  const countryExact = appId ? source.forApp(appId) : null;
  const appsLoading = appsByCountry && !appExact;
  const countriesLoading = !!appId && !countryExact;
  const appOrder = useMemo(() => new Map(source.apps.map((a, i) => [a.id, i])), [source.apps]);
  const appOptions = useMemo(() => (appsByCountry ? appExact ?? [] : source.appsFrom).slice()
    .sort((a, b) => (appOrder.get(a.app.id) ?? 1e9) - (appOrder.get(b.app.id) ?? 1e9)), [appsByCountry, appExact, source.appsFrom, appOrder]);
  const appsPriced: "exact" | "from" = appsByCountry ? "exact" : "from";
  const countryOptions = useMemo(() => (appId ? countryExact ?? [] : source.countriesFrom).slice().sort((a, b) => a.price - b.price), [appId, countryExact, source.countriesFrom]);
  const opsOrNull = appId && cc ? source.operators(appId, cc) : null;
  const operators = useMemo(() => opsOrNull ?? [], [opsOrNull]);
  const operatorsLoading = !!appId && !!cc && !opsOrNull;
  const operator = operators.find((o) => o.id === opId) ?? null;
  const offer: OtpOffer | null = (appId && cc && (countryExact ?? appExact)?.find((o) => o.country.cc === cc && o.app.id === appId)) || null;
  const order: Order | undefined = orders.find((o) => o.id === orderId);

  const step: Step = order ? "order"
    : first === "app" ? (!appId ? "first" : !cc ? "second" : "operator")
    : (!cc ? "first" : !appId ? "second" : "operator");

  const pickApp = (id: string) => { setAppId(id); setOpId(null); };
  const pickCountry = (c: string) => { setCc(c); setOpId(null); };
  const pickOperator = (id: string) => setOpId(id);
  const clearApp = () => { setAppId(null); setOpId(null); };
  const clearCountry = () => { setCc(null); setOpId(null); };
  const clearOperator = () => setOpId(null);
  // Switching which comes first starts over, so the steps always read top to bottom.
  const setFirst = (f: First) => { setFirstRaw(f); setAppId(null); setCc(null); setOpId(null); };
  const back = () => {
    if (step === "operator") { if (first === "app") setCc(null); else setAppId(null); setOpId(null); }
    else if (step === "second") { if (first === "app") setAppId(null); else setCc(null); }
  };
  // Rejects when the purchase fails (live: balance, stock, price change…), so the payment modal can say why.
  const purchase = async (op: OtpOperator | null = operator, paidWith?: PayMethod) => { if (!offer || !op) return; setOrderId((await buy(offer, op, paidWith)).id); };
  const startOver = () => { setOrderId(null); setAppId(null); setCc(null); setOpId(null); };
  // "Same again": back to the operator step with this order's app, country and server picked, so the buyer pays
  // again through the payment modal (never charged without confirming).
  // `id` picks another order than the one on screen (the active-number cards). Buttons may pass a click event.
  const sameAgain = (id?: unknown) => {
    const o = typeof id === "string" ? orders.find((x) => x.id === id) : order;
    if (!o) return;
    setAppId(o.offer.app.id); setCc(o.offer.country.cc); setOpId(o.operator?.id ?? null); setOrderId(null);
  };

  return {
    first, setFirst, step, back,
    app, country, operator, offer, order, orders, activeOrders,
    minutes, appOptions, appsPriced, countryOptions, operators, appsLoading, countriesLoading, operatorsLoading, loadError: source.error ?? null,
    pickApp, pickCountry, pickOperator, clearApp, clearCountry, clearOperator, purchase, cancel, check, startOver, sameAgain,
    showOrder: setOrderId,
  };
}
export type OtpFlow = ReturnType<typeof useOtpFlow>;
