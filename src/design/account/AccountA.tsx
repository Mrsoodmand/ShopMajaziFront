"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { ArrowLeft, ChevronRight, CreditCard, MessageCircle, Plus, Search, X } from "lucide-react";
import Link from "@/i18n/Link";
import { PageShell } from "../otp/parts";
import { useT } from "@/i18n/client";
import type { AccountOrder } from "@/content/account-en";
import {
  AmountPicker, Badge, Bar, CancelInline, CardPicker, CopyButton, Delivery, Empty, NewTicketForm, OrderSteps, PasswordForm,
  PaymentRows, ProfileForm, ReplyBox, ServiceTile, SumRows, Thread, TopUpSummary, buyAgainHref, card, cardShort, deptLabel,
  field, laneOf, primary, secondary, smallBtn, ticketBadge, useAccountDemo, useFmt, useOrderLine, useTopUp, type Demo, type Lane,
} from "./kit";

// Account A — "Needs You". A deep indigo band carries the page title, the wallet and the tabs. The overview sorts
// everything by what it needs: first the things waiting on the buyer (a paused order, a support reply, a code that
// just came in), beside them what's on its way with timers drawn to scale, then what's done. The orders table keeps
// the same three states as its filter, with fixed columns whose values change in place.

type View =
  | { page: "overview" } | { page: "orders"; lane?: Lane | "all" } | { page: "order"; id: number } | { page: "funds" }
  | { page: "support" } | { page: "ticket"; id: number } | { page: "new-ticket"; orderId?: number } | { page: "profile" } | { page: "password" };
type Go = (v: View) => void;

const bandRing = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#1e1b4b] dark:focus-visible:ring-offset-[#15123a]";

export default function AccountA() {
  const t = useT();
  const f = useFmt();
  const demo = useAccountDemo();
  const [view, setView] = useState<View>({ page: "overview" });
  const top = useRef<HTMLDivElement>(null);
  const h1 = useRef<HTMLHeadingElement>(null);
  const first = useRef(true);
  const go: Go = (v) => setView(v);
  useEffect(() => {
    if (first.current) { first.current = false; return; }
    const box = top.current?.getBoundingClientRect();
    if (box && box.top < 0) top.current?.scrollIntoView({ block: "start" });
    h1.current?.focus({ preventScroll: true });
  }, [view]);

  const order = view.page === "order" ? demo.orders.find((o) => o.id === view.id) : undefined;
  const ticket = view.page === "ticket" ? demo.tickets.find((x) => x.id === view.id) : undefined;

  let title = t("Your account");
  let sub: ReactNode = <>{demo.user.name} · <span dir="ltr">{demo.user.mobile}</span></>;
  let back: { label: string; to: View } | undefined;
  if (view.page === "orders") { title = t("Orders"); sub = t("Everything you've bought, with its codes and logins."); }
  if (order) { title = t(order.title); sub = <span className="flex flex-wrap items-center gap-x-3 gap-y-2">{t("Order #{0} · {1}", { 0: order.id, 1: f.when(order.at) })}<Badge kind={order.state} /></span>; back = { label: t("All orders"), to: { page: "orders" } }; }
  if (view.page === "funds") { title = t("Add funds"); sub = t("Top up your wallet with a bank card. Purchases from the wallet take one tap."); }
  if (view.page === "support") { title = t("Support"); sub = t("Your tickets with our team. We answer around the clock."); }
  if (ticket) { title = t(ticket.subject); sub = t("Ticket #{0} · {1}", { 0: ticket.id, 1: t(deptLabel(ticket.dept)) }); back = { label: t("All tickets"), to: { page: "support" } }; }
  if (view.page === "new-ticket") { title = t("New ticket"); sub = t("Tell us what's wrong. Linking the order lets us see it straight away."); back = { label: t("All tickets"), to: { page: "support" } }; }
  if (view.page === "profile") { title = t("Profile"); sub = t("Your name, sign-in number and cards."); }
  if (view.page === "password") { title = t("Password"); sub = t("Change the password you sign in with."); }

  return (
    <PageShell heroDark>
      <div ref={top} className="selection:bg-indigo-200 selection:text-indigo-950 dark:selection:bg-indigo-400/40 dark:selection:text-white">
        <Band view={view} go={go} demo={demo} title={title} sub={sub} back={back} h1={h1} />
        <div className="mx-auto max-w-6xl px-4 pb-24 pt-8 sm:px-6 sm:pt-10">
          {view.page === "overview" && <Overview demo={demo} go={go} />}
          {view.page === "orders" && <Orders demo={demo} go={go} initial={view.lane ?? "all"} />}
          {view.page === "order" && order && <OrderPage order={order} demo={demo} go={go} />}
          {view.page === "funds" && <Funds demo={demo} />}
          {view.page === "support" && <Support demo={demo} go={go} />}
          {ticket && <TicketPage id={ticket.id} demo={demo} go={go} />}
          {view.page === "new-ticket" && <NewTicket demo={demo} go={go} orderId={view.orderId} />}
          {view.page === "profile" && <div className={`${card} max-w-3xl p-6 sm:p-8`}><ProfileForm demo={demo} /></div>}
          {view.page === "password" && <div className={`${card} max-w-2xl p-6 sm:p-8`}><PasswordForm demo={demo} /></div>}
        </div>
      </div>
    </PageShell>
  );
}

