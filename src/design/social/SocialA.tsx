"use client";

import { useState, type CSSProperties, type ReactNode, type Ref } from "react";
import Link from "@/i18n/Link";
import { liveSocialFaq, liveSocialRules, socialHeadings, socialPlatforms } from "@/content/social-en";
import { categoryHref } from "@/content/social-categories-en";
import { PageShell } from "../otp/parts";
import { H2, Trust } from "../telegram/parts";
import { card, LinkField, look, PlatformIcon, QuantityPicker, ServiceRadios, SocialBelow, SocialCheckout, SocialFaq, SocialOrderView, SocialRules, SocialSummary, TierRadios, useJump, useSocial, JumpBar, type Social } from "./kit";
import { LiveAmount, LiveCheckout, LiveFields, LiveJumpBar, LiveMark, LiveNotice, LiveOrderView, LiveServiceRadios, LiveSummary, toneOf, useLiveOrder } from "./liveOrder";
import { icons } from "./listKit";
import { useLiveSocialOrder, type LiveSocialOrder } from "./live";
import { useHasExtras } from "../service/slot";
import { useT } from "@/i18n/client";

// Social A — "Platform Band": Stars L / Premium S's layout. A band in the chosen platform's colours holds the title,
// the platform switch and its icon; the order summary rises into the band on desktop and the form overlaps its lower
// edge. One motion moment: picking a platform cross-fades the band and the icon pops in. Below follows the site theme.
// On the live page (/virtual-service/{platform}) the platforms, services, packages and order fields come from the
// admin and each platform is its own page: the pills are links, and the band starts fading to the next platform's
// colour as soon as one is clicked.

function Band({ bands, active }: { bands: { id: string; bg: string }[]; active: string }) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden bg-slate-950">
      {bands.map((b) => <div key={b.id} style={{ backgroundImage: b.bg }} className={`absolute inset-0 transition-opacity duration-700 ease-out ${active === b.id ? "opacity-100" : "opacity-0"}`} />)}
      <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/25 to-black/45" />
      <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,.1)_1px,transparent_1px)] bg-[size:20px_20px]" />
    </div>
  );
}

const pill = "flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition-colors";
const pillOn = "border-white bg-white text-slate-900";
const pillOff = "border-white/40 text-white hover:bg-white/10";

