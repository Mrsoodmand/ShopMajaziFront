"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Check, Globe2, Info, Smartphone } from "lucide-react";
import { cheapest } from "@/content/otp-en";
import { mockOtpSource, useOtpFlow, type OtpSource } from "../otp/flow";
import { useLiveOtp, type LiveOtp } from "../otp/live";
import { useLiveOtpSource } from "../otp/liveSource";
import { useLiveOrders } from "../otp/liveOrders";
import type { OrderStore } from "../otp/order";
import { LoadingRows } from "../otp/Choices";
import { OrderView } from "../otp/flowParts";
import { RecentNumbers } from "./recentNumbers";
import PayModal from "../otp/PayModal";
import ActiveOrders from "../otp/ActiveOrders";
import { orderViews, type OrderViewId } from "../otp/order-screen/views";
import { AppTile, Assurances, CC, PageShell, PageTitle } from "../otp/parts";
import { usePaymentResult } from "../otp/OtpL";
import { appTint, CatalogCard, CatalogSearch, CatalogHero, CatalogLayout, CatalogPanel, NoMatch, PopularBadge, Segmented, showPanel } from "./kit";
import { itemsOf, otpPanels, type PanelProps } from "./otpPanels";
import { appCards, cardGrid, FlagTile, RingCard } from "./otpCards";
import { useMoney } from "@/lib/money";
import { useT } from "@/i18n/client";

// Virtual number P — "Catalog + Panel": the page opens like /accounts and /virtual-service, with a brand-colour
// band, one big search and the popular apps as quick picks. Below, every app as a colour-washed card (or every
// country, with "By country"); picking one fills the panel beside the grid: country (or app), then operator and
// Continue, which opens the payment window. Opens on Telegram with its cheapest country picked.
// Live on /virtual-number (backend data, see live.tsx); placeholder data in /design previews.

const DEFAULT_APP = "telegram";
const PAGE = 24; // cards shown before "Show more"
// The band's colours: WhatsApp, Telegram, Instagram, indigo (the page's own accent).
const BAND = ["#25D366", "#229ED9", "#DD2A7B", "#6366f1"];

// `panel` picks the panel version (otpPanels.tsx; chosen in /design/page-otp-panel).
// `card` picks the app card version (otpCards.tsx; chosen in /design/page-otp-card); none keeps the first card.
// `previewOrder` buys right away (design previews of the order screens).
type Props = { orderView?: string; panel?: string; card?: string; previewOrder?: boolean };

export default function OtpCatalog(props: Props) {
  const live = useLiveOtp();
  return live ? <Live {...props} live={live} /> : <View {...props} source={mockOtpSource()} appId={DEFAULT_APP} cc={cheapest(DEFAULT_APP).country.cc} />;
}

function Live({ live, ...props }: Props & { live: LiveOtp }) {
  const source = useLiveOtpSource(live.catalog, live.locale, live.preload, live.error);
  const store = useLiveOrders(live.catalog, live.locale);
  return <View {...props} source={source} store={store} appId={live.defaultApp} cc={live.defaultCc} />;
}

