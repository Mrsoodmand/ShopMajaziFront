import { ArrowRight, ShieldCheck } from "lucide-react";
import { brand, services } from "@/content/en";
import { serviceIcons } from "./serviceIcons";

const looks = [
  "from-indigo-500 to-violet-600",
  "from-sky-400 to-blue-600",
  "from-slate-700 to-slate-900",
  "from-amber-400 to-orange-500",
  "from-emerald-400 to-teal-600",
];
const fan = [
  "-rotate-[14deg] -translate-x-24 translate-y-6 group-hover:-translate-x-40 group-hover:-rotate-[18deg]",
  "-rotate-[7deg] -translate-x-12 translate-y-2 group-hover:-translate-x-20",
  "rotate-0 z-10",
  "rotate-[7deg] translate-x-12 translate-y-2 group-hover:translate-x-20",
  "rotate-[14deg] translate-x-24 translate-y-6 group-hover:translate-x-40 group-hover:rotate-[18deg]",
];

// Offer H — "Card Deck": deep violet gradient, products as a fanned hand of cards that spread on hover. Playful but premium.
export default function HeroH() {
  const cards = services.slice(0, 5);
  return (
    <section className="relative overflow-hidden bg-[radial-gradient(ellipse_at_top_right,#4c1d95_0%,#1e1b4b_45%,#0b0a1f_100%)] text-white">
      <nav className="relative mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        <span className="font-display text-xl font-bold">{brand.name}</span>
        <div className="hidden gap-7 text-sm text-violet-200/80 md:flex"><a href="#">Numbers</a><a href="#">Accounts</a><a href="#">Subscriptions</a><a href="#">Social</a></div>
        <a href="#" className="rounded-full border border-white/20 px-4 py-2 text-sm font-medium">Sign in</a>
      </nav>

      <div className="relative mx-auto grid max-w-7xl items-center gap-16 px-6 pb-28 pt-12 lg:grid-cols-2 lg:pt-20">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs text-violet-100"><ShieldCheck className="h-3.5 w-3.5" />Refund guarantee on every order</span>
          <h1 className="mt-6 font-display text-4xl font-bold leading-[1.05] tracking-tight sm:text-6xl">
            Pick a card.<br /><span className="text-violet-300">Any service.</span>
          </h1>
          <p className="mt-6 max-w-md text-lg text-violet-100/70">Virtual numbers, Google Voice, Apple IDs, premium subscriptions and social growth — all in one wallet, all delivered instantly.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#" className="flex items-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-violet-950 hover:bg-violet-100">Start shopping <ArrowRight className="h-4 w-4" /></a>
            <a href="#" className="rounded-full px-6 py-3.5 text-sm font-semibold text-violet-200 hover:text-white">How it works</a>
          </div>
        </div>

        <div className="group relative mx-auto h-[360px] w-full max-w-md">
          {cards.map((s, i) => {
            const Icon = serviceIcons[s.id];
            return (
              <div key={s.id} className={`absolute inset-x-0 top-0 mx-auto h-[320px] w-56 origin-bottom rounded-3xl bg-gradient-to-br p-5 shadow-2xl shadow-black/40 ring-1 ring-white/20 transition duration-500 ${looks[i]} ${fan[i]}`}>
                <div className="flex h-full flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="grid h-10 w-10 place-items-center rounded-xl bg-white/20 backdrop-blur"><Icon className="h-5 w-5" /></span>
                    <span className="font-mono text-[10px] opacity-70">0{i + 1}</span>
                  </div>
                  <div>
                    <div className="font-display text-xl font-bold">{s.name}</div>
                    <div className="mt-1 text-xs opacity-80">{s.short}</div>
                    <div className="mt-4 flex items-center justify-between rounded-xl bg-black/20 px-3 py-2 text-xs">
                      <span>from</span><span className="text-base font-bold">{s.from}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