// ---------- The band: title, wallet, tabs ----------

function Band({ view, go, demo, title, sub, back, h1 }: { view: View; go: Go; demo: Demo; title: string; sub: ReactNode; back?: { label: string; to: View }; h1: React.RefObject<HTMLHeadingElement | null> }) {
  const t = useT();
  const f = useFmt();
  const needs = demo.orders.filter((o) => o.state === "needs-you").length + demo.arrived.length;
  const replies = demo.tickets.filter((x) => x.state === "replied").length;
  const tab = view.page === "order" ? "orders" : view.page === "ticket" || view.page === "new-ticket" ? "support" : view.page;
  const tabs: { id: View["page"]; label: string; count?: number }[] = [
    { id: "overview", label: t("Overview"), count: needs + replies },
    { id: "orders", label: t("Orders") },
    { id: "funds", label: t("Add funds") },
    { id: "support", label: t("Support"), count: replies },
    { id: "profile", label: t("Profile") },
    { id: "password", label: t("Password") },
  ];
  return (
    <div className="-mt-16 bg-[#1e1b4b] pt-16 text-white dark:bg-[#15123a]">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-6 pb-7 pt-8 sm:pt-12">
          <div className="min-w-0 max-w-2xl">
            {back && (
              <button type="button" onClick={() => go(back.to)} className={`mb-3 inline-flex items-center gap-1.5 rounded text-sm font-semibold text-indigo-200 hover:text-white ${bandRing}`}>
                <ArrowLeft aria-hidden className="h-4 w-4 rtl:rotate-180" />{back.label}
              </button>
            )}
            <h1 ref={h1} tabIndex={-1} className="text-balance font-display text-3xl font-bold tracking-tight focus:outline-none sm:text-4xl">{title}</h1>
            <div className="mt-2 text-[15px] text-indigo-200">{sub}</div>
          </div>
          <div className="flex items-center gap-4">
            <div className="sm:text-end">
              <div className="text-sm text-indigo-200">{t("Wallet")}</div>
              <div className="font-display text-2xl font-bold tabular-nums">{f.money(demo.wallet)}</div>
            </div>
            {view.page !== "funds" && (
              <button type="button" onClick={() => go({ page: "funds" })} className={`inline-flex items-center gap-1.5 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-indigo-950 transition-colors hover:bg-indigo-100 ${bandRing}`}>
                <Plus aria-hidden className="h-4 w-4" />{t("Add funds")}
              </button>
            )}
          </div>
        </div>
        {/* On phones the last tabs run off the edge; the fade says the row scrolls. */}
        <nav aria-label={t("Account")} className="-mx-3 flex overflow-x-auto [scrollbar-width:none] max-md:[mask-image:linear-gradient(to_right,#000_82%,transparent)] max-md:rtl:[mask-image:linear-gradient(to_left,#000_82%,transparent)] [&::-webkit-scrollbar]:hidden">
          {tabs.map((x) => {
            const on = tab === x.id;
            return (
              <button key={x.id} type="button" onClick={() => go({ page: x.id } as View)} aria-current={on ? "page" : undefined}
                className={`relative flex shrink-0 items-center gap-2 whitespace-nowrap rounded-t-lg px-3 pb-4 pt-3 text-[15px] font-semibold transition-colors ${on ? "text-white" : "text-indigo-200 hover:text-white"} ${bandRing}`}>
                {x.label}
                {!!x.count && <span className="grid h-5 min-w-5 place-items-center rounded-full bg-white px-1.5 text-xs font-bold tabular-nums text-indigo-950">{x.count}</span>}
                {on && <span aria-hidden className="absolute inset-x-3 bottom-0 h-[3px] rounded-t-full bg-white" />}
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}

function H2({ children, count, action }: { children: ReactNode; count?: number; action?: ReactNode }) {
  return (
    <div className="mb-4 flex items-center justify-between gap-4">
      <h2 className="flex items-center gap-2.5 font-display text-xl font-bold tracking-tight text-slate-900 dark:text-white">
        {children}
        {count != null && <span className="grid h-6 min-w-6 place-items-center rounded-full bg-slate-200 px-2 text-sm font-bold tabular-nums text-slate-800 dark:bg-white/10 dark:text-slate-100">{count}</span>}
      </h2>
      {action}
    </div>
  );
}

const textBtn = `${smallBtn} text-indigo-700 hover:bg-indigo-50 dark:text-indigo-300 dark:hover:bg-indigo-400/10`;

// ---------- Overview ----------

function Overview({ demo, go }: { demo: Demo; go: Go }) {
  const t = useT();
  const f = useFmt();
  const fresh = demo.orders.filter((o) => demo.arrived.includes(o.id) && o.delivery.type === "number" && o.delivery.code);
  const paused = demo.orders.filter((o) => o.state === "needs-you");
  const replied = demo.tickets.filter((x) => x.state === "replied");
  const way = demo.orders.filter((o) => laneOf(o) === "way");
  const held = demo.topUps.filter((p) => p.state === "on-hold");
  const done = demo.orders.filter((o) => laneOf(o) === "done" && !demo.arrived.includes(o.id)).slice(0, 5);
  const needCount = fresh.length + paused.length + replied.length;

  return (
    <div className="space-y-12">
      <div className="grid gap-x-6 gap-y-12 lg:grid-cols-12">
        <section aria-labelledby="a-needs" className="lg:col-span-7">
          <H2 count={needCount}><span id="a-needs">{t("Needs you")}</span></H2>
          <ul className={`${card} divide-y divide-slate-200 dark:divide-white/10`}>
            {fresh.map((o) => o.delivery.type === "number" && (
              <li key={`c${o.id}`} className="flex animate-fade-up flex-wrap items-center gap-4 p-5 [animation-duration:450ms] sm:p-6">
                <ServiceTile service={o.service} />
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-slate-900 dark:text-white">{t("Your {0} code is here", { 0: o.delivery.app })}</p>
                  <p dir="ltr" className="text-start font-mono text-sm text-slate-600 dark:text-slate-400">{o.delivery.number}</p>
                </div>
                <span dir="ltr" className="font-mono text-3xl font-bold tracking-[0.18em] text-emerald-800 dark:text-emerald-300">{o.delivery.code}</span>
                <CopyButton text={o.delivery.code!} label={t("Copy code")} showLabel />
              </li>
            ))}
            {paused.map((o) => o.delivery.type === "progress" && o.delivery.problem && (
              <li key={o.id} className="flex gap-4 p-5 sm:p-6">
                <ServiceTile service={o.service} />
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-slate-900 dark:text-white">{t("{0} is paused", { 0: t(o.title) })}</p>
                  <p className="mt-0.5 text-[15px] text-slate-700 dark:text-slate-300"><b className="font-semibold">{t(o.delivery.problem.title)}.</b>{" "}{t(o.delivery.problem.text)}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button type="button" onClick={() => demo.resume(o.id)} className={`${smallBtn} bg-indigo-600 text-white hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-400`}>{t("It's public now, continue")}</button>
                    <CancelInline order={o} demo={demo} keepLabel="Keep it" label="Cancel for a refund" />
                    <button type="button" onClick={() => go({ page: "order", id: o.id })} className={textBtn}>{t("Order #{0}", { 0: o.id })}</button>
                  </div>
                </div>
              </li>
            ))}
            {replied.map((x) => {
              const last = x.messages[x.messages.length - 1];
              return (
                <li key={`t${x.id}`} className="flex gap-4 p-5 sm:p-6">
                  <span aria-hidden className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-indigo-100 text-indigo-800 dark:bg-indigo-400/15 dark:text-indigo-200"><MessageCircle className="h-5 w-5" /></span>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-slate-900 dark:text-white">{t("Support replied: {0}", { 0: t(x.subject) })}</p>
                    <p className="mt-0.5 line-clamp-2 text-[15px] text-slate-700 dark:text-slate-300">{last.name}: {t(last.text)}</p>
                    <button type="button" onClick={() => go({ page: "ticket", id: x.id })} className={`${smallBtn} mt-3 bg-indigo-600 text-white hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-400`}>{t("Read and reply")}</button>
                  </div>
                </li>
              );
            })}
            {needCount === 0 && <li><Empty title={t("Nothing needs you")} text={t("When an order needs something from you, a code comes in or support replies, it shows up here first.")} /></li>}
          </ul>
        </section>

        <section aria-labelledby="a-way" className="lg:col-span-5">
          <H2 count={way.length + held.length}><span id="a-way">{t("On the way")}</span></H2>
          <ul className={`${card} divide-y divide-slate-200 dark:divide-white/10`}>
            {way.map((o) => <WayRow key={o.id} o={o} demo={demo} go={go} />)}
            {held.map((p) => {
              const c = demo.cardOf(p.card);
              return (
                <li key={p.id} className="p-5">
                  <div className="flex items-start gap-3">
                    <span aria-hidden className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-slate-100 text-slate-700 dark:bg-white/10 dark:text-slate-200"><CreditCard className="h-5 w-5" /></span>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <p className="font-semibold text-slate-900 dark:text-white">{t("Top-up · {0}", { 0: f.money(p.amount) })}</p>
                        <Badge kind="on-hold" />
                      </div>
                      <p className="mt-0.5 text-sm text-slate-600 dark:text-slate-400">{t("Paid with {0}, which isn't on your account, so we're checking it. It's added once the check is done.", { 0: c ? `•••• ${c.last4}` : t("another card") })}</p>
                    </div>
                  </div>
                </li>
              );
            })}
            {way.length + held.length === 0 && <li><Empty title={t("Nothing on the way")} text={t("Orders being delivered show here with their timers.")} /></li>}
          </ul>
        </section>
      </div>

      <section aria-labelledby="a-done">
        <H2 action={<button type="button" onClick={() => go({ page: "orders" })} className={textBtn}>{t("All orders")}<ChevronRight aria-hidden className="h-4 w-4 rtl:rotate-180" /></button>}>
          <span id="a-done">{t("Done")}</span>
        </H2>
        <div className={card}><OrderTable orders={done} demo={demo} go={go} /></div>
      </section>
    </div>
  );
}

function WayRow({ o, demo, go }: { o: AccountOrder; demo: Demo; go: Go }) {
  const t = useT();
  const f = useFmt();
  const d = o.delivery;
  return (
    <li className="p-5">
      <div className="flex items-start gap-3">
        <ServiceTile service={o.service} />
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline justify-between gap-3">
            <button type="button" onClick={() => go({ page: "order", id: o.id })} className="rounded text-start font-semibold text-slate-900 underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 dark:text-white dark:focus-visible:ring-emerald-400">{t(o.title)}</button>
            {o.state === "waiting" && <span className="font-mono text-lg font-bold tabular-nums text-slate-900 dark:text-white">{demo.clock.text}</span>}
            {d.type === "progress" && <span className="text-sm font-semibold tabular-nums text-slate-900 dark:text-white">{Math.round((d.done / d.total) * 100)}%</span>}
          </div>
          {d.type === "number" && <p dir="ltr" className="text-start font-mono text-sm text-slate-600 dark:text-slate-400">{d.number}</p>}
          {d.type === "progress" && <p className="text-sm text-slate-600 dark:text-slate-400">{t("{0} of {1} {2}", { 0: f.num(d.done), 1: f.num(d.total), 2: t(d.unit) })}</p>}
        </div>
      </div>
      <Bar fraction={o.state === "waiting" ? demo.clock.fraction : d.type === "progress" ? d.done / d.total : 0} className="mt-3" />
      {o.state === "waiting" && <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{t("Waiting for the SMS code. No code in time means an automatic refund.")}</p>}
    </li>
  );
}

// ---------- Orders ----------

function OrderTable({ orders, demo, go, emptyText }: { orders: AccountOrder[]; demo: Demo; go: Go; emptyText?: ReactNode }) {
  const t = useT();
  const f = useFmt();
  const line = useOrderLine();
  if (!orders.length) return <>{emptyText}</>;
  return (
    <table className="w-full table-fixed text-start">
      <colgroup><col /><col className="hidden w-28 md:table-column" /><col className="hidden w-36 md:table-column" /><col className="hidden w-40 md:table-column" /><col className="hidden w-44 md:table-column" /><col className="w-12" /></colgroup>
      <thead className="hidden border-b border-slate-200 md:table-header-group dark:border-white/10">
        <tr className="text-sm text-slate-600 dark:text-slate-400">
          <th scope="col" className="px-5 py-3 text-start font-medium sm:ps-6">{t("Item")}</th>
          <th scope="col" className="px-3 py-3 text-start font-medium">{t("Order")}</th>
          <th scope="col" className="px-3 py-3 text-start font-medium">{t("Date")}</th>
          <th scope="col" className="px-3 py-3 text-end font-medium">{t("Amount")}</th>
          <th scope="col" className="px-3 py-3 text-start font-medium">{t("Status")}</th>
          <th scope="col"><span className="sr-only">{t("Open")}</span></th>
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-200 dark:divide-white/10">
        {orders.map((o) => (
          <tr key={o.id} onClick={() => go({ page: "order", id: o.id })} className="cursor-pointer transition-colors hover:bg-slate-50 dark:hover:bg-white/[.03]">
            <td className="px-5 py-4 sm:ps-6">
              <div className="flex items-center gap-3">
                <ServiceTile service={o.service} />
                <div className="min-w-0">
                  <button type="button" onClick={(e) => { e.stopPropagation(); go({ page: "order", id: o.id }); }} className="block max-w-full truncate rounded text-start font-semibold text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 dark:text-white dark:focus-visible:ring-emerald-400">{t(o.title)}</button>
                  <p className="truncate text-sm text-slate-600 dark:text-slate-400">{line(o, demo)}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-2 md:hidden"><Badge kind={o.state} /><span className="text-sm font-semibold tabular-nums text-slate-900 dark:text-white">{f.money(o.price)}</span></div>
                </div>
              </div>
            </td>
            <td className="hidden px-3 py-4 font-mono text-sm text-slate-700 md:table-cell dark:text-slate-300">#{o.id}</td>
            <td className="hidden px-3 py-4 text-sm text-slate-700 md:table-cell dark:text-slate-300">{f.when(o.at)}</td>
            <td className="hidden px-3 py-4 text-end text-[15px] font-semibold tabular-nums text-slate-900 md:table-cell dark:text-white">{f.money(o.price)}</td>
            <td className="hidden px-3 py-4 md:table-cell"><Badge kind={o.state} /></td>
            <td className="pe-4 text-slate-400"><ChevronRight aria-hidden className="h-5 w-5 rtl:rotate-180" /></td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

const groupOf = (o: AccountOrder) => (o.kind === "number" ? "numbers" : o.kind === "social" ? "social" : o.kind === "telegram" ? "telegram" : "accounts");

function Orders({ demo, go, initial }: { demo: Demo; go: Go; initial: Lane | "all" }) {
  const t = useT();
  const [lane, setLane] = useState<Lane | "all">(initial);
  const [q, setQ] = useState("");
  const [group, setGroup] = useState("all");
  const counts = { all: demo.orders.length, needs: 0, way: 0, done: 0 };
  demo.orders.forEach((o) => counts[laneOf(o)]++);
  const list = useMemo(() => {
    const s = q.trim().toLowerCase().replace(/^#/, "");
    return demo.orders.filter((o) => (lane === "all" || laneOf(o) === lane) && (group === "all" || groupOf(o) === group)
      && (!s || `${o.id} ${o.title} ${o.detail} ${o.service}`.toLowerCase().includes(s)));
  }, [demo.orders, lane, group, q]);
  const lanes: { id: Lane | "all"; label: string }[] = [
    { id: "all", label: t("All") }, { id: "needs", label: t("Needs you") }, { id: "way", label: t("On the way") }, { id: "done", label: t("Done") },
  ];
  return (
    <div>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div role="group" aria-label={t("Show")} className="flex flex-wrap gap-2">
          {lanes.map((l) => {
            const on = lane === l.id;
            return (
              <button key={l.id} type="button" aria-pressed={on} onClick={() => setLane(l.id)}
                className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${on ? "border-indigo-950 bg-indigo-950 text-white dark:border-white dark:bg-white dark:text-indigo-950" : "border-slate-300 text-slate-800 hover:border-slate-400 dark:border-white/20 dark:text-slate-100 dark:hover:border-white/40"} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2 dark:focus-visible:ring-emerald-400 dark:focus-visible:ring-offset-[#070B14]`}>
                {l.label}<span className={`tabular-nums ${on ? "opacity-80" : "text-slate-500 dark:text-slate-400"}`}>{counts[l.id]}</span>
              </button>
            );
          })}
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <label className="relative block sm:w-72">
            <span className="sr-only">{t("Search orders")}</span>
            <Search aria-hidden className="pointer-events-none absolute start-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder={t("Order, phone or username")} className={`${field} !py-2.5 ps-10 caret-emerald-600`} />
          </label>
          <label className="block">
            <span className="sr-only">{t("Service")}</span>
            <select value={group} onChange={(e) => setGroup(e.target.value)} className={`${field} appearance-auto !py-2.5 sm:w-52`}>
              <option value="all">{t("All services")}</option>
              <option value="numbers">{t("Virtual numbers")}</option>
              <option value="telegram">{t("Telegram")}</option>
              <option value="social">{t("Social growth")}</option>
              <option value="accounts">{t("Accounts & subscriptions")}</option>
            </select>
          </label>
        </div>
      </div>
      <p aria-live="polite" className="sr-only">{t("{0} orders shown", { 0: list.length })}</p>
      <div className={`${card} mt-5`}>
        <OrderTable orders={list} demo={demo} go={go} emptyText={
          <Empty title={q ? t("No orders match \"{0}\"", { 0: q }) : t("No orders here")} text={q ? t("Try an order number like 10487, a phone number or a username.") : t("Orders in this state will show here.")}
            action={(q || group !== "all" || lane !== "all") && <button type="button" onClick={() => { setQ(""); setGroup("all"); setLane("all"); }} className={secondary}><X aria-hidden className="h-4 w-4" />{t("Clear filters")}</button>} />
        } />
      </div>
    </div>
  );
}

const deliveryTitle = (o: AccountOrder) => ({ number: "Your number", progress: "Delivery", gift: "Gift", login: "Login details", activation: "Subscription" })[o.delivery.type];

function OrderPage({ order, demo, go }: { order: AccountOrder; demo: Demo; go: Go }) {
  const t = useT();
  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start">
      <div className="space-y-6">
        <section aria-labelledby="a-got" className={`${card} p-6 sm:p-7`}>
          <h2 id="a-got" className="mb-4 font-display text-lg font-semibold text-slate-900 dark:text-white">{t(deliveryTitle(order))}</h2>
          <Delivery order={order} demo={demo} />
        </section>
        <section aria-labelledby="a-steps" className={`${card} p-6 sm:p-7`}>
          <h2 id="a-steps" className="mb-4 font-display text-lg font-semibold text-slate-900 dark:text-white">{t("Progress")}</h2>
          <OrderSteps order={order} />
        </section>
      </div>
      <aside className="lg:sticky lg:top-24">
        <section aria-labelledby="a-pay" className={`${card} p-6`}>
          <h2 id="a-pay" className="font-display text-lg font-semibold text-slate-900 dark:text-white">{t("Payment")}</h2>
          <div className="mt-2"><PaymentRows order={order} demo={demo} /></div>
          <div className="mt-5 grid gap-2">
            <Link href={buyAgainHref(order)} className={secondary}>{t("Buy again")}</Link>
            <button type="button" onClick={() => go({ page: "new-ticket", orderId: order.id })} className={secondary}><MessageCircle aria-hidden className="h-4 w-4" />{t("Get help with this order")}</button>
          </div>
        </section>
      </aside>
    </div>
  );
}

// ---------- Add funds ----------

function Funds({ demo }: { demo: Demo }) {
  const t = useT();
  const f = useFmt();
  const s = useTopUp(demo);
  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start">
      <div className="space-y-6">
        <form noValidate onSubmit={(e) => { e.preventDefault(); s.submit(); }} className={`${card} space-y-9 p-6 sm:p-8`}>
          <AmountPicker s={s} />
          <CardPicker s={s} demo={demo} />
        </form>
        <section aria-labelledby="a-topups" className={card}>
          <h2 id="a-topups" className="px-6 pb-2 pt-6 font-display text-lg font-semibold text-slate-900 dark:text-white">{t("Recent top-ups")}</h2>
          <ul className="divide-y divide-slate-200 dark:divide-white/10">
            {demo.topUps.map((p) => {
              const c = demo.cardOf(p.card);
              return (
                <li key={p.id} className="flex flex-wrap items-center gap-x-4 gap-y-1 px-6 py-4">
                  <span className="min-w-0 flex-1">
                    <span className="block font-semibold tabular-nums text-slate-900 dark:text-white">{f.money(p.amount)}</span>
                    <span className="block text-sm text-slate-600 dark:text-slate-400">{f.when(p.at)} · {c ? cardShort(c) : ""}</span>
                  </span>
                  <Badge kind={p.state === "on-hold" ? "on-hold" : "done"} />
                  {p.state === "on-hold" && <p className="w-full text-sm text-slate-600 dark:text-slate-400">{t("This card isn't on your account, so the top-up is being checked. Ticket #3301 has the details.")}</p>}
                </li>
              );
            })}
          </ul>
        </section>
      </div>
      <aside className="lg:sticky lg:top-24"><TopUpSummary s={s} demo={demo} /></aside>
    </div>
  );
}

// ---------- Support ----------

function Support({ demo, go }: { demo: Demo; go: Go }) {
  const t = useT();
  const f = useFmt();
  const order = { replied: 0, waiting: 1, closed: 2 };
  const list = [...demo.tickets].sort((a, b) => order[a.state] - order[b.state]);
  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
        <p className="text-[15px] text-slate-700 dark:text-slate-300">{t("{0} open, {1} closed", { 0: demo.tickets.filter((x) => x.state !== "closed").length, 1: demo.tickets.filter((x) => x.state === "closed").length })}</p>
        <button type="button" onClick={() => go({ page: "new-ticket" })} className={primary}><Plus aria-hidden className="h-4 w-4" />{t("New ticket")}</button>
      </div>
      <ul className={`${card} divide-y divide-slate-200 dark:divide-white/10`}>
        {list.map((x) => {
          const last = x.messages[x.messages.length - 1];
          return (
            <li key={x.id}>
              <button type="button" onClick={() => go({ page: "ticket", id: x.id })} className="flex w-full items-center gap-4 rounded-3xl p-5 text-start transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-emerald-600 sm:px-6 dark:hover:bg-white/[.03] dark:focus-visible:ring-emerald-400">
                <span className="min-w-0 flex-1">
                  <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    <span className={`font-semibold text-slate-900 dark:text-white ${x.state === "replied" ? "" : "font-medium"}`}>{t(x.subject)}</span>
                    <Badge kind={ticketBadge(x.state)} />
                  </span>
                  <span className="mt-1 block text-sm text-slate-600 dark:text-slate-400">#{x.id} · {t(deptLabel(x.dept))}{x.orderId ? ` · ${t("Order #{0}", { 0: x.orderId })}` : ""} · {t("updated {0}", { 0: f.when(last.at) })}</span>
                </span>
                <ChevronRight aria-hidden className="h-5 w-5 shrink-0 text-slate-400 rtl:rotate-180" />
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function TicketPage({ id, demo, go }: { id: number; demo: Demo; go: Go }) {
  const t = useT();
  const f = useFmt();
  const x = demo.tickets.find((k) => k.id === id)!;
  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start">
      <section aria-label={t("Conversation")} className={`${card} p-5 sm:p-7`}>
        <Thread ticket={x} />
        <div className="mt-7 border-t border-slate-200 pt-6 dark:border-white/10"><ReplyBox ticket={x} demo={demo} /></div>
      </section>
      <aside className={`${card} p-6 lg:sticky lg:top-24`}>
        <h2 className="font-display text-lg font-semibold text-slate-900 dark:text-white">{t("Ticket")}</h2>
        <div className="mt-2">
          <SumRows rows={[
            [t("Status"), <Badge key="s" kind={ticketBadge(x.state)} />],
            [t("Department"), t(deptLabel(x.dept))],
            ...(x.orderId ? [[t("Order"), <button key="o" type="button" onClick={() => go({ page: "order", id: x.orderId! })} className="rounded font-semibold text-indigo-700 underline-offset-4 hover:underline dark:text-indigo-300">#{x.orderId}</button>] as [string, ReactNode]] : []),
            [t("Opened"), f.when(x.messages[0].at)],
          ]} />
        </div>
      </aside>
    </div>
  );
}

function NewTicket({ demo, go, orderId }: { demo: Demo; go: Go; orderId?: number }) {
  const t = useT();
  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start">
      <div className={`${card} p-6 sm:p-8`}><NewTicketForm demo={demo} orderId={orderId} onDone={(id) => go({ page: "ticket", id })} onCancel={() => go({ page: "support" })} /></div>
      <aside className={`${card} p-6 lg:sticky lg:top-24`}>
        <h2 className="font-display text-lg font-semibold text-slate-900 dark:text-white">{t("Before you write")}</h2>
        <ul className="mt-3 space-y-3 text-[15px] text-slate-700 dark:text-slate-300">
          <li>{t("A code that doesn't arrive is refunded to your wallet automatically when the time runs out.")}</li>
          <li>{t("Codes and logins you've received are in each order. Open the order to copy them.")}</li>
          <li>{t("Choose the order the ticket is about, so we can see it straight away.")}</li>
        </ul>
      </aside>
    </div>
  );
}