// Platform switch on the band: white pills, the chosen one solid.
function PlatformPills({ s }: { s: Social }) {
  const tx = useT();
  return (
    <fieldset>
      <legend className="sr-only">{tx("Platform")}</legend>
      <div className="flex flex-wrap gap-2">
        {socialPlatforms.map((p) => {
          const on = s.platform === p.id;
          const { Icon } = look[p.id];
          return (
            <label key={p.id} className={`${pill} cursor-pointer has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-emerald-400 has-[:focus-visible]:ring-offset-2 has-[:focus-visible]:ring-offset-slate-900 ${on ? pillOn : pillOff}`}>
              <input type="radio" name="social-platform-band" checked={on} onChange={() => s.setPlatform(p.id)} className="sr-only" />
              <Icon aria-hidden className="h-4 w-4" />{tx(p.name)}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

// Live: every platform is its own page, so the switch is a row of links.
function PlatformLinks({ d, opening, onOpen }: { d: LiveSocialOrder; opening: string | null; onOpen: (slug: string) => void }) {
  const tx = useT();
  const current = opening ?? d.platform.slug;
  return (
    <nav aria-label={tx("Platforms")}>
      <ul className="flex flex-wrap gap-2">
        {d.platforms.map((p) => {
          const on = current === p.slug;
          const Icon = !p.logo && p.icon ? icons[p.icon] : undefined;
          return (
            <li key={p.slug}>
              <Link href={categoryHref(p)} scroll={false} aria-current={p.slug === d.platform.slug ? "page" : undefined} onClick={() => p.slug !== d.platform.slug && onOpen(p.slug)}
                className={`${pill} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 ${on ? pillOn : pillOff}`}>
                {p.logo ? <img src={p.logo} alt="" className="h-5 w-5 rounded-md object-cover" /> : Icon ? <Icon aria-hidden className="h-4 w-4" /> : null}{p.name}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

// The page itself, shared by the preview and the live page.
function Frame({ bands, active, heading, mark, pills, trust, notice, choose, summary, jumpRef, below, after, onSubmit, style }: {
  bands: { id: string; bg: string }[]; active: string; heading: ReactNode; mark: ReactNode; pills: ReactNode; trust: string[]; notice?: ReactNode;
  choose: ReactNode; summary: ReactNode; jumpRef: Ref<HTMLDivElement>; below: ReactNode; after: ReactNode; onSubmit: () => void; style?: CSSProperties;
}) {
  const tx = useT();
  return (
    <PageShell heroDark>
      <div style={style}>
        <section aria-labelledby="social-h1" className="relative -mt-16 overflow-hidden pb-28 pt-28 text-white">
          <Band bands={bands} active={active} />
          <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
            <div className="flex items-center justify-between gap-5 lg:max-w-[calc(100%-400px)]">
              <div className="min-w-0">{heading}</div>
              {mark}
            </div>
            <div className="mt-6">{pills}</div>
            <div className="mt-5"><Trust light items={trust} /></div>
            {notice}
          </div>
        </section>

        <div id="buy" className="mx-auto max-w-6xl scroll-mt-24 px-4 sm:px-6">
          <form noValidate onSubmit={(e) => { e.preventDefault(); onSubmit(); }} className="grid grid-cols-[minmax(0,1fr)] gap-x-10 gap-y-10 lg:grid-cols-[minmax(0,1fr)_360px]">
            <section aria-label={tx("Choose")} className={`${card} relative z-10 -mt-16 min-w-0 space-y-8 p-6 shadow-2xl shadow-slate-950/15 sm:p-8 lg:col-start-1 lg:row-start-1`}>
              {choose}
            </section>
            <aside aria-label={tx("Your order")} className="relative z-10 lg:col-start-2 lg:row-start-1 lg:-mt-72">
              <div ref={jumpRef} className="lg:sticky lg:top-24">{summary}</div>
            </aside>
          </form>
        </div>
        {below}
        {after}
      </div>
    </PageShell>
  );
}

function Heading({ title, sub }: { title: string; sub: string }) {
  return (
    <>
      <h1 id="social-h1" className="text-balance font-display text-3xl font-bold tracking-tight sm:text-5xl">{title}</h1>
      {sub && <p className="mt-2 max-w-2xl text-base leading-relaxed text-white/90 sm:mt-3 sm:text-lg">{sub}</p>}
    </>
  );
}

export default function SocialA() {
  const live = useLiveSocialOrder();
  return live ? <LiveSocialA d={live} /> : <PreviewSocialA />;
}

// /design/page-social: the placeholder platforms and services.
function PreviewSocialA() {
  const tx = useT();
  const s = useSocial();
  const jump = useJump(s.order);
  if (s.order) return <PageShell><div className="px-6 py-14"><SocialOrderView o={s.order} onAgain={s.reset} /></div></PageShell>;
  return (
    <Frame
      bands={socialPlatforms.map((p) => ({ id: p.id, bg: look[p.id].band }))} active={s.platform}
      heading={<Heading title={tx(socialHeadings.h1)} sub={tx(socialHeadings.sub)} />}
      mark={<PlatformIcon key={s.platform} p={s.platform} size="xl" className="hidden animate-pop shadow-2xl shadow-black/30 sm:grid" />}
      pills={<PlatformPills s={s} />}
      trust={[tx("No password needed"), tx("Starts in minutes"), tx("Refund if it can't start")]}
      choose={<>
        <ServiceRadios s={s} legend={`${tx(socialPlatforms.find((p) => p.id === s.platform)!.name)} · ${tx("Service")}`} />
        <TierRadios s={s} />
        <QuantityPicker s={s} />
        <LinkField s={s} />
      </>}
      summary={<SocialSummary s={s} className={`${card} shadow-2xl shadow-slate-950/20`} />}
      jumpRef={jump.ref} onSubmit={s.proceed}
      below={<SocialBelow />}
      after={<><JumpBar s={s} inView={jump.inView} go={jump.go} /><SocialCheckout s={s} /></>}
    />
  );
}

// /virtual-service/{platform}: the admin's platforms, services and packages, paid through the backend.
function LiveSocialA({ d }: { d: LiveSocialOrder }) {
  const tx = useT();
  const o = useLiveOrder(d);
  const jump = useJump(o.order);
  const [opening, setOpening] = useState<string | null>(null);
  if (o.order) return <PageShell><div className="px-6 py-14"><LiveOrderView o={o} /></div></PageShell>;
  const shown = d.platforms.some((p) => p.slug === d.platform.slug) ? d.platforms : [d.platform, ...d.platforms];
  return (
    <Frame
      style={o.tone.vars}
      bands={shown.map((p) => ({ id: p.slug, bg: toneOf(p).band }))} active={opening ?? d.platform.slug}
      heading={<Heading title={d.title} sub={d.sub} />}
      mark={<LiveMark key={d.platform.slug} c={d.platform} size="xl" className="hidden animate-pop shadow-2xl shadow-black/30 sm:grid" />}
      pills={<PlatformLinks d={{ ...d, platforms: shown }} opening={opening} onOpen={setOpening} />}
      trust={[tx("No password needed"), tx("24/7 support"), tx("Refund if it can't start")]}
      notice={o.notice && <LiveNotice n={o.notice} />}
      choose={d.error ? <p role="alert" className="font-semibold text-red-700 dark:text-red-400">{d.error}</p>
        : !o.service ? <p className="text-slate-700 dark:text-slate-300">{tx("No {0} services are on sale right now. Have a look at the other platforms above.", { 0: d.platform.name })}</p>
        : <>
          <LiveServiceRadios o={o} />
          <LiveAmount o={o} />
          <LiveFields o={o} />
        </>}
      summary={<LiveSummary o={o} className={`${card} shadow-2xl shadow-slate-950/20`} />}
      jumpRef={jump.ref} onSubmit={o.proceed}
      below={<LiveBelow d={d} />}
      after={o.service && <><LiveJumpBar o={o} inView={jump.inView} go={jump.go} /><LiveCheckout o={o} /></>}
    />
  );
}

// Rules, the platform's own article, then its FAQ (the general one when it has none).
function LiveBelow({ d }: { d: LiveSocialOrder }) {
  const tx = useT();
  const extras = useHasExtras();
  return (
    <div className="mx-auto max-w-6xl space-y-16 px-4 pb-28 pt-16 sm:px-6">
      <SocialRules items={liveSocialRules} />
      {d.article && (
        <section aria-labelledby="social-about" className="max-w-3xl">
          <H2 id="social-about">{d.article.title}</H2>
          <div className="mt-6 space-y-4 text-[15px] leading-8 text-slate-700 dark:text-slate-300">
            {d.article.blocks.map((b, i) => b.kind === "h"
              ? <h3 key={i} className="pt-4 font-display text-lg font-semibold text-slate-900 dark:text-white">{b.text}</h3>
              : <p key={i}>{b.text}</p>)}
          </div>
        </section>
      )}
      {!extras && <section aria-labelledby="social-faq" className="max-w-3xl"><H2 id="social-faq">{tx("Common questions")}</H2><div className="mt-6"><SocialFaq items={d.faq?.length ? d.faq : tx.tr(liveSocialFaq)} /></div></section>}
    </div>
  );
}
