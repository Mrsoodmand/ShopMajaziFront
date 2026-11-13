"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { Zap, ShieldCheck, CreditCard, Headphones, Lock, LayoutGrid, type LucideIcon } from "lucide-react";
import { useT } from "@/i18n/client";

// Shared kit for Why offers F–J (glossy app-icon tiles, soft white cards, big blue numbers).
// Reasons follow PRODUCT.md's positioning. Numbers are the same placeholders as content/why-en.ts.

export type Tone = "amber" | "green" | "blue" | "coral" | "violet" | "teal";

const TONES: Record<Tone, { grad: string; glow: string; ink: string; soft: string }> = {
  amber: { grad: "from-amber-300 to-orange-500", glow: "shadow-[0_14px_28px_-12px_rgba(249,115,22,.75)]", ink: "text-orange-500", soft: "bg-orange-50 dark:bg-orange-500/10" },
  green: { grad: "from-emerald-400 to-emerald-600", glow: "shadow-[0_14px_28px_-12px_rgba(16,185,129,.8)]", ink: "text-emerald-600 dark:text-emerald-400", soft: "bg-emerald-50 dark:bg-emerald-500/10" },
  blue: { grad: "from-sky-400 to-blue-600", glow: "shadow-[0_14px_28px_-12px_rgba(37,99,235,.8)]", ink: "text-blue-600 dark:text-blue-400", soft: "bg-blue-50 dark:bg-blue-500/10" },
  coral: { grad: "from-orange-300 to-rose-500", glow: "shadow-[0_14px_28px_-12px_rgba(244,63,94,.7)]", ink: "text-rose-500", soft: "bg-rose-50 dark:bg-rose-500/10" },
  violet: { grad: "from-fuchsia-400 to-violet-600", glow: "shadow-[0_14px_28px_-12px_rgba(139,92,246,.8)]", ink: "text-violet-600 dark:text-violet-400", soft: "bg-violet-50 dark:bg-violet-500/10" },
  teal: { grad: "from-teal-300 to-cyan-600", glow: "shadow-[0_14px_28px_-12px_rgba(8,145,178,.8)]", ink: "text-cyan-600 dark:text-cyan-400", soft: "bg-cyan-50 dark:bg-cyan-500/10" },
};
export const tone = (t: Tone) => TONES[t];

export type Reason = { id: string; icon: LucideIcon; tone: Tone; title: string; desc: string };

export const REASONS: Reason[] = [
  { id: "speed", icon: Zap, tone: "amber", title: "Delivered in seconds", desc: "Most orders are delivered automatically, day or night, with no waiting for an operator." },
  { id: "refund", icon: ShieldCheck, tone: "green", title: "Automatic refund", desc: "If a code never arrives or an order fails, the money goes straight back to your wallet." },
  { id: "pay", icon: CreditCard, tone: "blue", title: "No foreign card needed", desc: "Pay from your wallet, by bank card or with crypto. No PayPal, TON or Fragment account required." },
  { id: "support", icon: Headphones, tone: "coral", title: "Human support 24/7", desc: "Real people on Telegram and chat, in Persian and English, around the clock." },
  { id: "private", icon: Lock, tone: "violet", title: "No passwords, ever", desc: "Gifts and activations go to a username or email. We never ask for your login or codes." },
  { id: "catalog", icon: LayoutGrid, tone: "teal", title: "Everything in one place", desc: "Virtual numbers, Apple ID, Google Voice, subscriptions, Telegram Premium and social growth." },
];
export const reason = (id: string) => REASONS.find((r) => r.id === id)!;

// Placeholder figures (see PRODUCT.md › Evidence on hand).
export const STATS = [
  { id: "orders", value: 1200000, plus: true, label: "Orders delivered" },
  { id: "years", value: 8, plus: true, label: "Years of service" },
  { id: "speed", value: 30, label: "Seconds, average delivery" },
  { id: "support", value: 24, suffix: "/7", label: "Human support" },
] as const;
export const stat = (id: (typeof STATS)[number]["id"]) => STATS.find((s) => s.id === id)!;

// A glossy app-icon tile: brand gradient, a soft light along the top, a coloured shadow under it.
export function Glossy({ icon: Icon, tone: t, size = 56, className = "", children }: { icon?: LucideIcon; tone: Tone; size?: number; className?: string; children?: ReactNode }) {
  const c = TONES[t];
  return (
    <span
      className={`relative inline-grid shrink-0 place-items-center overflow-hidden rounded-[30%] bg-gradient-to-b text-white ring-1 ring-inset ring-white/25 ${c.grad} ${c.glow} ${className}`}
      style={{ width: size, height: size }}
    >
      <span aria-hidden className="absolute inset-x-[10%] top-[5%] h-[46%] rounded-[45%] bg-gradient-to-b from-white/45 to-white/0" />
      {Icon ? <Icon className="relative drop-shadow-[0_2px_2px_rgba(0,0,0,.2)]" style={{ width: size * 0.44, height: size * 0.44 }} strokeWidth={2.2} /> : <span className="relative font-display font-bold drop-shadow-[0_2px_2px_rgba(0,0,0,.2)]" style={{ fontSize: size * 0.32 }}>{children}</span>}
    </span>
  );
}

// True once the element has scrolled into view (stays true).
export function useInView<E extends HTMLElement = HTMLDivElement>(margin = "0px 0px -15% 0px") {
  const ref = useRef<E>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setSeen(true); io.disconnect(); } }, { rootMargin: margin });
    io.observe(el);
    return () => io.disconnect();
  }, [margin]);
  return [ref, seen] as const;
}

// Counts from 0 to `to` with an ease-out once `run` turns true; jumps straight there with reduced motion.
export function useCount(to: number, run: boolean, ms = 1600) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!run) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { setN(to); return; }
    let frame = 0;
    const t0 = performance.now();
    const step = (now: number) => {
      const p = Math.min(1, (now - t0) / ms);
      setN(to * (1 - Math.pow(1 - p, 3)));
      if (p < 1) frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [to, run, ms]);
  return n;
}

// "+1,200,000" in the page's digits. Always laid out left-to-right so the plus stays on the left, as in the refs.
export function BigNumber({ s, run = true, className = "" }: { s: (typeof STATS)[number]; run?: boolean; className?: string }) {
  const t = useT();
  const n = useCount(s.value, run);
  return (
    <span dir="ltr" className={`inline-flex items-baseline gap-2 font-display font-black tabular-nums tracking-tight ${className}`}>
      {"plus" in s && s.plus && <span className="opacity-90">+</span>}
      <span>{t.num(Math.round(n))}{"suffix" in s ? t.tr(s.suffix) : ""}</span>
    </span>
  );
}

// Eyebrow + title used above most offers.
export function WhyHeading({ title, sub, center = false }: { title: string; sub?: string; center?: boolean }) {
  const t = useT();
  return (
    <div className={center ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      <span className="text-sm font-semibold uppercase tracking-widest text-blue-600 dark:text-blue-400">{t("Why ShopMajazi")}</span>
      <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-white">{t(title)}</h2>
      {sub && <p className="mt-3 text-base leading-7 text-slate-600 dark:text-slate-400">{t(sub)}</p>}
    </div>
  );
}

export const card = "relative overflow-hidden rounded-[28px] bg-white ring-1 ring-slate-200/70 shadow-[0_1px_2px_rgba(15,23,42,.04)] dark:bg-[#0E1424] dark:ring-white/10";
export const pageBg = "bg-[#F5F6FB] dark:bg-[#070B14]";
