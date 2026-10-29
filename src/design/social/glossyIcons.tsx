"use client";

import type { CSSProperties } from "react";
import Link from "@/i18n/Link";
import { Eye, Heart, ThumbsUp, UserPlus, type LucideIcon } from "lucide-react";
import { categoryHref, type SocialCategory } from "@/content/social-categories-en";
import { iconFor, ring } from "./listKit";
import { useT } from "@/i18n/client";

// Glossy 3D platform icons for hero C, with lively motion (chosen in /design/page-social-list-hero-icons, G–K).
// The 3D look is pure CSS from the platform's own colour: a lit-from-above gradient, a glossy highlight, a thicker
// darker underside like an app icon you could pick up, and a coloured drop shadow. Reduced motion stills it all.

export type GlossyMotion = "bounce" | "pop" | "spin" | "orbit" | "rise";
type Size = "md" | "lg" | "xl";

const ease = "ease-[cubic-bezier(0.22,1,0.36,1)]";
const spots: { x: number; y: number; size: Size; r: number; d: number }[] = [
  { x: 2, y: 14, size: "xl", r: -10, d: 0 }, { x: 10, y: 48, size: "lg", r: 8, d: 0.9 },
  { x: 3, y: 78, size: "md", r: -6, d: 1.7 }, { x: 17, y: 4, size: "md", r: 12, d: 2.4 },
  { x: 91, y: 10, size: "lg", r: 10, d: 0.5 }, { x: 84, y: 44, size: "xl", r: -8, d: 1.3 },
  { x: 93, y: 74, size: "md", r: 7, d: 2.1 }, { x: 77, y: 2, size: "md", r: -12, d: 2.9 },
];
const box: Record<Size, string> = { md: "h-12 w-12 [&_svg.mark]:h-6 [&_svg.mark]:w-6", lg: "h-15 w-15 [&_svg.mark]:h-7 [&_svg.mark]:w-7", xl: "h-19 w-19 [&_svg.mark]:h-9 [&_svg.mark]:w-9" };
const reactions: { Icon: LucideIcon; color: string }[] = [
  { Icon: Heart, color: "#ef4444" }, { Icon: ThumbsUp, color: "#3b82f6" }, { Icon: UserPlus, color: "#10b981" }, { Icon: Eye, color: "#8b5cf6" },
];

// ---------- The glossy tile ----------

export function Glossy({ c, size = "lg" }: { c: SocialCategory; size?: Size }) {
  const Icon = iconFor(c);
  const look: CSSProperties = {
    "--c": c.color,
    backgroundImage: "linear-gradient(150deg, color-mix(in srgb, var(--c) 62%, white) 0%, var(--c) 46%, color-mix(in srgb, var(--c) 70%, black) 100%)",
    boxShadow: "inset 0 2px 0 rgba(255,255,255,.5), inset 0 -5px 10px rgba(0,0,0,.25), 0 5px 0 color-mix(in srgb, var(--c) 55%, black), 0 18px 26px -10px color-mix(in srgb, var(--c) 70%, transparent)",
  } as CSSProperties;
  return (
    <span style={look} className={`relative grid place-items-center overflow-hidden rounded-[30%] text-white ${box[size]}`}>
      {/* The gloss: a soft white sheen over the top half. */}
      <span aria-hidden className="pointer-events-none absolute inset-x-[10%] top-[5%] h-[46%] rounded-[50%] bg-gradient-to-b from-white/65 to-white/0" />
      {c.logo
        ? <img src={c.logo} alt="" className="relative h-[58%] w-[58%] rounded-[22%] object-cover" />
        : Icon
          ? <Icon aria-hidden strokeWidth={2.2} className="mark relative drop-shadow-[0_2px_1px_rgba(0,0,0,.35)]" />
          : <span aria-hidden className="relative font-display text-2xl font-bold drop-shadow-[0_2px_1px_rgba(0,0,0,.35)]">{c.name.slice(0, 1)}</span>}
    </span>
  );
}

