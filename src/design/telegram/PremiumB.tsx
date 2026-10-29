"use client";
import { useId, useState } from "react";
import { Gift, Star, User } from "lucide-react";
import { useMoney } from "@/lib/money";
import { PageShell } from "../otp/parts";
import { useHasExtras } from "../service/slot";
import { accent, Avatar, card, H2, PremiumCheckout, ring, TgFaq, TgOrderView, Title, UsernameField, usePremium } from "./parts";
import { BuyPremium, FeatureList, PlanRadios } from "./premium";

// Premium B — "Profile Preview": starts with "for me or a gift?", then the username. A Telegram profile card beside
// the form fills in as you type and shows the Premium star appearing next to the name, so it's clear which
// account gets it. Plan list and Buy under the username.
export default function PremiumB() {
  const usd = useMoney().format;
  const pm = usePremium();
  const extras = useHasExtras();
  const [who, setWho] = useState<"me" | "gift">("me");
  const name = useId();
  if (pm.order) return <PageShell><div className="px-6 py-14"><TgOrderView o={pm.order} onAgain={pm.reset} /></div></PageShell>;
  const u = pm.r.user;
  return (
    <PageShell>
      <div className="mx-auto max-w-6xl px-4 pb-24 pt-14 sm:px-6">
        <Title s="premium" sub="Upgrade your own account or surprise a friend. You only need a username.">Telegram Premium</Title>

        <div className="mt-10 grid grid-cols-[minmax(0,1fr)] items-start gap-10 lg:grid-cols-[minmax(0,1fr)_380px]">
          <section aria-label="Choose" className={`${card} space-y-8 p-6 sm:p-8`}>
            <fieldset>
              <legend className="text-base font-semibold text-slate-900 dark:text-white">Who is it for?</legend>
              <div className="mt-3 grid grid-cols-2 gap-2.5">
                {([["me", "For me", User], ["gift", "A gift", Gift]] as const).map(([id, label, I]) => {
                  const on = who === id;
                  return (
                    <label key={id} className={`flex cursor-pointer items-center gap-3 rounded-2xl border-2 px-4 py-3.5 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-violet-500 ${on ? `${accent.premium.border} bg-violet-50 dark:bg-violet-400/10` : "border-slate-200 hover:border-slate-400 dark:border-white/15"}`}>
                      <input type="radio" name={name} checked={on} onChange={() => { setWho(id); if (id === "me") pm.r.useMine(); else pm.r.set(""); }} className="sr-only" />
                      <I aria-hidden className={`h-5 w-5 ${on ? accent.premium.text : "text-slate-500"}`} /><span className="font-semibold text-slate-900 dark:text-white">{label}</span>
                    </label>
                  );
                })}
              </div>
            </fieldset>
            <UsernameField r={pm.r} s="premium" mine={false} chip={false} label={who === "me" ? "Your username" : "Your friend's username"} hint={who === "me" ? "Premium is added to this account." : "They get it as a gift from Telegram."} />
            <PlanRadios pm={pm} layout="list" />
            <BuyPremium pm={pm} label={who === "gift" ? `Gift Premium · ${pm.plan.label}` : undefined} />
          </section>

          {/* Profile preview */}
          <div className="lg:sticky lg:top-24">
            <div aria-live="polite" className="overflow-hidden rounded-[2rem] bg-[#17212b] text-white shadow-2xl shadow-violet-900/20">
              <div className={`relative px-6 pb-6 pt-10 text-center ${accent.premium.hero}`}>
                <div aria-hidden className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,.18)_1px,transparent_1px)] bg-[size:16px_16px]" />
                <div className="relative mx-auto w-fit">{u ? <Avatar u={u} size="lg" /> : <span aria-hidden className="grid h-16 w-16 place-items-center rounded-full bg-white/20"><User className="h-7 w-7" /></span>}</div>
                <div className="relative mt-3 flex items-center justify-center gap-1.5 font-display text-xl font-bold">
                  {u ? u.name : "Username"}
                  <Star aria-hidden className={`h-5 w-5 fill-white text-white transition duration-500 ${u ? "scale-100 opacity-100" : "scale-0 opacity-0"}`} />
                </div>
                <div className="relative text-sm text-white/80">{u ? `@${u.username}` : "type a username"}{pm.r.checking && " · checking…"}</div>
              </div>
              <div className="space-y-3 p-5 text-sm">
                <div className="flex justify-between"><span className="text-slate-400">Plan</span><span className="font-semibold">Premium · {pm.plan.label}</span></div>
                <div className="flex justify-between"><span className="text-slate-400">{who === "gift" ? "From" : "Pays"}</span><span className="font-semibold">You</span></div>
                <div className="flex justify-between border-t border-white/10 pt-3"><span className="text-slate-400">Total</span><span className="font-display text-xl font-bold">{usd(pm.total)}</span></div>
              </div>
              <p className="sr-only">{u ? `${u.name} will get Telegram Premium for ${pm.plan.label}.` : ""}</p>
            </div>
            <details className={`${card} group mt-4 p-5 [&_summary::-webkit-details-marker]:hidden`}>
              <summary className={`cursor-pointer list-none rounded-lg font-semibold text-slate-900 dark:text-white ${ring}`}>What&apos;s included</summary>
              <div className="mt-4"><FeatureList dense /></div>
            </details>
          </div>
        </div>
        {!extras && <section aria-labelledby="faq" className="mt-20 max-w-3xl"><H2 id="faq">Common questions</H2><div className="mt-6"><TgFaq s="premium" /></div></section>}
      </div>
      <PremiumCheckout pm={pm} />
    </PageShell>
  );
}
