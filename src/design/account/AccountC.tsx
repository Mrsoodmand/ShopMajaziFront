"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { ArrowLeft, ChevronRight, KeyRound, LifeBuoy, LogOut, MessageCircle, Package, Plus, ReceiptText, RotateCcw, Search, UserRound, Wallet } from "lucide-react";
import Link from "@/i18n/Link";
import { PageShell } from "../otp/parts";
import { useT } from "@/i18n/client";
import type { AccountOrder } from "@/content/account-en";
import {
  AmountPicker, Badge, CardPicker, Delivery, Empty, NewTicketForm, OrderSteps, PasswordForm, ProfileForm, ReplyBox,
  ServiceTile, Thread, TopUpSummary, buyAgainHref, card, cardShort, deptLabel, field, laneOf, secondary,
  ticketBadge, useAccountDemo, useFmt, useOrderLine, useTopUp, type Demo, type Line,
} from "./kit";

// Account C — "Passbook". The account is read like a bank passbook: the home page is the wallet statement, every
// top-up, purchase and refund on its own line with the balance after it in the last column, the current balance at
// the head of that column. A purchase opens as a receipt whose money lines add up; a refund is a line of its own and
// never erases the purchase. Navigation is a deep indigo rail on the start side, a tab bar on phones.

type Page = "statement" | "orders" | "order" | "funds" | "support" | "profile" | "password";
type View = { page: Page; id?: number };
type Go = (v: View) => void;