// A small white chip with a reaction (heart, like, follow, view) that floats up from the icon.
function Reaction({ i, delay }: { i: number; delay: number }) {
  const { Icon, color } = reactions[i % reactions.length];
  return (
    <span aria-hidden style={{ animationDelay: `${delay}s` }} className="pointer-events-none absolute -top-2 end-0 grid h-7 w-7 animate-[react_3.4s_ease-out_infinite] place-items-center rounded-full bg-white shadow-[0_6px_14px_-4px_rgba(15,23,42,.35)]">
      <Icon style={{ color, fill: color }} className="h-3.5 w-3.5" strokeWidth={2.4} />
    </span>
  );
}

// Little hearts flying out in four directions when an icon pops.
const burst = [{ dx: "-26px", dy: "-24px" }, { dx: "26px", dy: "-26px" }, { dx: "-30px", dy: "8px" }, { dx: "30px", dy: "6px" }];
function Burst({ delay }: { delay: number }) {
  return (
    <>
      {burst.map((b, k) => (
        <span key={k} aria-hidden style={{ "--dx": b.dx, "--dy": b.dy, animationDelay: `${delay}s` } as CSSProperties} className="pointer-events-none absolute start-1/2 top-1/2 -ms-1.5 -mt-1.5 animate-[burst-out_5s_ease-out_infinite]">
          <Heart className="h-3 w-3 fill-rose-500 text-rose-500" />
        </span>
      ))}
    </>
  );
}

// ---------- One icon, per motion ----------

function GlossyItem({ c, i, size, motion, r = 0, d = 0, link = true }: { c: SocialCategory; i: number; size: Size; motion: GlossyMotion; r?: number; d?: number; link?: boolean }) {
  const tx = useT();
  const anim =
    motion === "bounce" ? { cls: "animate-[hop_2.8s_cubic-bezier(.3,0,.3,1)_infinite]", style: { animationDelay: `${d}s` } }
    : motion === "pop" ? { cls: "animate-[pop-jump_5s_ease-in-out_infinite]", style: { animationDelay: `${i * 0.62}s` } }
    : motion === "spin" ? { cls: "animate-[flip3d_4.8s_cubic-bezier(.5,0,.3,1)_infinite]", style: { animationDelay: `${i * 0.55}s` } }
    : { cls: "", style: {} };
  const body = (
    <span className="relative block [perspective:600px]">
      <span style={{ rotate: `${r}deg` }} className={`block transition-[translate,scale,rotate] duration-500 ${ease} group-hover/g:-translate-y-1.5 group-hover/g:scale-115 group-hover/g:rotate-0!`}>
        <span style={anim.style} className={`block origin-bottom [transform-style:preserve-3d] ${anim.cls}`}><Glossy c={c} size={size} /></span>
      </span>
      {(motion === "bounce" || motion === "orbit") && <Reaction i={i} delay={d + 0.8 + (i % 3) * 0.7} />}
      {motion === "pop" && <Burst delay={i * 0.62} />}
    </span>
  );
  return link
    ? <Link href={categoryHref(c)} title={tx(c.name)} style={{ animationDelay: `${120 + i * 80}ms` }} className={`group/g block animate-[logo-in_0.8s_cubic-bezier(0.34,1.56,0.64,1)_backwards] rounded-[30%] ${ring}`}>{body}<span className="sr-only">{tx(c.name)}</span></Link>
    : <span aria-hidden className="block">{body}</span>;
}

// ---------- Layouts ----------

function Scatter({ cats, motion }: { cats: SocialCategory[]; motion: GlossyMotion }) {
  return (
    <ul className="pointer-events-none absolute inset-0 hidden lg:block">
      {cats.slice(0, spots.length).map((c, i) => (
        <li key={c.slug} style={{ insetInlineStart: `${spots[i].x}%`, top: `${spots[i].y}%` }} className="pointer-events-auto absolute"><GlossyItem c={c} i={i} size={spots[i].size} motion={motion} r={spots[i].r} d={spots[i].d} /></li>
      ))}
    </ul>
  );
}

