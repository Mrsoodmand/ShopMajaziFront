"use client";

import { useState } from "react";
import { PageShell } from "../otp/parts";
import { PremiumCheckout, TgOrderView, UsernameField, usePremium } from "./parts";
import { PlanRadios } from "./premium";
import { Badge, FeatureSheet, JumpBar, NightHero, OrderCard, panel, PremiumFaq, PremiumForm, useJumpBar, WhoSwitch, type Who } from "./premiumKit";

// Premium L — "Telegram's Premium sheet": what Premium unlocks reads like the Premium screen inside Telegram (coloured
// feature rows), with who / how long beside it and the profile card, total and Continue in the sidebar. Always-dark
// night sky. Motion (like Stars F): the Premium badge beside the title turns once and throws sparkles when the plan
// changes or the account is found; the sheet names the recipient; a few sparkles drift up twice on load.
export default function PremiumL() {
  const pm = usePremium();
  const [who, setWho] = useState<Who>("me");
  const jump = useJumpBar(pm);
  if (pm.order) return <PageShell><div className="px-6 py-14"><TgOrderView o={pm.order} onAgain={pm.reset} /></div></PageShell>;
  return (
    <PageShell heroDark>
      <NightHero art={<Badge months={pm.plan.months} found={pm.r.user?.username ?? ""} />}>
        <PremiumForm pm={pm} className="mt-6 grid grid-cols-[minmax(0,1fr)] gap-6 sm:mt-10 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-8">
          <div className="grid grid-cols-[minmax(0,1fr)] gap-6 xl:grid-cols-2">
            <div className="hidden lg:block xl:hidden"><FeatureSheet pm={pm} compact /></div>
            <div className="xl:order-2">
              <section aria-label="Choose" className={`${panel} space-y-7 p-6 [&_input]:!bg-black/30`}>
                <WhoSwitch who={who} setWho={(w) => { setWho(w); pm.r.set(""); }} />
                <UsernameField r={pm.r} s="premium" mine={false} chipClass="lg:hidden" label={who === "me" ? "Your username" : "Your friend's username"} hint={who === "me" ? "Premium is added to this account. We never need your login." : "They get it as a gift from Telegram."} />
                <PlanRadios pm={pm} layout="list" dark still />
              </section>
            </div>
            <div className="lg:hidden xl:order-1 xl:block"><FeatureSheet pm={pm} /></div>
          </div>
          <div ref={jump.ref} className="lg:sticky lg:top-24 lg:self-start"><OrderCard pm={pm} who={who} /></div>
        </PremiumForm>
      </NightHero>
      <PremiumFaq />
      <JumpBar pm={pm} inView={jump.inView} go={jump.go} />
      <PremiumCheckout pm={pm} />
    </PageShell>
  );
}
