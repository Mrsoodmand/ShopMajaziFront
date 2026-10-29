"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { ChevronDown, MessageCircle, Plus, Search, X } from "lucide-react";
import Link from "@/i18n/Link";
import { PageShell } from "../otp/parts";
import { useT } from "@/i18n/client";
import type { AccountOrder, Ticket } from "@/content/account-en";
import {
  AmountPicker, Badge, Bar, CancelInline, CardPicker, CopyButton, Delivery, Empty, NewTicketForm, OrderSteps, PasswordForm,
  PaymentRows, ProfileForm, ReplyBox, ServiceTile, Thread, TopUpSummary, buyAgainHref, card, deptLabel, field, inner, laneOf,
  primary, secondary, smallBtn, ticketBadge, useAccountDemo, useFmt, useOrderLine, useTopUp, type BadgeKind, type Demo,
} from "./kit";

// Account B — "One Page". The whole account is one scrolling page: what's happening now, orders, add funds,
// support, profile and password, in that order. A solid indigo index on the start side follows the scroll; its
// filled square marks the section you're in. Nothing opens a new page: an order or a ticket unfolds in place,
// with everything it has (the code or login, progress, payment, the conversation).

const SECTIONS = [
  { id: "b-now", label: "Right now" },
  { id: "b-orders", label: "Orders" },
  { id: "b-funds", label: "Add funds" },
  { id: "b-support", label: "Support" },
  { id: "b-profile", label: "Profile" },
  { id: "b-password", label: "Password" },
] as const;
type SectionId = (typeof SECTIONS)[number]["id"];
const IDS = SECTIONS.map((s) => s.id);

const indexRing = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-indigo-600 dark:focus-visible:ring-offset-indigo-700";
const pageRing = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2 dark:focus-visible:ring-emerald-400 dark:focus-visible:ring-offset-[#070B14]";

const reduce = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
function jump(id: string, focusId?: string) {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: reduce() ? "auto" : "smooth", block: "start" });
  (document.getElementById(focusId ?? `${id}-h`) as HTMLElement | null)?.focus({ preventScroll: true });
}

function useSpy(ids: readonly string[]) {
  const [active, setActive] = useState<string>(ids[0]);
  useEffect(() => {
    const seen = new Map<string, boolean>();
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => seen.set(e.target.id, e.isIntersecting));
      const first = ids.find((id) => seen.get(id));
      if (first) setActive(first);
    }, { rootMargin: "-25% 0px -65% 0px" });
    ids.forEach((id) => { const el = document.getElementById(id); if (el) io.observe(el); });
    return () => io.disconnect();
  }, [ids]);
  return active;
}

