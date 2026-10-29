"use client";

import { tgHeadings } from "@/content/telegram-en";
import { PageShell } from "../otp/parts";
import { PremiumCheckout, TgOrderView, Trust, UsernameField, usePremium } from "./parts";
import { PlanRadios } from "./premium";
import { useWho } from "./night";
import { Badge, PremiumFaq, PremiumForm } from "./premiumKit";
import { BandBackground, BentoGlow, glowPanel, glowSelection, JumpBarGlow, OrderCardGlow, useJump, WhoSwitchGlow } from "./premiumGlow";
import { useT } from "@/i18n/client";
import { PageH1 } from "@/components/seo/PageHeading";

// Premium S — "Feature Bento on a Brand Band": Single D's layout in Premium's own gradient. A violet-to-fuchsia band
// holds the title and badge; on desktop the order card rises into the band beside the title, so it's the first thing
// on the right, and the form overlaps the band's lower edge. Everything below the band follows the site theme.
// K's content: plans, who, username, the feature bento, and the green Continue in the sidebar.

export default function PremiumS() {
  const t = useT();
  const pm = usePremium();
  const { who, setWho } = useWho(pm);
  const jump = useJump(pm);
  if (pm.order) return <PageShell><div className="px-6 py-14"><TgOrderView o={pm.order} onAgain={pm.reset} /></div></PageShell>;
  return (
    <PageShell heroDark>
      <div className={glowSelection}>
        <section aria-labelledby="pm-h1" className="relative -mt-16 overflow-hidden pb-28 pt-28 text-white">
          <BandBackground />
          <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
            <div className="flex items-center justify-between gap-5 lg:max-w-[calc(100%-400px)]">
              <div className="min-w-0">
                <h1 id="pm-h1" className="text-balance font-display text-3xl font-bold tracking-tight sm:text-5xl"><PageH1 text={t.tr(tgHeadings).premium.h1} /></h1>
                <p className="mt-2 max-w-2xl text-base leading-relaxed text-violet-50 sm:mt-3 sm:text-lg">{t.tr(tgHeadings).premium.sub}</p>
              </div>
              <Badge months={pm.plan.months} found={pm.r.user?.username ?? ""} />
            </div>
            <div className="mt-5 sm:mt-6"><Trust light items={[t("Gift to your username"), t("No password needed"), t("Active in minutes")]} /></div>
          </div>
        </section>

        <div id="buy" className="mx-auto max-w-6xl scroll-mt-24 px-4 sm:px-6">
          <PremiumForm pm={pm} className="grid grid-cols-[minmax(0,1fr)] gap-x-10 gap-y-10 lg:grid-cols-[minmax(0,1fr)_360px]">
            <div className="relative z-10 -mt-16 min-w-0 space-y-10 lg:col-start-1 lg:row-start-1">
              <section aria-label={t("Choose")} className={`${glowPanel} space-y-8 p-6 shadow-2xl shadow-violet-950/15 sm:p-8`}>
                <PlanRadios pm={pm} legend={t("Choose a plan")} />
                <WhoSwitchGlow who={who} setWho={setWho} />
                <UsernameField r={pm.r} s="premium" mine={false} chip={false} label={who === "me" ? t("Your username") : t("Your friend's username")} hint={t("We never need a password or login code.")} />
              </section>
              <BentoGlow />
            </div>
            <aside aria-label={t("Your order")} className="relative z-10 lg:col-start-2 lg:row-start-1 lg:-mt-64">
              <div ref={jump.ref} className="lg:sticky lg:top-24"><OrderCardGlow pm={pm} who={who} className="shadow-2xl shadow-violet-950/20" /></div>
            </aside>
          </PremiumForm>
        </div>
        <PremiumFaq />
      </div>
      <JumpBarGlow pm={pm} inView={jump.inView} go={jump.go} />
      <PremiumCheckout pm={pm} />
    </PageShell>
  );
}