function View({ orderView, panel: panelId, card: cardId, previewOrder = false, source, store, appId, cc }: Props & { source: OtpSource; store?: OrderStore & { loaded: boolean }; appId?: string; cc?: string }) {
  const t = useT();
  const usd = useMoney().format;
  const f = useOtpFlow("app", { appId, cc, codeAfterMs: previewOrder ? 30_000 : undefined }, source, store);
  const bought = useRef(false);
  useEffect(() => {
    if (!previewOrder || bought.current || !f.operators[0]) return;
    bought.current = true;
    f.purchase(f.operators[0], "wallet");
  }, [previewOrder, f]);
  const [q, setQ] = useState("");
  const [shown, setShown] = useState(PAGE);
  const [payOpen, setPayOpen] = useState(false);
  const payResult = usePaymentResult(!!store);
  const panel = useRef<HTMLDivElement>(null);

  // Live: a number still waiting for its code (bought earlier, page reloaded) opens straight on its order screen.
  const resumed = useRef(false);
  useEffect(() => {
    if (!store?.loaded || resumed.current) return;
    resumed.current = true;
    const waiting = store.orders.find((o) => o.status === "waiting");
    if (waiting) f.showOrder(waiting.id);
  }, [store?.loaded, store?.orders, f]);

  const byApp = f.first === "app";
  const needle = q.trim().toLowerCase();
  // The grid: every app with its "from" price (admin's order), or every country cheapest first.
  const rank = useMemo(() => new Map(source.apps.map((a, i) => [a.id, i])), [source.apps]);
  const apps = useMemo(() => source.appsFrom.filter((o) => `${o.app.name} ${o.app.alt ?? ""}`.toLowerCase().includes(needle))
    .sort((a, b) => (rank.get(a.app.id) ?? 1e9) - (rank.get(b.app.id) ?? 1e9)), [source.appsFrom, rank, needle]);
  const countries = useMemo(() => source.countriesFrom.filter((o) => `${o.country.name} ${o.country.alt ?? ""} ${o.country.cc}`.toLowerCase().includes(needle))
    .slice().sort((a, b) => a.price - b.price), [source.countriesFrom, needle]);
  const total = byApp ? apps.length : countries.length;
  useEffect(() => setShown(PAGE), [needle, byApp]);

  const OrderScreen = (orderView && orderViews[orderView as OrderViewId]) || OrderView;
  const flow = { ...f, sameAgain: (id?: unknown) => { f.sameAgain(id); setPayOpen(true); } };

  if (f.step === "order" && f.order) return (
    <PageShell>
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <PageTitle title={t("Virtual numbers")} sub={t("Your number is ready. Keep this page open; the code shows up here by itself.")} />
        {/* items-start: the order card keeps its own height instead of stretching to the list beside it. */}
        <div className={`mt-10 grid grid-cols-[minmax(0,1fr)] items-start gap-6 ${f.orders.filter((o) => o.number).length > 1 ? "lg:grid-cols-[minmax(0,1fr)_320px]" : ""}`}>
          <OrderScreen order={f.order} flow={flow} />
          <div className="lg:sticky lg:top-24"><RecentNumbers flow={flow} /></div>
        </div>
      </div>
    </PageShell>
  );

  const Panel = otpPanels[panelId ?? "A"] ?? otpPanels.A;
  const Card = cardId ? appCards[cardId] : undefined;
  const panelProps: PanelProps = {
    f, byApp, items: itemsOf(f, byApp), value: byApp ? f.country?.cc ?? null : f.app?.id ?? null,
    pick: (id) => (byApp ? f.pickCountry(id) : f.pickApp(id)), loading: byApp ? f.countriesLoading : f.appsLoading,
    listTitle: byApp ? t("Country") : t("App"), searchLabel: byApp ? t("Search countries") : t("Search apps"), onPay: () => setPayOpen(true),
  };
  const pickApp = (id: string) => { if (!byApp) f.setFirst("app"); f.pickApp(id); if (byApp) f.clearCountry(); showPanel(panel.current); };
  const pickCountry = (c: string) => { f.pickCountry(c); f.clearApp(); showPanel(panel.current); };
  const popular = source.apps.filter((a) => a.popular).slice(0, 5);

  return (
    <PageShell heroDark>
      <CatalogHero id="otp-h1" title={t("Virtual numbers")} colors={BAND}
        sub={t("A number for one SMS code: WhatsApp, Telegram, Google, ChatGPT and thousands more. No code, no charge.")}
        popular={popular.map((a) => ({ key: a.id, name: a.name, on: byApp && f.app?.id === a.id, onPick: () => pickApp(a.id), icon: <span className="[&>span]:!h-7 [&>span]:!w-7 [&>span]:!rounded-full [&>span]:!text-xs"><AppTile app={a} size="sm" /></span> }))}
        stats={source.apps.length > 0 && t("{0} apps · {1} countries", { 0: source.apps.length.toLocaleString("en-US"), 1: source.countries.length })} />

      <div className="mx-auto max-w-7xl px-4 pb-24 pt-2 sm:px-6">
        {payResult && (
          <p role="status" className={`mb-6 flex items-start gap-2 rounded-2xl px-4 py-3 text-sm ${payResult.good ? "bg-emerald-50 text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-200" : "bg-amber-50 text-amber-800 dark:bg-amber-500/10 dark:text-amber-200"}`}>
            {payResult.good ? <Check className="mt-0.5 h-4 w-4 shrink-0" /> : <Info className="mt-0.5 h-4 w-4 shrink-0" />}{payResult.text}
          </p>
        )}
        {f.loadError && <p role="alert" className="mb-6 rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:bg-rose-500/10 dark:text-rose-300">{f.loadError}</p>}
        <ActiveOrders flow={flow} className="mb-6" />

        <CatalogLayout label={t("Catalog")}
          toolbar={
            // The search sits at the start of the switch (its right in Persian) and filters the cards below.
            <div>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <CatalogSearch q={q} setQ={setQ} label={byApp ? t("Search apps") : t("Search countries")} placeholder={byApp ? t("Search an app, e.g. WhatsApp") : t("Search a country, e.g. Germany")} className="min-w-0 flex-1" />
                <div className="shrink-0"><Segmented label={t("Start with")} value={f.first} onChange={(v) => v !== f.first && f.setFirst(v)}
                  options={[{ id: "app", label: t("By app"), icon: <Smartphone aria-hidden className="h-4 w-4" /> }, { id: "country", label: t("By country"), icon: <Globe2 aria-hidden className="h-4 w-4" /> }]} /></div>
              </div>
              <p aria-live="polite" className="mt-3 text-sm text-slate-600 dark:text-slate-400">{byApp ? t("{0} apps", { 0: total.toLocaleString("en-US") }) : t("{0} countries", { 0: total })}</p>
            </div>
          }
          panel={
            <CatalogPanel ref={panel}>
              {byApp ? (
                f.app ? (
                  <div key={f.app.id} className="animate-fade-up [animation-duration:250ms]">
                    <h2 tabIndex={-1} className="flex items-center gap-3 font-display text-xl font-bold text-slate-900 outline-none dark:text-white"><AppTile app={f.app} />{t("{0} number", { 0: f.app.name })}</h2>
                    <div className="mt-6"><Panel {...panelProps} /></div>
                  </div>
                ) : <Empty icon={<Smartphone aria-hidden className="mx-auto h-8 w-8 text-indigo-600 dark:text-indigo-400" />} title={t("Pick an app")} text={t("Its countries and prices show here.")} />
              ) : (
                f.country ? (
                  <div key={f.country.cc} className="animate-fade-up [animation-duration:250ms]">
                    <h2 tabIndex={-1} className="flex items-center gap-3 font-display text-xl font-bold text-slate-900 outline-none dark:text-white"><CC cc={f.country.cc} flag={f.country.flag} />{t("Numbers in {0}", { 0: f.country.name })}</h2>
                    <div className="mt-6"><Panel {...panelProps} /></div>
                  </div>
                ) : <Empty icon={<Globe2 aria-hidden className="mx-auto h-8 w-8 text-indigo-600 dark:text-indigo-400" />} title={t("Pick a country")} text={t("The apps it has numbers for show here.")} />
              )}
            </CatalogPanel>
          }>
          {total === 0 ? (source.apps.length === 0 && !f.loadError ? <div className="mt-6"><LoadingRows /></div> : needle ? <NoMatch q={q} /> : null) : (
            <ul className={`mt-6 ${cardId && cardGrid[cardId] && (byApp || cardId === "C") ? cardGrid[cardId] : "grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-3 xl:grid-cols-4"}`}>
              {byApp
                ? apps.slice(0, shown).map((o, i) => (
                  <li key={o.app.id}>
                    {Card ? <Card app={o.app} price={usd(o.price)} i={i} on={f.app?.id === o.app.id} onPick={() => pickApp(o.app.id)} label={t("{0}, from {1}", { 0: o.app.name, 1: usd(o.price) })} /> : <CatalogCard compact i={i} on={f.app?.id === o.app.id} onPick={() => pickApp(o.app.id)} tint={appTint(o.app)}
                      label={t("{0}, from {1}", { 0: o.app.name, 1: usd(o.price) })}
                      visual={<AppTile app={o.app} />} badge={o.app.popular ? <PopularBadge /> : undefined}
                      title={o.app.name} price={<>{t("from")}{" "}<b className="text-base text-slate-900 dark:text-white">{usd(o.price)}</b></>} />}
                  </li>
                ))
                : countries.slice(0, shown).map((o, i) => cardId === "C" ? (
                  <li key={o.country.cc}>
                    <RingCard i={i} on={f.country?.cc === o.country.cc} onPick={() => pickCountry(o.country.cc)} tint="#6366f1"
                      label={t("{0}, from {1}", { 0: o.country.name, 1: usd(o.price) })}
                      visual={<FlagTile cc={o.country.cc} flag={o.country.flag} />} name={o.country.name} price={usd(o.price)} />
                  </li>
                ) : (
                  <li key={o.country.cc}>
                    <CatalogCard compact i={i} on={f.country?.cc === o.country.cc} onPick={() => pickCountry(o.country.cc)} tint="#6366f1"
                      label={t("{0}, from {1}", { 0: o.country.name, 1: usd(o.price) })}
                      visual={<span className="[&>img]:!h-7 [&>img]:!w-10 [&>span]:!h-7 [&>span]:!min-w-10 [&>span]:!text-sm"><CC cc={o.country.cc} flag={o.country.flag} /></span>}
                      title={o.country.name} price={<>{t("from")}{" "}<b className="text-base text-slate-900 dark:text-white">{usd(o.price)}</b></>} />
                  </li>
                ))}
            </ul>
          )}
          {total > shown && (
            <div className="mt-6 flex justify-center">
              <button type="button" onClick={() => setShown((n) => n + PAGE * 2)} className="rounded-2xl border border-slate-300 bg-white px-5 py-3 text-[15px] font-semibold text-slate-800 transition-colors hover:border-slate-500 dark:border-white/20 dark:bg-white/5 dark:text-slate-100 dark:hover:border-white/40">
                {t("Show more ({0} left)", { 0: (total - shown).toLocaleString("en-US") })}
              </button>
            </div>
          )}
        </CatalogLayout>

        <div className="mt-16"><Assurances minutes={f.minutes} /></div>
      </div>
      <PayModal open={payOpen && !!f.operator && f.step === "operator"} onClose={() => setPayOpen(false)} flow={f} operator={f.operator} live={!!store} />
    </PageShell>
  );
}

function Empty({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return <div className="py-10 text-center">{icon}<h2 tabIndex={-1} className="mt-3 font-semibold text-slate-900 outline-none dark:text-white">{title}</h2><p className="text-slate-600 dark:text-slate-400">{text}</p></div>;
}
