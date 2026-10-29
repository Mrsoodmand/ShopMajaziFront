"use client";
import { ChevronLeft, MoreVertical } from "lucide-react";
import { useMoney } from "@/lib/money";
import { tgHeadings } from "@/content/telegram-en";
import { PageShell } from "../otp/parts";
import { useHasExtras } from "../service/slot";
import { AnonToggle, Avatar, card, H2, StarAmountInput, StarGlyph, StarsCheckout, TgFaq, TgOrderView, Title, UsernameField, useStars } from "./parts";
import { BuyStars, PackRadios } from "./stars";

// Stars C — "Gift Preview": the form on one side, and on the other a phone showing the chat the receiver will see,
// filling in as you type: their name at the top, the Stars gift bubble with the amount, and your name or "Anonymous".

export default function StarsC() {
  const usd = useMoney().format;
  const st = useStars();
  const extras = useHasExtras();
  if (st.order) return <PageShell><div className="px-6 py-14"><TgOrderView o={st.order} onAgain={st.reset} /></div></PageShell>;
  const u = st.r.user;
  return (
    <PageShell>
      <div className="mx-auto max-w-6xl px-4 pb-24 pt-14 sm:px-6">
        <div className="grid grid-cols-[minmax(0,1fr)] items-start gap-12 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div>
            <Title s="stars" sub="For yourself or as a gift. See exactly what arrives before you pay.">{tgHeadings.stars.h1}</Title>
            <section aria-label="Choose" className={`${card} mt-8 space-y-8 p-6 sm:p-8`}>
              <UsernameField r={st.r} s="stars" label="Who gets the Stars?" />
              <PackRadios st={st} />
              <StarAmountInput st={st} />
              <AnonToggle st={st} />
              <BuyStars st={st} />
            </section>
          </div>

          {/* Phone preview */}
          <div className="lg:sticky lg:top-24">
            <p className="mb-3 text-center text-sm font-semibold text-slate-600 dark:text-slate-400">What they&apos;ll see</p>
            <div aria-live="polite" className="mx-auto w-full max-w-[340px] overflow-hidden rounded-[2.5rem] border-[10px] border-slate-900 bg-[#0e1621] shadow-2xl shadow-slate-900/30 dark:border-slate-700">
              <div className="flex items-center gap-3 bg-[#17212b] px-3 py-3 text-white">
                <ChevronLeft aria-hidden className="h-5 w-5 text-sky-400" />
                {u ? <Avatar u={u} size="sm" /> : <span aria-hidden className="h-8 w-8 rounded-full bg-slate-600" />}
                <span className="min-w-0 flex-1"><span className="block truncate text-sm font-semibold">{u ? u.name : "Receiver"}</span><span className="block text-xs text-slate-400">{u ? `@${u.username}` : "enter a username"}</span></span>
                <MoreVertical aria-hidden className="h-5 w-5 text-slate-400" />
              </div>
              <div className="flex min-h-[420px] flex-col justify-end gap-3 bg-[radial-gradient(circle_at_30%_20%,#1f3a2a_0%,transparent_50%),radial-gradient(circle_at_80%_70%,#1e2f4a_0%,transparent_50%)] p-4">
                <p className="mx-auto rounded-full bg-black/30 px-3 py-1 text-xs text-white/80">Today</p>
                <div className="mx-auto w-56 rounded-3xl bg-black/35 p-5 text-center text-white backdrop-blur">
                  <div className="relative mx-auto grid h-20 w-20 place-items-center">
                    <span aria-hidden className="absolute inset-0 animate-pulse rounded-full bg-amber-400/30 blur-xl" />
                    <StarGlyph className="relative h-16 w-16 drop-shadow-[0_0_20px_rgba(251,191,36,.7)]" />
                  </div>
                  <div className="mt-3 font-display text-2xl font-bold">{st.valid ? st.amount.toLocaleString("en-US") : "—"} Stars</div>
                  <div className="mt-1 text-sm text-white/75">{st.anon ? "Anonymous" : "You"} sent you a gift</div>
                  <div className="mt-4 rounded-full bg-white/15 py-2 text-sm font-semibold">View balance</div>
                </div>
              </div>
            </div>
            <div className="mt-5 flex items-baseline justify-between px-2"><span className="text-slate-600 dark:text-slate-400">Total</span><span className="font-display text-2xl font-bold text-slate-900 dark:text-white">{usd(st.total)}</span></div>
          </div>
        </div>
        {!extras && <section aria-labelledby="faq" className="mt-20 max-w-3xl"><H2 id="faq">Common questions</H2><div className="mt-6"><TgFaq s="stars" /></div></section>}
      </div>
      <StarsCheckout st={st} />
    </PageShell>
  );
}
