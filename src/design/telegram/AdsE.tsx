"use client";

import { MessageCircle } from "lucide-react";
import { PageShell } from "../otp/parts";
import { useHasExtras } from "../service/slot";
import { accent, AdErrorSummary, AdPreview, AdsCheckout, BudgetField, card, ContactField, H2, LinkField, TargetingFields, TextField, TgFaq, TgOrderView, Title, useAds } from "./parts";
import { HowItWorks, Rules, SubmitAd } from "./ads";

// Ads E — "Done for You": reads like a service, not an ad tool. A dark hero explains that we run the campaign;
// how it works and the rules come first, then one short brief (link, text, audience, budget, your contact) with a
// small preview. For people who have never used Telegram Ads.
export default function AdsE() {
  const a = useAds();
  const extras = useHasExtras();
  if (a.order) return <PageShell><div className="px-6 py-14"><TgOrderView o={a.order} onAgain={a.reset} /></div></PageShell>;
  return (
    <PageShell>
      <section className="relative -mt-16 overflow-hidden bg-[#0b1220] pb-20 pt-32">
        <div aria-hidden className="absolute -start-32 top-10 h-96 w-96 rounded-full bg-sky-500/25 blur-3xl" />
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
          <div className="max-w-2xl"><Title s="ads" light sub="Tell us what to promote and who should see it. We write the ad if you like, submit it, watch it and send you the results.">Telegram Ads, done for you</Title></div>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#brief" className={accent.ads.btn}>Start your brief</a>
            <a href="https://t.me/shopmajazi" className="inline-flex items-center gap-2 rounded-xl border border-white/25 px-6 py-3.5 font-semibold text-white hover:bg-white/10"><MessageCircle aria-hidden className="h-5 w-5" />Ask us first</a>
          </div>
          <div className="mt-14"><HowItWorks dark /></div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 pb-24 pt-20 sm:px-6">
        <section id="brief" aria-labelledby="brief-h" className="scroll-mt-24">
          <H2 id="brief-h">Your brief</H2>
          <p className="mt-2 max-w-2xl text-slate-700 dark:text-slate-300">Not sure what to write? Describe your offer in the text box and add &ldquo;please improve&rdquo;. We&apos;ll send you the final text before it goes to Telegram.</p>
          <div className="mt-8 grid grid-cols-[minmax(0,1fr)] gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
            <div className={`${card} space-y-6 p-6 sm:p-8`}>
              <AdErrorSummary a={a} />
              <LinkField a={a} />
              <TextField a={a} rows={4} />
              <TargetingFields a={a} />
              <BudgetField a={a} slider={false} />
              <ContactField a={a} />
              <SubmitAd a={a} className="py-4" label="Send brief and pay" />
            </div>
            <div className="space-y-5 lg:sticky lg:top-24 lg:self-start">
              <AdPreview a={a} />
              <Rules />
            </div>
          </div>
        </section>
        {!extras && <section aria-labelledby="faq" className="mt-20 max-w-3xl"><H2 id="faq">Common questions</H2><div className="mt-6"><TgFaq s="ads" /></div></section>}
      </div>
      <AdsCheckout a={a} />
    </PageShell>
  );
}
