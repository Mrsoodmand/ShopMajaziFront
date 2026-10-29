"use client";
import { useId, useRef, useState } from "react";
import { Check } from "lucide-react";
import { useMoney } from "@/lib/money";
import { adPackages, estViews, fmt, tgHeadings } from "@/content/telegram-en";
import { PageShell } from "../otp/parts";
import { useHasExtras } from "../service/slot";
import { accent, AdErrorSummary, AdPreview, AdsCheckout, card, ContactField, GoalRadios, H2, LinkField, TargetingFields, TextField, TgFaq, TgOrderView, Title, useAds } from "./parts";
import { HowItWorks, SubmitAd } from "./ads";

// Ads B — "Packages": pricing-page style. Three packages with what's included and estimated views; choosing one
// moves you to a short brief below (link, text, audience) with a small preview. Two steps to payment.
export default function AdsB() {
  const usd = useMoney().format;
  const a = useAds({ budget: 200 });
  const extras = useHasExtras();
  const [pkg, setPkg] = useState("growth");
  const name = useId();
  const brief = useRef<HTMLHeadingElement>(null);
  if (a.order) return <PageShell><div className="px-6 py-14"><TgOrderView o={a.order} onAgain={a.reset} /></div></PageShell>;
  const choose = (id: string, budget: number) => { setPkg(id); a.set("budget", budget); };
  return (
    <PageShell>
      <div className="mx-auto max-w-6xl px-4 pb-24 pt-14 sm:px-6">
        <Title s="ads" center sub={tgHeadings.ads.sub}>Telegram Ads packages</Title>

        <fieldset className="mt-12">
          <legend className="sr-only">Choose a package</legend>
          <div className="grid gap-5 md:grid-cols-3">
            {adPackages.map((p) => {
              const on = pkg === p.id;
              return (
                <label key={p.id} className={`relative flex cursor-pointer flex-col rounded-[2rem] border-2 bg-white p-6 transition has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-sky-500 has-[:focus-visible]:ring-offset-2 dark:bg-[#0E1424] ${on ? `${accent.ads.border} shadow-xl shadow-sky-900/10` : "border-slate-200 hover:border-slate-400 dark:border-white/15"}`}>
                  <input type="radio" name={name} checked={on} onChange={() => choose(p.id, p.budget)} className="sr-only" />
                  {p.tag && <span className="absolute -top-3 start-6 rounded-full bg-sky-600 px-3 py-1 text-xs font-bold text-white">{p.tag}</span>}
                  <span className="flex items-center justify-between"><span className="font-display text-xl font-bold text-slate-900 dark:text-white">{p.name}</span><span aria-hidden className={`grid h-6 w-6 place-items-center rounded-full border-2 ${on ? "border-sky-600 bg-sky-600" : "border-slate-300 dark:border-white/30"}`}>{on && <Check className="h-3.5 w-3.5 text-white" strokeWidth={3} />}</span></span>
                  <span className="mt-1 text-slate-600 dark:text-slate-400">{p.text}</span>
                  <span className="mt-5 font-display text-4xl font-bold text-slate-900 dark:text-white">{usd(p.budget)}</span>
                  <span className={`text-sm font-semibold ${accent.ads.text}`}>~{fmt(estViews(p.budget))} views</span>
                  <ul className="mt-5 space-y-2 border-t border-slate-200 pt-5 dark:border-white/10">{p.points.map((x) => <li key={x} className="flex gap-2 text-[15px] text-slate-700 dark:text-slate-300"><Check aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-sky-600 dark:text-sky-400" />{x}</li>)}</ul>
                </label>
              );
            })}
          </div>
        </fieldset>
        <div className="mt-6 text-center"><button type="button" onClick={() => { brief.current?.scrollIntoView({ behavior: "smooth" }); brief.current?.focus(); }} className={`${accent.ads.btn}`}>Continue with {adPackages.find((p) => p.id === pkg)!.name}</button></div>

        <section aria-labelledby="brief" className="mt-20 scroll-mt-24">
          <H2 id="brief"><span ref={brief} tabIndex={-1} className="outline-none">Your brief</span></H2>
          <div className="mt-6 grid grid-cols-[minmax(0,1fr)] gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
            <div className={`${card} space-y-6 p-6 sm:p-8`}>
              <AdErrorSummary a={a} />
              <GoalRadios a={a} />
              <LinkField a={a} />
              <TextField a={a} />
              <TargetingFields a={a} />
              <ContactField a={a} />
            </div>
            <div className="space-y-5 lg:sticky lg:top-24 lg:self-start">
              <AdPreview a={a} />
              <SubmitAd a={a} className="py-4" />
            </div>
          </div>
        </section>

        <section aria-labelledby="how" className="mt-20"><H2 id="how">How it works</H2><div className="mt-6"><HowItWorks /></div></section>
        {!extras && <section aria-labelledby="faq" className="mt-16 max-w-3xl"><H2 id="faq">Common questions</H2><div className="mt-6"><TgFaq s="ads" /></div></section>}
      </div>
      <AdsCheckout a={a} />
    </PageShell>
  );
}
