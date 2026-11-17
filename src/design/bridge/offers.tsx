"use client";

import { useId, type ReactNode } from "react";
import { Apple, ChevronDown, Crown, Globe, Instagram, KeyRound, Phone, Smartphone, Star, Tv } from "lucide-react";
import { LocaleProvider, useT } from "@/i18n/client";
import { BrandMark } from "@/components/brand/Brand";
import { WhyHeading, pageBg } from "../why/parts";

// Hero bridge: a small moving element for the empty band between the home hero and the section under it
// (gallery section "hero-bridge"). Every bridge is decoration only (aria-hidden) and sits on the page colour,
// so there is no seam above or below it. The edge fade (mask) goes on an inner box: on the outer one it would fade
// the page colour too and show the white behind it.

// A · Scroll Thread: a hairline drops from the hero, a bright dot runs down it, and it ends in a bobbing arrow.
export function BridgeThread() {
  return (
    <div aria-hidden className={`${pageBg} flex flex-col items-center`}>
      <div className="relative h-24 w-px bg-gradient-to-b from-transparent via-indigo-300 to-indigo-500 dark:via-indigo-500/50 dark:to-indigo-400">
        <span className="absolute -start-[3px] top-0 h-[7px] w-[7px] animate-[thread-drop_2.4s_ease-in_infinite] rounded-full bg-fuchsia-500 shadow-[0_0_12px_2px_rgba(217,70,239,.6)]" />
      </div>
      <span className="mt-2 grid h-10 w-10 animate-[why-bob_2.4s_ease-in-out_infinite] place-items-center rounded-full border border-indigo-200 bg-white text-indigo-600 shadow-sm dark:border-white/10 dark:bg-[#0E1424] dark:text-indigo-300">
        <ChevronDown className="h-5 w-5" />
      </span>
    </div>
  );
}

// B · Service Marquee: the catalog's names drifting slowly past, fading out at both edges.
const services = [
  { icon: Smartphone, name: "Virtual numbers", cls: "text-emerald-600 dark:text-emerald-400" },
  { icon: Apple, name: "Apple ID", cls: "text-slate-800 dark:text-slate-200" },
  { icon: Phone, name: "Google Voice", cls: "text-blue-600 dark:text-blue-400" },
  { icon: Star, name: "Telegram Stars", cls: "text-amber-500 dark:text-amber-300" },
  { icon: Crown, name: "Telegram Premium", cls: "text-sky-500 dark:text-sky-300" },
  { icon: Instagram, name: "Instagram", cls: "text-pink-600 dark:text-pink-400" },
  { icon: Tv, name: "Subscriptions", cls: "text-violet-600 dark:text-violet-400" },
  { icon: KeyRound, name: "Rent a number", cls: "text-teal-600 dark:text-teal-400" },
  { icon: Globe, name: "Static IP", cls: "text-indigo-600 dark:text-indigo-300" },
];
export function BridgeMarquee() {
  const t = useT();
  // Four copies: the track moves by half its width, so two copies always cover even a very wide screen.
  const row = [...services, ...services, ...services, ...services];
  return (
    <div aria-hidden className={pageBg}>
    <div dir="ltr" className="overflow-hidden py-4 [mask-image:linear-gradient(90deg,transparent,#000_14%,#000_86%,transparent)]">
      <div className="flex w-max animate-[marquee_60s_linear_infinite] hover:[animation-play-state:paused]">
        {row.map((s, i) => (
          <div key={i} className="pe-3">
            <span className="flex items-center gap-2 whitespace-nowrap rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm dark:border-white/10 dark:bg-white/5 dark:text-slate-200">
              <s.icon className={`h-4 w-4 ${s.cls}`} />{t(s.name)}
            </span>
          </div>
        ))}
      </div>
    </div>
    </div>
  );
}

// C · Beam Line: a hairline across the page with a light running along it and the logo glowing in the middle.
export function BridgeBeam() {
  return (
    <div aria-hidden className={`${pageBg} py-4`}>
      <div className="relative mx-auto max-w-6xl px-6">
        <div className="absolute inset-x-6 top-1/2 h-0.5 -translate-y-1/2 overflow-hidden bg-[linear-gradient(90deg,transparent,#c7d2fe_20%,#c7d2fe_80%,transparent)] dark:bg-[linear-gradient(90deg,transparent,rgba(129,140,248,.35)_20%,rgba(129,140,248,.35)_80%,transparent)]">
          <span className="absolute top-0 h-full w-48 animate-[bridge-sweep_5s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-fuchsia-500 to-transparent" />
        </div>
        <div className="relative mx-auto grid h-14 w-14 animate-glow place-items-center rounded-2xl bg-white shadow-lg ring-1 ring-slate-200 dark:bg-[#0E1424] dark:ring-white/10" style={{ "--glow": "rgba(99,102,241,.45)" } as React.CSSProperties}>
          <BrandMark className="h-8 w-8" />
        </div>
      </div>
    </div>
  );
}

