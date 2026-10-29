"use client";

import { useEffect, useId, useMemo, useRef, useState, type ReactNode } from "react";
import {
  Apple, Check, Clock, CreditCard, Eye, EyeOff, Hand, Instagram, Loader2, Lock, MessageCircle,
  Music, Music2, Paperclip, Phone, Plus, RotateCcw, Send, ShieldCheck, Star, X, Copy, type LucideIcon,
} from "lucide-react";
import {
  DEMO_NOW, TOP_UP_MAX, TOP_UP_MIN, accountOrders, accountTickets, accountUser, bankCards, departments, strayCard, topUpPresets, topUps as sampleTopUps,
  type AccountOrder, type BankCard, type Dept, type Ticket, type TopUp,
} from "@/content/account-en";
import { field, primary, ring, secondary } from "../googleVoice/clean";
import { useT } from "@/i18n/client";

// Pieces shared by the account area offers (A Needs You, B One Page, C Passbook). The offers differ in shell,
// navigation and how orders are organised; these are the parts that must behave the same everywhere: states,
// what an order hands over, forms with errors tied to fields, the ticket thread.

export { field, primary, ring, secondary };
export const card = "rounded-3xl border border-slate-200 bg-white dark:border-white/15 dark:bg-[#0E1424]";
export const inner = "rounded-2xl bg-slate-50 dark:bg-white/[.04]";
// The bank payment button: Catalogue Indigo with a lock, like the shared payment dialog's Pay.
export const payBtn = `inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-6 py-4 text-base font-semibold text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-indigo-500 dark:hover:bg-indigo-400 ${ring}`;
export const smallBtn = `inline-flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${ring}`;
export const linkCls = `rounded font-semibold text-indigo-700 underline-offset-4 hover:underline dark:text-indigo-300 ${ring}`;

const DAY = 86_400_000;

// ---------- Formatting ----------

