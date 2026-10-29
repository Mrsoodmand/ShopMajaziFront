"use client";

import type { CSSProperties } from "react";
import type { SocialCategory } from "@/content/social-categories-en";

// One large object behind the Search Spotlight hero (C), chosen in /design/page-social-list-hero-object.
// Each sits under the title, search and icons, fades out before the cards, and is hidden from screen readers.
// Reduced motion shows every object finished and still (globals.css stops the animations; the still versions
// below are drawn for that case).

export type ObjectId = "none" | "globe" | "orb" | "curve" | "halo" | "pulse";

const shell = "pointer-events-none absolute inset-0 -z-10 overflow-hidden";
const fadeBottom = "[mask-image:linear-gradient(to_bottom,black_55%,transparent)]";

// ---------- A · Globe ----------
// A wireframe globe turning slowly behind the title: the audience is everywhere. Meridians narrow and widen in turn,
// which reads as rotation; a few brand-coloured points glow on it like live orders.

const R = 300;
const meridians = 6;
const period = 36; // seconds for half a turn
const lats = [-60, -40, -20, 0, 20, 40, 60];
// Rough lightness (0–1) of a #rrggbb colour; anything else counts as light.
const light = (hex: string) => {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex ?? "");
  if (!m) return 1;
  const n = parseInt(m[1], 16);
  return (0.2126 * (n >> 16) + 0.7152 * ((n >> 8) & 255) + 0.0722 * (n & 255)) / 255;
};

function Globe({ cats }: { cats: SocialCategory[] }) {
  // Near-black brand colours (TikTok, X) read as holes on the globe, so only coloured brands get a point.
  const dots = cats.filter((c) => c.featured && light(c.color) > 0.12).slice(0, 4);
  // Kept near the rim, clear of the centred title and subtitle.
  const spots = [{ x: -262, y: -70 }, { x: 255, y: 60 }, { x: -232, y: 150 }, { x: 236, y: -150 }];
  return (
    <div aria-hidden className={`${shell} ${fadeBottom}`}>
      <svg viewBox="-340 -340 680 680" className="absolute left-1/2 top-[-4rem] w-[min(54rem,150vw)] -translate-x-1/2 animate-[obj-in_1.6s_cubic-bezier(0.22,1,0.36,1)_backwards] text-indigo-500/25 sm:top-[-6rem] dark:text-indigo-300/20">
        <defs>
          <radialGradient id="globe-fill" cx="35%" cy="25%" r="80%">
            <stop offset="0" stopColor="rgb(99 102 241 / .10)" />
            <stop offset="1" stopColor="rgb(99 102 241 / 0)" />
          </radialGradient>
        </defs>
        <g transform="rotate(-16)" fill="none" stroke="currentColor" strokeWidth="1">
          <circle r={R} fill="url(#globe-fill)" />
          {lats.map((l) => {
            const rad = (l * Math.PI) / 180;
            return <ellipse key={l} cy={R * Math.sin(rad)} rx={R * Math.cos(rad)} ry={R * Math.cos(rad) * 0.16} />;
          })}
          {/* Turning meridians */}
          <g className="motion-reduce:hidden">
            {Array.from({ length: meridians }, (_, i) => (
              <ellipse key={i} rx={R} ry={R} style={{ transformBox: "fill-box", transformOrigin: "center", animation: `obj-meridian ${period}s infinite`, animationDelay: `${-(i * period) / meridians}s` }} />
            ))}
          </g>
          {/* Still meridians for reduced motion */}
          <g className="hidden motion-reduce:inline">
            {Array.from({ length: meridians }, (_, i) => <ellipse key={i} rx={Math.abs(R * Math.sin((i * Math.PI) / meridians + 0.26))} ry={R} />)}
          </g>
        </g>
        {dots.map((c, i) => (
          <g key={c.slug} transform={`translate(${spots[i].x} ${spots[i].y})`}>
            <circle r="12" fill={c.color} opacity=".14" />
            <circle r="8" fill="none" stroke={c.color} strokeWidth="1.5" opacity="0" style={{ transformBox: "fill-box", transformOrigin: "center", animation: "obj-ping 4s ease-out infinite", animationDelay: `${i * 1.1}s` }} />
            <circle r="4" fill={c.color} opacity=".7" />
          </g>
        ))}
      </svg>
    </div>
  );
}

