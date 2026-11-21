"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { AccountOrder, BankCard, Dept, Ticket } from "@/content/account-en";
import type { Clock, Line, Store } from "@/design/account/kit";
import { useT } from "@/i18n/client";
import { accountApi, accountForm, ApiError, useAccount } from "./account";

// The live account behind /account (design "Passbook"): Laravel's Api\StorefrontPanelController, turned into the
// Store the design's components run on. Numbers waiting for their SMS are polled through the existing
// virtual-numbers/orders/{id} endpoint, which also refunds them when they expire.

type Named = { fa: string; en: string; slug?: string } | null;
type ApiCard = { first6: string; last4: string } | null;
type ApiOrder = {
  id: number; type: number; kind: AccountOrder["kind"]; state: AccountOrder["state"]; price: number;
  paid_with: "wallet" | "card" | "outside"; card: ApiCard; at: string; updated_at: string | null;
  refund: { amount: number; at: string | null } | null;
  cart?: { id: number; paid_with: "wallet" | "card"; card: ApiCard; total: number; at: string } | null;
  name: Named; sub: Named; number: string | null; code: string | null; seconds_left: number; count: number | null;
  plan?: string | null; custom?: boolean;
  // What the order still asks for (an order support made, tax, VAT…) and whether the buyer may cancel it.
  charges?: { id: number; kind: "order" | "extra"; title: string; price: number; paid: boolean; at: string | null }[];
  due?: number; cancellable?: boolean; night_call?: boolean | null;
  lines?: { title: string; note: string; price: number }[]; // an order support made (kind "custom")
  bill?: { title: string; note: string; price: number }[]; // an account with paid add-ons: invoice lines
  fields?: { label: string; value: string; secret?: boolean; raw?: boolean }[];
  product_id?: number | null; review?: { state: "open" | "sent" } | null;
};
type ApiLine = { id: number; kind: Line["kind"]; amount: number; balance: number | null; held: boolean; order_id: number | null; card: ApiCard; at: string };
type ApiMessage = { from: "you" | "support"; name: string | null; at: string; text: string; file: string | null };
type ApiTicket = { id: number; subject: string; dept: Dept; order_id: number | null; state: Ticket["state"]; unread: boolean; updated_at: string; last: ApiMessage | null; messages: ApiMessage[] | null };
type Panel = {
  user: { name: string; mobile: string; email: string | null; since: string | null };
  wallet: number; cards: { id: string; first6: string; last4: string }[];
  statement: ApiLine[]; orders: ApiOrder[]; tickets: ApiTicket[]; top_up: { min: number; max: number };
};
type NumberPoll = { order: { id: number; status: "waiting" | "received" | "expired" | "cancelled"; code: string | null; seconds_left: number }; wallet: number };

// Iranian card prefixes → bank, for "Bank Melli •••• 1234".
const BANKS: [string[], string, string][] = [
  [["603799"], "Bank Melli", "بانک ملی"], [["589210"], "Bank Sepah", "بانک سپه"], [["610433", "991975"], "Bank Mellat", "بانک ملت"],
  [["603769"], "Bank Saderat", "بانک صادرات"], [["627353", "585983"], "Bank Tejarat", "بانک تجارت"], [["589463"], "Refah Bank", "بانک رفاه"],
  [["603770", "639217"], "Keshavarzi Bank", "بانک کشاورزی"], [["628023"], "Bank Maskan", "بانک مسکن"], [["627760"], "Post Bank", "پست بانک"],
  [["622106", "627884", "639194"], "Parsian Bank", "بانک پارسیان"], [["502229", "639347"], "Bank Pasargad", "بانک پاسارگاد"],
  [["621986"], "Saman Bank", "بانک سامان"], [["627412"], "EN Bank", "بانک اقتصاد نوین"], [["627488", "502910"], "Karafarin Bank", "بانک کارآفرین"],
  [["639346"], "Sina Bank", "بانک سینا"], [["639607"], "Sarmayeh Bank", "بانک سرمایه"], [["636214"], "Ayandeh Bank", "بانک آینده"],
  [["502806", "504706"], "Shahr Bank", "بانک شهر"], [["502938"], "Day Bank", "بانک دی"], [["505785"], "Iran Zamin Bank", "بانک ایران زمین"],
  [["505416"], "Gardeshgari Bank", "بانک گردشگری"], [["606373"], "Mehr Iran Bank", "بانک مهر ایران"], [["504172"], "Resalat Bank", "بانک رسالت"],
  [["627648", "207177"], "Tose'e Saderat Bank", "بانک توسعه صادرات"], [["627961"], "Industry & Mine Bank", "بانک صنعت و معدن"],
  [["502908"], "Tose'e Ta'avon Bank", "بانک توسعه تعاون"], [["606256"], "Melal Credit", "موسسه ملل"], [["507677"], "Noor Credit", "موسسه نور"],
  [["628157"], "Tose'e Credit", "موسسه اعتباری توسعه"], [["636795"], "Central Bank", "بانک مرکزی"], [["585947"], "Middle East Bank", "بانک خاورمیانه"],
];
const bankName = (first6: string, fa: boolean) => {
  const b = BANKS.find(([bins]) => bins.includes(first6));
  return b ? (fa ? b[2] : b[1]) : fa ? "کارت بانکی" : "Bank card";
};
const cardKey = (c: { first6: string; last4: string }) => `m:${c.first6}:${c.last4}`;

