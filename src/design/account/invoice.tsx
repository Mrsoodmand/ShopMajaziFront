"use client";

import { useEffect, useMemo, useRef, useState, type ComponentType, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { Check, Clock, Printer, RotateCcw } from "lucide-react";
import { BrandMark, Wordmark } from "@/components/brand/Brand";
import { LocaleProvider, useT } from "@/i18n/client";
import { makeT } from "@/i18n/translate";
import type { AccountOrder } from "@/content/account-en";
import { cardShort, useAccountDemo, useFmt, type Fmt, type Store } from "./kit";

// Offers for the printable invoice (فاکتور) of one order, opened from the order's receipt in the account (Passbook).
// The sheet is always paper-white, whatever the site theme. Print hides everything on the page except the sheet
// (globals.css › .print-target), so the same button works here, in the gallery and on the live receipt.

// ---------- Data: one order as invoice lines ----------

export type Invoice = {
  no: number;
  issued: string; // ISO, when it was paid
  buyer: { name: string; mobile: string; email: string | null };
  item: { title: string; detail: string; amount: number };
  paid: { how: string; at: string };
  refund?: { amount: number; reason: string; at: string };
  net: number; // what the customer paid in the end
  state: AccountOrder["state"];
  payment: "paid" | "unpaid" | "refunded"; // the money only; where the delivery stands is not on an invoice
  // A cart order: every service as its own line (SheetD), refunds per line, and its number "C-12".
  lines?: { title: string; detail: string; amount: number }[];
  refunds?: { title: string; amount: number; reason: string }[];
  label?: string;
};

// One invoice for a cart order: the services bought together (AccountOrder.cart), each a line.
export function toCartInvoice(items: AccountOrder[], store: Store): Invoice {
  const cart = items[0].cart!;
  const c = cart.paidWith === "wallet" ? null : store.cardOf(cart.paidWith);
  const total = items.reduce((s, o) => s + o.price, 0);
  const refunds = items.filter((o) => o.refund).map((o) => ({ title: o.title, amount: o.refund!.amount, reason: o.refund!.reason }));
  const back = refunds.reduce((s, r) => s + r.amount, 0);
  return {
    no: cart.id, label: `C-${cart.id}`, issued: cart.at,
    buyer: store.user,
    item: { title: items[0].title, detail: items[0].detail, amount: total },
    lines: items.map((o) => ({ title: o.title, detail: o.detail, amount: o.price })),
    refunds,
    paid: { how: c ? cardShort(c) : "Wallet balance", at: cart.at },
    net: total - back,
    state: items[0].state,
    payment: back >= total ? "refunded" : "paid",
  };
}

export function toInvoice(o: AccountOrder, store: Store): Invoice {
  const c = o.paidWith === "wallet" ? null : store.cardOf(o.paidWith);
  return {
    no: o.id, issued: o.at,
    buyer: store.user,
    item: { title: o.title, detail: o.detail, amount: o.price },
    // An order support made: every line on its own, its note under it (never in the amount column).
    // An account with paid add-ons (o.bill): its plan, then each add-on, the same way.
    lines: (o.lines?.length ? o.lines : o.bill?.length ? o.bill : null)?.map((l) => ({ title: l.title, detail: l.note, amount: l.price })),
    paid: { how: c ? cardShort(c) : "Wallet balance", at: o.at },
    refund: o.refund,
    net: o.price - (o.refund?.amount ?? 0),
    state: o.state,
    payment: o.unpaid ? "unpaid" : o.refund ? "refunded" : "paid",
  };
}

// An order number as written, without a thousands separator.
const idOf = (n: number, locale: string) => n.toLocaleString(locale === "fa" ? "fa-IR" : "en-US", { useGrouping: false });

const SELLER = { site: "shopmajazi.com", email: "support@shopmajazi.com" };

// ---------- Amount in words (Persian and English) ----------

const faOnes = ["", "یک", "دو", "سه", "چهار", "پنج", "شش", "هفت", "هشت", "نه"];
const faTeens = ["ده", "یازده", "دوازده", "سیزده", "چهارده", "پانزده", "شانزده", "هفده", "هجده", "نوزده"];
const faTens = ["", "", "بیست", "سی", "چهل", "پنجاه", "شصت", "هفتاد", "هشتاد", "نود"];
const faHundreds = ["", "یکصد", "دویست", "سیصد", "چهارصد", "پانصد", "ششصد", "هفتصد", "هشتصد", "نهصد"];
const faScales = ["", "هزار", "میلیون", "میلیارد", "هزار میلیارد"];
function faThree(n: number) {
  const h = Math.floor(n / 100), r = n % 100, parts: string[] = [];
  if (h) parts.push(faHundreds[h]);
  if (r >= 10 && r < 20) parts.push(faTeens[r - 10]);
  else { if (r >= 20) parts.push(faTens[Math.floor(r / 10)]); if (r % 10) parts.push(faOnes[r % 10]); }
  return parts.join(" و ");
}
const enOnes = ["", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen"];
const enTens = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];
const enScales = ["", "thousand", "million", "billion", "trillion"];
function enThree(n: number) {
  const h = Math.floor(n / 100), r = n % 100, parts: string[] = [];
  if (h) parts.push(`${enOnes[h]} hundred`);
  if (r) parts.push(r < 20 ? enOnes[r] : `${enTens[Math.floor(r / 10)]}${r % 10 ? `-${enOnes[r % 10]}` : ""}`);
  return parts.join(" ");
}
export function inWords(v: number, locale: "fa" | "en") {
  let n = Math.round(Math.abs(v));
  if (!n) return locale === "fa" ? "صفر تومان" : "Zero Toman";
  const groups: string[] = [];
  for (let i = 0; n > 0; i++, n = Math.floor(n / 1000)) {
    const g = n % 1000;
    if (!g) continue;
    const w = locale === "fa" ? faThree(g) : enThree(g);
    groups.unshift([w, locale === "fa" ? faScales[i] : enScales[i]].filter(Boolean).join(" "));
  }
  if (locale === "fa") return `${groups.join(" و ")} تومان`;
  const s = groups.join(" ");
  return `${s[0].toUpperCase()}${s.slice(1)} Toman`;
}

// ---------- Shared bits ----------

const sheet = "mx-auto w-full max-w-[210mm] bg-white text-slate-900 shadow-[0_1px_2px_rgba(15,23,42,.06),0_12px_40px_-12px_rgba(15,23,42,.25)] print:max-w-none print:shadow-none";

// The payment status: paid (green), not paid (amber) or refunded (grey).
function usePaymentWord() {
  const t = useT();
  return (p: Invoice["payment"]) => ({ paid: t("Paid"), unpaid: t("Not paid"), refunded: t("Refunded") }[p]);
}

function Stamp({ inv, className = "" }: { inv: Invoice; className?: string }) {
  const word = usePaymentWord();
  const look = {
    paid: { Icon: Check, cls: "border-emerald-600 text-emerald-700" },
    unpaid: { Icon: Clock, cls: "border-amber-500 text-amber-700" },
    refunded: { Icon: RotateCcw, cls: "border-slate-400 text-slate-600" },
  }[inv.payment];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border-2 px-3 py-1 text-sm font-bold ${look.cls} ${className}`}>
      <look.Icon aria-hidden className="h-4 w-4" />{word(inv.payment)}
    </span>
  );
}

function Brand({ size = "md" }: { size?: "sm" | "md" }) {
  return (
    <span className={`flex items-center gap-2 ${size === "sm" ? "text-base" : "text-xl"}`}>
      <BrandMark className={size === "sm" ? "h-6 w-6" : "h-9 w-9"} /><Wordmark />
    </span>
  );
}

function Footnote({ f, inv, className = "" }: { f: Fmt; inv: Invoice; className?: string }) {
  const t = useT();
  return (
    <p className={`text-xs leading-relaxed text-slate-500 ${className}`}>
      {t("Issued online by ShopMajazi for order #{0} on {1}.", { 0: inv.label ?? inv.no, 1: f.date(inv.issued) })}{" "}
      {t("Questions about this invoice: {0}", { 0: SELLER.email })}
    </p>
  );
}

// ---------- A · Official ----------
// The Iranian sales-invoice layout people are used to: boxed seller and buyer, a ruled table with a row number,
// the total in figures and in words.

function SheetA({ inv }: { inv: Invoice }) {
  const t = useT();
  const f = useFmt();
  const cell = "border border-slate-400 px-3 py-2";
  const box = "rounded-none border border-slate-400";
  return (
    <article className={`${sheet} p-[12mm] text-[13px]`}>
      <header className="grid grid-cols-[1fr_auto_1fr] items-center gap-4 border-b-2 border-slate-900 pb-4">
        <Brand />
        <h1 className="text-center font-display text-2xl font-bold">{t("Sales invoice")}</h1>
        <dl className="justify-self-end text-sm">
          <div className="flex gap-2"><dt className="text-slate-600">{t("Invoice no.")}</dt><dd className="font-bold tabular-nums">{idOf(inv.no, t.locale)}</dd></div>
          <div className="flex gap-2"><dt className="text-slate-600">{t("Date")}</dt><dd className="font-bold">{f.date(inv.issued)}</dd></div>
        </dl>
      </header>

      <section className={`${box} mt-5`}>
        <h2 className="border-b border-slate-400 bg-slate-100 px-3 py-1.5 font-bold">{t("Seller")}</h2>
        <dl className="grid grid-cols-3 gap-x-6 gap-y-1 px-3 py-2.5">
          <div className="flex gap-2"><dt className="text-slate-600">{t("Name")}:</dt><dd className="font-semibold">{t("ShopMajazi")}</dd></div>
          <div className="flex gap-2"><dt className="text-slate-600">{t("Website")}:</dt><dd className="font-semibold" dir="ltr">{SELLER.site}</dd></div>
          <div className="flex gap-2"><dt className="text-slate-600">{t("Email")}:</dt><dd className="font-semibold" dir="ltr">{SELLER.email}</dd></div>
        </dl>
      </section>
      <section className={`${box} mt-3`}>
        <h2 className="border-b border-slate-400 bg-slate-100 px-3 py-1.5 font-bold">{t("Buyer")}</h2>
        <dl className="grid grid-cols-3 gap-x-6 gap-y-1 px-3 py-2.5">
          <div className="flex gap-2"><dt className="text-slate-600">{t("Name")}:</dt><dd className="font-semibold">{t(inv.buyer.name)}</dd></div>
          <div className="flex gap-2"><dt className="text-slate-600">{t("Mobile")}:</dt><dd className="font-semibold tabular-nums" dir="ltr">{inv.buyer.mobile}</dd></div>
          {inv.buyer.email && <div className="flex gap-2"><dt className="text-slate-600">{t("Email")}:</dt><dd className="truncate font-semibold" dir="ltr">{inv.buyer.email}</dd></div>}
        </dl>
      </section>

      <table className="mt-5 w-full border-collapse">
        <thead className="bg-slate-100">
          <tr>
            <th className={`${cell} w-12 text-center`}>{t("No.")}</th>
            <th className={`${cell} text-start`}>{t("Description")}</th>
            <th className={`${cell} w-16 text-center`}>{t("Qty")}</th>
            <th className={`${cell} w-36 text-center`}>{t("Unit price (Toman)")}</th>
            <th className={`${cell} w-36 text-center`}>{t("Amount (Toman)")}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className={`${cell} text-center tabular-nums`}>{f.num(1)}</td>
            <td className={cell}><span className="block font-semibold">{t(inv.item.title)}</span><span className="block text-slate-600">{t(inv.item.detail)}</span></td>
            <td className={`${cell} text-center tabular-nums`}>{f.num(1)}</td>
            <td className={`${cell} text-center tabular-nums`}>{f.num(inv.item.amount)}</td>
            <td className={`${cell} text-center tabular-nums`}>{f.num(inv.item.amount)}</td>
          </tr>
        </tbody>
        <tfoot>
          <tr><th colSpan={4} className={`${cell} text-end font-semibold`}>{t("Total")}</th><td className={`${cell} text-center font-semibold tabular-nums`}>{f.num(inv.item.amount)}</td></tr>
          {inv.refund && <tr><th colSpan={4} className={`${cell} text-end font-semibold`}>{t("Refunded to wallet")} <span className="font-normal text-slate-600">({t(inv.refund.reason)})</span></th><td className={`${cell} text-center font-semibold tabular-nums`}>−{f.num(inv.refund.amount)}</td></tr>}
          <tr className="bg-slate-100"><th colSpan={4} className={`${cell} text-end font-bold`}>{t("Amount paid")}</th><td className={`${cell} text-center text-[15px] font-bold tabular-nums`}>{f.num(inv.net)}</td></tr>
        </tfoot>
      </table>
      <p className={`${box} mt-3 px-3 py-2`}><span className="text-slate-600">{t("Amount in words")}: </span><b>{inWords(inv.net, t.locale === "fa" ? "fa" : "en")}</b></p>

      <section className="mt-3 grid grid-cols-3 gap-3">
        <dl className={`${box} px-3 py-2`}><dt className="text-slate-600">{t("Paid with")}</dt><dd className="font-semibold">{t(inv.paid.how)}</dd></dl>
        <dl className={`${box} px-3 py-2`}><dt className="text-slate-600">{t("Paid on")}</dt><dd className="font-semibold">{f.when(inv.paid.at)}</dd></dl>
        <dl className={`${box} flex items-center justify-center px-3 py-2`}><dt className="sr-only">{t("Payment")}</dt><dd><Stamp inv={inv} /></dd></dl>
      </section>
      <Footnote f={f} inv={inv} className="mt-8 border-t border-slate-300 pt-3 text-center" />
    </article>
  );
}

// ---------- B · Passbook ----------
// Same look as the account: a deep indigo head with the amount paid, then the receipt's money lines, dashed rules.

function SheetB({ inv }: { inv: Invoice }) {
  const t = useT();
  const f = useFmt();
  return (
    <article className={`${sheet} overflow-hidden rounded-3xl print:rounded-none`}>
      <header className="bg-indigo-950 px-[12mm] py-9 text-white">
        <div className="flex items-start justify-between gap-6">
          <span className="[&_*]:!text-white"><Brand /></span>
          <div className="text-end">
            <p className="text-sm text-indigo-200">{t("Invoice")}</p>
            <p className="font-display text-lg font-bold tabular-nums">#{idOf(inv.no, t.locale)}</p>
          </div>
        </div>
        <p className="mt-10 text-sm text-indigo-200">{inv.refund ? t("You paid in the end") : t("Amount paid")}</p>
        <p className="font-display text-5xl font-bold tabular-nums">{f.money(inv.net)}</p>
        <p className="mt-2 text-sm text-indigo-200">{f.when(inv.paid.at)} · {t(inv.paid.how)}</p>
      </header>
      <div className="px-[12mm] py-9">
        <div className="grid grid-cols-2 gap-8 text-sm">
          <div><p className="text-slate-500">{t("Billed to")}</p><p className="mt-1 font-semibold">{t(inv.buyer.name)}</p><p className="tabular-nums text-slate-700" dir="ltr">{inv.buyer.mobile}</p>{inv.buyer.email && <p className="text-slate-700" dir="ltr">{inv.buyer.email}</p>}</div>
          <div><p className="text-slate-500">{t("Issued by")}</p><p className="mt-1 font-semibold">{t("ShopMajazi")}</p><p className="text-slate-700" dir="ltr">{SELLER.site}</p><p className="text-slate-700" dir="ltr">{SELLER.email}</p></div>
        </div>
        <div className="mt-9 border-t border-dashed border-slate-300 pt-6">
          <div className="flex items-start justify-between gap-6">
            <div><p className="text-[15px] font-semibold">{t(inv.item.title)}</p><p className="text-sm text-slate-600">{t(inv.item.detail)}</p></div>
            <p className="text-[15px] font-semibold tabular-nums">{f.num(inv.item.amount)}</p>
          </div>
          {inv.refund && (
            <div className="mt-4 flex items-start justify-between gap-6">
              <div><p className="text-[15px] font-semibold">{t("Refund to wallet")}</p><p className="text-sm text-slate-600">{f.when(inv.refund.at)} · {t(inv.refund.reason)}</p></div>
              <p className="text-[15px] font-semibold tabular-nums text-emerald-700">−{f.num(inv.refund.amount)}</p>
            </div>
          )}
        </div>
        <div className="mt-6 flex items-end justify-between gap-6 border-t border-dashed border-slate-300 pt-5">
          <Stamp inv={inv} />
          <div className="text-end"><p className="text-sm text-slate-500">{t("Total")}</p><p className="font-display text-2xl font-bold tabular-nums">{f.money(inv.net)}</p></div>
        </div>
        <Footnote f={f} inv={inv} className="mt-12" />
      </div>
    </article>
  );
}

// ---------- C · Slip ----------
// A shop till slip: narrow, centred, dashed rules, the amount in words at the foot. Fits half a page or a phone screen.

function SheetC({ inv }: { inv: Invoice }) {
  const t = useT();
  const f = useFmt();
  const rule = "my-4 border-t-2 border-dashed border-slate-300";
  const Row = ({ k, v, strong }: { k: ReactNode; v: ReactNode; strong?: boolean }) => (
    <div className={`flex justify-between gap-4 ${strong ? "text-base font-bold" : ""}`}><span className={strong ? "" : "text-slate-600"}>{k}</span><span className="text-end tabular-nums">{v}</span></div>
  );
  return (
    <article className={`${sheet} !max-w-[88mm] px-7 py-8 font-mono text-[13px] print:!max-w-[88mm]`}>
      <div className="flex flex-col items-center gap-1 text-center font-sans">
        <Brand size="sm" />
        <p className="text-xs text-slate-500" dir="ltr">{SELLER.site}</p>
      </div>
      <hr className={rule} />
      <p className="text-center font-sans text-base font-bold">{t("Invoice")} #{idOf(inv.no, t.locale)}</p>
      <p className="text-center text-xs text-slate-500">{f.when(inv.issued)}</p>
      <hr className={rule} />
      <div className="space-y-1">
        <Row k={t("Buyer")} v={t(inv.buyer.name)} />
        <Row k={t("Mobile")} v={<span dir="ltr">{inv.buyer.mobile}</span>} />
      </div>
      <hr className={rule} />
      <p className="font-sans font-semibold">{t(inv.item.title)}</p>
      <div className="flex justify-between gap-4"><span className="text-slate-600">{t(inv.item.detail)}</span><span className="tabular-nums">{f.num(inv.item.amount)}</span></div>
      {inv.refund && <div className="mt-2 flex justify-between gap-4"><span className="text-slate-600">{t("Refund to wallet")}</span><span className="tabular-nums">−{f.num(inv.refund.amount)}</span></div>}
      <hr className={rule} />
      <Row strong k={t("Total")} v={f.money(inv.net)} />
      <p className="mt-2 font-sans text-xs text-slate-600">{inWords(inv.net, t.locale === "fa" ? "fa" : "en")}</p>
      <hr className={rule} />
      <div className="space-y-1">
        <Row k={t("Paid with")} v={t(inv.paid.how)} />
        <Row k={t("Payment")} v={usePaymentWord()(inv.payment)} />
      </div>
      <hr className={rule} />
      <p className="text-center font-sans text-xs text-slate-500">{t("Thank you for your order")}<br /><span dir="ltr">{SELLER.email}</span></p>
    </article>
  );
}

// ---------- D · Clean ----------
// Lots of white: the amount and a Paid mark first, then who and what in two columns, one line table, a green total.

function SheetD({ inv }: { inv: Invoice }) {
  const t = useT();
  const f = useFmt();
  return (
    <article className={`${sheet} rounded-2xl p-[14mm] print:rounded-none`}>
      <header className="flex items-start justify-between gap-6">
        <Brand />
        <div className="text-end text-sm">
          <p className="font-display text-3xl font-bold">{t("Invoice")}</p>
          <p className="mt-1 text-slate-500" dir="ltr">#{inv.label ?? idOf(inv.no, t.locale)} · {f.date(inv.issued)}</p>
        </div>
      </header>
      <div className="mt-14 flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="text-sm text-slate-500">{inv.payment === "unpaid" ? t("Amount due") : t("Amount paid")}</p>
          <p className="font-display text-4xl font-bold tabular-nums">{f.money(inv.net)}</p>
        </div>
        <Stamp inv={inv} />
      </div>
      <dl className="mt-12 grid grid-cols-3 gap-8 border-y border-slate-200 py-6 text-sm">
        <div><dt className="text-slate-500">{t("Billed to")}</dt><dd className="mt-1 font-semibold">{t(inv.buyer.name)}</dd><dd className="tabular-nums text-slate-600" dir="ltr">{inv.buyer.mobile}</dd></div>
        <div><dt className="text-slate-500">{t("Paid with")}</dt><dd className="mt-1 font-semibold">{t(inv.paid.how)}</dd><dd className="text-slate-600">{f.when(inv.paid.at)}</dd></div>
        <div><dt className="text-slate-500">{t("Issued by")}</dt><dd className="mt-1 font-semibold">{t("ShopMajazi")}</dd><dd className="text-slate-600" dir="ltr">{SELLER.email}</dd></div>
      </dl>
      <table className="mt-8 w-full text-sm">
        <thead><tr className="text-slate-500"><th className="pb-3 text-start font-medium">{t("Description")}</th><th className="pb-3 text-end font-medium">{t("Line amount")}</th></tr></thead>
        <tbody>
          {(inv.lines ?? [inv.item]).map((l, i) => (
            <tr key={i} className="border-t border-slate-200"><td className="py-4"><span className="block text-[15px] font-semibold">{t(l.title)}</span><span className="text-slate-600">{t(l.detail)}</span></td><td className="py-4 text-end align-top text-[15px] tabular-nums">{f.money(l.amount)}</td></tr>
          ))}
          {inv.refunds?.map((r, i) => <tr key={`r${i}`} className="border-t border-slate-200"><td className="py-4"><span className="block text-[15px] font-semibold">{t("Refund to wallet")} · {t(r.title)}</span><span className="text-slate-600">{t(r.reason)}</span></td><td className="py-4 text-end align-top text-[15px] tabular-nums">−{f.money(r.amount)}</td></tr>)}
          {inv.refund && <tr className="border-t border-slate-200"><td className="py-4"><span className="block text-[15px] font-semibold">{t("Refund to wallet")}</span><span className="text-slate-600">{t(inv.refund.reason)}</span></td><td className="py-4 text-end align-top text-[15px] tabular-nums">−{f.money(inv.refund.amount)}</td></tr>}
        </tbody>
      </table>
      <div className="mt-2 flex items-center justify-between rounded-xl bg-emerald-50 px-5 py-4">
        <span className="font-semibold text-emerald-900">{t("Total")}</span>
        <span className="font-display text-xl font-bold tabular-nums text-emerald-900">{f.money(inv.net)}</span>
      </div>
      <Footnote f={f} inv={inv} className="mt-16" />
    </article>
  );
}

// ---------- E · Bilingual ----------
// Persian and English on every line, whatever language the site is in: for showing a company or an embassy.

function SheetE({ inv }: { inv: Invoice }) {
  const f = useFmt();
  const fa = useMemo(() => makeT("fa"), []);
  const en = useMemo(() => makeT("en"), []);
  const n = (v: number) => Math.round(v).toLocaleString("en-US");
  const L = ({ k, className = "" }: { k: string; className?: string }) => (
    <span className={`flex flex-col ${className}`}><span className="w-fit font-semibold" dir="rtl" lang="fa">{fa(k)}</span><span className="w-fit text-[11px] uppercase tracking-wide text-slate-500" dir="ltr">{en(k)}</span></span>
  );
  const enDate = (iso: string) => new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric" }).format(new Date(iso));
  const faDate = (iso: string) => new Intl.DateTimeFormat("fa-IR", { day: "numeric", month: "long", year: "numeric" }).format(new Date(iso));
  const cell = "border-b border-slate-200 px-3 py-3";
  return (
    <article lang="en" className={`${sheet} mixed-lang p-[12mm] text-[13px]`}>
      <header className="flex items-start justify-between gap-6 border-b-4 border-indigo-900 pb-5" dir="ltr">
        <span className="flex items-center gap-2 text-xl"><BrandMark className="h-9 w-9" /><span className="flex flex-col leading-tight"><Wordmark locale="en" /><span lang="fa"><Wordmark locale="fa" className="text-base" /></span></span></span>
        <div className="text-end">
          <p className="font-display text-2xl font-bold">Invoice <span className="text-slate-400">·</span> <span dir="rtl" lang="fa">{fa("Invoice")}</span></p>
          <p className="mt-1 tabular-nums text-slate-600">No. {inv.no} · {enDate(inv.issued)}</p>
          <p className="tabular-nums text-slate-600" dir="rtl" lang="fa">{faDate(inv.issued)}</p>
        </div>
      </header>
      <div className="mt-6 grid grid-cols-2 gap-6" dir="ltr">
        <div className="rounded-xl bg-slate-50 p-4"><L k="Seller" /><p className="mt-2 font-semibold">ShopMajazi · <span lang="fa">{fa("ShopMajazi")}</span></p><p>{SELLER.site}</p><p>{SELLER.email}</p></div>
        <div className="rounded-xl bg-slate-50 p-4"><L k="Buyer" /><p className="mt-2 font-semibold">{inv.buyer.name}</p><p className="tabular-nums">{inv.buyer.mobile}</p>{inv.buyer.email && <p>{inv.buyer.email}</p>}</div>
      </div>
      <table className="mt-6 w-full" dir="ltr">
        <thead><tr className="bg-indigo-900 text-white [&_span]:!text-white">
          <th className="px-3 py-2 text-start"><L k="Description" /></th><th className="w-20 px-3 py-2 text-center"><L k="Qty" className="items-center" /></th><th className="w-44 px-3 py-2 text-end"><L k="Amount (Toman)" className="items-end" /></th>
        </tr></thead>
        <tbody>
          <tr>
            <td className={cell}><span className="block font-semibold">{inv.item.title}</span><span className="block text-slate-600">{inv.item.detail}</span><span className="mt-1 block text-slate-600" dir="rtl" lang="fa">{fa(inv.item.title)}</span></td>
            <td className={`${cell} text-center tabular-nums`}>1</td>
            <td className={`${cell} text-end tabular-nums`}>{n(inv.item.amount)}</td>
          </tr>
          {inv.refund && (
            <tr><td className={cell}><L k="Refund to wallet" /><span className="text-slate-600">{inv.refund.reason}</span></td><td className={cell} /><td className={`${cell} text-end tabular-nums`}>−{n(inv.refund.amount)}</td></tr>
          )}
        </tbody>
        <tfoot><tr><td className="px-3 pt-4" colSpan={2}><L k="Amount paid" /></td><td className="px-3 pt-4 text-end font-display text-xl font-bold tabular-nums">{n(inv.net)}</td></tr></tfoot>
      </table>
      <div className="mt-4 space-y-1 rounded-xl border border-slate-200 p-4">
        <p dir="ltr"><span className="text-slate-500">In words: </span><b>{inWords(inv.net, "en")}</b></p>
        <p dir="rtl" lang="fa"><span className="text-slate-500">{fa("Amount in words")}: </span><b>{inWords(inv.net, "fa")}</b></p>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-4" dir="ltr">
        <div><L k="Paid with" /><p className="mt-1">{inv.paid.how}</p></div>
        <div><L k="Paid on" /><p className="mt-1 tabular-nums">{new Intl.DateTimeFormat("en-GB", { dateStyle: "medium", timeStyle: "short" }).format(new Date(inv.paid.at))}</p></div>
        <div className="flex items-start justify-end"><Stamp inv={inv} /></div>
      </div>
      <p className="mt-10 border-t border-slate-200 pt-3 text-xs text-slate-500" dir="ltr">Issued online by ShopMajazi for order #{inv.no} on {enDate(inv.issued)}. Questions: {SELLER.email}</p>
      <div lang="fa" dir="rtl"><LocaleProvider locale="fa"><Footnote f={f} inv={inv} className="mt-1" /></LocaleProvider></div>
    </article>
  );
}

// ---------- Print button and the offer page ----------

// Marks the sheet as what to print, opens the print window (where "Save as PDF" keeps a file), then unmarks it.
export function usePrint() {
  const ref = useRef<HTMLDivElement>(null);
  const print = () => {
    const el = ref.current;
    if (!el) return;
    el.classList.add("print-target");
    const done = () => { el.classList.remove("print-target"); window.removeEventListener("afterprint", done); };
    window.addEventListener("afterprint", done);
    window.print();
  };
  return { ref, print };
}

const SAMPLES = [10484, 10472, 10487, 10477];
const UNPAID = -10484; // gallery only: order 10484 as if the bank payment hadn't gone through, to show "Not paid"

function inPage(Sheet: ComponentType<{ inv: Invoice }>) {
  return function Offer() {
    const t = useT();
    const demo = useAccountDemo();
    const [id, setId] = useState(SAMPLES[0]);
    const [lang, setLang] = useState<"fa" | "en">("fa");
    const found = demo.orders.find((o) => o.id === Math.abs(id)) ?? demo.orders[0];
    const order = id === UNPAID ? { ...found, unpaid: true } : found;
    const inv = toInvoice(order, demo);
    const { ref, print } = usePrint();
    return (
      <div className="min-h-screen bg-slate-200 px-4 py-8 dark:bg-slate-900 print:bg-white print:p-0">
        <div className="mx-auto mb-6 flex max-w-[210mm] flex-wrap items-center justify-between gap-3 print:hidden">
          <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
            {t("Sample order")}
            <select value={id} onChange={(e) => setId(Number(e.target.value))} className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-900 dark:border-white/15 dark:bg-slate-800 dark:text-white">
              {SAMPLES.map((s) => { const o = demo.orders.find((x) => x.id === s); return o && <option key={s} value={s}>#{s} · {t(o.title)}{o.refund ? ` (${t("Refunded")})` : ""}</option>; })}
              <option value={UNPAID}>#{-UNPAID} · {t("Not paid")}</option>
            </select>
          </label>
          <div className="flex items-center gap-3">
            <div role="group" aria-label="Language" className="flex rounded-xl border border-slate-300 bg-white p-1 text-sm dark:border-white/15 dark:bg-slate-800">
              {(["fa", "en"] as const).map((l) => <button key={l} type="button" aria-pressed={lang === l} onClick={() => setLang(l)} className={`rounded-lg px-3 py-1.5 ${lang === l ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900" : "text-slate-700 dark:text-slate-300"}`}>{l === "fa" ? "فارسی" : "English"}</button>)}
            </div>
            <span className="hidden text-sm text-slate-600 sm:inline dark:text-slate-400">{t("To keep a file, choose “Save as PDF” in the print window.")}</span>
            <button type="button" onClick={print} className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2">
              <Printer aria-hidden className="h-4 w-4" />{t("Print invoice")}
            </button>
          </div>
        </div>
        <div ref={ref} dir={lang === "fa" ? "rtl" : "ltr"} lang={lang}><LocaleProvider locale={lang}><Sheet inv={inv} /></LocaleProvider></div>
      </div>
    );
  };
}

// The button on an order's receipt (chosen design D, 2026-11-14). The sheet sits at the end of <body>, hidden on
// screen and in an ordinary page print; the button marks it .print-target so only it prints.
// `items`: a cart order's services, printed as one invoice (toCartInvoice) instead of `order` alone.
export function PrintInvoice({ order, store, className = "", items }: { order: AccountOrder; store: Store; className?: string; items?: AccountOrder[] }) {
  const t = useT();
  const { ref, print } = usePrint();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return (
    <>
      <button type="button" onClick={print} className={className}><Printer aria-hidden className="h-4 w-4" />{t("Print invoice")}</button>
      {mounted && createPortal(<div ref={ref} className="print-only" aria-hidden><SheetD inv={items?.length ? toCartInvoice(items, store) : toInvoice(order, store)} /></div>, document.body)}
    </>
  );
}

export const InvoiceA = inPage(SheetA);
export const InvoiceB = inPage(SheetB);
export const InvoiceC = inPage(SheetC);
export const InvoiceD = inPage(SheetD);
export const InvoiceE = inPage(SheetE);
export { SheetA, SheetB, SheetC, SheetD, SheetE };
