"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import {
  ShoppingBag, ShoppingCart, X, Trash2, Plus, Minus, Wallet, CreditCard, Lock, Check, ChevronLeft, Info,
  Instagram, Sparkles, Apple, Phone, Youtube, Receipt, ArrowLeft,
} from "lucide-react";
import { LocaleProvider, useT } from "@/i18n/client";
import { toman } from "@/i18n/translate";

// Offers for the shopping cart (plan: side-session-notes/…/cart-plan.md). Each offer shows the same story in a
// framed page: a header with the cart button, a product card with "Add to cart" next to "Buy now", and the cart
// itself with the lines, the total and Wallet / Card. Sample data only; everything happens inside the frame.

// ---------- Sample cart ----------

type Kind = "service" | "subscription" | "apple" | "gv";
type Line = { id: number; kind: Kind; title: string; detail: string; price: number; qty?: number; note?: string };

const START: Line[] = [
  { id: 1, kind: "service", title: "Instagram followers", detail: "1,000 · @shop.majazi", price: 250000 },
  { id: 2, kind: "subscription", title: "ChatGPT Plus", detail: "1 month · on your account", price: 1850000 },
  { id: 3, kind: "apple", title: "Apple ID · ready", detail: "Delivered at once", price: 450000, qty: 2 },
];
const ADD: Line = { id: 4, kind: "gv", title: "Google Voice number", detail: "+1 (415) 555‑0142", price: 1200000, note: "Not held until you pay" };
const PRODUCT = { kind: "service" as Kind, title: "YouTube views", detail: "5,000 views", price: 380000 };
const WALLET = 2000000;

