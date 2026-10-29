"use client";

import { tgHeadings } from "@/content/telegram-en";
import { PageShell } from "../otp/parts";
import { useHasExtras } from "../service/slot";
import { AnonToggle, card, H2, StarAmountInput, StarsCheckout, TgFaq, TgOrderView, Title, Trust, UsernameField, useStars } from "./parts";
import { BuyStars, PackRadios, StarsSummary, TierTable, UsesGrid } from "./stars";

// Stars A — "Pack Grid": who gets it, then a grid of ready packs (or any amount), with the order summary in view
// beside it. Below: what Stars are for, price per Star by amount, FAQ.
export default function StarsA() {
  const st = useStars();
  const extras = useHasExtras();
  if (st.order) return <PageShell><div className="px-6 py-14"><TgOrderView o={st.order} onAgain={st.reset} /></div></PageShell>;
  return (
    <PageShell>
      <div className="mx-auto max-w-6xl px-4 pb-24 pt-14 sm:px-6">
        <Title s="stars" sub={tgHeadings.stars.sub}>{tgHeadings.stars.h1}</Title>
        <div className="mt-6"><Trust items={["No login needed", "Delivered in minutes", "Refund if not delivered"]} /></div>

        <div className="mt-10 grid grid-cols-[minmax(0,1fr)] gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
          <section aria-label="Choose" className={`${card} space-y-8 p-6 sm:p-8`}>
            <UsernameField r={st.r} s="stars" />
            <PackRadios st={st} />
            <div className="grid gap-5 sm:grid-cols-2"><StarAmountInput st={st} /><div className="sm:pt-7"><AnonToggle st={st} /></div></div>
          </section>
          <div className="lg:sticky lg:top-24 lg:self-start"><StarsSummary st={st}><BuyStars st={st} className="mt-5" /></StarsSummary></div>
        </div>

        <section aria-labelledby="uses" className="mt-20"><H2 id="uses">What can you do with Stars?</H2><div className="mt-6"><UsesGrid /></div></section>
        <section aria-labelledby="tiers" className="mt-16 max-w-3xl"><H2 id="tiers">Buy more, pay less per Star</H2><div className="mt-6"><TierTable st={st} /></div></section>
        {!extras && <section aria-labelledby="faq" className="mt-16 max-w-3xl"><H2 id="faq">Common questions</H2><div className="mt-6"><TgFaq s="stars" /></div></section>}
      </div>
      <StarsCheckout st={st} />
    </PageShell>
  );
}
