"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import Link from "@/i18n/Link";
import { BadgeCheck, Check, ChevronRight, Eye, EyeOff, MapPin, MessageSquare, Phone, RotateCcw, ShieldCheck, Sparkles, Zap } from "lucide-react";
import CheckoutModal, { type PayMethod } from "@/components/checkout/CheckoutModal";
import { GV_PRICE, gvFaq, gvFeatures, gvIncluded, gvNumbers, gvSampleLogin, gvSteps, type GvNumber } from "@/content/google-voice-en";
import { CopyButton } from "../otp/parts";
import { useT } from "@/i18n/client";
import { accountApi, ApiError, TOP_UP_HREF, useAccount } from "@/lib/account";
import { useMoney } from "@/lib/money";
import { toGvNumber, type ApiGvOrder } from "@/lib/google-voice";
import { useLiveGv } from "./live";

// Pieces shared by the Google Voice page offers.

// `login` is null while support finishes an order Numberland didn't answer clearly (status "review").
export type GvOrder = { id?: number; number: GvNumber; paidWith: PayMethod; login: typeof gvSampleLogin | null };
export type GvNotice = { good: boolean; text: string };

const orderOf = (o: ApiGvOrder, fallback?: GvNumber): GvOrder => ({
  id: o.id,
  number: o.number ? { ...toGvNumber({ id: 0, number: o.number, price: o.price, round: 0 }), ...(fallback && { id: fallback.id, easy: fallback.easy }) } : fallback!,
  paidWith: o.paid_with,
  login: o.login,
});

