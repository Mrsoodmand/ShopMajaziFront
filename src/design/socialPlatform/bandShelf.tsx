"use client";

import { useT } from "@/i18n/client";
import { PageShell } from "../otp/parts";
import { Trust } from "../telegram/parts";
import { LiveAmount, LiveCheckout, LiveFields, LiveMark, LiveNotice, LiveSummary, toneOf } from "../social/liveOrder";
import { SpotlightBand, spotTone, useSpotlight } from "../service/spotlight";
import { card, PayBar, toneVars, useOnScreen } from "../socialService/parts";
import { ServiceCard } from "./offers";
import { Done, Empty, PlatformBelow, PlatformRoot, usePlatform } from "./parts";

// L — Band + Shelf: A's top as it is live (the Spotlight band while that hero is on, else the band in the
// platform's colours, with the title, icon and platform switch), and F's order under it: "Pick a service" with
// every service as a card on one shelf over the band's lower edge (a swipe row on phones), then the amount and link
// beside a sticky summary.

function Band({ c }: { c: Parameters<typeof toneOf>[0] }) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden bg-slate-950">
      <div className="absolute inset-0" style={{ backgroundImage: toneOf(c).band }} />
      <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/25 to-black/45" />
      <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,.1)_1px,transparent_1px)] bg-[size:20px_20px]" />
    </div>
  );
}

function BodyL() {
  const tx = useT();
  const spot = useSpotlight();
  const { d, o } = usePlatform();
  const [sumRef, sumOn] = useOnScreen<HTMLDivElement>();
  if (o.order) return <Done o={o} />;
  return (
    <PageShell heroDark={!spot}>
      <div style={{ ...o.tone.vars, ...toneVars(d) }}>
        <section aria-labelledby="pl-h1" className={`relative -mt-16 overflow-hidden pb-28 pt-28 ${spot ? spotTone.title : "text-white"}`}>
          {spot ? <SpotlightBand under={false} beam="start" /> : <Band c={d.platform} />}
          <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
            <div className="flex items-center justify-between gap-5">
              <div className="min-w-0">
                <h1 id="pl-h1" className="text-balance font-display text-3xl font-bold tracking-tight sm:text-5xl">{d.title}</h1>
                {d.sub && <p className={`mt-2 max-w-2xl text-base leading-relaxed sm:mt-3 sm:text-lg ${spot ? spotTone.sub : "text-white/90"}`}>{d.sub}</p>}
              </div>
              <LiveMark key={d.platform.slug} c={d.platform} size="xl" className="hidden animate-pop shadow-2xl shadow-black/30 sm:grid" />
            </div>
            <div className="mt-6"><Trust light={!spot} items={[tx("No password needed"), tx("24/7 support"), tx("Refund if it can't start")]} /></div>
            {o.notice && <LiveNotice n={o.notice} />}
          </div>
        </section>

        <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6">
          {/* F's selector: "Pick a service" and every service as a card on one shelf (swipe row on phones). */}
          {!d.error && d.services.length > 0 && (
            <fieldset className="-mt-20 min-w-0">
              <legend className={`font-display text-xl font-bold ${spot ? spotTone.title : "text-white"}`}>{tx("Pick a service")}</legend>
              <div className="-mx-4 mt-4 flex snap-x snap-mandatory scroll-px-4 gap-3 overflow-x-auto px-4 pb-3 pt-1 [scrollbar-width:none] sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 lg:grid-cols-4">
                {d.services.map((s) => <ServiceCard key={s.id} o={o} s={s} className="w-[74%] shrink-0 snap-start shadow-xl shadow-slate-950/10 sm:w-auto" />)}
              </div>
            </fieldset>
          )}
          <form noValidate onSubmit={(e) => { e.preventDefault(); o.proceed(); }} className="mt-8 grid grid-cols-[minmax(0,1fr)] gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
            <section aria-label={tx("Choose")} className={`${card} min-w-0 space-y-8 p-5 sm:p-8`}>
              <Empty o={o} />
              {o.service && !d.error && <><LiveAmount o={o} /><LiveFields o={o} /></>}
            </section>
            <aside aria-label={tx("Your order")} className="min-w-0">
              <div ref={sumRef} className="space-y-3 lg:sticky lg:top-24">
                <LiveSummary o={o} />
                <Trust items={[tx("No password needed"), tx("Refund if it can't start")]} />
              </div>
            </aside>
          </form>
        </div>
        <PlatformBelow d={d} />
        {o.service && <><PayBar o={o} hide={sumOn} /><LiveCheckout o={o} /></>}
      </div>
    </PageShell>
  );
}
export const SocialPlatformL = () => <PlatformRoot><BodyL /></PlatformRoot>;
