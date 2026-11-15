"use client";

import { useMemo, useState, type ReactNode } from "react";
import { ChevronDown, ChevronRight, ShoppingBag } from "lucide-react";
import { PageShell } from "../otp/parts";
import { useT } from "@/i18n/client";
import type { AccountOrder } from "@/content/account-en";
import { Head, Passbook, type OrdersListProps, type View } from "./AccountC";
import { Badge, card, ServiceTile, useAccountDemo, useFmt, useOrderLine, type Store } from "./kit";
import { busy, cartState, CartOrderPage, CartRow, entryAt, entryBusy, group, MoneyBox, useCartLine, type Entry } from "./cartKit";

// Offers for "one order, several services": services bought together from the cart show as one order in the
// account (one number, one total, one payment), and each service keeps its own page as today. Shown in the chosen
// orders list (D · By Day) inside the whole Passbook page. Sample cart order #C-12: Telegram Premium, Telegram Stars
// and a Google Voice number.

const rowBtn = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-emerald-600 dark:focus-visible:ring-emerald-400";

// ---------- Sample: three orders bought together ----------

const CART = { id: 12, paidWith: "melli", at: "2026-10-29T09:12:00" };
const cartItems: AccountOrder[] = [
  {
    id: 10501, kind: "telegram", service: "Telegram", title: "Telegram Premium · 6 months", detail: "Gift to @arash_k",
    state: "delivered", price: 4_180_000, paidWith: "wallet", cart: CART, at: "2026-10-29T09:12:00", deliveredAt: "2026-10-29T09:20:00",
    delivery: { type: "gift", what: "6 months of Telegram Premium", recipient: "@arash_k" },
  },
  {
    id: 10502, kind: "telegram", service: "Telegram", title: "Telegram Stars · 777", detail: "To @arash_k",
    state: "delivering", price: 2_564_100, paidWith: "wallet", cart: CART, at: "2026-10-29T09:12:00",
    delivery: { type: "gift", what: "777 Telegram Stars", recipient: "@arash_k" },
  },
  {
    id: 10503, kind: "google-voice", service: "Google Voice", title: "Google Voice number", detail: "Seattle · +1 (206) 555-0148",
    state: "delivered", price: 1_200_000, paidWith: "wallet", cart: CART, at: "2026-10-29T09:12:00", deliveredAt: "2026-10-29T09:12:00",
    delivery: { type: "login", fields: [{ label: "Number", value: "+1 (206) 555-0148" }, { label: "Google account", value: "seattle.voice.0148@gmail.com" }, { label: "Password", value: "Rt8#vW2q!mK4", secret: true }], note: "Sign in at voice.google.com." },
  },
];

function useCartDemo(): Store {
  const demo = useAccountDemo();
  return useMemo(() => ({ ...demo, orders: [...cartItems, ...demo.orders] }), [demo]);
}

// ---------- One row (a single order, as on the live list) ----------

function OneRow({ o, demo, go, indent = false }: { o: AccountOrder; demo: Store; go: OrdersListProps["go"]; indent?: boolean }) {
  const t = useT();
  const f = useFmt();
  const line = useOrderLine();
  return (
    <button type="button" onClick={() => go({ page: "order", id: o.id })} className={`group flex w-full items-center gap-4 py-3.5 pe-5 text-start transition-colors hover:bg-slate-50 sm:pe-6 dark:hover:bg-white/[.03] ${indent ? "ps-12 sm:ps-16" : "ps-5 sm:ps-6"} ${rowBtn}`}>
      {!indent && <span className="w-12 shrink-0 text-sm tabular-nums text-slate-500 dark:text-slate-400">{f.time(o.at)}</span>}
      <ServiceTile service={o.service} size="sm" />
      <span className="min-w-0 flex-1">
        <span className="flex flex-wrap items-center gap-x-2 gap-y-1"><span className="font-semibold text-slate-900 dark:text-white">{t(o.title)}</span>{o.state !== "delivered" && <Badge kind={o.state} />}</span>
        <span className="block truncate text-sm text-slate-600 dark:text-slate-400">{line(o, demo)}</span>
      </span>
      <span className="text-[15px] font-semibold tabular-nums text-slate-900 dark:text-white">{f.num(o.price)}</span>
      <ChevronRight aria-hidden className="h-5 w-5 shrink-0 text-slate-400 rtl:rotate-180" />
    </button>
  );
}

