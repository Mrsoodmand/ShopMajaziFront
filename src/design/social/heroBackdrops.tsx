"use client";

import type { CSSProperties } from "react";
import type { SocialCategory } from "@/content/social-categories-en";

// Rich-colour backgrounds for the Search Spotlight hero (C), chosen in /design/page-social-list-hero-bg.
// Each is a full band under the header, coloured like the social apps themselves, that fades into the page
// ground at the bottom (no hard edge, in either theme). A dark veil keeps the white title and text at AA contrast.
// Motion is slow and continuous; reduced motion leaves each one as a still picture. Hidden from screen readers.

export type BackdropId = "none" | "aurora" | "sunset" | "mesh" | "beams" | "waves";
export const isRich = (id?: string) => !!id && id !== "none";

// The fade at the bottom follows an eased curve (not a straight ramp), so there is no visible band where the colour
// meets the page, in either theme.
const shell = "pointer-events-none absolute inset-0 -z-10 overflow-hidden [mask-image:linear-gradient(to_bottom,black_0%,black_58%,rgba(0,0,0,.9)_66%,rgba(0,0,0,.72)_73%,rgba(0,0,0,.5)_80%,rgba(0,0,0,.3)_87%,rgba(0,0,0,.13)_93%,rgba(0,0,0,.04)_97%,transparent_100%)]";
// Darkens the top for the white text; it thins out toward the fade so the bottom stays colour, not grey.
const veil = <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-black/15 to-transparent" />;

// ---------- A · Aurora ----------
// Ribbons of Instagram pink, Telegram blue, TikTok teal, violet and amber drifting across a deep night, blended
// like northern lights.
function Aurora() {
  const ribbons = [
    { c: "#ec4899", w: "55%", h: "70%", x: "-5%", y: "-20%", t: 18, d: 0 },
    { c: "#0ea5e9", w: "50%", h: "65%", x: "50%", y: "-25%", t: 22, d: -6 },
    { c: "#8b5cf6", w: "60%", h: "60%", x: "20%", y: "10%", t: 26, d: -12 },
    { c: "#14b8a6", w: "40%", h: "55%", x: "70%", y: "20%", t: 20, d: -4 },
    { c: "#f59e0b", w: "35%", h: "45%", x: "5%", y: "35%", t: 24, d: -9 },
  ];
  return (
    <div className={`${shell} bg-[#0b0726]`}>
      {ribbons.map((r, i) => (
        <div key={i} style={{ backgroundColor: r.c, width: r.w, height: r.h, left: r.x, top: r.y, animationDuration: `${r.t}s`, animationDelay: `${r.d}s` }}
          className="absolute animate-[aurora_20s_ease-in-out_infinite_alternate] rounded-[50%] opacity-70 mix-blend-screen blur-[70px]" />
      ))}
      {veil}
    </div>
  );
}

// ---------- B · Sunset ----------
// One bold gradient in the colours of a story ring (violet, magenta, orange), slowly panning so the colours shift,
// with a warm glow rising behind the title.
function Sunset() {
  return (
    <div className={shell}>
      <div className="absolute inset-0 animate-[pan_16s_ease-in-out_infinite_alternate] bg-[linear-gradient(115deg,#3b0764_0%,#7e22ce_22%,#db2777_48%,#f97316_70%,#be185d_88%,#4c1d95_100%)] bg-[length:250%_250%]" />
      <div className="absolute left-1/2 top-[18%] h-[70%] w-[60%] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(253,186,116,.55),transparent)] blur-2xl" />
      {veil}
    </div>
  );
}

// ---------- C · Brand Mesh ----------
// Big soft blobs in the featured platforms' own colours (set by the admin), slowly changing shape and drifting.
function Mesh({ cats }: { cats: SocialCategory[] }) {
  return <BrandMesh colors={(cats.filter((c) => c.featured).length ? cats.filter((c) => c.featured) : cats).map((c) => c.color)} />;
}

// The same mesh from any list of brand colours (hex), e.g. the popular subscriptions on /accounts. Up to four blobs.
export function BrandMesh({ colors: all }: { colors: string[] }) {
  const colors = all.slice(0, 4);
  const place = [{ x: "-8%", y: "-30%" }, { x: "55%", y: "-35%" }, { x: "62%", y: "25%" }, { x: "0%", y: "20%" }];
  // Very dark brands (TikTok, X) are lifted so they still read as colour.
  const tone = (c: string) => `color-mix(in srgb, ${c} 80%, #6366f1)`;
  return (
    // In light theme the base is a brighter indigo, so the fade into the pale page passes through colour, not grey.
    <div className={`${shell} bg-[linear-gradient(to_bottom,#1e1554_0%,#3b2f8f_55%,#6d5fd0_100%)] dark:bg-none dark:bg-[#120a2e]`}>
      {colors.map((c, i) => (
        <div key={i} style={{ backgroundColor: tone(c), left: place[i].x, top: place[i].y, animationDelay: `${-i * 3.5}s` } as CSSProperties}
          className="absolute h-[85%] w-[50%] animate-[morph_14s_ease-in-out_infinite] opacity-80 blur-[50px]" />
      ))}
      {veil}
    </div>
  );
}