export function useFmt() {
  const t = useT();
  return useMemo(() => {
    const loc = t.locale === "fa" ? "fa-IR" : "en-GB";
    const n = (v: number) => Math.round(v).toLocaleString(t.locale === "fa" ? "fa-IR" : "en-US");
    const d = (iso: string, o: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat(loc, o).format(new Date(iso));
    const now = new Date(DEMO_NOW);
    const dayStart = (x: Date) => new Date(x.getFullYear(), x.getMonth(), x.getDate()).getTime();
    return {
      num: n,
      money: (v: number) => t("{0} Toman", { 0: n(v) }),
      signed: (v: number) => `${v < 0 ? "−" : "+"}${n(Math.abs(v))}`,
      time: (iso: string) => d(iso, { hour: "2-digit", minute: "2-digit" }),
      date: (iso: string) => d(iso, { day: "numeric", month: "short", year: "numeric" }),
      when: (iso: string) => d(iso, { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }),
      day: (iso: string) => {
        const diff = Math.round((dayStart(now) - dayStart(new Date(iso))) / DAY);
        return diff === 0 ? t("Today") : diff === 1 ? t("Yesterday") : d(iso, { weekday: "long", day: "numeric", month: "long" });
      },
    };
  }, [t]);
}
export type Fmt = ReturnType<typeof useFmt>;

export const masked = (c: BankCard) => `${c.first6.slice(0, 4)} ${c.first6.slice(4)}•• •••• ${c.last4}`;
export const cardShort = (c: BankCard) => `${c.bank} •••• ${c.last4}`;

// ---------- State words ----------

export type Lane = "needs" | "way" | "done";
export const laneOf = (o: AccountOrder): Lane => (o.state === "needs-you" ? "needs" : o.state === "waiting" || o.state === "delivering" ? "way" : "done");

const stateLook = {
  "needs-you": { label: "Needs you", Icon: Hand, cls: "bg-indigo-600 text-white dark:bg-indigo-500" },
  waiting: { label: "Waiting for code", Icon: Clock, cls: "bg-amber-100 text-amber-900 dark:bg-amber-400/15 dark:text-amber-200" },
  delivering: { label: "Delivering", Icon: Loader2, cls: "bg-amber-100 text-amber-900 dark:bg-amber-400/15 dark:text-amber-200" },
  delivered: { label: "Delivered", Icon: Check, cls: "bg-emerald-100 text-emerald-900 dark:bg-emerald-400/15 dark:text-emerald-200" },
  refunded: { label: "Refunded", Icon: RotateCcw, cls: "bg-slate-100 text-slate-700 dark:bg-white/10 dark:text-slate-200" },
  replied: { label: "Support replied", Icon: MessageCircle, cls: "bg-indigo-600 text-white dark:bg-indigo-500" },
  open: { label: "Waiting for support", Icon: Clock, cls: "bg-slate-100 text-slate-700 dark:bg-white/10 dark:text-slate-200" },
  closed: { label: "Closed", Icon: Check, cls: "border border-slate-300 text-slate-600 dark:border-white/20 dark:text-slate-300" },
  "on-hold": { label: "On hold", Icon: Clock, cls: "bg-amber-100 text-amber-900 dark:bg-amber-400/15 dark:text-amber-200" },
  done: { label: "Added", Icon: Check, cls: "bg-emerald-100 text-emerald-900 dark:bg-emerald-400/15 dark:text-emerald-200" },
} as const;
export type BadgeKind = keyof typeof stateLook;

export function Badge({ kind, label, className = "" }: { kind: BadgeKind; label?: string; className?: string }) {
  const t = useT();
  const { Icon, cls, label: l } = stateLook[kind];
  return (
    <span className={`inline-flex shrink-0 items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ${cls} ${className}`}>
      <Icon aria-hidden className="h-3.5 w-3.5" />{label ?? t(l)}
    </span>
  );
}
export const ticketBadge = (s: Ticket["state"]): BadgeKind => (s === "replied" ? "replied" : s === "waiting" ? "open" : "closed");

// ---------- Service tile ----------

const tiles: Record<string, { Icon?: LucideIcon; letter?: string; cls: string }> = {
  WhatsApp: { Icon: MessageCircle, cls: "bg-[#128C7E] text-white" },
  Telegram: { Icon: Send, cls: "bg-sky-500 text-white" },
  TikTok: { Icon: Music2, cls: "bg-slate-950 text-white ring-1 ring-inset ring-white/15" },
  Instagram: { Icon: Instagram, cls: "bg-[linear-gradient(45deg,#f59e0b,#ec4899_50%,#8b5cf6)] text-white" },
  "Google Voice": { Icon: Phone, cls: "bg-blue-600 text-white" },
  Google: { letter: "G", cls: "bg-blue-600 text-white" },
  Apple: { Icon: Apple, cls: "bg-slate-900 text-white dark:bg-white dark:text-slate-900" },
  Spotify: { Icon: Music, cls: "bg-green-600 text-white" },
};

export function ServiceTile({ service, size = "md" }: { service: string; size?: "sm" | "md" | "lg" }) {
  const tile = tiles[service] ?? { letter: service[0], cls: "bg-slate-600 text-white" };
  const s = size === "lg" ? "h-12 w-12 rounded-2xl [&>svg]:h-6 [&>svg]:w-6 text-lg" : size === "sm" ? "h-8 w-8 rounded-lg [&>svg]:h-4 [&>svg]:w-4 text-sm" : "h-10 w-10 rounded-xl [&>svg]:h-5 [&>svg]:w-5";
  return <span aria-hidden className={`grid shrink-0 place-items-center font-display font-bold ${tile.cls} ${s}`}>{tile.Icon ? <tile.Icon /> : tile.letter}</span>;
}

// ---------- The sample account, with working actions ----------

const WAIT_LEFT = 14.5 * 60_000; // the waiting number opens with 14:30 left of its 20 minutes
const CODE_AFTER = 45_000; // and its code arrives 45 seconds after the page opens, to show the change

// Local-time ISO string (the sample's times have no zone, so they read as local time too).
const iso = (ms: number) => {
  const d = new Date(ms);
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`;
};
const NOW_MS = () => new Date(DEMO_NOW).getTime();

export function useAccountDemo() {
  const [orders, setOrders] = useState<AccountOrder[]>(() => accountOrders.map((o) => ({ ...o })));
  const [tickets, setTickets] = useState<Ticket[]>(() => accountTickets.map((x) => ({ ...x, messages: [...x.messages] })));
  const [topUps, setTopUps] = useState<TopUp[]>(sampleTopUps);
  const [cards, setCards] = useState<BankCard[]>(bankCards);
  const [user, setUser] = useState(accountUser);
  const [arrived, setArrived] = useState<number[]>([]); // orders whose code came in while the page was open
  // Live clock for the waiting number. Null until the page is in the browser, so server and client render the same.
  const [opened, setOpened] = useState<number | null>(null);
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => { const t0 = Date.now(); setOpened(t0); setNow(t0); }, []);
  const waiting = orders.some((o) => o.state === "waiting");
  useEffect(() => {
    if (!waiting || opened == null) return;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [waiting, opened]);
  useEffect(() => {
    if (opened == null) return;
    const id = setTimeout(() => {
      const at = iso(NOW_MS() + CODE_AFTER);
      setOrders((list) => list.map((o) => (o.state === "waiting" && o.delivery.type === "number" ? { ...o, state: "delivered", deliveredAt: at, delivery: { ...o.delivery, code: "730914", codeAt: at } } : o)));
      setArrived(accountOrders.filter((o) => o.state === "waiting").map((o) => o.id));
    }, CODE_AFTER);
    return () => clearTimeout(id);
  }, [opened]);

  const msLeft = opened == null || now == null ? WAIT_LEFT : Math.max(0, opened + WAIT_LEFT - now);
  const clock = { msLeft, text: `${String(Math.floor(msLeft / 60000)).padStart(2, "0")}:${String(Math.floor((msLeft % 60000) / 1000)).padStart(2, "0")}`, fraction: msLeft / (20 * 60_000) };

  // "Now" on the sample's own clock: DEMO_NOW plus the time the page has been open.
  const stamp = () => iso(NOW_MS() + (opened == null ? 0 : Date.now() - opened));
  const patch = (id: number, f: (o: AccountOrder) => AccountOrder) => setOrders((l) => l.map((o) => (o.id === id ? f(o) : o)));
  const cancel = (id: number, reason = "Cancelled by you") => patch(id, (o) => ({ ...o, state: "refunded", refund: { amount: o.price, reason, at: stamp() } }));
  const resume = (id: number) => patch(id, (o) => ({ ...o, state: "delivering", delivery: o.delivery.type === "progress" ? { ...o.delivery, problem: undefined } : o.delivery }));

  const reply = (id: number, text: string, file?: string) =>
    setTickets((l) => l.map((x) => (x.id === id ? { ...x, state: "waiting", messages: [...x.messages, { from: "you", at: stamp(), text, file }] } : x)));
  const closeTicket = (id: number) => setTickets((l) => l.map((x) => (x.id === id ? { ...x, state: "closed" } : x)));
  const openTicket = (x: { subject: string; dept: Dept; orderId?: number; text: string; file?: string }) => {
    const id = Math.max(...tickets.map((k) => k.id)) + 1;
    setTickets((l) => [{ id, subject: x.subject, dept: x.dept, orderId: x.orderId, state: "waiting", messages: [{ from: "you", at: stamp(), text: x.text, file: x.file }] }, ...l]);
    return id;
  };
  const topUp = (amount: number, cardId: string, newCard?: BankCard) => {
    if (newCard) setCards((l) => [...l, newCard]);
    setTopUps((l) => [{ id: `P-${7703 + l.length}`, amount, card: cardId, at: stamp(), state: "done" }, ...l]);
  };
  const saveName = (name: string) => setUser((u) => ({ ...u, name }));

  const statement = useMemo(() => buildStatement(orders, topUps), [orders, topUps]);
  const wallet = statement.find((l) => l.balance != null)?.balance ?? 0;
  const cardOf = (id: string) => cards.find((c) => c.id === id) ?? (id === strayCard.id ? strayCard : undefined);

  return { orders, tickets, topUps, cards, user, wallet, statement, clock, arrived, cancel, resume, reply, closeTicket, openTicket, topUp, saveName, cardOf };
}
export type Demo = ReturnType<typeof useAccountDemo>;

// ---------- Wallet statement (every money movement, newest first, with the balance after each) ----------

export type Line = {
  key: string; at: string; kind: "top-up" | "purchase" | "refund" | "card";
  amount: number; balance: number | null; // null: didn't move the wallet (on hold, or paid by card)
  title: string; sub: string; orderId?: number; topUp?: TopUp; held?: boolean;
};

export function buildStatement(orders: AccountOrder[], topUps: TopUp[]): Line[] {
  const lines: Omit<Line, "balance">[] = [];
  for (const p of topUps) lines.push({ key: p.id, at: p.at, kind: "top-up", amount: p.amount, title: "Top-up", sub: p.card, topUp: p, held: p.state === "on-hold" });
  for (const o of orders) {
    lines.push({ key: `o${o.id}`, at: o.at, kind: o.paidWith === "wallet" ? "purchase" : "card", amount: -o.price, title: o.title, sub: o.detail, orderId: o.id });
    if (o.refund) lines.push({ key: `r${o.id}`, at: o.refund.at, kind: "refund", amount: o.refund.amount, title: "Refund", sub: o.refund.reason, orderId: o.id });
  }
  lines.sort((a, b) => a.at.localeCompare(b.at));
  let bal = 0;
  const out = lines.map((l) => {
    const moves = !l.held && l.kind !== "card";
    if (moves) bal += l.amount;
    return { ...l, balance: moves ? bal : null };
  });
  return out.reverse();
}

// ---------- Small controls ----------

export function CopyButton({ text, label, showLabel = false, className = "" }: { text: string; label: string; showLabel?: boolean; className?: string }) {
  const t = useT();
  const [done, setDone] = useState(false);
  const copy = () => { navigator.clipboard?.writeText(text); setDone(true); setTimeout(() => setDone(false), 1600); };
  return (
    <button type="button" onClick={copy} aria-label={showLabel ? undefined : label} title={label}
      className={`${smallBtn} shrink-0 bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-white/10 dark:text-slate-200 dark:hover:bg-white/20 ${className}`}>
      {done ? <Check aria-hidden className="h-4 w-4 text-emerald-600 dark:text-emerald-400" /> : <Copy aria-hidden className="h-4 w-4" />}
      {showLabel && <span>{done ? t("Copied") : label}</span>}
      <span aria-live="polite" className="sr-only">{done ? t("Copied") : ""}</span>
    </button>
  );
}

function SecretRow({ label, value, secret }: { label: string; value: string; secret?: boolean }) {
  const t = useT();
  const [shown, setShown] = useState(!secret);
  return (
    <div className="flex items-center gap-3 py-3">
      <div className="min-w-0 flex-1">
        <div className="text-sm text-slate-600 dark:text-slate-400">{t(label)}</div>
        <div dir="ltr" className={`mt-0.5 break-all text-start font-mono text-[15px] font-semibold text-slate-900 dark:text-white ${shown ? "" : "tracking-widest"}`}>{shown ? value : "••••••••••"}</div>
      </div>
      {secret && (
        <button type="button" onClick={() => setShown((s) => !s)} aria-pressed={shown} aria-label={shown ? t("Hide {0}", { 0: t(label) }) : t("Show {0}", { 0: t(label) })}
          className={`${smallBtn} text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/10`}>
          {shown ? <EyeOff aria-hidden className="h-4 w-4" /> : <Eye aria-hidden className="h-4 w-4" />}
        </button>
      )}
      <CopyButton text={value} label={t("Copy {0}", { 0: t(label) })} />
    </div>
  );
}

// A bar whose length is the real share of time (or amount) left.
export function Bar({ fraction, tone = "amber", className = "" }: { fraction: number; tone?: "amber" | "emerald" | "indigo" | "slate"; className?: string }) {
  const fill = { amber: "bg-amber-500", emerald: "bg-emerald-600 dark:bg-emerald-400", indigo: "bg-indigo-600 dark:bg-indigo-400", slate: "bg-slate-400" }[tone];
  return (
    <span className={`block h-1.5 overflow-hidden rounded-full bg-slate-200 dark:bg-white/10 ${className}`}>
      <span className={`block h-full rounded-full transition-[width] duration-1000 ease-linear ${fill}`} style={{ width: `${Math.max(0, Math.min(1, fraction)) * 100}%` }} />
    </span>
  );
}

// Cancel with an inline confirmation: the button turns into "Cancel and refund …? / Keep it".
export function CancelInline({ order, demo, keepLabel = "Keep waiting", label = "Cancel & refund", className = "" }: { order: AccountOrder; demo: Demo; keepLabel?: string; label?: string; className?: string }) {
  const t = useT();
  const f = useFmt();
  const [asking, setAsking] = useState(false);
  if (asking)
    return (
      <div role="group" aria-label={t("Cancel this order?")} className={`flex flex-wrap items-center gap-2 ${className}`}>
        <span className="w-full text-sm text-slate-700 dark:text-slate-300">{t("Cancel it?")}{" "}<b className="text-slate-900 dark:text-white">{f.money(order.price)}</b>{" "}{t("goes back to your wallet.")}</span>
        <button type="button" onClick={() => demo.cancel(order.id)} className={`${smallBtn} bg-red-700 text-white hover:bg-red-800 dark:bg-red-500 dark:text-white dark:hover:bg-red-400`}><X aria-hidden className="h-4 w-4" />{t("Yes, cancel")}</button>
        <button type="button" onClick={() => setAsking(false)} className={`${smallBtn} border border-slate-300 text-slate-800 hover:bg-slate-50 dark:border-white/20 dark:text-slate-100 dark:hover:bg-white/5`}>{t(keepLabel)}</button>
      </div>
    );
  return <button type="button" onClick={() => setAsking(true)} className={`${smallBtn} border border-slate-300 text-slate-800 hover:bg-slate-50 dark:border-white/20 dark:text-slate-100 dark:hover:bg-white/5 ${className}`}><X aria-hidden className="h-4 w-4" />{t(label)}</button>;
}

// ---------- What an order hands over ----------

export function Delivery({ order, demo, compact = false }: { order: AccountOrder; demo: Demo; compact?: boolean }) {
  const t = useT();
  const f = useFmt();
  const d = order.delivery;

  if (d.type === "number") {
    const waiting = order.state === "waiting";
    return (
      <div>
        <div className="flex items-center gap-3">
          <div className="min-w-0 flex-1">
            <div className="text-sm text-slate-600 dark:text-slate-400">{t("Your {0} number", { 0: d.app })}</div>
            <div dir="ltr" className={`text-start font-mono font-bold tracking-wide text-slate-900 dark:text-white ${compact ? "text-xl" : "text-2xl sm:text-3xl"}`}>{d.number}</div>
          </div>
          {order.state !== "refunded" && <CopyButton text={d.number.replace(/[\s()-]/g, "")} label={t("Copy number")} />}
        </div>
        {waiting && (
          <div className={`mt-4 ${inner} p-4`}>
            <div className="flex items-baseline justify-between gap-3">
              <span className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white"><Loader2 aria-hidden className="h-4 w-4 animate-spin text-amber-600 dark:text-amber-300" />{t("Waiting for the SMS code")}</span>
              <span className="font-mono text-lg font-bold tabular-nums text-slate-900 dark:text-white" aria-label={t("{0} left", { 0: demo.clock.text })}>{demo.clock.text}</span>
            </div>
            <Bar fraction={demo.clock.fraction} className="mt-3" />
            <p className="mt-2 flex items-start gap-1.5 text-sm text-slate-600 dark:text-slate-400"><ShieldCheck aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700 dark:text-emerald-400" />{t("Enter the number in {0}. The code shows up here; no code in time means an automatic refund.", { 0: d.app })}</p>
            <CancelInline order={order} demo={demo} className="mt-3" />
          </div>
        )}
        {d.code && (
          <div className="mt-4 flex animate-fade-up items-center gap-4 rounded-2xl bg-emerald-700 px-5 py-4 text-white [animation-duration:450ms] dark:bg-emerald-500 dark:text-emerald-950">
            <span className="min-w-0 flex-1">
              <span className="block text-sm text-emerald-100 dark:text-emerald-950/80">{t("Code")}{d.codeAt ? ` · ${f.when(d.codeAt)}` : ""}</span>
              <span dir="ltr" className="block font-mono text-3xl font-bold tracking-[0.2em]">{d.code}</span>
            </span>
            <CopyButton text={d.code} label={t("Copy code")} className="!bg-white/20 !text-current hover:!bg-white/30" />
          </div>
        )}
        {order.refund && <RefundNote order={order} className="mt-4" />}
      </div>
    );
  }

  if (d.type === "progress") {
    const frac = d.done / d.total;
    return (
      <div>
        <div className="flex items-baseline justify-between gap-3">
          <span className="font-display text-2xl font-bold tabular-nums text-slate-900 dark:text-white">{f.num(d.done)}<span className="text-base font-semibold text-slate-500 dark:text-slate-400"> / {f.num(d.total)}</span></span>
          <span className="text-sm text-slate-600 dark:text-slate-400">{t(d.unit)}</span>
        </div>
        <Bar fraction={frac} tone={order.state === "refunded" ? "slate" : order.state === "needs-you" ? "indigo" : "amber"} className="mt-3" />
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          <span dir="ltr">{d.target}</span> · {t("{0}-day refill", { 0: d.refillDays })}
        </p>
        {d.problem && order.state === "needs-you" && (
          <div className="mt-4 rounded-2xl border border-indigo-200 bg-indigo-50 p-4 dark:border-indigo-400/30 dark:bg-indigo-400/10">
            <p className="flex items-center gap-2 font-semibold text-indigo-950 dark:text-indigo-100"><Hand aria-hidden className="h-4 w-4" />{t(d.problem.title)}</p>
            <p className="mt-1 text-sm text-indigo-900/80 dark:text-indigo-100/80">{t(d.problem.text)}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <button type="button" onClick={() => demo.resume(order.id)} className={`${smallBtn} bg-indigo-600 text-white hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-400`}><Check aria-hidden className="h-4 w-4" />{t("It's public now, continue")}</button>
              <CancelInline order={order} demo={demo} keepLabel="Keep it" label="Cancel for a refund" />
            </div>
          </div>
        )}
        {order.refund && <RefundNote order={order} className="mt-4" />}
      </div>
    );
  }

  if (d.type === "gift")
    return (
      <div className="flex items-center gap-3">
        <span aria-hidden className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-amber-100 text-amber-800 dark:bg-amber-400/15 dark:text-amber-200"><Star className="h-5 w-5" /></span>
        <div>
          <div className="font-semibold text-slate-900 dark:text-white">{t(d.what)}</div>
          <div className="text-sm text-slate-600 dark:text-slate-400">{t("Sent to")}{" "}<b dir="ltr" className="font-semibold text-slate-900 dark:text-white">{d.recipient}</b>{order.deliveredAt ? ` · ${f.when(order.deliveredAt)}` : ""}</div>
        </div>
      </div>
    );

  if (d.type === "login")
    return (
      <div>
        <div className="divide-y divide-slate-200 dark:divide-white/10">{d.fields.map((x) => <SecretRow key={x.label} {...x} />)}</div>
        <p className="mt-2 flex items-start gap-1.5 text-sm text-slate-600 dark:text-slate-400"><ShieldCheck aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700 dark:text-emerald-400" />{t(d.note)}</p>
      </div>
    );

  return (
    <div className="flex items-center gap-3">
      <span aria-hidden className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-emerald-100 text-emerald-800 dark:bg-emerald-400/15 dark:text-emerald-200"><Check className="h-5 w-5" /></span>
      <div>
        <div className="font-semibold text-slate-900 dark:text-white">{t("{0} is on your account", { 0: t(d.plan) })}</div>
        <div className="text-sm text-slate-600 dark:text-slate-400"><span dir="ltr">{d.email}</span> · {t("ends {0}", { 0: f.date(d.ends) })}</div>
      </div>
    </div>
  );
}

export function RefundNote({ order, className = "" }: { order: AccountOrder; className?: string }) {
  const t = useT();
  const f = useFmt();
  if (!order.refund) return null;
  return (
    <p className={`flex items-start gap-2.5 rounded-2xl bg-slate-100 px-4 py-3 text-sm text-slate-800 dark:bg-white/[.06] dark:text-slate-200 ${className}`}>
      <RotateCcw aria-hidden className="mt-0.5 h-4 w-4 shrink-0" />
      <span><b>{f.money(order.refund.amount)}</b>{" "}{t("went back to your wallet")} · {t(order.refund.reason)}</span>
    </p>
  );
}

// Where "Buy again" goes for each kind of order.
export function buyAgainHref(o: AccountOrder) {
  if (o.kind === "telegram") return o.title.includes("Stars") ? "/telegram/stars" : "/telegram/premium";
  return { number: "/virtual-number", social: "/virtual-service", "google-voice": "/google-voice", "apple-id": "/apple-id", subscription: "/accounts" }[o.kind];
}

// One line a list row shows about where an order is.
export function useOrderLine() {
  const t = useT();
  return (o: AccountOrder, demo: Demo) => {
    const d = o.delivery;
    if (o.state === "waiting") return t("Code expected · {0} left", { 0: demo.clock.text });
    if (o.state === "needs-you" && d.type === "progress" && d.problem) return t(d.problem.title);
    if (o.state === "delivering" && d.type === "progress") return t("{0} of {1} added", { 0: d.done.toLocaleString("en-US"), 1: d.total.toLocaleString("en-US") });
    if (o.state === "refunded" && o.refund) return t(o.refund.reason);
    if (d.type === "number" && d.code) return t("Code {0}", { 0: d.code });
    return t(o.detail);
  };
}

// Paid → handed over → done, with times.
export function OrderSteps({ order }: { order: AccountOrder }) {
  const t = useT();
  const f = useFmt();
  const d = order.delivery;
  const middle = d.type === "number" ? t("Number handed over") : d.type === "progress" ? t("Delivery started") : t("Processing");
  const last = order.state === "refunded" ? t("Refunded") : order.state === "needs-you" ? t("Paused, needs you") : order.state === "waiting" ? t("Waiting for the code") : order.state === "delivering" ? t("Delivering") : t("Delivered");
  const steps = [
    { label: t("Paid"), at: order.at, done: true },
    { label: middle, at: order.at, done: true },
    { label: last, at: order.refund?.at ?? order.deliveredAt, done: order.state === "delivered" || order.state === "refunded", now: order.state === "waiting" || order.state === "delivering" || order.state === "needs-you" },
  ];
  return (
    <ol className="space-y-0">
      {steps.map((s, i) => (
        <li key={i} className="relative flex gap-3 pb-5 last:pb-0">
          {i < steps.length - 1 && <span aria-hidden className="absolute start-[11px] top-6 h-[calc(100%-1.25rem)] w-0.5 bg-slate-200 dark:bg-white/10" />}
          <span aria-hidden className={`relative grid h-6 w-6 shrink-0 place-items-center rounded-full ${s.done ? (order.state === "refunded" && i === 2 ? "bg-slate-500 text-white" : "bg-emerald-600 text-white dark:bg-emerald-500 dark:text-emerald-950") : s.now ? (order.state === "needs-you" ? "bg-indigo-600 text-white" : "bg-amber-500 text-white") : "bg-slate-200 dark:bg-white/10"}`}>
            {s.done ? <Check className="h-3.5 w-3.5" strokeWidth={3} /> : s.now ? <span className="h-2 w-2 rounded-full bg-white" /> : null}
          </span>
          <span className="min-w-0">
            <span className="block text-sm font-semibold text-slate-900 dark:text-white">{s.label}{s.now && <span className="sr-only"> ({t("current step")})</span>}</span>
            {s.at && <span className="block text-sm text-slate-600 dark:text-slate-400">{f.when(s.at)}</span>}
          </span>
        </li>
      ))}
    </ol>
  );
}

// Price, how it was paid and refunds, as summary rows.
export function PaymentRows({ order, demo }: { order: AccountOrder; demo: Demo }) {
  const t = useT();
  const f = useFmt();
  const c = order.paidWith === "wallet" ? null : demo.cardOf(order.paidWith);
  const rows: [string, ReactNode][] = [
    [t("Order"), <span key="o" className="font-mono">#{order.id}</span>],
    [t("Paid"), f.when(order.at)],
    [t("Paid with"), c ? cardShort(c) : t("Wallet")],
    [t("Price"), <span key="p" className="tabular-nums">{f.money(order.price)}</span>],
  ];
  if (order.refund) rows.push([t("Refunded"), <span key="r" className="tabular-nums text-emerald-800 dark:text-emerald-300">+{f.money(order.refund.amount)}</span>]);
  return <SumRows rows={rows} />;
}

export function SumRows({ rows }: { rows: [string, ReactNode][] }) {
  return (
    <dl className="divide-y divide-slate-200 text-[15px] dark:divide-white/10">
      {rows.map(([k, v]) => <div key={k} className="flex justify-between gap-4 py-2.5"><dt className="text-slate-600 dark:text-slate-400">{k}</dt><dd className="min-w-0 text-end font-medium text-slate-900 dark:text-white">{v}</dd></div>)}
    </dl>
  );
}

// ---------- Fields ----------

export function FieldError({ id, children }: { id: string; children?: ReactNode }) {
  const t = useT();
  if (!children) return null;
  return <p id={id} className="mt-1.5 flex items-start gap-1.5 text-sm font-semibold text-red-700 dark:text-red-400"><X aria-hidden className="mt-0.5 h-4 w-4 shrink-0" /><span><span className="sr-only">{t("Error:")} </span>{children}</span></p>;
}
export const bad = "!border-red-700 focus-visible:!ring-red-600 dark:!border-red-400 dark:focus-visible:!ring-red-400";

export function Labeled({ id, label, hint, error, children, className = "" }: { id: string; label: string; hint?: ReactNode; error?: string | null; children: ReactNode; className?: string }) {
  return (
    <div className={className}>
      <label htmlFor={id} className="block text-base font-semibold text-slate-900 dark:text-white">{label}</label>
      {hint && <p id={`${id}-hint`} className="mt-0.5 text-sm text-slate-600 dark:text-slate-400">{hint}</p>}
      <FieldError id={`${id}-error`}>{error}</FieldError>
      <div className="mt-2">{children}</div>
    </div>
  );
}
export const describe = (id: string, hint: boolean, error: unknown) => [hint && `${id}-hint`, error && `${id}-error`].filter(Boolean).join(" ") || undefined;

function ReadOnly({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <div>
      <div className="text-base font-semibold text-slate-900 dark:text-white">{label}</div>
      <p className="mt-0.5 text-sm text-slate-600 dark:text-slate-400">{hint}</p>
      <div dir="ltr" className="mt-2 rounded-xl border border-dashed border-slate-300 px-4 py-3 text-start text-base text-slate-700 dark:border-white/20 dark:text-slate-300">{value}</div>
    </div>
  );
}

const optionCls = (on: boolean) =>
  `relative flex cursor-pointer items-start gap-3 rounded-2xl border-2 bg-white p-4 transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-emerald-600 has-[:focus-visible]:ring-offset-2 dark:bg-white/[.03] dark:has-[:focus-visible]:ring-emerald-400 dark:has-[:focus-visible]:ring-offset-[#0E1424] ${on ? "border-emerald-700 dark:border-emerald-400" : "border-slate-200 hover:border-slate-400 dark:border-white/15 dark:hover:border-white/35"}`;
function RadioDot({ on }: { on: boolean }) {
  return <span aria-hidden className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full border-2 ${on ? "border-emerald-700 bg-emerald-700 dark:border-emerald-400 dark:bg-emerald-400" : "border-slate-400 dark:border-white/30"}`}>{on && <Check className="h-3 w-3 text-white dark:text-emerald-950" strokeWidth={3.5} />}</span>;
}

// ---------- Add funds ----------

export function useTopUp(demo: Demo) {
  const t = useT();
  const f = useFmt();
  const [amount, setAmount] = useState<number | null>(500_000);
  const [custom, setCustom] = useState("");
  const [cardId, setCardId] = useState<string>(demo.cards[0]?.id ?? "new");
  const [newCard, setNewCard] = useState("");
  const [tried, setTried] = useState(false);
  const [phase, setPhase] = useState<"form" | "bank" | "done">("form");
  const [doneAmount, setDoneAmount] = useState(0);

  const value = amount ?? (Number(custom.replace(/\D/g, "")) || 0);
  const digits = newCard.replace(/\D/g, "");
  const amountError = !value ? t("Choose or enter an amount") : value < TOP_UP_MIN ? t("The smallest top-up is {0}", { 0: f.money(TOP_UP_MIN) }) : value > TOP_UP_MAX ? t("The largest top-up is {0}", { 0: f.money(TOP_UP_MAX) }) : null;
  const cardError = cardId === "new" && digits.length !== 16 ? (digits.length ? t("A card number has 16 digits; this one has {0}", { 0: digits.length }) : t("Enter the card you'll pay with")) : null;
  const errors = { amount: tried ? amountError : null, card: tried ? cardError : null };
  const chosen: BankCard | null = cardId === "new" ? (digits.length === 16 ? { id: `c${digits.slice(-4)}`, bank: t("New card"), first6: digits.slice(0, 6), last4: digits.slice(-4) } : null) : demo.cards.find((c) => c.id === cardId) ?? null;

  const submit = () => {
    setTried(true);
    if (amountError) { document.getElementById(amount === null ? "topup-custom" : "topup-amount-first")?.focus(); return; }
    if (cardError) { document.getElementById("topup-newcard")?.focus(); return; }
    setPhase("bank");
    // Demo: the bank page is skipped and the payment comes back as paid.
    setTimeout(() => {
      demo.topUp(value, chosen!.id, cardId === "new" ? chosen! : undefined);
      setDoneAmount(value); setPhase("done");
      if (cardId === "new") setCardId(chosen!.id);
      setNewCard(""); setTried(false);
    }, 1400);
  };
  return { amount, setAmount, custom, setCustom, cardId, setCardId, newCard, setNewCard, value, errors, chosen, submit, phase, setPhase, doneAmount };
}
export type TopUpState = ReturnType<typeof useTopUp>;

export function AmountPicker({ s, cols = "grid-cols-2 sm:grid-cols-4" }: { s: TopUpState; cols?: string }) {
  const t = useT();
  const f = useFmt();
  const err = s.errors.amount;
  return (
    <fieldset aria-describedby={err ? "topup-amount-error" : undefined}>
      <legend className="text-base font-semibold text-slate-900 dark:text-white">{t("Amount")}</legend>
      <p className="mt-0.5 text-sm text-slate-600 dark:text-slate-400">{t("From {0} to {1}.", { 0: f.money(TOP_UP_MIN), 1: f.money(TOP_UP_MAX) })}</p>
      <FieldError id="topup-amount-error">{err}</FieldError>
      <div className={`mt-3 grid gap-3 ${cols}`}>
        {topUpPresets.map((v, i) => {
          const on = s.amount === v;
          return (
            <label key={v} className={`${optionCls(on)} items-center`}>
              <input id={i === 0 ? "topup-amount-first" : undefined} type="radio" name="topup-amount" checked={on} onChange={() => { s.setAmount(v); s.setCustom(""); }} className="sr-only" />
              <RadioDot on={on} />
              <span className="font-display text-lg font-bold tabular-nums text-slate-900 dark:text-white">{f.num(v)}</span>
            </label>
          );
        })}
      </div>
      <label className={`${optionCls(s.amount === null)} mt-3 items-center`}>
        <input type="radio" name="topup-amount" checked={s.amount === null} onChange={() => { s.setAmount(null); setTimeout(() => document.getElementById("topup-custom")?.focus(), 0); }} className="sr-only" />
        <RadioDot on={s.amount === null} />
        <span className="shrink-0 font-semibold text-slate-900 dark:text-white">{t("Other amount")}</span>
        <span className="relative ms-auto w-full max-w-56">
          <input id="topup-custom" inputMode="numeric" autoComplete="off" value={s.custom} aria-label={t("Other amount in Toman")} aria-invalid={!!err && s.amount === null}
            onFocus={() => s.setAmount(null)}
            onChange={(e) => { const n = e.target.value.replace(/\D/g, "").slice(0, 9); s.setCustom(n ? Number(n).toLocaleString("en-US") : ""); }}
            placeholder="750,000" dir="ltr"
            className={`${field} !py-2 pe-16 text-end tabular-nums caret-emerald-600 ${err && s.amount === null ? bad : ""}`} />
          <span className="pointer-events-none absolute inset-y-0 end-3 flex items-center text-sm text-slate-600 dark:text-slate-400">{t("Toman")}</span>
        </span>
      </label>
    </fieldset>
  );
}

export function CardPicker({ s, demo }: { s: TopUpState; demo: Demo }) {
  const t = useT();
  const err = s.errors.card;
  return (
    <fieldset>
      <legend className="text-base font-semibold text-slate-900 dark:text-white">{t("Card you'll pay with")}</legend>
      <p className="mt-0.5 text-sm text-slate-600 dark:text-slate-400">{t("Pay with this same card on the bank page. A different card puts the top-up on hold until we check it.")}</p>
      <div className="mt-3 space-y-3">
        {demo.cards.map((c) => {
          const on = s.cardId === c.id;
          return (
            <label key={c.id} className={optionCls(on)}>
              <input type="radio" name="topup-card" checked={on} onChange={() => s.setCardId(c.id)} className="sr-only" />
              <RadioDot on={on} />
              <CreditCard aria-hidden className="mt-0.5 h-5 w-5 shrink-0 text-slate-500 dark:text-slate-400" />
              <span className="min-w-0 flex-1">
                <span className="block font-semibold text-slate-900 dark:text-white">{c.bank}</span>
                <span dir="ltr" className="block text-start font-mono text-sm text-slate-600 dark:text-slate-400">{masked(c)}</span>
              </span>
              {on && <span aria-hidden className="text-sm font-semibold text-emerald-800 dark:text-emerald-300">{t("Selected")}</span>}
            </label>
          );
        })}
        <div className={optionCls(s.cardId === "new")}>
          <label className="flex flex-1 cursor-pointer items-start gap-3">
            <input type="radio" name="topup-card" checked={s.cardId === "new"} onChange={() => { s.setCardId("new"); setTimeout(() => document.getElementById("topup-newcard")?.focus(), 0); }} className="sr-only" />
            <RadioDot on={s.cardId === "new"} />
            <Plus aria-hidden className="mt-0.5 h-5 w-5 shrink-0 text-slate-500 dark:text-slate-400" />
            <span className="font-semibold text-slate-900 dark:text-white">{t("A new card")}</span>
          </label>
        </div>
        {s.cardId === "new" && (
          <div className="ps-1">
            <label htmlFor="topup-newcard" className="block text-sm font-semibold text-slate-900 dark:text-white">{t("Card number")}</label>
            <p id="topup-newcard-hint" className="mt-0.5 text-sm text-slate-600 dark:text-slate-400">{t("16 digits on the front of the card. It's saved to your account for next time.")}</p>
            <FieldError id="topup-newcard-error">{err}</FieldError>
            <input id="topup-newcard" inputMode="numeric" autoComplete="cc-number" dir="ltr" placeholder="6037 9900 0000 0000" value={s.newCard}
              aria-invalid={!!err} aria-describedby={describe("topup-newcard", true, err)}
              onChange={(e) => s.setNewCard(e.target.value.replace(/\D/g, "").slice(0, 16).replace(/(\d{4})(?=\d)/g, "$1 "))}
              className={`${field} mt-2 text-start font-mono tracking-wider caret-emerald-600 ${err ? bad : ""}`} />
          </div>
        )}
      </div>
    </fieldset>
  );
}

// The sidebar: what's about to happen, and the bank button. `line` lets an offer add its own row.
export function TopUpSummary({ s, demo, className = card, extra }: { s: TopUpState; demo: Demo; className?: string; extra?: ReactNode }) {
  const t = useT();
  const f = useFmt();
  const head = useId();
  if (s.phase === "done")
    return (
      <section aria-labelledby={head} className={`${className} p-6`}>
        <span aria-hidden className="grid h-10 w-10 place-items-center rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-400/15 dark:text-emerald-200"><Check className="h-5 w-5" strokeWidth={3} /></span>
        <h2 id={head} className="mt-3 font-display text-lg font-semibold text-slate-900 dark:text-white" tabIndex={-1}>{t("{0} added", { 0: f.money(s.doneAmount) })}</h2>
        <p className="mt-1 text-[15px] text-slate-700 dark:text-slate-300">{t("Your wallet now has {0}.", { 0: f.money(demo.wallet) })}</p>
        <button type="button" onClick={() => s.setPhase("form")} className={`${secondary} mt-5 w-full`}>{t("Add more")}</button>
      </section>
    );
  const busy = s.phase === "bank";
  return (
    <section aria-labelledby={head} className={`${className} p-6`}>
      <h2 id={head} className="font-display text-lg font-semibold text-slate-900 dark:text-white">{t("Your top-up")}</h2>
      <div className="mt-3">
        <SumRows rows={[
          [t("Wallet now"), <span key="n" className="tabular-nums">{f.money(demo.wallet)}</span>],
          [t("Paying with"), s.chosen ? <span key="c" dir="ltr">•••• {s.chosen.last4}</span> : <span key="c" className="text-slate-500">{t("Not chosen")}</span>],
          [t("Wallet after"), <span key="a" className="tabular-nums">{f.money(demo.wallet + s.value)}</span>],
        ]} />
      </div>
      {extra}
      <div className="mt-4 flex items-baseline justify-between gap-3 border-t border-slate-200 pt-4 dark:border-white/10">
        <span className="text-[15px] font-semibold text-slate-900 dark:text-white">{t("To pay")}</span>
        <span className="font-display text-2xl font-bold tabular-nums text-slate-900 dark:text-white">{f.money(s.value)}</span>
      </div>
      <button type="button" onClick={s.submit} disabled={busy} className={`${payBtn} mt-4`}>
        {busy ? <Loader2 aria-hidden className="h-5 w-5 animate-spin" /> : <Lock aria-hidden className="h-5 w-5" />}
        {busy ? t("Opening the bank…") : t("Pay at the bank")}
      </button>
      {(s.errors.amount || s.errors.card) && <p className="mt-2 text-sm font-semibold text-red-700 dark:text-red-400">{s.errors.amount ? t("Choose an amount above to continue.") : t("Add the card number above to continue.")}</p>}
      <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">{t("You pay on the bank's secure page and come straight back here. The money is in your wallet as soon as the bank confirms.")}</p>
      <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">{t("Sample: the bank page is skipped and the top-up comes back paid.")}</p>
    </section>
  );
}

// ---------- Support ----------

export function deptLabel(d: Dept) {
  return departments.find((x) => x.id === d)?.label ?? d;
}

export function Thread({ ticket }: { ticket: Ticket }) {
  const t = useT();
  const f = useFmt();
  return (
    <ol className="space-y-4">
      {ticket.messages.map((m, i) => {
        const you = m.from === "you";
        return (
          <li key={i} className={`flex ${you ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[34rem] rounded-2xl px-4 py-3 ${you ? "rounded-ee-md bg-indigo-600 text-white dark:bg-indigo-500" : "rounded-es-md border border-slate-200 bg-white text-slate-800 dark:border-white/15 dark:bg-white/[.04] dark:text-slate-100"}`}>
              <div className={`flex items-center gap-2 text-sm ${you ? "text-indigo-100" : "text-slate-600 dark:text-slate-400"}`}>
                <b className={you ? "text-white" : "text-slate-900 dark:text-white"}>{you ? t("You") : t("{0} · ShopMajazi support", { 0: m.name ?? "" })}</b>
                <span>{f.when(m.at)}</span>
              </div>
              <p className="mt-1 text-[15px] leading-relaxed">{t(m.text)}</p>
              {m.file && <p className={`mt-2 flex items-center gap-1.5 text-sm ${you ? "text-indigo-100" : "text-slate-600 dark:text-slate-400"}`}><Paperclip aria-hidden className="h-4 w-4" /><span dir="ltr">{m.file}</span></p>}
            </div>
          </li>
        );
      })}
    </ol>
  );
}

const FILE_OK = ["image/png", "image/jpeg", "image/bmp"];
function useAttachment() {
  const t = useT();
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const pick = (f: File | null) => {
    if (!f) { setFile(null); setError(null); return; }
    if (!FILE_OK.includes(f.type)) { setFile(null); setError(t("Attach a PNG, JPG or BMP image")); return; }
    if (f.size > 2 * 1024 * 1024) { setFile(null); setError(t("The image is over 2 MB; attach a smaller one")); return; }
    setFile(f); setError(null);
  };
  return { file, error, pick, clear: () => { setFile(null); setError(null); } };
}

function AttachButton({ id, att }: { id: string; att: ReturnType<typeof useAttachment> }) {
  const t = useT();
  return (
    <div>
      <input id={id} type="file" accept=".png,.jpg,.jpeg,.bmp" className="peer sr-only" aria-describedby={att.error ? `${id}-error` : undefined} onChange={(e) => att.pick(e.target.files?.[0] ?? null)} />
      {att.file ? (
        <span className="inline-flex items-center gap-2 rounded-lg bg-slate-100 py-1.5 pe-1.5 ps-3 text-sm text-slate-800 dark:bg-white/10 dark:text-slate-100">
          <Paperclip aria-hidden className="h-4 w-4" /><span dir="ltr" className="max-w-48 truncate">{att.file.name}</span>
          <button type="button" onClick={att.clear} aria-label={t("Remove attachment")} className={`${smallBtn} !p-1 hover:bg-slate-200 dark:hover:bg-white/20`}><X aria-hidden className="h-4 w-4" /></button>
        </span>
      ) : (
        <label htmlFor={id} className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 peer-focus-visible:ring-2 peer-focus-visible:ring-emerald-600 dark:text-slate-200 dark:hover:bg-white/10 dark:peer-focus-visible:ring-emerald-400">
          <Paperclip aria-hidden className="h-4 w-4" />{t("Attach an image")}<span className="font-normal text-slate-500 dark:text-slate-400">{t("(up to 2 MB)")}</span>
        </label>
      )}
      <FieldError id={`${id}-error`}>{att.error}</FieldError>
    </div>
  );
}

export function ReplyBox({ ticket, demo }: { ticket: Ticket; demo: Demo }) {
  const t = useT();
  const id = useId();
  const [text, setText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const att = useAttachment();
  const area = useRef<HTMLTextAreaElement>(null);
  if (ticket.state === "closed")
    return <p className={`${inner} px-4 py-3 text-sm text-slate-700 dark:text-slate-300`}>{t("This ticket is closed. Open a new one if you need more help.")}</p>;
  const send = () => {
    if (!text.trim()) { setError(t("Write your reply first")); area.current?.focus(); return; }
    demo.reply(ticket.id, text.trim(), att.file?.name);
    setText(""); setError(null); att.clear();
  };
  return (
    <div>
      <label htmlFor={`${id}-reply`} className="block text-base font-semibold text-slate-900 dark:text-white">{t("Your reply")}</label>
      <FieldError id={`${id}-reply-error`}>{error}</FieldError>
      <textarea ref={area} id={`${id}-reply`} rows={4} value={text} onChange={(e) => { setText(e.target.value); if (error) setError(null); }}
        aria-invalid={!!error} aria-describedby={error ? `${id}-reply-error` : undefined}
        className={`${field} mt-2 resize-y caret-emerald-600 ${error ? bad : ""}`} />
      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <AttachButton id={`${id}-file`} att={att} />
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={() => demo.closeTicket(ticket.id)} className={`${smallBtn} px-4 py-3 text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-white/10`}>{t("Close ticket")}</button>
          <button type="button" onClick={send} className={`${primary} !px-5 !py-3`}><Send aria-hidden className="h-4 w-4 rtl:-scale-x-100" />{t("Send reply")}</button>
        </div>
      </div>
    </div>
  );
}

export function NewTicketForm({ demo, orderId, onDone, onCancel }: { demo: Demo; orderId?: number; onDone: (id: number) => void; onCancel?: () => void }) {
  const t = useT();
  const f = useFmt();
  const [dept, setDept] = useState<Dept | null>(orderId ? "orders" : null);
  const [order, setOrder] = useState(orderId ? String(orderId) : "");
  const [subject, setSubject] = useState("");
  const [text, setText] = useState("");
  const [tried, setTried] = useState(false);
  const att = useAttachment();
  const err = {
    dept: tried && !dept ? t("Choose who should answer") : null,
    order: tried && dept === "orders" && !order ? t("Choose the order this is about") : null,
    subject: tried && !subject.trim() ? t("Add a short subject") : subject.length > 150 ? t("Keep the subject under 150 characters") : null,
    text: tried && !text.trim() ? t("Tell us what happened") : null,
  };
  const submit = () => {
    setTried(true);
    const first = !dept ? "nt-dept-first" : dept === "orders" && !order ? "nt-order" : !subject.trim() || subject.length > 150 ? "nt-subject" : !text.trim() ? "nt-text" : null;
    if (first) { document.getElementById(first)?.focus(); return; }
    onDone(demo.openTicket({ subject: subject.trim(), dept: dept!, orderId: dept === "orders" ? Number(order) : undefined, text: text.trim(), file: att.file?.name }));
  };
  return (
    <form noValidate onSubmit={(e) => { e.preventDefault(); submit(); }} className="space-y-7">
      <fieldset aria-describedby={err.dept ? "nt-dept-error" : undefined}>
        <legend className="text-base font-semibold text-slate-900 dark:text-white">{t("What's it about?")}</legend>
        <FieldError id="nt-dept-error">{err.dept}</FieldError>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {departments.map((d, i) => (
            <label key={d.id} className={optionCls(dept === d.id)}>
              <input id={i === 0 ? "nt-dept-first" : undefined} type="radio" name="nt-dept" checked={dept === d.id} onChange={() => setDept(d.id)} className="sr-only" />
              <RadioDot on={dept === d.id} />
              <span><span className="block font-semibold text-slate-900 dark:text-white">{t(d.label)}</span><span className="block text-sm text-slate-600 dark:text-slate-400">{t(d.hint)}</span></span>
            </label>
          ))}
        </div>
      </fieldset>
      {dept === "orders" && (
        <Labeled id="nt-order" label={t("Which order?")} error={err.order}>
          <select id="nt-order" value={order} onChange={(e) => setOrder(e.target.value)} aria-invalid={!!err.order} aria-describedby={describe("nt-order", false, err.order)} className={`${field} appearance-auto ${err.order ? bad : ""}`}>
            <option value="">{t("Choose an order")}</option>
            {demo.orders.map((o) => <option key={o.id} value={o.id}>#{o.id} · {t(o.title)} · {f.date(o.at)}</option>)}
          </select>
        </Labeled>
      )}
      <Labeled id="nt-subject" label={t("Subject")} hint={t("One line, like \"Code didn't arrive\".")} error={err.subject}>
        <input id="nt-subject" value={subject} onChange={(e) => setSubject(e.target.value)} maxLength={160} aria-invalid={!!err.subject} aria-describedby={describe("nt-subject", true, err.subject)} className={`${field} caret-emerald-600 ${err.subject ? bad : ""}`} />
      </Labeled>
      <Labeled id="nt-text" label={t("Message")} hint={t("What you did, what you expected, and what happened instead.")} error={err.text}>
        <textarea id="nt-text" rows={5} value={text} onChange={(e) => setText(e.target.value)} aria-invalid={!!err.text} aria-describedby={describe("nt-text", true, err.text)} className={`${field} resize-y caret-emerald-600 ${err.text ? bad : ""}`} />
      </Labeled>
      <AttachButton id="nt-file" att={att} />
      <div className="flex flex-wrap gap-3">
        <button type="submit" className={primary}><Send aria-hidden className="h-4 w-4 rtl:-scale-x-100" />{t("Send ticket")}</button>
        {onCancel && <button type="button" onClick={onCancel} className={secondary}>{t("Cancel")}</button>}
      </div>
      <p className="text-sm text-slate-600 dark:text-slate-400">{t("Support answers around the clock. Replies show up here, in this ticket.")}</p>
    </form>
  );
}

// ---------- Profile and password ----------

export function ProfileForm({ demo, showCards = true }: { demo: Demo; showCards?: boolean }) {
  const t = useT();
  const [name, setName] = useState(demo.user.name);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const dirty = name.trim() !== demo.user.name;
  const save = () => {
    if (!name.trim()) { setError(t("Enter your name")); document.getElementById("pf-name")?.focus(); return; }
    if (name.trim().length > 60) { setError(t("Keep your name under 60 characters")); document.getElementById("pf-name")?.focus(); return; }
    demo.saveName(name.trim()); setError(null); setSaved(true);
  };
  return (
    <form noValidate onSubmit={(e) => { e.preventDefault(); save(); }} className="space-y-6">
      <Labeled id="pf-name" label={t("Full name")} hint={t("Shown to support and on your receipts.")} error={error}>
        <input id="pf-name" autoComplete="name" value={name} onChange={(e) => { setName(e.target.value); setSaved(false); if (error) setError(null); }} aria-invalid={!!error} aria-describedby={describe("pf-name", true, error)} className={`${field} caret-emerald-600 ${error ? bad : ""}`} />
      </Labeled>
      <ReadOnly label={t("Mobile number")} value={demo.user.mobile} hint={t("You sign in with this number. To change it, write to support.")} />
      <ReadOnly label={t("Email")} value={demo.user.email} hint={t("Receipts go here. To change it, write to support.")} />
      {showCards && <SavedCards demo={demo} />}
      <div className="flex flex-wrap items-center gap-4">
        <button type="submit" disabled={!dirty} className={`${primary} disabled:cursor-not-allowed disabled:opacity-40`}>{t("Save changes")}</button>
        <span aria-live="polite" className="flex items-center gap-1.5 text-sm font-semibold text-emerald-800 dark:text-emerald-300">{saved && <><Check aria-hidden className="h-4 w-4" />{t("Saved")}</>}</span>
      </div>
    </form>
  );
}

export function SavedCards({ demo }: { demo: Demo }) {
  const t = useT();
  return (
    <div>
      <div className="text-base font-semibold text-slate-900 dark:text-white">{t("Your bank cards")}</div>
      <p className="mt-0.5 text-sm text-slate-600 dark:text-slate-400">{t("Top-ups are accepted from these cards. A new card is added when you top up with it.")}</p>
      <ul className="mt-2 divide-y divide-slate-200 rounded-xl border border-slate-200 dark:divide-white/10 dark:border-white/15">
        {demo.cards.map((c) => (
          <li key={c.id} className="flex items-center gap-3 px-4 py-3">
            <CreditCard aria-hidden className="h-5 w-5 shrink-0 text-slate-500 dark:text-slate-400" />
            <span className="min-w-0 flex-1 font-semibold text-slate-900 dark:text-white">{c.bank}</span>
            <span dir="ltr" className="font-mono text-sm text-slate-600 dark:text-slate-400">{masked(c)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function PasswordInput({ id, value, onChange, error, hint, autoComplete }: { id: string; value: string; onChange: (v: string) => void; error: string | null; hint: boolean; autoComplete: string }) {
  const t = useT();
  const [shown, setShown] = useState(false);
  return (
    <span className="relative block">
      <input id={id} type={shown ? "text" : "password"} dir="ltr" autoComplete={autoComplete} value={value} onChange={(e) => onChange(e.target.value)}
        aria-invalid={!!error} aria-describedby={describe(id, hint, error)} className={`${field} pe-12 text-start caret-emerald-600 ${error ? bad : ""}`} />
      <button type="button" onClick={() => setShown((s) => !s)} aria-pressed={shown} aria-label={shown ? t("Hide password") : t("Show password")}
        className={`${smallBtn} absolute inset-y-1 end-1 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/10`}>
        {shown ? <EyeOff aria-hidden className="h-4 w-4" /> : <Eye aria-hidden className="h-4 w-4" />}
      </button>
    </span>
  );
}

export function PasswordForm({ demo }: { demo: Demo }) {
  const t = useT();
  const [cur, setCur] = useState("");
  const [next, setNext] = useState("");
  const [again, setAgain] = useState("");
  const [tried, setTried] = useState(false);
  const [done, setDone] = useState(false);
  const rules = [
    { ok: next.length >= 8, text: t("At least 8 characters") },
    { ok: !!next && next.replace(/\s/g, "") !== demo.user.mobile.replace(/\s/g, ""), text: t("Not your mobile number") },
    { ok: !!next && next !== cur, text: t("Different from your current password") },
  ];
  const err = {
    cur: tried && !cur ? t("Enter your current password") : null,
    next: tried && !rules.every((r) => r.ok) ? (next ? t("This password doesn't meet the rules below") : t("Choose a new password")) : null,
    again: tried && again !== next ? t("The two passwords don't match") : tried && !again ? t("Type the new password again") : null,
  };
  const submit = () => {
    setTried(true);
    const first = !cur ? "pw-cur" : !rules.every((r) => r.ok) ? "pw-new" : !again || again !== next ? "pw-again" : null;
    if (first) { document.getElementById(first)?.focus(); return; }
    setDone(true); setCur(""); setNext(""); setAgain(""); setTried(false);
  };
  const masked4 = demo.user.mobile.replace(/^(\d{4}) (\d{3}) (\d{4})$/, "$1 ••• $3");
  return (
    <form noValidate onSubmit={(e) => { e.preventDefault(); submit(); }} className="space-y-6">
      {done && (
        <p role="status" className="flex items-start gap-2.5 rounded-2xl bg-emerald-50 px-4 py-3 text-[15px] text-emerald-900 dark:bg-emerald-400/10 dark:text-emerald-100">
          <Check aria-hidden className="mt-0.5 h-4 w-4 shrink-0" /><span><b>{t("Password changed.")}</b>{" "}{t("Use it the next time you sign in.")}</span>
        </p>
      )}
      <Labeled id="pw-cur" label={t("Current password")} hint={<>{t("Don't remember it? Sign out and sign in with a code sent to")}{" "}<span dir="ltr">{masked4}</span>{t(", then set a new one here.")}</>} error={err.cur}>
        <PasswordInput id="pw-cur" value={cur} onChange={(v) => { setCur(v); setDone(false); }} error={err.cur} hint autoComplete="current-password" />
      </Labeled>
      <Labeled id="pw-new" label={t("New password")} error={err.next}>
        <PasswordInput id="pw-new" value={next} onChange={(v) => { setNext(v); setDone(false); }} error={err.next} hint={false} autoComplete="new-password" />
        <ul aria-label={t("Password rules")} className="mt-3 space-y-1.5">
          {rules.map((r) => (
            <li key={r.text} className={`flex items-center gap-2 text-sm ${r.ok ? "text-emerald-800 dark:text-emerald-300" : "text-slate-600 dark:text-slate-400"}`}>
              {r.ok ? <Check aria-hidden className="h-4 w-4" /> : <span aria-hidden className="mx-[5px] h-1.5 w-1.5 rounded-full bg-current" />}
              {r.text}<span className="sr-only">{r.ok ? t(": done") : t(": not yet")}</span>
            </li>
          ))}
        </ul>
      </Labeled>
      <Labeled id="pw-again" label={t("New password again")} error={err.again}>
        <PasswordInput id="pw-again" value={again} onChange={setAgain} error={err.again} hint={false} autoComplete="new-password" />
      </Labeled>
      <button type="submit" className={primary}><Lock aria-hidden className="h-4 w-4" />{t("Change password")}</button>
    </form>
  );
}

// ---------- Empty states ----------

export function Empty({ title, text, action }: { title: string; text: string; action?: ReactNode }) {
  return (
    <div className="px-6 py-10 text-center">
      <p className="font-display text-lg font-semibold text-slate-900 dark:text-white">{title}</p>
      <p className="mx-auto mt-1 max-w-sm text-[15px] text-slate-600 dark:text-slate-400">{text}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

