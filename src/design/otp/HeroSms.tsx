"use client";

import { Check, MessageSquare, Smartphone } from "lucide-react";
import type { OtpApp } from "@/content/otp-en";
import { AppTile } from "./parts";

// Virtual-number hero: a phone showing the chosen app, and an SMS bubble whose code dots fill in, then a check.
// It plays when the page opens and again each time the buyer picks another app (keyed on the app), then rests
// still: a response to the pick, not ambient motion. Keyframes sms-* in globals.css; under reduced motion the
// final state shows right away. Purely decorative (aria-hidden).
// `mini` is the bubble alone, for narrow screens.

const ease = "cubic-bezier(0.16,1,0.3,1)";
const at = (ms: number, name: string, dur = 500) => ({ animation: `${name} ${dur}ms ${ease} ${ms}ms both` });

function Dots({ from }: { from: number }) {
  return (
    <span className="flex items-center gap-1 text-emerald-500 dark:text-emerald-400">
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <span key={i} className={`h-1.5 w-1.5 rounded-full bg-current ${i === 3 ? "ms-1.5" : ""}`} style={at(from + i * 90, "sms-dot", 320)} />
      ))}
    </span>
  );
}

function Tick({ delay }: { delay: number }) {
  return (
    <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-emerald-500 text-white" style={at(delay, "sms-tick", 420)}>
      <Check className="h-3 w-3" strokeWidth={3} />
    </span>
  );
}

const bubble = "flex items-center gap-2.5 rounded-2xl bg-white px-3 py-2 shadow-[0_10px_28px_-12px_rgba(15,23,42,.35)] ring-1 ring-slate-200 dark:bg-[#111a2e] dark:shadow-[0_10px_28px_-12px_rgba(0,0,0,.7)] dark:ring-white/10";

export default function HeroSms({ app, mini = false }: { app: OtpApp | null; mini?: boolean }) {
  const icon = app ? <AppTile app={app} size="sm" /> : <span className="grid h-8 w-8 place-items-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-300"><Smartphone className="h-4 w-4" /></span>;

  if (mini)
    return (
      <div aria-hidden key={app?.id ?? "none"} className={bubble} style={at(0, "sms-in", 600)}>
        {icon}
        <Dots from={350} />
        <Tick delay={350 + 6 * 90 + 120} />
      </div>
    );

  return (
    <div aria-hidden key={app?.id ?? "none"} className="relative h-[150px] w-[230px] shrink-0">
      {/* The phone */}
      <div className="absolute end-3 top-0 h-[150px] w-[88px] rounded-[24px] bg-slate-900 p-[5px] shadow-[0_22px_44px_-20px_rgba(30,27,75,.55)] ring-1 ring-slate-900/10 dark:bg-slate-700 dark:ring-white/10" style={at(0, "sms-phone", 700)}>
        <div className="relative flex h-full flex-col items-center rounded-[19px] bg-white pt-7 dark:bg-[#0b1120]">
          <span className="absolute top-2 h-1 w-7 rounded-full bg-slate-200 dark:bg-white/10" />
          <span style={at(180, "sms-tile", 520)}>{app ? <AppTile app={app} /> : <span className="grid h-11 w-11 place-items-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-300"><Smartphone className="h-5 w-5" /></span>}</span>
          <span className="mt-3 h-1.5 w-12 rounded-full bg-slate-200 dark:bg-white/10" />
          <span className="mt-1.5 h-1.5 w-8 rounded-full bg-slate-100 dark:bg-white/5" />
          {/* One ring when the code lands */}
          <span className="absolute inset-0 rounded-[19px] opacity-0 ring-2 ring-emerald-400/70" style={at(1300, "sms-ring", 900)} />
        </div>
      </div>
      {/* The SMS, sliding out from the phone's start side */}
      <div className={`absolute bottom-5 start-0 ${bubble}`} style={at(520, "sms-in", 600)}>
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-300"><MessageSquare className="h-4 w-4" /></span>
        <Dots from={760} />
        <Tick delay={760 + 6 * 90 + 120} />
      </div>
    </div>
  );
}
