"use client";

import { useState } from "react";
import { Crown } from "lucide-react";
import { premiumFeatures } from "@/content/telegram-en";
import { PageShell } from "../otp/parts";
import { glass, PremiumCheckout, ring, TgOrderView, UsernameField, usePremium } from "./parts";
import { featureIcons, PlanRadios } from "./premium";
import { glassForm, NightPage, PremiumBelow, PremiumSide, useWho, WhoRadios } from "./night";

// Premium G — "Feature Orbit": the crown in the middle with every Premium feature circling it. The ring stops when
// you point at it or tab into it; choosing a feature shows what it does under the orbit. The form follows, and the
// profile card with Buy is in the sidebar.
export default function PremiumG() {
  const pm = usePremium();
  const { who, setWho } = useWho(pm);
  const [pick, setPick] = useState(0);
  if (pm.order) return <PageShell><div className="px-6 py-14"><TgOrderView o={pm.order} onAgain={pm.reset} /></div></PageShell>;
  const f = premiumFeatures[pick];
  return (
    <PageShell>
      <NightPage tone="premium" art={false} side={<PremiumSide pm={pm} who={who} />} below={<PremiumBelow features={false} />}>
        <section aria-labelledby="orbit-h" className={`${glass} p-6 sm:p-8`}>
          <h2 id="orbit-h" className="text-center font-display text-xl font-bold text-white">Everything you unlock</h2>
          <div className="group relative mx-auto mt-4 aspect-square w-full max-w-[400px]">
            <span aria-hidden className="absolute inset-[8%] rounded-full border border-dashed border-white/20" />
            <span aria-hidden className="absolute inset-[30%] animate-drift rounded-full bg-fuchsia-500/25 blur-2xl" />
            <span className="absolute inset-0 grid place-items-center">
              <span aria-hidden className="grid h-24 w-24 animate-glow place-items-center rounded-[2rem] bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white [--glow:rgba(217,70,239,.6)]"><Crown className="h-12 w-12 animate-float" /></span>
            </span>
            <div className="absolute inset-0 animate-[spin_60s_linear_infinite] group-hover:[animation-play-state:paused] group-focus-within:[animation-play-state:paused]">
              {premiumFeatures.map((x, i) => {
                const a = (i / premiumFeatures.length) * Math.PI * 2 - Math.PI / 2;
                const I = featureIcons[x.id];
                const on = i === pick;
                return (
                  <span key={x.id} className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: `${(50 + Math.cos(a) * 42).toFixed(2)}%`, top: `${(50 + Math.sin(a) * 42).toFixed(2)}%` }}>
                    <button type="button" aria-pressed={on} onClick={() => setPick(i)} title={x.title}
                      className={`grid h-12 w-12 animate-[spin_60s_linear_infinite_reverse] place-items-center rounded-2xl border transition group-hover:[animation-play-state:paused] group-focus-within:[animation-play-state:paused] sm:h-14 sm:w-14 ${on ? "scale-110 border-fuchsia-300 bg-white text-violet-700 shadow-[0_0_24px_rgba(240,171,252,.7)]" : "border-white/20 bg-white/10 text-white hover:bg-white/20"} ${ring}`}>
                      <I aria-hidden className="h-5 w-5 sm:h-6 sm:w-6" /><span className="sr-only">{x.title}</span>
                    </button>
                  </span>
                );
              })}
            </div>
          </div>
          <div aria-live="polite" className="mx-auto mt-4 max-w-sm text-center">
            <p key={f.id} className="animate-fade-up font-display text-lg font-bold text-white [animation-duration:350ms]">{f.title}</p>
            <p className="mt-1 text-white/75">{f.text}</p>
          </div>
        </section>

        <section aria-label="Choose" className={`${glassForm} space-y-8`}>
          <WhoRadios who={who} setWho={setWho} />
          <UsernameField r={pm.r} s="premium" mine={false} chip={false} label={who === "me" ? "Your username" : "Your friend's username"} hint="We never need a password or login code." />
          <PlanRadios pm={pm} layout="list" dark />
        </section>
      </NightPage>
      <PremiumCheckout pm={pm} />
    </PageShell>
  );
}
