"use client";

import { useState } from "react";
import { Star, User } from "lucide-react";
import { PageShell } from "../otp/parts";
import { Avatar, PremiumCheckout, TgOrderView, UsernameField, usePremium } from "./parts";
import { PlanRadios } from "./premium";
import { Burst, FeatureGridCompact, JumpBar, NightHero, OrderCard, panel, PremiumFaq, PremiumForm, useChanges, useJumpBar, WhoSwitch, type Who } from "./premiumKit";

// Premium M — "Profile First": the recipient's profile is the big piece of the page. The who switch and the username
// sit inside the profile card; once the account is found its avatar gets the Premium ring and star with a sparkle
// burst (the page's one moment). Plans as three segments under it, then what's included. Order card in the sidebar.
export default function PremiumM() {
  const pm = usePremium();
  const [who, setWho] = useState<Who>("me");
  const jump = useJumpBar(pm);
  const u = pm.r.user;
  const found = useChanges([u?.username ?? ""]);
  if (pm.order) return <PageShell><div className="px-6 py-14"><TgOrderView o={pm.order} onAgain={pm.reset} /></div></PageShell>;
  return (
    <PageShell heroDark>
      <NightHero title="Telegram Premium, on the right account" sub="Type the username and see whose account gets it before you pay. 3, 6 or 12 months, never a login.">
        <PremiumForm pm={pm} className="mt-6 grid grid-cols-[minmax(0,1fr)] gap-6 sm:mt-10 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-8">
          <div className="space-y-6">
            <section aria-labelledby="who-h" className={`${panel} overflow-hidden`}>
              <div className="grid gap-6 p-6 sm:grid-cols-[auto_minmax(0,1fr)] sm:items-center sm:p-8">
                <div aria-live="polite" className="flex items-center gap-4 sm:flex-col sm:text-center">
                  <div className="relative grid h-24 w-24 shrink-0 place-items-center sm:h-32 sm:w-32">
                    <Burst n={found && u ? found : 0} radius={64} />
                    {u && <span aria-hidden className="absolute inset-0 rounded-full bg-[conic-gradient(#f0abfc,#a78bfa,#fde68a,#f0abfc)]" />}
                    <span key={u?.username ?? "none"} className={`relative grid place-items-center rounded-full ${u ? "animate-pop ring-4 ring-[#140a2a]" : ""}`}>
                      {u ? <span className="[&>span]:!h-20 [&>span]:!w-20 [&>span]:!text-2xl sm:[&>span]:!h-28 sm:[&>span]:!w-28 sm:[&>span]:!text-3xl"><Avatar u={u} size="lg" /></span> : <span aria-hidden className="grid h-20 w-20 place-items-center rounded-full border-2 border-dashed border-white/25 text-white/50 sm:h-28 sm:w-28"><User className="h-9 w-9" /></span>}
                    </span>
                    <span aria-hidden className={`absolute -bottom-1 -end-1 grid h-9 w-9 place-items-center rounded-full bg-[linear-gradient(135deg,#7c3aed,#c026d3)] ring-4 ring-[#140a2a] transition duration-500 ease-out ${u ? "scale-100 opacity-100" : "scale-50 opacity-0"}`}><Star className="h-4 w-4 fill-white text-white" /></span>
                  </div>
                  <div className="min-w-0">
                    <h2 id="who-h" className="truncate font-display text-xl font-bold text-white sm:text-2xl">{u ? u.name : pm.r.checking ? "Checking…" : who === "gift" ? "Your friend" : "You"}</h2>
                    <p className="truncate text-sm text-violet-100/70">{u ? `@${u.username} · gets Premium` : "Enter a username below"}</p>
                  </div>
                </div>
                <div className="space-y-6 [&_input]:!bg-black/30">
                  <WhoSwitch who={who} setWho={(w) => { setWho(w); pm.r.set(""); }} />
                  <UsernameField r={pm.r} s="premium" mine={false} chip={false} label={who === "me" ? "Your username" : "Your friend's username"} hint={who === "me" ? "Premium is added to this account. We never need your login." : "They get it as a gift from Telegram."} />
                </div>
              </div>
            </section>
            <section aria-label="Plan" className={`${panel} p-6 sm:p-8`}><PlanRadios pm={pm} layout="row" legend="How long?" dark still /></section>
            <section aria-labelledby="inc-h" className={`${panel} p-6 sm:p-8`}>
              <h2 id="inc-h" className="font-display text-lg font-semibold text-white">{u ? `${u.name} gets` : "Premium includes"}</h2>
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
