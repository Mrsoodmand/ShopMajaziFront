"use client";

import { tgHeadings } from "@/content/telegram-en";
import { PageShell } from "../otp/parts";
import { PremiumCheckout, TgOrderView, Trust, UsernameField, usePremium } from "./parts";
import { PlanRadios } from "./premium";
import { useWho } from "./night";
import { Badge, PremiumFaq, PremiumForm } from "./premiumKit";
import { BentoGlow, GlowBackground, glowPanel, glowSelection, JumpBarGlow, OrderCardGlow, useJump, WhoSwitchGlow } from "./premiumGlow";

// Premium R — "Feature Bento on Violet Glow": K's content (plans, who, username, the feature bento, the order card
// with green Continue in the sidebar) on Stars F's background in Premium violet. It follows the site theme
// (lavender in light mode, the site's navy with a violet glow in dark mode) and fades into the page below.
// One motion moment: the Premium badge turns once and throws sparkles when the plan or account changes.

export default function PremiumR() {
  const pm = usePremium();
  const { who, setWho } = useWho(pm);
  const jump = useJump(pm);
  if (pm.order) return <PageShell><div className="px-6 py-14"><TgOrderView o={pm.order} onAgain={pm.reset} /></div></PageShell>;
  return (
    <PageShell>
      <section id="buy" aria-labelledby="pm-h1" className={`relative -mt-16 scroll-mt-16 overflow-hidden pb-12 pt-24 ${glowSelection}`}>
        <GlowBackground />
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex items-center justify-between gap-5">
            <div className="min-w-0">
              <h1 id="pm-h1" className="text-balance font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-5xl dark:text-white">{tgHeadings.premium.h1}</h1>
              <p className="mt-2 max-w-2xl text-base leading-relaxed text-slate-700 sm:mt-3 sm:text-lg dark:text-slate-300">{tgHeadings.premium.sub}</p>
            </div>
            <Badge months={pm.plan.months} found={pm.r.user?.username ?? ""} />
          </div>
          <div className="mt-4 sm:mt-6"><Trust items={["Gift to your username", "No password needed", "Active in minutes"]} /></div>

          <PremiumForm pm={pm} className="mt-6 grid grid-cols-[minmax(0,1fr)] gap-8 sm:mt-10 lg:grid-cols-[minmax(0,1fr)_360px]">
            <div className="min-w-0 space-y-10">
              <section aria-label="Choose" className={`${glowPanel} space-y-8 p-6 sm:p-8`}>
                <PlanRadios pm={pm} legend="Choose a plan" />
                <WhoSwitchGlow who={who} setWho={setWho} />
                <UsernameField r={pm.r} s="premium" mine={false} chip={false} label={who === "me" ? "Your username" : "Your friend's username"} hint="We never need a password or login code." />
              </section>
              <BentoGlow />
            </div>
            <div ref={jump.ref} className="lg:sticky lg:top-24 lg:self-start"><OrderCardGlow pm={pm} who={who} /></div>
          </PremiumForm>
        </div>
      </section>
      <PremiumFaq />
      <JumpBarGlow pm={pm} inView={jump.inView} go={jump.go} />
      <PremiumCheckout pm={pm} />
    </PageShell>
  );
}
