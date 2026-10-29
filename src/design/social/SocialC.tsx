"use client";

import { Eye, Heart, ThumbsUp, Users } from "lucide-react";
import { socialHeadings, socialPlatforms, type SocialService } from "@/content/social-en";
import { PageShell } from "../otp/parts";
import { Trust, useTween } from "../telegram/parts";
import { card, LinkField, look, PlatformIcon, QuantityPicker, ServiceRadios, SocialBelow, SocialCheckout, SocialForm, SocialOrderView, SocialSummary, TierRadios, useJump, useSocial, JumpBar, type Social } from "./kit";
import { useT } from "@/i18n/client";

// Social C — "Live Preview": the top of the order card is a small picture of what you're growing, drawn in the
// platform's style (a channel, profile, post or video) with the handle taken from your link. The number being added
// counts up once when the amount changes. Platform tiles in a compact row on the form side. Plain site theme.

const fmt = (n: number) => n.toLocaleString("en-US");

function unitIcon(sv: SocialService) {
  if (sv.unit === "views") return Eye;
  if (sv.unit === "likes" || sv.unit === "reactions") return sv.platform === "youtube" ? ThumbsUp : Heart;
  return Users;
}

// A sketch of the account or post, not a real fetch: placeholder lines stand in for content we don't know.
function Preview({ s }: { s: Social }) {
  const tx = useT();
  const n = useTween(s.qty || 0, 600);
  const isPost = /post|video/.test(s.service.target);
  const name = s.handle || tx(s.platform === "telegram" ? "your channel" : s.platform === "youtube" ? "your channel" : "your account");
  const Icon = unitIcon(s.service);
  const L = look[s.platform];
  return (
    <figure aria-label={tx("Preview of your order")} className={`overflow-hidden rounded-2xl border border-slate-200 dark:border-white/10 ${L.soft}`}>
      <div className="flex items-center gap-3 p-4">
        <span aria-hidden className={`grid h-11 w-11 shrink-0 place-items-center rounded-full font-display font-bold uppercase ${s.platform === "instagram" ? "bg-[linear-gradient(45deg,#f59e0b,#ec4899_50%,#8b5cf6)] p-0.5" : ""}`}>
          <span className={`grid h-full w-full place-items-center rounded-full ${s.platform === "instagram" ? "border-2 border-white bg-slate-200 text-slate-700 dark:border-[#0E1424] dark:bg-slate-700 dark:text-slate-100" : `${L.tile}`}`}>{(s.handle || "?").slice(0, 1)}</span>
        </span>
        <span className="min-w-0 flex-1">
          <span dir="ltr" className={`block truncate text-start font-semibold ${s.handle ? "text-slate-900 dark:text-white" : "text-slate-500 dark:text-slate-400"}`}>{s.handle ? `@${name}` : name}</span>
          <span className="block truncate text-sm text-slate-600 dark:text-slate-400">{tx(socialPlatforms.find((p) => p.id === s.platform)!.name)}</span>
        </span>
        <PlatformIcon p={s.platform} size="sm" />
      </div>
      {isPost && (
        <div aria-hidden className="mx-4 grid aspect-[16/9] place-items-center rounded-xl bg-white/70 dark:bg-white/5">
          <span className="space-y-2"><span className="block h-2 w-32 rounded-full bg-slate-300 dark:bg-white/15" /><span className="block h-2 w-20 rounded-full bg-slate-300 dark:bg-white/15" /></span>
        </div>
      )}
      <figcaption className="flex items-center gap-3 p-4">
        <span className={`grid h-10 w-10 place-items-center rounded-xl bg-white dark:bg-white/10 ${L.text}`}><Icon aria-hidden className="h-5 w-5" /></span>
        <span className="min-w-0">
          <span className="block font-display text-2xl font-bold tabular-nums text-slate-900 dark:text-white">+{fmt(Math.round(n))}</span>
          <span className="block text-sm text-slate-600 dark:text-slate-400">{tx(s.service.unit)} · {tx(s.service.startsIn)}</span>
        </span>
      </figcaption>
    </figure>
  );
}

// Platforms as one compact row of icon tabs (radios).
function PlatformRow({ s }: { s: Social }) {
  const tx = useT();
  return (
    <fieldset>
      <legend className="text-base font-semibold text-slate-900 dark:text-white">{tx("Platform")}</legend>
      <div className="mt-3 grid grid-cols-4 gap-2 rounded-2xl bg-slate-100 p-1.5 dark:bg-white/5">
        {socialPlatforms.map((p) => {
          const on = s.platform === p.id;
          return (
            <label key={p.id} className={`flex cursor-pointer flex-col items-center gap-1.5 rounded-xl px-2 py-3 text-sm font-semibold transition has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-emerald-600 dark:has-[:focus-visible]:ring-emerald-400 ${on ? "bg-white text-slate-900 shadow-sm dark:bg-[#0E1424] dark:text-white" : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"}`}>
              <input type="radio" name="social-platform-row" checked={on} onChange={() => s.setPlatform(p.id)} className="sr-only" />
              <PlatformIcon p={p.id} size="sm" className={on ? "" : "opacity-60 grayscale"} />
              <span>{tx(p.name)}</span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

export default function SocialC() {
  const tx = useT();
  const s = useSocial("instagram");
  const jump = useJump(s.order);
  if (s.order) return <PageShell><div className="px-6 py-14"><SocialOrderView o={s.order} onAgain={s.reset} /></div></PageShell>;
  return (
    <PageShell>
      <div className="mx-auto max-w-6xl px-4 pt-12 sm:px-6">
        <h1 className="text-balance font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-5xl dark:text-white">{tx(socialHeadings.h1)}</h1>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-slate-700 sm:text-lg dark:text-slate-300">{tx(socialHeadings.sub)}</p>
        <div className="mt-5"><Trust items={[tx("No password needed"), tx("Starts in minutes"), tx("Refund if it can't start")]} /></div>
      </div>
      <div id="buy" className="mx-auto mt-10 max-w-6xl scroll-mt-24 px-4 sm:px-6">
        <SocialForm s={s} className="grid grid-cols-[minmax(0,1fr)] gap-x-10 gap-y-10 lg:grid-cols-[minmax(0,1fr)_380px]">
          <section aria-label={tx("Choose")} className={`${card} min-w-0 space-y-8 p-6 sm:p-8`}>
            <PlatformRow s={s} />
            <LinkField s={s} />
            <ServiceRadios s={s} />
            <QuantityPicker s={s} />
            <TierRadios s={s} />
          </section>
          <aside aria-label={tx("Your order")}>
            <div ref={jump.ref} className="lg:sticky lg:top-24">
              <SocialSummary s={s} head={<div className="mb-6"><Preview s={s} /></div>} />
            </div>
          </aside>
        </SocialForm>
      </div>
      <SocialBelow />
      <JumpBar s={s} inView={jump.inView} go={jump.go} />
      <SocialCheckout s={s} />
    </PageShell>
  );
}
