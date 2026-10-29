import { Zap, ShieldCheck, Headphones, Lock, Wallet, Award, type LucideIcon } from "lucide-react";

// Reasons to buy from ShopMajazi. The numbers are placeholders until we pull the real ones.
export type Reason = { id: string; icon: LucideIcon; title: string; desc: string; tint: string };

export const reasons: Reason[] = [
  { id: "speed", icon: Zap, title: "Instant delivery", desc: "Most orders are delivered automatically in under 30 seconds, day or night.", tint: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300" },
  { id: "refund", icon: ShieldCheck, title: "Refund guarantee", desc: "If a code never arrives or an order can't be delivered, the money goes straight back to your wallet.", tint: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300" },
  { id: "support", icon: Headphones, title: "Real people, 24/7", desc: "Live chat and Telegram support in English and Persian, with replies in about two minutes.", tint: "bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300" },
  { id: "private", icon: Lock, title: "Private and secure", desc: "Sold numbers leave circulation, and we never ask for your social-media passwords.", tint: "bg-indigo-100 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300" },
  { id: "pay", icon: Wallet, title: "Easy payment", desc: "Pay by card or crypto, or top up a wallet once and buy anything in one click.", tint: "bg-fuchsia-100 text-fuchsia-700 dark:bg-fuchsia-500/15 dark:text-fuchsia-300" },
  { id: "trust", icon: Award, title: "Trusted since 2018", desc: "Over a million orders delivered to customers in more than 150 countries.", tint: "bg-slate-200 text-slate-800 dark:bg-white/10 dark:text-slate-200" },
];

export const whyStats = [
  { value: 1200000, suffix: "+", label: "Orders delivered", format: "compact" as const },
  { value: 150, suffix: "+", label: "Countries" },
  { value: 30, prefix: "<", suffix: "s", label: "Average delivery" },
  { value: 4.9, suffix: "/5", label: "Customer rating", decimals: 1 },
];

// Comparison rows: what we offer vs. a typical alternative.
export const comparison = [
  { feature: "Delivery time", us: "Under 30 seconds", them: "Hours, sometimes days" },
  { feature: "Refund if nothing arrives", us: true, them: false },
  { feature: "Human support 24/7", us: true, them: "Email only" },
  { feature: "Numbers reused by others", us: false, them: true, invert: true },
  { feature: "Card, crypto and wallet payments", us: true, them: "Limited" },
  { feature: "Asks for your passwords", us: false, them: "Sometimes", invert: true },
];
