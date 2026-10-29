"use client";

import { useState } from "react";
import { ChevronLeft, Star, User } from "lucide-react";
import { premiumFeatures } from "@/content/telegram-en";
import { PageShell } from "../otp/parts";
import { Avatar, PremiumCheckout, TgOrderView, UsernameField, usePremium } from "./parts";
import { featureIcons, PlanRadios } from "./premium";
import { Badge, JumpBar, NightHero, OrderCard, panel, PremiumFaq, PremiumForm, spectrum, useChanges, useJumpBar, WhoSwitch, type Who } from "./premiumKit";

// Premium O — "Gift Message": a Telegram chat shows exactly what arrives: the recipient at the top and Telegram's
// Premium message in the chat, with the length and three things it unlocks. The message re-arrives (and its star
// badge turns) whenever the plan, the recipient or who it's for changes: the page's one moment. Form beside the chat;
// order card in the sidebar.
export default function PremiumO() {
  const pm = usePremium();
  const [who, setWho] = useState<Who>("gift");
  const jump = useJumpBar(pm);
  const u = pm.r.user;
  const again = useChanges([pm.plan.months, u?.username ?? "", who]);
  if (pm.order) return <PageShell><div className="px-6 py-14"><TgOrderView o={pm.order} onAgain={pm.reset} /></div></PageShell>;
  return (
    <PageShell heroDark>
      <NightHero title="Send Telegram Premium" sub="See the message that arrives in Telegram. For a friend or for yourself, with just the username.">
        <PremiumForm pm={pm} className="mt-6 grid grid-cols-[minmax(0,1fr)] gap-6 sm:mt-10 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-8">
          <div className="grid grid-cols-[minmax(0,1fr)] gap-6 xl:grid-cols-2">
            <section aria-label="Choose" className={`${panel} space-y-7 p-6 xl:order-2 [&_input]:!bg-black/30`}>
              <WhoSwitch who={who} setWho={(w) => { setWho(w); pm.r.set(""); }} />
              <UsernameField r={pm.r} s="premium" mine={false} chip={false} label={who === "me" ? "Your username" : "Your friend's username"} hint={who === "me" ? "Premium is added to this account. We never need your login." : "They get it as a gift from Telegram."} />
              <PlanRadios pm={pm} layout="list" dark still />
            </section>

            {/* The chat preview. Decorative for screen readers: the order card says the same. */}
            <div aria-hidden className="overflow-hidden rounded-3xl border border-white/12 bg-[#0e1621] shadow-[0_16px_40px_-20px_rgba(0,0,0,.8)] xl:order-1">
              <div className="flex items-center gap-3 bg-[#17212b] px-4 py-3">
                <ChevronLeft className="h-5 w-5 text-sky-400" />
                {u ? <Avatar u={u} size="sm" /> : <span className="grid h-8 w-8 place-items-center rounded-full bg-white/15"><User className="h-4 w-4 text-white/70" /></span>}
                <span className="min-w-0"><span className="block truncate text-sm font-semibold text-white">{who === "me" ? "Telegram" : u ? u.name : "Your friend"}</span><span className="block text-xs text-slate-400">{who === "me" ? "service notifications" : u ? `@${u.username}` : "enter a username"}</span></span>
              </div>
              <div className="flex min-h-[26rem] flex-col justify-end gap-3 bg-[radial-gradient(circle_at_20%_20%,rgba(124,58,237,.18),transparent_45%),radial-gradient(circle_at_80%_80%,rgba(192,38,211,.15),transparent_45%)] p-5">
                <p className="mx-auto rounded-full bg-black/30 px-3 py-1 text-xs text-white/80">Today</p>
                <div key={again} className={`mx-auto w-full max-w-xs rounded-3xl bg-black/35 p-5 text-center text-white ${again ? "animate-fade-up [animation-duration:450ms]" : ""}`}>
                  <div className="flex justify-center"><Badge months={pm.plan.months} found={u?.username ?? ""} size="small" /></div>
                  <p className="mt-5 font-display text-lg font-bold">{who === "gift" ? "A gift: Telegram Premium" : "Telegram Premium is active"}</p>
                  <p className="mt-1 text-sm text-white/75">{who === "gift" ? `You sent ${u ? u.name : "your friend"} Premium for ${pm.plan.label}.` : `Your Premium runs for ${pm.plan.label}.`}</p>
                  <ul className="mt-4 space-y-2 text-start">
                    {premiumFeatures.slice(0, 3).map((f, i) => { const I = featureIcons[f.id]; return <li key={f.id} className="flex items-center gap-2.5 text-sm"><span className={`grid h-6 w-6 shrink-0 place-items-center rounded-md ${spectrum[i]}`}><I className="h-3.5 w-3.5" /></span>{f.title}</li>; })}
                  </ul>
                  <span className="mt-4 flex items-center justify-center gap-1.5 rounded-full bg-white/15 py-2 text-sm font-semibold"><Star className="h-4 w-4 fill-white" />View Premium features</span>
                </div>
              </div>
            </div>
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