// ---------- B · Rising Orb ----------
// The curve of a huge planet rises behind the search like a horizon, its rim lit in indigo. One slow rise on load.

function Orb() {
  return (
    <div aria-hidden className={shell}>
      <div className="absolute left-1/2 top-[58%] aspect-square w-[max(70rem,180vw)] -translate-x-1/2 animate-[obj-rise_1.8s_cubic-bezier(0.22,1,0.36,1)_backwards] rounded-full bg-[radial-gradient(circle_at_50%_0%,#eef2ff,#F5F6FB_22%)] shadow-[inset_0_2px_0_rgba(99,102,241,.45),0_-40px_120px_-20px_rgba(99,102,241,.35)] sm:top-[52%] dark:bg-[radial-gradient(circle_at_50%_0%,#151b3a,#070B14_22%)] dark:shadow-[inset_0_1.5px_0_rgba(165,180,252,.55),0_-40px_140px_-20px_rgba(99,102,241,.45)]" />
    </div>
  );
}

// ---------- C · Growth Curve ----------
// One long line climbing across the hero from the bottom corner, like a follower graph; it draws itself in, a few
// brand-coloured points mark the way and the last one keeps pulsing. Mirrors in Persian.

const curve = "M0 470 C 140 460 200 400 300 395 S 460 330 560 300 S 760 250 860 170 S 1060 90 1200 40";
// Points sit at the two ends of the line, clear of the centred text.
const marks = [{ x: 14, y: 89 }, { x: 86, y: 21 }];

function Curve({ cats }: { cats: SocialCategory[] }) {
  const colors = cats.filter((c) => c.featured).map((c) => c.color);
  const last = { x: 100, y: 8 };
  return (
    <div aria-hidden className={`${shell} ${fadeBottom} rtl:-scale-x-100`}>
      <div className="absolute inset-x-0 top-[12%] bottom-0">
        <svg viewBox="0 0 1200 500" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
          <defs>
            <linearGradient id="curve-area" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="rgb(99 102 241 / .14)" />
              <stop offset="1" stopColor="rgb(99 102 241 / 0)" />
            </linearGradient>
            <linearGradient id="curve-line" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="rgb(99 102 241 / .15)" />
              <stop offset=".35" stopColor="rgb(99 102 241 / .6)" />
              <stop offset="1" stopColor="rgb(16 185 129 / .8)" />
            </linearGradient>
          </defs>
          <path d={`${curve} L1200 500 L0 500 Z`} fill="url(#curve-area)" className="animate-[obj-fade_2.4s_1s_ease-out_backwards]" />
          <path d={curve} pathLength={1} fill="none" stroke="url(#curve-line)" strokeWidth="2" vectorEffect="non-scaling-stroke" strokeDasharray="1" className="animate-[obj-draw_2.6s_cubic-bezier(0.45,0,0.2,1)_backwards]" />
        </svg>
        {marks.map((m, i) => (
          <span key={i} style={{ left: `${m.x}%`, top: `${m.y}%`, backgroundColor: colors[i % Math.max(colors.length, 1)] ?? "#6366f1", animationDelay: `${0.6 + i * 0.6}s` }} className="absolute h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 animate-[obj-pop_.6s_cubic-bezier(0.22,1,0.36,1)_backwards] rounded-full opacity-70 ring-4 ring-white/60 dark:ring-white/10" />
        ))}
        <span style={{ left: `calc(${last.x}% - 6px)`, top: `${last.y}%` }} className="absolute -translate-y-1/2 animate-[obj-pop_.6s_2.5s_cubic-bezier(0.22,1,0.36,1)_backwards]">
          <span className="absolute -inset-2 animate-[obj-ping_2.4s_3s_ease-out_infinite] rounded-full bg-emerald-500/30" />
          <span className="relative block h-3 w-3 rounded-full bg-emerald-500 dark:bg-emerald-400" />
        </span>
      </div>
    </div>
  );
}

