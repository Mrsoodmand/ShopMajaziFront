"use client";

import { Crown, Sparkles } from "lucide-react";
import { PageShell } from "../otp/parts";
import { glass, PremiumCheckout, TgOrderView, UsernameField, usePremium } from "./parts";
import { PlanRadios } from "./premium";
import { glassForm, NightPage, PremiumBelow, PremiumSide, useWho, WhoRadios } from "./night";

// Premium J — "Gift Box": made for gifting (starts on A gift). A wrapped box bobs gently; when the account is found
// the lid lifts and the Premium crown rises out with sparkles. Username and plans follow; Buy in the sidebar.
export default function PremiumJ() {
  const pm = usePremium();
  const { who, setWho } = useWho(pm, "gift");
  if (pm.order) return <PageShell><div className="px-6 py-14"><TgOrderView o={pm.order} onAgain={pm.reset} /></div></PageShell>;
  const open = !!pm.r.user;
  return (
    <PageShell>
      <NightPage tone="premium" title="Gift Telegram Premium" sub="Surprise a friend with Premium for 3, 6 or 12 months. All you need is their username." art={false} side={<PremiumSide pm={pm} who={who} />} below={<PremiumBelow />}>
        <section aria-label="Gift preview" className={`${glass} p-6 sm:p-8`}>
          <div aria-hidden className="relative mx-auto h-64 w-56">
            <span className={`absolute bottom-6 start-1/2 h-24 w-48 -translate-x-1/2 rounded-full bg-fuchsia-500/40 blur-2xl transition-opacity duration-700 rtl:translate-x-1/2 ${open ? "opacity-100" : "opacity-40"}`} />
            <div className={`absolute inset-x-0 bottom-4 h-full ${open ? "" : "animate-float"}`}>
              {/* Crown rising out */}
              <span className={`absolute start-1/2 z-10 grid h-20 w-20 -translate-x-1/2 place-items-center rounded-[1.5rem] bg-gradient-to-br from-amber-200 to-amber-400 text-violet-800 shadow-[0_0_40px_rgba(253,230,138,.7)] transition-all duration-700 ease-out rtl:translate-x-1/2 ${open ? "bottom-[10.5rem] scale-100 opacity-100" : "bottom-12 scale-50 opacity-0"}`}>
                <Crown className="h-10 w-10" />
              </span>
              {open && <>
                <Sparkles className="absolute start-6 top-4 h-5 w-5 animate-twinkle text-yellow-200" />
                <Sparkles className="absolute end-6 top-10 h-4 w-4 animate-twinkle text-fuchsia-200 [animation-delay:.8s]" />
                <Sparkles className="absolute end-14 top-0 h-3 w-3 animate-twinkle text-white [animation-delay:1.4s]" />
              </>}
              {/* Box */}
              <span className="absolute bottom-0 start-1/2 h-28 w-44 -translate-x-1/2 rounded-b-2xl rounded-t-md bg-gradient-to-br from-violet-500 to-fuchsia-600 shadow-xl rtl:translate-x-1/2">
                <span className="absolute inset-y-0 start-1/2 w-6 -translate-x-1/2 bg-amber-300 rtl:translate-x-1/2" />
              </span>
              {/* Lid */}
              <span className={`absolute start-1/2 h-10 w-48 -translate-x-1/2 origin-bottom-left rounded-lg bg-gradient-to-br from-violet-400 to-fuchsia-500 shadow-lg transition-all duration-700 ease-out rtl:translate-x-1/2 ${open ? "bottom-[7.5rem] -rotate-[28deg] !-translate-x-[95%] rtl:!translate-x-[95%] rtl:rotate-[28deg]" : "bottom-28"}`}>
                <span className="absolute inset-y-0 start-1/2 w-6 -translate-x-1/2 bg-amber-300 rtl:translate-x-1/2" />
                <span className="absolute -top-5 start-1/2 h-7 w-7 -translate-x-[115%] rotate-[-30deg] rounded-[45%] border-[5px] border-amber-300 rtl:translate-x-[115%]" />
                <span className="absolute -top-5 start-1/2 h-7 w-7 translate-x-[15%] rotate-[30deg] rounded-[45%] border-[5px] border-amber-300 rtl:-translate-x-[15%]" />
              </span>
            </div>
          </div>
          <p aria-live="polite" className="text-center font-semibold text-white">{open ? `Ready to gift to ${pm.r.user!.name}` : "Enter a username to open the gift"}</p>
        </section>

        <section aria-label="Choose" className={`${glassForm} space-y-8`}>
          <WhoRadios who={who} setWho={setWho} />
          <UsernameField r={pm.r} s="premium" mine={false} chip={false} label={who === "me" ? "Your username" : "Your friend's username"} hint={who === "gift" ? "They get it as a gift from Telegram." : "Premium is added to this account."} />
          <PlanRadios pm={pm} layout="list" dark />
        </section>
      </NightPage>
      <PremiumCheckout pm={pm} />
    </PageShell>
  );
}
