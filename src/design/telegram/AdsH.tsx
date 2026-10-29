"use client";

import { AD_TEXT_MAX } from "@/content/telegram-en";
import { AdErrors, AdsNightPage, AudienceFields, bad, CpmBudgetFields, ErrLine, MediaField, OrderCard, Panel, PicToggle, PlacementCards, ScheduleFields, TextCounter, useAdForm, type Ad } from "./adsKit";

// Ads H — "Write in the Post": the ad is written where it will appear. The left side opens on a Telegram channel
// with the sponsored message under a post; its title, text and link are the form fields themselves, and the button
// label fills in from the link. Where, budget and schedule follow. The sidebar skips the preview (the left side is
// the preview) and keeps the estimate, summary and green Continue.

const inBubble = "w-full rounded-lg border border-transparent bg-transparent px-2 py-1.5 text-white placeholder:text-slate-400 hover:border-white/15 focus:border-white/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400";

function ChannelComposer({ ad }: { ad: Ad }) {
  const { p, errors } = ad;
  return (
    <section aria-labelledby={`${p}-compose`} className="overflow-hidden rounded-3xl border border-white/12 bg-[#0e1621] shadow-[0_16px_40px_-20px_rgba(0,0,0,.8)]">
      <h2 id={`${p}-compose`} className="sr-only">Write your ad</h2>
      <div className="flex items-center gap-3 bg-[#17212b] px-5 py-3.5 text-white">
        <span aria-hidden className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 text-sm font-bold">TN</span>
        <span className="min-w-0"><span className="block truncate font-semibold">Tech News Daily</span><span className="block text-xs text-slate-400">128,450 subscribers · example channel</span></span>
      </div>
      <div className="space-y-3 p-4 sm:p-6">
        <div aria-hidden className="max-w-[80%] rounded-2xl rounded-es-md bg-[#182533] px-4 py-3 text-[15px] leading-snug text-slate-300">
          New phones announced this week: here&apos;s what changed.<span className="mt-1 block text-end text-xs text-slate-500">41K views · 12:04</span>
        </div>

        <div className={`max-w-xl rounded-2xl rounded-es-md border-2 bg-[#182533] p-3 sm:p-4 ${ad.ready ? "border-sky-400/50" : "border-dashed border-sky-300/40"}`}>
          <div className="flex items-center justify-between px-2 text-xs font-semibold text-slate-400"><span>Your sponsored message</span><span>Ad</span></div>

          <label htmlFor={`${p}-title`} className="mt-2 block px-2 text-xs font-semibold text-sky-200">Title (optional)</label>
          <input id={`${p}-title`} maxLength={40} value={ad.title} onChange={(e) => ad.setTitle(e.target.value)} placeholder={ad.name} className={`${inBubble} font-semibold !text-[#6ab3f3]`} />

          <div className="mt-2 flex items-end justify-between px-2"><label htmlFor={`${p}-text`} className="text-xs font-semibold text-sky-200">Ad text</label><TextCounter ad={ad} /></div>
          <div className="px-2"><ErrLine id={`${p}-text-error`} msg={errors.text} /></div>
          <textarea id={`${p}-text`} rows={3} value={ad.text} onChange={(e) => ad.setText(e.target.value)} onBlur={() => ad.touch("text")} placeholder="Say what you offer and why to open it."
            aria-invalid={!!errors.text} aria-describedby={errors.text ? `${p}-text-error` : undefined} className={`${inBubble} resize-y text-[15px] leading-snug ${errors.text ? "!border-red-300" : ""}`} />
          {ad.text.length > AD_TEXT_MAX && <p className="px-2 text-xs text-red-300">Only the first {AD_TEXT_MAX} characters are shown.</p>}

          <label htmlFor={`${p}-url`} className="mt-2 block px-2 text-xs font-semibold text-sky-200">Link the button opens</label>
          <p id={`${p}-url-hint`} className="px-2 text-xs text-sky-100/70">A public channel, a bot, or a website starting with https://</p>
          <div className="px-2"><ErrLine id={`${p}-url-error`} msg={errors.url} /></div>
          <input id={`${p}-url`} inputMode="url" spellCheck={false} autoCapitalize="none" value={ad.url} onChange={(e) => ad.setUrl(e.target.value)} onBlur={() => ad.touch("url")} placeholder="t.me/yourchannel"
            aria-invalid={!!errors.url} aria-describedby={[`${p}-url-hint`, errors.url && `${p}-url-error`].filter(Boolean).join(" ")} className={`${inBubble} mt-1 border-white/15 bg-black/20 ${bad(errors.url)}`} />

          <div aria-live="polite" className="mt-3 rounded-lg bg-[#6ab3f3]/10 py-2 text-center text-sm font-semibold text-[#6ab3f3]">{ad.button}<span className="sr-only"> is the button people see</span></div>
        </div>

        <div className="grid gap-3 pt-2 sm:grid-cols-2"><PicToggle ad={ad} /><div className="rounded-2xl border border-white/15 p-4"><MediaField ad={ad} /></div></div>
      </div>
    </section>
  );
}

export default function AdsH() {
  const ad = useAdForm();
  return (
    <AdsNightPage ad={ad} sub="Write your sponsored message right where it will appear. We set up the campaign, so you don't need TON or a Fragment account."
      side={<OrderCard ad={ad} preview={false} />} sideWidth="360px"
      left={<>
        <AdErrors ad={ad} />
        <ChannelComposer ad={ad} />
        <Panel id={`${ad.p}-where`} title="Where to show it"><PlacementCards ad={ad} /><AudienceFields ad={ad} /></Panel>
        <Panel id={`${ad.p}-money`} title="Budget and schedule"><CpmBudgetFields ad={ad} /><ScheduleFields ad={ad} /></Panel>
      </>} />
  );
}