const KIND_ICON: Record<Kind, { icon: typeof Instagram; tone: string }> = {
  service: { icon: Instagram, tone: "bg-pink-50 text-pink-600 dark:bg-pink-500/10 dark:text-pink-300" },
  subscription: { icon: Sparkles, tone: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-300" },
  apple: { icon: Apple, tone: "bg-slate-100 text-slate-700 dark:bg-white/10 dark:text-slate-200" },
  gv: { icon: Phone, tone: "bg-sky-50 text-sky-600 dark:bg-sky-500/10 dark:text-sky-300" },
};

const focus = "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 dark:focus-visible:outline-emerald-400";
const primary = `flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-5 py-3.5 font-semibold text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-700 disabled:opacity-40 ${focus}`;
const ghost = `flex items-center justify-center gap-2 rounded-2xl px-5 py-3.5 font-semibold text-slate-700 ring-1 ring-slate-200 transition hover:bg-slate-50 dark:text-slate-200 dark:ring-white/15 dark:hover:bg-white/5 ${focus}`;

const lineTotal = (l: Line) => l.price * (l.qty ?? 1);

function useCartDemo() {
  const [lines, setLines] = useState<Line[]>(START);
  const [pulse, setPulse] = useState(0);
  const [paid, setPaid] = useState<null | "wallet" | "card">(null);
  const nextId = useRef(10);
  const add = () => {
    setLines((ls) => [...ls, { ...(ls.some((l) => l.kind === "gv") ? { ...PRODUCT, kind: "service" as Kind } : ADD), id: nextId.current++ }]);
    setPulse((p) => p + 1);
  };
  const remove = (id: number) => setLines((ls) => ls.filter((l) => l.id !== id));
  const step = (id: number, d: number) => setLines((ls) => ls.map((l) => (l.id === id && l.qty ? { ...l, qty: Math.max(1, Math.min(10, l.qty + d)) } : l)));
  const total = lines.reduce((s, l) => s + lineTotal(l), 0);
  const count = lines.reduce((s, l) => s + (l.qty ?? 1), 0);
  return { lines, add, remove, step, total, count, pulse, paid, setPaid, reset: () => { setLines(START); setPaid(null); } };
}
type Cart = ReturnType<typeof useCartDemo>;

function useMoneyT() {
  const t = useT();
  return { t, m: (n: number) => toman(n, t.locale), n: (n: number) => t.num(n) };
}

// ---------- Shared pieces ----------

function Tile({ kind, className = "h-11 w-11" }: { kind: Kind; className?: string }) {
  const { icon: Icon, tone } = KIND_ICON[kind];
  return <span className={`grid shrink-0 place-items-center rounded-xl ${tone} ${className}`}><Icon className="h-5 w-5" /></span>;
}

function Qty({ l, c }: { l: Line; c: Cart }) {
  const { t, n } = useMoneyT();
  if (!l.qty) return null;
  return (
    <span className="inline-flex items-center rounded-full ring-1 ring-slate-200 dark:ring-white/15">
      <button type="button" aria-label={t("One less")} onClick={() => c.step(l.id, -1)} className={`grid h-7 w-7 place-items-center rounded-full text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/10 ${focus}`}><Minus className="h-3.5 w-3.5" /></button>
      <span className="w-6 text-center text-sm tabular-nums text-slate-900 dark:text-white">{n(l.qty)}</span>
      <button type="button" aria-label={t("One more")} onClick={() => c.step(l.id, 1)} className={`grid h-7 w-7 place-items-center rounded-full text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/10 ${focus}`}><Plus className="h-3.5 w-3.5" /></button>
    </span>
  );
}

function RowLine({ l, c, compact = false }: { l: Line; c: Cart; compact?: boolean }) {
  const { t, m } = useMoneyT();
  return (
    <li className="flex items-start gap-3 py-3.5 animate-step-in">
      <Tile kind={l.kind} className={compact ? "h-9 w-9" : "h-11 w-11"} />
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <span className="font-semibold text-slate-900 dark:text-white">{t(l.title)}</span>
          <span className="shrink-0 text-sm font-semibold tabular-nums text-slate-900 dark:text-white">{m(lineTotal(l))}</span>
        </div>
        <div className="mt-0.5 text-xs text-slate-500 dark:text-slate-400"><bdi>{t(l.detail)}</bdi></div>
        {l.note && <div className="mt-1 flex items-center gap-1 text-xs text-amber-700 dark:text-amber-300"><Info className="h-3.5 w-3.5" />{t(l.note)}</div>}
        {!compact && (
          <div className="mt-2 flex items-center gap-3">
            <Qty l={l} c={c} />
            <button type="button" onClick={() => c.remove(l.id)} className={`flex items-center gap-1 rounded-lg text-xs text-slate-500 hover:text-rose-600 dark:text-slate-400 ${focus}`}><Trash2 className="h-3.5 w-3.5" />{t("Remove")}</button>
          </div>
        )}
      </div>
      {compact && <button type="button" aria-label={t("Remove")} onClick={() => c.remove(l.id)} className={`grid h-7 w-7 place-items-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-rose-600 dark:hover:bg-white/10 ${focus}`}><X className="h-4 w-4" /></button>}
    </li>
  );
}

function Empty({ onBack }: { onBack?: () => void }) {
  const { t } = useMoneyT();
  return (
    <div className="grid place-items-center py-14 text-center">
      <span className="grid h-14 w-14 place-items-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-white/5"><ShoppingBag className="h-7 w-7" /></span>
      <p className="mt-4 font-semibold text-slate-900 dark:text-white">{t("Your cart is empty")}</p>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{t("Add services and pay for them all at once.")}</p>
      {onBack && <button type="button" onClick={onBack} className={`${ghost} mt-5 py-2.5 text-sm`}>{t("Keep shopping")}</button>}
    </div>
  );
}

// Wallet / Card choice and the pay button. Paying shows what would happen next in the real checkout.
function PayBlock({ c, compact = false }: { c: Cart; compact?: boolean }) {
  const { t, m } = useMoneyT();
  const [how, setHow] = useState<"wallet" | "card">(c.total > WALLET ? "card" : "wallet");
  useEffect(() => { if (c.total > WALLET) setHow("card"); }, [c.total]);
  const short = how === "wallet" && c.total > WALLET;
  if (c.paid) return <Paid c={c} />;
  const opt = (id: "wallet" | "card", label: string, sub: string, Icon: typeof Wallet) => (
    <button key={id} type="button" role="radio" aria-checked={how === id} onClick={() => setHow(id)}
      className={`flex flex-1 items-center gap-2.5 rounded-2xl p-3 text-start transition ${focus} ${how === id ? "bg-emerald-50 ring-2 ring-emerald-500 dark:bg-emerald-500/10" : "ring-1 ring-slate-200 hover:ring-slate-300 dark:ring-white/10"}`}>
      <Icon className={`h-5 w-5 ${how === id ? "text-emerald-600 dark:text-emerald-300" : "text-slate-500"}`} />
      <span><span className="block text-sm font-semibold text-slate-900 dark:text-white">{t(label)}</span><span className="block text-[11px] text-slate-500 dark:text-slate-400">{sub}</span></span>
    </button>
  );
  return (
    <div>
      <div role="radiogroup" aria-label={t("Payment method")} className={`flex gap-2 ${compact ? "" : "mt-1"}`}>
        {opt("wallet", "Wallet", t("Balance {0}", { 0: m(WALLET) }), Wallet)}
        {opt("card", "Card", t("Bank gateway"), CreditCard)}
      </div>
      {short && <p className="mt-2 text-xs text-amber-700 dark:text-amber-300">{t("Not enough in your wallet. You need {amount} more.", { amount: m(c.total - WALLET) })}</p>}
      <button type="button" disabled={!c.lines.length || short} onClick={() => c.setPaid(how)} className={`${primary} mt-3 w-full`}>
        <Lock className="h-4 w-4" />{t("Pay {0}", { 0: m(c.total) })}
      </button>
      <p className="mt-2 text-center text-[11px] text-slate-500 dark:text-slate-400">{t("One payment for everything. Anything we can't deliver goes back to your wallet.")}</p>
    </div>
  );
}

function Paid({ c }: { c: Cart }) {
  const { t, m } = useMoneyT();
  return (
    <div className="rounded-2xl bg-emerald-50 p-4 text-sm dark:bg-emerald-500/10 animate-step-in">
      <div className="flex items-center gap-2 font-semibold text-emerald-800 dark:text-emerald-200"><Check className="h-4 w-4" />{c.paid === "card" ? t("Sample: you'd go to the bank, then back here") : t("Sample: paid from your wallet")}</div>
      <ul className="mt-3 space-y-1.5 text-slate-700 dark:text-slate-300">
        {c.lines.map((l, i) => (
          <li key={l.id} className="flex justify-between gap-2">
            <span>{t(l.title)}</span>
            <span className={l.kind === "gv" ? "text-amber-700 dark:text-amber-300" : "text-emerald-700 dark:text-emerald-300"}>
              {l.kind === "gv" ? t("Sold meanwhile · {0} back to wallet", { 0: m(lineTotal(l)) }) : i === 2 ? t("Delivered") : t("Queued")}
            </span>
          </li>
        ))}
      </ul>
      <button type="button" onClick={c.reset} className={`mt-3 text-xs font-semibold text-emerald-800 underline-offset-2 hover:underline dark:text-emerald-200 ${focus}`}>{t("Start the sample again")}</button>
    </div>
  );
}

function Totals({ c }: { c: Cart }) {
  const { t, m, n } = useMoneyT();
  return (
    <dl className="space-y-1.5 text-sm">
      <div className="flex justify-between"><dt className="text-slate-500 dark:text-slate-400">{t("{0} in cart", { 0: n(c.count) })}</dt><dd className="tabular-nums text-slate-900 dark:text-white">{m(c.total)}</dd></div>
      <div className="flex justify-between"><dt className="text-slate-500 dark:text-slate-400">{t("Payment fee")}</dt><dd className="text-slate-900 dark:text-white">{t("Free")}</dd></div>
      <div className="flex items-baseline justify-between pt-1"><dt className="font-semibold text-slate-900 dark:text-white">{t("Total")}</dt><dd className="font-display text-2xl font-bold tabular-nums text-slate-900 dark:text-white">{m(c.total)}</dd></div>
    </dl>
  );
}

// The header in miniature, with a slot for the offer's cart button.
function MiniHeader({ cartButton }: { cartButton: ReactNode }) {
  const { t } = useMoneyT();
  return (
    <div className="relative z-20 border-b border-slate-200/80 bg-white/90 backdrop-blur dark:border-white/[.06] dark:bg-[#070B14]/90">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-4 sm:px-6">
        <span className="flex items-center gap-2 font-display font-bold text-slate-900 dark:text-white"><span className="grid h-8 w-8 place-items-center rounded-lg bg-emerald-600 text-white"><ShoppingCart className="h-4 w-4" /></span>{t("ShopMajazi")}</span>
        <nav className="mx-auto hidden gap-1 rounded-2xl border border-slate-200 bg-slate-100/70 p-1 text-sm text-slate-600 dark:border-white/[.08] dark:bg-white/[.04] dark:text-slate-300 md:flex">
          {["Services", "Blog", "About"].map((x) => <span key={x} className="rounded-xl px-3 py-1.5">{t(x)}</span>)}
        </nav>
        <div className="ms-auto flex items-center gap-2 md:ms-0">
          {cartButton}
          <span className="hidden rounded-xl bg-slate-900 px-3 py-2 text-sm font-semibold text-white sm:block dark:bg-white dark:text-slate-900">{t("My account")}</span>
        </div>
      </div>
    </div>
  );
}

function CartCount({ c, className = "" }: { c: Cart; className?: string }) {
  const { n } = useMoneyT();
  if (!c.count) return null;
  return <span key={c.pulse} className={`absolute -end-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-emerald-600 px-1 text-[11px] font-bold text-white ring-2 ring-white animate-[cart-pop_.4s_ease-out] dark:ring-[#070B14] ${className}`}>{n(c.count)}</span>;
}

function IconCartButton({ c, onClick, open }: { c: Cart; onClick: () => void; open?: boolean }) {
  const { t, n } = useMoneyT();
  return (
    <button type="button" onClick={onClick} aria-expanded={open} aria-label={t("Cart, {0} items", { 0: n(c.count) })}
      className={`relative grid h-10 w-10 place-items-center rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 ${focus}`}>
      <ShoppingBag className="h-5 w-5" /><CartCount c={c} />
    </button>
  );
}

// A product page in miniature: order details and the two buttons.
function ProductStage({ c, onAdded, children, stacked = false }: { c: Cart; onAdded?: () => void; children?: ReactNode; stacked?: boolean }) {
  const { t, m } = useMoneyT();
  const [added, setAdded] = useState(false);
  useEffect(() => { if (!added) return; const id = setTimeout(() => setAdded(false), 1600); return () => clearTimeout(id); }, [added]);
  return (
    <div className={`mx-auto grid max-w-6xl gap-6 px-4 py-10 sm:px-6 ${stacked ? "" : "lg:grid-cols-[1fr_380px]"}`}>
      <div>
        <div className="text-sm text-slate-500 dark:text-slate-400">{t("Services")} / {t("YouTube")}</div>
        <h3 className="mt-2 font-display text-3xl font-bold text-slate-900 dark:text-white">{t(PRODUCT.title)}</h3>
        <p className="mt-2 max-w-md text-slate-600 dark:text-slate-300">{t("Real views from active accounts. Starts within an hour; you can follow it in your account.")}</p>
        {children}
      </div>
      <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200 dark:bg-[#0E1424] dark:ring-white/10">
        <div className="flex items-center gap-3"><span className="grid h-11 w-11 place-items-center rounded-xl bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-300"><Youtube className="h-5 w-5" /></span>
          <div><div className="font-semibold text-slate-900 dark:text-white">{t(PRODUCT.detail)}</div><div className="text-xs text-slate-500 dark:text-slate-400"><bdi>youtube.com/watch?v=…</bdi></div></div></div>
        <div className="mt-4 flex items-baseline justify-between border-t border-slate-100 pt-4 dark:border-white/10"><span className="text-sm text-slate-500 dark:text-slate-400">{t("Price")}</span><span className="font-display text-2xl font-bold text-slate-900 dark:text-white">{m(PRODUCT.price)}</span></div>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <button type="button" onClick={() => { c.add(); setAdded(true); onAdded?.(); }} className={`${ghost} ${added ? "!text-emerald-700 !ring-emerald-500 dark:!text-emerald-300" : ""}`}>
            {added ? <><Check className="h-4 w-4" />{t("Added")}</> : <><Plus className="h-4 w-4" />{t("Add to cart")}</>}
          </button>
          <span className={primary}>{t("Buy now")}</span>
        </div>
        <p className="mt-3 text-center text-[11px] text-slate-500 dark:text-slate-400">{t("Virtual numbers stay Buy now only: their SMS window starts when you pay.")}</p>
      </div>
    </div>
  );
}

function Frame({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`relative min-h-[680px] overflow-hidden bg-[#F5F6FB] dark:bg-[#070B14] ${className}`}>
      <style>{"@keyframes cart-pop{0%{transform:scale(.4)}60%{transform:scale(1.25)}100%{transform:scale(1)}}"}</style>
      {children}
    </div>
  );
}

// The gallery is English; offers open in Persian with a switch, like the other storefront offers.
function InLanguage({ children }: { children: () => ReactNode }) {
  const [lang, setLang] = useState<"fa" | "en">("fa");
  if (!usePathname()?.startsWith("/design")) return <>{children()}</>;
  return (
    <div className="relative">
      <div role="group" aria-label="Language" className="absolute bottom-4 start-4 z-50 flex rounded-xl border border-slate-300 bg-white p-1 text-sm shadow-sm dark:border-white/15 dark:bg-slate-800">
        {(["fa", "en"] as const).map((l) => <button key={l} type="button" aria-pressed={lang === l} onClick={() => setLang(l)} className={`rounded-lg px-3 py-1.5 ${lang === l ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900" : "text-slate-700 dark:text-slate-300"}`}>{l === "fa" ? "فارسی" : "English"}</button>)}
      </div>
      <div dir={lang === "fa" ? "rtl" : "ltr"} lang={lang} key={lang}><LocaleProvider locale={lang}>{children()}</LocaleProvider></div>
    </div>
  );
}

// ---------- A · Side drawer ----------

function DrawerOffer() {
  const c = useCartDemo();
  const { t, n } = useMoneyT();
  const [open, setOpen] = useState(false);
  return (
    <Frame>
      <MiniHeader cartButton={<IconCartButton c={c} open={open} onClick={() => setOpen(true)} />} />
      <ProductStage c={c} onAdded={() => setOpen(true)} />
      <div onClick={() => setOpen(false)} className={`absolute inset-0 z-30 bg-slate-950/40 backdrop-blur-sm transition-opacity ${open ? "opacity-100" : "pointer-events-none opacity-0"}`} />
      <aside aria-label={t("Cart")} className={`absolute inset-y-0 end-0 z-40 flex w-full max-w-[420px] flex-col bg-white shadow-2xl transition-transform duration-300 dark:bg-[#0B1020] ${open ? "translate-x-0" : "ltr:translate-x-full rtl:-translate-x-full"}`}>
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 dark:border-white/10">
          <h3 className="font-display text-lg font-semibold text-slate-900 dark:text-white">{t("Your cart")} <span className="text-sm font-normal text-slate-500">({n(c.count)})</span></h3>
          <button type="button" aria-label={t("Close")} onClick={() => setOpen(false)} className={`grid h-9 w-9 place-items-center rounded-full bg-slate-100 text-slate-600 dark:bg-white/10 dark:text-slate-300 ${focus}`}><X className="h-5 w-5" /></button>
        </div>
        <div className="flex-1 overflow-y-auto px-5">
          {c.lines.length ? <ul className="divide-y divide-slate-100 dark:divide-white/10">{c.lines.map((l) => <RowLine key={l.id} l={l} c={c} />)}</ul> : <Empty onBack={() => setOpen(false)} />}
        </div>
        {!!c.lines.length && <div className="space-y-4 border-t border-slate-100 p-5 dark:border-white/10"><Totals c={c} /><PayBlock c={c} /></div>}
      </aside>
    </Frame>
  );
}

// ---------- B · Full page with sticky summary ----------

function PageOffer() {
  const c = useCartDemo();
  const { t, n } = useMoneyT();
  const [page, setPage] = useState<"product" | "cart">("cart");
  return (
    <Frame>
      <MiniHeader cartButton={
        <button type="button" onClick={() => setPage("cart")} className={`relative flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 ${focus}`}>
          <ShoppingBag className="h-4 w-4" />{t("Cart")}{!!c.count && <span key={c.pulse} className="rounded-full bg-emerald-600 px-1.5 text-[11px] text-white animate-[cart-pop_.4s_ease-out]">{n(c.count)}</span>}
        </button>} />
      {page === "product" ? <ProductStage c={c} /> : (
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
          <button type="button" onClick={() => setPage("product")} className={`flex items-center gap-1 text-sm text-slate-500 hover:text-slate-800 dark:text-slate-400 ${focus}`}><ChevronLeft className="h-4 w-4 ltr:rotate-180" />{t("Keep shopping")}</button>
          <h3 className="mt-3 font-display text-3xl font-bold text-slate-900 dark:text-white">{t("Your cart")}</h3>
          <div className="mt-6 grid items-start gap-6 lg:grid-cols-[1fr_360px]">
            <div className="rounded-3xl bg-white px-5 shadow-sm ring-1 ring-slate-200 dark:bg-[#0E1424] dark:ring-white/10">
              {c.lines.length ? <ul className="divide-y divide-slate-100 dark:divide-white/10">{c.lines.map((l) => <RowLine key={l.id} l={l} c={c} />)}</ul> : <Empty onBack={() => setPage("product")} />}
            </div>
            <div className="space-y-4 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200 lg:sticky lg:top-4 dark:bg-[#0E1424] dark:ring-white/10">
              <h4 className="font-semibold text-slate-900 dark:text-white">{t("Summary")}</h4>
              <Totals c={c} />
              <PayBlock c={c} />
            </div>
          </div>
          {page === "cart" && <p className="mt-6 text-sm text-slate-500 dark:text-slate-400">{t("Tip: open Keep shopping and use Add to cart to see a line arrive.")}</p>}
        </div>
      )}
    </Frame>
  );
}

// ---------- C · Bottom bar + sheet (phones first) ----------

function BarOffer() {
  const c = useCartDemo();
  const { t, m, n } = useMoneyT();
  const [open, setOpen] = useState(false);
  return (
    <Frame className="pb-28">
      <MiniHeader cartButton={<IconCartButton c={c} open={open} onClick={() => setOpen(true)} />} />
      <ProductStage c={c} />
      {!!c.count && !open && (
        <div className="absolute inset-x-0 bottom-4 z-30 px-4">
          <button type="button" onClick={() => setOpen(true)} key={c.pulse}
            className={`mx-auto flex w-full max-w-xl items-center gap-3 rounded-2xl bg-slate-900 p-3 ps-4 text-white shadow-2xl shadow-slate-900/30 animate-step-in dark:bg-white dark:text-slate-900 ${focus}`}>
            <span className="relative"><ShoppingBag className="h-6 w-6" /><CartCount c={c} className="!ring-slate-900 dark:!ring-white" /></span>
            <span className="flex-1 text-start"><span className="block text-xs opacity-70">{t("{0} items in your cart", { 0: n(c.count) })}</span><span className="block font-semibold tabular-nums">{m(c.total)}</span></span>
            <span className="flex items-center gap-1 rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-white">{t("View cart")}<ArrowLeft className="h-4 w-4 ltr:rotate-180" /></span>
          </button>
        </div>
      )}
      <div onClick={() => setOpen(false)} className={`absolute inset-0 z-30 bg-slate-950/40 backdrop-blur-sm transition-opacity ${open ? "opacity-100" : "pointer-events-none opacity-0"}`} />
      <div role="dialog" aria-label={t("Cart")} className={`absolute inset-x-0 bottom-0 z-40 mx-auto max-h-[88%] max-w-xl overflow-y-auto rounded-t-[2rem] bg-white p-5 shadow-2xl transition-transform duration-300 dark:bg-[#0B1020] ${open ? "translate-y-0" : "translate-y-full"}`}>
        <span aria-hidden className="mx-auto mb-3 block h-1.5 w-12 rounded-full bg-slate-200 dark:bg-white/15" />
        <div className="flex items-center justify-between">
          <h3 className="font-display text-lg font-semibold text-slate-900 dark:text-white">{t("Your cart")}</h3>
          <button type="button" aria-label={t("Close")} onClick={() => setOpen(false)} className={`grid h-9 w-9 place-items-center rounded-full bg-slate-100 text-slate-600 dark:bg-white/10 dark:text-slate-300 ${focus}`}><X className="h-5 w-5" /></button>
        </div>
        {c.lines.length ? <ul className="divide-y divide-slate-100 dark:divide-white/10">{c.lines.map((l) => <RowLine key={l.id} l={l} c={c} />)}</ul> : <Empty onBack={() => setOpen(false)} />}
        {!!c.lines.length && <div className="mt-2 space-y-4 border-t border-slate-100 pt-4 dark:border-white/10"><Totals c={c} /><PayBlock c={c} /></div>}
      </div>
    </Frame>
  );
}

// ---------- D · Header popover ----------

function PopoverOffer() {
  const c = useCartDemo();
  const { t, m, n } = useMoneyT();
  const [open, setOpen] = useState(true);
  const [paying, setPaying] = useState(false);
  return (
    <Frame>
      <MiniHeader cartButton={
        <div className="relative">
          <button type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open}
            className={`relative flex h-10 items-center gap-2 rounded-xl px-3 text-sm font-semibold transition ${focus} ${open ? "bg-emerald-600 text-white" : "border border-slate-200 bg-white text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-200"}`}>
            <ShoppingBag className="h-4 w-4" /><span className="tabular-nums">{c.count ? m(c.total) : t("Cart")}</span><CartCount c={c} />
          </button>
          <div className={`absolute end-0 top-full z-40 w-[360px] max-w-[calc(100vw-2rem)] pt-3 transition-all duration-200 ${open ? "visible translate-y-0 opacity-100" : "invisible -translate-y-1 opacity-0"}`}>
            <div className="rounded-2xl bg-white p-4 shadow-2xl shadow-slate-900/15 ring-1 ring-slate-200 dark:bg-[#0E1424] dark:ring-white/10">
              <div className="flex items-center justify-between"><span className="font-semibold text-slate-900 dark:text-white">{t("Your cart")}</span><span className="text-xs text-slate-500">{t("{0} in cart", { 0: n(c.count) })}</span></div>
              {c.lines.length ? <ul className="max-h-72 divide-y divide-slate-100 overflow-y-auto dark:divide-white/10">{c.lines.map((l) => <RowLine key={l.id} l={l} c={c} compact />)}</ul> : <Empty />}
              {!!c.lines.length && (paying || c.paid ? <div className="mt-2 border-t border-slate-100 pt-3 dark:border-white/10"><PayBlock c={c} compact /></div> : (
                <div className="mt-2 border-t border-slate-100 pt-3 dark:border-white/10">
                  <div className="flex items-baseline justify-between"><span className="text-sm text-slate-500 dark:text-slate-400">{t("Total")}</span><span className="font-display text-xl font-bold tabular-nums text-slate-900 dark:text-white">{m(c.total)}</span></div>
                  <button type="button" onClick={() => setPaying(true)} className={`${primary} mt-3 w-full py-3`}><Lock className="h-4 w-4" />{t("Pay for all")}</button>
                </div>
              ))}
            </div>
          </div>
        </div>} />
      <ProductStage c={c} onAdded={() => setOpen(true)} />
    </Frame>
  );
}