// D · Soft Wave: two thin gradient waves rolling across at different speeds.
const wave = (amp: number) => {
  let d = `M0 40 Q150 ${40 - amp} 300 40`;
  for (let x = 600; x <= 2400; x += 300) d += ` T${x} 40`;
  return d;
};
export function BridgeWave() {
  const id = useId();
  return (
    <div aria-hidden className={pageBg}>
    <div dir="ltr" className="relative h-20 overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_18%,#000_82%,transparent)]">
      {[{ amp: 34, dur: "18s", op: 1 }, { amp: -22, dur: "28s", op: 0.5 }].map((w, i) => (
        <svg key={i} viewBox="0 0 2400 80" preserveAspectRatio="none" className="absolute inset-y-0 left-0 h-full w-[200%] min-w-[2400px]" style={{ animation: `wave-roll ${w.dur} linear infinite`, opacity: w.op }}>
          <defs>
            <linearGradient id={`${id}-${i}`} x1="0" x2="1">
              <stop offset="0" stopColor="#6366f1" /><stop offset=".25" stopColor="#d946ef" /><stop offset=".5" stopColor="#6366f1" /><stop offset=".75" stopColor="#d946ef" /><stop offset="1" stopColor="#6366f1" />
            </linearGradient>
          </defs>
          <path d={wave(w.amp)} fill="none" stroke={`url(#${id}-${i})`} strokeWidth="2" vectorEffect="non-scaling-stroke" />
        </svg>
      ))}
    </div>
    </div>
  );
}

// E · Twinkle Field: a quiet scatter of small dots that light up and dim, densest in the middle.
const dots = [
  [6, 30, 4, 0], [12, 70, 6, 1.1], [19, 22, 3, 2.0], [25, 58, 5, 0.4], [31, 82, 3, 1.6], [37, 34, 6, 2.4], [43, 66, 4, 0.9],
  [49, 18, 5, 1.9], [52, 50, 8, 0.2], [57, 80, 3, 2.7], [62, 30, 5, 1.3], [68, 62, 4, 0.6], [73, 16, 3, 2.2], [78, 74, 6, 1.0],
  [84, 40, 4, 1.8], [89, 68, 3, 0.3], [94, 26, 5, 2.5],
];
const dotTone = ["bg-indigo-500", "bg-fuchsia-500", "bg-blue-500"];
export function BridgeTwinkle() {
  return (
    <div aria-hidden className={pageBg}>
    <div className="relative mx-auto h-28 max-w-6xl [mask-image:radial-gradient(60%_90%_at_50%_50%,#000_30%,transparent)]">
      {dots.map(([x, y, size, delay], i) => (
        <span key={i} className={`absolute animate-twinkle rounded-full ${dotTone[i % 3]}`} style={{ left: `${x}%`, top: `${y}%`, width: size, height: size, animationDelay: `${delay}s` }} />
      ))}
    </div>
    </div>
  );
}

// Gallery frame: the bottom edge of the hero's catalog card, the bridge, then the Why heading, in Persian like the site.
function Frame({ children }: { children: ReactNode }) {
  return (
    <div dir="rtl" lang="fa">
      <LocaleProvider locale="fa">
        <div className={pageBg}>
          <div className="mx-auto max-w-6xl px-6">
            <div className="h-20 rounded-b-[2rem] border border-t-0 border-slate-200 bg-white shadow-[0_30px_60px_-30px_rgba(99,102,241,.35)] dark:border-white/10 dark:bg-[#0E1424]" />
          </div>
          <div className="pt-12">{children}</div>
          <div className="mx-auto max-w-6xl px-6 pb-14 pt-12"><WhyHeading title="Built so you never have to wait or worry" /></div>
        </div>
      </LocaleProvider>
    </div>
  );
}
export const BridgeA = () => <Frame><BridgeThread /></Frame>;
export const BridgeB = () => <Frame><BridgeMarquee /></Frame>;
export const BridgeC = () => <Frame><BridgeBeam /></Frame>;
export const BridgeD = () => <Frame><BridgeWave /></Frame>;
export const BridgeE = () => <Frame><BridgeTwinkle /></Frame>;