// ---------- D · Halo Ring ----------
// A wide tilted ring of light circling the search, like a planet's ring seen edge-on; a bright spark travels round it.

function Halo() {
  const ring = { rx: 560, ry: 120 };
  return (
    <div aria-hidden className={shell}>
      <svg viewBox="-620 -220 1240 440" className="absolute left-1/2 top-[38%] w-[min(78rem,190vw)] -translate-x-1/2 animate-[obj-in_1.6s_cubic-bezier(0.22,1,0.36,1)_backwards] sm:top-[34%]">
        <defs>
          <linearGradient id="halo-line" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="rgb(99 102 241 / 0)" />
            <stop offset=".3" stopColor="rgb(129 140 248 / .75)" />
            <stop offset=".7" stopColor="rgb(52 211 153 / .6)" />
            <stop offset="1" stopColor="rgb(16 185 129 / 0)" />
          </linearGradient>
          <radialGradient id="halo-fill">
            <stop offset="0" stopColor="rgb(99 102 241 / .12)" />
            <stop offset="1" stopColor="rgb(99 102 241 / 0)" />
          </radialGradient>
          <filter id="halo-blur"><feGaussianBlur stdDeviation="3" /></filter>
        </defs>
        <g transform="rotate(-7)">
          <ellipse {...ring} fill="url(#halo-fill)" />
          <ellipse {...ring} fill="none" stroke="url(#halo-line)" strokeWidth="2" />
          <ellipse rx={ring.rx * 0.86} ry={ring.ry * 0.78} fill="none" stroke="url(#halo-line)" strokeWidth="1" opacity=".6" />
          <ellipse {...ring} pathLength={100} fill="none" stroke="#a5b4fc" strokeWidth="5" strokeLinecap="round" strokeDasharray="4 96" filter="url(#halo-blur)" className="animate-[obj-run_14s_linear_infinite] motion-reduce:hidden" />
          <ellipse {...ring} pathLength={100} fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeDasharray="2 98" className="animate-[obj-run_14s_linear_infinite] motion-reduce:hidden dark:opacity-90" />
        </g>
      </svg>
    </div>
  );
}

// ---------- E · Signal Pulse ----------
// Rings spread slowly from behind the search, one after another, like a post reaching more and more people.

const pulses = 5;

function Pulse() {
  return (
    <div aria-hidden className={`${shell} ${fadeBottom}`}>
      <div className="absolute left-1/2 top-[56%] aspect-square w-[min(64rem,200vw)] -translate-x-1/2 -translate-y-1/2">
        {Array.from({ length: pulses }, (_, i) => (
          <span key={i}
            style={{ "--s": (i + 1) / pulses, "--o": 1 - i / pulses, animationDelay: `${-(i * 10) / pulses}s` } as CSSProperties}
            className="absolute inset-0 rounded-full border border-indigo-500/50 bg-[radial-gradient(circle,transparent_60%,rgba(99,102,241,.06))] [opacity:calc(var(--o)*.7)] [scale:var(--s)] animate-[obj-pulse_10s_cubic-bezier(0.22,1,0.36,1)_infinite] dark:border-indigo-300/45" />
        ))}
      </div>
    </div>
  );
}

export function HeroObject({ id, cats }: { id?: string; cats: SocialCategory[] }) {
  switch (id as ObjectId) {
    case "globe": return <Globe cats={cats} />;
    case "orb": return <Orb />;
    case "curve": return <Curve cats={cats} />;
    case "halo": return <Halo />;
    case "pulse": return <Pulse />;
    default: return null;
  }
}
