"use client";

import { tgHeadings } from "@/content/telegram-en";
import { PageShell } from "../otp/parts";
import { useHasExtras } from "../service/slot";
import { AdErrorSummary, AdPreview, AdsCheckout, BudgetField, ButtonField, card, ContactField, GoalRadios, H2, LinkField, TargetingFields, TextField, TgFaq, TgOrderView, Title, TitleField, Trust, useAds } from "./parts";
import { AdSummary, Estimate, HowItWorks, Rules, SubmitAd } from "./ads";

// Ads A — "Campaign Builder": the whole campaign on one page in three cards (your ad, audience, budget). A live
// preview of the sponsored message, the estimate and Pay stay beside it while you type.
export default function AdsA() {
  const a = useAds();
  const extras = useHasExtras();
  if (a.order) return <PageShell><div className="px-6 py-14"><TgOrderView o={a.order} onAgain={a.reset} /></div></PageShell>;
  return (
    <PageShell>
      <div className="mx-auto max-w-6xl px-4 pb-24 pt-14 sm:px-6">
        <Title s="ads" sub={tgHeadings.ads.sub}>{tgHeadings.ads.h1}</Title>
        <div className="mt-6"><Trust items={["No TON or Fragment needed", "Refund if rejected", "Stop any time"]} /></div>

        <div className="mt-10 grid grid-cols-[minmax(0,1fr)] gap-8 lg:grid-cols-[minmax(0,1fr)_380px]">
          <div className="space-y-6">
            <AdErrorSummary a={a} />
            <section aria-labelledby="s-ad" className={`${card} space-y-6 p-6 sm:p-8`}>
              <H2 id="s-ad" className="text-xl">1 · Your ad</H2>
              <GoalRadios a={a} />
              <LinkField a={a} />
              <TitleField a={a} />
              <TextField a={a} />
              <ButtonField a={a} />
            </section>
            <section aria-labelledby="s-aud" className={`${card} space-y-6 p-6 sm:p-8`}>
              <H2 id="s-aud" className="text-xl">2 · Audience</H2>
              <TargetingFields a={a} />
            </section>
            <section aria-labelledby="s-bud" className={`${card} space-y-6 p-6 sm:p-8`}>
              <H2 id="s-bud" className="text-xl">3 · Budget</H2>
              <BudgetField a={a} />
              <ContactField a={a} />
            </section>
          </div>
          <div className="space-y-5 lg:sticky lg:top-24 lg:self-start">
            <AdPreview a={a} />
            <Estimate a={a} />
            <AdSummary a={a}><SubmitAd a={a} className="mt-5" /></AdSummary>
          </div>
        </div>

        <section aria-labelledby="how" className="mt-20"><H2 id="how">How it works</H2><div className="mt-6"><HowItWorks /></div></section>
        <div className="mt-10 max-w-3xl"><Rules /></div>
        {!extras && <section aria-labelledby="faq" className="mt-16 max-w-3xl"><H2 id="faq">Common questions</H2><div className="mt-6"><TgFaq s="ads" /></div></section>}
      </div>
      <AdsCheckout a={a} />
    </PageShell>
  );
}
