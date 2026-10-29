import { MousePointerClick, Wallet, PackageCheck, Timer } from "lucide-react";

const steps = [
  { t: "0:00", icon: MousePointerClick, title: "Pick what you need", desc: "Browse the catalog or search. Every product shows its price, delivery time and what's included.", tag: "Choose" },
  { t: "0:10", icon: Wallet, title: "Pay securely", desc: "Use a card, crypto or your wallet balance. Top up once, then every order is one click.", tag: "Pay" },
  { t: "0:30", icon: PackageCheck, title: "It's delivered", desc: "Numbers, codes, Apple IDs and logins land in your dashboard and email automatically.", tag: "Receive" },
];

// Offer C — "Stopwatch Timeline": a vertical timeline stamped with elapsed time, so the speed is the story. Light, alternating sides on desktop.
export default function HowC() {
  return (
    <section className="bg-[#F6F5F1] py-24">
      <div className="mx-auto max-w-5xl px-6">
        <div className="text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-sm font-medium text-slate-700 shadow-sm"><Timer className="h-4 w-4 text-violet-600" />How to buy</span>
          <h2 className="mt-5 font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-5xl">The whole thing takes <span className="text-violet-600">30 seconds.</span></h2>
        </div>

        <ol className="relative mt-16">
          <div aria-hidden className="absolute bottom-0 start-6 top-0 w-px bg-gradient-to-b from-violet-300 via-violet-400 to-emerald-400 md:start-1/2" />
          {steps.map((s, i) => {
            const right = i % 2 === 1;
            return (
              <li key={s.title} className="relative mb-12 grid items-center gap-6 ps-16 last:mb-0 md:grid-cols-2 md:gap-16 md:ps-0">
                <span className="absolute start-6 top-6 z-10 grid h-12 w-12 -translate-x-1/2 place-items-center rounded-full bg-slate-900 font-mono text-xs font-bold text-white ring-8 ring-[#F6F5F1] md:start-1/2 md:top-1/2 md:-translate-y-1/2 rtl:translate-x-1/2">{s.t}</span>
                <div className={`${right ? "md:order-2" : "md:text-end"}`}>
                  <div className="rounded-3xl bg-white p-7 shadow-sm ring-1 ring-slate-200/70">
                    <div className={`flex items-center gap-3 ${right ? "" : "md:flex-row-reverse"}`}>
                      <span className="grid h-11 w-11 place-items-center rounded-xl bg-violet-100 text-violet-700"><s.icon className="h-5 w-5" /></span>
                      <span className="text-xs font-semibold uppercase tracking-widest text-slate-400">Step {i + 1} · {s.tag}</span>
                    </div>
                    <h3 className="mt-4 font-display text-xl font-semibold text-slate-900">{s.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-600">{s.desc}</p>
                  </div>
                </div>
                <div className={`hidden md:block ${right ? "md:order-1" : ""}`} />
              </li>
            );
          })}
        </ol>

        <div className="mt-14 flex flex-col items-center gap-3">
          <a href="#" className="rounded-full bg-violet-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-violet-600/30 hover:bg-violet-700">Try it now</a>
          <span className="text-xs text-slate-500">No code or delivery? Your money goes back to your wallet.</span>
        </div>
      </div>
    </section>
  );
}