// Selection → payment → delivered order. On the live page (LiveGvProvider) the numbers come from the backend and
// paying goes through it: wallet right away, card via the bank (which sends the buyer back with ?pay=…&order=…).
// In design previews paying succeeds straight away with the sample login.
export function useGv() {
  const tx = useT();
  const live = useLiveGv();
  const { setWallet } = useAccount();
  const [gone, setGone] = useState<string[]>([]); // sold while the page was open
  const numbers = useMemo(() => (live ? live.numbers : tx.tr(gvNumbers)).filter((n) => !gone.includes(n.id)), [live, tx, gone]);
  // With nothing in stock the sample stands in, but the page shows the empty state instead of it.
  const [selected, setSelected] = useState<GvNumber>(numbers[0] ?? tx.tr(gvNumbers)[0]);
  const [payOpen, setPayOpen] = useState(false);
  const [order, setOrder] = useState<GvOrder | null>(null);
  const [notice, setNotice] = useState<GvNotice | null>(null);
  const show = (o: GvOrder) => { setOrder(o); setPayOpen(false); window.scrollTo({ top: 0, behavior: "smooth" }); };

  // The number left the stock: drop it and move the selection on.
  const drop = (n: GvNumber) => {
    setGone((g) => [...g, n.id]);
    const next = numbers.find((x) => x.id !== n.id);
    if (next) setSelected(next);
  };

  const buy = async (m: PayMethod) => {
    if (!live) return show({ number: selected, paidWith: m, login: tx.tr(gvSampleLogin) });
    const body = { id: selected.pid, price: selected.price };
    try {
      if (m === "card") {
        const r = await accountApi<{ url: string }>("google-voice/pay-card", { ...body, return: window.location.pathname });
        window.location.assign(r.url);
        return new Promise<void>(() => {}); // the page is leaving; keep the modal busy
      }
      const r = await accountApi<{ order: ApiGvOrder; wallet: number }>("google-voice/buy", body);
      setWallet(r.wallet);
      drop(selected);
      show(orderOf(r.order, selected));
    } catch (e) {
      if (e instanceof ApiError) {
        if (typeof e.data?.wallet === "number") setWallet(e.data.wallet);
        if (e.code === "sold" || e.code === "sold_refunded") drop(selected);
      }
      throw e; // the modal shows why
    }
  };

  // Back from the bank: show the delivered order, or what happened. Then clean the address so a reload doesn't repeat it.
  useEffect(() => {
    if (!live) return;
    const q = new URLSearchParams(window.location.search);
    const pay = q.get("pay");
    const id = q.get("order");
    if (!pay) return;
    q.delete("pay"); q.delete("order");
    window.history.replaceState(null, "", window.location.pathname + (q.size ? `?${q}` : "") + window.location.hash);
    const texts: Record<string, GvNotice> = {
      refunded: { good: false, text: tx("Payment received, but that number was sold a moment earlier. The full amount is in your wallet; pick another number.") },
      cancelled: { good: false, text: tx("Payment cancelled. Nothing was charged.") },
      failed: { good: false, text: tx("The payment didn't go through. If money left your account, the bank returns it within 72 hours.") },
    };
    if ((pay === "ok" || pay === "review") && id) {
      accountApi<{ order: ApiGvOrder; wallet: number }>(`google-voice/orders/${id}`)
        .then((r) => { setWallet(r.wallet); show(orderOf(r.order)); })
        .catch(() => setNotice({ good: true, text: tx("Payment received. Your number is in your orders.") }));
    } else {
      setNotice(texts[pay] ?? texts.failed);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [live]);

  return {
    live: !!live, numbers, error: live?.error, notice, selected, setSelected, payOpen,
    openPay: () => setPayOpen(true), closePay: () => setPayOpen(false), order, buy, reset: () => setOrder(null),
  };
}
export type Gv = ReturnType<typeof useGv>;

// A number's price: its own on the live page, the sample price in previews.
export const gvPrice = (n: GvNumber) => n.price ?? GV_PRICE;

export function GvCheckout({ gv }: { gv: Gv }) {
  const tx = useT();
  return (
    <CheckoutModal open={gv.payOpen} onClose={gv.closePay} price={gvPrice(gv.selected)} itemLabel={tx("Google Voice number")} payLabel={tx("Pay")}
      note={tx("Login not working? We replace the number or refund you.")} onPay={gv.buy}
      {...(gv.live && { signIn: true, only: ["wallet", "card"] as PayMethod[], topUpHref: TOP_UP_HREF, fees: { card: 0 }, notes: { card: "Iranian bank cards, via ZarinPal" } })}
      summary={<>
        <GvIcon />
        <div className="min-w-0 flex-1">
          <div className="font-mono font-semibold text-slate-900 dark:text-white">{gv.selected.number}</div>
          <div className="text-xs text-slate-500 dark:text-slate-400">{gv.selected.city}, {gv.selected.state}{" "}{tx("· Google Voice")}</div>
        </div>
      </>} />
  );
}

export function GvIcon({ size = "md" }: { size?: "md" | "lg" }) {
  return <span aria-hidden className={`grid shrink-0 place-items-center bg-gradient-to-br from-emerald-500 to-teal-600 text-white ${size === "lg" ? "h-14 w-14 rounded-2xl" : "h-11 w-11 rounded-xl"}`}><Phone className={size === "lg" ? "h-7 w-7" : "h-5 w-5"} /></span>;
}

// A pickable number.
// `price`: shown on the tile when numbers differ in price (live page).
export function NumberTile({ n, on, onPick, compact = false, price }: { n: GvNumber; on: boolean; onPick: () => void; compact?: boolean; price?: string }) {
  const tx = useT();
  return (
    <button onClick={onPick} aria-pressed={on}
      className={`group relative flex w-full items-center gap-3 rounded-2xl text-start ring-1 transition duration-300 ${compact ? "p-3" : "p-4"} ${on
        ? "bg-emerald-50 ring-2 ring-emerald-500 dark:bg-emerald-500/10 dark:ring-emerald-400"
        : "bg-white ring-slate-200 hover:-translate-y-0.5 hover:ring-emerald-300 hover:shadow-md dark:bg-[#0E1424] dark:ring-white/10 dark:hover:ring-emerald-400/50"}`}>
      <span className={`grid h-5 w-5 shrink-0 place-items-center rounded-full ring-2 transition ${on ? "bg-emerald-500 ring-emerald-500" : "ring-slate-300 dark:ring-white/20"}`}>{on && <Check className="h-3 w-3 text-white" />}</span>
      <span className="min-w-0 flex-1">
        <span className="block font-mono text-[15px] font-semibold tracking-tight text-slate-900 dark:text-white">{n.number}</span>
        <span className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400"><MapPin className="h-3 w-3" />{n.city}, {n.state}</span>
      </span>
      <span className="flex shrink-0 flex-col items-end gap-1">
        {n.easy && <span className="flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-700 dark:bg-amber-500/15 dark:text-amber-300"><Sparkles className="h-3 w-3" />{tx("Easy to remember")}</span>}
        {price && <span className="text-sm font-semibold tabular-nums text-slate-900 dark:text-white">{price}</span>}
      </span>
    </button>
  );
}

export function BuyButton({ gv, className = "", children }: { gv: Gv; className?: string; children?: ReactNode }) {
  const tx = useT();
  const money = useMoney();
  return (
    <button onClick={gv.openPay} className={`flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-emerald-600/30 transition hover:bg-emerald-700 ${className}`}>
      {children ?? <>{tx("Buy")}{" "}{gv.selected.number} · {money.format(gvPrice(gv.selected))}</>}
    </button>
  );
}

// `animated`: on a hero, each guarantee rises in turn as a glass pill and its icon moves now and then
// (a flash, a turn, a pulse). Reduced motion leaves them still (globals.css).
export function Guarantees({ className = "", animated = false }: { className?: string; animated?: boolean }) {
  const tx = useT();
  const items = [
    { icon: Zap, t: tx("Instant delivery"), c: "text-amber-500", chip: "bg-amber-400", a: "animate-[zap_2.4s_ease-in-out_infinite]" },
    { icon: RotateCcw, t: tx("Replace or refund"), c: "text-emerald-500", chip: "bg-emerald-600", a: "animate-[turn-back_2.4s_cubic-bezier(0.65,0,0.35,1)_infinite] [animation-delay:.8s]" },
    { icon: ShieldCheck, t: tx("Full account access"), c: "text-indigo-500", chip: "bg-teal-600", a: "animate-[shield_2.4s_ease-in-out_infinite] [animation-delay:1.6s]" },
  ];
  if (animated) {
    // Solid white pills, so they read where the hero fades into the pale page; glass in dark mode.
    return (
      <ul className={`flex flex-wrap gap-2.5 text-sm ${className}`}>
        {items.map(({ icon: I, t, chip, a }, i) => (
          // The li rises in once; the pill inside bobs and catches a light sweep, on a loop, each a beat apart.
          <li key={t} style={{ animationDelay: `${300 + i * 140}ms` }} className="animate-fade-up [animation-fill-mode:backwards]">
            <span style={{ animationDelay: `${i * 0.8}s` }}
              className="relative flex animate-[bob_2.4s_ease-in-out_infinite] items-center gap-2 overflow-hidden rounded-full bg-white py-1 pe-3.5 ps-1 font-semibold text-emerald-950 shadow-lg shadow-emerald-900/15 ring-1 ring-emerald-900/5 dark:bg-white/10 dark:text-white dark:shadow-none dark:ring-white/15 dark:backdrop-blur-sm">
              <span aria-hidden style={{ animationDelay: `${i * 0.8}s` }} className="pointer-events-none absolute inset-y-0 left-0 w-1/3 animate-[shine_4s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-emerald-200/60 to-transparent dark:via-white/20" />
              <span aria-hidden className={`relative grid h-7 w-7 place-items-center rounded-full text-white ${chip}`}><I className={`h-4 w-4 ${a}`} /></span>
              <span className="relative">{t}</span>
            </span>
          </li>
        ))}
      </ul>
    );
  }
  return (
    <ul className={`flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-600 dark:text-slate-300 ${className}`}>
      {items.map(({ icon: I, t, c }) => <li key={t} className="flex items-center gap-2"><I className={`h-4 w-4 ${c}`} />{t}</li>)}
    </ul>
  );
}

// Stylized Google Voice app screen showing the chosen number.
export function PhoneMock({ n }: { n: GvNumber }) {
  const tx = useT();
  return (
    <div aria-hidden className="relative mx-auto w-[260px] rounded-[2.5rem] bg-slate-900 p-3 shadow-2xl shadow-emerald-900/30 ring-1 ring-white/10">
      <div className="overflow-hidden rounded-[2rem] bg-white dark:bg-[#0B1020]">
        <div className="mx-auto mt-2 h-5 w-24 rounded-full bg-slate-900" />
        <div className="px-5 pb-6 pt-5">
          <div className="flex items-center gap-2"><GvIcon /><div><div className="text-[11px] text-slate-500">{tx("Voice")}</div><div className="text-xs font-semibold text-slate-900 dark:text-white">{tx("Your number")}</div></div></div>
          <div key={n.id} className="mt-5 animate-fade-up font-mono text-xl font-bold tracking-tight text-slate-900 [animation-duration:350ms] dark:text-white">{n.number}</div>
          <div className="text-xs text-slate-500">{n.city}, {n.state}{" "}{tx("· United States")}</div>
          <div className="mt-5 space-y-2.5">
            {[{ i: MessageSquare, t: tx("Your code is 482 913"), s: "2m" }, { i: Phone, t: tx("Missed call · (212) 555-0199"), s: "1h" }, { i: MessageSquare, t: tx("Welcome to PayPal!"), s: "3h" }].map(({ i: I, t, s }) => (
              <div key={t} className="flex items-center gap-2.5 rounded-xl bg-slate-50 p-2.5 dark:bg-white/5">
                <span className="grid h-7 w-7 place-items-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-300"><I className="h-3.5 w-3.5" /></span>
                <span className="flex-1 truncate text-[11px] text-slate-700 dark:text-slate-300">{t}</span><span className="text-[10px] text-slate-400">{s}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function Features({ cols = 4 }: { cols?: 2 | 4 }) {
  const tx = useT();
  return (
    <div className={`grid gap-4 sm:grid-cols-2 ${cols === 4 ? "lg:grid-cols-4" : ""}`}>
      {tx.tr(gvFeatures).map((f, i) => (
        <div key={f.title} className="rounded-3xl bg-white p-6 ring-1 ring-slate-200 dark:bg-[#0E1424] dark:ring-white/10">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-300">{[<Phone key="a" className="h-5 w-5" />, <BadgeCheck key="b" className="h-5 w-5" />, <MessageSquare key="c" className="h-5 w-5" />, <Zap key="d" className="h-5 w-5" />][i]}</span>
          <div className="mt-4 font-display font-semibold text-slate-900 dark:text-white">{f.title}</div>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{f.text}</p>
        </div>
      ))}
    </div>
  );
}

export function Included() {
  const tx = useT();
  return (
    <ul className="grid gap-2.5 sm:grid-cols-2">
      {tx.tr(gvIncluded).map((t) => <li key={t} className="flex items-center gap-2.5 text-sm text-slate-700 dark:text-slate-300"><span className="grid h-5 w-5 place-items-center rounded-full bg-emerald-500 text-white"><Check className="h-3 w-3" /></span>{t}</li>)}
    </ul>
  );
}

export function Steps() {
  const tx = useT();
  return (
    <ol className="grid gap-4 md:grid-cols-3">
      {tx.tr(gvSteps).map((s, i) => (
        <li key={s.title} className="rounded-3xl bg-white p-6 ring-1 ring-slate-200 dark:bg-[#0E1424] dark:ring-white/10">
          <span className="font-display text-4xl font-bold text-emerald-500/30">{i + 1}</span>
          <div className="mt-2 font-display text-lg font-semibold text-slate-900 dark:text-white">{s.title}</div>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{s.text}</p>
        </li>
      ))}
    </ol>
  );
}

export function Faq() {
  const tx = useT();
  return (
    <div className="divide-y divide-slate-200 rounded-3xl bg-white ring-1 ring-slate-200 dark:divide-white/10 dark:bg-[#0E1424] dark:ring-white/10">
      {tx.tr(gvFaq).map((f) => (
        <details key={f.q} className="group p-5 [&_summary::-webkit-details-marker]:hidden">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-slate-900 dark:text-white">
            {f.q}<ChevronRight className="h-4 w-4 shrink-0 text-slate-400 transition group-open:rotate-90 rtl:rotate-180 rtl:group-open:rotate-90" />
          </summary>
          <p className="mt-3 text-[15px] leading-7 text-slate-600 dark:text-slate-400">{f.a}</p>
        </details>
      ))}
    </div>
  );
}

export function SectionTitle({ kicker, title, center = false }: { kicker?: string; title: string; center?: boolean }) {
  return (
    <div className={center ? "text-center" : ""}>
      {kicker && <span className="text-sm font-semibold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">{kicker}</span>}
      <h2 className="mt-2 font-display text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-white">{title}</h2>
    </div>
  );
}

// ---------- After paying ----------

function Secret({ label, value }: { label: string; value: string }) {
  const tx = useT();
  const [show, setShow] = useState(false);
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3 dark:bg-white/5">
      <div className="min-w-0 flex-1">
        <div className="text-xs text-slate-500 dark:text-slate-400">{label}</div>
        <div className="truncate font-mono text-sm font-semibold text-slate-900 dark:text-white">{show ? value : "•".repeat(Math.min(14, value.length))}</div>
      </div>
      <button onClick={() => setShow(!show)} aria-label={show ? tx("Hide {0}", { 0: label }) : tx("Show {0}", { 0: label })} title={show ? tx("Hide") : tx("Show")} className="grid h-9 w-9 place-items-center rounded-lg bg-slate-100 text-slate-600 transition hover:bg-slate-200 dark:bg-white/10 dark:text-slate-300 dark:hover:bg-white/20">
        {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
      <CopyButton text={value} label={tx("Copy {0}", { 0: label })} />
    </div>
  );
}

// The delivered order: the number, the Google account login (hidden until revealed) and what to do next.
export function OrderView({ gv }: { gv: Gv }) {
  const tx = useT();
  const o = gv.order!;
  return (
    <div className="mx-auto max-w-3xl animate-fade-up">
      <div className="flex items-center gap-3 text-emerald-600 dark:text-emerald-400"><span className="grid h-8 w-8 place-items-center rounded-full bg-emerald-500 text-white"><Check className="h-4 w-4" /></span><span className="font-semibold">{o.login ? tx("Payment received · delivered") : tx("Payment received")}</span></div>
      <h1 className="mt-4 font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-white">{o.login ? tx("Your Google Voice number is ready") : tx("We are finishing your order")}</h1>

      <div className="mt-8 rounded-3xl bg-white p-6 ring-1 ring-slate-200 sm:p-8 dark:bg-[#0E1424] dark:ring-white/10">
        <div className="flex flex-wrap items-center gap-4">
          <GvIcon size="lg" />
          <div className="flex-1">
            <div className="font-mono text-3xl font-bold tracking-tight text-slate-900 dark:text-white">{o.number.number}</div>
            <div className="text-sm text-slate-500 dark:text-slate-400">{o.number.city}, {o.number.state}{" "}{tx("· United States")}</div>
          </div>
          <CopyButton text={o.number.number} label={tx("Copy number")} />
        </div>
        <div className="mt-8 text-xs font-semibold uppercase tracking-widest text-slate-400">{tx("Google account")}</div>
        {o.login ? (
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <Secret label={tx("Gmail")} value={o.login.email} />
            <Secret label={tx("Password")} value={o.login.password} />
            <Secret label={tx("Recovery email")} value={o.login.recovery} />
            {/* Numberland numbers come without a 2-step code. */}
            {o.login.twofa && <Secret label={tx("2-step verification code")} value={o.login.twofa} />}
          </div>
        ) : (
          <p className="mt-3 rounded-2xl bg-amber-50 px-4 py-3 text-sm text-amber-900 ring-1 ring-amber-200 dark:bg-amber-500/10 dark:text-amber-200 dark:ring-amber-400/25">
            {tx("The number provider was slow to confirm. Our team is checking it now and will put the login in your orders shortly, or refund you in full.")}
          </p>
        )}
      </div>

      <div className="mt-6 rounded-3xl bg-emerald-50 p-6 ring-1 ring-emerald-200 dark:bg-emerald-500/10 dark:ring-emerald-400/25">
        <div className="font-display font-semibold text-slate-900 dark:text-white">{tx("Next steps")}</div>
        <ol className="mt-3 space-y-2 text-sm text-slate-700 dark:text-slate-300">
          <li>{tx("1. Install Google Voice, or open voice.google.com, and sign in with the Gmail above.")}</li>
          <li>{tx("2. Change the password, recovery email and 2-step verification to your own.")}</li>
          <li>{tx("3. Use the number at least once every few weeks so Google keeps it active.")}</li>
        </ol>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link href="/dashboard/orders" className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white dark:bg-white dark:text-slate-900">{tx("View in my orders")}</Link>
        <button onClick={gv.reset} className="rounded-xl px-5 py-3 text-sm font-semibold text-slate-700 ring-1 ring-slate-200 hover:bg-white dark:text-slate-200 dark:ring-white/10 dark:hover:bg-white/5">{tx("Buy another number")}</button>
      </div>
    </div>
  );
}
