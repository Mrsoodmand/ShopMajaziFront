"use client";

import { useEffect, useRef, useState, type ReactNode, type RefObject } from "react";
import { ArrowRight, Smartphone, Globe2, Radio, Pencil, Check, Info } from "lucide-react";
import { cheapest } from "@/content/otp-en";
import { mockOtpSource, useOtpFlow, type OtpSource } from "./flow";
import { useLiveOtp, type LiveOtp } from "./live";
import { useLiveOtpSource } from "./liveSource";
import { useLiveOrders } from "./liveOrders";
import type { OrderStore } from "./order";
import { useMoney } from "@/lib/money";
import { AppChoices, CountryChoices, LoadingRows } from "./Choices";
import { OperatorList, OrderView, RecentOrders, SwapButton } from "./flowParts";
import PayModal from "./PayModal";
import ActiveOrders from "./ActiveOrders";
import { orderViews, type OrderViewId } from "./order-screen/views";
import { AppTile, Assurances, CC, PageShell, PageTitle, WalletChip } from "./parts";
import { useT } from "@/i18n/client";
import HeroSms from "./HeroSms";

const DEFAULT_APP = "telegram";
type ColId = "app" | "country" | "operator";

// Below the lg breakpoint the columns stack; there, a finished step folds into a one-line summary and the page
// scrolls to the next step.
const isStacked = () => typeof window !== "undefined" && window.matchMedia("(max-width: 1023px)").matches;

// Page L — "Three Columns": app, country and operator side by side, like a file browser. Picking an operator opens
// the payment modal (payment method, final price, Buy). Each column unlocks once the one before it is chosen; the
// swap button flips app-first / country-first. Opens with Telegram and its cheapest country already picked.
// `orderView` picks the screen shown after buying (see order-screen/views); `previewOrder` buys right away, for previews.
// On /virtual-number it runs on live backend data (see live.tsx); in /design previews, on placeholder data.
type Props = { orderView?: string; previewOrder?: boolean };

export default function OtpL(props: Props) {
  const live = useLiveOtp();
  return live ? <LiveOtpL {...props} live={live} /> : <OtpLView {...props} source={mockOtpSource()} appId={DEFAULT_APP} cc={cheapest(DEFAULT_APP).country.cc} />;
}

function LiveOtpL({ live, ...props }: Props & { live: LiveOtp }) {
  const source = useLiveOtpSource(live.catalog, live.locale, live.preload, live.error);
  const store = useLiveOrders(live.catalog, live.locale);
  return <OtpLView {...props} source={source} store={store} appId={live.defaultApp} cc={live.defaultCc} />;
}

