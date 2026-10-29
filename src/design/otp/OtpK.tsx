"use client";
import { ArrowLeft, Check, ShoppingCart } from "lucide-react";
import { useMoney } from "@/lib/money";
import { useOtpFlow } from "./flow";
import { AppChoices, CountryChoices } from "./Choices";
import { FirstSwitch, OperatorList, OrderView, RecentOrders } from "./flowParts";
import { AppTile, Assurances, CC, PageShell, PageTitle, WalletChip } from "./parts";

// Page K — "Guided Steps": one centered card walks through the flow one question at a time:
// app ⇄ country (switch which comes first), then operator, then buy. After delivery the card becomes the order.
export default function OtpK() {
  const usd = useMoney().format;
  const f = useOtpFlow("app");
  const labels = f.first === "app" ? ["App", "Country", "Operator", "Number"] : ["Country", "App", "Operator", "Number"];
  const idx = { first: 0, second: 1, operator: 2, order: 3 }[f.step];

  return (
    <PageShell>
      <div className="mx-auto max-w-3xl px-6 py-14">
        <PageTitle center title="Get a verification number" sub="Choose the app and country in any order, pick an operator, and the number is yours." />

        <ol className="mx-auto mt-10 flex max-w-xl items-center">
          {labels.map((s, i) => (
            <li key={s} className="flex flex-1 items-center last:flex-none">
              <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-full text-sm font-bold transition duration-500 ${i < idx ? "bg-emerald-500 text-white" : i === idx ? "bg-indigo-600 text-white ring-4 ring-indigo-200 dark:ring-indigo-500/30" : "bg-white text-slate-400 ring-1 ring-slate-200 dark:bg-white/5 dark:ring-white/10"}`}>{i < idx ? <Check className="h-4 w-4" /> : i + 1}</span>
              <span className={`ms-2 hidden text-sm font-medium sm:inline ${i === idx ? "text-slate-900 dark:text-white" : "text-slate-400"}`}>{s}</span>
              {i < labels.length - 1 && <span className="mx-3 h-0.5 flex-1 overflow-hidden rounded-full bg-slate-200 dark:bg-white/10"><span className={`block h-full bg-emerald-500 transition-all duration-500 ${i < idx ? "w-full" : "w-0"}`} /></span>}
            </li>
          ))}
        </ol>

        <div className="mt-8 rounded-[2rem] bg-white p-6 shadow-xl shadow-indigo-100/60 ring-1 ring-slate-200 sm:p-8 dark:bg-[#0E1424] dark:shadow-black/30 dark:ring-white/10">
          {f.step !== "order" && (
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
              {f.step === "first" ? <FirstSwitch value={f.first} onChange={f.setFirst} /> : (
                <button onClick={f.back} className="flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"><ArrowLeft className="h-4 w-4 rtl:rotate-180" />Back</button>
              )}
              <div className="flex items-center gap-2">
                {f.app && <span className="flex items-center gap-1.5 rounded-full bg-slate-100 py-1 pe-3 ps-1 text-xs font-medium text-slate-700 dark:bg-white/10 dark:text-slate-200"><AppTile app={f.app} size="sm" />{f.app.name}</span>}
                {f.country && <span className="flex items-center gap-1.5 rounded-full bg-slate-100 py-1 pe-3 ps-1 text-xs font-medium text-slate-700 dark:bg-white/10 dark:text-slate-200"><CC cc={f.country.cc} flag={f.country.flag} />{f.country.name}</span>}
              </div>
            </div>
          )}

          <div key={f.step + f.first} className="animate-fade-up [animation-duration:300ms]">
            {(f.step === "first" && f.first === "app") || (f.step === "second" && f.first === "country") ? (
              <>
                <h2 className="mb-4 font-display text-xl font-semibold text-slate-900 dark:text-white">Which app is the code for?</h2>
                <AppChoices options={f.appOptions} value={f.app?.id ?? null} onPick={f.pickApp} priced={f.appsPriced} />
              </>
            ) : f.step === "first" || f.step === "second" ? (
              <>
                <h2 className="mb-4 font-display text-xl font-semibold text-slate-900 dark:text-white">Which country should the number be from?</h2>
                <CountryChoices options={f.countryOptions} value={f.country?.cc ?? null} onPick={f.pickCountry} priced={f.app ? "exact" : "from"} />
              </>
            ) : f.step === "operator" ? (
              <>
                <h2 className="mb-4 font-display text-xl font-semibold text-slate-900 dark:text-white">Choose an operator</h2>
                <OperatorList ops={f.operators} value={f.operator?.id ?? null} onPick={f.pickOperator} />
                <button onClick={() => f.purchase()} disabled={!f.operator} className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-indigo-600 py-4 text-base font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-40">
                  <ShoppingCart className="h-5 w-5" />{f.operator ? `Buy number · ${usd(f.operator.price)}` : "Pick an operator to continue"}
                </button>
              </>
            ) : f.order ? <OrderView order={f.order} flow={f} /> : null}
          </div>
        </div>

        <div className="mt-6 flex justify-center"><WalletChip /></div>
        <div className="mt-6"><RecentOrders flow={f} /></div>
        <div className="mt-10"><Assurances /></div>
      </div>
    </PageShell>
  );
}
