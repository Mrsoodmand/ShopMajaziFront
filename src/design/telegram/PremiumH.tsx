"use client";

import { useEffect, useState } from "react";
import { Download, Mic, Search, Star, Upload } from "lucide-react";
import { PageShell } from "../otp/parts";
import { glass, PremiumCheckout, ring, TgOrderView, UsernameField, usePremium } from "./parts";
import { PlanRadios } from "./premium";
import { glassForm, NightPage, PremiumBelow, PremiumSide, useWho, WhoRadios } from "./night";

// Premium H — "Before / After": a phone that switches between Telegram Free and Premium on its own (until you use
// the switch): the ad disappears, the star badge and emoji status appear, limits double, voice turns to text.
// The form follows; the profile card with Buy is in the sidebar.

function Phone({ on, name }: { on: boolean; name: string }) {
  const row = "flex items-center gap-3 px-4 py-3";
  return (
    <div className="mx-auto w-full max-w-[300px] overflow-hidden rounded-[2.25rem] border-[8px] border-slate-900 bg-[#0e1621] text-white shadow-2xl shadow-black/50">
      <div className="flex items-center gap-2 bg-[#17212b] px-4 py-3">
        <span aria-hidden className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-sky-400 to-indigo-500 text-sm font-bold">{name.slice(0, 1).toUpperCase()}</span>
        <span className="flex min-w-0 items-center gap-1 font-semibold">
          <span className="truncate">{name}</span>
          <Star aria-hidden className={`h-4 w-4 shrink-0 fill-violet-400 text-violet-400 transition duration-500 ${on ? "scale-100 rotate-0 opacity-100" : "-rotate-90 scale-0 opacity-0"}`} />
          <span aria-hidden className={`transition duration-500 ${on ? "scale-100 opacity-100" : "scale-0 opacity-0"}`}>🦄</span>
        </span>
        <Search aria-hidden className="ms-auto h-4 w-4 text-slate-400" />
      </div>
      <div className={`grid transition-[grid-template-rows] duration-500 ${on ? "grid-rows-[0fr]" : "grid-rows-[1fr]"}`}>
        <div className="overflow-hidden">
          <div className={`${row} bg-sky-500/10`}><span aria-hidden className="grid h-9 w-9 place-items-center rounded-full bg-amber-500 text-xs font-bold">AD</span><span className="min-w-0 text-sm"><span className="block font-semibold">Sponsored</span><span className="block truncate text-slate-400">Buy now, limited offer…</span></span></div>
        </div>
      </div>
      {[["Family", "See you at 8!"], ["Work", "Files attached"]].map(([t, m]) => (
        <div key={t} className={row}><span aria-hidden className="h-9 w-9 rounded-full bg-slate-600" /><span className="min-w-0 text-sm"><span className="block font-semibold">{t}</span><span className="block truncate text-slate-400">{m}</span></span></div>
      ))}
      <div className="space-y-3 border-t border-white/10 p-4 text-xs">
        <div className="flex items-center gap-2"><Mic aria-hidden className="h-4 w-4 text-sky-400" /><span className="flex-1 rounded-full bg-white/10 px-3 py-1.5">{on ? <span className="animate-fade-up [animation-duration:300ms]">&ldquo;Running 5 min late&rdquo;</span> : "▶ ▂▅▃▇▂▅▃ 0:04"}</span></div>
        {([["Upload", Upload, on ? "4 GB" : "2 GB", on ? "100%" : "50%"], ["Download", Download, on ? "Full speed" : "Limited", on ? "100%" : "35%"]] as const).map(([l, I, v, w]) => (
          <div key={l}>
            <div className="flex items-center justify-between"><span className="flex items-center gap-1.5 text-slate-300"><I aria-hidden className="h-3.5 w-3.5" />{l}</span><span className="font-semibold">{v}</span></div>
            <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 transition-[width] duration-700" style={{ width: w }} /></div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function PremiumH() {
  const pm = usePremium();
  const { who, setWho } = useWho(pm);
  const [on, setOn] = useState(false);
  const [auto, setAuto] = useState(true);
  useEffect(() => {
    if (!auto || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => setOn((v) => !v), 2800);
    return () => clearInterval(t);
  }, [auto]);
  if (pm.order) return <PageShell><div className="px-6 py-14"><TgOrderView o={pm.order} onAgain={pm.reset} /></div></PageShell>;
  return (
    <PageShell>
      <NightPage tone="premium" title="See what Premium changes" art={false} side={<PremiumSide pm={pm} who={who} />} below={<PremiumBelow />}>
        <section aria-label="Free and Premium compared" className={`${glass} p-6 sm:p-8`}>
          <div className="flex items-center justify-center gap-3">
            <span className={`font-semibold transition ${on ? "text-white/50" : "text-white"}`}>Free</span>
            <button type="button" role="switch" aria-checked={on} aria-label="Show Premium" onClick={() => { setAuto(false); setOn(!on); }}
              className={`relative h-8 w-14 rounded-full transition-colors ${on ? "bg-gradient-to-r from-violet-500 to-fuchsia-500" : "bg-white/20"} ${ring}`}>
              <span aria-hidden className={`absolute top-1 h-6 w-6 rounded-full bg-white shadow transition-[inset-inline-start] duration-300 ${on ? "start-7" : "start-1"}`} />
            </button>
            <span className={`font-semibold transition ${on ? "text-fuchsia-200" : "text-white/50"}`}>Premium</span>
          </div>
          <div className="mt-6"><Phone on={on} name={pm.r.user?.name ?? "You"} /></div>
          <p aria-live="polite" className="sr-only">{on ? "Premium: no ads, star badge, 4 GB uploads, full download speed, voice to text." : "Free: ads, 2 GB uploads, limited download speed."}</p>
        </section>

        <section aria-label="Choose" className={`${glassForm} space-y-8`}>
          <WhoRadios who={who} setWho={setWho} />
          <UsernameField r={pm.r} s="premium" mine={false} chip={false} label={who === "me" ? "Your username" : "Your friend's username"} hint="We never need a password or login code." />
          <PlanRadios pm={pm} layout="row" legend="Plan" dark />
        </section>
      </NightPage>
      <PremiumCheckout pm={pm} />
    </PageShell>
  );
}
