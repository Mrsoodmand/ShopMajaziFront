"use client";
import { Minus, Plus } from "lucide-react";
import { useMoney } from "@/lib/money";
import { STAR_MAX, STAR_MIN, starTiers, tgHeadings } from "@/content/telegram-en";
import { PageShell } from "../otp/parts";
import { useHasExtras } from "../service/slot";
import { accent, card, H2, ring, StarGlyph, StarsCheckout, TgFaq, TgOrderView, Title, UsernameField, useStars } from "./parts";
import { UsesGrid } from "./stars";

// Stars B — "Big Counter": one large, editable number of Stars in the middle of the page. A slider (with stops that
// grow like 50, 100, 250…) and − / + change it; a bar under it shows which price tier you are in and how many more
// Stars reach the next one. Username and Buy follow.

const stops = [50, 100, 250, 500, 750, 1000, 1500, 2500, 5000, 7500, 10000, 25000, 50000, 100000];
const nearest = (n: number) => stops.reduce((b, s, i) => (Math.abs(s - n) < Math.abs(stops[b] - n) ? i : b), 0);

export default function StarsB() {
  const usd = useMoney().format;
  const st = useStars(1000);
  const extras = useHasExtras();
  if (st.order) return <PageShell><div className="px-6 py-14"><TgOrderView o={st.order} onAgain={st.reset} /></div></PageShell>;
  const i = nearest(st.amount);
  const tier = [...starTiers].reverse().find((t) => Math.max(st.amount, STAR_MIN) >= t.from)!;
  const next = starTiers.find((t) => t.from > st.amount);
  // − / + jump to the next stop below or above the current amount.
  const step = (d: 1 | -1) => st.setAmount(d > 0 ? stops.find((s) => s > st.amount) ?? STAR_MAX : [...stops].reverse().find((s) => s < st.amount) ?? STAR_MIN);
  return (
    <PageShell>
      <div className="mx-auto max-w-3xl px-4 pb-24 pt-14 sm:px-6">
        <Title s="stars" center sub={tgHeadings.stars.sub}>{tgHeadings.stars.h1}</Title>

        <section aria-label="Choose an amount" className={`${card} mt-10 p-6 text-center sm:p-10`}>
          <label htmlFor="stars-big" className="text-sm font-semibold uppercase tracking-widest text-slate-600 dark:text-slate-400">Stars</label>
          <div className="mt-3 flex items-center justify-center gap-3 sm:gap-5">
            <button type="button" onClick={() => step(-1)} disabled={st.amount <= STAR_MIN} aria-label="Fewer Stars" className={`grid h-12 w-12 shrink-0 place-items-center rounded-full border border-slate-300 text-slate-800 disabled:opacity-40 dark:border-white/20 dark:text-white ${ring}`}><Minus aria-hidden className="h-5 w-5" /></button>
            <div className="relative min-w-0">
              <StarGlyph className="pointer-events-none absolute start-0 top-1/2 h-8 w-8 -translate-y-1/2 sm:h-10 sm:w-10" />
              <input id="stars-big" type="number" inputMode="numeric" min={STAR_MIN} max={STAR_MAX} value={st.amount || ""} onChange={(e) => st.setAmount(Number(e.target.value))} aria-describedby="stars-big-hint"
                className={`w-full max-w-[16rem] rounded-2xl bg-transparent ps-11 text-center font-display text-5xl font-bold tabular-nums text-slate-900 [appearance:textfield] sm:ps-14 sm:text-7xl dark:text-white [&::-webkit-inner-spin-button]:appearance-none ${ring}`} />
            </div>
            <button type="button" onClick={() => step(1)} disabled={st.amount >= STAR_MAX} aria-label="More Stars" className={`grid h-12 w-12 shrink-0 place-items-center rounded-full border border-slate-300 text-slate-800 disabled:opacity-40 dark:border-white/20 dark:text-white ${ring}`}><Plus aria-hidden className="h-5 w-5" /></button>
          </div>
          <p id="stars-big-hint" className={`mt-2 text-sm ${st.amountError ? "font-semibold text-red-700 dark:text-red-400" : "text-slate-600 dark:text-slate-400"}`}>{st.amountError ?? `${STAR_MIN} to ${STAR_MAX.toLocaleString("en-US")}`}</p>

          <input type="range" aria-label="Stars" aria-valuetext={`${stops[i].toLocaleString("en-US")} Stars`} min={0} max={stops.length - 1} value={i} onChange={(e) => st.setAmount(stops[Number(e.target.value)])} className="mt-8 w-full accent-amber-500" />
          <div aria-hidden className="mt-1 flex justify-between text-xs text-slate-500"><span>50</span><span>1K</span><span>10K</span><span>100K</span></div>

          <div className="mt-8 grid grid-cols-4 gap-1.5" role="list" aria-label="Price tiers">
            {starTiers.map((t) => {
              const on = t === tier;
              return (
                <div role="listitem" key={t.from} className={`rounded-xl px-2 py-2.5 text-xs sm:text-sm ${on ? "bg-amber-400 font-semibold text-amber-950" : "bg-slate-100 text-slate-700 dark:bg-white/5 dark:text-slate-300"}`}>
                  <div className="font-semibold">{t.label}</div><div>${t.each.toFixed(4)}</div><span className="sr-only">{on ? ", your price" : ""}</span>
                </div>
              );
            })}
          </div>
          <p aria-live="polite" className="mt-3 text-sm text-slate-700 dark:text-slate-300">{next ? <>Add <strong>{(next.from - st.amount).toLocaleString("en-US")}</strong> more Stars for the {next.label} price.</> : "You're getting our best price."}</p>

          <div aria-live="polite" className="mt-8 border-t border-slate-200 pt-6 dark:border-white/10">
            <div className="text-sm text-slate-600 dark:text-slate-400">You pay</div>
            <div className="font-display text-4xl font-bold text-slate-900 dark:text-white">{usd(st.total)}</div>
          </div>
        </section>

        <section aria-label="Recipient" className={`${card} mt-6 space-y-6 p-6 sm:p-8`}>
          <UsernameField r={st.r} s="stars" big />
          <button type="button" onClick={st.proceed} className={`${accent.stars.btn} w-full py-4 text-lg`}>Buy Stars · {usd(st.total)}</button>
        </section>

        <section aria-labelledby="uses" className="mt-20"><H2 id="uses">What Stars are for</H2><div className="mt-6 [&_ul]:lg:grid-cols-2"><UsesGrid /></div></section>
        {!extras && <section aria-labelledby="faq" className="mt-16"><H2 id="faq">Common questions</H2><div className="mt-6"><TgFaq s="stars" /></div></section>}
      </div>
      <StarsCheckout st={st} />
    </PageShell>
  );
}
