import { Zap, ShieldCheck, Headphones, Lock, Wallet, CreditCard, Bitcoin, Check } from "lucide-react";

// Offer B — "Bento Proof": each reason is a tile that shows it instead of saying it: a delivery timer, a refund
// notification, support avatars, a lock, payment chips and a big orders counter. Matches hero G's soft style.
export default function WhyB() {
  const tile = "relative overflow-hidden rounded-3xl p-7 ring-1 transition duration-300 ease-out hover:-translate-y-0.5 hover:shadow-xl motion-reduce:hover:translate-y-0";
  return (
    <section className="relative overflow-hidden bg-[#F5F6FB] py-24 dark:bg-[#070B14]">
      <div aria-hidden className="pointer-events-none absolute -top-24 start-[15%] h-80 w-80 rounded-full bg-indigo-300/40 blur-[120px] dark:bg-indigo-600/20" />
      <div className="relative mx-auto max-w-6xl px-6">
        <div className="max-w-2xl">
          <span className="text-sm font-semibold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">Why ShopMajazi</span>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-5xl dark:text-white">Fast, safe and actually supported.</h2>
        </div>

        <div className="mt-12 grid auto-rows-[minmax(200px,auto)] gap-4 md:grid-cols-3">
          <div className={`${tile} bg-slate-900 text-white ring-slate-900 md:col-span-2 dark:bg-white/[.06] dark:ring-white/10`}>
            <Zap className="h-6 w-6 text-amber-300" />
            <h3 className="mt-4 font-display text-2xl font-semibold">Delivered in seconds</h3>
            <p className="mt-2 max-w-md text-sm text-slate-300">Orders are processed automatically, so there's no queue and no waiting for an operator.</p>
            <div className="mt-6 flex items-end gap-3">
              <span className="font-display text-6xl font-bold tracking-tight text-amber-300">27s</span>
              <span className="pb-2 text-sm text-slate-400">average from payment to delivery</span>
            </div>
          </div>

          <div className={`${tile} bg-emerald-50 ring-emerald-100 dark:bg-emerald-500/10 dark:ring-emerald-400/20`}>
            <ShieldCheck className="h-6 w-6 text-emerald-600 dark:text-emerald-300" />
            <h3 className="mt-4 font-display text-lg font-semibold text-slate-900 dark:text-white">Refund guarantee</h3>
            <div className="mt-5 flex items-center gap-3 rounded-2xl bg-white p-3 shadow-sm dark:bg-white/10">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-emerald-500 text-white"><Check className="h-4 w-4" /></span>
              <span className="text-xs"><span className="block font-semibold text-slate-900 dark:text-white">$0.42 refunded</span><span className="text-slate-500 dark:text-slate-400">No SMS arrived · back in wallet</span></span>
            </div>
          </div>

          <div className={`${tile} bg-white ring-slate-200 dark:bg-[#0E1424] dark:ring-white/10`}>
            <Headphones className="h-6 w-6 text-sky-600 dark:text-sky-300" />
            <h3 className="mt-4 font-display text-lg font-semibold text-slate-900 dark:text-white">Humans on chat 24/7</h3>
            <div className="mt-5 flex items-center">
              {["from-indigo-500 to-violet-500", "from-sky-400 to-cyan-500", "from-amber-400 to-orange-500", "from-emerald-400 to-teal-500"].map((g, i) => (
                <span key={i} className={`-ms-2 h-10 w-10 rounded-full bg-gradient-to-br ring-4 ring-white first:ms-0 dark:ring-[#0E1424] ${g}`} />
              ))}
              <span className="ms-3 text-xs text-slate-500 dark:text-slate-400">replies in ~2 min</span>
            </div>
          </div>

          <div className={`${tile} bg-white ring-slate-200 dark:bg-[#0E1424] dark:ring-white/10`}>
            <Lock className="h-6 w-6 text-indigo-600 dark:text-indigo-300" />
            <h3 className="mt-4 font-display text-lg font-semibold text-slate-900 dark:text-white">Private by design</h3>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">Sold numbers leave circulation. We never ask for your passwords.</p>
          </div>

          <div className={`${tile} bg-white ring-slate-200 dark:bg-[#0E1424] dark:ring-white/10`}>
            <Wallet className="h-6 w-6 text-fuchsia-600 dark:text-fuchsia-300" />
            <h3 className="mt-4 font-display text-lg font-semibold text-slate-900 dark:text-white">Pay your way</h3>
            <div className="mt-5 flex flex-wrap gap-2">
              {[[CreditCard, "Card"], [Bitcoin, "Crypto"], [Wallet, "Wallet"]].map(([I, l]) => {
                const Icon = I as typeof Wallet;
                return <span key={l as string} className="flex items-center gap-1.5 rounded-lg bg-slate-100 px-2.5 py-1.5 text-xs font-medium text-slate-700 dark:bg-white/10 dark:text-slate-200"><Icon className="h-3.5 w-3.5" />{l as string}</span>;
              })}
            </div>
          </div>

          <div className={`${tile} bg-gradient-to-br from-indigo-600 to-fuchsia-500 text-white ring-transparent md:col-span-3`}>
            <div className="flex flex-wrap items-center justify-between gap-6">
              <div>
                <h3 className="font-display text-2xl font-semibold">Trusted since 2018</h3>
                <p className="mt-1 text-sm text-white/80">Customers in more than 150 countries.</p>
              </div>
              <div className="flex gap-10">
                {[["1.2M+", "orders"], ["150+", "countries"], ["4.9/5", "rating"]].map(([v, l]) => (
                  <div key={l}><div className="font-display text-3xl font-bold">{v}</div><div className="text-xs uppercase tracking-widest text-white/70">{l}</div></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