// ---------- E · Receipt ----------

function ReceiptOffer() {
  const c = useCartDemo();
  const { t, m, n } = useMoneyT();
  return (
    <Frame>
      <MiniHeader cartButton={<IconCartButton c={c} onClick={() => {}} />} />
      <div className="mx-auto grid max-w-6xl items-start gap-6 lg:grid-cols-[1fr_400px]">
        <ProductStage c={c} stacked />
        <div className="px-4 py-10 lg:px-0 lg:pe-6">
          <div className="relative rounded-t-3xl bg-white px-6 pb-8 pt-6 shadow-sm ring-1 ring-slate-200 dark:bg-[#0E1424] dark:ring-white/10">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 font-display text-lg font-semibold text-slate-900 dark:text-white"><Receipt className="h-5 w-5 text-emerald-600" />{t("Your cart")}</span>
              <span className="text-xs text-slate-500">{t("{0} in cart", { 0: n(c.count) })}</span>
            </div>
            <ol className="mt-4 border-t border-dashed border-slate-300 dark:border-white/15">
              {c.lines.map((l, i) => (
                <li key={l.id} className="group flex items-start gap-3 border-b border-dashed border-slate-200 py-3 text-sm animate-step-in dark:border-white/10">
                  <span className="w-5 pt-0.5 text-xs tabular-nums text-slate-400">{n(i + 1)}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-medium text-slate-900 dark:text-white">{t(l.title)}{l.qty && l.qty > 1 ? ` × ${n(l.qty)}` : ""}</span>
                    <span className="block text-xs text-slate-500 dark:text-slate-400"><bdi>{t(l.detail)}</bdi></span>
                    {l.note && <span className="mt-0.5 block text-[11px] text-amber-700 dark:text-amber-300">{t(l.note)}</span>}
                  </span>
                  <span className="tabular-nums text-slate-900 dark:text-white">{m(lineTotal(l))}</span>
                  <button type="button" aria-label={t("Remove")} onClick={() => c.remove(l.id)} className={`grid h-6 w-6 place-items-center rounded-full text-slate-400 hover:text-rose-600 sm:opacity-0 sm:group-hover:opacity-100 sm:focus-visible:opacity-100 ${focus}`}><X className="h-3.5 w-3.5" /></button>
                </li>
              ))}
              {!c.lines.length && <li><Empty /></li>}
            </ol>
            {!!c.lines.length && <>
              <div className="mt-4 flex items-baseline justify-between"><span className="font-semibold text-slate-900 dark:text-white">{t("Total")}</span><span className="font-display text-3xl font-bold tabular-nums text-emerald-700 dark:text-emerald-300">{m(c.total)}</span></div>
              <div className="mt-4"><PayBlock c={c} /></div>
            </>}
            {/* torn paper edge */}
            <span aria-hidden className="absolute inset-x-0 -bottom-3 h-3 bg-[radial-gradient(circle_at_8px_0,transparent_7px,white_8px)] bg-[length:16px_12px] dark:bg-[radial-gradient(circle_at_8px_0,transparent_7px,#0E1424_8px)]" />
          </div>
        </div>
      </div>
    </Frame>
  );
}

export const CartA = () => <InLanguage>{() => <DrawerOffer />}</InLanguage>;
export const CartB = () => <InLanguage>{() => <PageOffer />}</InLanguage>;
export const CartC = () => <InLanguage>{() => <BarOffer />}</InLanguage>;
export const CartD = () => <InLanguage>{() => <PopoverOffer />}</InLanguage>;
export const CartE = () => <InLanguage>{() => <ReceiptOffer />}</InLanguage>;
