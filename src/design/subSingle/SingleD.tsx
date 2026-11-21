"use client";
import { useMoney } from "@/lib/money";
import { PageShell } from "../otp/parts";
import { ActivationBadge, brand, SubsCheckout, SubsOrderView, Tile, useSubs } from "../subs/parts";
import { useSubsList } from "../subs/live";
import { BuyBox, Crumbs, DEFAULT_SLUG, FromLine, Related, Trust } from "./parts";
import { ProductTabs } from "./tabs";
import type { LiveComments } from "../service/ServiceExtras";
import { SpotlightBand, spotTone, useSpotlight } from "@/design/service/spotlight";
import { useHasExtras } from "@/design/service/slot";
import { subBridges } from "./bridge";

// Single D — "Brand Hero": a hero in the product's own colour with a large title; on desktop the buy box overlaps
// the hero, so it's the first thing on the right. On phones it follows the hero. Details come below.
// `comments`: the page's real comments for the testimonials tab (none on the /design previews: placeholders).
// `bridge`: the chosen moving element (gallery "sub-single-bridge") between the related cards and the How to use
// steps that follow on live pages; it takes the place of the empty band there.
export default function SingleD({ slug, panel, comments, bridge }: { slug?: string; panel?: string; comments?: LiveComments; bridge?: string }) {
  const usd = useMoney().format;
  const spot = useSpotlight();
  const s = useSubs(slug ?? DEFAULT_SLUG);
  const extras = useHasExtras();
  const list = useSubsList();
  if (s.order) return <PageShell><div className="px-6 py-14"><SubsOrderView s={s} /></div></PageShell>;
  const p = s.product!;
  const hero = brand(p);
  const Bridge = extras && bridge ? subBridges[bridge] : undefined;
  const heading = (
    <>
      <div className="flex flex-wrap items-center gap-4"><span className={`rounded-2xl ring-2 ${spot ? "ring-slate-200 dark:ring-white/20" : "ring-white/40"}`}><Tile p={p} size="lg" /></span><ActivationBadge p={p} /></div>
      <h1 className="mt-6 font-display text-4xl font-bold tracking-tight sm:text-6xl">{p.name}</h1>
      <p className={`mt-4 text-lg leading-relaxed ${spot ? spotTone.sub : "text-white/90"}`}><FromLine p={p} usd={usd} /></p>
    </>
  );
  // Live look (spotlight band): the title, facts and tabs are one column that stays in view beside the buy box while
  // the buyer scrolls down the order form. The band is only the background behind it. On phones the same pieces
  // stack as title → buy box → details (the column is `display: contents` there and `order` sets the sequence).
  if (spot) {
    return (
      <PageShell heroDark={false}>
        <section aria-label={p.name} className={`relative -mt-16 -mb-[20rem] min-h-[30rem] overflow-hidden pt-28 ${spotTone.title}`}>
          <SpotlightBand under={false} beam="start" />
          <div className="relative mx-auto max-w-6xl px-4 sm:px-6"><Crumbs p={p} light={false} /></div>
        </section>
        <div className={`relative z-10 mx-auto max-w-6xl px-4 sm:px-6 ${Bridge ? "pb-0" : "pb-20"}`}>
          <div className="grid grid-cols-[minmax(0,1fr)] gap-x-10 gap-y-10 lg:grid-cols-[minmax(0,1fr)_380px]">
            {/* The buy box comes first in the markup (as on the other layouts) and CSS order puts it second on phones. */}
            <aside className="relative order-2 lg:col-start-2 lg:row-start-1 lg:mt-8"><div className="lg:sticky lg:top-24"><BuyBox s={s} panel={panel} className="shadow-2xl shadow-slate-900/20" /></div></aside>
            <div className="contents lg:sticky lg:top-20 lg:col-start-1 lg:row-start-1 lg:block lg:space-y-10 lg:self-start">
              <div className={`order-1 mt-8 ${spotTone.title}`}>
                {heading}
                <Trust p={p} className="mt-6" />
              </div>
              <div className="order-3"><ProductTabs p={p} live={comments} /></div>
            </div>
          </div>
          <div className="mt-16"><Related p={p} /></div>
          {Bridge && <div className="mt-8"><Bridge p={p} list={list} /></div>}
        </div>
        <SubsCheckout s={s} />
      </PageShell>
    );
  }
  return (
    <PageShell heroDark={!spot}>
      <section aria-label={p.name} className={`relative -mt-16 overflow-hidden pb-32 pt-28 ${spot ? spotTone.title : "text-white"} [mask-image:linear-gradient(to_bottom,black_calc(100%-9rem),transparent)] ${spot ? "" : hero.className}`} style={spot ? undefined : hero.style}>
        {spot ? <SpotlightBand under={false} beam="start" /> : <>
          <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/35 to-black/60" />
          <div aria-hidden className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,.12)_1px,transparent_1px)] bg-[size:20px_20px]" />
        </>}
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
          <Crumbs p={p} light={!spot} />
          <div className="mt-8 max-w-xl lg:max-w-[calc(100%-420px)]">{heading}</div>
        </div>
      </section>
      <div className={`mx-auto max-w-6xl px-4 sm:px-6 ${Bridge ? "pb-0" : "pb-20"}`}>
        <div className="grid grid-cols-[minmax(0,1fr)] gap-x-10 gap-y-10 lg:grid-cols-[minmax(0,1fr)_380px]">
          <aside className="relative z-10 -mt-24 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:-mt-80"><div className="lg:sticky lg:top-24"><BuyBox s={s} panel={panel} className="shadow-2xl shadow-slate-900/20" /></div></aside>
          <div className="space-y-12 lg:col-start-1 lg:row-start-1">
            {/* On desktop the facts sit in the hero's faded foot, which is otherwise empty beside the buy box. */}
            <div className="relative z-10 lg:-mt-28"><Trust p={p} /></div>
            <ProductTabs p={p} live={comments} />
          </div>
        </div>
        <div className="mt-16"><Related p={p} /></div>
        {Bridge && <div className="mt-8"><Bridge p={p} list={list} /></div>}
      </div>
      <SubsCheckout s={s} />
    </PageShell>
  );
}
