"use client";
import type { ComponentType } from "react";
import { ArrowRight, Clock, CreditCard, KeyRound, LogIn, Send, ShieldCheck, Sparkles, UserCheck, Zap, type LucideIcon } from "lucide-react";
import { subs, type SubProduct } from "@/content/subs-en";
import { useT } from "@/i18n/client";

// "How it's delivered" on the single subscription page (/accounts/{slug}). Gallery section "sub-how-delivered"
// (/design/sub-how-delivered) shows each style for all three ways a plan reaches the buyer; the live page
// (parts.tsx › HowDelivered) uses HOW_STYLE below.

type Step = { t: string; d: string; Icon: LucideIcon };
type How = { own: boolean; title: string; Icon: LucideIcon; steps: Step[]; when: string; note: string };

function useHow(p: SubProduct): How {
  const tx = useT();
  const how = p.activation;
  const field = p.fields.find((f) => !f.options && f.type !== "password");
  const when = p.delivery || tx("After payment, by our team");
  if (how === "own") return {
    own: true, title: tx("Activated on your own account"), Icon: UserCheck, when,
    note: "", // no note on own-account delivery (removed at the owner's request)
    steps: [
      { t: tx("You tell us your account"), d: field ? field.label : tx("Your account email"), Icon: UserCheck },
      { t: tx("We activate the plan"), d: when, Icon: Zap },
      { t: tx("Open {0}", { 0: p.name }), d: tx("The plan is on your account"), Icon: Sparkles },
    ],
  };
  if (how === "login") return {
    own: true, title: tx("Activated on your own account"), Icon: LogIn, when,
    note: tx("Change your password as soon as the plan is active."),
    steps: [
      { t: tx("You give us your login"), d: tx("The email and password of your {0} account", { 0: p.name }), Icon: LogIn },
      { t: tx("We activate the plan"), d: when, Icon: Zap },
      { t: tx("Change your password"), d: tx("Once the plan is on your account"), Icon: KeyRound },
    ],
  };
  return {
    own: false, title: tx("Delivered as a ready account"), Icon: KeyRound, when,
    note: tx("The login stays on your order page, so you can copy it again any time."),
    steps: [
      { t: tx("You pay"), d: tx("Online, in one step"), Icon: CreditCard },
      { t: tx("We send the login"), d: when, Icon: Send },
      { t: tx("Sign in"), d: tx("Copy it from your order page"), Icon: LogIn },
    ],
  };
}

const box = "rounded-3xl border border-slate-200 bg-white dark:border-white/15 dark:bg-[#0E1424]";
const title = "font-semibold text-slate-900 dark:text-white";
const muted = "text-sm text-slate-600 dark:text-slate-400";

function Note({ h, className = "" }: { h: How; className?: string }) {
  if (!h.note) return null;
  return <p className={`flex items-start gap-2 ${muted} ${className}`}><ShieldCheck aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />{h.note}</p>;
}

function When({ h }: { h: How }) {
  const tx = useT();
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-violet-50 px-3 py-1 text-[13px] font-semibold text-violet-800 dark:bg-violet-500/15 dark:text-violet-200">
      <Clock aria-hidden className="h-3.5 w-3.5" />{tx("Delivery")}: {h.when}
    </span>
  );
}

// A · Numbered row (current): three numbered steps side by side.
function Row({ p }: { p: SubProduct }) {
  const h = useHow(p);
  return (
    <div className={`${box} p-6`}>
      <p className={`flex items-center gap-2 ${title}`}><h.Icon aria-hidden className="h-5 w-5 text-violet-700 dark:text-violet-400" />{h.title}</p>
      <ol className="mt-5 grid gap-4 sm:grid-cols-3">
        {h.steps.map((st, i) => (
          <li key={st.t} className="flex gap-3">
            <span aria-hidden className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-slate-900 text-sm font-bold text-white dark:bg-white dark:text-slate-900">{i + 1}</span>
            <span><span className={`block ${title}`}>{st.t}</span><span className={muted}>{st.d}</span></span>
          </li>
        ))}
      </ol>
    </div>
  );
}

// B · Timeline: icon stops joined by a line (down the side on phones, across on wide screens), with the delivery
// time and a reassurance line under it.
function Timeline({ p }: { p: SubProduct }) {
  const h = useHow(p);
  return (
    <div className={`${box} p-6 sm:p-7`}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className={`flex items-center gap-2 ${title}`}><h.Icon aria-hidden className="h-5 w-5 text-violet-700 dark:text-violet-400" />{h.title}</p>
        <When h={h} />
      </div>
      <ol className="relative mt-7 grid gap-6 sm:grid-cols-3 sm:gap-4">
        {h.steps.map((st, i) => (
          <li key={st.t} className="relative flex gap-4 sm:flex-col sm:gap-3">
            {i < h.steps.length - 1 && <span aria-hidden className="absolute start-5 top-11 bottom-[-1.25rem] w-px bg-violet-200 sm:start-12 sm:end-[-1rem] sm:top-5 sm:bottom-auto sm:h-px sm:w-auto dark:bg-violet-400/25" />}
            <span aria-hidden className="relative grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-violet-600 text-white shadow-md shadow-violet-600/25 dark:bg-violet-500"><st.Icon className="h-5 w-5" /></span>
            <span>
              <span className="block text-xs font-semibold uppercase tracking-wider text-violet-700 dark:text-violet-300">{i + 1}</span>
              <span className={`block ${title}`}>{st.t}</span><span className={muted}>{st.d}</span>
            </span>
          </li>
        ))}
      </ol>
      <Note h={h} className="mt-6 border-t border-slate-200 pt-4 dark:border-white/10" />
    </div>
  );
}

