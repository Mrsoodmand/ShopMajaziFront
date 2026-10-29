import { ArrowRight, Menu } from "lucide-react";
import { brand, platforms } from "@/content/en";

const pillColors = [
  "bg-[#229ED9] text-white", "bg-[#25D366] text-white", "bg-gradient-to-r from-[#F58529] via-[#DD2A7B] to-[#8134AF] text-white",
  "bg-black text-white", "bg-[#E50914] text-white", "bg-[#1DB954] text-black", "bg-white text-slate-900 ring-1 ring-slate-200",
];

// Offer D — "Marquee Pop": bold centered type, the platforms we serve scroll behind as colorful pills. Energetic, youth/social leaning.
export default function HeroD() {
  const rowA = platforms.slice(0, 7);
  const rowB = platforms.slice(7);
  const Pill = ({ p, i }: { p: string; i: number }) => (
    <span className={`shrink-0 rounded-full px-6 py-3 font-display text-lg font-semibold shadow-sm md:text-2xl ${pillColors[i % pillColors.length]}`}>{p}</span>
  );
  return (
    <section className="relative overflow-hidden bg-[#FFF8EE]">
      <nav className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        <span className="rounded-full bg-black px-4 py-1.5 font-display text-lg font-bold text-[#FFF8EE]">{brand.name}</span>
        <div className="hidden gap-2 text-sm font-medium md:flex">
          {["Numbers", "Accounts", "Subscriptions", "Social"].map((x) => (
            <a key={x} href="#" className="rounded-full px-4 py-2 hover:bg-black/5">{x}</a>
          ))}
        </div>
        <a href="#" className="hidden rounded-full border-2 border-black px-4 py-1.5 text-sm font-semibold md:block">Login</a>
        <Menu className="h-6 w-6 md:hidden" />
      </nav>

      <div className="relative z-10 mx-auto max-w-5xl px-6 pb-10 pt-14 text-center md:pt-20">
        <h1 className="font-display text-5xl font-bold leading-[0.95] tracking-tighter text-black sm:text-7xl md:text-8xl">
          Unlock any app.
          <br />
          <span className="italic text-[#FF5A1F]">Grow</span> any account.
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-lg text-black/70">
          Numbers, accounts, subscriptions and real engagement for the platforms you live on — delivered before your coffee cools.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <a href="#" className="group flex items-center gap-2 rounded-full bg-[#FF5A1F] px-7 py-4 text-base font-semibold text-white shadow-[4px_4px_0_0_#000] transition hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_0_#000]">
            Start shopping <ArrowRight className="h-5 w-5 transition group-hover:translate-x-1" />
          </a>
          <a href="#" className="rounded-full border-2 border-black bg-white px-7 py-4 text-base font-semibold shadow-[4px_4px_0_0_#000]">See prices</a>
        </div>
      </div>

      <div className="relative space-y-4 pb-20 pt-6 [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
        <div className="flex w-max animate-marquee gap-4">
          {[...rowA, ...rowA, ...rowA, ...rowA].map((p, i) => <Pill key={i} p={p} i={i} />)}
        </div>
        <div className="flex w-max animate-marquee-reverse gap-4">
          {[...rowB, ...rowB, ...rowB, ...rowB].map((p, i) => <Pill key={i} p={p} i={i + 3} />)}
        </div>
      </div>

      <div className="border-t-2 border-black bg-black text-[#FFF8EE]">
        <div className="mx-auto grid max-w-7xl grid-cols-2 divide-white/20 px-6 text-center md:grid-cols-4 md:divide-x">
          {[["1.2M+", "orders shipped"], ["150+", "countries"], ["<30s", "delivery"], ["4.9★", "customer rating"]].map(([v, l]) => (
            <div key={l} className="py-5"><div className="font-display text-2xl font-bold">{v}</div><div className="text-xs uppercase tracking-widest text-white/60">{l}</div></div>
          ))}
        </div>
      </div>
    </section>
  );
}
