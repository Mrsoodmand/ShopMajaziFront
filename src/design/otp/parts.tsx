"use client";

import { useState, type ReactNode } from "react";
import { Copy, Check, X, MessageSquare, RotateCcw, Clock, ShieldCheck, Zap, Wallet } from "lucide-react";
import HeaderG from "../header/HeaderG";
import FooterF from "../footer/FooterF";
import type { OtpApp } from "@/content/otp-en";
import { useMoney } from "@/lib/money";
import { useCountdown, type Order } from "./order";
import { useExtras, useGlow } from "../service/slot";
import HeaderGlow from "../service/HeaderGlow";
import { useT } from "@/i18n/client";

// Full-page frame for the page designs: the chosen header (F) and footer (F) around the content. On live service
// pages, the shared sections (how to use, content, comments, FAQ, blog) come in through the extras slot.
// `heroDark`: the page opens on a dark hero behind the header, so the header starts with light text.
export function PageShell({ children, heroDark = false }: { children: ReactNode; heroDark?: boolean }) {
  const extras = useExtras();
  const glow = useGlow();
  return (
    <>
      <HeaderG overDark={heroDark} />
      <main className="relative isolate min-h-screen bg-[#F5F6FB] pt-16 dark:bg-[#070B14]">{glow && <HeaderGlow tone={glow} />}{children}{extras}</main>
      <FooterF />
    </>
  );
}

// App icon: the backend's logo when there is one, else a colored letter tile.
export function AppTile({ app, size = "md" }: { app: OtpApp; size?: "sm" | "md" | "lg" }) {
  const s = size === "lg" ? "h-14 w-14 rounded-2xl text-2xl" : size === "sm" ? "h-8 w-8 rounded-lg text-sm" : "h-11 w-11 rounded-xl text-lg";
  const pad = size === "lg" ? "p-2.5" : size === "sm" ? "p-1.5" : "p-2";
  if (app.image) {
    // eslint-disable-next-line @next/next/no-img-element
    return <span aria-hidden className={`grid shrink-0 place-items-center bg-white ring-1 ring-slate-200 dark:bg-white/90 dark:ring-white/10 ${s} ${pad}`}><img src={app.image} alt="" loading="lazy" className="h-full w-full object-contain" /></span>;
  }
  return <span aria-hidden className={`grid shrink-0 place-items-center font-display font-bold text-white ${app.color} ${s}`}>{app.letter}</span>;
}

// Country badge: the flag when there is one, else the ISO code.
export function CC({ cc, flag }: { cc: string; flag?: string }) {
  // eslint-disable-next-line @next/next/no-img-element
  if (flag) return <img src={flag} alt="" aria-hidden loading="lazy" className="h-5 w-7 shrink-0 rounded-[4px] object-cover ring-1 ring-black/10 dark:ring-white/15" />;
  return <span className="inline-grid h-6 min-w-8 place-items-center rounded-md bg-slate-900 px-1 font-mono text-[11px] font-bold text-white dark:bg-white/15">{cc}</span>;
}

export function SuccessBar({ pct }: { pct?: number }) {
  const tx = useT();
  if (pct == null) return null;
  const tone = pct >= 95 ? "bg-emerald-500" : pct >= 90 ? "bg-lime-500" : "bg-amber-500";
  return (
    <span className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400" title={tx("Share of numbers that received a code in the last 24 hours")}>
      <span className="h-1.5 w-12 overflow-hidden rounded-full bg-slate-200 dark:bg-white/10"><span className={`block h-full rounded-full ${tone}`} style={{ width: `${pct}%` }} /></span>{pct}%
    </span>
  );
}

export function WalletChip() {
  const tx = useT();
  const money = useMoney();
  if (money.wallet == null) return null;
  return <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-medium text-slate-600 ring-1 ring-slate-200 dark:bg-white/5 dark:text-slate-300 dark:ring-white/10"><Wallet className="h-3.5 w-3.5" />{tx("Wallet")}{" "}{money.format(money.wallet)}</span>;
}

