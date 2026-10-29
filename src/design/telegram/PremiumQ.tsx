"use client";
import { useId, useState } from "react";
import { Check, Gift, User } from "lucide-react";
import { useMoney } from "@/lib/money";
import { perMonth, premiumPlans, premiumSaving } from "@/content/telegram-en";
import { PageShell } from "../otp/parts";
import { PremiumCheckout, TgOrderView, UsernameField, usePremium, type PremiumState } from "./parts";
import { Badge, FeatureRows, hasFocusRing, JumpBar, NightHero, OrderCard, PremiumFaq, PremiumForm, useJumpBar, type Who } from "./premiumKit";

// Premium Q — "In-App Screen": the whole form lives inside a phone showing Telegram's own Premium screen: the turning
// Premium emblem at the top, then grouped list rows (who, username, plan) and what's included, the way Telegram lays
// out its settings. Plain list radios with a check, like the app. Order card in the sidebar.

const group = "overflow-hidden rounded-2xl bg-[#1c2733]";
const groupLabel = "px-4 pb-1.5 pt-5 text-xs font-semibold uppercase tracking-wider text-sky-300/80";

function ListRadio({ name, on, onChange, children, end }: { name: string; on: boolean; onChange: () => void; children: React.ReactNode; end?: React.ReactNode }) {
  return (
    <label className={`flex cursor-pointer items-center gap-3 border-b border-white/[.06] px-4 py-3.5 last:border-0 hover:bg-white/[.03] ${hasFocusRing} has-[:focus-visible]:rounded-2xl`}>
      <input type="radio" name={name} checked={on} onChange={onChange} className="sr-only" />
      <span aria-hidden className={`grid h-5 w-5 shrink-0 place-items-center rounded-full border-2 ${on ? "border-sky-400 bg-sky-400" : "border-white/30"}`}>{on && <Check className="h-3 w-3 text-[#0e1621]" strokeWidth={3} />}</span>
      <span className="min-w-0 flex-1">{children}</span>
      {end}
    </label>
  );
}

function PlanList({ pm }: { pm: PremiumState }) {
  const usd = useMoney().format;
  const name = useId();
  return (
    <fieldset>
      <legend className={groupLabel}>Plan</legend>
      <div className={group}>
        {premiumPlans.map((p) => {
          const save = premiumSaving(p);
          return (
            <ListRadio key={p.months} name={name} on={pm.plan.months === p.months} onChange={() => pm.setPlan(p)}
              end={<span className="text-end"><span className="block font-semibold tabular-nums text-white">{usd(p.price)}</span>{save > 0 && <span className="rounded-md bg-violet-500/25 px-1.5 text-xs font-semibold text-violet-200">−{save}%</span>}</span>}>
              <span className="block font-semibold text-white">{p.label}</span><span className="block text-sm tabular-nums text-slate-400">{usd(perMonth(p))} a month</span>
            </ListRadio>
          );
        })}
      </div>
    </fieldset>
  );
}

export default function PremiumQ() {
  const pm = usePremium();
  const [who, setWho] = useState<Who>("me");
  const jump = useJumpBar(pm);
  const whoName = useId();
  if (pm.order) return <PageShell><div className="px-6 py-14"><TgOrderView o={pm.order} onAgain={pm.reset} /></div></PageShell>;
  return (
    <PageShell heroDark>
      <NightHero sub="The Premium screen you know from Telegram, right here. Pick who and how long; we only need the username.">
        <PremiumForm pm={pm} className="mt-6 grid grid-cols-[minmax(0,1fr)] gap-6 sm:mt-10 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-8">
          <div className="flex justify-center">
            <section aria-label="Telegram Premium" className="w-full max-w-[26rem] overflow-hidden rounded-[2.5rem] border-[10px] border-black bg-[#0e1621] shadow-[0_30px_70px_-30px_rgba(0,0,0,.95)]">
              <div className="px-4 pb-6 pt-8 text-center">
                <div className="flex justify-center"><Badge months={pm.plan.months} found={pm.r.user?.username ?? ""} size="small" /></div>
                <h2 className="mt-6 font-display text-2xl font-bold text-white">Telegram Premium</h2>
                <p className="mt-1 text-sm text-slate-400">Go beyond the limits, unlock dozens of features.</p>
              </div>
              <div className="px-3 pb-4 [&_input]:!bg-black/30">
                <fieldset>
                  <legend className={groupLabel}>Who is it for</legend>
                  <div className={group}>
                    <ListRadio name={whoName} on={who === "me"} onChange={() => { setWho("me"); pm.r.set(""); }} end={<User aria-hidden className="h-5 w-5 text-slate-400" />}><span className="font-semibold text-white">For me</span></ListRadio>
                    <ListRadio name={whoName} on={who === "gift"} onChange={() => { setWho("gift"); pm.r.set(""); }} end={<Gift aria-hidden className="h-5 w-5 text-slate-400" />}><span className="font-semibold text-white">A gift for a friend</span></ListRadio>
                  </div>
                </fieldset>
                <div className="mt-5 rounded-2xl bg-[#1c2733] p-4">
                  <UsernameField r={pm.r} s="premium" mine={false} label={who === "me" ? "Your username" : "Your friend's username"} hint={who === "me" ? "Premium is added to this account." : "They get it as a gift from Telegram."} />
                </div>
                <PlanList pm={pm} />
                <p className={groupLabel}>What&apos;s included</p>
                <div className={`${group} px-3`}><FeatureRows className="" /></div>
              </div>
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
