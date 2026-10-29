"use client";
import { ShoppingCart, Zap, ShieldCheck } from "lucide-react";
import { useMoney } from "@/lib/money";
import { useOtpFlow } from "./flow";
import Combo from "./Combo";
import { OperatorList, OrderView, RecentOrders, SwapButton } from "./flowParts";
import { AppTile, Assurances, CC, PageShell } from "./parts";

// Page M — "Quick-Buy Hero": the page opens like the home hero, with one glass card: app and country dropdowns with a
// swap button between them, then operator choices and Buy. After buying, the card turns into the order.
export default function OtpM() {
  const usd = useMoney().format;
  const f = useOtpFlow("app");
  const appCombo = (
    <Combo label={f.first === "app" ? "1 · App" : "2 · App"} value={f.app?.id ?? ""} onChange={f.pickApp} placeholder="Choose app"
      items={f.appOptions.map((o) => ({ id: o.app.id, label: o.app.name, hint: (f.country ? "" : "from ") + usd(o.price), icon: <AppTile app={o.app} size="sm" /> }))} />
  );
  const countryCombo = (
    <Combo label={f.first === "country" ? "1 · Country" : "2 · Country"} value={f.country?.cc ?? ""} onChange={f.pickCountry} placeholder="Choose country"
      items={f.countryOptions.map((o) => ({ id: o.country.cc, label: o.country.name, search: o.country.cc, hint: (f.app ? "" : "from ") + usd(o.price), icon: <CC cc={o.country.cc} flag={o.country.flag} /> }))} />
  );

  return (
    <PageShell>
      <section className="relative overflow-hidden">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute -top-32 start-[8%] h-[420px] w-[420px] rounded-full bg-indigo-300/50 blur-[110px] dark:bg-indigo-600/30" />
          <div className="absolute -top-20 end-[6%] h-[380px] w-[380px] rounded-full bg-fuchsia-300/40 blur-[110px] dark:bg-fuchsia-600/20" />
          <div className="absolute inset-0 bg-[radial-gradient(rgba(15,23,42,.12)_1px,transparent_1px)] bg-[size:22px_22px] [mask-image:radial-gradient(ellipse_at_top,black_20%,transparent_70%)] dark:bg-[radial-gradient(rgba(255,255,255,.08)_1px,transparent_1px)]" />
        </div>
        <div className="relative mx-auto max-w-4xl px-6 pb-16 pt-16">
          <div className="text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-white bg-white/70 px-3 py-1 text-xs font-medium text-slate-600 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
              <Zap className="h-3.5 w-3.5 text-amber-500" />Number in seconds<span className="text-slate-300 dark:text-slate-600">·</span><ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />Refund if no code
            </span>
            <h1 className="mt-6 font-display text-4xl font-bold leading-[1.05] tracking-tight text-slate-900 sm:text-6xl dark:text-white">
              Virtual numbers for <span className="bg-gradient-to-r from-indigo-600 to-fuchsia-500 bg-clip-text text-transparent dark:from-indigo-300 dark:to-fuchsia-300">any app.</span>
            </h1>
          </div>

          <div className="mt-10 rounded-[2rem] border border-white bg-white/80 p-4 shadow-2xl shadow-indigo-200/60 backdrop-blur-xl sm:p-6 dark:border-white/10 dark:bg-white/[.04] dark:shadow-black/40">
            {f.step === "order" && f.order ? <OrderView order={f.order} flow={f} /> : (
              <>
                <div className="flex flex-col items-stretch gap-3 md:flex-row md:items-center">
                  <div className="flex-1">{f.first === "app" ? appCombo : countryCombo}</div>
                  <div className="flex justify-center"><SwapButton flow={f} /></div>
                  <div className="flex-1">{f.first === "app" ? countryCombo : appCombo}</div>
                </div>
                <div className={`grid transition-all duration-500 ease-out ${f.step === "operator" ? "mt-5 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                  <div className="overflow-hidden">
                    <div className="mb-3 text-[11px] font-semibold uppercase tracking-wide text-slate-400">3 · Operator</div>
                    <OperatorList ops={f.operators} value={f.operator?.id ?? null} onPick={f.pickOperator} />
                  </div>
                </div>
                <button onClick={() => f.purchase()} disabled={!f.operator} className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-indigo-600 py-4 text-base font-semibold text-white shadow-lg shadow-indigo-600/30 transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none">
                  <ShoppingCart className="h-5 w-5" />{f.operator ? `Buy number · ${usd(f.operator.price)}` : f.step === "operator" ? "Pick an operator" : "Choose app and country"}
                </button>
              </>
            )}
          </div>
          <div className="mt-6"><RecentOrders flow={f} /></div>
        </div>
      </section>
      <div className="mx-auto max-w-6xl px-6 pb-20"><Assurances /></div>
    </PageShell>
  );
}
