import { Phone, Smartphone, Apple, Sparkles, Users, Globe, ArrowUpRight, Star } from "lucide-react";
import { brand, services } from "@/content/en";

const icons = { "virtual-number": Smartphone, "google-voice": Phone, "apple-id": Apple, subscriptions: Sparkles, social: Users, "static-ip": Globe } as const;

// Offer B — "Bento Store": light, copy on the left, the whole catalog as a bento grid on the right.
export default function HeroB() {
  const [vn, gv, aid, subs, social] = services;
  const Tile = ({ s, className = "", tone, children }: { s: typeof vn; className?: string; tone: string; children?: React.ReactNode }) => {
    const Icon = icons[s.id as keyof typeof icons];
    return (
      <a href="#" className={`group relative flex flex-col justify-between overflow-hidden rounded-3xl p-5 transition hover:-translate-y-0.5 hover:shadow-xl ${tone} ${className}`}>
        <div className="flex items-start justify-between">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-white/80 shadow-sm"><Icon className="h-5 w-5" /></span>
          <ArrowUpRight className="h-5 w-5 opacity-40 transition group-hover:opacity-100" />
        </div>
        {children}
        <div className="mt-6">
          <div className="font-display text-lg font-semibold">{s.name}</div>
          <div className="mt-1 text-sm opacity-70">{s.short}</div>
          <div className="mt-3 text-xs font-medium opacity-60">from <span className="text-base font-bold opacity-100">{s.from}</span></div>
        </div>
      </a>
    );
  };

  return (
    <section className="bg-[#F6F5F1]">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        <span className="flex items-center gap-2 font-display text-xl font-bold">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-slate-900 text-sm text-white">S</span>{brand.name}
        </span>
        <div className="hidden gap-7 text-sm text-slate-600 md:flex">
          <a href="#">Services</a><a href="#">Pricing</a><a href="#">Blog</a><a href="#">Support</a>
        </div>
        <a href="#" className="rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white">My account</a>
      </nav>

      <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 pb-20 pt-10 lg:grid-cols-[1fr_1.15fr] lg:pt-16">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-600 shadow-sm">
            <span className="flex">{[0, 1, 2, 3, 4].map((i) => <Star key={i} className="h-3 w-3 fill-amber-400 text-amber-400" />)}</span>
            Rated 4.9 by 38,000+ customers
          </div>
          <h1 className="mt-6 font-display text-4xl font-bold leading-[1.05] tracking-tight text-slate-900 sm:text-6xl">
            The digital store for everything <span className="relative whitespace-nowrap text-violet-600">online<svg aria-hidden viewBox="0 0 200 12" className="absolute -bottom-2 start-0 w-full"><path d="M2 9c50-6 140-8 196-3" stroke="currentColor" strokeWidth="4" fill="none" strokeLinecap="round" /></svg></span>.
          </h1>
          <p className="mt-6 max-w-lg text-lg text-slate-600">
            Numbers, accounts, subscriptions and growth — pick a service, pay once, and get it delivered to your dashboard in seconds.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#" className="rounded-full bg-violet-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-violet-600/30 hover:bg-violet-700">Browse all services</a>
            <a href="#" className="rounded-full border border-slate-300 bg-white px-6 py-3.5 text-sm font-semibold text-slate-800 hover:border-slate-400">Top up wallet</a>
          </div>
          <div className="mt-10 flex items-center gap-6 text-sm text-slate-500">
            <div><span className="block font-display text-2xl font-bold text-slate-900">1.2M+</span>orders</div>
            <div className="h-10 w-px bg-slate-300" />
            <div><span className="block font-display text-2xl font-bold text-slate-900">150+</span>countries</div>
            <div className="h-10 w-px bg-slate-300" />
            <div><span className="block font-display text-2xl font-bold text-slate-900">24/7</span>support</div>
          </div>
        </div>

        <div className="grid auto-rows-[minmax(150px,auto)] grid-cols-2 gap-4 md:grid-cols-3">
          <Tile s={vn} tone="bg-violet-200 text-violet-950" className="col-span-2 row-span-2 md:col-span-2">
            <div className="mt-6 flex flex-wrap gap-2">
              {["US", "GB", "DE", "NL", "FR", "CA", "TR", "AE", "+142"].map((c) => (
                <span key={c} className="rounded-lg bg-white/70 px-2.5 py-1 font-mono text-xs font-semibold">{c}</span>
              ))}
            </div>
            <div className="mt-4 max-w-xs rounded-2xl bg-white/80 p-3 font-mono shadow-sm">
              <div className="text-xs text-violet-700/70">Telegram · code received</div>
              <div className="text-2xl font-bold tracking-widest">71 904</div>
            </div>
          </Tile>
          <Tile s={gv} tone="bg-sky-200 text-sky-950" />
          <Tile s={aid} tone="bg-white text-slate-900" />
          <Tile s={subs} tone="bg-amber-200 text-amber-950" className="md:col-span-1" />
          <Tile s={social} tone="bg-emerald-200 text-emerald-950" className="col-span-1 md:col-span-2" />
        </div>
      </div>
    </section>
  );
}