export default function AccountB() {
  const t = useT();
  const f = useFmt();
  const demo = useAccountDemo();
  const active = useSpy(IDS);
  const [openOrder, setOpenOrder] = useState<number | null>(null);
  const [openTicket, setOpenTicket] = useState<number | null>(null);
  const [writing, setWriting] = useState<{ orderId?: number } | null>(null);
  const pending = useRef<[string, string] | null>(null);
  useEffect(() => { if (pending.current) { const [id, f] = pending.current; pending.current = null; jump(id, f); } });

  const showOrder = (id: number) => { setOpenOrder(id); pending.current = [`b-order-${id}`, `b-order-${id}-btn`]; };
  const showTicket = (id: number) => { setWriting(null); setOpenTicket(id); pending.current = [`b-ticket-${id}`, `b-ticket-${id}-btn`]; };
  const helpWith = (orderId: number) => { setWriting({ orderId }); pending.current = ["b-support", "b-support-h"]; };

  const needs = demo.orders.filter((o) => o.state === "needs-you").length + demo.arrived.length;
  const replies = demo.tickets.filter((x) => x.state === "replied").length;
  const counts: Partial<Record<SectionId, number>> = { "b-now": needs + replies, "b-support": replies };

  return (
    <PageShell>
      <div className="selection:bg-indigo-200 selection:text-indigo-950 dark:selection:bg-indigo-400/40 dark:selection:text-white">
        {/* Phones: the index is a sticky row of chips under the header. */}
        <nav aria-label={t("Account sections")} className="sticky top-16 z-30 border-b border-slate-200 bg-[#F5F6FB]/95 backdrop-blur lg:hidden dark:border-white/10 dark:bg-[#070B14]/95">
          <div className="mx-auto flex max-w-6xl gap-2 overflow-x-auto px-4 py-3 [scrollbar-width:none] sm:px-6 [&::-webkit-scrollbar]:hidden">
            {SECTIONS.map((s) => {
              const on = active === s.id;
              return (
                <a key={s.id} href={`#${s.id}`} onClick={(e) => { e.preventDefault(); jump(s.id); }} aria-current={on ? "location" : undefined}
                  className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-semibold transition-colors ${on ? "bg-indigo-600 text-white" : "bg-white text-slate-800 ring-1 ring-slate-200 dark:bg-white/5 dark:text-slate-100 dark:ring-white/15"} ${pageRing}`}>
                  {t(s.label)}{!!counts[s.id] && <span className={`grid h-5 min-w-5 place-items-center rounded-full px-1 text-xs font-bold tabular-nums ${on ? "bg-white text-indigo-700" : "bg-indigo-600 text-white"}`}>{counts[s.id]}</span>}
                </a>
              );
            })}
          </div>
        </nav>

        <div className="mx-auto max-w-6xl px-4 pb-24 pt-8 sm:px-6 sm:pt-12 lg:grid lg:grid-cols-[15.5rem_minmax(0,1fr)] lg:gap-10">
          <aside className="hidden lg:block">
            <div className="sticky top-24 rounded-3xl bg-indigo-600 p-5 text-white dark:bg-indigo-700">
              <p className="truncate font-semibold">{demo.user.name}</p>
              <p dir="ltr" className="text-start text-sm text-indigo-100">{demo.user.mobile}</p>
              <div className="mt-5 border-t border-white/20 pt-4">
                <p className="text-sm text-indigo-100">{t("Wallet")}</p>
                <p className="font-display text-2xl font-bold tabular-nums">{f.money(demo.wallet)}</p>
                <a href="#b-funds" onClick={(e) => { e.preventDefault(); jump("b-funds"); }} className={`mt-3 inline-flex items-center gap-1.5 rounded-xl bg-white px-3.5 py-2.5 text-sm font-semibold text-indigo-700 transition-colors hover:bg-indigo-50 ${indexRing}`}>
                  <Plus aria-hidden className="h-4 w-4" />{t("Add funds")}
                </a>
              </div>
              <nav aria-label={t("Account sections")} className="mt-6">
                <ol className="relative">
                  <span aria-hidden className="absolute bottom-3 start-[7px] top-3 w-px bg-white/30" />
                  {SECTIONS.map((s) => {
                    const on = active === s.id;
                    return (
                      <li key={s.id}>
                        <a href={`#${s.id}`} onClick={(e) => { e.preventDefault(); jump(s.id); }} aria-current={on ? "location" : undefined}
                          className={`relative flex items-center gap-3 rounded-lg py-2 pe-2 text-[15px] transition-colors ${on ? "font-semibold text-white" : "text-indigo-100 hover:text-white"} ${indexRing}`}>
                          <span aria-hidden className={`relative h-[15px] w-[15px] shrink-0 rounded-[4px] border-2 transition-colors ${on ? "border-white bg-white" : "border-white/60 bg-indigo-600 dark:bg-indigo-700"}`} />
                          <span className="flex-1">{t(s.label)}</span>
                          {!!counts[s.id] && <span className="grid h-5 min-w-5 place-items-center rounded-full bg-white px-1.5 text-xs font-bold tabular-nums text-indigo-700">{counts[s.id]}</span>}
                        </a>
                      </li>
                    );
                  })}
                </ol>
              </nav>
            </div>
          </aside>

          <div className="min-w-0">
            <h1 className="text-balance font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-white">{t("Your account")}</h1>
            <p className="mt-2 max-w-2xl text-lg text-slate-700 dark:text-slate-300">{t("Live orders, your wallet, support and settings, all on this page.")}</p>

            <div className="mt-10 space-y-20">
              <Section id="b-now" title={t("Right now")}><Now demo={demo} showOrder={showOrder} showTicket={showTicket} /></Section>
              <Section id="b-orders" title={t("Orders")} count={demo.orders.length}>
                <Orders demo={demo} open={openOrder} setOpen={setOpenOrder} helpWith={helpWith} />
              </Section>
              <Section id="b-funds" title={t("Add funds")}><Funds demo={demo} /></Section>
              <Section id="b-support" title={t("Support")}
                action={!writing && <button type="button" onClick={() => setWriting({})} className={primary}><Plus aria-hidden className="h-4 w-4" />{t("New ticket")}</button>}>
                <Support demo={demo} open={openTicket} setOpen={setOpenTicket} writing={writing} setWriting={setWriting} showTicket={showTicket} showOrder={showOrder} />
              </Section>
              <Section id="b-profile" title={t("Profile")}><div className={`${card} p-6 sm:p-8`}><ProfileForm demo={demo} /></div></Section>
              <Section id="b-password" title={t("Password")}><div className={`${card} max-w-2xl p-6 sm:p-8`}><PasswordForm demo={demo} /></div></Section>
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}

function Section({ id, title, count, action, children }: { id: string; title: string; count?: number; action?: ReactNode; children: ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-h`} className="scroll-mt-36 lg:scroll-mt-24">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
        <h2 id={`${id}-h`} tabIndex={-1} className="flex items-center gap-2.5 font-display text-2xl font-bold tracking-tight text-slate-900 focus:outline-none dark:text-white">
          {title}{count != null && <span className="text-lg font-semibold tabular-nums text-slate-500 dark:text-slate-400">{count}</span>}
        </h2>
        {action}
      </div>
      {children}
    </section>
  );
}

// ---------- Right now: one list, the things that need you first ----------

function Now({ demo, showOrder, showTicket }: { demo: Demo; showOrder: (id: number) => void; showTicket: (id: number) => void }) {
  const t = useT();
  const f = useFmt();
  const rows: { key: string; tile: ReactNode; title: string; text: ReactNode; badge: BadgeKind; tail?: ReactNode; actions?: ReactNode }[] = [];
  const goOrder = (id: number) => <button type="button" onClick={() => showOrder(id)} className={`${smallBtn} border border-slate-300 text-slate-800 hover:bg-slate-50 dark:border-white/20 dark:text-slate-100 dark:hover:bg-white/5`}>{t("Open order")}</button>;

  demo.orders.filter((o) => demo.arrived.includes(o.id) && o.delivery.type === "number" && o.delivery.code).forEach((o) => {
    const d = o.delivery as Extract<AccountOrder["delivery"], { type: "number" }>;
    rows.push({ key: `c${o.id}`, tile: <ServiceTile service={o.service} />, title: t("Your {0} code is here", { 0: d.app }), badge: "delivered", text: <span dir="ltr">{d.number}</span>,
      tail: <span dir="ltr" className="font-mono text-2xl font-bold tracking-[0.18em] text-emerald-800 dark:text-emerald-300">{d.code}</span>,
      actions: <><CopyButton text={d.code!} label={t("Copy code")} showLabel />{goOrder(o.id)}</> });
  });
  demo.orders.filter((o) => o.state === "needs-you").forEach((o) => {
    const p = o.delivery.type === "progress" ? o.delivery.problem : undefined;
    rows.push({ key: `n${o.id}`, tile: <ServiceTile service={o.service} />, title: t("{0} is paused", { 0: t(o.title) }), badge: "needs-you", text: p ? `${t(p.title)}. ${t(p.text)}` : "",
      actions: <><button type="button" onClick={() => demo.resume(o.id)} className={`${smallBtn} bg-indigo-600 text-white hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-400`}>{t("It's public now, continue")}</button><CancelInline order={o} demo={demo} keepLabel="Keep it" label="Cancel for a refund" /></> });
  });
  demo.tickets.filter((x) => x.state === "replied").forEach((x) => {
    const last = x.messages[x.messages.length - 1];
    rows.push({ key: `t${x.id}`, tile: <span aria-hidden className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-indigo-100 text-indigo-800 dark:bg-indigo-400/15 dark:text-indigo-200"><MessageCircle className="h-5 w-5" /></span>,
      title: t(x.subject), badge: "replied", text: <span className="line-clamp-2">{last.name}: {t(last.text)}</span>,
      actions: <button type="button" onClick={() => showTicket(x.id)} className={`${smallBtn} bg-indigo-600 text-white hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-400`}>{t("Read and reply")}</button> });
  });
  demo.orders.filter((o) => laneOf(o) === "way").forEach((o) => {
    const d = o.delivery;
    const frac = o.state === "waiting" ? demo.clock.fraction : d.type === "progress" ? d.done / d.total : 0;
    rows.push({ key: `w${o.id}`, tile: <ServiceTile service={o.service} />, title: t(o.title), badge: o.state,
      text: <span className="block">{d.type === "number" ? <span dir="ltr">{d.number}</span> : d.type === "progress" ? t("{0} of {1} {2}", { 0: f.num(d.done), 1: f.num(d.total), 2: t(d.unit) }) : null}<Bar fraction={frac} className="mt-2 max-w-sm" /></span>,
      tail: o.state === "waiting" ? <span className="font-mono text-lg font-bold tabular-nums text-slate-900 dark:text-white">{demo.clock.text}</span> : undefined,
      actions: goOrder(o.id) });
  });
  demo.topUps.filter((p) => p.state === "on-hold").forEach((p) => {
    const c = demo.cardOf(p.card);
    rows.push({ key: p.id, tile: <span aria-hidden className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-slate-100 text-slate-700 dark:bg-white/10 dark:text-slate-200"><Plus className="h-5 w-5" /></span>,
      title: t("Top-up · {0}", { 0: f.money(p.amount) }), badge: "on-hold", text: t("Paid with {0}, which isn't on your account, so we're checking it. It's added once the check is done.", { 0: c ? `•••• ${c.last4}` : t("another card") }) });
  });

  if (!rows.length) return <div className={card}><Empty title={t("All quiet")} text={t("Live orders, fresh codes and support replies show up here.")} /></div>;
  return (
    <ul className={`${card} divide-y divide-slate-200 dark:divide-white/10`}>
      {rows.map((r) => (
        <li key={r.key} className="flex gap-4 p-5 sm:p-6">
          {r.tile}
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
              <span className="flex flex-wrap items-center gap-x-3 gap-y-1"><span className="font-semibold text-slate-900 dark:text-white">{r.title}</span><Badge kind={r.badge} /></span>
              {r.tail}
            </div>
            <div className="mt-1 text-[15px] text-slate-700 dark:text-slate-300">{r.text}</div>
            {r.actions && <div className="mt-3 flex flex-wrap gap-2">{r.actions}</div>}
          </div>
        </li>
      ))}
    </ul>
  );
}

// ---------- Orders: rows that unfold in place ----------

const groups = [
  { id: "all", label: "All" }, { id: "numbers", label: "Numbers" }, { id: "telegram", label: "Telegram" }, { id: "social", label: "Social" }, { id: "accounts", label: "Accounts" },
] as const;
const groupOf = (o: AccountOrder) => (o.kind === "number" ? "numbers" : o.kind === "social" ? "social" : o.kind === "telegram" ? "telegram" : "accounts");

function Orders({ demo, open, setOpen, helpWith }: { demo: Demo; open: number | null; setOpen: (id: number | null) => void; helpWith: (id: number) => void }) {
  const t = useT();
  const [group, setGroup] = useState<(typeof groups)[number]["id"]>("all");
  const [q, setQ] = useState("");
  const [all, setAll] = useState(false);
  const list = useMemo(() => {
    const s = q.trim().toLowerCase().replace(/^#/, "");
    return demo.orders.filter((o) => (group === "all" || groupOf(o) === group) && (!s || `${o.id} ${o.title} ${o.detail}`.toLowerCase().includes(s)));
  }, [demo.orders, group, q]);
  const shown = all || q || open ? list : list.slice(0, 6);
  return (
    <div>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div role="group" aria-label={t("Service")} className="flex flex-wrap gap-2">
          {groups.map((g) => {
            const on = group === g.id;
            return (
              <button key={g.id} type="button" aria-pressed={on} onClick={() => setGroup(g.id)}
                className={`rounded-full border px-3.5 py-1.5 text-sm font-semibold transition-colors ${on ? "border-indigo-600 bg-indigo-600 text-white dark:border-indigo-400 dark:bg-indigo-500" : "border-slate-300 text-slate-800 hover:border-slate-400 dark:border-white/20 dark:text-slate-100"} ${pageRing}`}>
                {on && <span className="sr-only">{t("Showing:")} </span>}{t(g.label)}
              </button>
            );
          })}
        </div>
        <label className="relative block sm:w-64">
          <span className="sr-only">{t("Search orders")}</span>
          <Search aria-hidden className="pointer-events-none absolute start-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder={t("Search orders")} className={`${field} !py-2.5 ps-10 caret-emerald-600`} />
        </label>
      </div>
      <ul className={`${card} divide-y divide-slate-200 overflow-hidden dark:divide-white/10`}>
        {shown.map((o) => <OrderRow key={o.id} o={o} demo={demo} open={open === o.id} toggle={() => setOpen(open === o.id ? null : o.id)} helpWith={helpWith} />)}
        {!shown.length && <li><Empty title={t("No orders match")} text={t("Try an order number, a phone number or a username.")} action={<button type="button" onClick={() => { setQ(""); setGroup("all"); }} className={secondary}><X aria-hidden className="h-4 w-4" />{t("Clear filters")}</button>} /></li>}
      </ul>
      {!all && !q && !open && list.length > shown.length && (
        <button type="button" onClick={() => setAll(true)} className={`${secondary} mt-4 w-full sm:w-auto`}>{t("Show all {0} orders", { 0: list.length })}</button>
      )}
    </div>
  );
}

function OrderRow({ o, demo, open, toggle, helpWith }: { o: AccountOrder; demo: Demo; open: boolean; toggle: () => void; helpWith: (id: number) => void }) {
  const t = useT();
  const f = useFmt();
  const line = useOrderLine();
  return (
    <li id={`b-order-${o.id}`} className="scroll-mt-36 lg:scroll-mt-24">
      <h3>
        <button id={`b-order-${o.id}-btn`} type="button" onClick={toggle} aria-expanded={open} aria-controls={`b-order-${o.id}-panel`}
          className="flex w-full items-center gap-4 px-5 py-4 text-start transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-emerald-600 sm:px-6 dark:hover:bg-white/[.03] dark:focus-visible:ring-emerald-400">
          <ServiceTile service={o.service} />
          <span className="min-w-0 flex-1">
            <span className="block truncate font-semibold text-slate-900 dark:text-white">{t(o.title)}</span>
            <span className="block truncate text-sm text-slate-600 dark:text-slate-400">{line(o, demo)}</span>
          </span>
          <span className="hidden text-end sm:block">
            <span className="block text-[15px] font-semibold tabular-nums text-slate-900 dark:text-white">{f.money(o.price)}</span>
            <span className="block text-sm text-slate-600 dark:text-slate-400">{f.when(o.at)}</span>
          </span>
          <Badge kind={o.state} className="hidden md:inline-flex" />
          <ChevronDown aria-hidden className={`h-5 w-5 shrink-0 text-slate-500 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
        </button>
      </h3>
      {open && (
        <div id={`b-order-${o.id}-panel`} className="animate-fade-up px-5 pb-6 [animation-duration:250ms] sm:px-6">
          <div className="flex flex-wrap items-center gap-2 pb-4 text-sm text-slate-600 md:hidden dark:text-slate-400"><Badge kind={o.state} />{f.money(o.price)} · {f.when(o.at)}</div>
          <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_17rem]">
            <div className={`${inner} p-5`}><Delivery order={o} demo={demo} /></div>
            <div className="space-y-5">
              <OrderSteps order={o} />
              <PaymentRows order={o} demo={demo} />
              <div className="grid gap-2">
                <Link href={buyAgainHref(o)} className={`${secondary} !py-3`}>{t("Buy again")}</Link>
                <button type="button" onClick={() => helpWith(o.id)} className={`${secondary} !py-3`}><MessageCircle aria-hidden className="h-4 w-4" />{t("Get help with this order")}</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </li>
  );
}

// ---------- Add funds ----------

function Funds({ demo }: { demo: Demo }) {
  const s = useTopUp(demo);
  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_20rem] xl:items-start">
      <form noValidate onSubmit={(e) => { e.preventDefault(); s.submit(); }} className={`${card} space-y-9 p-6 sm:p-8`}>
        <AmountPicker s={s} cols="grid-cols-2" />
        <CardPicker s={s} demo={demo} />
      </form>
      <aside className="xl:sticky xl:top-24"><TopUpSummary s={s} demo={demo} /></aside>
    </div>
  );
}

