"use client";
import { useId } from "react";
import { useMoney } from "@/lib/money";
import { starPrice, tgHeadings } from "@/content/telegram-en";
import { PageShell } from "../otp/parts";
import { useHasExtras } from "../service/slot";
import { accent, H2, StarGlyph, StarsCheckout, TgFaq, TgOrderView, Title, Trust, UsernameField, useStars } from "./parts";
import { TierTable, UsesGrid } from "./stars";

// Stars D — "Night Sky": a dark, star-filled hero with the whole purchase in it: username, a row of amount chips,
// and Buy. The rest of the page (what Stars are for, prices, FAQ) is below for people who want to read first.

const chips = [100, 250, 500, 1000, 2500, 5000];
// Fixed positions so the server and browser render the same sky.
const sky = Array.from({ length: 60 }, (_, i) => ({ x: (i * 37) % 100, y: (i * 61) % 100, s: (i % 3) + 1, d: (i % 5) * 0.6 }));

export default function StarsD() {
  const usd = useMoney().format;
  const st = useStars();
  const extras = useHasExtras();
  const name = useId();
  if (st.order) return <PageShell><div className="px-6 py-14"><TgOrderView o={st.order} onAgain={st.reset} /></div></PageShell>;
  return (
    <PageShell>
      <section aria-label="Buy Stars" className={`relative -mt-16 overflow-hidden pb-20 pt-32 ${accent.stars.hero}`}>
        <div aria-hidden className="absolute inset-0">
          {sky.map((p, i) => <span key={i} className="absolute animate-pulse rounded-full bg-amber-100" style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.s, height: p.s, animationDelay: `${p.d}s`, opacity: 0.3 + p.s * 0.2 }} />)}
        </div>
        <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6">
          <StarGlyph className="mx-auto h-16 w-16 drop-shadow-[0_0_30px_rgba(251,191,36,.8)]" />
          <div className="mt-6"><Title s="stars" light center sub={tgHeadings.stars.sub}>{tgHeadings.stars.h1}</Title></div>

          <div className="mt-10 rounded-[2rem] border border-white/15 bg-white/[.06] p-5 text-start backdrop-blur-md sm:p-7">
            <div className="[&_label]:!text-white [&_p]:!text-white/70 [&_input]:!border-white/20 [&_input]:!bg-black/30 [&_input]:!text-white"><UsernameField r={st.r} s="stars" hint="We never need a password or login code." /></div>
            <fieldset className="mt-6">
              <legend className="text-base font-semibold text-white">Amount</legend>
              <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-6">
                {chips.map((n) => {
                  const on = st.amount === n;
                  return (
                    <label key={n} className={`cursor-pointer rounded-2xl border px-2 py-3 text-center transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-amber-400 ${on ? "border-amber-400 bg-amber-400 text-amber-950" : "border-white/20 text-white hover:border-white/50"}`}>
                      <input type="radio" name={name} checked={on} onChange={() => st.setAmount(n)} className="sr-only" />
                      <span className="block font-display text-lg font-bold">{n.toLocaleString("en-US")}</span>
                      <span className={`block text-xs ${on ? "text-amber-900" : "text-white/60"}`}>{usd(starPrice(n))}</span>
                    </label>
                  );
                })}
              </div>
            </fieldset>
            <button type="button" onClick={st.proceed} className={`${accent.stars.btn} mt-6 w-full py-4 text-lg`}>Buy {st.amount.toLocaleString("en-US")} Stars · {usd(st.total)}</button>
            <p className="mt-3 text-center text-sm text-white/60">Need a different amount? Up to 100,000 on the <a href="#prices" className="font-semibold text-amber-300 underline underline-offset-2">price list</a>.</p>
          </div>
          <div className="mt-8 flex justify-center"><Trust light items={["No login needed", "1–5 minute delivery", "Refund if not delivered"]} /></div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl space-y-20 px-4 py-20 sm:px-6">
        <section aria-labelledby="uses"><H2 id="uses">What Stars are for</H2><div className="mt-6"><UsesGrid /></div></section>
        <section id="prices" aria-labelledby="tiers" className="max-w-3xl scroll-mt-24"><H2 id="tiers">Prices</H2><p className="mt-2 text-slate-700 dark:text-slate-300">The more you buy, the less each Star costs.</p><div className="mt-6"><TierTable st={st} /></div></section>
        {!extras && <section aria-labelledby="faq" className="max-w-3xl"><H2 id="faq">Common questions</H2><div className="mt-6"><TgFaq s="stars" /></div></section>}
      </div>
      <StarsCheckout st={st} />
    </PageShell>
  );
}
