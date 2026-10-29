"use client";

import { premiumFeatures } from "@/content/telegram-en";
import { PageShell } from "../otp/parts";
import { PremiumCheckout, TgOrderView, UsernameField, usePremium } from "./parts";
import { featureIcons, PlanRadios } from "./premium";
import { glassForm, NightPage, PremiumBelow, PremiumSide, useWho, WhoRadios } from "./night";

// Premium K — "Feature Bento": the plans and username in one glass card, then every feature as a bento grid of
// glass tiles that fade in one by one; pointing at a tile lights a turning gradient border. Buy in the sidebar.

const span: Record<string, string> = { ads: "col-span-2 sm:row-span-2", upload: "col-span-2" };

export default function PremiumK() {
  const pm = usePremium();
  const { who, setWho } = useWho(pm);
  if (pm.order) return <PageShell><div className="px-6 py-14"><TgOrderView o={pm.order} onAgain={pm.reset} /></div></PageShell>;
  return (
    <PageShell heroDark>
      <NightPage tone="premium" side={<PremiumSide pm={pm} who={who} green />} below={<PremiumBelow features={false} />}>
        <section aria-label="Choose" className={`${glassForm} space-y-8`}>
          <PlanRadios pm={pm} legend="Choose a plan" dark />
          <WhoRadios who={who} setWho={setWho} />
          <UsernameField r={pm.r} s="premium" mine={false} chip={false} label={who === "me" ? "Your username" : "Your friend's username"} hint="We never need a password or login code." />
        </section>

        <section aria-labelledby="bento-h">
          <h2 id="bento-h" className="font-display text-xl font-bold text-white">What you get</h2>
          <ul className="mt-4 grid grid-flow-dense grid-cols-2 gap-3 sm:grid-cols-4">
            {premiumFeatures.map((f, i) => {
              const I = featureIcons[f.id];
              const big = f.id === "ads";
              return (
                <li key={f.id} className={`group relative animate-fade-up overflow-hidden rounded-3xl p-px ${span[f.id] ?? ""}`} style={{ animationDelay: `${400 + i * 80}ms` }}>
                  <span aria-hidden className="absolute -inset-[60%] animate-spin-slow bg-[conic-gradient(from_0deg,#f0abfc,transparent_30%,#a78bfa,transparent_70%,#f0abfc)] opacity-0 transition-opacity duration-300 [animation-duration:6s] group-hover:opacity-100" />
                  <div className={`relative h-full rounded-[calc(1.5rem-1px)] border border-white/10 bg-[#1a0b33]/90 backdrop-blur ${big ? "p-6" : "p-4"}`}>
                    <span aria-hidden className={`grid place-items-center rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white transition duration-300 group-hover:scale-110 group-hover:rotate-6 ${big ? "h-14 w-14" : "h-10 w-10"}`}><I className={big ? "h-7 w-7" : "h-5 w-5"} /></span>
                    <h3 className={`mt-4 font-semibold text-white ${big ? "font-display text-2xl" : ""}`}>{f.title}</h3>
                    <p className={`mt-1 text-white/70 ${big ? "text-base" : "text-sm"}`}>{f.text}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      </NightPage>
      <PremiumCheckout pm={pm} />
    </PageShell>
  );
}
