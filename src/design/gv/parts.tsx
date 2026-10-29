"use client";
import { useState, type ReactNode } from "react";
import { Phone, Sparkles, Check, Eye, EyeOff, Loader2, ShieldCheck, Plus, MapPin } from "lucide-react";
import { GV_PRICE, gvSetup, type GvNumber } from "@/content/gv-en";
import { useMoney } from "@/lib/money";
import CheckoutModal from "@/components/checkout/CheckoutModal";
import { CopyButton } from "../otp/parts";
import type { GvOrder } from "./order";

export { PageShell, PageTitle, WalletChip } from "../otp/parts";

// Highlights `q` inside a formatted number (digits only matching).
export function NumberText({ n, q = "", className = "" }: { n: GvNumber; q?: string; className?: string }) {
  const digits = q.replace(/\D/g, "");
  if (!digits) return <span className={`font-mono ${className}`}>{n.number}</span>;
  // Map the match in the digit-only string back onto the formatted string.
  const map: number[] = []; [...n.number].forEach((ch, i) => /\d/.test(ch) && map.push(i));
  const at = n.number.replace(/\D/g, "").indexOf(digits);
  if (at < 0) return <span className={`font-mono ${className}`}>{n.number}</span>;
  const s = map[at], e = map[at + digits.length - 1] + 1;
  return <span className={`font-mono ${className}`}>{n.number.slice(0, s)}<mark className="rounded bg-amber-200 px-0.5 text-inherit dark:bg-amber-400/30">{n.number.slice(s, e)}</mark>{n.number.slice(e)}</span>;
}

export function EasyTag() {
  return <span className="inline-flex items-center gap-1 rounded-full bg-fuchsia-100 px-2 py-0.5 text-[10px] font-semibold text-fuchsia-700 dark:bg-fuchsia-500/15 dark:text-fuchsia-300"><Sparkles className="h-3 w-3" />Easy to remember</span>;
}

// One selectable number.
export function NumberChip({ n, on, onPick, q }: { n: GvNumber; on: boolean; onPick: () => void; q?: string }) {
  return (
    <button onClick={onPick} aria-pressed={on}
      className={`relative flex flex-col items-start gap-1 rounded-2xl p-4 text-start transition duration-200 ${on ? "bg-indigo-50 ring-2 ring-indigo-500 dark:bg-indigo-500/10" : "bg-white ring-1 ring-slate-200 hover:-translate-y-0.5 hover:ring-slate-300 dark:bg-[#0E1424] dark:ring-white/10 dark:hover:ring-white/25"}`}>
      {on && <span className="absolute end-3 top-3 grid h-5 w-5 place-items-center rounded-full bg-indigo-600 text-white"><Check className="h-3 w-3" /></span>}
      <NumberText n={n} q={q} className="text-base font-semibold text-slate-900 dark:text-white" />
      <span className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400"><MapPin className="h-3 w-3" />{n.area.city}, {n.area.state}</span>
      {n.easy && <EasyTag />}
    </button>
  );
}

export function GvCheckout({ open, onClose, number, onPay }: { open: boolean; onClose: () => void; number: GvNumber | null; onPay: Parameters<typeof CheckoutModal>[0]["onPay"] }) {
  return (
    <CheckoutModal open={open} onClose={onClose} price={number ? GV_PRICE : 0} itemLabel="Google Voice number" payLabel="Pay" note="Delivered in minutes. Replacement guarantee if the login doesn't work."
      onPay={onPay}
      summary={number && (
        <>
          <span className="grid h-11 w-11 place-items-center rounded-xl bg-sky-500 text-white"><Phone className="h-5 w-5" /></span>
          <div className="min-w-0 flex-1">
            <div className="truncate font-mono font-semibold text-slate-900 dark:text-white">{number.number}</div>
            <div className="truncate text-xs text-slate-500 dark:text-slate-400">Google Voice · {number.area.city}, {number.area.state}</div>
          </div>
        </>
      )} />
  );
}

