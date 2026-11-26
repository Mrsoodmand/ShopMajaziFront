"use client";

import { useMemo, useState, type ReactNode } from "react";
import {
  Check, ChevronRight, Gift, Hand, KeyRound, LifeBuoy, MessageCircle, Package, Phone, Plus, ReceiptText,
  RotateCcw, Send, Sparkles, TrendingUp, Users, Wallet, type LucideIcon,
} from "lucide-react";
import Link from "@/i18n/Link";
import { useT } from "@/i18n/client";
import type { AccountOrder } from "@/content/account-en";
import { PageShell } from "../otp/parts";
import { inLanguage } from "../info/parts";
import { Head, indigoBtn, pageRing, Passbook, type Go, type View } from "./AccountC";
import { Bar, Badge, CopyButton, card, laneOf, secondary, ServiceTile, useAccountDemo, useFmt, useOrderLine, type Line, type Store } from "./kit";

// The account's overview page (/account): what needs the buyer, what's on its way, the wallet, recent orders,
// shortcuts and the referral link. Offers (section page-account-home) drawn inside Passbook via its `Home` prop:
// A Today (action list first), B Bento (tiles), C Feed (one timeline beside a side column).

export type Referral = { code: string; link: string; invited: number; earned: number };
export type HomeProps = { demo: Store; go: Go; referral?: Referral | null };

const muted = "text-slate-600 dark:text-slate-400";
const strong = "text-slate-900 dark:text-white";
const h2 = `font-display text-lg font-bold tracking-tight ${strong}`;
const DAY = 86_400_000;

// Where the shop sells each family: the shortcuts.
const SHOP: { href: string; label: string; Icon: LucideIcon; cls: string }[] = [
  { href: "/virtual-number", label: "Virtual number", Icon: Phone, cls: "bg-emerald-100 text-emerald-800 dark:bg-emerald-400/15 dark:text-emerald-200" },
  { href: "/virtual-service", label: "Social growth", Icon: TrendingUp, cls: "bg-rose-100 text-rose-800 dark:bg-rose-400/15 dark:text-rose-200" },
  { href: "/accounts", label: "Accounts & subscriptions", Icon: KeyRound, cls: "bg-indigo-100 text-indigo-800 dark:bg-indigo-400/15 dark:text-indigo-200" },
  { href: "/telegram/premium", label: "Telegram Premium", Icon: Send, cls: "bg-sky-100 text-sky-800 dark:bg-sky-400/15 dark:text-sky-200" },
];

type Ask = { key: string; tone: "indigo" | "amber" | "emerald"; title: string; sub: string; cta: string; go: () => void; Icon: LucideIcon };

// What the page is made of, the same for every offer.
function useHome(demo: Store, go: Go) {
  const t = useT();
  const open = (o: AccountOrder) => () => go({ page: "order", id: o.id });
  const asks: Ask[] = [
    ...demo.orders.filter((o) => demo.arrived.includes(o.id)).map((o): Ask => ({ key: `c${o.id}`, tone: "emerald", Icon: Check, title: t("{0} code is here", { 0: o.service }), sub: t("Order #{0}", { 0: o.id }), cta: t("See the code"), go: open(o) })),
    ...demo.orders.filter((o) => (o.due ?? 0) > 0).map((o): Ask => ({ key: `p${o.id}`, tone: "amber", Icon: Wallet, title: t("{0} to pay", { 0: t("{0} Toman", { 0: t.num(o.due!) }) }), sub: t(o.title), cta: t("Pay"), go: open(o) })),
    ...demo.orders.filter((o) => o.state === "needs-you").map((o): Ask => ({ key: `n${o.id}`, tone: "indigo", Icon: Hand, title: t("{0} needs you", { 0: t(o.title) }), sub: o.delivery.type === "progress" && o.delivery.problem ? t(o.delivery.problem.title) : t("Order #{0}", { 0: o.id }), cta: t("Open"), go: open(o) })),
    ...demo.tickets.filter((x) => x.state === "replied").map((x): Ask => ({ key: `t${x.id}`, tone: "indigo", Icon: MessageCircle, title: t("Support replied on #{0}", { 0: x.id }), sub: t(x.subject), cta: t("Read the reply"), go: () => go({ page: "support", id: x.id }) })),
  ];
  const way = demo.orders.filter((o) => laneOf(o) === "way");
  const recent = demo.orders.filter((o) => laneOf(o) === "done").slice(0, 4);
  const replies = demo.tickets.filter((x) => x.state === "replied").length;
  const lastMonth = demo.statement.filter((l) => Date.now() - Date.parse(l.at) < 30 * DAY || !demo.live);
  const spent = lastMonth.filter((l) => l.kind === "purchase" || l.kind === "card").reduce((s, l) => s + Math.abs(l.amount), 0);
  const first = (demo.user.name || "").trim().split(/\s+/)[0];
  return { asks, way, recent, replies, spent, first, lines: demo.statement.slice(0, 5) };
}

