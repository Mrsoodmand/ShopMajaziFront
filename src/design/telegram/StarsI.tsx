"use client";

import { useState, type PointerEvent } from "react";
import { PageShell } from "../otp/parts";
import { AnonToggle, StarAmountInput, StarGlyph, StarsCheckout, TgOrderView, UsernameField, useStars } from "./parts";
import { PackRadios } from "./stars";
import { glassForm, NightPage, StarsBelow, StarsSide } from "./night";

// Stars I — "Gift Card": a gold gift card at the top fills in as you choose (amount, who it's for, from whom). It
// tilts toward the pointer and a light sweeps across it. Username, packs and options below; Buy in the sidebar.

export default function StarsI() {
  const st = useStars();
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  if (st.order) return <PageShell><div className="px-6 py-14"><TgOrderView o={st.order} onAgain={st.reset} /></div></PageShell>;
  const move = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    setTilt({ x: ((e.clientY - r.top) / r.height - 0.5) * -12, y: ((e.clientX - r.left) / r.width - 0.5) * 16 });
  };
  const to = st.r.user?.username;
  return (
    <PageShell>
      <NightPage tone="stars" title="Send Telegram Stars" sub="For yourself or as a gift. See the card update as you choose." art={false} side={<StarsSide st={st} />} below={<StarsBelow st={st} />}>
        <div onPointerMove={move} onPointerLeave={() => setTilt({ x: 0, y: 0 })} className="[perspective:1000px]">
          <div aria-live="polite" className="relative mx-auto aspect-[1.6] w-full max-w-md overflow-hidden rounded-[2rem] bg-[linear-gradient(135deg,#fde68a_0%,#f59e0b_45%,#b45309_100%)] p-6 text-amber-950 shadow-2xl shadow-amber-900/50 transition-transform duration-200 ease-out sm:p-8"
            style={{ transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)` }}>
            <div aria-hidden className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,.35)_1px,transparent_1px)] bg-[size:14px_14px] opacity-40" />
            <span aria-hidden className="pointer-events-none absolute inset-y-0 start-0 w-1/3 animate-shine bg-gradient-to-r from-transparent via-white/50 to-transparent" />
            <div className="relative flex h-full flex-col justify-between">
              <div className="flex items-start justify-between">
                <span className="text-sm font-bold uppercase tracking-widest text-amber-950/70">Telegram Stars</span>
                <StarGlyph className="h-10 w-10 animate-float !fill-white !text-white drop-shadow-[0_0_12px_rgba(255,255,255,.9)]" />
              </div>
              <div>
                <div key={st.amount} className="animate-pop font-display text-5xl font-bold tabular-nums sm:text-6xl">{st.valid ? st.amount.toLocaleString("en-US") : "—"}</div>
                <div className="mt-1 flex flex-wrap justify-between gap-x-4 text-sm font-semibold text-amber-950/80">
                  <span>For {to ? `@${to}` : "…"}</span><span>From {st.anon ? "Anonymous" : "you"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <section aria-label="Choose" className={`${glassForm} space-y-8`}>
          <UsernameField r={st.r} s="stars" label="Who gets the Stars?" />
          <PackRadios st={st} dark />
          <div className="grid gap-5 sm:grid-cols-2"><StarAmountInput st={st} /><div className="sm:pt-7"><AnonToggle st={st} /></div></div>
        </section>
      </NightPage>
      <StarsCheckout st={st} />
    </PageShell>
  );
}