// Glossy icons riding two flat rings (see the Orbit look in heroIcons.tsx for how they stay round and upright).
const FLAT = 0.4;
function Orbit({ cats }: { cats: SocialCategory[] }) {
  const ringOf = (list: SocialCategory[], r: number, secs: number, reverse: boolean, offset: number, size: Size) => (
    <div style={{ width: r * 2, height: r * 2, marginInlineStart: -r, marginTop: -r, transform: `scaleY(${FLAT})` }} className="absolute start-1/2 top-1/2">
      <div style={{ animationDuration: `${secs}s`, animationDirection: reverse ? "reverse" : "normal" }} className="relative h-full w-full animate-spin rounded-full border border-slate-900/[.08] [animation-timing-function:linear] group-hover/o:[animation-play-state:paused] dark:border-white/[.08]">
        {list.map((c, k) => {
          const a = offset + (k / list.length) * Math.PI * 2;
          return (
            <div key={c.slug} style={{ left: `${50 + 50 * Math.cos(a)}%`, top: `${50 + 50 * Math.sin(a)}%` }} className="absolute -translate-x-1/2 -translate-y-1/2">
              <div style={{ animationDuration: `${secs}s`, animationDirection: reverse ? "normal" : "reverse" }} className="animate-spin [animation-timing-function:linear] group-hover/o:[animation-play-state:paused]">
                <div style={{ transform: `scaleY(${1 / FLAT})` }}><GlossyItem c={c} i={k} size={size} motion="orbit" d={k * 0.4} /></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
  return (
    <div className="group/o absolute -inset-x-40 -inset-y-6 hidden [mask-image:radial-gradient(ellipse_30%_60%_at_50%_50%,transparent_60%,black_95%)] lg:block">
      {ringOf(cats.slice(0, 8), 620, 70, false, 0, "lg")}
      {ringOf(cats.slice(8, 14), 760, 95, true, Math.PI / 6, "md")}
    </div>
  );
}

// Icons rising from below on both sides like balloons, tumbling a little; a steady stream. Decorative (the links
// are the Popular chips under the search), since moving targets are hard to click.
const lanes = [{ x: 3, t: 12, d: -2 }, { x: 11, t: 15, d: -9 }, { x: 18, t: 11, d: -5 }, { x: 7, t: 14, d: -12 }, { x: 15, t: 13, d: -1 },
  { x: 95, t: 13, d: -4 }, { x: 87, t: 11, d: -10 }, { x: 80, t: 15, d: -7 }, { x: 91, t: 12, d: -13 }, { x: 84, t: 14, d: -2.5 }];
function Rise({ cats }: { cats: SocialCategory[] }) {
  return (
    <div aria-hidden className="pointer-events-none absolute -inset-y-10 inset-x-0 hidden overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,black_18%,black_75%,transparent)] lg:block">
      {lanes.map((l, i) => {
        const c = cats[i % cats.length];
        return (
          <span key={i} style={{ insetInlineStart: `${l.x}%`, animationDuration: `${l.t}s`, animationDelay: `${l.d}s` }} className="absolute bottom-0 animate-[rise-up_12s_linear_infinite]">
            <GlossyItem c={c} i={i} size={i % 3 === 0 ? "lg" : "md"} motion="rise" link={false} />
          </span>
        );
      })}
    </div>
  );
}

export function GlossyIcons({ cats, motion }: { cats: SocialCategory[]; motion: GlossyMotion }) {
  const tx = useT();
  return (
    <nav aria-label={tx("Popular platforms")}>
      {motion === "orbit" ? <Orbit cats={cats} /> : motion === "rise" ? <Rise cats={cats} /> : <Scatter cats={cats} motion={motion} />}
      {/* Phones: a bouncing row above the title. */}
      <ul className="mb-8 flex justify-center gap-3 lg:hidden">
        {cats.slice(0, 5).map((c, i) => <li key={c.slug}><GlossyItem c={c} i={i} size="md" motion={motion === "pop" || motion === "spin" ? motion : "bounce"} d={i * 0.25} /></li>)}
      </ul>
    </nav>
  );
}