const NUMBER_MINUTES = 20;
// Seconds from purchase to expiry: what's left plus what has gone by (at least what's left, if clocks differ).
const windowOf = (left: number, at: string) => Math.max(left, left + Math.round((Date.now() - Date.parse(at)) / 1000), 1);
const POLL_MS = 5000;

export type LiveAccount = Store & { status: "loading" | "ready" | "guest" | "error"; reload: () => Promise<void>; signOut: () => Promise<void> };

export function useLiveAccount(): LiveAccount {
  const t = useT();
  const fa = t.locale === "fa";
  const account = useAccount();
  const [panel, setPanel] = useState<Panel | null>(null);
  const [status, setStatus] = useState<LiveAccount["status"]>("loading");
  const [details, setDetails] = useState<Record<number, ApiOrder["fields"]>>({});
  const [threads, setThreads] = useState<Record<number, ApiMessage[]>>({});
  const [arrived, setArrived] = useState<number[]>([]);
  // Time left on waiting numbers: seconds the server reported, and when.
  // `total`: the whole window (seconds from purchase to expiry), so the bar shows the real share left.
  const [timers, setTimers] = useState<Record<number, { left: number; at: number; total: number }>>({});
  const [now, setNow] = useState(() => Date.now());

  const fail = useCallback((e: unknown, fallback: string): never => {
    const code = e instanceof ApiError ? e.code : "";
    const known: Record<string, string> = {
      wrong_password: "Your current password is wrong.", password_invalid: "This new password isn't accepted.",
      name_invalid: "Use a name of 3 to 40 letters.", subject_invalid: "Keep the subject under 150 characters",
      text_invalid: "Tell us what happened", file_invalid: "Attach a PNG, JPG or BMP image up to 2 MB",
      order_invalid: "Choose the order this is about", amount_invalid: "Choose or enter an amount",
      card_invalid: "Enter the card you'll pay with", bank_unavailable: "Couldn't reach the bank. Please try again.",
      busy: "Too many tries. Wait a moment and try again.", auth: "You were signed out. Sign in again to continue.",
    };
    if (code === "auth") setStatus("guest");
    const msg = known[code] ? t(known[code]) : code === "cancel_failed" || code === "bank_blocked" ? (e as Error).message : t(fallback);
    throw new Error(msg);
  }, [t]);

  const reload = useCallback(async () => {
    try {
      const p = await accountApi<Panel>("panel");
      setPanel(p);
      setStatus("ready");
      account.setWallet(p.wallet);
      const tm: Record<number, { left: number; at: number; total: number }> = {};
      for (const o of p.orders) if (o.state === "waiting") tm[o.id] = { left: o.seconds_left, at: Date.now(), total: windowOf(o.seconds_left, o.at) };
      setTimers(tm);
    } catch (e) {
      setStatus(e instanceof ApiError && e.code === "auth" ? "guest" : "error");
    }
  }, [account.setWallet]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (account.status === "guest") setStatus("guest");
    if (account.status === "user") reload();
  }, [account.status, reload]);

  // Waiting numbers: a clock every second, and a poll for the code every few seconds.
  const waiting = useMemo(() => (panel?.orders ?? []).filter((o) => o.state === "waiting").map((o) => o.id), [panel]);
  useEffect(() => {
    if (!waiting.length) return;
    const tick = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(tick);
  }, [waiting.length]);
  const polling = useRef(false);
  useEffect(() => {
    if (!waiting.length) return;
    const poll = async () => {
      if (polling.current || document.hidden) return;
      polling.current = true;
      try {
        for (const id of waiting) {
          const r = await accountApi<NumberPoll>(`virtual-numbers/orders/${id}`);
          if (r.order.status === "waiting") {
            setTimers((m) => ({ ...m, [id]: { left: r.order.seconds_left, at: Date.now(), total: m[id]?.total ?? r.order.seconds_left } }));
          } else {
            if (r.order.status === "received") setArrived((a) => (a.includes(id) ? a : [...a, id]));
            await reload(); // code, refund and statement lines all change
            break;
          }
        }
      } catch { /* try again on the next tick */ } finally { polling.current = false; }
    };
    const id = setInterval(poll, POLL_MS);
    return () => clearInterval(id);
  }, [waiting, reload]);

  const cardOf = useCallback((id: string): BankCard | undefined => {
    const saved = panel?.cards.find((c) => c.id === id);
    const m = saved ?? (id.startsWith("m:") ? { first6: id.split(":")[1], last4: id.split(":")[2] } : null);
    return m ? { id, bank: bankName(m.first6, fa), first6: m.first6, last4: m.last4 } : undefined;
  }, [panel, fa]);

  const orders = useMemo<AccountOrder[]>(() => (panel?.orders ?? []).map((o) => toOrder(o, details[o.id], t, fa)), [panel, details, t, fa]);
  const byId = useMemo(() => new Map(orders.map((o) => [o.id, o])), [orders]);

  const statement = useMemo<Line[]>(() => (panel?.statement ?? []).map((l) => {
    const o = l.order_id ? byId.get(l.order_id) : undefined;
    const card = l.card ? cardKey(l.card) : "";
    const base = { key: `p${l.id}`, at: l.at, kind: l.kind, amount: l.amount, balance: l.balance, held: l.held, orderId: l.order_id ?? undefined };
    if (l.kind === "top-up") return { ...base, title: "Top-up", sub: card };
    if (l.kind === "refund") return { ...base, title: "Refund", sub: o ? o.title : t("Returned to your wallet") };
    if (l.kind === "commission") return { ...base, orderId: undefined, title: "Referral commission", sub: l.order_id ? t("From order #{0}", { 0: l.order_id }) : "" };
    return { ...base, orderId: o ? l.order_id ?? undefined : undefined, title: o?.title ?? t("Order #{0}", { 0: l.order_id ?? "" }), sub: l.kind === "card" ? card : o?.detail ?? "" };
  }), [panel, byId, t]);

  const tickets = useMemo<Ticket[]>(() => (panel?.tickets ?? []).map((x) => {
    const msgs = threads[x.id] ?? x.messages ?? (x.last ? [x.last] : []);
    return {
      id: x.id, subject: x.subject, dept: x.dept, orderId: x.order_id ?? undefined, state: x.state,
      messages: msgs.map((m) => ({ from: m.from, name: m.name ?? undefined, at: m.at, text: m.text, file: m.file ?? undefined })),
    };
  }), [panel, threads]);

  const clockOf = useCallback((o: AccountOrder): Clock => {
    const tm = timers[o.id];
    const ms = tm ? Math.max(0, tm.left * 1000 - (now - tm.at)) : 0;
    return { msLeft: ms, text: `${String(Math.floor(ms / 60000)).padStart(2, "0")}:${String(Math.floor((ms % 60000) / 1000)).padStart(2, "0")}`, fraction: tm ? ms / (tm.total * 1000) : 0 };
  }, [timers, now]);

  const putTicket = (x: ApiTicket) => {
    setPanel((p) => p && { ...p, tickets: [x, ...p.tickets.filter((k) => k.id !== x.id)] });
    if (x.messages) setThreads((m) => ({ ...m, [x.id]: x.messages! }));
  };
  const form = (fields: Record<string, string | number | undefined>, file?: File) => {
    const fd = new FormData();
    for (const [k, v] of Object.entries(fields)) if (v !== undefined) fd.append(k, String(v));
    if (file) fd.append("file", file);
    return fd;
  };

  const store: Store = {
    live: true,
    orders, statement, tickets, arrived, clockOf, cardOf,
    cards: (panel?.cards ?? []).map((c) => cardOf(c.id)!).filter(Boolean),
    wallet: panel?.wallet ?? 0,
    user: { name: panel?.user.name ?? "", mobile: panel?.user.mobile ?? "", email: panel?.user.email ?? null, since: panel?.user.since ?? "" },
    limits: panel?.top_up ?? { min: 10_000, max: 50_000_000 },
    cancel: async (id) => {
      try { await accountApi(`virtual-numbers/orders/${id}/cancel`, {}); } catch (e) { fail(e, "Couldn't cancel. Please try again."); }
      await reload();
    },
    payOrder: async (id, method) => {
      try {
        const r = await accountApi<{ url?: string }>(`panel/orders/${id}/pay`, { method, return: window.location.pathname });
        if (r?.url) { window.location.assign(r.url); return; }
      } catch (e) { fail(e, "Payment didn't go through. Please try again."); }
      await reload();
    },
    cancelOrder: async (id) => {
      try { await accountApi(`panel/orders/${id}/cancel`, {}); } catch (e) { fail(e, "Couldn't cancel. Please try again."); }
      await reload();
    },
    reply: async (id, text, file) => {
      try { putTicket((await accountForm<{ ticket: ApiTicket }>(`panel/tickets/${id}/reply`, form({ text }, file))).ticket); }
      catch (e) { fail(e, "Your reply wasn't sent. Please try again."); }
    },
    closeTicket: async (id) => {
      try { putTicket((await accountApi<{ ticket: ApiTicket }>(`panel/tickets/${id}/close`, {})).ticket); }
      catch (e) { fail(e, "Something went wrong. Please try again."); }
    },
    openTicket: async (x) => {
      try {
        const r = await accountForm<{ ticket: ApiTicket }>("panel/tickets", form({ dept: x.dept, order_id: x.orderId, subject: x.subject, text: x.text }, x.file));
        putTicket(r.ticket);
        return r.ticket.id;
      } catch (e) { return fail(e, "Your ticket wasn't sent. Please try again."); }
    },
    topUp: async (amount, cardId, _newCard, cardNumber) => {
      try {
        const back = { return: window.location.pathname };
        const r = await accountApi<{ url: string }>("panel/top-up", cardNumber ? { amount, card_number: cardNumber, ...back } : { amount, card_id: cardId, ...back });
        window.location.assign(r.url);
      } catch (e) { fail(e, "Couldn't reach the bank. Please try again."); }
    },
    saveName: async (name) => {
      try {
        const r = await accountApi<{ name: string }>("panel/profile", { name });
        setPanel((p) => p && { ...p, user: { ...p.user, name: r.name } });
        account.refresh();
      } catch (e) { fail(e, "Something went wrong. Please try again."); }
    },
    changePassword: async (current, password) => {
      try { await accountApi("panel/password", { current, password }); } catch (e) { fail(e, "Something went wrong. Please try again."); }
    },
    loadOrder: useCallback((id: number) => {
      accountApi<{ order: ApiOrder }>(`panel/orders/${id}`).then((r) => setDetails((d) => ({ ...d, [id]: r.order.fields ?? [] }))).catch(() => setDetails((d) => ({ ...d, [id]: [] })));
    }, []),
    loadTicket: useCallback((id: number) => {
      accountApi<{ ticket: ApiTicket }>(`panel/tickets/${id}`).then((r) => {
        setThreads((m) => ({ ...m, [id]: r.ticket.messages ?? [] }));
        setPanel((p) => p && { ...p, tickets: p.tickets.map((k) => (k.id === id ? { ...k, unread: false } : k)) });
      }).catch(() => {});
    }, []),
  };

  return { ...store, status, reload, signOut: account.signOut };
}

