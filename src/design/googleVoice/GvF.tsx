"use client";
import { useId, useState } from "react";
import { useMoney } from "@/lib/money";
import { GV_PRICE, gvNumbers } from "@/content/google-voice-en";
import { PageShell } from "../otp/parts";
import { Faq, GvCheckout, Included, OrderView, useGv } from "./parts";
import { CitySelect, H1, H2, Label, Live, NumberRadios, Summary } from "./clean";

// Page F — "One Simple Form": one calm column that reads top to bottom like a form. 1 · where, 2 · which number,
// 3 · review and pay. Plain words, big type, nothing to hunt for. Below it: what you get and the FAQ.
export default function GvF() {
  const usd = useMoney().format;
  const gv = useGv();
  const [city, setCity] = useState("all");
  const cityId = useId();
  const list = gvNumbers.filter((n) => city === "all" || n.city === city);

  if (gv.order) return <PageShell><div className="px-6 py-14"><OrderView gv={gv} /></div></PageShell>;

  const step = "flex gap-4";
  const badge = "grid h-9 w-9 shrink-0 place-items-center rounded-full bg-slate-900 font-display text-base font-bold text-white dark:bg-white dark:text-slate-900";

  return (
    <PageShell>
      <div className="mx-auto max-w-2xl px-6 pb-24 pt-14">
        <H1 sub={<>A real US phone number for calls and texts, on its own Google account. You pay <strong>{usd(GV_PRICE)}</strong> once.</>}>Get a permanent US number</H1>

        <ol className="mt-12 space-y-12">
          <li className={step}>
            <span aria-hidden className={badge}>1</span>
            <div className="flex-1">
              <H2>Where should it be from?</H2>
              <div className="mt-4">
                <Label htmlFor={cityId} hint="The area code matches the city.">City</Label>
                <div className="mt-2"><CitySelect id={cityId} value={city} onChange={(v) => { setCity(v); const first = gvNumbers.find((n) => v === "all" || n.city === v); if (first) gv.setSelected(first); }} allLabel="Any city" /></div>
              </div>
            </div>
          </li>

          <li className={step}>
            <span aria-hidden className={badge}>2</span>
            <div className="flex-1">
              <H2>Choose your number</H2>
              <p className="mt-1 text-slate-600 dark:text-slate-400">{list.length} available. Every number costs the same.</p>
              <Live>{list.length} numbers available. Selected {gv.selected.number}.</Live>
              <div className="mt-4"><NumberRadios legend="Available numbers" hideLegend list={list} gv={gv} /></div>
            </div>
          </li>

          <li className={step}>
            <span aria-hidden className={badge}>3</span>
            <div className="flex-1">
              <H2>Review and pay</H2>
              <div className="mt-4"><Summary gv={gv} title="Order summary" /></div>
            </div>
          </li>
        </ol>

        <section aria-labelledby="included" className="mt-20">
          <H2 id="included">What you get</H2>
          <p className="mt-2 text-slate-700 dark:text-slate-300">Shown in your dashboard right after paying.</p>
          <div className="mt-6"><Included /></div>
        </section>

        <section aria-labelledby="faq" className="mt-16">
          <H2 id="faq">Common questions</H2>
          <div className="mt-6"><Faq /></div>
        </section>
      </div>
      <GvCheckout gv={gv} />
    </PageShell>
  );
}