// ---------- The list, by day (the chosen D), with the cart order shown per offer ----------

type CartShow = (e: Extract<Entry, { type: "cart" }>, ctx: { demo: Store; go: OrdersListProps["go"]; openCart: (id: number) => void }) => ReactNode;

function ByDay({ demo, go, show, openCart }: OrdersListProps & { show: CartShow; openCart: (id: number) => void }) {
  const t = useT();
  const f = useFmt();
  const entries = group(demo.orders);
  const live = entries.filter(entryBusy);
  const rest = entries.filter((e) => !live.includes(e));
  const days: { day: string; items: Entry[] }[] = [];
  rest.forEach((e) => { const d = f.day(entryAt(e)); const g = days[days.length - 1]; if (g?.day === d) g.items.push(e); else days.push({ day: d, items: [e] }); });
  const item = (e: Entry) => (e.type === "one" ? <OneRow o={e.o} demo={demo} go={go} /> : show(e, { demo, go, openCart }));
  return (
    <div>
      <Head title={t("Orders")} sub={t("What's still going stays on top; everything else by day, newest first.")} />
      {!!live.length && (
        <section aria-labelledby="cg-live" className="mb-8">
          <h2 id="cg-live" className="mb-3 font-display text-lg font-bold text-slate-900 dark:text-white">{t("In progress")}</h2>
          <ul className={`${card} divide-y divide-slate-200 overflow-hidden !border-amber-300/70 dark:divide-white/10 dark:!border-amber-400/30`}>
            {live.map((e) => <li key={e.type === "one" ? e.o.id : `c${e.id}`}>{item(e)}</li>)}
          </ul>
        </section>
      )}
      <div className={`${card} overflow-hidden`}>
        {days.map((g) => (
          <section key={g.day} aria-label={g.day}>
            <h3 className="bg-slate-50 px-5 py-2 text-sm font-semibold text-slate-700 sm:px-6 dark:bg-white/[.03] dark:text-slate-300">{g.day}</h3>
            <ul className="divide-y divide-slate-200 dark:divide-white/10">{g.items.map((e) => <li key={e.type === "one" ? e.o.id : `c${e.id}`}>{item(e)}</li>)}</ul>
          </section>
        ))}
      </div>
    </div>
  );
}

function CartPageReceipt({ e, demo, go, back }: { e: Extract<Entry, { type: "cart" }>; demo: Store; go: OrdersListProps["go"]; back: () => void }) {
  const t = useT();
  const f = useFmt();
  const line = useOrderLine();
  const cartLine = useCartLine();
  return (
    <div>
      <Head back={{ label: t("Orders"), onClick: back }} title={t("Order #C-{0}", { 0: e.id })} sub={<span className="flex flex-wrap items-center gap-x-3 gap-y-2">{f.when(e.at)} · {cartLine(e.items)}</span>} />
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_20rem] xl:items-start">
        <article className={`${card} p-6 sm:p-8`}>
          <div className="flex items-center gap-2 font-display text-lg font-semibold text-slate-900 dark:text-white"><ShoppingBag aria-hidden className="h-5 w-5 text-emerald-600" />{t("Services in this order")}</div>
          <ol className="mt-4 border-t border-dashed border-slate-300 dark:border-white/20">
            {e.items.map((o, i) => (
              <li key={o.id} className="border-b border-dashed border-slate-300 dark:border-white/20">
                <button type="button" onClick={() => go({ page: "order", id: o.id })} className={`group flex w-full items-start gap-3 py-4 text-start ${rowBtn}`}>
                  <span className="w-6 pt-0.5 text-sm tabular-nums text-slate-400">{f.num(i + 1)}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-semibold text-slate-900 group-hover:underline dark:text-white">{t(o.title)}</span>
                    <span className="block truncate text-sm text-slate-600 dark:text-slate-400">{line(o, demo)}</span>
                    <span className="mt-1.5 flex items-center gap-2"><Badge kind={o.state} /><span className="text-xs text-slate-500 dark:text-slate-400">#{o.id}</span></span>
                  </span>
                  <span className="text-[15px] font-semibold tabular-nums text-slate-900 dark:text-white">{f.num(o.price)}</span>
                  <ChevronRight aria-hidden className="mt-0.5 h-5 w-5 shrink-0 text-slate-400 rtl:rotate-180" />
                </button>
              </li>
            ))}
          </ol>
          <div className="mt-4 flex items-baseline justify-between"><span className="font-semibold text-slate-900 dark:text-white">{t("Total")}</span><span className="font-display text-3xl font-bold tabular-nums text-slate-900 dark:text-white">{f.money(e.total)}</span></div>
        </article>
        <MoneyBox e={e} demo={demo} />
      </div>
    </div>
  );
}

