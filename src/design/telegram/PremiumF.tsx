"use client";
import { useId, useState } from "react";
import { Crown, Gift, Sparkles, Star, User } from "lucide-react";
import { useMoney } from "@/lib/money";
import { tgHeadings } from "@/content/telegram-en";
import { PageShell } from "../otp/parts";
import { useHasExtras } from "../service/slot";
import { accent, Avatar, glass, H2, NightSky, nightBg, PremiumCheckout, Shine, TgFaq, TgOrderView, Title, Trust, Tweened, UsernameField, usePremium } from "./parts";
import { FeatureGrid, PlanRadios } from "./premium";

// Premium F — "Profile Preview on Night Sky": B's flow (for me or a gift, username, plan) on the Stars night-sky
// background in Premium purple. The profile card in the sidebar fills in as you type and holds the total and
// Buy. The top always uses the dark look; the sections below follow the site theme.
// The crown at the top: floats inside a glowing gradient badge, with turning rays and sparkles circling it.
function HeroCrown() {
  return (
    <div aria-hidden className="relative hidden h-40 w-40 shrink-0 md:block">
      <span className="absolute inset-0 animate-spin-slow rounded-full bg-[repeating-conic-gradient(rgba(240,171,252,.35)_0deg_5deg,transparent_5deg_22deg)] [mask-image:radial-gradient(circle,black_25%,transparent_70%)]" />
      <span className="absolute inset-0 animate-orbit">
        <Sparkles className="absolute start-1/2 top-0 h-4 w-4 -translate-x-1/2 text-fuchsia-200" />
        <Star className="absolute bottom-4 end-2 h-3 w-3 fill-violet-200 text-violet-200" />
        <Star className="absolute bottom-6 start-1 h-2.5 w-2.5 fill-fuchsia-200 text-fuchsia-200" />
      </span>
      <span className="absolute inset-0 grid animate-float place-items-center">
        <span className="grid h-20 w-20 animate-glow place-items-center rounded-[1.75rem] bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white [--glow:rgba(217,70,239,.6)]"><Crown className="h-10 w-10" /></span>
      </span>
    </div>
  );
}