function OtpLView({ orderView, previewOrder = false, source, store, appId, cc }: Props & { source: OtpSource; store?: OrderStore & { loaded: boolean }; appId?: string; cc?: string }) {
  const t = useT();
  const f = useOtpFlow("app", { appId, cc, codeAfterMs: previewOrder ? 30_000 : undefined }, source, store);
  // Live: a number still waiting for its code (bought earlier, page reloaded) opens straight on its order screen.
  const resumed = useRef(false);
  useEffect(() => {
    if (!store?.loaded || resumed.current) return;
    resumed.current = true;
    const waiting = store.orders.find((o) => o.status === "waiting");
    if (waiting) f.showOrder(waiting.id);
  }, [store?.loaded, store?.orders, f]);
  const usd = useMoney().format;
  const bought = useRef(false);
  useEffect(() => {
    if (!previewOrder || bought.current) return;
    bought.current = true;
    f.purchase(f.operators[0], "wallet");
  }, [previewOrder, f]);
  const OrderScreen = (orderView && orderViews[orderView as OrderViewId]) || OrderView;
  const [editing, setEditing] = useState<ColId[]>([]);
  const [payOpen, setPayOpen] = useState(false);
  const payResult = usePaymentResult(!!store);
  // "Same again" goes back to the operator step with the same choices and opens the payment modal.
  const flow = { ...f, sameAgain: (id?: unknown) => { f.sameAgain(id); setPayOpen(true); } };
  const refs: Record<ColId, RefObject<HTMLElement | null>> = { app: useRef(null), country: useRef(null), operator: useRef(null) };

  const order: ColId[] = f.first === "app" ? ["app", "country", "operator"] : ["country", "app", "operator"];
  const edit = (c: ColId) => setEditing((e) => (e.includes(c) ? e : [...e, c]));
  // After a choice: stop editing that column and, on phones, scroll to the next one.
  const done = (c: ColId) => {
    setEditing((e) => e.filter((x) => x !== c));
    const next = order[order.indexOf(c) + 1];
    if (next && isStacked()) setTimeout(() => refs[next].current?.scrollIntoView({ behavior: "smooth", block: "start" }), 120);
  };

  const appLocked = f.first === "country" && !f.country;
  const countryLocked = f.first === "app" && !f.app;

  const appCol = (
    <Col key="app" sref={refs.app} n={f.first === "app" ? 1 : 2} title={t("App")} icon={Smartphone} locked={appLocked}
      folded={!!f.app && !editing.includes("app")} onEdit={() => edit("app")}
      summary={f.app && <span className="flex items-center gap-2"><AppTile app={f.app} size="sm" /><span className="truncate">{f.app.name}</span></span>}>
      <AppChoices layout="list" options={f.appOptions} value={f.app?.id ?? null} onPick={(id) => { f.pickApp(id); done("app"); }} priced={f.appsPriced} loading={f.appsLoading} sortable={f.first === "country"} />
    </Col>
  );
  const countryCol = (
    <Col key="country" sref={refs.country} n={f.first === "country" ? 1 : 2} title={t("Country")} icon={Globe2} locked={countryLocked}
      folded={!!f.country && !editing.includes("country")} onEdit={() => edit("country")}
      summary={f.country && <span className="flex items-center gap-2"><CC cc={f.country.cc} flag={f.country.flag} /><span className="truncate">{f.country.name}</span></span>}>
      <CountryChoices compact options={f.countryOptions} value={f.country?.cc ?? null} onPick={(cc) => { f.pickCountry(cc); done("country"); }} priced={f.app ? "exact" : "from"} loading={f.countriesLoading} sortable={f.first === "app"} />
    </Col>
  );

  return (
    <PageShell>
      <div className="mx-auto max-w-7xl px-6 py-14">
        <div className="relative flex flex-wrap items-end justify-between gap-4">
          <PageTitle title={t("Virtual numbers")} sub={f.step === "order"
            ? t("Your number is ready. Keep this page open; the code shows up here by itself.")
            : t("Work left to right: app, country, operator. Use ⇄ to start with the country instead.")} />
          {/* Narrow screens: the SMS bubble alone, beside the kicker, so the form doesn't move down. */}
          <div className="pointer-events-none absolute -top-7 end-0 xl:hidden rtl:-top-4"><HeroSms app={f.app} mini /></div>
          <div className="flex items-end gap-8">
            <div className="hidden xl:block"><HeroSms app={f.app} /></div>
            <WalletChip />
          </div>
        </div>
        {payResult && (
          <p role="status" className={`mt-6 flex items-start gap-2 rounded-2xl px-4 py-3 text-sm ${payResult.good ? "bg-emerald-50 text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-200" : "bg-amber-50 text-amber-800 dark:bg-amber-500/10 dark:text-amber-200"}`}>
            {payResult.good ? <Check className="mt-0.5 h-4 w-4 shrink-0" /> : <Info className="mt-0.5 h-4 w-4 shrink-0" />}{payResult.text}
          </p>
        )}
        {f.loadError && <p role="alert" className="mt-6 rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:bg-rose-500/10 dark:text-rose-300">{f.loadError}</p>}

        {f.step === "order" && f.order ? (
          <div className={`mt-10 grid grid-cols-[minmax(0,1fr)] gap-6 ${f.orders.length > 1 ? "lg:grid-cols-[minmax(0,1fr)_320px]" : ""}`}>
            <OrderScreen order={f.order} flow={flow} />
            <RecentOrders flow={flow} />
          </div>
        ) : (
          <div className="mt-10 grid grid-cols-[minmax(0,1fr)] items-start gap-4 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)_minmax(0,1.15fr)]">
            {f.first === "app" ? appCol : countryCol}
            <div className="flex justify-center lg:pt-24"><SwapButton flow={f} /></div>
            {f.first === "app" ? countryCol : appCol}

            <Col sref={refs.operator} n={3} title={t("Operator")} icon={Radio} locked={f.step !== "operator"} folded={false} onEdit={() => {}}>
              <div className="[&_[role=radiogroup]]:sm:grid-cols-1">
                {f.operatorsLoading ? <LoadingRows rows={3} /> : <OperatorList ops={f.operators} value={f.operator?.id ?? null} onPick={(id) => { f.pickOperator(id); setPayOpen(true); }} />}
              </div>
              <button onClick={() => setPayOpen(true)} disabled={!f.operator}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-indigo-600 py-3.5 font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-40">
                {f.operator ? <>{t("Continue to payment ·")}{" "}{usd(f.operator.price)}<ArrowRight className="h-4 w-4 rtl:rotate-180" /></> : t("Pick an operator")}
              </button>
            </Col>
          </div>
        )}
        {f.step !== "order" && <ActiveOrders flow={flow} className="mt-6" />}
        <div className="mt-10"><Assurances minutes={f.minutes} /></div>
      </div>
      <PayModal open={payOpen && !!f.operator && f.step === "operator"} onClose={() => setPayOpen(false)} flow={f} operator={f.operator} live={!!store} />
    </PageShell>
  );
}

