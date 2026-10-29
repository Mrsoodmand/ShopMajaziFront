"use client";
import { useId } from "react";
import { useMoney } from "@/lib/money";
import { POPULAR_PACK, starPacks, starPrice } from "@/content/telegram-en";
import { PageShell } from "../otp/parts";
import { AnonToggle, StarAmountInput, StarGlyph, StarsCheckout, TgOrderView, UsernameField, useStars } from "./parts";
import { glassForm, NightPage, StarsBelow, StarsSide } from "./night";

// Stars K — "Star Stacks": the packs as gold columns that grow up from the floor one after another; taller column,
// more Stars. The chosen column glows and its star spins. On phones the row scrolls sideways inside its card.

const height = (n: number) => 36 + (Math.log(n / 50) / Math.log(200)) * 180;

export default function StarsK() {
  const usd = useMoney().format;
  const st = useStars();
  const name = useId();
  if (st.order) return <PageShell><div className="px-6 py-14"><TgOrderView o={st.order} onAgain={st.reset} /></div></PageShell>;
  return (
    <PageShell>
      <NightPage tone="stars" side={<StarsSide st={st} />} below={<StarsBelow st={st} />}>
        <section aria-label="Recipient" className={glassForm}><UsernameField r={st.r} s="stars" /></section>

        <section aria-label="Amount" className={glassForm}>
          <fieldset>
            <legend className="text-base font-semibold text-white">How many Stars?</legend>
            <div className="-mx-2 mt-4 overflow-x-auto px-2 pb-2">
              <div className="flex min-w-[560px] items-end justify-between gap-2.5 border-b border-white/15 pt-10">
                {starPacks.map((n, i) => {
                  const on = st.amount === n;
                  return (
                    <label key={n} className="group flex flex-1 cursor-pointer flex-col items-center">
                      <input type="radio" name={name} checked={on} onChange={() => st.setAmount(n)} className="peer sr-only" />
                      <span className={`mb-6 whitespace-nowrap text-xs font-semibold ${on ? "text-amber-200" : "text-white/60"}`}>{usd(starPrice(n))}</span>
                      <span className={`relative w-full origin-bottom animate-rise rounded-t-2xl transition duration-300 group-hover:brightness-125 peer-focus-visible:ring-2 peer-focus-visible:ring-amber-300 ${on ? "bg-gradient-to-t from-amber-600 to-amber-300 shadow-[0_0_30px_rgba(251,191,36,.6)]" : "bg-gradient-to-t from-amber-900/70 to-amber-500/60"}`}
                        style={{ height: height(n), animationDelay: `${i * 90}ms` }}>
                        <StarGlyph className={`absolute -top-4 start-1/2 h-7 w-7 -translate-x-1/2 transition duration-500 rtl:translate-x-1/2 ${on ? "rotate-[144deg] scale-125 drop-shadow-[0_0_12px_rgba(251,191,36,1)]" : ""}`} />
                        {n === POPULAR_PACK && <span className="absolute inset-x-0 bottom-2 text-center text-[10px] font-bold uppercase tracking-wide text-amber-950">Popular</span>}
                      </span>
                      <span className={`mt-2 font-display text-sm font-bold sm:text-base ${on ? "text-white" : "text-white/80"}`}>{n >= 1000 ? `${n / 1000}K` : n}<span className="sr-only"> Stars</span></span>
                    </label>
                  );
                })}
              </div>
            </div>
          </fieldset>
        </section>

        <section aria-label="More options" className={`${glassForm} grid gap-5 sm:grid-cols-2`}><StarAmountInput st={st} /><div className="sm:pt-7"><AnonToggle st={st} /></div></section>
      </NightPage>
      <StarsCheckout st={st} />
    </PageShell>
  );
}
