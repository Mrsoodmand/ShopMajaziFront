"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { PageShell } from "../otp/parts";
import { PremiumCheckout, TgOrderView, UsernameField, usePremium } from "./parts";
import { PlanRadios } from "./premium";
import { Burst, FeatureGridCompact, JumpBar, NightHero, OrderCard, panel, PremiumFaq, PremiumForm, untilDate, useChanges, useJumpBar, WhoSwitch, type Who } from "./premiumKit";

// Premium N — "Membership Card": you fill in a Telegram Premium card. For yourself it's a membership card, for a
// friend a gift card: who it's for, how long, and the date it lasts until, all on the card. The card turns once and
// throws sparkles whenever it changes (the page's one moment). Form under it; order card in the sidebar.
export default function PremiumN() {
  const pm = usePremium();
  const [who, setWho] = useState<Who>("me");
  const jump = useJumpBar(pm);
  const u = pm.r.user;
  const turns = useChanges([pm.plan.months, u?.username ?? "", who]);
  if (pm.order) return <PageShell><div className="px-6 py-14"><TgOrderView o={pm.order} onAgain={pm.reset} /></div></PageShell>;
  return (
    <PageShell heroDark>
      <NightHero title="Your Telegram Premium card" sub="Fill in the card: who it's for and how long. It's added to their account in minutes, with just the username.">
        <PremiumForm pm={pm} className="mt-6 grid grid-cols-[minmax(0,1fr)] gap-6 sm:mt-10 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-8">
          <div className="space-y-6">
            {/* The card. Decorative for screen readers: the same facts are in the order card. */}
            <div className="relative mx-auto w-full max-w-xl [perspective:1200px]">
              <Burst n={turns} radius={150} />
              <div key={turns} aria-hidden className={`relative aspect-[1.586] w-full overflow-hidden rounded-[1.75rem] bg-[linear-gradient(135deg,#7c3aed_0%,#a21caf_55%,#db2777_100%)] p-6 text-white shadow-[0_24px_60px_-24px_rgba(0,0,0,.9)] [transform-style:preserve-3d] sm:p-8 ${turns ? "animate-coin-once" : ""}`}>
                <span className="absolute -end-16 -top-20 h-64 w-64 rounded-full bg-white/10" />
                <span className="absolute -bottom-24 -start-10 h-56 w-56 rounded-full bg-black/10" />
                <div className="relative flex h-full flex-col justify-between">
                  <div className="flex items-start justify-between">
                    <span className="font-display text-sm font-bold uppercase tracking-[0.18em] text-white/85">{who === "gift" ? "Gift card" : "Membership"}</span>
                    <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white/15 sm:h-14 sm:w-14"><Star className="h-7 w-7 fill-white text-white sm:h-8 sm:w-8" /></span>
                  </div>
                  <div>
                    <div className="font-display text-3xl font-bold tracking-tight sm:text-5xl">Telegram Premium</div>
                    <div className="mt-1 font-display text-lg font-semibold tabular-nums text-white/90 sm:text-2xl">{pm.plan.label}</div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="min-w-0"><div className="text-xs font-semibold uppercase tracking-wider text-white/70">{who === "gift" ? "For" : "Member"}</div><div className="truncate font-semibold">{u ? `@${u.username}` : "@username"}</div></div>
                    <div className="text-end"><div className="text-xs font-semibold uppercase tracking-wider text-white/70">Valid until</div><div className="font-semibold tabular-nums">{untilDate(pm.plan.months)}</div></div>
                  </div>
                </div>
              </div>
            </div>

            <section aria-label="Fill in the card" className={`${panel} grid gap-7 p-6 sm:p-8 xl:grid-cols-2 [&_input]:!bg-black/30`}>
              <div className="space-y-7">
                <WhoSwitch who={who} setWho={(w) => { setWho(w); pm.r.set(""); }} />
                <UsernameField r={pm.r} s="premium" mine={false} label={who === "me" ? "Your username" : "Your friend's username"} hint={who === "me" ? "Premium is added to this account. We never need your login." : "They get it as a gift from Telegram."} />
              </div>
              <PlanRadios pm={pm} layout="list" dark still />
            </section>
            <section aria-labelledby="inc-h" className={`${panel} p-6`}>
              <h2 id="inc-h" className="font-display text-lg font-semibold text-white">The card includes</h2>
              <FeatureGridCompact />
            </section>
          </div>
          <div ref={jump.ref} className="lg:sticky lg:top-24 lg:self-start"><OrderCard pm={pm} who={who} profile={false} /></div>
        </PremiumForm>
      </NightHero>
      <PremiumFaq />
      <JumpBar pm={pm} inView={jump.inView} go={jump.go} />
      <PremiumCheckout pm={pm} />
    </PageShell>
  );
}