// ---------- Support: tickets unfold into the conversation ----------

function Support({ demo, open, setOpen, writing, setWriting, showTicket, showOrder }: {
  demo: Demo; open: number | null; setOpen: (id: number | null) => void; writing: { orderId?: number } | null; setWriting: (w: { orderId?: number } | null) => void;
  showTicket: (id: number) => void; showOrder: (id: number) => void;
}) {
  const t = useT();
  return (
    <div className="space-y-6">
      {writing && (
        <div className={`${card} animate-fade-up p-6 [animation-duration:250ms] sm:p-8`}>
          <h3 className="mb-6 font-display text-lg font-semibold text-slate-900 dark:text-white">{t("New ticket")}</h3>
          <NewTicketForm key={writing.orderId ?? "none"} demo={demo} orderId={writing.orderId} onDone={(id) => showTicket(id)} onCancel={() => setWriting(null)} />
        </div>
      )}
      <ul className={`${card} divide-y divide-slate-200 overflow-hidden dark:divide-white/10`}>
        {demo.tickets.map((x) => <TicketRow key={x.id} x={x} demo={demo} open={open === x.id} toggle={() => setOpen(open === x.id ? null : x.id)} showOrder={showOrder} />)}
      </ul>
    </div>
  );
}

function TicketRow({ x, demo, open, toggle, showOrder }: { x: Ticket; demo: Demo; open: boolean; toggle: () => void; showOrder: (id: number) => void }) {
  const t = useT();
  const f = useFmt();
  const last = x.messages[x.messages.length - 1];
  return (
    <li id={`b-ticket-${x.id}`} className="scroll-mt-36 lg:scroll-mt-24">
      <h3>
        <button id={`b-ticket-${x.id}-btn`} type="button" onClick={toggle} aria-expanded={open} aria-controls={`b-ticket-${x.id}-panel`}
          className="flex w-full items-center gap-4 px-5 py-4 text-start transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-emerald-600 sm:px-6 dark:hover:bg-white/[.03] dark:focus-visible:ring-emerald-400">
          <span className="min-w-0 flex-1">
            <span className="block font-semibold text-slate-900 dark:text-white">{t(x.subject)}</span>
            <span className="block text-sm text-slate-600 dark:text-slate-400">#{x.id} · {t(deptLabel(x.dept))} · {f.when(last.at)}</span>
          </span>
          <Badge kind={ticketBadge(x.state)} />
          <ChevronDown aria-hidden className={`h-5 w-5 shrink-0 text-slate-500 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
        </button>
      </h3>
      {open && (
        <div id={`b-ticket-${x.id}-panel`} className="animate-fade-up space-y-6 px-5 pb-6 [animation-duration:250ms] sm:px-6">
          {x.orderId && (
            <p className="text-sm text-slate-600 dark:text-slate-400">{t("About")}{" "}
              <button type="button" onClick={() => showOrder(x.orderId!)} className="rounded font-semibold text-indigo-700 underline-offset-4 hover:underline dark:text-indigo-300">{t("order #{0}", { 0: x.orderId })}</button>
            </p>
          )}
          <Thread ticket={x} />
          <div className="border-t border-slate-200 pt-6 dark:border-white/10"><ReplyBox ticket={x} demo={demo} /></div>
        </div>
      )}
    </li>
  );
}
