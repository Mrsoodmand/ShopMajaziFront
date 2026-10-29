"use client";

import { CalendarCheck } from "lucide-react";
import { PageShell } from "../otp/parts";
import { glass, PremiumCheckout, TgOrderView, UsernameField, usePremium } from "./parts";
import { PlanRadios } from "./premium";
import { glassForm, NightPage, PremiumBelow, PremiumSide, useWho, WhoRadios } from "./night";

// Premium I — "Timeline": the next 12 months as a bar; choosing 3, 6 or 12 months fills it up to that month and
// shows the exact date Premium lasts until. Plans as cards under the bar; Buy in the sidebar.

const fmtDate = (d: Date) => d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

export default function PremiumI() {
  const pm = usePremium();
  const { who, setWho } = useWho(pm);
  if (pm.order) return <PageShell><div className="px-6 py-14"><TgOrderView o={pm.order} onAgain={pm.reset} /></div></PageShell>;
  const now = new Date();
  const months = Array.from({ length: 12 }, (_, i) => new Date(now.getFullYear(), now.getMonth() + i + 1, 1).toLocaleDateString("en-US", { month: "short" }));
  const end = new Date(now.getFullYear(), now.getMonth() + pm.plan.months, now.getDate());
  const pct = (pm.plan.months / 12) * 100;
  return (
    <PageShell>
      <NightPage tone="premium" side={<PremiumSide pm={pm} who={who} />} below={<PremiumBelow />}>
        <section aria-labelledby="tl-h" className={`${glass} p-6 sm:p-8`}>
          <h2 id="tl-h" className="font-display text-xl font-bold text-white">How long?</h2>
          <p aria-live="polite" className="mt-1 flex items-center gap-2 text-white/80"><CalendarCheck aria-hidden className="h-4 w-4 text-fuchsia-300" />Premium until <strong className="text-white">{fmtDate(end)}</strong></p>

          <div aria-hidden className="mt-8">
            <div className="relative h-4 overflow-hidden rounded-full bg-white/10">
              <div className="absolute inset-y-0 start-0 overflow-hidden rounded-full bg-gradient-to-r from-violet-500 via-fuchsia-500 to-amber-300 transition-[width] duration-700 ease-out" style={{ width: `${pct}%` }}>
                <span className="absolute inset-y-0 start-0 w-1/3 animate-shine bg-gradient-to-r from-transparent via-white/50 to-transparent" />
              </div>
              {[3, 6, 9].map((m) => <span key={m} className="absolute inset-y-0 w-px bg-white/25" style={{ insetInlineStart: `${(m / 12) * 100}%` }} />)}
            </div>
            <div className="relative mt-2 grid grid-cols-12 text-center text-[10px] text-white/50 sm:text-xs">
              {months.map((m, i) => <span key={i} className={i < pm.plan.months ? "font-semibold text-white" : ""}>{m}</span>)}
            </div>
            <span className="relative mt-1 block h-6">
              {/* At the far end the bubble sits fully inside the bar. */}
              <span className={`absolute animate-float rounded-full bg-white px-2 py-0.5 text-xs font-bold text-violet-700 transition-[inset-inline-start] duration-700 ${pct >= 100 ? "-translate-x-full rtl:translate-x-full" : "-translate-x-1/2 rtl:translate-x-1/2"}`} style={{ insetInlineStart: `${pct}%` }}>{pm.plan.months} mo</span>
            </span>
          </div>

          <div className="mt-6"><PlanRadios pm={pm} legend="Plan" dark /></div>
        </section>

        <section aria-label="Recipient" className={`${glassForm} space-y-8`}>
          <WhoRadios who={who} setWho={setWho} />
          <UsernameField r={pm.r} s="premium" mine={false} chip={false} label={who === "me" ? "Your username" : "Your friend's username"} hint="We never need a password or login code." />
        </section>
      </NightPage>
      <PremiumCheckout pm={pm} />
    </PageShell>
  );
}
