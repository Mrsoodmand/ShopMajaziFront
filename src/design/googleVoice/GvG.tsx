"use client";
import { useId, useState } from "react";
import { Phone, RotateCcw, Zap } from "lucide-react";
import { useMoney } from "@/lib/money";
import { GV_PRICE, gvNumbers, matches } from "@/content/google-voice-en";
import { PageShell } from "../otp/parts";
import { Faq, GvCheckout, Included, OrderView, useGv } from "./parts";
import { CitySelect, field, H1, H2, Label, Live, NumberRadios, secondary, Summary } from "./clean";

const facts = [
  { icon: Phone, title: "Calls and texts", text: "A real US line in the Voice app." },
  { icon: Zap, title: "Instant delivery", text: "Login appears right after paying." },
  { icon: RotateCcw, title: "Replace or refund", text: "If the login ever fails." },
];

// Page G — "Search + Summary": the list and its filters on the left, your order summary always in view on the right
// (below the list on phones). Search by digits or city, narrow by city, pick, pay. Minimal colour, generous spacing.
export default function GvG() {
  const usd = useMoney().format;
  const gv = useGv();
  const [q, setQ] = useState("");
  const [city, setCity] = useState("all");
  const qId = useId(), cityId = useId();
  const list = gvNumbers.filter((n) => (city === "all" || n.city === city) && matches(n, q));

  if (gv.order) return <PageShell><div className="px-6 py-14"><OrderView gv={gv} /></div></PageShell>;

  return (
    <PageShell>
      <div className="mx-auto max-w-6xl px-6 pb-24 pt-14">
        <H1 sub={`Pick a US number for calls and texts. It comes on its own Google account and costs ${usd(GV_PRICE)} once.`}>Buy a Google Voice number</H1>

        <ul className="mt-8 grid gap-4 sm:grid-cols-3">
          {facts.map(({ icon: I, title, text }) => (
            <li key={title} className="flex gap-3">
              <I aria-hidden className="mt-0.5 h-5 w-5 shrink-0 text-emerald-700 dark:text-emerald-300" />
              <span><span className="block font-semibold text-slate-900 dark:text-white">{title}</span><span className="text-slate-600 dark:text-slate-400">{text}</span></span>
            </li>
          ))}
        </ul>

        <div className="mt-12 grid grid-cols-[minmax(0,1fr)] gap-10 lg:grid-cols-[minmax(0,1fr)_360px]">
          <section aria-labelledby="pick">
            <H2 id="pick">Choose a number</H2>
            <div role="search" className="mt-5 grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor={qId} hint="Area code, digits or city">Search</Label>
                <input id={qId} type="search" value={q} onChange={(e) => setQ(e.target.value)} inputMode="search" autoComplete="off" className={`${field} mt-2`} placeholder="e.g. 415" />
              </div>
              <div>
                <Label htmlFor={cityId} hint="Show one city only">City</Label>
                <div className="mt-2"><CitySelect id={cityId} value={city} onChange={setCity} /></div>
              </div>
            </div>

            <p className="mt-6 text-slate-700 dark:text-slate-300" aria-hidden><strong>{list.length}</strong> {list.length === 1 ? "number" : "numbers"} available</p>
            <Live>{list.length} {list.length === 1 ? "number" : "numbers"} available.</Live>

            {list.length ? (
              <div className="mt-4"><NumberRadios legend="Available numbers" hideLegend list={list} gv={gv} cols={2} /></div>
            ) : (
              <div className="mt-4 rounded-2xl border border-slate-300 p-8 text-center dark:border-white/20">
                <p className="text-slate-700 dark:text-slate-300">No number matches “{q}”.</p>
                <button onClick={() => { setQ(""); setCity("all"); }} className={`${secondary} mt-4`}>Show all numbers</button>
              </div>
            )}
          </section>

          <div className="lg:sticky lg:top-24 lg:self-start"><Summary gv={gv} /></div>
        </div>

        <div className="mt-20 grid gap-12 lg:grid-cols-2">
          <section aria-labelledby="included"><H2 id="included">What you get</H2><div className="mt-6"><Included /></div></section>
          <section aria-labelledby="faq"><H2 id="faq">Common questions</H2><div className="mt-6"><Faq /></div></section>
        </div>
      </div>
      <GvCheckout gv={gv} />
    </PageShell>
  );
}