// One API order → the design's order, with titles in the visitor's language.
function toOrder(o: ApiOrder, fields: ApiOrder["fields"] | undefined, t: ReturnType<typeof useT>, fa: boolean): AccountOrder {
  const nm = (n: Named) => (n ? (fa ? n.fa : n.en) : "");
  const name = nm(o.name);
  const sub = nm(o.sub);
  const paidWith = o.paid_with === "outside" ? "outside" : o.paid_with === "card" && o.card ? cardKey(o.card) : o.paid_with === "card" ? "m:000000:····" : "wallet";
  const refund = o.refund ? { amount: o.refund.amount, reason: o.kind === "number" ? "Cancelled or expired before a code arrived" : "Order not completed", at: o.refund.at ?? o.updated_at ?? o.at } : undefined;
  const deliveredAt = o.state === "delivered" ? o.updated_at ?? undefined : undefined;
  const cart = o.cart ? { id: o.cart.id, at: o.cart.at, paidWith: o.cart.paid_with === "card" && o.cart.card ? cardKey(o.cart.card) : o.cart.paid_with === "card" ? "m:000000:····" : "wallet" } : undefined;
  const charges = (o.charges ?? []).map((c) => ({ ...c, at: c.at ?? o.at }));
  const base = { id: o.id, price: o.price, paidWith, at: o.at, state: o.state, refund, deliveredAt, cart, charges, due: o.due ?? 0, cancellable: !!o.cancellable, nightCall: o.night_call ?? null, review: o.review ?? null, bill: o.bill };

  if (o.kind === "number") {
    return {
      ...base, kind: "number", service: o.name?.en ?? "", title: name ? t("{0} number", { 0: name }) : t("Virtual number"),
      detail: [sub, o.number ? `⁦${o.number}⁩` : ""].filter(Boolean).join(" · "),
      delivery: { type: "number", app: name, country: sub, number: o.number ?? "", code: o.code ?? undefined, codeAt: o.code ? deliveredAt : undefined, minutes: NUMBER_MINUTES },
    };
  }
  const notes: Record<string, string> = {
    delivering: "We're preparing this order. What it hands over shows here once it's ready.",
    "awaiting-payment": "Support made this order for you. Pay it and support starts right away.",
    "needs-you": "Support paused this order and needs something from you. Check your tickets, or write to support about it.",
    delivered: o.kind === "google-voice" ? "Sign in at voice.google.com. Use the number now and then so Google keeps it active."
      : o.kind === "apple-id" ? "Change the password after you sign in, and keep the security answers somewhere safe."
      : "Delivered. These are the details you gave us with the order.",
  };
  const rows = (fields ?? []).map((f) => ({ label: f.raw ? f.label : t(f.label.replace(/ \d+$/, "")) + (/ \d+$/.test(f.label) ? ` ${t.num(Number(f.label.split(" ").pop()))}` : ""), value: f.value, secret: f.secret }));
  const delivery = { type: "details" as const, fields: rows, note: notes[o.state] ?? "", loading: fields === undefined };
  const plan = o.plan ?? (o.count ? t("{0} items", { 0: t.num(o.count) }) : "");

  switch (o.kind) {
    case "social": {
      const telegram = (o.sub?.slug ?? "").includes("telegram") || /telegram/i.test(o.sub?.en ?? "");
      return { ...base, kind: telegram ? "telegram" : "social", service: o.sub?.en ?? name, title: name || t("Social media service"), detail: [plan, sub].filter(Boolean).join(" · "), delivery };
    }
    case "apple-id":
      return { ...base, kind: "apple-id", service: "Apple", title: o.custom ? t("Apple ID · made for you") : t("Apple ID"), detail: o.count && o.count > 1 ? t("{0} accounts", { 0: t.num(o.count) }) : t("1 account"), delivery };
    case "google-voice":
      return { ...base, kind: "google-voice", service: "Google Voice", title: t("Google Voice number"), detail: o.number ? `⁦${o.number}⁩` : "", delivery };
    case "custom":
      // Titled by its number («سفارش #2552»): its lines are listed on the order page and the invoice.
      return { ...base, kind: "custom", service: "Custom order", title: t("Order #{0}", { 0: t.num(o.id, { useGrouping: false }) }), detail: t("Made for you by support"), lines: o.lines ?? [], delivery: { ...delivery, loading: false } };
    case "static-ip":
      return { ...base, kind: "static-ip", service: "Static IP", title: t("Static IP"), detail: "", delivery };
    default:
      return { ...base, kind: "subscription", service: o.name?.en ?? name, title: name || t("Subscription"), detail: plan, delivery };
  }
}
