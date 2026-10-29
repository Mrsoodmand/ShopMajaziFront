"use client";

import { useState, type ReactNode } from "react";
import { Check } from "lucide-react";
import { PageShell } from "../otp/parts";
import { PremiumCheckout, TgOrderView, UsernameField, usePremium } from "./parts";
import { PlanRadios } from "./premium";
import { Badge, FeatureGridCompact, JumpBar, NightHero, OrderCard, panel, PremiumFaq, PremiumForm, useJumpBar, WhoSwitch, type Who } from "./premiumKit";

// Premium P — "Three Steps": the purchase as three numbered steps in one calm column (who, which account, how long).
// Each step's number turns into a tick once it's settled; the username step settles when the account is found.
// The Premium badge beside the title turns when the plan changes or the account is found. Order card in the sidebar.

function Step({ n, done, title, summary, children }: { n: number; done: boolean; title: string; summary?: string; children: ReactNode }) {
  return (
    <section aria-labelledby={`step-${n}`} className={`${panel} p-6 sm:p-8`}>
      <div className="flex items-start gap-4">
        <span aria-hidden className={`grid h-9 w-9 shrink-0 place-items-center rounded-full font-display font-bold ${done ? "animate-pop bg-emerald-400 text-emerald-950" : "border-2 border-white/25 text-white"}`} key={done ? "d" : "n"}>
          {done ? <Check className="h-5 w-5" strokeWidth={3} /> : n}
        </span>
        <div className="min-w-0 flex-1">
          <h2 id={`step-${n}`} className="font-display text-lg font-semibold text-white">{title}<span className="sr-only">{done ? ", done" : ""}</span></h2>
          {summary && <p className="text-sm text-violet-100/70">{summary}</p>}
          <div className="mt-5 [&_input]:!bg-black/30">{children}</div>
        </div>
      </div>
    </section>
  );
}

export default function PremiumP() {
  const pm = usePremium();
  const [who, setWho] = useState<Who>("me");
  const [whoPicked, setWhoPicked] = useState(false);
  const [planPicked, setPlanPicked] = useState(false);
  const jump = useJumpBar(pm);
  const u = pm.r.user;
  if (pm.order) return <PageShell><div className="px-6 py-14"><TgOrderView o={pm.order} onAgain={pm.reset} /></div></PageShell>;
  const pick = (p: Parameters<typeof pm.setPlan>[0]) => { pm.setPlan(p); setPlanPicked(true); };
  return (
    <PageShell heroDark>
      <NightHero art={<Badge months={pm.plan.months} found={u?.username ?? ""} />}>
        <PremiumForm pm={pm} className="mt-6 grid grid-cols-[minmax(0,1fr)] gap-6 sm:mt-10 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-8">
          <div className="space-y-5">
            <Step n={1} done={whoPicked} title="Who is it for?" summary={who === "me" ? "Your own account" : "A friend's account, as a gift"}>
              <WhoSwitch legend="Choose one" who={who} setWho={(w) => { setWho(w); setWhoPicked(true); pm.r.set(""); }} />
            </Step>
            <Step n={2} done={!!u} title={who === "me" ? "Your username" : "Your friend's username"} summary={u ? `${u.name} · @${u.username}` : "We check the account exists before anything is sent."}>
              <UsernameField r={pm.r} s="premium" mine={false} label="Telegram username" hint={who === "me" ? "Premium is added to this account. We never need your login." : "They get it as a gift from Telegram."} />
            </Step>
            <Step n={3} done={planPicked} title="How long?" summary={`${pm.plan.label}, then it simply ends. No auto-renew.`}>
              <PlanRadios pm={{ ...pm, setPlan: pick }} layout="list" legend="Plan" dark still />
            </Step>
            <section aria-labelledby="inc-h" className={`${panel} p-6`}>
              <h2 id="inc-h" className="font-display text-lg font-semibold text-white">{u ? `${u.name} gets` : "Premium includes"}</h2>
              <FeatureGridCompact />
            </section>
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