export default function PremiumF() {
  const usd = useMoney().format;
  const pm = usePremium();
  const extras = useHasExtras();
  const [who, setWho] = useState<"me" | "gift">("me");
  const name = useId();
  if (pm.order) return <PageShell><div className="px-6 py-14"><TgOrderView o={pm.order} onAgain={pm.reset} /></div></PageShell>;
  const u = pm.r.user;
  return (
    <PageShell>
      <section aria-label="Get Premium" className={`dark relative -mt-16 overflow-hidden pb-20 pt-28 ${nightBg.premium}`}>
        <NightSky tone="premium" />
        <div aria-hidden className="absolute -end-24 top-24 h-96 w-96 rounded-full bg-fuchsia-500/25 blur-3xl" />
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex items-start justify-between gap-6">
            <div className="animate-fade-up"><Title s="premium" light sub={tgHeadings.premium.sub}>{tgHeadings.premium.h1}</Title></div>
            <HeroCrown />
          </div>
          <div className="mt-6 animate-fade-up [animation-delay:120ms]"><Trust light items={["Gift to your username", "No password needed", "Active in minutes"]} /></div>

          <div className="mt-10 grid grid-cols-[minmax(0,1fr)] items-start gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
            <section aria-label="Choose" className={`${glass} animate-fade-up space-y-8 p-6 [animation-delay:240ms] sm:p-8 [&_input]:!bg-black/30`}>
              <fieldset>
                <legend className="text-base font-semibold text-white">Who is it for?</legend>
                <div className="mt-3 grid grid-cols-2 gap-2.5">
                  {([["me", "For me", User], ["gift", "A gift", Gift]] as const).map(([id, label, I]) => {
                    const on = who === id;
                    return (
                      <label key={id} className={`flex cursor-pointer items-center gap-3 rounded-2xl border-2 px-4 py-3.5 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-violet-400 ${on ? "border-violet-400 bg-white/10" : "border-white/20 hover:border-white/50"}`}>
                        <input type="radio" name={name} checked={on} onChange={() => { setWho(id); if (id === "me") pm.r.useMine(); else pm.r.set(""); }} className="sr-only" />
                        <I aria-hidden className={`h-5 w-5 ${on ? "text-violet-300" : "text-white/60"}`} /><span className="font-semibold text-white">{label}</span>
                      </label>
                    );
                  })}
                </div>
              </fieldset>
              <UsernameField r={pm.r} s="premium" mine={false} chip={false} label={who === "me" ? "Your username" : "Your friend's username"} hint={who === "me" ? "Premium is added to this account. We never need your login." : "They get it as a gift from Telegram."} />
              <PlanRadios pm={pm} layout="list" dark />
            </section>

            {/* Sidebar: profile preview, total and Buy */}
            <aside aria-label="Your order" className="animate-fade-up [animation-delay:360ms] lg:sticky lg:top-24">
              <div className={`${glass} overflow-hidden`}>
                <div aria-live="polite" className={`relative overflow-hidden px-6 pb-6 pt-8 text-center text-white ${accent.premium.hero}`}>
                  <div aria-hidden className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,.18)_1px,transparent_1px)] bg-[size:16px_16px]" />
                  <span aria-hidden className="absolute -top-16 start-1/2 h-40 w-40 -translate-x-1/2 animate-drift rounded-full bg-white/20 blur-2xl rtl:translate-x-1/2" />
                  {/* Once the account is found, a turning gradient ring and twinkling sparkles mark it as Premium. */}
                  <div className="relative mx-auto grid h-[4.5rem] w-[4.5rem] place-items-center">
                    {u && <span aria-hidden className="absolute inset-0 animate-[spin_4s_linear_infinite] rounded-full bg-[conic-gradient(#f0abfc,#a78bfa,#fde68a,#f0abfc)]" />}
                    <span className={`relative rounded-full ${u ? "animate-pop ring-[3px] ring-violet-700" : ""}`}>{u ? <Avatar u={u} size="lg" /> : <span aria-hidden className="grid h-16 w-16 place-items-center rounded-full bg-white/20"><User className="h-7 w-7" /></span>}</span>
                    {u && <>
                      <Sparkles aria-hidden className="absolute -end-4 -top-1 h-4 w-4 animate-twinkle text-yellow-200" />
                      <Sparkles aria-hidden className="absolute -start-5 bottom-1 h-3.5 w-3.5 animate-twinkle text-fuchsia-100 [animation-delay:1.2s]" />
                    </>}
                  </div>
                  <div className="relative mt-3 flex items-center justify-center gap-1.5 font-display text-xl font-bold">
                    {u ? u.name : "Username"}
                    <Star aria-hidden className={`h-5 w-5 fill-white text-white transition duration-500 ${u ? "rotate-0 scale-100 opacity-100" : "-rotate-180 scale-0 opacity-0"}`} />
                  </div>
                  <div className="relative text-sm text-white/80">{u ? `@${u.username}` : "type a username"}{pm.r.checking && " · checking…"}</div>
                  <p className="sr-only">{u ? `${u.name} will get Telegram Premium for ${pm.plan.label}.` : ""}</p>
                </div>
                <div className="space-y-3 p-6 text-[15px] text-white">
                  <div className="flex justify-between gap-4"><span className="text-white/60">Plan</span><span className="font-semibold">Premium · {pm.plan.label}</span></div>
                  <div className="flex justify-between gap-4"><span className="text-white/60">{who === "gift" ? "From" : "For"}</span><span className="font-semibold">{who === "gift" ? "You" : "Your account"}</span></div>
                  <div className="flex justify-between gap-4"><span className="text-white/60">Activation</span><span className="font-semibold">A few minutes</span></div>
                  <div aria-live="polite" className="flex items-baseline justify-between border-t border-white/10 pt-4"><span className="text-white/60">Total</span><span className="font-display text-2xl font-bold tabular-nums"><Tweened value={pm.total} /></span></div>
                  <button type="button" onClick={pm.proceed} className={`${accent.premium.btn} relative mt-2 w-full animate-glow overflow-hidden [--glow:rgba(192,38,211,.55)]`}><Shine /><span className="relative">{who === "gift" ? "Gift Premium" : "Get Premium"} · {usd(pm.total)}</span></button>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 pb-24 pt-20 sm:px-6">
        <section aria-labelledby="feat"><H2 id="feat">Everything in Premium</H2><div className="mt-6"><FeatureGrid /></div></section>
        {!extras && <section aria-labelledby="faq" className="mt-16 max-w-3xl"><H2 id="faq">Common questions</H2><div className="mt-6"><TgFaq s="premium" /></div></section>}
      </div>
      <PremiumCheckout pm={pm} />
    </PageShell>
  );
}