// ---------- Offers ----------

// A · Expandable row: the cart is one row; open it to see its services underneath, each opening its own page.
function ExpandRow({ e, demo, go }: { e: Extract<Entry, { type: "cart" }>; demo: Store; go: OrdersListProps["go"] }) {
  const [open, setOpen] = useState(e.items.some(busy));
  return (
    <div>
      <CartRow e={e} open={open} onClick={() => setOpen((v) => !v)} trailing={<ChevronDown aria-hidden className={`h-5 w-5 shrink-0 text-slate-400 transition-transform ${open ? "rotate-180" : ""}`} />} />
      {open && <ul className="divide-y divide-slate-100 border-t border-slate-100 bg-slate-50/60 dark:divide-white/5 dark:border-white/5 dark:bg-white/[.02]">{e.items.map((o) => <li key={o.id}><OneRow o={o} demo={demo} go={go} indent /></li>)}</ul>}
    </div>
  );
}

// B · Grouped box: always open; the cart's services sit inside a framed box under its header line.
function GroupBox({ e, demo, go }: { e: Extract<Entry, { type: "cart" }>; demo: Store; go: OrdersListProps["go"] }) {
  const t = useT();
  const f = useFmt();
  const cartLine = useCartLine();
  return (
    <div className="px-3 py-3 sm:px-4">
      <div className="overflow-hidden rounded-2xl border border-emerald-300/70 dark:border-emerald-400/30">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 bg-emerald-50 px-4 py-2.5 text-sm dark:bg-emerald-400/10">
          <ShoppingBag aria-hidden className="h-4 w-4 text-emerald-700 dark:text-emerald-300" />
          <span className="font-semibold text-slate-900 dark:text-white">{t("Order #C-{0}", { 0: e.id })}</span>
          <span className="text-slate-600 dark:text-slate-400">{f.time(e.at)} · {cartLine(e.items)}</span>
          <span className="ms-auto font-semibold tabular-nums text-slate-900 dark:text-white">{f.money(e.total)}</span>
        </div>
        <ul className="divide-y divide-slate-100 dark:divide-white/5">{e.items.map((o) => <li key={o.id}><OneRow o={o} demo={demo} go={go} /></li>)}</ul>
      </div>
    </div>
  );
}

function offer(show: CartShow, Page?: typeof CartPageReceipt) {
  return function Offer() {
    const demo = useCartDemo();
    const [view, setView] = useState<View>({ page: "orders" });
    const [cart, setCart] = useState<number | null>(null);
    const List = useMemo(() => function List({ demo: d, go }: OrdersListProps) {
      const e = cart != null ? group(d.orders).find((x): x is Extract<Entry, { type: "cart" }> => x.type === "cart" && x.id === cart) : undefined;
      if (e && Page) return <Page e={e} demo={d} go={go} back={() => setCart(null)} />;
      return <ByDay demo={d} go={go} show={show} openCart={setCart} />;
    }, [cart]);
    return <PageShell><Passbook store={demo} view={view} go={(v) => { setCart(null); setView(v); }} OrdersList={List} /></PageShell>;
  };
}

const openRow: CartShow = (e, { openCart }) => <CartRow e={e} onClick={() => openCart(e.id)} />;

export const CartOrderA = offer((e, { demo, go }) => <ExpandRow e={e} demo={demo} go={go} />);
export const CartOrderB = offer((e, { demo, go }) => <GroupBox e={e} demo={demo} go={go} />);
export const CartOrderC = offer(openRow, CartOrderPage);
export const CartOrderD = offer(openRow, CartPageReceipt);