// C · Step cards: each step its own soft card with a big icon, arrows between them on wide screens.
function Cards({ p }: { p: SubProduct }) {
  const tx = useT();
  const h = useHow(p);
  return (
    <div>
      <p className={`flex items-center gap-2 ${title}`}><h.Icon aria-hidden className="h-5 w-5 text-violet-700 dark:text-violet-400" />{h.title}</p>
      <ol className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto_1fr_auto_1fr] sm:items-stretch">
        {h.steps.map((st, i) => (
          <li key={st.t} className="contents">
            <div className={`${box} flex gap-4 p-5 sm:flex-col sm:gap-3`}>
              <span aria-hidden className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-violet-50 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300"><st.Icon className="h-6 w-6" /></span>
              <span>
                <span className="block text-xs font-semibold text-slate-500 dark:text-slate-400">{tx("Step {0}", { 0: i + 1 })}</span>
                <span className={`mt-0.5 block ${title}`}>{st.t}</span><span className={muted}>{st.d}</span>
              </span>
            </div>
            {i < h.steps.length - 1 && <span aria-hidden className="hidden place-items-center text-slate-300 sm:grid dark:text-white/20"><ArrowRight className="h-5 w-5 rtl:rotate-180" /></span>}
          </li>
        ))}
      </ol>
      <Note h={h} className="mt-4" />
    </div>
  );
}

// D · Summary + checklist: a tinted panel says how it works and how long it takes; the steps sit beside it as a
// short checklist.
function Split({ p }: { p: SubProduct }) {
  const tx = useT();
  const h = useHow(p);
  return (
    <div className={`${box} grid overflow-hidden md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]`}>
      <div className="bg-violet-50 p-6 dark:bg-violet-500/10">
        <span aria-hidden className="grid h-12 w-12 place-items-center rounded-2xl bg-white text-violet-700 shadow-sm dark:bg-white/10 dark:text-violet-300"><h.Icon className="h-6 w-6" /></span>
        <p className="mt-4 font-display text-lg font-bold text-slate-900 dark:text-white">{h.title}</p>
        <p className="mt-3 flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300"><Clock aria-hidden className="h-4 w-4 shrink-0 text-violet-700 dark:text-violet-300" />{tx("Delivery")}: <b className="font-semibold">{h.when}</b></p>
        <Note h={h} className="mt-2" />
      </div>
      <ol className="divide-y divide-slate-200 p-2 dark:divide-white/10">
        {h.steps.map((st, i) => (
          <li key={st.t} className="flex items-center gap-4 px-4 py-4">
            <span aria-hidden className="grid h-9 w-9 shrink-0 place-items-center rounded-full border-2 border-violet-200 text-sm font-bold text-violet-700 dark:border-violet-400/30 dark:text-violet-300">{i + 1}</span>
            <span className="min-w-0 flex-1"><span className={`block ${title}`}>{st.t}</span><span className={muted}>{st.d}</span></span>
            <st.Icon aria-hidden className="h-5 w-5 shrink-0 text-slate-400 dark:text-slate-500" />
          </li>
        ))}
      </ol>
    </div>
  );
}

// E · Progress track: one bar with three stops, like an order tracker; labels sit under each stop.
function Track({ p }: { p: SubProduct }) {
  const h = useHow(p);
  return (
    <div className={`${box} p-6 sm:p-7`}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className={`flex items-center gap-2 ${title}`}><h.Icon aria-hidden className="h-5 w-5 text-violet-700 dark:text-violet-400" />{h.title}</p>
        <When h={h} />
      </div>
      <ol className="relative mt-8 grid grid-cols-3 gap-2 text-center">
        <span aria-hidden className="absolute inset-x-[16.6%] top-5 h-1 rounded-full bg-gradient-to-r from-violet-600 via-violet-400 to-emerald-500 rtl:bg-gradient-to-l" />
        {h.steps.map((st, i) => (
          <li key={st.t} className="relative flex flex-col items-center">
            <span aria-hidden className={`grid h-11 w-11 place-items-center rounded-full ring-4 ring-white dark:ring-[#0E1424] ${i === h.steps.length - 1 ? "bg-emerald-600 text-white dark:bg-emerald-500" : "bg-violet-600 text-white dark:bg-violet-500"}`}><st.Icon className="h-5 w-5" /></span>
            <span className={`mt-3 block text-[15px] ${title}`}>{st.t}</span>
            <span className={`mt-0.5 block text-[13px] leading-5 text-slate-600 dark:text-slate-400`}>{st.d}</span>
          </li>
        ))}
      </ol>
      <Note h={h} className="mt-6 justify-center text-center" />
    </div>
  );
}

export const howStyles: Record<string, ComponentType<{ p: SubProduct }>> = { A: Row, B: Timeline, C: Cards, D: Split, E: Track };

// The style the live page uses (design/decisions.json › sub-how-delivered).
export const HOW_STYLE: keyof typeof howStyles = "E";

// Gallery: one sample product for each way a plan is delivered.
function Demo({ style }: { style: string }) {
  const Style = howStyles[style];
  const samples = (["own", "login", "ready"] as const).map((a) => subs.find((s) => s.activation === a)).filter((s): s is SubProduct => !!s);
  return (
    <div className="mx-auto max-w-4xl space-y-8">
      {samples.map((p) => (
        <div key={p.slug}>
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400">{p.name}</p>
          <Style p={p} />
        </div>
      ))}
    </div>
  );
}

export const DeliveredA = () => <Demo style="A" />;
export const DeliveredB = () => <Demo style="B" />;
export const DeliveredC = () => <Demo style="C" />;
export const DeliveredD = () => <Demo style="D" />;
export const DeliveredE = () => <Demo style="E" />;
