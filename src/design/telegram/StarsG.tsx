"use client";
import { useId } from "react";
import { useMoney } from "@/lib/money";
import { POPULAR_PACK, starPacks, starPrice } from "@/content/telegram-en";
import { PageShell } from "../otp/parts";
import { AnonToggle, StarAmountInput, StarGlyph, StarsCheckout, TgOrderView, UsernameField, useStars } from "./parts";
import { PackRadios } from "./stars";
import { glassForm, NightPage, StarsBelow, StarsSide } from "./night";

// Stars G — "Constellation": the packs are stars in a constellation that draws itself in; the more Stars in a
// pack, the bigger and brighter its star. Pick one by clicking it (or with the arrow keys, it's a radio group).
// On phones the map becomes the usual pack grid.

const spots = [[7, 74], [19, 46], [31, 66], [44, 32], [56, 58], [68, 24], [80, 50], [92, 18]];
const size = (n: number) => 18 + (Math.log(n / 50) / Math.log(200)) * 38;

export default function StarsG() {
  const usd = useMoney().format;
  const st = useStars();
  const name = useId();
  if (st.order) return <PageShell><div className="px-6 py-14"><TgOrderView o={st.order} onAgain={st.reset} /></div></PageShell>;
  return (
    <PageShell>
      <NightPage tone="stars" title="Pick your Stars" side={<StarsSide st={st} />} below={<StarsBelow st={st} />}>
        <section aria-label="Choose" className={glassForm}><UsernameField r={st.r} s="stars" /></section>

        <section aria-label="Amount" className={`${glassForm} !p-4 sm:!p-6`}>
          <fieldset className="hidden sm:block">
            <legend className="px-2 text-base font-semibold text-white">How many Stars?</legend>
            <div className="relative mt-2 aspect-[16/9] w-full">
              <svg aria-hidden viewBox="0 0 100 56.25" preserveAspectRatio="none" className="absolute inset-0 h-full w-full overflow-visible">
                <polyline points={spots.map(([x, y]) => `${x},${y * 0.5625}`).join(" ")} fill="none" stroke="rgba(251,191,36,.45)" strokeWidth="1.5" vectorEffect="non-scaling-stroke" strokeDasharray="1" pathLength={1} className="animate-draw" />
              </svg>
              {starPacks.map((n, i) => {
                const on = st.amount === n;
                const s = size(n);
                return (
                  <label key={n} className="group absolute flex -translate-x-1/2 -translate-y-1/2 cursor-pointer flex-col items-center rtl:translate-x-1/2" style={{ left: `${spots[i][0]}%`, top: `${spots[i][1]}%` }}>
                    <input type="radio" name={name} checked={on} onChange={() => st.setAmount(n)} className="peer sr-only" />
                    <span className={`grid place-items-center rounded-full transition duration-300 group-hover:scale-110 peer-focus-visible:ring-2 peer-focus-visible:ring-amber-300 ${on ? "animate-pop bg-amber-400/20 shadow-[0_0_40px_10px_rgba(251,191,36,.45)]" : ""}`} style={{ width: s + 18, height: s + 18 }}>
                      <StarGlyph style={{ width: s, height: s, animationDelay: `${i * 0.3}s` }} className={`transition duration-500 ${on ? "rotate-[144deg]" : "animate-twinkle"}`} />
                    </span>
                    <span className={`mt-1 whitespace-nowrap rounded-full px-2 py-0.5 text-center text-sm font-bold ${on ? "bg-amber-400 text-amber-950" : "text-white"}`}>{n.toLocaleString("en-US")}</span>
                    <span className="text-xs text-white/60">{usd(starPrice(n))}{n === POPULAR_PACK && " · Popular"}</span>
                  </label>
                );
              })}
            </div>
          </fieldset>
          <div className="p-2 sm:hidden"><PackRadios st={st} cols={2} dark /></div>
        </section>

        <section aria-label="More options" className={`${glassForm} grid gap-5 sm:grid-cols-2`}><StarAmountInput st={st} /><div className="sm:pt-7"><AnonToggle st={st} /></div></section>
      </NightPage>
      <StarsCheckout st={st} />
    </PageShell>
  );
}
