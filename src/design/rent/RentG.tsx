"use client";

import { useEffect, useRef } from "react";
import { Check, Clock, Globe2, Smartphone } from "lucide-react";
import { PageShell } from "../otp/parts";
import { MethodSwitch, PayAgain, RentPayModal, scrollList, StepChoices, stepTitle, useRentFlow, type StepId } from "./flow";
import { useHasExtras } from "../service/slot";
import { Heading, Points, RentFaq, RentOrderView, Title } from "./parts";
import { useT } from "@/i18n/client";

const icons: Record<StepId, typeof Clock> = { period: Clock, country: Globe2, app: Smartphone };

// Page G — "Columns": like the virtual number page L. The steps sit side by side, left to right (two for all apps,
// three for one app); each unlocks once the one before it is chosen, and the last choice opens the payment window.
// Long lists (countries, apps) scroll inside their card, so the page itself stays short. On phones, where the cards
// stack, each choice scrolls the page down to the next card and moves focus to its heading.
export default function RentG() {
  const t = useT();
  const f = useRentFlow();
  // On the live page the shared sections (how to use, FAQ, …) follow, so this design's own copies are dropped.
  const extras = useHasExtras();
  const heads = useRef<Partial<Record<StepId, HTMLHeadingElement | null>>>({});
  const prev = useRef({ step: f.current, method: f.method });
  useEffect(() => {
    const was = prev.current;
    prev.current = { step: f.current, method: f.method };
    // Only when moving forward within the same method (not on load, not when switching method or going back).
    if (was.method !== f.method || f.steps.indexOf(f.current) <= f.steps.indexOf(was.step)) return;
    if (!window.matchMedia("(max-width: 1023px)").matches) return;
    const h = heads.current[f.current];
    if (!h) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // Wait a beat so the next card has unlocked and rendered its list.
    setTimeout(() => {
      h.closest("section")?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
      h.focus({ preventScroll: true });
    }, 120);
  }, [f.current, f.method, f.steps]);
  if (f.order) return <PageShell><div className="px-6 py-14"><RentOrderView order={f.order} onReset={f.reset} /></div></PageShell>;

  return (
    <PageShell>
      <div className="mx-auto max-w-7xl px-6 pb-24 pt-14">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <Title sub={f.method === "all" ? t("Choose how long, then a country. The number takes SMS from any app.") : t("Choose a country, how long, then the app. Cheaper than all apps.")}>{t("Rent a number")}</Title>
          <MethodSwitch f={f} />
        </div>

        <div key={f.method} className={`mt-10 grid grid-cols-[minmax(0,1fr)] items-start gap-4 ${f.method === "all" ? "lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)]" : "lg:grid-cols-3"}`}>
          {f.steps.map((s, i) => {
            const open = f.unlocked(s);
            const done = f.value[s];
            const Icon = icons[s];
            return (
              <section key={s} aria-labelledby={`col-${s}`} className={`scroll-mt-24 rounded-3xl border border-slate-200 bg-white p-4 dark:border-white/15 dark:bg-[#0E1424] ${open ? "" : "opacity-60"}`}>
                <h2 id={`col-${s}`} ref={(el) => { heads.current[s] = el; }} tabIndex={-1} className="flex items-center gap-2 px-1 font-display font-semibold text-slate-900 outline-none dark:text-white">
                  <span aria-hidden className={`grid h-7 w-7 place-items-center rounded-full text-xs font-bold ${done ? "bg-emerald-700 text-white dark:bg-emerald-400 dark:text-emerald-950" : "bg-slate-900 text-white dark:bg-white dark:text-slate-900"}`}>{done ? <Check className="h-3.5 w-3.5" /> : i + 1}</span>
                  <Icon aria-hidden className="h-4 w-4 text-slate-500" />{t.tr(stepTitle)[s]}
                </h2>
                {open
                  ? <div className="mt-3 animate-fade-up [animation-duration:250ms]"><StepChoices f={f} step={s} scroll={scrollList} /></div>
                  : <p className="px-1 py-10 text-center text-slate-600 dark:text-slate-400">{t("Choose")}{" "}{t.tr(stepTitle)[f.steps[i - 1]].toLowerCase()}{" "}{t("first")}</p>}
              </section>
            );
          })}
        </div>
        <div className="mx-auto mt-6 max-w-md"><PayAgain f={f} /></div>

        <section aria-labelledby="why" className="mt-20"><Heading id="why">{t("Why rent a number")}</Heading><div className="mt-6"><Points /></div></section>
        {!extras && <section aria-labelledby="faq" className="mt-16 max-w-3xl"><Heading id="faq">{t("Common questions")}</Heading><div className="mt-6"><RentFaq /></div></section>}
      </div>
      <RentPayModal f={f} />
    </PageShell>
  );
}
