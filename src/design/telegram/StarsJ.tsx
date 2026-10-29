"use client";
import { useId } from "react";
import { useMoney } from "@/lib/money";
import { POPULAR_PACK, starEach, starPacks, starPrice, starTiers } from "@/content/telegram-en";
import { PageShell } from "../otp/parts";
import { AnonToggle, StarAmountInput, StarGlyph, StarsCheckout, TgOrderView, UsernameField, useStars } from "./parts";
import { glassForm, NightPage, StarsBelow, StarsSide } from "./night";

// Stars J — "Bento": the packs as a bento grid of glass tiles in different sizes. The popular 500 is a big tile, the
// best-price 10,000 a wide one; every tile shows its saving per Star. The chosen tile gets a turning gold border.

const base = starTiers[0].each;
const span: Record<number, string> = { [POPULAR_PACK]: "col-span-2 sm:row-span-2", 10000: "col-span-2" };

export default function StarsJ() {
  const usd = useMoney().format;
  const st = useStars();
  const name = useId();
  if (st.order) return <PageShell><div className="px-6 py-14"><TgOrderView o={st.order} onAgain={st.reset} /></div></PageShell>;
  return (
    <PageShell>
      <NightPage tone="stars" side={<StarsSide st={st} />} below={<StarsBelow st={st} />}>
        <section aria-label="Recipient" className={glassForm}><UsernameField r={st.r} s="stars" /></section>

        <fieldset>
          <legend className="text-base font-semibold text-white">How many Stars?</legend>
          <div className="mt-3 grid grid-flow-dense grid-cols-2 gap-3 sm:grid-cols-4">
            {starPacks.map((n) => {
              const on = st.amount === n;
              const big = n === POPULAR_PACK;
              const save = Math.round((1 - starEach(n) / base) * 100);
              return (
                <label key={n} className={`group relative cursor-pointer overflow-hidden rounded-3xl p-[2px] transition duration-300 hover:-translate-y-1 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-amber-300 ${span[n] ?? ""} ${on ? "animate-pop" : ""}`}>
                  <input type="radio" name={name} checked={on} onChange={() => st.setAmount(n)} className="sr-only" />
                  <span aria-hidden className={`absolute -inset-[60%] animate-spin-slow bg-[conic-gradient(from_0deg,#fbbf24,transparent_30%,#f97316,transparent_70%,#fbbf24)] [animation-duration:5s] transition-opacity ${on ? "opacity-100" : "opacity-0 group-hover:opacity-40"}`} />
                  <span className={`relative flex h-full flex-col justify-between rounded-[calc(1.5rem-2px)] border border-white/10 bg-[#1c1206]/90 backdrop-blur ${big ? "p-6" : "p-4"}`}>
                    <span className="flex items-start justify-between gap-2">
                      <StarGlyph className={`${big ? "h-12 w-12" : "h-6 w-6"} transition duration-500 ${on ? "rotate-[144deg] drop-shadow-[0_0_16px_rgba(251,191,36,.9)]" : ""}`} />
                      {big ? <span className="rounded-full bg-amber-400 px-2.5 py-0.5 text-xs font-bold text-amber-950">Popular</span> : n === 10000 ? <span className="rounded-full bg-white/15 px-2.5 py-0.5 text-xs font-bold text-white">Best price</span> : null}
                    </span>
                    <span className={big ? "mt-10" : "mt-4"}>
                      <span className={`block font-display font-bold text-white ${big ? "text-5xl" : "text-2xl"}`}>{n.toLocaleString("en-US")}</span>
                      <span className="mt-0.5 flex flex-wrap items-baseline justify-between gap-x-2 text-sm"><span className="font-semibold text-amber-200">{usd(starPrice(n))}</span>{save > 0 && <span className="text-white/60">save {save}%</span>}</span>
                    </span>
                  </span>
                </label>
              );
            })}
          </div>
        </fieldset>

        <section aria-label="More options" className={`${glassForm} grid gap-5 sm:grid-cols-2`}><StarAmountInput st={st} /><div className="sm:pt-7"><AnonToggle st={st} /></div></section>
      </NightPage>
      <StarsCheckout st={st} />
    </PageShell>
  );
}
