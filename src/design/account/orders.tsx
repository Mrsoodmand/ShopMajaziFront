"use client";

import { useMemo, useState, type ComponentType } from "react";
import { ArrowDown, ArrowUp, ChevronRight, KeyRound, MessageCircle, Search } from "lucide-react";
import { PageShell } from "../otp/parts";
import { useT } from "@/i18n/client";
import type { AccountOrder } from "@/content/account-en";
import { Head, Orders as CurrentOrders, Passbook, families, familyOf, pageRing, type OrdersListProps, type View } from "./AccountC";
import { Badge, Bar, CopyButton, Delivery, Empty, ServiceTile, card, cardShort, field, laneOf, secondary, useAccountDemo, useFmt, useOrderLine, type Store } from "./kit";

// Offers for the orders page of the account (design "Passbook", chosen 2026-11-14). Each is shown inside the whole
// Passbook page with the sample account, so it reads in place; the chosen one replaces `Orders` in AccountC.

type Group = "all" | "needs" | "way" | "done" | "closed";
const groupOf = (o: AccountOrder): Exclude<Group, "all"> => (o.state === "refunded" || o.state === "cancelled" ? "closed" : laneOf(o));
const rowBtn = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-emerald-600 dark:focus-visible:ring-emerald-400";

function useSearch(demo: Store) {
  const [q, setQ] = useState("");
  const list = useMemo(() => {
    const s = q.trim().toLowerCase().replace(/^#/, "");
    return demo.orders.filter((o) => !s || `${o.id} ${o.title} ${o.detail}`.toLowerCase().includes(s));
  }, [demo.orders, q]);
  return { q, setQ, list };
}

function SearchBox({ q, setQ, className = "w-full sm:w-72" }: { q: string; setQ: (v: string) => void; className?: string }) {
  const t = useT();
  return (
    <label className={`relative block ${className}`}>
      <span className="sr-only">{t("Search orders")}</span>
      <Search aria-hidden className="pointer-events-none absolute start-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
      <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder={t("Order, phone or username")} className={`${field} !py-2.5 ps-10`} />
    </label>
  );
}

function NoMatch({ q, setQ }: { q: string; setQ: (v: string) => void }) {
  const t = useT();
  return <Empty title={t("No orders match \"{0}\"", { 0: q })} text={t("Try an order number like 10487, a phone number or a username.")} action={<button type="button" onClick={() => setQ("")} className={secondary}>{t("Clear search")}</button>} />;
}

// The visible "View details" button at the end of a row. A span, since the whole row is already the button.
function DetailsCta() {
  const t = useT();
  return (
    <span aria-hidden className="inline-flex shrink-0 items-center gap-1 rounded-full border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 transition-colors group-hover:border-emerald-600 group-hover:bg-emerald-600 group-hover:text-white dark:border-white/20 dark:text-slate-200 dark:group-hover:border-emerald-500 dark:group-hover:bg-emerald-500">
      <span className="hidden sm:inline">{t("View details")}</span><ChevronRight className="h-3.5 w-3.5 rtl:rotate-180" />
    </span>
  );
}

// One order as a row: tile, title with its badge, the line about where it is, price and date.
function Row({ o, demo, go, compact = false, on = false }: { o: AccountOrder; demo: Store; go: OrdersListProps["go"]; compact?: boolean; on?: boolean }) {
  const t = useT();
  const f = useFmt();
  const line = useOrderLine();
  return (
    <button type="button" onClick={() => go({ page: "order", id: o.id })} aria-current={on ? "true" : undefined}
      className={`group flex w-full items-center gap-4 px-5 text-start transition-colors sm:px-6 ${compact ? "py-3" : "py-4"} ${on ? "bg-indigo-50 dark:bg-indigo-400/10" : "hover:bg-slate-50 dark:hover:bg-white/[.03]"} ${rowBtn}`}>
      <ServiceTile service={o.service} size={compact ? "sm" : "md"} />
      <span className="min-w-0 flex-1">
        <span className="flex flex-wrap items-center gap-x-2 gap-y-1"><span className="font-semibold text-slate-900 dark:text-white">{t(o.title)}</span><Badge kind={o.state} /></span>
        <span className="block truncate text-sm text-slate-600 dark:text-slate-400">{line(o, demo)}</span>
      </span>
      {!compact && (
        <span className="hidden text-end sm:block">
          <span className="block text-[15px] font-semibold tabular-nums text-slate-900 dark:text-white">{f.money(o.price)}</span>
          <span className="block text-sm text-slate-600 dark:text-slate-400">#{o.id} · {f.date(o.at)}</span>
        </span>
      )}
      {compact ? <ChevronRight aria-hidden className="h-5 w-5 shrink-0 text-slate-400 rtl:rotate-180" /> : <DetailsCta />}
    </button>
  );
}

// ---------- A · Status Tabs ----------
// One list, newest first, filtered by what each order needs: waiting on you, on its way, delivered, refunded.

function ListA({ demo, go }: OrdersListProps) {
  const t = useT();
  const { q, setQ, list } = useSearch(demo);
  const [tab, setTab] = useState<Group>(() => (demo.orders.some((o) => groupOf(o) === "needs") ? "needs" : "all"));
  const count = (g: Group) => list.filter((o) => g === "all" || groupOf(o) === g).length;
  const tabs: { id: Group; label: string }[] = [
    { id: "all", label: t("All") }, { id: "needs", label: t("Needs you") }, { id: "way", label: t("In progress") },
    { id: "done", label: t("Delivered") }, { id: "closed", label: t("Refunded & cancelled") },
  ];
  const shown = list.filter((o) => tab === "all" || groupOf(o) === tab);
  return (
    <div>
      <Head title={t("Orders")} sub={t("Newest first. The tabs sort them by what they need.")} action={<SearchBox q={q} setQ={setQ} />} />
      <div className={`${card} overflow-hidden`}>
        <div role="tablist" aria-label={t("Show")} className="flex gap-1 overflow-x-auto border-b border-slate-200 px-3 pt-2 [scrollbar-width:none] sm:px-4 dark:border-white/10">
          {tabs.map((x) => {
            const on = tab === x.id;
            const n = count(x.id);
            return (
              <button key={x.id} type="button" role="tab" aria-selected={on} onClick={() => setTab(x.id)}
                className={`relative inline-flex shrink-0 items-center gap-2 whitespace-nowrap px-3 pb-3 pt-2 text-sm font-semibold transition-colors ${on ? "text-slate-900 dark:text-white" : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"} ${pageRing} rounded-t-lg`}>
                {x.label}
                <span className={`grid h-5 min-w-5 place-items-center rounded-full px-1.5 text-xs tabular-nums ${on ? (x.id === "needs" && n ? "bg-indigo-600 text-white" : "bg-slate-900 text-white dark:bg-white dark:text-slate-900") : "bg-slate-100 text-slate-700 dark:bg-white/10 dark:text-slate-300"}`}>{n}</span>
                {on && <span aria-hidden className="absolute inset-x-2 bottom-0 h-[3px] rounded-t-full bg-indigo-600 dark:bg-indigo-400" />}
              </button>
            );
          })}
        </div>
        <ul role="tabpanel" className="divide-y divide-slate-200 dark:divide-white/10">
          {shown.map((o) => <li key={o.id}><Row o={o} demo={demo} go={go} /></li>)}
        </ul>
        {!shown.length && (q ? <NoMatch q={q} setQ={setQ} /> : <Empty title={t("Nothing here")} text={t("No orders in this group right now.")} />)}
      </div>
    </div>
  );
}

// ---------- B · Ledger Table ----------
// Every order in one table with fixed columns, sortable by date or price, filtered by service.

function ListB({ demo, go }: OrdersListProps) {
  const t = useT();
  const f = useFmt();
  const { q, setQ, list } = useSearch(demo);
  const [fam, setFam] = useState<string>("all");
  const [sort, setSort] = useState<{ by: "at" | "price"; dir: 1 | -1 }>({ by: "at", dir: -1 });
  const rows = list.filter((o) => fam === "all" || familyOf(o) === fam).sort((a, b) => (sort.by === "at" ? a.at.localeCompare(b.at) : a.price - b.price) * sort.dir);
  const sortBtn = (by: "at" | "price", label: string) => {
    const on = sort.by === by;
    const Icon = on && sort.dir === 1 ? ArrowUp : ArrowDown;
    return (
      <button type="button" onClick={() => setSort({ by, dir: on ? (sort.dir === 1 ? -1 : 1) : -1 })} className={`inline-flex items-center gap-1 rounded font-medium hover:text-slate-900 dark:hover:text-white ${on ? "text-slate-900 dark:text-white" : ""} ${pageRing}`}>
        {label}<Icon aria-hidden className={`h-3.5 w-3.5 ${on ? "" : "opacity-40"}`} />
      </button>
    );
  };
  const aria = (by: "at" | "price") => (sort.by === by ? (sort.dir === 1 ? "ascending" : "descending") : undefined);
  return (
    <div>
      <Head title={t("Orders")} sub={t("All your orders in one table. Sort by date or price, or show one kind of service.")} />
      <div className={`${card} overflow-hidden`}>
        <div className="flex flex-wrap items-center gap-3 border-b border-slate-200 px-5 py-4 sm:px-6 dark:border-white/10">
          <SearchBox q={q} setQ={setQ} className="w-full sm:w-64" />
          <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
            {t("Service")}
            <select value={fam} onChange={(e) => setFam(e.target.value)} className={`${field} appearance-auto !w-auto !py-2.5`}>
              <option value="all">{t("All services")}</option>
              {families.map((x) => <option key={x.id} value={x.id}>{t(x.label)}</option>)}
            </select>
          </label>
          <span className="ms-auto text-sm tabular-nums text-slate-600 dark:text-slate-400">{t("{0} orders", { 0: f.num(rows.length) })}</span>
        </div>
        <table className="w-full table-fixed">
          <caption className="sr-only">{t("Orders")}</caption>
          <colgroup><col /><col className="hidden w-36 md:table-column" /><col className="hidden w-32 lg:table-column" /><col className="w-28 sm:w-32" /></colgroup>
          <thead className="text-sm text-slate-600 dark:text-slate-400">
            <tr className="border-b border-slate-200 dark:border-white/10">
              <th scope="col" className="px-5 py-3 text-start font-medium sm:ps-6">{t("Order")}</th>
              <th scope="col" aria-sort={aria("at")} className="hidden px-3 py-3 text-start md:table-cell">{sortBtn("at", t("Date"))}</th>
              <th scope="col" className="hidden px-3 py-3 text-start font-medium lg:table-cell">{t("Paid with")}</th>
              <th scope="col" aria-sort={aria("price")} className="py-3 pe-5 ps-3 text-end sm:pe-6">{sortBtn("price", t("Price"))}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-white/10">
            {rows.map((o) => {
              const c = o.paidWith === "wallet" ? null : demo.cardOf(o.paidWith);
              return (
                <tr key={o.id} onClick={() => go({ page: "order", id: o.id })} className="cursor-pointer transition-colors hover:bg-slate-50 dark:hover:bg-white/[.03]">
                  <td className="px-5 py-3.5 sm:ps-6">
                    <button type="button" onClick={(e) => { e.stopPropagation(); go({ page: "order", id: o.id }); }} className={`flex w-full min-w-0 items-center gap-3 rounded-lg text-start ${rowBtn}`}>
                      <ServiceTile service={o.service} size="sm" />
                      <span className="min-w-0">
                        <span className="flex flex-wrap items-center gap-x-2 gap-y-1"><span className="truncate font-semibold text-slate-900 dark:text-white">{t(o.title)}</span><Badge kind={o.state} /></span>
                        <span className="block truncate text-sm text-slate-600 dark:text-slate-400"><span className="font-mono">#{o.id}</span> · {t(o.detail)}</span>
                      </span>
                    </button>
                  </td>
                  <td className="hidden px-3 py-3.5 text-sm text-slate-700 md:table-cell dark:text-slate-300">{f.date(o.at)}<span className="block text-slate-500">{f.time(o.at)}</span></td>
                  <td className="hidden px-3 py-3.5 text-sm text-slate-700 lg:table-cell dark:text-slate-300">{c ? <span dir="ltr">•••• {c.last4}</span> : t("Wallet")}</td>
                  <td className="py-3.5 pe-5 ps-3 text-end text-[15px] font-semibold tabular-nums text-slate-900 sm:pe-6 dark:text-white">{f.num(o.price)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {!rows.length && (q ? <NoMatch q={q} setQ={setQ} /> : <Empty title={t("Nothing here")} text={t("No orders for this service yet.")} />)}
      </div>
    </div>
  );
}

// ---------- C · Handover Cards ----------
// A card per order that already shows what it hands over: the number and its code, the delivery bar, or how many
// login details wait inside. Most orders need no click at all.

function Peek({ o, demo }: { o: AccountOrder; demo: Store }) {
  const t = useT();
  const d = o.delivery;
  if (d.type === "number") {
    const clock = demo.clockOf(o);
    return (
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span dir="ltr" className="min-w-0 flex-1 truncate text-start font-mono text-lg font-bold text-slate-900 dark:text-white">{d.number}</span>
          {o.state !== "refunded" && o.state !== "cancelled" && <CopyButton text={d.number.replace(/[\s()-]/g, "")} label={t("Copy number")} />}
        </div>
        {d.code ? (
          <div className="flex items-center gap-3 rounded-xl bg-emerald-700 px-3 py-2 text-white dark:bg-emerald-500 dark:text-emerald-950">
            <span className="text-sm">{t("Code")}</span><span dir="ltr" className="flex-1 font-mono text-xl font-bold tracking-[0.18em]">{d.code}</span>
            <CopyButton text={d.code} label={t("Copy code")} className="!bg-white/20 !text-current hover:!bg-white/30" />
          </div>
        ) : o.state === "waiting" ? (
          <div><div className="flex justify-between text-sm"><span className="text-slate-600 dark:text-slate-400">{t("Waiting for the SMS code")}</span><span className="font-mono font-semibold tabular-nums text-slate-900 dark:text-white">{clock.text}</span></div><Bar fraction={clock.fraction} className="mt-1.5" /></div>
        ) : null}
      </div>
    );
  }
  if (d.type === "progress")
    return <div><div className="flex justify-between text-sm"><span className="text-slate-600 dark:text-slate-400">{t("{0} of {1} added", { 0: d.done.toLocaleString("en-US"), 1: d.total.toLocaleString("en-US") })}</span></div><Bar fraction={d.done / d.total} tone={o.state === "needs-you" ? "indigo" : o.state === "delivered" ? "emerald" : "amber"} className="mt-1.5" /></div>;
  const n = d.type === "login" || d.type === "details" ? d.fields.length : 0;
  return (
    <p className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
      <KeyRound aria-hidden className="h-4 w-4 shrink-0" />
      {d.type === "gift" ? t("Sent to {0}", { 0: d.recipient }) : d.type === "activation" ? t("{0} is on your account", { 0: t(d.plan) }) : n ? t("{0} login details inside", { 0: n }) : t("Open for the details")}
    </p>
  );
}

function ListC({ demo, go }: OrdersListProps) {
  const t = useT();
  const f = useFmt();
  const { q, setQ, list } = useSearch(demo);
  const ordered = [...list].sort((a, b) => (groupOf(a) === "needs" ? -1 : 0) - (groupOf(b) === "needs" ? -1 : 0) || (laneOf(a) === "way" ? -1 : 0) - (laneOf(b) === "way" ? -1 : 0));
  return (
    <div>
      <Head title={t("Orders")} sub={t("Each card shows what the order handed over. Open one for the full receipt.")} action={<SearchBox q={q} setQ={setQ} />} />
      <ul className="grid gap-4 md:grid-cols-2">
        {ordered.map((o) => (
          <li key={o.id} className={`${card} flex flex-col p-5 ${o.state === "needs-you" ? "!border-indigo-300 dark:!border-indigo-400/40" : ""}`}>
            <div className="flex items-start gap-3">
              <ServiceTile service={o.service} />
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-slate-900 dark:text-white">{t(o.title)}</p>
                <p className="truncate text-sm text-slate-600 dark:text-slate-400">{t(o.detail)}</p>
                <Badge kind={o.state} className="mt-2" />
              </div>
            </div>
            <div className="my-4 flex-1"><Peek o={o} demo={demo} /></div>
            <div className="flex items-center justify-between gap-3 border-t border-dashed border-slate-200 pt-3 text-sm dark:border-white/15">
              <span className="min-w-0">
                <span className="block font-semibold tabular-nums text-slate-900 dark:text-white">{f.money(o.price)}</span>
                <span className="block truncate text-slate-600 dark:text-slate-400">#{o.id} · {f.date(o.at)}</span>
              </span>
              <button type="button" onClick={() => go({ page: "order", id: o.id })} className={`inline-flex items-center gap-1 rounded font-semibold text-indigo-700 hover:underline dark:text-indigo-300 ${pageRing}`}>
                {t("Open")}<ChevronRight aria-hidden className="h-4 w-4 rtl:rotate-180" /><span className="sr-only">{t("order #{0}", { 0: o.id })}</span>
              </button>
            </div>
          </li>
        ))}
      </ul>
      {!ordered.length && <div className={card}><NoMatch q={q} setQ={setQ} /></div>}
    </div>
  );
}

// ---------- D · By Day ----------
// Like the statement: what's still going is pinned on top, the rest falls into days with the time on the start side.

// Chosen 2026-11-14 for the live /account/orders (components/account/AccountApp).
export function ListD({ demo, go }: OrdersListProps) {
  const t = useT();
  const f = useFmt();
  const line = useOrderLine();
  const { q, setQ, list } = useSearch(demo);
  const live = list.filter((o) => groupOf(o) === "needs" || groupOf(o) === "way");
  const rest = list.filter((o) => !live.includes(o));
  const days: { day: string; items: AccountOrder[] }[] = [];
  rest.forEach((o) => { const d = f.day(o.at); const g = days[days.length - 1]; if (g?.day === d) g.items.push(o); else days.push({ day: d, items: [o] }); });
  return (
    <div>
      <Head title={t("Orders")} sub={t("What's still going stays on top; everything else by day, newest first.")} action={<SearchBox q={q} setQ={setQ} />} />
      {!!live.length && (
        <section aria-labelledby="od-live" className="mb-8">
          <h2 id="od-live" className="mb-3 font-display text-lg font-bold text-slate-900 dark:text-white">{t("In progress")}</h2>
          <ul className={`${card} divide-y divide-slate-200 overflow-hidden !border-amber-300/70 dark:divide-white/10 dark:!border-amber-400/30`}>
            {live.map((o) => <li key={o.id}><Row o={o} demo={demo} go={go} /></li>)}
          </ul>
        </section>
      )}
      <div className={`${card} overflow-hidden`}>
        {days.map((g) => (
          <section key={g.day} aria-label={g.day}>
            <h3 className="bg-slate-50 px-5 py-2 text-sm font-semibold text-slate-700 sm:px-6 dark:bg-white/[.03] dark:text-slate-300">{g.day}</h3>
            <ul className="divide-y divide-slate-200 dark:divide-white/10">
              {g.items.map((o) => (
                <li key={o.id}>
                  <button type="button" onClick={() => go({ page: "order", id: o.id })} className={`group flex w-full items-center gap-4 px-5 py-3.5 text-start transition-colors hover:bg-slate-50 sm:px-6 dark:hover:bg-white/[.03] ${rowBtn}`}>
                    <span className="w-12 shrink-0 text-sm tabular-nums text-slate-500 dark:text-slate-400">{f.time(o.at)}</span>
                    <ServiceTile service={o.service} size="sm" />
                    <span className="min-w-0 flex-1">
                      <span className="flex flex-wrap items-center gap-x-2 gap-y-1"><span className="font-semibold text-slate-900 dark:text-white">{t(o.title)}</span>{o.state !== "delivered" && <Badge kind={o.state} />}</span>
                      <span className="block truncate text-sm text-slate-600 dark:text-slate-400">{line(o, demo)}</span>
                    </span>
                    <span className="text-[15px] font-semibold tabular-nums text-slate-900 dark:text-white">{f.num(o.price)}</span>
                    <DetailsCta />
                  </button>
                </li>
              ))}
            </ul>
          </section>
        ))}
        {!list.length && <NoMatch q={q} setQ={setQ} />}
      </div>
    </div>
  );
}

// ---------- E · List & Preview ----------
// Desktop: a compact list beside the chosen order's handover and money, so going through orders needs no page
// changes. Phones: the list only; a tap opens the receipt.

function ListE({ demo, go }: OrdersListProps) {
  const t = useT();
  const f = useFmt();
  const { q, setQ, list } = useSearch(demo);
  const [sel, setSel] = useState<number | null>(null);
  const order = list.find((o) => o.id === sel) ?? list[0];
  const c = order && order.paidWith !== "wallet" ? demo.cardOf(order.paidWith) : null;
  const pick: OrdersListProps["go"] = (v) => {
    if (v.page === "order" && window.matchMedia("(min-width: 1280px)").matches) setSel(v.id ?? null);
    else go(v);
  };
  return (
    <div>
      <Head title={t("Orders")} sub={t("Pick an order to see what it handed over, without leaving the list.")} action={<SearchBox q={q} setQ={setQ} />} />
      <div className="grid gap-6 xl:grid-cols-[22rem_minmax(0,1fr)] xl:items-start">
        <ul className={`${card} divide-y divide-slate-200 overflow-hidden dark:divide-white/10`}>
          {list.map((o) => <li key={o.id}><Row o={o} demo={demo} go={pick} compact on={o.id === order?.id} /></li>)}
          {!list.length && <li><NoMatch q={q} setQ={setQ} /></li>}
        </ul>
        {order && (
          <section aria-label={t(order.title)} aria-live="polite" className={`${card} hidden p-6 xl:sticky xl:top-24 xl:block`}>
            <div className="flex items-start gap-3">
              <ServiceTile service={order.service} size="lg" />
              <div className="min-w-0 flex-1">
                <h2 className="font-display text-xl font-bold text-slate-900 dark:text-white">{t(order.title)}</h2>
                <p className="text-sm text-slate-600 dark:text-slate-400">{t("Order #{0} · {1}", { 0: order.id, 1: f.when(order.at) })}</p>
              </div>
              <Badge kind={order.state} />
            </div>
            <div className="mt-6"><Delivery key={order.id} order={order} demo={demo} /></div>
            <dl className="mt-6 grid grid-cols-2 gap-4 border-t border-dashed border-slate-300 pt-5 text-sm dark:border-white/20">
              <div><dt className="text-slate-600 dark:text-slate-400">{t("Price")}</dt><dd className="font-semibold tabular-nums text-slate-900 dark:text-white">{f.money(order.price)}</dd></div>
              <div><dt className="text-slate-600 dark:text-slate-400">{t("Paid with")}</dt><dd className="font-semibold text-slate-900 dark:text-white">{c ? cardShort(c) : t("Wallet")}</dd></div>
            </dl>
            <div className="mt-6 flex flex-wrap gap-2">
              <button type="button" onClick={() => go({ page: "order", id: order.id })} className={secondary}>{t("Full receipt")}</button>
              <button type="button" onClick={() => go({ page: "support", id: -order.id })} className={secondary}><MessageCircle aria-hidden className="h-4 w-4" />{t("Get help with this order")}</button>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

// ---------- Offers: each list inside the whole Passbook page, opened on Orders ----------

function inPage(List: ComponentType<OrdersListProps>) {
  return function Offer() {
    const demo = useAccountDemo();
    const [view, setView] = useState<View>({ page: "orders" });
    return <PageShell><Passbook store={demo} view={view} go={setView} OrdersList={List} /></PageShell>;
  };
}
export const OrdersA = inPage(ListA);
export const OrdersB = inPage(ListB);
export const OrdersC = inPage(ListC);
export const OrdersD = inPage(ListD);
export const OrdersE = inPage(ListE);
export const OrdersNow = inPage(CurrentOrders);