function Col({ n, title, icon: Icon, locked, folded, summary, onEdit, sref, children }: {
  n: number; title: string; icon: typeof Radio; locked: boolean; folded: boolean; summary?: ReactNode; onEdit: () => void; sref: RefObject<HTMLElement | null>; children: ReactNode;
}) {
  const t = useT();
  return (
    <section ref={sref} className={`scroll-mt-24 rounded-3xl bg-white p-4 ring-1 ring-slate-200 transition duration-300 dark:bg-[#0E1424] dark:ring-white/10 ${locked ? "opacity-50" : ""}`}>
      <h2 className="flex items-center gap-2 px-1 font-display font-semibold text-slate-900 dark:text-white">
        <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-full text-xs font-bold text-white transition ${folded ? "bg-emerald-500" : "bg-indigo-600"}`}>{folded ? <Check className="h-3.5 w-3.5" /> : n}</span>
        <Icon className={`h-4 w-4 shrink-0 text-slate-400 ${folded ? "max-sm:hidden" : ""}`} /><span className="shrink-0">{title}</span>
        {/* Folded summary: phones only; desktop keeps the full column visible. */}
        {folded && summary && (
          <span className="ms-auto flex min-w-0 items-center gap-2 text-sm font-medium text-slate-700 lg:hidden dark:text-slate-200">
            <span className="min-w-0 truncate [&>span]:min-w-0">{summary}</span>
            <button onClick={onEdit} aria-label={t("Change {0}", { 0: title.toLowerCase() })} className="flex shrink-0 items-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold text-indigo-600 hover:bg-indigo-50 dark:text-indigo-300 dark:hover:bg-indigo-500/10"><Pencil className="h-3.5 w-3.5" /><span className="max-sm:hidden">{t("Change")}</span></button>
          </span>
        )}
      </h2>
      {locked ? <p className="px-1 py-10 text-center text-sm text-slate-500 dark:text-slate-400">{t("Choose step")}{" "}{n - 1}{" "}{t("first")}</p> : (
        <div className={`mt-3 ${folded ? "hidden lg:block" : "animate-fade-up [animation-duration:250ms]"}`}>{children}</div>
      )}
    </section>
  );
}

// Back from the bank: the callback adds ?pay=ok|refunded|cancelled|failed&order=… (PaymentCallBackController).
// Read once, shown as a note, and removed from the address so a reload doesn't show it again.
export function usePaymentResult(live: boolean) {
  const t = useT();
  const [result, setResult] = useState<{ good: boolean; text: string } | null>(null);
  useEffect(() => {
    if (!live) return;
    const q = new URLSearchParams(window.location.search);
    const pay = q.get("pay");
    if (!pay) return;
    const texts: Record<string, [boolean, string]> = {
      ok: [true, t("Payment received. Your number is below; the code shows up here by itself.")],
      refunded: [false, t("Payment received, but no number was available on that server. The full amount is in your wallet; pick another server or country.")],
      cancelled: [false, t("Payment cancelled. Nothing was charged.")],
      failed: [false, t("The payment didn't go through. If money left your account, the bank returns it within 72 hours.")],
    };
    const [good, text] = texts[pay] ?? texts.failed;
    setResult({ good, text });
    q.delete("pay"); q.delete("order");
    window.history.replaceState(null, "", window.location.pathname + (q.size ? `?${q}` : "") + window.location.hash);
  }, [live, t]);
  return result;
}
