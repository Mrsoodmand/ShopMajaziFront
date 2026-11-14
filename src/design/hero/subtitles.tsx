"use client";

import { Fragment, type ReactNode } from "react";
import { Headphones, ShieldCheck, Zap } from "lucide-react";
import { useT } from "@/i18n/client";

// Styles for the line under the home headline (gallery section hero-subtitle):
// «خرید مطمئن، تحویل آنی و پشتیبانی واقعی؛ همه‌چیز همون‌طور که انتظار داری.»
// The three promises are the special words; the ending is the quieter part. Each style arrives after the headline
// (blur-in) and then plays its own small effect once. The sentence is in the page once, as plain text.
export type SubStyle = "chips" | "marker" | "gradient" | "icons";

function useParts() {
  const t = useT();
  const fa = t.locale === "fa";
  return {
    promises: [t("Safe buying"), t("instant delivery"), t("real support")],
    seps: fa ? ["، ", " و ", "؛ "] : [", ", " and ", ": "],
    tail: t("everything just as you'd expect."),
  };
}

const arrive = (ms: number) => ({ animationDelay: `${ms}ms` });

// The line with each promise wrapped by `mark`.
function Line({ mark, className = "", tailCls = "" }: { mark: (text: string, i: number) => ReactNode; className?: string; tailCls?: string }) {
  const { promises, seps, tail } = useParts();
  return (
    <p className={`mx-auto mt-5 max-w-2xl animate-blur-in [animation-delay:350ms] ${className}`}>
      {promises.map((p, i) => <Fragment key={p}>{mark(p, i)}{seps[i]}</Fragment>)}
      <span className={tailCls}>{tail}</span>
    </p>
  );
}

// A · Soft chips: each promise sits in a pale tint that lights up one after another.
const chipTint = [
  "bg-emerald-50 text-emerald-800 ring-emerald-200/70 dark:bg-emerald-400/10 dark:text-emerald-200 dark:ring-emerald-400/20",
  "bg-amber-50 text-amber-800 ring-amber-200/70 dark:bg-amber-400/10 dark:text-amber-200 dark:ring-amber-400/20",
  "bg-indigo-50 text-indigo-800 ring-indigo-200/70 dark:bg-indigo-400/10 dark:text-indigo-200 dark:ring-indigo-400/20",
];
function Chips() {
  return (
    <Line className="text-lg leading-loose text-slate-600 dark:text-slate-400"
      mark={(p, i) => <span className={`inline-block animate-blur-in rounded-lg px-2 py-0.5 font-semibold ring-1 ${chipTint[i]}`} style={arrive(800 + i * 180)}>{p}</span>} />
  );
}

// B · Highlighter: a soft marker stroke draws under each promise, start to end, after the line has arrived.
function Marker() {
  return (
    <Line className="text-lg text-slate-600 dark:text-slate-400"
      mark={(p, i) => (
        <span className="relative isolate inline-block font-semibold text-slate-900 dark:text-white">
          <span aria-hidden className="absolute inset-x-[-0.15em] bottom-[0.08em] -z-10 h-[0.42em] animate-mark-in rounded-sm bg-amber-300/60 ltr:origin-left rtl:origin-right dark:bg-indigo-400/40" style={arrive(900 + i * 260)} />
          {p}
        </span>
      )} />
  );
}

// C · Display line: the subtitle in the headline's font, a size up; the promises in the headline gradient with a
// slow sheen passing through them once.
function Gradient() {
  return (
    <Line className="font-display text-xl font-medium text-slate-700 sm:text-2xl dark:text-slate-300" tailCls="mt-1 block text-lg font-normal text-slate-500 sm:text-xl dark:text-slate-400"
      mark={(p, i) => <span className="animate-text-sheen whitespace-nowrap bg-[linear-gradient(110deg,#4f46e5_0%,#d946ef_45%,#fdf4ff_50%,#d946ef_55%,#4f46e5_100%)] bg-[length:250%_100%] bg-clip-text font-semibold text-transparent dark:bg-[linear-gradient(110deg,#a5b4fc_0%,#f0abfc_45%,#ffffff_50%,#f0abfc_55%,#a5b4fc_100%)]" style={arrive(900 + i * 150)}>{p}</span>} />
  );
}

// D · Icon row: the three promises as a row with coloured icons, the ending on its own quieter line.
function Icons() {
  const { promises, tail } = useParts();
  const items = [
    { Icon: ShieldCheck, cls: "text-emerald-600 dark:text-emerald-400" },
    { Icon: Zap, cls: "text-amber-500 dark:text-amber-300" },
    { Icon: Headphones, cls: "text-indigo-600 dark:text-indigo-300" },
  ];
  return (
    <div className="mx-auto mt-6">
      <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-lg font-semibold text-slate-800 dark:text-slate-100">
        {promises.map((p, i) => {
          const { Icon, cls } = items[i];
          return (
            <li key={p} className="flex animate-blur-in items-center gap-2" style={arrive(350 + i * 120)}>
              <span className={`grid h-8 w-8 place-items-center rounded-full bg-white shadow-sm ring-1 ring-slate-200 dark:bg-white/5 dark:ring-white/10 ${cls}`}><Icon aria-hidden className="h-4 w-4" /></span>{p}
            </li>
          );
        })}
      </ul>
      <p className="mt-3 animate-blur-in text-base text-slate-500 [animation-delay:800ms] dark:text-slate-400">{tail}</p>
    </div>
  );
}

export function HeroSubtitle({ look }: { look: SubStyle }) {
  return look === "chips" ? <Chips /> : look === "marker" ? <Marker /> : look === "gradient" ? <Gradient /> : <Icons />;
}