// Green and white: deep emerald with soft white and mint glows drifting over it (the Google Voice page).
// The white glows stay at the edges and low opacity, so the white title keeps its contrast.
export function GreenMesh() {
  const blobs = [
    { c: "#ffffff", o: 0.75, x: "-12%", y: "-38%" },
    { c: "#22c55e", o: 0.95, x: "52%", y: "-30%" },
    { c: "#ffffff", o: 0.6, x: "66%", y: "30%" },
    { c: "#10b981", o: 0.95, x: "-4%", y: "24%" },
  ];
  return (
    <div className={`${shell} bg-[linear-gradient(to_bottom,#047857_0%,#059669_50%,#6ee7b7_100%)] dark:bg-none dark:bg-[#022c22]`}>
      {blobs.map((b, i) => (
        <div key={i} style={{ backgroundColor: b.c, opacity: b.o, left: b.x, top: b.y, animationDelay: `${-i * 3.5}s` } as CSSProperties}
          className="absolute h-[85%] w-[50%] animate-[morph_14s_ease-in-out_infinite] blur-[60px]" />
      ))}
      {veil}
    </div>
  );
}

// ---------- D · Stage Beams ----------
// Coloured spotlights fanning down from above onto the title, swaying slowly like stage lights.
function Beams() {
  const beams = [
    { c: "rgba(236,72,153,.75)", x: "18%", r: 18, t: 9, d: 0 },
    { c: "rgba(14,165,233,.75)", x: "38%", r: 6, t: 11, d: -3 },
    { c: "rgba(168,85,247,.8)", x: "62%", r: -6, t: 10, d: -6 },
    { c: "rgba(245,158,11,.7)", x: "82%", r: -18, t: 12, d: -2 },
  ];
  return (
    <div className={`${shell} bg-[radial-gradient(120%_80%_at_50%_0%,#1e1b4b_0%,#0b0a1f_60%)]`}>
      {beams.map((b, i) => (
        <div key={i} style={{ left: b.x, "--r": `${b.r}deg`, animationDuration: `${b.t}s`, animationDelay: `${b.d}s`, backgroundImage: `linear-gradient(to bottom, ${b.c}, transparent 85%)` } as CSSProperties}
          className="absolute -top-[10%] h-[120%] w-[22%] origin-top animate-[beam_10s_ease-in-out_infinite_alternate] mix-blend-screen blur-[18px] [clip-path:polygon(42%_0,58%_0,100%_100%,0_100%)]" />
      ))}
      <div className="absolute inset-x-0 top-0 h-24 bg-[radial-gradient(50%_100%_at_50%_0%,rgba(255,255,255,.25),transparent)]" />
      {veil}
    </div>
  );
}

// ---------- E · Colour Waves ----------
// A blue-to-violet sky with layered waves of pink, orange and teal rolling along the bottom.
const wave = (fill: string) => `url("data:image/svg+xml,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 120' preserveAspectRatio='none'><path fill='${fill}' d='M0 60 C150 10 300 110 450 60 S750 10 900 60 S1050 110 1200 60 V120 H0 Z'/></svg>`)}")`;
function Waves() {
  const layers = [
    { f: "rgba(20,184,166,.55)", b: "36%", h: "34%", t: 22 },
    { f: "rgba(249,115,22,.55)", b: "26%", h: "36%", t: 16 },
    { f: "rgba(236,72,153,.6)", b: "16%", h: "40%", t: 12 },
  ];
  return (
    <div className={`${shell} bg-[linear-gradient(170deg,#1e3a8a_0%,#5b21b6_45%,#9d174d_100%)]`}>
      {layers.map((l, i) => (
        <div key={i} style={{ bottom: l.b, height: l.h, backgroundImage: wave(l.f), animationDuration: `${l.t}s` }}
          className="absolute -left-0 w-[200%] animate-[wave-roll_14s_linear_infinite] bg-[length:50%_100%] bg-repeat-x" />
      ))}
      {veil}
    </div>
  );
}

export function HeroBackdrop({ id, cats }: { id?: string; cats: SocialCategory[] }) {
  switch (id as BackdropId) {
    case "aurora": return <Aurora />;
    case "sunset": return <Sunset />;
    case "mesh": return <Mesh cats={cats} />;
    case "beams": return <Beams />;
    case "waves": return <Waves />;
    default: return null;
  }
}