export function CopyButton({ text, label }: { text: string; label: string }) {
  const [done, setDone] = useState(false);
  return (
    <button onClick={() => { navigator.clipboard?.writeText(text.replace(/\s|\(|\)/g, "")); setDone(true); setTimeout(() => setDone(false), 1500); }}
      aria-label={label} title={label}
      className="grid h-9 w-9 place-items-center rounded-lg bg-slate-100 text-slate-600 transition hover:bg-slate-200 dark:bg-white/10 dark:text-slate-300 dark:hover:bg-white/20">
      {done ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
    </button>
  );
}

// One live order: number, countdown ring, status, the code when it arrives, and cancel (refund) while waiting.
export function OrderCard({ order, onCancel, compact = false }: { order: Order; onCancel: () => void; compact?: boolean }) {
  const tx = useT();
  const waiting = order.status === "waiting";
  const { text, fraction } = useCountdown(order.expiresAt, waiting);
  const usd = useMoney().format;
  const C = 2 * Math.PI * 18;
  return (
    <div className={`animate-fade-up rounded-3xl bg-white ring-1 ring-slate-200 [animation-duration:350ms] dark:bg-[#0E1424] dark:ring-white/10 ${compact ? "p-4" : "p-5"}`}>
      <div className="flex items-center gap-3">
        <AppTile app={order.offer.app} size="sm" />
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-semibold text-slate-900 dark:text-white">{order.offer.app.name}</div>
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400"><CC cc={order.offer.country.cc} flag={order.offer.country.flag} />{order.offer.country.name}{order.operator && order.operator.id !== "any" ? ` · ${order.operator.name}` : ""} · {usd(order.offer.price)}</div>
        </div>
        {waiting && (
          <span className="relative grid h-11 w-11 place-items-center" title={tx("Time left to receive the code")}>
            <svg viewBox="0 0 40 40" className="absolute inset-0 -rotate-90"><circle cx="20" cy="20" r="18" className="fill-none stroke-slate-200 dark:stroke-white/10" strokeWidth="3" /><circle cx="20" cy="20" r="18" className="fill-none stroke-indigo-500 transition-[stroke-dashoffset] duration-1000 ease-linear" strokeWidth="3" strokeLinecap="round" strokeDasharray={C} strokeDashoffset={C * (1 - fraction)} /></svg>
            <span className="font-mono text-[10px] font-semibold text-slate-700 dark:text-slate-200">{text}</span>
          </span>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between gap-3 rounded-2xl bg-slate-50 px-4 py-3 dark:bg-white/5">
        <span className="font-mono text-lg font-semibold tracking-wide text-slate-900 dark:text-white">{order.number}</span>
        <CopyButton text={order.number} label={tx("Copy number")} />
      </div>

      {order.status === "waiting" && (
        <div className="mt-3 flex items-center justify-between gap-3">
          <span className="flex items-center gap-2 text-sm text-amber-600 dark:text-amber-400"><span className="relative flex h-2.5 w-2.5"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-70" /><span className="relative h-2.5 w-2.5 rounded-full bg-amber-500" /></span>{tx("Waiting for SMS…")}</span>
          <button onClick={onCancel} className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-500 hover:bg-rose-50 hover:text-rose-600 dark:text-slate-400 dark:hover:bg-rose-500/10 dark:hover:text-rose-300"><X className="h-3.5 w-3.5" />{tx("Cancel & refund")}</button>
        </div>
      )}
      {order.status === "received" && order.code && (
        <div className="mt-3 flex animate-fade-up items-center justify-between gap-3 rounded-2xl bg-emerald-600 px-4 py-3 text-white [animation-duration:400ms]">
          <span><span className="flex items-center gap-1.5 text-xs text-emerald-100"><MessageSquare className="h-3.5 w-3.5" />{tx("Your code")}</span><span className="font-mono text-2xl font-bold tracking-widest">{order.code}</span></span>
          <span className="[&_button]:bg-white/20 [&_button]:text-white [&_button:hover]:bg-white/30"><CopyButton text={order.code} label={tx("Copy code")} /></span>
        </div>
      )}
      {order.status === "cancelled" && (
        <div className="mt-3 flex items-center gap-2 rounded-2xl bg-slate-100 px-4 py-3 text-sm text-slate-600 dark:bg-white/5 dark:text-slate-300"><RotateCcw className="h-4 w-4 text-emerald-500" />{tx("Cancelled.")}{" "}{usd(order.offer.price)}{" "}{tx("is back in your wallet.")}</div>
      )}
    </div>
  );
}

export function EmptyOrders() {
  const tx = useT();
  return (
    <div className="rounded-3xl border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500 dark:border-white/15 dark:text-slate-400">
      <Clock className="mx-auto h-6 w-6 text-slate-400" />
      <div className="mt-2 font-medium text-slate-700 dark:text-slate-200">{tx("No active numbers")}</div>
      {tx("Pick an app and a country, and your number shows up here.")}
    </div>
  );
}

// Short reassurance strip shared by the page designs.
// `minutes`: how long a number waits for its code before the automatic refund.
export function Assurances({ minutes = 20 }: { minutes?: number }) {
  const tx = useT();
  const items = [[Zap, tx("Number in seconds"), tx("Delivered right after payment")], [ShieldCheck, tx("No code, no charge"), tx("Automatic refund after {minutes} minutes", { minutes })], [RotateCcw, tx("Cancel any time"), tx("Before the code arrives, full refund")]] as const;
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {items.map(([Icon, t, d]) => (
        <div key={t} className="flex items-center gap-3 rounded-2xl bg-white/70 p-4 ring-1 ring-slate-200 dark:bg-white/[.03] dark:ring-white/10">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-300"><Icon className="h-5 w-5" /></span>
          <span><span className="block text-sm font-semibold text-slate-900 dark:text-white">{t}</span><span className="block text-xs text-slate-500 dark:text-slate-400">{d}</span></span>
        </div>
      ))}
    </div>
  );
}

export function PageTitle({ kicker = "Virtual numbers", title, sub, center = false }: { kicker?: string; title: string; sub?: string; center?: boolean }) {
  const tx = useT();
  kicker = tx(kicker);
  return (
    <div className={center ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}>
      <span className="text-sm font-semibold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">{kicker}</span>
      <h1 className="mt-3 font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-5xl dark:text-white">{title}</h1>
      {sub && <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">{sub}</p>}
    </div>
  );
}
