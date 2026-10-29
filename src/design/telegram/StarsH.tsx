"use client";

import { Minus, Plus } from "lucide-react";
import { STAR_MAX, STAR_MIN, starTiers } from "@/content/telegram-en";
import { PageShell } from "../otp/parts";
import { AnonToggle, ring, StarGlyph, StarsCheckout, TgOrderView, UsernameField, useStars } from "./parts";
import { glassForm, NightPage, StarsBelow, StarsSide } from "./night";

// Stars H — "Galaxy Slider": one big number with − / + and a slider; above it a little galaxy that fills with more
// stars as the amount grows, so you can see the size of your order. Tier chips show your price per Star.

const stops = [50, 100, 250, 500, 750, 1000, 1500, 2500, 5000, 7500, 10000, 25000, 50000, 100000];
const nearest = (n: number) => stops.reduce((b, s, i) => (Math.abs(s - n) < Math.abs(stops[b] - n) ? i : b), 0);
// Fixed positions so the server and browser draw the same galaxy; denser near the middle.
const dots = Array.from({ length: 140 }, (_, i) => {
  const a = i * 2.399, r = Math.sqrt(i / 140) * 48;
  // Rounded so the server and the browser print exactly the same numbers.
  return { x: Math.round((50 + Math.cos(a) * r) * 100) / 100, y: Math.round((50 + Math.sin(a) * r * 0.55) * 100) / 100, s: (i % 3) + 1.5, d: Math.round((i % 7) * 0.4 * 10) / 10 };
});

export default function StarsH() {
  const st = useStars(1000);
  if (st.order) return <PageShell><div className="px-6 py-14"><TgOrderView o={st.order} onAgain={st.reset} /></div></PageShell>;
  const i = nearest(st.amount);
  const lit = Math.round(8 + (Math.log(Math.max(st.amount, STAR_MIN) / STAR_MIN) / Math.log(STAR_MAX / STAR_MIN)) * 132);
  const tier = [...starTiers].reverse().find((t) => Math.max(st.amount, STAR_MIN) >= t.from)!;
  const next = starTiers.find((t) => t.from > st.amount);
  const step = (d: 1 | -1) => st.setAmount(d > 0 ? stops.find((s) => s > st.amount) ?? STAR_MAX : [...stops].reverse().find((s) => s < st.amount) ?? STAR_MIN);
  return (
    <PageShell>
      <NightPage tone="stars" side={<StarsSide st={st} />} below={<StarsBelow st={st} />}>
        <section aria-label="Choose an amount" className={`${glassForm} text-center`}>
          <div aria-hidden className="relative mx-auto h-40 w-full max-w-md">
            <span className="absolute inset-x-16 inset-y-8 animate-drift rounded-full bg-amber-400/15 blur-2xl" />
            {dots.map((p, k) => (
              <span key={k} className={`absolute rounded-full bg-amber-200 transition-all duration-700 ${k < lit ? "animate-twinkle" : "opacity-0"}`}
                style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.s, height: p.s, animationDelay: `${p.d}s`, transform: k < lit ? undefined : "scale(0)" }} />
            ))}
            <StarGlyph className="absolute start-1/2 top-1/2 h-8 w-8 -translate-x-1/2 -translate-y-1/2 animate-float drop-shadow-[0_0_20px_rgba(251,191,36,.9)] rtl:translate-x-1/2" />
          </div>

          <label htmlFor="stars-h" className="mt-2 block text-sm font-semibold uppercase tracking-widest text-white/70">Stars</label>
          <div className="mt-2 flex items-center justify-center gap-3 sm:gap-5">
            <button type="button" onClick={() => step(-1)} disabled={st.amount <= STAR_MIN} aria-label="Fewer Stars" className={`grid h-12 w-12 shrink-0 place-items-center rounded-full border border-white/25 text-white transition hover:bg-white/10 active:scale-90 disabled:opacity-40 ${ring}`}><Minus aria-hidden className="h-5 w-5" /></button>
            <input id="stars-h" type="number" inputMode="numeric" min={STAR_MIN} max={STAR_MAX} value={st.amount || ""} onChange={(e) => st.setAmount(Number(e.target.value))} aria-describedby="stars-h-hint"
              className={`w-full max-w-[15rem] rounded-2xl !bg-transparent text-center font-display text-5xl font-bold tabular-nums text-white [appearance:textfield] sm:text-6xl [&::-webkit-inner-spin-button]:appearance-none ${ring}`} />
            <button type="button" onClick={() => step(1)} disabled={st.amount >= STAR_MAX} aria-label="More Stars" className={`grid h-12 w-12 shrink-0 place-items-center rounded-full border border-white/25 text-white transition hover:bg-white/10 active:scale-90 disabled:opacity-40 ${ring}`}><Plus aria-hidden className="h-5 w-5" /></button>
          </div>
          <p id="stars-h-hint" className={`mt-1 text-sm ${st.amountError ? "font-semibold text-amber-200" : "text-white/60"}`}>{st.amountError ?? `${STAR_MIN} to ${STAR_MAX.toLocaleString("en-US")}`}</p>
          <input type="range" aria-label="Stars" aria-valuetext={`${stops[i].toLocaleString("en-US")} Stars`} min={0} max={stops.length - 1} value={i} onChange={(e) => st.setAmount(stops[Number(e.target.value)])} className="mt-6 w-full accent-amber-400" />

          <div className="mt-6 grid grid-cols-4 gap-1.5" role="list" aria-label="Price tiers">
            {starTiers.map((t) => {
              const on = t === tier;
              return (
                <div role="listitem" key={t.from} className={`rounded-xl px-2 py-2.5 text-xs transition duration-300 sm:text-sm ${on ? "scale-105 bg-amber-400 font-semibold text-amber-950 shadow-lg shadow-amber-500/30" : "bg-white/5 text-white/75"}`}>
                  <div className="font-semibold">{t.label}</div><div>${t.each.toFixed(4)}</div><span className="sr-only">{on ? ", your price" : ""}</span>
                </div>
              );
            })}
          </div>
          <p aria-live="polite" className="mt-3 text-sm text-white/80">{next ? <>Add <strong className="text-amber-300">{(next.from - st.amount).toLocaleString("en-US")}</strong> more Stars for the {next.label} price.</> : "You're getting our best price."}</p>
        </section>

        <section aria-label="Recipient" className={`${glassForm} space-y-6`}><UsernameField r={st.r} s="stars" /><AnonToggle st={st} /></section>
      </NightPage>
      <StarsCheckout st={st} />
    </PageShell>
  );
}