const railRing = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#1e1b4b] dark:focus-visible:ring-offset-[#15123a]";
const pageRing = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2 dark:focus-visible:ring-emerald-400 dark:focus-visible:ring-offset-[#070B14]";

const NAV: { page: Page; label: string; Icon: typeof Wallet }[] = [
  { page: "statement", label: "Statement", Icon: ReceiptText },
  { page: "orders", label: "Orders", Icon: Package },
  { page: "funds", label: "Add funds", Icon: Wallet },
  { page: "support", label: "Support", Icon: LifeBuoy },
  { page: "profile", label: "Profile", Icon: UserRound },
  { page: "password", label: "Password", Icon: KeyRound },
];
const navOf = (p: Page): Page => (p === "order" ? "orders" : p);

export default function AccountC() {
  const t = useT();
  const f = useFmt();
  const demo = useAccountDemo();
  const [view, setView] = useState<View>({ page: "statement" });
  const top = useRef<HTMLDivElement>(null);
  const first = useRef(true);
  const go: Go = (v) => setView(v);
  useEffect(() => {
    if (first.current) { first.current = false; return; }
    const box = top.current?.getBoundingClientRect();
    if (box && box.top < 0) top.current?.scrollIntoView({ block: "start" });
    (top.current?.querySelector("h1") as HTMLElement | null)?.focus({ preventScroll: true });
  }, [view]);
  const replies = demo.tickets.filter((x) => x.state === "replied").length;
  const order = view.page === "order" ? demo.orders.find((o) => o.id === view.id) : undefined;

  return (
    <PageShell>
      <div ref={top} className="scroll-mt-16 selection:bg-indigo-200 selection:text-indigo-950 dark:selection:bg-indigo-400/40 dark:selection:text-white">
        <div className="mx-auto max-w-7xl px-4 pb-10 pt-6 sm:px-6 sm:pt-10 lg:grid lg:grid-cols-[16rem_minmax(0,1fr)] lg:gap-10">
          <aside className="hidden lg:block">
            <div className="sticky top-24 flex flex-col rounded-3xl bg-[#1e1b4b] p-4 text-white dark:bg-[#15123a]">
              <div className="px-3 pb-4 pt-2">
                <p className="truncate font-semibold">{demo.user.name}</p>
                <p dir="ltr" className="text-start text-sm text-indigo-200">{demo.user.mobile}</p>
              </div>
              <div className="mx-3 border-y border-white/15 py-4">
                <p className="text-sm text-indigo-200">{t("Wallet balance")}</p>
                <p className="font-display text-2xl font-bold tabular-nums">{f.money(demo.wallet)}</p>
              </div>
              <nav aria-label={t("Account")} className="mt-3">
                <ul className="space-y-1">
                  {NAV.map(({ page, label, Icon }) => {
                    const on = navOf(view.page) === page;
                    return (
                      <li key={page}>
                        <button type="button" onClick={() => go({ page })} aria-current={on ? "page" : undefined}
                          className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-start text-[15px] font-semibold transition-colors ${on ? "bg-white text-indigo-950" : "text-indigo-100 hover:bg-white/10 hover:text-white"} ${railRing}`}>
                          <Icon aria-hidden className="h-5 w-5 shrink-0" />
                          <span className="flex-1">{t(label)}</span>
                          {page === "support" && !!replies && <span className={`grid h-5 min-w-5 place-items-center rounded-full px-1.5 text-xs font-bold tabular-nums ${on ? "bg-indigo-600 text-white" : "bg-white text-indigo-950"}`}>{replies}</span>}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </nav>
              <button type="button" className={`mt-6 flex items-center gap-3 rounded-xl px-3 py-2.5 text-start text-[15px] text-indigo-200 transition-colors hover:bg-white/10 hover:text-white ${railRing}`}>
                <LogOut aria-hidden className="h-5 w-5 rtl:rotate-180" />{t("Sign out")}
              </button>
            </div>
          </aside>

          <div className="min-w-0">
            {view.page === "statement" && <Statement demo={demo} go={go} />}
            {view.page === "orders" && <Orders demo={demo} go={go} />}
            {view.page === "order" && order && <Receipt order={order} demo={demo} go={go} />}
            {view.page === "funds" && <Funds demo={demo} />}
            {view.page === "support" && <Support key={view.id ?? "list"} demo={demo} go={go} initial={view.id} />}
            {(view.page === "profile" || view.page === "password") && <Settings page={view.page} demo={demo} go={go} />}
          </div>
        </div>

        {/* Phones: a tab bar that stays at the bottom while the account is on screen. */}
        <nav aria-label={t("Account")} className="sticky bottom-0 z-30 border-t border-slate-200 bg-white/95 pb-[env(safe-area-inset-bottom)] shadow-[0_-8px_24px_-12px_rgba(0,0,0,.25)] backdrop-blur lg:hidden dark:border-white/10 dark:bg-[#0B1020]/95">
          <ul className="mx-auto grid max-w-lg grid-cols-5">
            {NAV.filter((n) => n.page !== "password").map(({ page, label, Icon }) => {
              const on = navOf(view.page) === page || (page === "profile" && view.page === "password");
              return (
                <li key={page}>
                  <button type="button" onClick={() => go({ page })} aria-current={on ? "page" : undefined}
                    className={`relative flex w-full flex-col items-center gap-1 px-1 pb-2.5 pt-3 text-xs font-semibold transition-colors ${on ? "text-indigo-700 dark:text-indigo-300" : "text-slate-600 dark:text-slate-400"} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-emerald-600 dark:focus-visible:ring-emerald-400`}>
                    {on && <span aria-hidden className="absolute inset-x-5 top-0 h-[3px] rounded-b-full bg-indigo-600 dark:bg-indigo-400" />}
                    <Icon aria-hidden className="h-5 w-5" />
                    {page === "profile" ? t("Me") : t(label)}
                    {page === "support" && !!replies && <span className="absolute end-[calc(50%-1.25rem)] top-2 h-2.5 w-2.5 rounded-full bg-indigo-600 ring-2 ring-white dark:ring-[#0B1020]"><span className="sr-only">{t("{0} new replies", { 0: replies })}</span></span>}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </PageShell>
  );
}

function Head({ title, sub, action, back }: { title: string; sub?: ReactNode; action?: ReactNode; back?: { label: string; onClick: () => void } }) {
  return (
    <div className="mb-8">
      {back && (
        <button type="button" onClick={back.onClick} className={`mb-3 inline-flex items-center gap-1.5 rounded text-sm font-semibold text-indigo-700 hover:underline dark:text-indigo-300 ${pageRing}`}>
          <ArrowLeft aria-hidden className="h-4 w-4 rtl:rotate-180" />{back.label}
        </button>
      )}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="min-w-0 max-w-2xl">
          <h1 tabIndex={-1} className="text-balance font-display text-3xl font-bold tracking-tight text-slate-900 focus:outline-none sm:text-4xl dark:text-white">{title}</h1>
          {sub && <div className="mt-2 text-[15px] text-slate-700 dark:text-slate-300">{sub}</div>}
        </div>
        {action}
      </div>
    </div>
  );
}

const indigoBtn = `inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-[15px] font-semibold text-white transition-colors hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-400 ${pageRing}`;

// ---------- Statement ----------

type Filter = "all" | "top-up" | "purchase" | "refund";

function Statement({ demo, go }: { demo: Demo; go: Go }) {
  const t = useT();
  const f = useFmt();
  const [filter, setFilter] = useState<Filter>("all");
  const lines = demo.statement.filter((l) => filter === "all" || (filter === "purchase" ? l.kind === "purchase" || l.kind === "card" : l.kind === filter));
  const days: { day: string; lines: Line[] }[] = [];
  lines.forEach((l) => { const d = f.day(l.at); const g = days[days.length - 1]; if (g?.day === d) g.lines.push(l); else days.push({ day: d, lines: [l] }); });

  const live = [
    ...demo.orders.filter((o) => demo.arrived.includes(o.id)).map((o) => ({ key: `c${o.id}`, text: t("{0} code is here", { 0: o.service }), go: () => go({ page: "order", id: o.id }), dot: "bg-emerald-600" })),
    ...demo.orders.filter((o) => o.state === "needs-you").map((o) => ({ key: `n${o.id}`, text: t("{0} needs you", { 0: t(o.title) }), go: () => go({ page: "order", id: o.id }), dot: "bg-indigo-600" })),
    ...demo.tickets.filter((x) => x.state === "replied").map((x) => ({ key: `t${x.id}`, text: t("Support replied on #{0}", { 0: x.id }), go: () => go({ page: "support", id: x.id }), dot: "bg-indigo-600" })),
    ...demo.orders.filter((o) => laneOf(o) === "way").map((o) => ({ key: `w${o.id}`, text: o.state === "waiting" ? t("{0} · {1} left", { 0: t(o.title), 1: demo.clock.text }) : t("{0} · delivering", { 0: t(o.title) }), go: () => go({ page: "order", id: o.id }), dot: "bg-amber-500" })),
  ];
  const filters: { id: Filter; label: string }[] = [{ id: "all", label: t("All") }, { id: "top-up", label: t("Top-ups") }, { id: "purchase", label: t("Purchases") }, { id: "refund", label: t("Refunds") }];

  return (
    <div>
      <Head title={t("Statement")} sub={t("Every top-up, purchase and refund, newest first, with your balance after each one.")}
        action={<button type="button" onClick={() => go({ page: "funds" })} className={indigoBtn}><Plus aria-hidden className="h-4 w-4" />{t("Add funds")}</button>} />

      {!!live.length && (
        <section aria-label={t("Happening now")} className="mb-8">
          <ul className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 [&::-webkit-scrollbar]:hidden">
            {live.map((x) => (
              <li key={x.key}>
                <button type="button" onClick={x.go} className={`inline-flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full border border-slate-300 bg-white px-3.5 py-2 text-sm font-semibold text-slate-800 transition-colors hover:border-slate-400 dark:border-white/20 dark:bg-white/5 dark:text-slate-100 ${pageRing}`}>
                  <span aria-hidden className={`h-2 w-2 rounded-full ${x.dot}`} /><span className="tabular-nums">{x.text}</span><ChevronRight aria-hidden className="h-4 w-4 text-slate-400 rtl:rotate-180" />
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className={card}>
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-5 py-4 sm:px-6 dark:border-white/10">
          <div role="group" aria-label={t("Show")} className="inline-flex rounded-xl bg-slate-100 p-1 dark:bg-white/[.06]">
            {filters.map((x) => (
              <button key={x.id} type="button" aria-pressed={filter === x.id} onClick={() => setFilter(x.id)}
                className={`rounded-lg px-3 py-1.5 text-sm font-semibold transition-colors ${filter === x.id ? "bg-white text-slate-900 shadow-sm dark:bg-white/15 dark:text-white" : "text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"} ${pageRing}`}>{x.label}</button>
            ))}
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400">{t("Amounts in Toman")}</p>
        </div>

        <table className="w-full table-fixed">
          <caption className="sr-only">{t("Wallet statement")}</caption>
          <colgroup><col /><col className="w-28 sm:w-36" /><col className="w-0 sm:w-36" /></colgroup>
          <thead>
            <tr className="text-sm text-slate-600 dark:text-slate-400">
              <th scope="col" className="px-5 pb-2 pt-4 text-start font-medium sm:ps-6">{t("Description")}</th>
              <th scope="col" className="px-3 pb-2 pt-4 text-end font-medium">{t("Amount")}</th>
              <th scope="col" className="hidden pb-2 pe-6 ps-3 pt-4 text-end font-medium sm:table-cell">{t("Balance")}</th>
            </tr>
            <tr className="border-b border-slate-900 dark:border-white/60">
              <th scope="row" colSpan={2} className="px-5 pb-3 text-start text-[15px] font-semibold text-slate-900 sm:ps-6 dark:text-white">{t("Balance now")}<span className="ms-2 font-display font-bold tabular-nums sm:hidden">{f.num(demo.wallet)}</span></th>
              <td className="hidden pb-3 pe-6 ps-3 text-end font-display text-xl font-bold tabular-nums text-slate-900 sm:table-cell dark:text-white">{f.num(demo.wallet)}</td>
            </tr>
          </thead>
          {days.map((g) => (
            <tbody key={g.day}>
              <tr><th scope="rowgroup" colSpan={3} className="bg-slate-50 px-5 py-2 text-start text-sm font-semibold text-slate-700 sm:ps-6 dark:bg-white/[.03] dark:text-slate-300">{g.day}</th></tr>
              {g.lines.map((l) => <StatementRow key={l.key} l={l} demo={demo} go={go} />)}
            </tbody>
          ))}
        </table>
        {!lines.length && <Empty title={t("Nothing here yet")} text={t("Lines of this kind will show here.")} />}
      </div>
    </div>
  );
}

function StatementRow({ l, demo, go }: { l: Line; demo: Demo; go: Go }) {
  const t = useT();
  const f = useFmt();
  const o = l.orderId ? demo.orders.find((x) => x.id === l.orderId) : undefined;
  const c = l.kind === "top-up" ? demo.cardOf(l.sub) : o && o.paidWith !== "wallet" ? demo.cardOf(o.paidWith) : undefined;
  const credit = l.amount > 0;
  const title = l.kind === "top-up" ? t("Top-up") : l.kind === "refund" ? t("Refund · order #{0}", { 0: l.orderId! }) : t(l.title);
  const sub = l.kind === "top-up" ? (c ? cardShort(c) : "") : l.kind === "refund" ? t(l.sub) : l.kind === "card" ? t("Paid by card {0}, not from the wallet", { 0: c ? `•••• ${c.last4}` : "" }) : t(l.sub);
  const live = o && l.kind !== "refund" && (o.state === "waiting" || o.state === "delivering" || o.state === "needs-you");
  const icon = l.kind === "top-up" ? <span aria-hidden className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-emerald-100 text-emerald-800 dark:bg-emerald-400/15 dark:text-emerald-200"><Plus className="h-4 w-4" /></span>
    : l.kind === "refund" ? <span aria-hidden className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-slate-100 text-slate-700 dark:bg-white/10 dark:text-slate-200"><RotateCcw className="h-4 w-4" /></span>
    : <ServiceTile service={o?.service ?? ""} size="sm" />;
  const body = (
    <span className="flex min-w-0 items-start gap-3">
      {icon}
      <span className="min-w-0">
        <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <span className="font-semibold text-slate-900 dark:text-white">{title}</span>
          {l.held && <Badge kind="on-hold" />}
          {live && <Badge kind={o!.state} label={o!.state === "waiting" ? t("{0} left", { 0: demo.clock.text }) : undefined} />}
        </span>
        <span className="block truncate text-sm text-slate-600 dark:text-slate-400">{f.time(l.at)} · {sub}</span>
        {l.held && <span className="mt-1 block text-sm text-slate-600 dark:text-slate-400">{t("Not in your balance yet: this card isn't on your account, so we're checking it.")}</span>}
      </span>
    </span>
  );
  return (
    <tr className={`border-t border-slate-200 first:border-t-0 dark:border-white/10 ${o ? "cursor-pointer transition-colors hover:bg-slate-50 dark:hover:bg-white/[.03]" : ""}`} onClick={o ? () => go({ page: "order", id: o.id }) : undefined}>
      <td className="px-5 py-3.5 sm:ps-6">
        {o ? <button type="button" onClick={(e) => { e.stopPropagation(); go({ page: "order", id: o.id }); }} className="block w-full rounded-lg text-start focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 dark:focus-visible:ring-emerald-400">{body}</button> : body}
      </td>
      <td className={`px-3 py-3.5 text-end align-top text-[15px] font-semibold tabular-nums ${l.held ? "text-slate-500 line-through decoration-slate-400 dark:text-slate-400" : l.kind === "card" ? "text-slate-500 dark:text-slate-400" : credit ? "text-emerald-800 dark:text-emerald-300" : "text-slate-900 dark:text-white"}`}>
        <span className="sr-only">{credit ? t("In:") : t("Out:")} </span>{f.signed(l.amount)}
      </td>
      <td className="hidden pe-6 ps-3 py-3.5 text-end align-top text-[15px] tabular-nums text-slate-700 sm:table-cell dark:text-slate-300">{l.balance == null ? <span aria-label={t("No change")}>—</span> : f.num(l.balance)}</td>
    </tr>
  );
}

// ---------- Orders, grouped by service ----------

const families = [
  { id: "number", label: "Virtual numbers" },
  { id: "telegram", label: "Telegram" },
  { id: "social", label: "Social growth" },
  { id: "accounts", label: "Accounts & subscriptions" },
] as const;
const familyOf = (o: AccountOrder) => (o.kind === "number" || o.kind === "telegram" || o.kind === "social" ? o.kind : "accounts");

function Orders({ demo, go }: { demo: Demo; go: Go }) {
  const t = useT();
  const f = useFmt();
  const line = useOrderLine();
  const [q, setQ] = useState("");
  const list = useMemo(() => {
    const s = q.trim().toLowerCase().replace(/^#/, "");
    return demo.orders.filter((o) => !s || `${o.id} ${o.title} ${o.detail}`.toLowerCase().includes(s));
  }, [demo.orders, q]);
  return (
    <div>
      <Head title={t("Orders")} sub={t("Grouped by service. Open one for its receipt, codes and logins.")}
        action={
          <label className="relative block w-full sm:w-72">
            <span className="sr-only">{t("Search orders")}</span>
            <Search aria-hidden className="pointer-events-none absolute start-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder={t("Order, phone or username")} className={`${field} !py-2.5 ps-10 caret-emerald-600`} />
          </label>
        } />
      <div className="space-y-10">
        {families.map((fam) => {
          const items = list.filter((o) => familyOf(o) === fam.id);
          if (!items.length) return null;
          return (
            <section key={fam.id} aria-labelledby={`c-fam-${fam.id}`}>
              <h2 id={`c-fam-${fam.id}`} className="mb-3 flex items-baseline gap-2 font-display text-xl font-bold tracking-tight text-slate-900 dark:text-white">{t(fam.label)}<span className="text-base font-semibold tabular-nums text-slate-500 dark:text-slate-400">{items.length}</span></h2>
              <ul className={`${card} divide-y divide-slate-200 overflow-hidden dark:divide-white/10`}>
                {items.map((o) => (
                  <li key={o.id}>
                    <button type="button" onClick={() => go({ page: "order", id: o.id })} className="flex w-full items-center gap-4 px-5 py-4 text-start transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-emerald-600 sm:px-6 dark:hover:bg-white/[.03] dark:focus-visible:ring-emerald-400">
                      <ServiceTile service={o.service} />
                      <span className="min-w-0 flex-1">
                        <span className="flex flex-wrap items-center gap-x-2 gap-y-1"><span className="font-semibold text-slate-900 dark:text-white">{t(o.title)}</span><Badge kind={o.state} /></span>
                        <span className="block truncate text-sm text-slate-600 dark:text-slate-400">{line(o, demo)}</span>
                      </span>
                      <span className="hidden text-end sm:block">
                        <span className="block text-[15px] font-semibold tabular-nums text-slate-900 dark:text-white">{f.money(o.price)}</span>
                        <span className="block text-sm text-slate-600 dark:text-slate-400">#{o.id} · {f.date(o.at)}</span>
                      </span>
                      <ChevronRight aria-hidden className="h-5 w-5 shrink-0 text-slate-400 rtl:rotate-180" />
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
        {!list.length && <div className={card}><Empty title={t("No orders match \"{0}\"", { 0: q })} text={t("Try an order number like 10487, a phone number or a username.")} action={<button type="button" onClick={() => setQ("")} className={secondary}>{t("Clear search")}</button>} /></div>}
      </div>
    </div>
  );
}

// ---------- Receipt (one order) ----------

function Receipt({ order, demo, go }: { order: AccountOrder; demo: Demo; go: Go }) {
  const t = useT();
  const f = useFmt();
  const c = order.paidWith === "wallet" ? null : demo.cardOf(order.paidWith);
  const money: { label: string; sub: string; amount: number }[] = [
    { label: c ? t("Paid by card") : t("Paid from wallet"), sub: `${f.when(order.at)}${c ? ` · ${cardShort(c)}` : ""}`, amount: -order.price },
  ];
  if (order.refund) money.push({ label: t("Refund to wallet"), sub: `${f.when(order.refund.at)} · ${t(order.refund.reason)}`, amount: order.refund.amount });
  const net = money.reduce((s, m) => s + m.amount, 0);
  const gotTitle = { number: "Your number", progress: "Delivery", gift: "Gift", login: "Login details", activation: "Subscription" }[order.delivery.type];

  return (
    <div>
      <Head back={{ label: t("Orders"), onClick: () => go({ page: "orders" }) }} title={t(order.title)}
        sub={<span className="flex flex-wrap items-center gap-x-3 gap-y-2">{t("Order #{0} · {1}", { 0: order.id, 1: f.when(order.at) })}<Badge kind={order.state} /></span>} />
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_20rem] xl:items-start">
        <article className={card}>
          <section aria-labelledby="c-got" className="p-6 sm:p-8">
            <h2 id="c-got" className="mb-4 font-display text-lg font-semibold text-slate-900 dark:text-white">{t(gotTitle)}</h2>
            <Delivery order={order} demo={demo} />
          </section>
          <section aria-labelledby="c-money" className="border-t border-dashed border-slate-300 p-6 sm:p-8 dark:border-white/20">
            <h2 id="c-money" className="mb-2 font-display text-lg font-semibold text-slate-900 dark:text-white">{t("Money")}</h2>
            <table className="w-full">
              <caption className="sr-only">{t("Payments and refunds for this order")}</caption>
              <tbody>
                {money.map((m) => (
                  <tr key={m.label} className="border-b border-slate-200 dark:border-white/10">
                    <th scope="row" className="py-3 text-start font-normal"><span className="block text-[15px] font-semibold text-slate-900 dark:text-white">{m.label}</span><span className="block text-sm text-slate-600 dark:text-slate-400">{m.sub}</span></th>
                    <td className={`py-3 text-end align-top text-[15px] font-semibold tabular-nums ${m.amount > 0 ? "text-emerald-800 dark:text-emerald-300" : "text-slate-900 dark:text-white"}`}>{f.signed(m.amount)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <th scope="row" className="pt-4 text-start text-[15px] font-semibold text-slate-900 dark:text-white">{order.refund ? t("You paid in the end") : t("Total")}</th>
                  <td className="pt-4 text-end font-display text-2xl font-bold tabular-nums text-slate-900 dark:text-white">{f.money(Math.abs(net))}</td>
                </tr>
              </tfoot>
            </table>
          </section>
          <section aria-labelledby="c-steps" className="border-t border-dashed border-slate-300 p-6 sm:p-8 dark:border-white/20">
            <h2 id="c-steps" className="mb-4 font-display text-lg font-semibold text-slate-900 dark:text-white">{t("Progress")}</h2>
            <OrderSteps order={order} />
          </section>
        </article>
        <aside className={`${card} p-6 xl:sticky xl:top-24`}>
          <h2 className="font-display text-lg font-semibold text-slate-900 dark:text-white">{t("Something wrong?")}</h2>
          <p className="mt-1 text-[15px] text-slate-700 dark:text-slate-300">{t("Write to support about this order; the ticket links to it, so there's nothing to explain twice.")}</p>
          <div className="mt-4 grid gap-2">
            <button type="button" onClick={() => go({ page: "support", id: -order.id })} className={`${secondary} !py-3`}><MessageCircle aria-hidden className="h-4 w-4" />{t("Get help with this order")}</button>
            <Link href={buyAgainHref(order)} className={`${secondary} !py-3`}>{t("Buy again")}</Link>
          </div>
        </aside>
      </div>
    </div>
  );
}

// ---------- Add funds ----------

function Funds({ demo }: { demo: Demo }) {
  const t = useT();
  const f = useFmt();
  const s = useTopUp(demo);
  const preview = (
    <div className="mt-4 rounded-2xl border border-dashed border-slate-300 p-4 dark:border-white/20">
      <p className="text-sm text-slate-600 dark:text-slate-400">{t("On your statement")}</p>
      <div className="mt-2 flex items-start justify-between gap-3">
        <span className="min-w-0">
          <span className="block text-[15px] font-semibold text-slate-900 dark:text-white">{t("Top-up")}</span>
          <span className="block text-sm text-slate-600 dark:text-slate-400">{s.chosen ? cardShort(s.chosen) : t("Card not chosen")}</span>
        </span>
        <span className="text-end">
          <span className="block text-[15px] font-semibold tabular-nums text-emerald-800 dark:text-emerald-300">{f.signed(s.value || 0)}</span>
          <span className="block text-sm tabular-nums text-slate-600 dark:text-slate-400">{t("Balance {0}", { 0: f.num(demo.wallet + s.value) })}</span>
        </span>
      </div>
    </div>
  );
  return (
    <div>
      <Head title={t("Add funds")} sub={t("Top up with a bank card. It shows on your statement as soon as the bank confirms.")} />
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_21rem] xl:items-start">
        <form noValidate onSubmit={(e) => { e.preventDefault(); s.submit(); }} className={`${card} space-y-9 p-6 sm:p-8`}>
          <AmountPicker s={s} />
          <CardPicker s={s} demo={demo} />
        </form>
        <aside className="xl:sticky xl:top-24"><TopUpSummary s={s} demo={demo} extra={s.phase === "form" ? preview : undefined} /></aside>
      </div>
    </div>
  );
}

// ---------- Support: list and conversation side by side ----------

// `initial`: a ticket id to open, a negative order id to start a ticket about that order (from a receipt), 0 for a
// new ticket; none opens the ticket that has a reply, else the newest.
function Support({ demo, go, initial }: { demo: Demo; go: Go; initial?: number }) {
  const t = useT();
  const f = useFmt();
  const [sel, setSel] = useState<number | null>(() => initial ?? (demo.tickets.find((x) => x.state === "replied") ?? demo.tickets[0])?.id ?? null);
  const [mobileOpen, setMobileOpen] = useState(initial != null);
  const writing = sel != null && sel <= 0;
  const ticket = sel && sel > 0 ? demo.tickets.find((x) => x.id === sel) : undefined;
  const pick = (id: number) => { setSel(id); setMobileOpen(true); };

  return (
    <div>
      <Head title={t("Support")} sub={t("Your conversations with our team. We answer around the clock.")}
        action={<button type="button" onClick={() => pick(0)} className={indigoBtn}><Plus aria-hidden className="h-4 w-4" />{t("New ticket")}</button>} />
      <div className={`${card} overflow-hidden lg:grid lg:min-h-[34rem] lg:grid-cols-[19rem_minmax(0,1fr)]`}>
        <ul aria-label={t("Tickets")} className={`divide-y divide-slate-200 border-slate-200 lg:block lg:border-e dark:divide-white/10 dark:border-white/10 ${mobileOpen ? "hidden" : ""}`}>
          {demo.tickets.map((x) => {
            const on = sel === x.id;
            const last = x.messages[x.messages.length - 1];
            return (
              <li key={x.id}>
                <button type="button" onClick={() => pick(x.id)} aria-current={on ? "true" : undefined}
                  className={`block w-full px-5 py-4 text-start transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-emerald-600 dark:focus-visible:ring-emerald-400 ${on ? "bg-indigo-50 dark:bg-indigo-400/10" : "hover:bg-slate-50 dark:hover:bg-white/[.03]"}`}>
                  <span className="flex items-start justify-between gap-3">
                    <span className={`min-w-0 font-semibold ${on ? "text-indigo-950 dark:text-white" : "text-slate-900 dark:text-white"}`}>{t(x.subject)}</span>
                    <span className="shrink-0 text-xs text-slate-600 dark:text-slate-400">{f.when(last.at)}</span>
                  </span>
                  <span className="mt-1 block truncate text-sm text-slate-600 dark:text-slate-400">{last.from === "you" ? t("You") : last.name}: {t(last.text)}</span>
                  <Badge kind={ticketBadge(x.state)} className="mt-2" />
                </button>
              </li>
            );
          })}
        </ul>
        <div className={`min-w-0 p-5 sm:p-7 lg:block ${mobileOpen ? "" : "hidden"}`}>
          <button type="button" onClick={() => setMobileOpen(false)} className={`mb-4 inline-flex items-center gap-1.5 rounded text-sm font-semibold text-indigo-700 lg:hidden dark:text-indigo-300 ${pageRing}`}>
            <ArrowLeft aria-hidden className="h-4 w-4 rtl:rotate-180" />{t("All tickets")}
          </button>
          {writing && (
            <div>
              <h2 className="mb-6 font-display text-xl font-bold text-slate-900 dark:text-white">{t("New ticket")}</h2>
              <NewTicketForm key={sel ?? 0} demo={demo} orderId={sel && sel < 0 ? -sel : undefined} onDone={(id) => setSel(id)} onCancel={() => { setSel(demo.tickets[0]?.id ?? null); setMobileOpen(false); }} />
            </div>
          )}
          {ticket && (
            <div>
              <div className="mb-6 border-b border-slate-200 pb-5 dark:border-white/10">
                <h2 className="font-display text-xl font-bold text-slate-900 dark:text-white">{t(ticket.subject)}</h2>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                  #{ticket.id} · {t(deptLabel(ticket.dept))}
                  {ticket.orderId && <> · <button type="button" onClick={() => go({ page: "order", id: ticket.orderId })} className="rounded font-semibold text-indigo-700 underline-offset-4 hover:underline dark:text-indigo-300">{t("order #{0}", { 0: ticket.orderId })}</button></>}
                </p>
              </div>
              <Thread ticket={ticket} />
              <div className="mt-7 border-t border-slate-200 pt-6 dark:border-white/10"><ReplyBox ticket={ticket} demo={demo} /></div>
            </div>
          )}
          {!writing && !ticket && <Empty title={t("Pick a ticket")} text={t("Choose a conversation on the list, or start a new one.")} />}
        </div>
      </div>
    </div>
  );
}

// ---------- Profile and password ----------

function Settings({ page, demo, go }: { page: "profile" | "password"; demo: Demo; go: Go }) {
  const t = useT();
  return (
    <div>
      <Head title={page === "profile" ? t("Profile") : t("Password")} sub={page === "profile" ? t("The account holder's details and the cards you top up with.") : t("Change the password you sign in with.")} />
      {/* Phones reach both through "Me", so they get a switch here. */}
      <div role="group" aria-label={t("Settings")} className="mb-6 inline-flex rounded-xl bg-slate-100 p-1 lg:hidden dark:bg-white/[.06]">
        {(["profile", "password"] as const).map((p) => (
          <button key={p} type="button" aria-pressed={page === p} onClick={() => go({ page: p })}
            className={`rounded-lg px-4 py-2 text-sm font-semibold ${page === p ? "bg-white text-slate-900 shadow-sm dark:bg-white/15 dark:text-white" : "text-slate-600 dark:text-slate-300"} ${pageRing}`}>
            {p === "profile" ? t("Profile") : t("Password")}
          </button>
        ))}
      </div>
      <div className={`${card} p-6 sm:p-8 ${page === "profile" ? "max-w-3xl" : "max-w-2xl"}`}>
        {page === "profile" ? <ProfileForm demo={demo} /> : <PasswordForm demo={demo} />}
      </div>
    </div>
  );
}

