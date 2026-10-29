import { Search, Zap, ShieldCheck, Headphones, ArrowRight } from "lucide-react";
import { brand, recentOrders, services } from "@/content/en";

// Offer A — "Command Center": dark, search-first. The search bar is the hero.
export default function HeroA() {
  const chips = ["WhatsApp number", "Google Voice", "ChatGPT Plus", "Apple ID", "Telegram members"];
  return (
    <section className="relative overflow-hidden bg-[#070B14] text-white">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 start-1/2 h-[520px] w-[900px] -translate-x-1/2 rounded-full bg-indigo-600/30 blur-[120px]" />
        <div className="absolute top-40 -start-20 h-72 w-72 rounded-full bg-cyan-500/20 blur-[100px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,.04)_1px,transparent_1px)] bg-[size:56px_56px] [mask-image:radial-gradient(ellipse_at_top,black_30%,transparent_70%)]" />
      </div>

      <nav className="relative mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        <span className="font-display text-xl font-bold tracking-tight">{brand.name}</span>
        <div className="hidden gap-8 text-sm text-slate-300 md:flex">
          {services.slice(0, 5).map((s) => <a key={s.id} href="#" className="hover:text-white">{s.name}</a>)}
        </div>
        <div className="flex items-center gap-3 text-sm">
          <a href="#" className="hidden text-slate-300 hover:text-white sm:block">Sign in</a>
          <a href="#" className="rounded-full bg-white px-4 py-2 font-medium text-slate-900">Get started</a>
        </div>
      </nav>

      <div className="relative mx-auto max-w-4xl px-6 pb-24 pt-16 text-center md:pt-24">
        <a href="#" className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300 backdrop-blur">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px] shadow-emerald-400" />
          Instant delivery · 150+ countries online now
        </a>
        <h1 className="mt-6 font-display text-4xl font-bold leading-[1.05] tracking-tight sm:text-6xl md:text-7xl">
          Every digital service.
          <br />
          <span className="bg-gradient-to-r from-indigo-300 via-cyan-200 to-emerald-200 bg-clip-text text-transparent">One search away.</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-base text-slate-400 sm:text-lg">
          Virtual numbers, Google Voice, Apple IDs, premium subscriptions and social growth — paid in seconds, delivered automatically.
        </p>

        <form className="mx-auto mt-10 flex max-w-2xl items-center gap-2 rounded-2xl border border-white/10 bg-white/[.06] p-2 shadow-2xl shadow-indigo-900/40 backdrop-blur-xl focus-within:border-indigo-400/60">
          <Search className="ms-3 h-5 w-5 shrink-0 text-slate-400" />
          <input
            className="min-w-0 flex-1 bg-transparent px-2 py-3 text-base text-white placeholder:text-slate-500 focus:outline-none"
            placeholder="What do you need? e.g. WhatsApp number in Germany"
          />
          <button type="button" className="flex items-center gap-2 rounded-xl bg-indigo-500 px-5 py-3 text-sm font-semibold hover:bg-indigo-400">
            Search <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        <div className="mt-5 flex flex-wrap justify-center gap-2">
          {chips.map((c) => (
            <button key={c} className="rounded-full border border-white/10 bg-white/[.03] px-3 py-1.5 text-xs text-slate-300 hover:border-white/30 hover:text-white">
              {c}
            </button>
          ))}
        </div>

        <div className="mx-auto mt-14 grid max-w-3xl grid-cols-1 gap-4 text-start sm:grid-cols-3">
          {[
            { icon: Zap, t: "Under 30 seconds", d: "Automated delivery, no waiting" },
            { icon: ShieldCheck, t: "Refund guarantee", d: "No SMS? Money back to wallet" },
            { icon: Headphones, t: "24/7 humans", d: "Real support, any time" },
          ].map(({ icon: Icon, t, d }) => (
            <div key={t} className="flex items-start gap-3 rounded-xl border border-white/5 bg-white/[.02] p-4">
              <Icon className="mt-0.5 h-5 w-5 text-cyan-300" />
              <div>
                <div className="text-sm font-semibold">{t}</div>
                <div className="text-xs text-slate-400">{d}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="relative border-t border-white/5 bg-white/[.02]">
        <div className="mx-auto flex max-w-7xl items-center gap-4 overflow-hidden px-6 py-3 text-xs text-slate-400">
          <span className="shrink-0 font-semibold text-emerald-300">LIVE</span>
          <div className="flex animate-marquee gap-10 whitespace-nowrap">
            {[...recentOrders, ...recentOrders].map((o, i) => (
              <span key={i}>{o.what} <span className="text-slate-600">· {o.when}</span></span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