const tone = {
  indigo: "bg-indigo-100 text-indigo-800 dark:bg-indigo-400/15 dark:text-indigo-200",
  amber: "bg-amber-100 text-amber-900 dark:bg-amber-400/15 dark:text-amber-200",
  emerald: "bg-emerald-100 text-emerald-800 dark:bg-emerald-400/15 dark:text-emerald-200",
};

function Greeting({ first, sub, action }: { first: string; sub: string; action?: ReactNode }) {
  const t = useT();
  return <Head title={first ? t("Welcome back, {0}", { 0: `\u2068${first}\u2069` }) : t("Welcome back")} sub={sub} action={action} />;
}

function AllCaughtUp() {
  const t = useT();
  return (
    <div className="flex items-center gap-3 px-5 py-5 sm:px-6">
      <span aria-hidden className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-emerald-100 text-emerald-800 dark:bg-emerald-400/15 dark:text-emerald-200"><Check className="h-5 w-5" /></span>
      <span><span className={`block font-semibold ${strong}`}>{t("Nothing needs you right now")}</span><span className={`block text-sm ${muted}`}>{t("When an order or support needs your answer, it shows up here.")}</span></span>
    </div>
  );
}

function AskRow({ a }: { a: Ask }) {
  return (
    <li>
      <button type="button" onClick={a.go} className="flex w-full items-center gap-4 px-5 py-4 text-start transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-emerald-600 sm:px-6 dark:hover:bg-white/[.03] dark:focus-visible:ring-emerald-400">
        <span aria-hidden className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${tone[a.tone]}`}><a.Icon className="h-5 w-5" /></span>
        <span className="min-w-0 flex-1">
          <span className={`block font-semibold tabular-nums ${strong}`}>{a.title}</span>
          <span className={`block truncate text-sm ${muted}`}>{a.sub}</span>
        </span>
        <span className="hidden shrink-0 rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white sm:inline-flex dark:bg-indigo-500">{a.cta}</span>
        <ChevronRight aria-hidden className="h-5 w-5 shrink-0 text-slate-400 sm:hidden rtl:rotate-180" />
      </button>
    </li>
  );
}

// An order on its way: the countdown or the delivery bar, to scale.
function WayRow({ o, demo, go }: { o: AccountOrder; demo: Store; go: Go }) {
  const line = useOrderLine();
  const d = o.delivery;
  const fraction = o.state === "waiting" ? demo.clockOf(o).fraction : d.type === "progress" ? d.done / Math.max(1, d.total) : 0;
  return (
    <li>
      <button type="button" onClick={() => go({ page: "order", id: o.id })} className="block w-full px-5 py-4 text-start transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-emerald-600 sm:px-6 dark:hover:bg-white/[.03] dark:focus-visible:ring-emerald-400">
        <span className="flex items-center gap-3">
          <ServiceTile service={o.service} size="sm" />
          <span className="min-w-0 flex-1">
            <span className={`block truncate font-semibold ${strong}`}>{o.title}</span>
            <span className={`block truncate text-sm tabular-nums ${muted}`}>{line(o, demo)}</span>
          </span>
          <Badge kind={o.state} />
        </span>
        {fraction > 0 && <Bar fraction={fraction} tone={o.state === "waiting" ? "amber" : "indigo"} className="mt-3" />}
      </button>
    </li>
  );
}

function OrderRow({ o, go }: { o: AccountOrder; go: Go }) {
  const t = useT();
  const f = useFmt();
  return (
    <li>
      <button type="button" onClick={() => go({ page: "order", id: o.id })} className="flex w-full items-center gap-3 px-5 py-3.5 text-start transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-emerald-600 sm:px-6 dark:hover:bg-white/[.03] dark:focus-visible:ring-emerald-400">
        <ServiceTile service={o.service} size="sm" />
        <span className="min-w-0 flex-1">
          <span className={`block truncate font-semibold ${strong}`}>{t(o.title)}</span>
          <span className={`block text-sm ${muted}`}>#{o.id} · {f.date(o.at)}</span>
        </span>
        <span className={`text-[15px] font-semibold tabular-nums ${strong}`}>{f.num(o.price)}</span>
      </button>
    </li>
  );
}

function SectionHead({ title, count, more }: { title: string; count?: number; more?: { label: string; onClick: () => void } }) {
  return (
    <div className="mb-3 flex items-center justify-between gap-3">
      <h2 className={`flex items-baseline gap-2 ${h2}`}>{title}{!!count && <span className="text-base font-semibold tabular-nums text-slate-500 dark:text-slate-400">{count}</span>}</h2>
      {more && <button type="button" onClick={more.onClick} className={`inline-flex items-center gap-1 rounded text-sm font-semibold text-indigo-700 hover:underline dark:text-indigo-300 ${pageRing}`}>{more.label}<ChevronRight aria-hidden className="h-4 w-4 rtl:rotate-180" /></button>}
    </div>
  );
}

function Shortcut({ s, compact = false, stack = false }: { s: (typeof SHOP)[number]; compact?: boolean; stack?: boolean }) {
  const t = useT();
  return (
    <Link href={s.href} className={`group flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3.5 transition-colors hover:border-slate-300 dark:border-white/15 dark:bg-[#0E1424] dark:hover:border-white/30 ${pageRing} ${stack ? "h-full flex-col items-start p-4" : compact ? "" : "sm:flex-col sm:items-start sm:p-4"}`}>
      <span aria-hidden className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${s.cls}`}><s.Icon className="h-5 w-5" /></span>
      <span className={`min-w-0 flex-1 text-[15px] font-semibold leading-snug ${strong}`}>{t(s.label)}</span>
    </Link>
  );
}

function ReferralBody({ r, dark = false }: { r: Referral; dark?: boolean }) {
  const t = useT();
  const f = useFmt();
  const sub = dark ? "text-indigo-200" : muted;
  return (
    <>
      <div className={`mt-4 flex items-center gap-2 rounded-xl p-1.5 ps-3 ${dark ? "bg-white/10" : "bg-slate-100 dark:bg-white/[.06]"}`}>
        <span dir="ltr" className={`min-w-0 flex-1 truncate text-start font-mono text-sm ${dark ? "text-white" : strong}`}>{r.link.replace(/^https?:\/\//, "")}</span>
        <CopyButton text={r.link} label={t("Copy link")} showLabel className={dark ? "!bg-white !text-indigo-950 hover:!bg-indigo-50" : ""} />
      </div>
      <dl className="mt-4 grid grid-cols-2 gap-3">
        <div><dt className={`text-sm ${sub}`}>{t("Friends who joined")}</dt><dd className="font-display text-xl font-bold tabular-nums">{f.num(r.invited)}</dd></div>
        <div><dt className={`text-sm ${sub}`}>{t("You've earned")}</dt><dd className="font-display text-xl font-bold tabular-nums">{f.money(r.earned)}</dd></div>
      </dl>
    </>
  );
}

// ---------- A · Today: what needs you first, then what's moving ----------

export function HomeA({ demo, go, referral }: HomeProps) {
  const t = useT();
  const f = useFmt();
  const h = useHome(demo, go);
  return (
    <div>
      <Greeting first={h.first} sub={t("Here's where your orders, wallet and support stand today.")} />

      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_minmax(0,1fr)]">
        <div className="rounded-3xl bg-[#1e1b4b] p-6 text-white col-span-2 xl:col-span-1 dark:bg-[#15123a]">
          <p className="text-sm text-indigo-200">{t("Wallet balance")}</p>
          <p className="mt-1 font-display text-3xl font-bold tabular-nums">{f.money(demo.wallet)}</p>
          <div className="mt-5 flex flex-wrap gap-2">
            <button type="button" onClick={() => go({ page: "funds" })} className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-[15px] font-semibold text-indigo-950 transition-colors hover:bg-indigo-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"><Plus aria-hidden className="h-4 w-4" />{t("Add funds")}</button>
            <button type="button" onClick={() => go({ page: "statement" })} className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-[15px] font-semibold text-indigo-100 ring-1 ring-inset ring-white/25 transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"><ReceiptText aria-hidden className="h-4 w-4" />{t("Statement")}</button>
          </div>
        </div>
        <Stat Icon={Package} label={t("On the way")} value={f.num(h.way.length)} sub={h.way[0] ? t(h.way[0].title) : t("Nothing in progress")} onClick={() => go({ page: "orders" })} />
        <Stat Icon={LifeBuoy} label={t("Support replies")} value={f.num(h.replies)} sub={h.replies ? t("Waiting for you to read") : t("No new replies")} onClick={() => go({ page: "support" })} />
      </div>

      <section aria-labelledby="ha-needs" className="mt-10">
        <SectionHead title={t("Needs your attention")} count={h.asks.length} />
        <ul id="ha-needs" className={`${card} divide-y divide-slate-200 overflow-hidden dark:divide-white/10`}>
          {h.asks.length ? h.asks.map((a) => <AskRow key={a.key} a={a} />) : <li><AllCaughtUp /></li>}
        </ul>
      </section>

      <div className="mt-10 grid gap-10 xl:grid-cols-2 xl:gap-6">
        <section aria-label={t("On the way")}>
          <SectionHead title={t("On the way")} count={h.way.length} />
          <ul className={`${card} divide-y divide-slate-200 overflow-hidden dark:divide-white/10`}>
            {h.way.length ? h.way.map((o) => <WayRow key={o.id} o={o} demo={demo} go={go} />) : <li className={`px-5 py-5 text-[15px] sm:px-6 ${muted}`}>{t("Nothing in progress. New orders show here until they're delivered.")}</li>}
          </ul>
        </section>
        <section aria-label={t("Recent orders")}>
          <SectionHead title={t("Recent orders")} more={{ label: t("All orders"), onClick: () => go({ page: "orders" }) }} />
          <ul className={`${card} divide-y divide-slate-200 overflow-hidden dark:divide-white/10`}>
            {h.recent.length ? h.recent.map((o) => <OrderRow key={o.id} o={o} go={go} />) : <li className={`px-5 py-5 text-[15px] sm:px-6 ${muted}`}>{t("Everything you buy shows up here, with its codes and logins.")}</li>}
          </ul>
        </section>
      </div>

      <section aria-labelledby="ha-shop" className="mt-10">
        <SectionHead title={t("Buy again or something new")} />
        <div id="ha-shop" className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">{SHOP.map((s) => <Shortcut key={s.href} s={s} />)}</div>
      </section>

      {referral && (
        <section aria-labelledby="ha-ref" className={`${card} mt-10 grid gap-6 p-6 sm:p-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:items-center`}>
          <div>
            <span aria-hidden className="grid h-10 w-10 place-items-center rounded-xl bg-amber-100 text-amber-900 dark:bg-amber-400/15 dark:text-amber-200"><Gift className="h-5 w-5" /></span>
            <h2 id="ha-ref" className={`mt-3 ${h2}`}>{t("Invite friends, earn on their orders")}</h2>
            <p className={`mt-1 text-[15px] ${muted}`}>{t("Share your link. When someone signs up with it, a share of what they buy comes to your wallet.")}</p>
          </div>
          <div className={strong}><ReferralBody r={referral} /></div>
        </section>
      )}
    </div>
  );
}

function Stat({ Icon, label, value, sub, onClick }: { Icon: LucideIcon; label: string; value: string; sub: string; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className={`${card} flex min-w-0 flex-col p-5 text-start sm:p-6 transition-colors hover:border-slate-300 dark:hover:border-white/30 ${pageRing}`}>
      <span className={`flex items-center justify-between gap-2 text-sm ${muted}`}>{label}<Icon aria-hidden className="h-5 w-5 text-slate-400" /></span>
      <span className={`mt-1 font-display text-3xl font-bold tabular-nums ${strong}`}>{value}</span>
      <span className={`mt-auto truncate pt-3 text-sm ${muted}`}>{sub}</span>
    </button>
  );
}

// ---------- B · Bento: every part of the account as a tile ----------

export function HomeB({ demo, go, referral }: HomeProps) {
  const t = useT();
  const f = useFmt();
  const h = useHome(demo, go);
  const next = h.way.find((o) => o.state === "waiting") ?? h.way[0];
  const reply = demo.tickets.find((x) => x.state === "replied");
  const tile = `${card} p-5 sm:p-6`;
  return (
    <div>
      <Greeting first={h.first} sub={t("Your account at a glance. Tap any tile to open it.")} />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {/* Wallet: the big tile, with the last few movements. */}
        <div className="col-span-2 flex flex-col rounded-3xl bg-[#1e1b4b] p-6 text-white lg:row-span-2 dark:bg-[#15123a]">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm text-indigo-200">{t("Wallet balance")}</p>
              <p className="mt-1 font-display text-4xl font-bold tabular-nums">{f.num(demo.wallet)}<span className="ms-2 text-base font-semibold text-indigo-200">{t("Toman")}</span></p>
            </div>
            <button type="button" onClick={() => go({ page: "funds" })} className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-white px-3.5 py-2 text-sm font-semibold text-indigo-950 hover:bg-indigo-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"><Plus aria-hidden className="h-4 w-4" />{t("Add funds")}</button>
          </div>
          <ul className="mt-6 divide-y divide-white/10 border-t border-white/10">
            {h.lines.slice(0, 4).map((l) => <MiniLine key={l.key} l={l} />)}
          </ul>
          {!h.lines.length && <p className="py-3 text-sm text-indigo-200">{t("Top-ups, purchases and refunds will show here.")}</p>}
          <button type="button" onClick={() => go({ page: "statement" })} className="mt-auto inline-flex items-center gap-1 self-start rounded pt-4 text-sm font-semibold text-indigo-100 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400">{t("Full statement")}<ChevronRight aria-hidden className="h-4 w-4 rtl:rotate-180" /></button>
        </div>

        <BentoTile className={h.asks.length ? "border-amber-300 bg-amber-50 dark:border-amber-400/30 dark:bg-amber-400/[.07]" : ""} Icon={Hand} label={t("Needs you")} value={f.num(h.asks.length)}
          sub={h.asks[0]?.title ?? t("All caught up")} onClick={h.asks[0]?.go ?? (() => go({ page: "orders" }))} />
        <BentoTile Icon={MessageCircle} label={t("Support replies")} value={f.num(h.replies)} sub={reply ? t(reply.subject) : t("No new replies")} onClick={() => go({ page: "support", id: reply?.id })} />

        <div className={`${tile} col-span-2`}>
          <div className="flex items-center justify-between gap-3"><p className={`text-sm ${muted}`}>{t("On the way")}</p><span className={`font-display text-lg font-bold tabular-nums ${strong}`}>{f.num(h.way.length)}</span></div>
          {next ? (
            <button type="button" onClick={() => go({ page: "order", id: next.id })} className={`mt-3 block w-full rounded-xl text-start ${pageRing}`}>
              <span className="flex items-center gap-3"><ServiceTile service={next.service} size="sm" /><span className={`min-w-0 flex-1 truncate font-semibold ${strong}`}>{next.title}</span><Badge kind={next.state} label={next.state === "waiting" ? t("{0} left", { 0: demo.clockOf(next).text }) : undefined} /></span>
              <Bar fraction={next.state === "waiting" ? demo.clockOf(next).fraction : next.delivery.type === "progress" ? next.delivery.done / Math.max(1, next.delivery.total) : 0} tone={next.state === "waiting" ? "amber" : "indigo"} className="mt-3" />
            </button>
          ) : <p className={`mt-3 text-[15px] ${muted}`}>{t("Nothing in progress")}</p>}
        </div>

        <div className={`${card} col-span-2 overflow-hidden`}>
          <div className="flex items-center justify-between gap-3 px-5 pt-5 sm:px-6"><p className={`text-sm ${muted}`}>{t("Recent orders")}</p><button type="button" onClick={() => go({ page: "orders" })} className={`rounded text-sm font-semibold text-indigo-700 hover:underline dark:text-indigo-300 ${pageRing}`}>{t("All orders")}</button></div>
          <ul className="mt-1 divide-y divide-slate-200 dark:divide-white/10">{h.recent.slice(0, 3).map((o) => <OrderRow key={o.id} o={o} go={go} />)}</ul>
        </div>

        {referral ? (
          <div className="col-span-2 rounded-3xl bg-[#1e1b4b] p-6 text-white dark:bg-[#15123a]">
            <p className="flex items-center gap-2 text-sm text-indigo-200"><Gift aria-hidden className="h-4 w-4" />{t("Invite friends")}</p>
            <p className="mt-1 font-display text-lg font-bold">{t("A share of their orders comes to your wallet")}</p>
            <ReferralBody r={referral} dark />
          </div>
        ) : null}

        {SHOP.map((s) => <div key={s.href} className="col-span-1"><Shortcut s={s} stack /></div>)}
      </div>
    </div>
  );
}

function BentoTile({ Icon, label, value, sub, onClick, className = "" }: { Icon: LucideIcon; label: string; value: string; sub: string; onClick: () => void; className?: string }) {
  return (
    <button type="button" onClick={onClick} className={`${card} col-span-1 flex min-h-36 flex-col p-5 text-start transition-colors hover:border-slate-300 sm:p-6 dark:hover:border-white/30 ${pageRing} ${className}`}>
      <span className={`flex w-full items-center justify-between gap-2 text-sm ${muted}`}>{label}<Icon aria-hidden className="h-5 w-5 text-slate-400" /></span>
      <span className={`mt-1 font-display text-3xl font-bold tabular-nums ${strong}`}>{value}</span>
      <span className={`mt-auto line-clamp-2 pt-2 text-sm ${muted}`}>{sub}</span>
    </button>
  );
}

function MiniLine({ l }: { l: Line }) {
  const t = useT();
  const f = useFmt();
  const title = l.kind === "top-up" ? t("Top-up") : l.kind === "refund" ? t("Refund") : l.kind === "commission" ? t("Referral commission") : t(l.title);
  return (
    <li className="flex items-center justify-between gap-3 py-2.5 text-sm">
      <span className="min-w-0 truncate text-indigo-50">{title}<span className="text-indigo-300"> · {f.day(l.at)}</span></span>
      <span className={`shrink-0 font-semibold tabular-nums ${l.amount > 0 ? "text-emerald-300" : "text-white"} ${l.held ? "line-through opacity-60" : ""}`}>{f.signed(l.amount)}</span>
    </li>
  );
}

// ---------- C · Feed: one timeline of what happened, a side column for the rest ----------

type Event = { key: string; at: string; Icon: LucideIcon; cls: string; title: string; sub: string; go?: () => void; badge?: ReactNode; amount?: number };

export function HomeC({ demo, go, referral }: HomeProps) {
  const t = useT();
  const f = useFmt();
  const h = useHome(demo, go);
  const [all, setAll] = useState(false);
  const events: Event[] = [
    ...demo.orders.map((o): Event => ({
      key: `o${o.id}`, at: o.deliveredAt ?? o.at, Icon: Package, cls: "bg-slate-100 text-slate-700 dark:bg-white/10 dark:text-slate-200",
      title: t(o.title), sub: `#${o.id}`, go: () => go({ page: "order", id: o.id }),
      badge: <Badge kind={o.state} label={o.state === "waiting" ? t("{0} left", { 0: demo.clockOf(o).text }) : undefined} />,
    })),
    ...demo.statement.filter((l) => l.kind === "top-up" || l.kind === "refund" || l.kind === "commission").map((l): Event => ({
      key: l.key, at: l.at, Icon: l.kind === "top-up" ? Plus : l.kind === "commission" ? Users : RotateCcw, cls: tone.emerald,
      title: l.kind === "top-up" ? t("Top-up") : l.kind === "refund" ? t("Refund · order #{0}", { 0: l.orderId ?? "" }) : t("Referral commission"),
      sub: l.held ? t("On hold") : t("To your wallet"), amount: l.amount, go: () => go({ page: "statement" }),
    })),
    ...demo.tickets.filter((x) => x.messages.length).map((x): Event => ({
      key: `t${x.id}`, at: x.messages.at(-1)!.at, Icon: MessageCircle, cls: x.state === "replied" ? tone.indigo : "bg-slate-100 text-slate-700 dark:bg-white/10 dark:text-slate-200",
      title: t(x.subject), sub: t("Ticket #{0}", { 0: x.id }), go: () => go({ page: "support", id: x.id }), badge: x.state === "replied" ? <Badge kind="replied" /> : undefined,
    })),
  ].sort((a, b) => Date.parse(b.at) - Date.parse(a.at));
  const shown = all ? events.slice(0, 30) : events.slice(0, 8);

  return (
    <div>
      <Greeting first={h.first} sub={t("Everything new in your account, newest first.")}
        action={<button type="button" onClick={() => go({ page: "funds" })} className={indigoBtn}><Plus aria-hidden className="h-4 w-4" />{t("Add funds")}</button>} />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_20rem] xl:items-start">
        <div className="min-w-0 space-y-6">
          {!!h.asks.length && (
            <section aria-labelledby="hc-needs" className="rounded-3xl border border-indigo-200 bg-indigo-50/60 p-2 dark:border-indigo-400/25 dark:bg-indigo-400/[.06]">
              <h2 id="hc-needs" className="flex items-center gap-2 px-4 pb-1 pt-3 font-display text-base font-bold text-indigo-950 dark:text-indigo-100"><Hand aria-hidden className="h-4 w-4" />{t("Needs your attention")}</h2>
              <ul className="divide-y divide-indigo-100 dark:divide-white/10">{h.asks.map((a) => <AskRow key={a.key} a={a} />)}</ul>
            </section>
          )}

          <section aria-labelledby="hc-feed" className={`${card} p-5 sm:p-6`}>
            <h2 id="hc-feed" className={h2}>{t("What's new")}</h2>
            <ol className="relative mt-5 space-y-1 before:absolute before:inset-y-2 before:start-5 before:w-px before:bg-slate-200 dark:before:bg-white/10">
              {shown.map((e) => (
                <li key={e.key} className="relative">
                  <button type="button" onClick={e.go} className={`flex w-full items-start gap-4 rounded-2xl p-1 py-2.5 text-start transition-colors hover:bg-slate-50 dark:hover:bg-white/[.03] ${pageRing}`}>
                    <span aria-hidden className={`relative grid h-10 w-10 shrink-0 place-items-center rounded-full ring-4 ring-white dark:ring-[#0E1424] ${e.cls}`}><e.Icon className="h-4 w-4" /></span>
                    <span className="min-w-0 flex-1 pt-0.5">
                      <span className="flex flex-wrap items-center gap-x-2 gap-y-1"><span className={`font-semibold ${strong}`}>{e.title}</span>{e.badge}</span>
                      <span className={`block text-sm ${muted}`}>{f.day(e.at)} · {f.time(e.at)} · {e.sub}</span>
                    </span>
                    {e.amount != null && <span className={`shrink-0 pt-0.5 text-[15px] font-semibold tabular-nums ${e.amount > 0 ? "text-emerald-800 dark:text-emerald-300" : strong}`}>{f.signed(e.amount)}</span>}
                  </button>
                </li>
              ))}
            </ol>
            {events.length > 8 && <button type="button" onClick={() => setAll((x) => !x)} className={`${secondary} mt-4 w-full`}>{all ? t("Show less") : t("Show more")}</button>}
          </section>
        </div>

        <aside className="grid gap-6 xl:sticky xl:top-24">
          <div className={`${card} p-6`}>
            <p className={`text-sm ${muted}`}>{t("Wallet balance")}</p>
            <p className={`mt-1 font-display text-3xl font-bold tabular-nums ${strong}`}>{f.money(demo.wallet)}</p>
            <dl className="mt-5 grid grid-cols-2 gap-3 border-t border-slate-200 pt-4 dark:border-white/10">
              <div><dt className={`text-sm ${muted}`}>{t("On the way")}</dt><dd className={`font-display text-xl font-bold tabular-nums ${strong}`}>{f.num(h.way.length)}</dd></div>
              <div><dt className={`text-sm ${muted}`}>{t("Spent in 30 days")}</dt><dd className={`font-display text-xl font-bold tabular-nums ${strong}`}>{f.num(h.spent)}</dd></div>
            </dl>
            <button type="button" onClick={() => go({ page: "statement" })} className={`${secondary} mt-5 w-full`}><ReceiptText aria-hidden className="h-4 w-4" />{t("Statement")}</button>
          </div>

          <div className={`${card} p-6`}>
            <h2 className={h2}>{t("Shortcuts")}</h2>
            <div className="mt-4 grid gap-2">
              {SHOP.map((s) => <Shortcut key={s.href} s={s} compact />)}
              <button type="button" onClick={() => go({ page: "support", id: 0 })} className={`flex items-center gap-3 rounded-2xl border border-dashed border-slate-300 p-3.5 text-start text-[15px] font-semibold transition-colors hover:border-slate-400 dark:border-white/20 ${strong} ${pageRing}`}>
                <span aria-hidden className="grid h-10 w-10 place-items-center rounded-xl bg-slate-100 text-slate-700 dark:bg-white/10 dark:text-slate-200"><LifeBuoy className="h-5 w-5" /></span>{t("New ticket")}
              </button>
            </div>
          </div>

          {referral && (
            <div className="rounded-3xl bg-[#1e1b4b] p-6 text-white dark:bg-[#15123a]">
              <p className="flex items-center gap-2 font-display text-lg font-bold"><Sparkles aria-hidden className="h-5 w-5 text-amber-300" />{t("Invite friends")}</p>
              <p className="mt-1 text-sm text-indigo-200">{t("A share of their orders comes to your wallet")}</p>
              <ReferralBody r={referral} dark />
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}

// ---------- Gallery offers ----------

const SAMPLE_REFERRAL: Referral = { code: "K7Q2MX", link: "https://shopmajazi.com/?ref=K7Q2MX", invited: 3, earned: 46_500 };

function offer(Home: (p: HomeProps) => ReactNode) {
  return function Offer() {
    const demo = useAccountDemo();
    const [view, setView] = useState<View>({ page: "home" });
    const [empty, setEmpty] = useState(false);
    const t = useT();
    // "New account": nothing bought yet, nothing to answer, no referral earnings.
    const store: Store = empty ? { ...demo, orders: [], tickets: [], statement: [], wallet: 0, arrived: [] } : demo;
    // One component per state, so the page keeps its own state while the sample clock ticks.
    const Page = useMemo(() => { const ref = empty ? { ...SAMPLE_REFERRAL, invited: 0, earned: 0 } : SAMPLE_REFERRAL; return function Page(p: { demo: Store; go: Go }) { return <Home {...p} referral={ref} />; }; }, [empty]);
    return (
      <PageShell>
        <div className="mx-auto flex max-w-7xl flex-wrap gap-2 px-4 pt-4 sm:px-6 ltr:sm:pe-48 rtl:sm:ps-48 pt-16 sm:pt-4">
          {[false, true].map((e) => (
            <button key={String(e)} type="button" onClick={() => { setEmpty(e); setView({ page: "home" }); }} className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold ${empty === e ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900" : "border border-slate-300 dark:border-white/20"}`}>
              {e ? t("New account") : t("Busy account")}
            </button>
          ))}
        </div>
        <Passbook store={store} view={view} go={setView} Home={Page} />
      </PageShell>
    );
  };
}

export const HomeOfferA = inLanguage(offer(HomeA));
export const HomeOfferB = inLanguage(offer(HomeB));
export const HomeOfferC = inLanguage(offer(HomeC));