function Secret({ label, value }: { label: string; value: string }) {
  const [show, setShow] = useState(false);
  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl bg-slate-50 px-4 py-3 dark:bg-white/5">
      <span className="min-w-0"><span className="block text-xs text-slate-500 dark:text-slate-400">{label}</span><span className="block truncate font-mono text-sm font-semibold text-slate-900 dark:text-white">{show ? value : "•".repeat(Math.min(14, value.length))}</span></span>
      <span className="flex gap-1.5">
        <button onClick={() => setShow((s) => !s)} aria-label={show ? `Hide ${label}` : `Show ${label}`} className="grid h-9 w-9 place-items-center rounded-lg bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-100 dark:bg-white/10 dark:text-slate-300 dark:ring-white/10">{show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button>
        <CopyButton text={value} label={`Copy ${label}`} />
      </span>
    </div>
  );
}

function Plain({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl bg-slate-50 px-4 py-3 dark:bg-white/5">
      <span className="min-w-0"><span className="block text-xs text-slate-500 dark:text-slate-400">{label}</span><span className="block truncate font-mono text-sm font-semibold text-slate-900 dark:text-white">{value}</span></span>
      <CopyButton text={value} label={`Copy ${label}`} />
    </div>
  );
}

// After paying: preparing, then the delivered account (number, login, setup steps).
export function GvDelivery({ order, onAnother, aside }: { order: GvOrder; onAnother: () => void; aside?: ReactNode }) {
  const usd = useMoney().format;
  const ready = order.status === "delivered" && order.login;
  return (
    <div className="grid animate-fade-up grid-cols-[minmax(0,1fr)] gap-6 [animation-duration:400ms] lg:grid-cols-[minmax(0,1fr)_340px]">
      <div className="rounded-[2rem] bg-white p-6 ring-1 ring-slate-200 sm:p-8 dark:bg-[#0E1424] dark:ring-white/10">
        <div className="flex flex-wrap items-center gap-2">
          <span className="flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300"><Check className="h-3.5 w-3.5" />Paid · {order.paidWith[0].toUpperCase() + order.paidWith.slice(1)} · {usd(order.price)}</span>
          {ready
            ? <span className="flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300"><Check className="h-3.5 w-3.5" />Delivered</span>
            : <span className="flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1.5 text-xs font-semibold text-amber-700 dark:bg-amber-500/15 dark:text-amber-300"><Loader2 className="h-3.5 w-3.5 animate-spin" />Preparing your account…</span>}
          <span className="ms-auto font-mono text-xs text-slate-400">#{order.id}</span>
        </div>
        <div className="mt-6 text-xs font-semibold uppercase tracking-wide text-slate-400">Your Google Voice number</div>
        <div className="mt-1 flex items-center justify-between gap-3"><span className="font-mono text-2xl font-bold text-slate-900 sm:text-3xl dark:text-white">{order.number.number}</span><CopyButton text={order.number.number} label="Copy number" /></div>
        <div className="text-sm text-slate-500 dark:text-slate-400">{order.number.area.city}, {order.number.area.stateName}</div>

        <div className="mt-6 space-y-2">
          {ready ? (
            <>
              <Plain label="Google account" value={order.login!.email} />
              <Secret label="Password" value={order.login!.password} />
              <Plain label="Recovery email" value={order.login!.recovery} />
            </>
          ) : [0, 1, 2].map((i) => <div key={i} className="h-[62px] animate-pulse rounded-2xl bg-slate-100 dark:bg-white/5" />)}
        </div>
        <p className="mt-4 flex items-start gap-2 text-xs text-slate-500 dark:text-slate-400"><ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />These details are also saved in your dashboard under My orders. Only you can see them.</p>
        <button onClick={onAnother} className="mt-6 flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-slate-700 ring-1 ring-slate-200 hover:ring-slate-300 dark:text-slate-200 dark:ring-white/15"><Plus className="h-4 w-4" />Buy another number</button>
      </div>

      <div className="space-y-4">
        <div className="rounded-3xl bg-white p-6 ring-1 ring-slate-200 dark:bg-[#0E1424] dark:ring-white/10">
          <h3 className="font-display text-lg font-semibold text-slate-900 dark:text-white">Set it up in 3 steps</h3>
          <ol className="mt-4 space-y-4">
            {gvSetup.map((s, i) => (
              <li key={i} className="flex gap-3 text-sm text-slate-600 dark:text-slate-300">
                <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-indigo-600 text-xs font-bold text-white">{i + 1}</span>{s}
              </li>
            ))}
          </ol>
        </div>
        {aside}
      </div>
    </div>
  );
}
