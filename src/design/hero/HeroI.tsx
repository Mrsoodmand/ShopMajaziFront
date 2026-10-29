import { ArrowRight, Globe2 } from "lucide-react";
import { brand } from "@/content/en";

// Pins placed on the globe disc (percent of the box).
const pins = [
  { cc: "US", x: 26, y: 38, price: "$0.65" },
  { cc: "GB", x: 46, y: 26, price: "$0.38" },
  { cc: "DE", x: 54, y: 32, price: "$0.42" },
  { cc: "TR", x: 62, y: 44, price: "$0.30" },
  { cc: "AE", x: 68, y: 56, price: "$0.55" },
  { cc: "BR", x: 38, y: 70, price: "$0.35" },
  { cc: "IN", x: 76, y: 52, price: "$0.28" },
];

// Offer I — "Globe": dark navy, a wireframe globe with live country pins. Puts "150+ countries" front and center.
export default function HeroI() {
  return (
    <section className="relative overflow-hidden bg-[#050816] text-white">
      <nav className="relative mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        <span className="flex items-center gap-2 font-display text-xl font-bold"><Globe2 className="h-6 w-6 text-sky-400" />{brand.name}</span>
        <div className="hidden gap-7 text-sm text-slate-400 md:flex"><a href="#">Virtual numbers</a><a href="#">Google Voice</a><a href="#">Apple ID</a><a href="#">More</a></div>
        <a href="#" className="rounded-full bg-sky-500 px-4 py-2 text-sm font-semibold text-slate-950">Get started</a>
      </nav>

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-6 pb-20 pt-10 lg:grid-cols-2 lg:pt-16">
        <div>
          <div className="font-mono text-xs uppercase tracking-[0.25em] text-sky-400">Coverage · 150+ countries · 2,000+ apps</div>
          <h1 className="mt-6 font-display text-4xl font-bold leading-[1.05] tracking-tight sm:text-6xl">
            A number in any country.<br /><span className="text-slate-500">In seconds.</span>
          </h1>
          <p className="mt-6 max-w-md text-lg text-slate-400">Verify any app with real SIM-backed numbers, keep a permanent US line with Google Voice, or pick up an Apple ID for any region.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#" className="flex items-center gap-2 rounded-xl bg-sky-500 px-6 py-3.5 text-sm font-semibold text-slate-950 hover:bg-sky-400">Choose a country <ArrowRight className="h-4 w-4" /></a>
            <a href="#" className="rounded-xl border border-white/10 px-6 py-3.5 text-sm font-semibold text-slate-200 hover:bg-white/5">All services</a>
          </div>
          <div className="mt-10 flex flex-wrap gap-2">
            {["US", "GB", "DE", "FR", "NL", "CA", "TR", "AE", "IN", "BR"].map((c) => (
              <span key={c} className="rounded-md border border-white/10 bg-white/[.03] px-2.5 py-1 font-mono text-xs text-slate-300">{c}</span>
            ))}
            <span className="rounded-md px-2.5 py-1 font-mono text-xs text-sky-400">+140 more</span>
          </div>
        </div>

        <div className="relative mx-auto aspect-square w-full max-w-[520px]">
          <div aria-hidden className="absolute inset-[8%] rounded-full bg-sky-500/20 blur-3xl" />
          <svg viewBox="0 0 400 400" className="absolute inset-0 h-full w-full text-sky-300/25">
            <defs>
              <radialGradient id="globeFill" cx="35%" cy="30%" r="75%">
                <stop offset="0%" stopColor="#0c4a6e" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#050816" stopOpacity="1" />
              </radialGradient>
            </defs>
            <circle cx="200" cy="200" r="180" fill="url(#globeFill)" stroke="currentColor" />
            {[30, 60, 90, 120, 150].map((rx) => <ellipse key={rx} cx="200" cy="200" rx={rx} ry="180" fill="none" stroke="currentColor" />)}
            {[-120, -60, 0, 60, 120].map((dy) => {
              const ry = Math.sqrt(180 * 180 - dy * dy);
              return <ellipse key={dy} cx="200" cy={200 + dy} rx={ry} ry={ry * 0.12} fill="none" stroke="currentColor" />;
            })}
            <path d="M80 150 Q200 60 320 140" fill="none" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="4 6" />
            <path d="M110 290 Q220 200 300 230" fill="none" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="4 6" />
          </svg>
          {pins.map((p) => (
            <div key={p.cc} className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: `${p.x}%`, top: `${p.y}%` }}>
              <span className="relative flex h-3 w-3">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-60" />
                <span className="relative inline-flex h-3 w-3 rounded-full bg-sky-300 ring-2 ring-[#050816]" />
              </span>
              <span className="absolute start-4 top-1/2 -translate-y-1/2 whitespace-nowrap rounded-md border border-white/10 bg-slate-900/90 px-2 py-0.5 font-mono text-[10px] backdrop-blur">
                {p.cc} <span className="text-sky-300">{p.price}</span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
