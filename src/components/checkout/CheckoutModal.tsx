"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { X, Wallet, CreditCard, Bitcoin, Check, AlertCircle, Lock, Loader2, Plus } from "lucide-react";
import type { ReactNode } from "react";
import { useMoney } from "@/lib/money";
import { useT } from "@/i18n/client";
import { useAccount } from "@/lib/account";
import SignInForm from "@/components/account/SignInForm";
import { errorText } from "@/components/account/errors";

export type PayMethod = "wallet" | "card" | "crypto";

// Keyboard focus: the site's emerald ring, drawn as an outline so it sits outside the selection ring.
const focus = "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 dark:focus-visible:outline-emerald-400";

const methods: { id: PayMethod; label: string; desc: string; icon: typeof Wallet; feePct: number }[] = [
  { id: "wallet", label: "Wallet", desc: "Pay from your balance", icon: Wallet, feePct: 0 },
  { id: "card", label: "Card", desc: "Visa, Mastercard, local cards", icon: CreditCard, feePct: 3 }, // placeholder fee
  { id: "crypto", label: "Crypto", desc: "USDT, BTC, TON", icon: Bitcoin, feePct: 0 },
];

// Payment step as a modal, shared by every product page: what you're buying (`summary`), how to pay, the final
// price, and the pay button. Centered dialog on desktop, bottom sheet on phones. Escape or the backdrop closes it.
// Live pages: `signIn` asks guests to sign in first (in the modal, so their choices stay); `only` limits the
// payment methods; `onPay` may return a promise: the modal waits, closes on success and shows why on failure.
// `topUpHref` links to topping up when the wallet is short. `fees` / `notes` override a method's fee (%) and
// description; `busyLabels` the waiting text per method (default `busyLabel`).
export default function CheckoutModal({ open, onClose, summary, price, itemLabel = "Item", payLabel = "Pay", note, onPay, signIn = false, only, topUpHref, busyLabel = "Processing…", fees, notes, busyLabels }: {
  open: boolean; onClose: () => void; summary?: ReactNode; price: number; itemLabel?: string; payLabel?: string; note?: string;
  onPay: (method: PayMethod) => unknown; signIn?: boolean; only?: PayMethod[]; topUpHref?: string; busyLabel?: string;
  fees?: Partial<Record<PayMethod, number>>; notes?: Partial<Record<PayMethod, string>>; busyLabels?: Partial<Record<PayMethod, string>>;
}) {
  const t = useT();
  itemLabel = t(itemLabel);
  payLabel = t(payLabel);
  const money = useMoney();
  const usd = money.format;
  const account = useAccount();
  const [pay, setPay] = useState<PayMethod>("wallet");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => { if (open) setError(null); }, [open, price]);
  const needSignIn = signIn && account.status !== "user";
  const onlyKey = only?.join(",");
  const shown = useMemo(() => (onlyKey ? methods.filter((x) => onlyKey.split(",").includes(x.id)) : methods)
    .map((x) => ({ ...x, feePct: fees?.[x.id] ?? x.feePct, desc: notes?.[x.id] ?? x.desc })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [onlyKey, JSON.stringify(fees), JSON.stringify(notes)]);
  // Opening with too little in the wallet: start on Card when it is offered.
  useEffect(() => {
    if (!open) return;
    const walletShort = money.wallet != null && price > money.wallet;
    setPay(walletShort && shown.some((x) => x.id === "card") ? "card" : "wallet");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);
  const dialog = useRef<HTMLDivElement>(null);
  // Latest onClose without re-running the open/close setup on every parent render.
  const closeRef = useRef(onClose);
  closeRef.current = onClose;

  useEffect(() => {
    if (!open) return;
    const k = (e: KeyboardEvent) => e.key === "Escape" && closeRef.current();
    window.addEventListener("keydown", k);
    const html = document.documentElement;
    html.style.overflow = "hidden";
    setTimeout(() => dialog.current?.querySelector<HTMLElement>("[role=radio][aria-checked=true]")?.focus(), 50);
    return () => { window.removeEventListener("keydown", k); html.style.overflow = ""; };
  }, [open]);

  const m = t.tr(shown).find((x) => x.id === pay) ?? t.tr(shown)[0];
  const fee = Math.round(price * m.feePct) / 100;
  const total = price + fee;
  const short = m.id === "wallet" && money.wallet != null && total > money.wallet;
  const submit = async () => {
    const r = onPay(m.id);
    if (!(r instanceof Promise)) { onClose(); return; }
    setBusy(true); setError(null);
    try { await r; onClose(); } catch (e) { setError(errorText(e, t, usd)); } finally { setBusy(false); }
  };

  return (
    <div className={`fixed inset-0 z-[70] ${open ? "" : "pointer-events-none"}`} aria-hidden={!open} inert={!open}>
      <div onClick={onClose} className={`absolute inset-0 bg-slate-950/50 backdrop-blur-sm transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0"}`} />
      <div ref={dialog} role="dialog" aria-modal="true" aria-labelledby="pay-title"
        className={`absolute inset-x-0 bottom-0 max-h-[90vh] overflow-y-auto rounded-t-[2rem] bg-white p-6 shadow-2xl transition duration-300 ease-out sm:inset-x-auto sm:bottom-auto sm:start-1/2 sm:top-1/2 sm:w-[480px] sm:rounded-[2rem] dark:bg-[#0B1020]
          ${open ? "translate-y-0 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:opacity-100 sm:rtl:translate-x-1/2" : "translate-y-full sm:-translate-x-1/2 sm:-translate-y-[45%] sm:opacity-0 sm:rtl:translate-x-1/2"}`}>
        <span aria-hidden className="mx-auto mb-4 block h-1.5 w-12 rounded-full bg-slate-200 sm:hidden dark:bg-white/15" />
        <div className="flex items-center justify-between">
          <h2 id="pay-title" className="font-display text-xl font-semibold text-slate-900 dark:text-white">{t("Payment")}</h2>
          <button onClick={onClose} aria-label={t("Close")} className={`grid h-9 w-9 place-items-center rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-white/10 dark:text-slate-300 ${focus}`}><X className="h-5 w-5" /></button>
        </div>

        {summary && <div className="mt-5 flex items-center gap-3 rounded-2xl bg-slate-50 p-3 dark:bg-white/5">{summary}</div>}

        {needSignIn ? (
          <div className="mt-5 border-t border-slate-100 pt-5 dark:border-white/10">
            {account.status === "loading" ? <div className="h-40 animate-pulse rounded-2xl bg-slate-100 dark:bg-white/5" /> : <SignInForm />}
            <p className="mt-4 text-center text-xs text-slate-500 dark:text-slate-400">{t("Sign in to pay. Your choices stay as they are.")}</p>
          </div>
        ) : <>
        <div className="mt-5 text-xs font-semibold uppercase tracking-wide text-slate-400">{t("Pay with")}</div>
        <div role="radiogroup" aria-label={t("Payment method")} className="mt-2 space-y-2">
          {t.tr(shown).map((x) => {
            const on = m.id === x.id;
            return (
              <button key={x.id} role="radio" aria-checked={on} onClick={() => setPay(x.id)}
                className={`flex w-full items-center gap-3 rounded-2xl p-3.5 text-start transition ${focus} ${on ? "bg-indigo-50 ring-2 ring-indigo-500 dark:bg-indigo-500/10" : "ring-1 ring-slate-200 hover:ring-slate-300 dark:ring-white/10 dark:hover:ring-white/25"}`}>
                <span className={`grid h-10 w-10 place-items-center rounded-xl ${on ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-600 dark:bg-white/10 dark:text-slate-300"}`}><x.icon className="h-5 w-5" /></span>
                <span className="flex-1"><span className="block font-semibold text-slate-900 dark:text-white">{x.label}</span><span className="block text-xs text-slate-500 dark:text-slate-400">{x.id === "wallet" && money.wallet != null ? t("Balance {0}", { 0: usd(money.wallet) }) : x.desc}</span></span>
                {x.feePct > 0 && <span className="text-xs text-slate-500 dark:text-slate-400">+{x.feePct}{t("% fee")}</span>}
                <span className={`grid h-5 w-5 place-items-center rounded-full ring-2 ${on ? "bg-indigo-600 text-white ring-indigo-600" : "ring-slate-300 dark:ring-white/20"}`}>{on && <Check className="h-3 w-3" />}</span>
              </button>
            );
          })}
        </div>

        <dl className="mt-5 space-y-2 border-t border-slate-100 pt-4 text-sm dark:border-white/10">
          <div className="flex justify-between"><dt className="text-slate-500 dark:text-slate-400">{itemLabel}</dt><dd className="text-slate-900 dark:text-white">{usd(price)}</dd></div>
          <div className="flex justify-between"><dt className="text-slate-500 dark:text-slate-400">{t("Payment fee")}</dt><dd className="text-slate-900 dark:text-white">{fee ? usd(fee) : t("Free")}</dd></div>
          <div className="flex items-baseline justify-between pt-2"><dt className="font-semibold text-slate-900 dark:text-white">{t("Total")}</dt><dd className="font-display text-3xl font-bold text-slate-900 dark:text-white">{usd(total)}</dd></div>
        </dl>
        {short && (
          <div className="mt-3 flex items-start gap-2 rounded-xl bg-amber-50 p-3 text-xs text-amber-800 dark:bg-amber-500/10 dark:text-amber-300">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span className="flex-1">{shown.length > 2 ? t("Not enough in your wallet. Top up or choose Card or Crypto.")
              : shown.some((x) => x.id === "card") ? t("Not enough in your wallet. Top up, or pay by card.")
              : t("Not enough in your wallet. You need {amount} more.", { amount: usd(total - (money.wallet ?? 0)) })}</span>
            {topUpHref && <a href={topUpHref} className="flex shrink-0 items-center gap-1 font-semibold text-amber-900 underline-offset-2 hover:underline dark:text-amber-200"><Plus className="h-3.5 w-3.5" />{t("Top up wallet")}</a>}
          </div>
        )}
        {error && <p role="alert" className="mt-3 flex items-start gap-2 rounded-xl bg-rose-50 p-3 text-sm text-rose-700 dark:bg-rose-500/10 dark:text-rose-300"><AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />{error}</p>}

        <button onClick={submit} disabled={!price || short || busy}
          className={`mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-indigo-600 py-4 text-base font-semibold text-white shadow-lg shadow-indigo-600/25 transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-40 ${focus}`}>
          {busy ? <><Loader2 className="h-4 w-4 animate-spin" />{t(busyLabels?.[m.id] ?? busyLabel)}</> : <><Lock className="h-4 w-4" />{payLabel} {usd(total)}</>}
        </button>
        </>}
        {note && <p className="mt-3 text-center text-xs text-slate-500 dark:text-slate-400">{note}</p>}
      </div>
    </div>
  );
}
