import { ArrowUpRight, Phone, Apple, Smartphone, Users, Sparkles, Globe, PhoneIncoming } from "lucide-react";
import { brand } from "@/content/en";

// Offer J — "Mega Bento": centered headline, then a full-width bento where each tile shows a tiny live UI of the service.
export default function HeroJ() {
  const bars = [18, 26, 22, 34, 30, 44, 52, 48, 64, 72, 70, 88];
  return (
    <section className="bg-[radial-gradient(ellipse_at_top,#ede9fe_0%,#f8fafc_50%,#ffffff_100%)]">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        <span className="font-display text-xl font-bold text-slate-900">{brand.name}</span>
        <div className="hidden gap-7 text-sm text-slate-600 md:flex"><a href="#">Services</a><a href="#">Pricing</a><a href="#">Reviews</a><a href="#">Help</a></div>
        <a href="#" className="rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white">Get started</a>
      </nav>

      <div className="mx-auto max-w-7xl px-6 pb-20 pt-12 md:pt-16">
        <div className="text-center">
          <h1 className="mx-auto max-w-4xl font-display text-4xl font-bold leading-[1.05] tracking-tight text-slate-900 sm:text-6xl">
            Six services. One wallet.<br /><span className="bg-gradient-to-r from-violet-600 to-fuchsia-500 bg-clip-text text-transparent">Zero waiting.</span>
          </h1>
          <div className="mt-8 flex justify-center gap-3">
            <a href="#" className="rounded-full bg-violet-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-violet-600/30">Create free account</a>
            <a href="#" className="rounded-full border border-slate-300 bg-white px-6 py-3.5 text-sm font-semibold text-slate-800">See prices</a>
          </div>
        </div>

        <div className="mt-14 grid auto-rows-[200px] grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Tile className="bg-slate-900 text-white sm:col-span-2 lg:row-span-2" icon={Smartphone} title="Virtual Numbers" sub="SMS codes from 150+ countries · from $0.30">
            <div className="mt-6 space-y-2 font-mono text-sm">
              {[["WhatsApp", "DE", "482 913"], ["Telegram", "US", "77015"], ["Google", "GB", "G-308412"]].map(([a, c, code]) => (
                <div key={a} className="flex items-center justify-between rounded-xl bg-white/10 px-4 py-3">
                  <span><span className="me-2 rounded bg-white/20 px-1 text-[10px]">{c}</span>{a}</span>
                  <span className="text-lg font-bold tracking-widest text-emerald-300">{code}</span>
                </div>
              ))}
            </div>
          </Tile>
          <Tile className="bg-sky-100 text-sky-950" icon={Phone} title="Google Voice" sub="Permanent US line · $9.90">
            <div className="mt-3 flex items-center gap-2 rounded-xl bg-white px-3 py-2 text-xs shadow-sm"><PhoneIncoming className="h-4 w-4 text-sky-600" />+1 (212) 555-0147 · calling…</div>
          </Tile>
          <Tile className="bg-white text-slate-900 ring-1 ring-slate-200" icon={Apple} title="Apple ID" sub="Any region · from $6.50">
            <div className="mt-3 flex gap-1.5">{["US", "GB", "TR", "CA"].map((r) => <span key={r} className="rounded-md bg-slate-100 px-2 py-0.5 font-mono text-[10px]">{r}</span>)}</div>
          </Tile>
          <Tile className="bg-amber-100 text-amber-950" icon={Sparkles} title="Subscriptions" sub="ChatGPT, Netflix, Spotify…">
            <div className="mt-3 flex -space-x-2">
              {[["C", "bg-emerald-600"], ["N", "bg-red-600"], ["S", "bg-green-500"], ["Ca", "bg-cyan-500"]].map(([l, c]) => (
                <span key={l} className={`grid h-8 w-8 place-items-center rounded-full text-[10px] font-bold text-white ring-2 ring-amber-100 ${c}`}>{l}</span>
              ))}
            </div>
          </Tile>
          <Tile className="bg-fuchsia-100 text-fuchsia-950" icon={Users} title="Social Media Services" sub="+12,480 followers this week">
            <div className="mt-3 flex h-12 items-end gap-1">{bars.map((h, i) => <span key={i} className="flex-1 rounded-t bg-fuchsia-500/70" style={{ height: `${h}%` }} />)}</div>
          </Tile>
          <Tile className="bg-emerald-100 text-emerald-950 sm:col-span-2 lg:col-span-4" icon={Globe} title="Static IP" sub="Dedicated IPs for stable, private access · from $7.00">
            <div className="mt-3 flex flex-wrap gap-2 font-mono text-xs">{["185.212.4.19 · 12ms", "45.83.120.7 · 18ms", "91.204.66.3 · 9ms"].map((ip) => <span key={ip} className="rounded-lg bg-white px-3 py-1.5 shadow-sm">● {ip}</span>)}</div>
          </Tile>
        </div>
      </div>
    </section>
  );
}

function Tile({ className, icon: Icon, title, sub, children }: { className: string; icon: typeof Phone; title: string; sub: string; children?: React.ReactNode }) {
  return (
    <a href="#" className={`group flex flex-col justify-between overflow-hidden rounded-3xl p-6 transition hover:-translate-y-0.5 hover:shadow-xl ${className}`}>
      <div>
        <div className="flex items-start justify-between">
          <Icon className="h-6 w-6" />
          <ArrowUpRight className="h-5 w-5 opacity-40 transition group-hover:opacity-100" />
        </div>
        {children}
      </div>
      <div className="mt-4">
        <div className="font-display text-lg font-semibold">{title}</div>
        <div className="text-sm opacity-70">{sub}</div>
      </div>
    </a>
  );
}
