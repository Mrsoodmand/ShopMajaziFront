import { Wallet, Plus, Smartphone, Phone, Sparkles, Users, Check, Clock, LayoutGrid, Receipt, LifeBuoy, Settings } from "lucide-react";
import { brand } from "@/content/en";

// Offer K — "Dashboard Preview": SaaS-style. Centered pitch, then a tilted preview of the customer dashboard (wallet, active numbers, orders).
export default function HeroK() {
  return (
    <section className="relative overflow-hidden bg-white">
      <div aria-hidden className="absolute inset-x-0 top-0 h-[600px] bg-[radial-gradient(ellipse_at_top,#c7d2fe_0%,transparent_60%)]" />
      <nav className="relative mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        <span className="font-display text-xl font-bold text-slate-900">{brand.name}</span>
        <div className="hidden gap-7 text-sm text-slate-600 md:flex"><a href="#">Services</a><a href="#">Pricing</a><a href="#">API</a><a href="#">Support</a></div>
        <div className="flex gap-2 text-sm"><a href="#" className="px-3 py-2 font-medium text-slate-700">Log in</a><a href="#" className="rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white">Sign up free</a></div>
      </nav>

      <div className="relative mx-auto max-w-6xl px-6 pt-12 text-center md:pt-20">
        <span className="rounded-full border border-indigo-200 bg-white px-3 py-1 text-xs font-medium text-indigo-700">New · Pay with crypto or card, top up once, use everywhere</span>
        <h1 className="mx-auto mt-6 max-w-3xl font-display text-4xl font-bold leading-[1.05] tracking-tight text-slate-900 sm:text-6xl">
          All your digital services in <span className="text-indigo-600">one dashboard.</span>
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-lg text-slate-600">Buy numbers, accounts and subscriptions from a single wallet. Track every order and every SMS live.</p>
        <div className="mt-8 flex justify-center gap-3">
          <a href="#" className="rounded-lg bg-indigo-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/30">Open your wallet</a>
          <a href="#" className="rounded-lg border border-slate-300 bg-white px-6 py-3.5 text-sm font-semibold text-slate-800">Browse services</a>
        </div>
      </div>

      <div className="relative mx-auto mt-16 max-w-6xl px-6 [perspective:2000px]">
        <div className="overflow-hidden rounded-t-2xl border border-b-0 border-slate-200 bg-slate-50 shadow-2xl shadow-indigo-200 [transform:rotateX(14deg)] origin-bottom">
          <div className="flex items-center gap-2 border-b border-slate-200 bg-white px-4 py-3">
            <span className="h-3 w-3 rounded-full bg-red-400" /><span className="h-3 w-3 rounded-full bg-amber-400" /><span className="h-3 w-3 rounded-full bg-emerald-400" />
            <span className="ms-4 rounded-md bg-slate-100 px-3 py-1 text-xs text-slate-500">shopmajazi.com/dashboard</span>
          </div>
          <div className="grid grid-cols-12 text-start">
            <aside className="col-span-3 hidden space-y-1 border-e border-slate-200 bg-white p-4 text-sm md:block">
              {[[LayoutGrid, "Overview", true], [Smartphone, "My numbers"], [Receipt, "Orders"], [Wallet, "Wallet"], [LifeBuoy, "Support"], [Settings, "Settings"]].map(([I, l, on]) => {
                const Icon = I as typeof Wallet;
                return <div key={l as string} className={`flex items-center gap-2 rounded-lg px-3 py-2 ${on ? "bg-indigo-50 font-medium text-indigo-700" : "text-slate-600"}`}><Icon className="h-4 w-4" />{l as string}</div>;
              })}
            </aside>
            <div className="col-span-12 space-y-4 p-5 md:col-span-9">
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 p-4 text-white sm:col-span-1">
                  <div className="flex items-center justify-between text-xs text-indigo-100"><span>Wallet balance</span><Wallet className="h-4 w-4" /></div>
                  <div className="mt-2 font-display text-3xl font-bold">$48.20</div>
                  <button className="mt-3 flex items-center gap-1 rounded-md bg-white/20 px-2.5 py-1 text-xs"><Plus className="h-3 w-3" />Top up</button>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white p-4"><div className="text-xs text-slate-500">Active numbers</div><div className="mt-2 font-display text-3xl font-bold text-slate-900">3</div><div className="text-xs text-emerald-600">2 codes received today</div></div>
                <div className="rounded-xl border border-slate-200 bg-white p-4"><div className="text-xs text-slate-500">Subscriptions</div><div className="mt-2 font-display text-3xl font-bold text-slate-900">2</div><div className="text-xs text-slate-500">ChatGPT Plus renews in 12d</div></div>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white">
                <div className="border-b border-slate-100 px-4 py-3 text-sm font-semibold text-slate-900">Recent orders</div>
                {[
                  [Smartphone, "WhatsApp number · DE", "Code 482 913", "done"],
                  [Phone, "Google Voice · New York", "+1 (212) 555-0147", "done"],
                  [Sparkles, "ChatGPT Plus · 1 month", "Credentials sent", "done"],
                  [Users, "Telegram members · 5,000", "3,120 / 5,000 delivered", "progress"],
                ].map(([I, t, d, st]) => {
                  const Icon = I as typeof Wallet;
                  return (
                    <div key={t as string} className="flex items-center gap-3 border-b border-slate-50 px-4 py-3 text-sm last:border-0">
                      <span className="grid h-8 w-8 place-items-center rounded-lg bg-slate-100 text-slate-600"><Icon className="h-4 w-4" /></span>
                      <span className="flex-1"><span className="block font-medium text-slate-900">{t as string}</span><span className="block font-mono text-xs text-slate-500">{d as string}</span></span>
                      {st === "done"
                        ? <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs text-emerald-700"><Check className="h-3 w-3" />Delivered</span>
                        : <span className="flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-xs text-amber-700"><Clock className="h-3 w-3" />In progress</span>}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
        <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-white to-transparent" />
      </div>
    </section>
  );
}
