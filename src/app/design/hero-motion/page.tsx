"use client";

import Link from "@/components/Link";
import { Sparkles } from "lucide-react";
import { SpotlightBand, SpotlightMark, spotTone, type SpotMotion } from "@/design/service/spotlight";

// Background animations for the landing hero "Spotlight × Grid" (design/service/spotlight.tsx), each on the real band
// with the grid crossing at the icon tile. Pick one and it becomes SpotlightBand's default `motion`.
const offers: { id: SpotMotion; letter: string; name: string; note: string }[] = [
  { id: "comets", letter: "A", name: "Grid Comets", note: "Streaks of light run along the grid lines, out of the icon and away from it." },
  { id: "sweep", letter: "B", name: "Beam Sweep", note: "The green beam swings slowly from side to side, like a searchlight." },
  { id: "scan", letter: "C", name: "Scan Line", note: "A band of green grid sweeps down the hero, like a scanner passing over it." },
  { id: "ripple", letter: "D", name: "Grid Ripple", note: "Rings of lit grid spread out of the icon, in step with its rings." },
  { id: "dust", letter: "E", name: "Stardust", note: "Specks of light drift up through the beam and fade." },
  // More in A's family: light moving along the grid lines.
  { id: "converge", letter: "F", name: "Converge", note: "A in reverse: streaks run in along the lines and vanish into the icon." },
  { id: "circuit", letter: "G", name: "Circuit Trace", note: "Lights leave the icon and trace circuit paths, turning at the crossings." },
  { id: "orbit", letter: "H", name: "Orbit", note: "Lights circle the icon on square paths of grid lines, rings turning opposite ways." },
  { id: "nodes", letter: "I", name: "Node Pulse", note: "Grid crossings light up in turn, each sending a short spark along its line." },
  { id: "rain", letter: "J", name: "Line Rain", note: "Streaks fall down the vertical lines across the whole band." },
];

export default function HeroMotionPreview() {
  return (
    <main dir="rtl" className="dark min-h-screen bg-[#070B14] text-white">
      <header dir="ltr" className="sticky top-0 z-50 flex items-center justify-between border-b border-white/10 bg-[#070B14]/90 px-6 py-3 backdrop-blur">
        <Link href="/design/landing-hero" className="text-sm text-slate-400 hover:text-white">← Landing hero</Link>
        <span className="font-display font-semibold">Hero background motion · A–J</span>
        <span className="text-xs text-slate-500">Grid now crosses at the icon</span>
      </header>
      <nav dir="ltr" className="flex flex-wrap justify-center gap-2 px-6 py-4">
        {offers.map((o) => <a key={o.id} href={`#${o.id}`} className="rounded-full bg-white/5 px-3 py-1.5 text-sm text-slate-300 ring-1 ring-white/10 hover:bg-white/10">{o.letter} · {o.name}</a>)}
      </nav>
      {offers.map((o) => (
        <section key={o.id} id={o.id} className="relative isolate overflow-hidden border-t border-white/10 pb-24 pt-16">
          <SpotlightBand motion={o.id} />
          <div dir="ltr" className="absolute start-6 top-5 z-10 rounded-full bg-black/40 px-3 py-1 text-xs text-slate-300 ring-1 ring-white/10 backdrop-blur">
            <b className="text-emerald-300">{o.letter}</b> · {o.name} — {o.note}
          </div>
          <div className="mx-auto max-w-7xl px-4 pt-12 text-center sm:px-6 sm:pt-20">
            <SpotlightMark icon={Sparkles} />
            <h1 className={`mx-auto max-w-5xl text-balance font-display text-4xl font-bold tracking-tight sm:text-6xl ${spotTone.title}`}>خرید اشتراک و اکانت های خارجی</h1>
            <p className={`mx-auto mt-4 max-w-3xl text-base leading-relaxed sm:text-lg ${spotTone.sub}`}>اشتراک اپ‌های پریمیوم بدون کارت خارجی. هر کدام نوشته که چطور و در چه مدت فعال می‌شود.</p>
            <div className="mx-auto mt-7 h-14 max-w-xl rounded-2xl bg-white/[.06] ring-1 ring-white/10" />
          </div>
        </section>
      ))}
    </main>
  );
}
