"use client";
import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { Bot, CalendarDays, Check, CircleHelp, Eye, ImagePlus, Lock, Megaphone, MousePointerClick, Search, Users, X } from "lucide-react";
import CheckoutModal from "@/components/checkout/CheckoutModal";
import { useMoney } from "@/lib/money";
import { AD_MIN_BUDGET, AD_TEXT_MAX, adCountries, adLanguages, fmt, tgHeadings } from "@/content/telegram-en";
import { PageShell } from "../otp/parts";
import { useHasExtras } from "../service/slot";
import { primary } from "../googleVoice/clean";
import { card, field, H2, ring, ServiceIcon, TgFaq, TgOrderView, Trust, useTween } from "./parts";
import { HowItWorks, Rules } from "./ads";
import { ChipInput as KitChipInput, MAX_MEDIA_MB, MIN_CPM, targets, useAdForm, type Ad, type Target } from "./adsKit";
import { useT } from "@/i18n/client";
import { PageH1 } from "@/components/seo/PageHeading";

// Ads G — "Telegram Ads Form", on the plain site page (light and dark theme). Telegram's ad fields, minus the
// optional title and the approve-then-start choice (ads start once approved, or on a chosen date). Where to show
// it as four drawn tiles with the audience field under the chosen one; the ad; a budget block with quick amounts,
// three CPM levels (or your own) and the views it buys; limits and start date. Every field has a help tip.
// The sidebar is sticky on every screen height: the preview shrinks (oldest message first) so the summary and the
// green Continue always stay in view.

// ---------- Help tips ----------

// A small "?" next to a label. Mouse: opens on hover. Touch and keyboard: opens on tap / Enter, closes on Escape,
// a tap elsewhere, or a second tap. The text is read out when it opens. The bubble spans the field's width, so it
// never runs off a phone screen (the field row is the positioned parent).
function Tip({ about, children }: { about: string; children: ReactNode }) {
  const tx = useT();
  const [hover, setHover] = useState(false);
  const [pinned, setPinned] = useState(false);
  const open = hover || pinned;
  const id = useId();
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    if (!open) return;
    const close = () => { setPinned(false); setHover(false); };
    const down = (e: PointerEvent) => { if (!ref.current?.contains(e.target as Node)) close(); };
    const key = (e: KeyboardEvent) => { if (e.key === "Escape") close(); };
    document.addEventListener("pointerdown", down);
    document.addEventListener("keydown", key);
    return () => { document.removeEventListener("pointerdown", down); document.removeEventListener("keydown", key); };
  }, [open]);
  return (
    <span ref={ref} className="inline-flex" onPointerEnter={(e) => e.pointerType === "mouse" && setHover(true)} onPointerLeave={(e) => e.pointerType === "mouse" && setHover(false)}>
      <button type="button" aria-label={tx("About {0}", { 0: about })} aria-expanded={open} aria-controls={id} onClick={() => { if (pinned) { setPinned(false); setHover(false); } else setPinned(true); }}
        className={`grid h-7 w-7 place-items-center rounded-full transition-colors ${open ? "bg-sky-100 text-sky-800 dark:bg-sky-400/15 dark:text-sky-200" : "text-slate-500 hover:bg-slate-100 hover:text-sky-800 dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-sky-200"} ${ring}`}>
        <CircleHelp aria-hidden className="h-[18px] w-[18px]" />
      </button>
      <span id={id} role="status" className={open ? "absolute inset-x-0 top-full z-30 mt-2 max-w-md animate-pop rounded-2xl bg-slate-900 p-4 text-[15px] font-normal leading-relaxed text-slate-100 shadow-[0_12px_32px_-8px_rgba(15,23,42,.45)] dark:bg-[#1c2740] dark:ring-1 dark:ring-white/10" : "sr-only"}>
        {open ? children : null}
      </span>
    </span>
  );
}

const tips = {
  where: <>Where Telegram shows your ad. <b>Channels</b>: under posts in public channels with 1,000+ subscribers. <b>Bots</b>: inside bots and mini apps. <b>Search</b>: at the top of Telegram search. <b>Users</b>: to people in a country or language, wherever they read.</>,
  channels: <>Links of public channels whose readers fit your offer, like <b>t.me/technews</b>. The ad shows only there. 5 to 20 channels on one topic is a good start.</>,
  bots: <>Links of bots or mini apps, like <b>t.me/examplebot</b>. The ad shows to people using them.</>,
  search: <>Words people type in Telegram search, like <b>crypto news</b>. Short, specific words work best.</>,
  country: <>Only people in this country see the ad. Choose Worldwide to reach everyone.</>,
  language: <>The language of their Telegram app. Write your ad text in the same language.</>,
  text: <>Up to {AD_TEXT_MAX} characters of plain text: what you offer and why it&apos;s worth a tap.<span className="mt-2 block rounded-xl bg-white/10 px-3 py-2"><span className="font-semibold text-emerald-300">Good:</span> Daily AI news in 2 minutes. New tools and tips, no hype.</span><span className="mt-2 block">Avoid emoji, ALL CAPS, &quot;click here&quot; and big promises. Telegram rejects these.</span></>,
  url: <>Where the button goes: a public channel (<b>t.me/name</b>), a bot (<b>t.me/namebot</b>) or a website starting with <b>https://</b>. The button text follows the link: View channel, Start bot or Open link.</>,
  media: <>Optional picture or short video above the text.<span className="mt-2 block">We recommend a <b>landscape 16:9</b> image of at least <b>1280 × 720 px</b> (a square 1080 × 1080 also works). JPG, PNG or MP4, up to {MAX_MEDIA_MB} MB. Keep words in the picture few and large.</span></>,
  pic: <>Shows your channel&apos;s profile photo next to its name in the ad. Only for t.me links.</>,
  budget: <>The total you pay now. It&apos;s spent as people see the ad. When the ad stops, what&apos;s left goes back to your wallet.</>,
  cpm: <><b>CPM</b> is the price for 1,000 views. When several ads compete for a place, the higher CPM is shown first: a higher CPM gets views faster, a lower one costs less but may run slowly.<span className="mt-2 block">Budget ÷ CPM × 1,000 ≈ the views you get.</span></>,
  daily: <>The most the ad can spend in one day, so the budget lasts longer.</>,
  perUser: <>How many times a day one person can see your ad. 1 suits most ads; 2 to 4 helps people remember it.</>,
  start: <>The ad starts on this date once Telegram approves it. Without a date it starts as soon as it&apos;s approved, usually within 24 hours.</>,
};

// ---------- Field pieces (site theme) ----------

const hintCls = "text-sm text-slate-600 dark:text-slate-400";
const bad = (e?: string) => (e ? "!border-red-700 dark:!border-red-400" : "");
const dsc = (id: string, hint: boolean, error?: string) => [hint && `${id}-hint`, error && `${id}-error`].filter(Boolean).join(" ") || undefined;
const selOn = "border-sky-600 bg-sky-50 dark:border-sky-400 dark:bg-sky-400/10";
const selOff = "border-slate-200 hover:border-slate-400 dark:border-white/15 dark:hover:border-white/40";
const hasRing = "has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-emerald-600 has-[:focus-visible]:ring-offset-2 dark:has-[:focus-visible]:ring-emerald-400 dark:has-[:focus-visible]:ring-offset-[#0E1424]";
const linkCls = `rounded-lg font-semibold text-sky-800 underline underline-offset-4 hover:text-sky-900 dark:text-sky-300 dark:hover:text-sky-200 ${ring}`;

function ErrLine({ id, msg }: { id?: string; msg?: string }) {
  const tx = useT();
  if (!msg) return null;
  return <p id={id} className="mt-1 flex items-start gap-1.5 text-sm font-semibold text-red-700 dark:text-red-400"><X aria-hidden className="mt-0.5 h-4 w-4 shrink-0" /><span><span className="sr-only">{tx("Error:")}{" "}</span>{msg}</span></p>;
}

// Label, help tip and hint; the row is the tip bubble's positioned parent.
function Head({ id, label, tip, hint, error, side, as = "label" }: { id: string; label: string; tip: ReactNode; hint?: ReactNode; error?: string; side?: ReactNode; as?: "label" | "span" }) {
  const L = as === "label" ? <label htmlFor={id} className="text-base font-semibold text-slate-900 dark:text-white">{label}</label>
    : <span id={`${id}-label`} className="text-base font-semibold text-slate-900 dark:text-white">{label}</span>;
  return (
    <div className="relative">
      <div className="flex items-center justify-between gap-3">
        <span className="flex items-center gap-1">{L}<Tip about={label}>{tip}</Tip></span>
        {side}
      </div>
      {hint && <p id={`${id}-hint`} className={hintCls}>{hint}</p>}
      <ErrLine id={`${id}-error`} msg={error} />
    </div>
  );
}

// Amounts are kept in dollars. In Persian (t.rate set) people type and see Toman; the value is converted both ways.
function Money({ id, value, onChange, onBlur, error, big = false, hint = true }: { id: string; value: number; onChange: (n: number) => void; onBlur: () => void; error?: string; big?: boolean; hint?: boolean }) {
  const tx = useT();
  const rate = tx.rate;
  if (rate) return (
    <div className="relative">
      <input id={id} type="number" inputMode="numeric" min={0} step={1000} value={value ? Math.round(value * rate) : ""} placeholder="0" onChange={(e) => onChange(Number(e.target.value) / rate)} onBlur={onBlur}
        aria-invalid={!!error} aria-describedby={dsc(id, hint, error)} className={`${field} font-semibold tabular-nums ${big ? "py-3.5 pe-20 font-display text-3xl" : "pe-16"} ${bad(error)}`} />
      <span aria-hidden className={`pointer-events-none absolute end-4 top-1/2 -translate-y-1/2 font-semibold text-slate-500 dark:text-slate-400 ${big ? "text-lg" : "text-sm"}`}>{tx("Toman")}</span>
    </div>
  );
  return (
    <div className="relative">
      <span aria-hidden className={`pointer-events-none absolute start-4 top-1/2 -translate-y-1/2 font-semibold text-slate-500 dark:text-slate-400 ${big ? "font-display text-2xl" : ""}`}>$</span>
      <input id={id} type="number" inputMode="decimal" min={0} step="0.01" value={value || ""} placeholder="0.00" onChange={(e) => onChange(Number(e.target.value))} onBlur={onBlur}
        aria-invalid={!!error} aria-describedby={dsc(id, hint, error)} className={`${field} font-semibold tabular-nums ${big ? "py-3.5 ps-10 font-display text-3xl" : "ps-8"} ${bad(error)}`} />
    </div>
  );
}

// ---------- 1 · Where ----------

// Small drawings of where the ad lands (decorative).
function Scene({ t, on }: { t: Target; on: boolean }) {
  const adc = `rounded-[5px] ${on ? "bg-sky-500" : "bg-sky-500/55 dark:bg-sky-400/50"}`;
  const ln = "h-1.5 rounded-full bg-slate-300 dark:bg-white/20";
  const bub = "rounded-md bg-white dark:bg-[#182533]";
  return (
    <span aria-hidden className="block h-[72px] overflow-hidden rounded-xl bg-slate-100 p-2.5 dark:bg-[#0e1621]">
      {t === "channels" && <span className="flex h-full flex-col justify-end gap-1.5"><span className={`w-4/5 space-y-1 p-1.5 ${bub}`}><span className={`block w-full ${ln}`} /><span className={`block w-2/3 ${ln}`} /></span><span className={`block h-5 w-4/5 ${adc}`} /></span>}
      {t === "bots" && <span className="flex h-full flex-col gap-1.5"><span className="flex items-center gap-1.5"><span className="h-3.5 w-3.5 rounded-full bg-violet-400/80" /><span className={`block w-10 ${ln}`} /></span><span className={`block h-5 w-3/4 ${adc}`} /><span className="ms-auto block w-1/2 rounded-md bg-sky-200 p-1.5 dark:bg-[#2b5278]"><span className={`block ${ln}`} /></span></span>}
      {t === "search" && <span className="flex h-full flex-col gap-1.5"><span className="block h-3.5 rounded-full bg-slate-300 dark:bg-black/40" /><span className={`flex h-5 items-center gap-1.5 px-1.5 ${adc}`}><span className="h-3 w-3 rounded-full bg-white/80" /><span className="block h-1.5 w-1/2 rounded-full bg-white/80" /></span><span className="flex items-center gap-1.5 px-1.5"><span className="h-3 w-3 rounded-full bg-slate-300 dark:bg-white/15" /><span className={`block w-1/3 ${ln}`} /></span></span>}
      {t === "users" && <span className="grid h-full grid-cols-7 place-items-center">{Array.from({ length: 14 }, (_, i) => <span key={i} className={`h-3.5 w-3.5 rounded-full ${[1, 2, 5, 8, 9, 12].includes(i) ? (on ? "bg-sky-500" : "bg-sky-500/55 dark:bg-sky-400/50") : "bg-slate-300 dark:bg-white/15"}`} />)}</span>}
    </span>
  );
}

const tileIcon: Record<Target, typeof Megaphone> = { channels: Megaphone, bots: Bot, search: Search, users: Users };

function WherePanel({ ad }: { ad: Ad }) {
  const tx = useT();
  const name = useId();
  const { p, target, errors } = ad;
  const t = tx.tr(targets).find((x) => x.id === target)!;
  return (
    <section aria-labelledby={`${p}-s1`} className={`${card} p-6 sm:p-8`}>
      <div className="relative flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
        <span className="flex items-center gap-1"><H2 id={`${p}-s1`} className="text-xl">{tx("Where to show it")}</H2><Tip about={tx("where to show it")}>{tips.where}</Tip></span>
        <span className="flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-sm font-medium text-amber-900 dark:bg-amber-400/10 dark:text-amber-200"><Lock aria-hidden className="h-3.5 w-3.5" />{tx("Can't be changed later")}</span>
      </div>

      <fieldset className="mt-5">
        <legend className="sr-only">{tx("Where to show the ad")}</legend>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {tx.tr(targets).map((x) => {
            const on = target === x.id;
            const I = tileIcon[x.id];
            return (
              <label key={x.id} className={`relative flex cursor-pointer flex-col gap-2.5 rounded-2xl border-2 p-2.5 transition-colors ${tx.tr(hasRing)} ${on ? selOn : selOff}`}>
                <input type="radio" name={name} checked={on} onChange={() => ad.setTarget(x.id)} className="sr-only" />
                <Scene t={x.id} on={on} />
                <span className="flex items-center justify-between gap-2 px-1 pb-0.5">
                  <span className="flex items-center gap-2 font-semibold text-slate-900 dark:text-white"><I aria-hidden className={`h-4 w-4 ${on ? "text-sky-700 dark:text-sky-300" : "text-slate-500 dark:text-slate-400"}`} />{x.label}</span>
                  <span aria-hidden className={`grid h-5 w-5 place-items-center rounded-full border-2 ${on ? "border-sky-600 bg-sky-600 dark:border-sky-400 dark:bg-sky-400" : "border-slate-300 dark:border-white/30"}`}>{on && <Check className="h-3 w-3 text-white dark:text-sky-950" strokeWidth={3} />}</span>
                </span>
              </label>
            );
          })}
        </div>
      </fieldset>

      {/* The chosen tile's audience, in a well joined to the choice. */}
      <div key={target} className="mt-4 animate-pop rounded-2xl bg-slate-50 p-5 dark:bg-white/[.04]">
        <p className={`mb-4 ${hintCls}`}><span className="font-semibold text-slate-900 dark:text-white">{t.label}:</span> {t.hint.toLowerCase()}.</p>
        {target === "users" ? (
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Head id={`${p}-country`} label={tx("Country")} tip={tips.country} />
              <select id={`${p}-country`} value={ad.country} onChange={(e) => ad.setCountry(e.target.value)} className={`${field} appearance-auto`}>{tx.tr(adCountries).map((x) => <option key={x}>{x}</option>)}</select>
            </div>
            <div className="space-y-2">
              <Head id={`${p}-lang`} label={tx("Language")} tip={tips.language} />
              <select id={`${p}-lang`} value={ad.language} onChange={(e) => ad.setLanguage(e.target.value)} className={`${field} appearance-auto`}>{tx.tr(adLanguages).map((x) => <option key={x}>{x}</option>)}</select>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <Head id={`${p}-target`} label={target === "channels" ? tx("Which channels?") : target === "bots" ? tx("Which bots?") : tx("Which search words?")} tip={tips[target]}
              hint={target === "search" ? tx("Press Enter after each word.") : tx("Paste a t.me link and press Enter. Add as many as you like.")} />
            <ChipInput key={target} id={`${p}-target`} values={ad.list[target]} error={errors.target} describedBy={`${p}-target-hint`}
              onChange={(v) => { ad.setList((l) => ({ ...l, [target]: v })); ad.touch("target"); }}
              placeholder={target === "search" ? tx("e.g. crypto news") : `t.me/${target === "bots" ? "examplebot" : "technews"}`}
              check={target === "search" ? (v) => (v.length > 40 ? tx("Keep each search word under 40 characters") : undefined) : (v) => (/^(https?:\/\/)?t\.me\/[a-zA-Z][a-zA-Z0-9_]{4,31}\/?$/i.test(v) ? undefined : tx("Enter a link like t.me/name"))} />
          </div>
        )}
      </div>
    </section>
  );
}

const ChipInput = (props: Parameters<typeof KitChipInput>[0]) => <KitChipInput {...props} site />;

// ---------- 2 · Your ad ----------

function AdPanel({ ad }: { ad: Ad }) {
  const tx = useT();
  const { p, errors, media } = ad;
  const left = tx.tr(AD_TEXT_MAX) - ad.text.length;
  return (
    <section aria-labelledby={`${p}-s2`} className={`${card} space-y-6 p-6 sm:p-8`}>
      <H2 id={`${p}-s2`} className="text-xl">{tx("Your ad")}</H2>
      <div className="space-y-2">
        <Head id={`${p}-text`} label={tx("Ad text")} tip={tips.text} hint={tx("What you offer and why it's worth a tap.")} error={errors.text}
          side={<span aria-live="polite" className={`text-sm tabular-nums ${left < 0 ? "font-semibold text-red-700 dark:text-red-400" : left < 20 ? "text-amber-700 dark:text-amber-300" : "text-slate-500 dark:text-slate-400"}`}>{left}<span className="sr-only">{" "}{tx("characters left")}</span></span>} />
        <textarea id={`${p}-text`} rows={3} value={ad.text} onChange={(e) => ad.setText(e.target.value)} onBlur={() => ad.touch("text")} placeholder={tx("e.g. Daily AI news in 2 minutes. New tools and tips, no hype.")}
          aria-invalid={!!errors.text} aria-describedby={dsc(`${p}-text`, true, errors.text)} className={`${field} resize-y ${bad(errors.text)}`} />
      </div>
      <div className="space-y-2">
        <Head id={`${p}-url`} label={tx("Link")} tip={tips.url} hint={tx("A public channel, a bot, or a website starting with https://")} error={errors.url} />
        <input id={`${p}-url`} inputMode="url" spellCheck={false} autoCapitalize="none" value={ad.url} onChange={(e) => ad.setUrl(e.target.value)} onBlur={() => ad.touch("url")} placeholder={tx("t.me/yourchannel")}
          aria-invalid={!!errors.url} aria-describedby={dsc(`${p}-url`, true, errors.url)} className={`${field} ${bad(errors.url)}`} />
      </div>

      <div className="space-y-2">
        <Head id={`${p}-media`} as="span" label={tx("Picture or video (optional)")} tip={tips.media} hint={tx("Landscape 16:9, at least 1280 × 720 px. Up to {0} MB.", { 0: MAX_MEDIA_MB })} error={ad.mediaErr} />
        <input ref={ad.fileRef} type="file" accept="image/jpeg,image/png,video/mp4" className="sr-only" tabIndex={-1} aria-hidden onChange={(e) => { ad.onFile(e.target.files?.[0]); e.target.value = ""; }} />
        {media ? (
          <div className="flex items-center gap-3 rounded-2xl border border-slate-300 p-3 dark:border-white/20">
            {media.type.startsWith("image") ? <img src={media.src} alt="" className="h-14 w-24 rounded-xl object-cover" /> : <video src={media.src} muted className="h-14 w-24 rounded-xl object-cover" />}
            <span className="min-w-0 flex-1 truncate font-medium text-slate-900 dark:text-white">{media.name}</span>
            <button type="button" onClick={() => ad.setMedia(null)} className={`rounded-lg px-3 py-1.5 text-sm font-semibold text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10 ${ring}`}>{tx("Remove")}</button>
          </div>
        ) : (
          <button id={`${p}-media`} type="button" onClick={() => ad.fileRef.current?.click()} aria-labelledby={`${p}-media-label`} aria-describedby={dsc(`${p}-media`, true, ad.mediaErr)}
            className={`flex w-full items-center gap-4 rounded-2xl border-2 border-dashed border-slate-300 p-4 text-start transition-colors hover:border-sky-500 hover:bg-sky-50 dark:border-white/20 dark:hover:border-sky-400 dark:hover:bg-sky-400/5 ${ring}`}>
            <span aria-hidden className="grid h-14 w-24 shrink-0 place-items-center rounded-xl bg-slate-100 text-sky-700 dark:bg-white/5 dark:text-sky-300"><ImagePlus className="h-6 w-6" /></span>
            <span><span className="block font-semibold text-slate-900 dark:text-white">{tx("Upload picture or video")}</span><span className={hintCls}>{tx("JPG, PNG or MP4")}</span></span>
          </button>
        )}
      </div>

      <div className={`relative flex items-start gap-3 rounded-2xl border border-slate-200 p-4 dark:border-white/15 ${ad.isTg ? "" : "opacity-60"}`}>
        <input id={`${p}-pic`} type="checkbox" checked={ad.showPic && ad.isTg} disabled={!ad.isTg} onChange={(e) => ad.setShowPic(e.target.checked)} className={`mt-1 h-5 w-5 accent-sky-600 ${ring}`} />
        <span className="min-w-0 flex-1"><label htmlFor={`${p}-pic`} className={`block font-semibold text-slate-900 dark:text-white ${ad.isTg ? "cursor-pointer" : ""}`}>{tx("Show channel picture")}</label><span className={hintCls}>{ad.isTg ? tx("Your channel's photo next to its name.") : tx("Only for t.me links.")}</span></span>
        <Tip about={tx("channel picture")}>{tips.pic}</Tip>
      </div>
    </section>
  );
}

// ---------- 3 · Budget ----------

const quick = [50, 100, 250, 500, 1000];
const levels = [
  { id: "low", cpm: 1, label: "Low", hint: "Cheaper views, may run slowly" },
  { id: "std", cpm: 2.5, label: "Standard", hint: "What most ads use" },
  { id: "high", cpm: 4, label: "High", hint: "Shown first, fills faster" },
] as const;

function TweenNum({ value }: { value: number }) {
  const v = useTween(value);
  return <><span aria-hidden>{fmt(Math.round(v))}</span><span className="sr-only">{fmt(value)}</span></>;
}

function BudgetPanel({ ad }: { ad: Ad }) {
  const usd = useMoney().format;
  const tx = useT();
  const { p, errors } = ad;
  const cpmName = useId();
  const preset = tx.tr(levels).find((l) => l.cpm === ad.cpm);
  const [custom, setCustom] = useState(false);
  const isCustom = custom || !preset;
  return (
    <section aria-labelledby={`${p}-s3`} className={`${card} p-6 sm:p-8`}>
      <H2 id={`${p}-s3`} className="text-xl">{tx("Budget")}</H2>

      <div className="mt-6 grid gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <div className="space-y-2">
          <Head id={`${p}-budget`} label={tx("Total budget")} tip={tips.budget} hint={tx("From {0}. Unspent money is refunded.", { 0: usd(AD_MIN_BUDGET) })} error={errors.budget} />
          <Money id={`${p}-budget`} big value={ad.budget} onChange={ad.setBudget} onBlur={() => ad.touch("budget")} error={errors.budget} />
          <div role="group" aria-label={tx("Quick amounts")} className="flex flex-wrap gap-2 pt-1">
            {quick.map((v) => {
              const on = ad.budget === v;
              return <button key={v} type="button" aria-pressed={on} onClick={() => ad.setBudget(v)} className={`rounded-full border px-3.5 py-1.5 text-sm font-semibold tabular-nums transition-colors ${on ? "border-sky-600 bg-sky-600 text-white dark:border-sky-400 dark:bg-sky-400 dark:text-sky-950" : "border-slate-300 text-slate-800 hover:border-slate-500 dark:border-white/20 dark:text-slate-200 dark:hover:border-white/50"} ${ring}`}>{usd(v).replace(".00", "")}</button>;
            })}
          </div>
        </div>

        <fieldset className="relative" aria-labelledby={`${p}-cpm-set-label`}>
          <Head id={`${p}-cpm-set`} as="span" label={tx("Price per 1,000 views (CPM)")} tip={tips.cpm} />
          <div className="mt-2 grid gap-2">
            {tx.tr(levels).map((l) => {
              const on = !isCustom && preset?.id === l.id;
              return (
                <label key={l.id} className={`flex cursor-pointer items-center gap-3 rounded-2xl border-2 px-4 py-2.5 transition-colors ${tx.tr(hasRing)} ${on ? selOn : selOff}`}>
                  <input type="radio" name={cpmName} checked={on} onChange={() => { setCustom(false); ad.setCpm(l.cpm); }} className="sr-only" />
                  <span aria-hidden className={`grid h-5 w-5 shrink-0 place-items-center rounded-full border-2 ${on ? "border-sky-600 bg-sky-600 dark:border-sky-400 dark:bg-sky-400" : "border-slate-400"}`}>{on && <Check className="h-3 w-3 text-white dark:text-sky-950" strokeWidth={3} />}</span>
                  <span className="min-w-0 flex-1"><span className="block font-semibold text-slate-900 dark:text-white">{l.label}</span><span className="block text-sm text-slate-600 dark:text-slate-400">{l.hint}</span></span>
                  <span className="font-display font-bold tabular-nums text-slate-900 dark:text-white">{usd(l.cpm)}</span>
                </label>
              );
            })}
            <label className={`flex cursor-pointer flex-wrap items-center gap-3 rounded-2xl border-2 px-4 py-2.5 transition-colors ${tx.tr(hasRing)} ${isCustom ? selOn : selOff}`}>
              <input type="radio" name={cpmName} checked={isCustom} onChange={() => setCustom(true)} className="sr-only" />
              <span aria-hidden className={`grid h-5 w-5 shrink-0 place-items-center rounded-full border-2 ${isCustom ? "border-sky-600 bg-sky-600 dark:border-sky-400 dark:bg-sky-400" : "border-slate-400"}`}>{isCustom && <Check className="h-3 w-3 text-white dark:text-sky-950" strokeWidth={3} />}</span>
              <span className="flex-1 font-semibold text-slate-900 dark:text-white">{tx("My own")}</span>
            </label>
            {isCustom && (
              <div className="ps-1">
                <label htmlFor={`${p}-cpm`} className="sr-only">{tx("Your CPM in dollars")}</label>
                <p id={`${p}-cpm-hint`} className={hintCls}>{tx("From")}{" "}{usd(MIN_CPM)}.</p>
                <ErrLine id={`${p}-cpm-error`} msg={errors.cpm} />
                <div className="mt-1.5 max-w-[12rem]"><Money id={`${p}-cpm`} value={ad.cpm} onChange={ad.setCpm} onBlur={() => ad.touch("cpm")} error={errors.cpm} /></div>
              </div>
            )}
          </div>
        </fieldset>
      </div>

      {/* What the money buys. */}
      <div aria-live="polite" className="mt-6 flex flex-wrap items-center gap-x-8 gap-y-3 rounded-2xl bg-sky-50 px-5 py-4 dark:bg-sky-400/10">
        <span className="flex items-center gap-2.5"><Eye aria-hidden className="h-5 w-5 text-sky-700 dark:text-sky-300" /><span><span className="block font-display text-2xl font-bold tabular-nums text-slate-900 dark:text-white">~<TweenNum value={ad.views} /></span><span className={hintCls}>{tx("views")}</span></span></span>
        <span className="flex items-center gap-2.5"><MousePointerClick aria-hidden className="h-5 w-5 text-sky-700 dark:text-sky-300" /><span><span className="block font-display text-2xl font-bold tabular-nums text-slate-900 dark:text-white"><TweenNum value={ad.lo} />–<TweenNum value={ad.hi} /></span><span className={hintCls}>{tx("clicks")}</span></span></span>
        <span className={`text-sm tabular-nums ${hintCls}`}>{usd(ad.budget || 0)} ÷ {usd(ad.cpm || 0)}{" "}{tx("× 1,000 views. An estimate.")}</span>
      </div>

      <div className="mt-5">
        <button type="button" onClick={() => { ad.setDailyOn(!ad.dailyOn); ad.setDaily(0); }} aria-expanded={ad.dailyOn} aria-controls={`${p}-daily-wrap`} className={linkCls}>{ad.dailyOn ? tx("Remove daily limit") : tx("Set a daily limit")}</button>
        <div id={`${p}-daily-wrap`} hidden={!ad.dailyOn} className="mt-3 max-w-xs space-y-2">
          {ad.dailyOn && <><Head id={`${p}-daily`} label={tx("Daily limit")} tip={tips.daily} hint={tx("The most it can spend in one day.")} error={errors.daily} /><Money id={`${p}-daily`} value={ad.daily} onChange={ad.setDaily} onBlur={() => ad.touch("daily")} error={errors.daily} /></>}
        </div>
      </div>
    </section>
  );
}

// ---------- 4 · Schedule ----------

function SchedulePanel({ ad }: { ad: Ad }) {
  const tx = useT();
  const { p, errors } = ad;
  const perName = useId();
  return (
    <section aria-labelledby={`${p}-s4`} className={`${card} space-y-6 p-6 sm:p-8`}>
      <H2 id={`${p}-s4`} className="text-xl">{tx("Schedule")}</H2>
      <fieldset className="relative" aria-labelledby={`${p}-per-label`} aria-describedby={`${p}-per-hint`}>
        <Head id={`${p}-per`} as="span" label={tx("Views per person a day")} tip={tips.perUser} hint={tx("How many times one person can see it in a day.")} />
        <div className="mt-2 grid max-w-md grid-cols-4 gap-2">
          {[1, 2, 3, 4].map((n) => (
            <label key={n} className={`cursor-pointer rounded-xl border-2 py-2.5 text-center font-semibold tabular-nums text-slate-900 transition-colors dark:text-white ${tx.tr(hasRing)} ${ad.perUser === n ? selOn : selOff}`}>
              <input type="radio" name={perName} checked={ad.perUser === n} onChange={() => ad.setPerUser(n)} className="sr-only" />{n}
            </label>
          ))}
        </div>
      </fieldset>
      <div>
        <button type="button" onClick={() => { ad.setStartOn(!ad.startOn); ad.setStart(""); }} aria-expanded={ad.startOn} aria-controls={`${p}-start-wrap`} className={`flex items-center gap-1.5 ${linkCls}`}>
          <CalendarDays aria-hidden className="h-4 w-4" />{ad.startOn ? tx("Start as soon as it's approved") : tx("Choose a start date")}
        </button>
        {!ad.startOn && <p className={`mt-1 ${hintCls}`}>{tx("Otherwise it starts once Telegram approves it, usually within 24 hours.")}</p>}
        <div id={`${p}-start-wrap`} hidden={!ad.startOn} className="mt-3 max-w-xs space-y-2">
          {ad.startOn && <><Head id={`${p}-start`} label={tx("Start date")} tip={tips.start} error={errors.start} /><input id={`${p}-start`} type="date" min={ad.today} value={ad.start} onChange={(e) => ad.setStart(e.target.value)} onBlur={() => ad.touch("start")} aria-invalid={!!errors.start} aria-describedby={dsc(`${p}-start`, false, errors.start)} className={`${field} ${bad(errors.start)}`} /></>}
        </div>
      </div>
    </section>
  );
}

// ---------- Sidebar ----------

// Telegram's own light and dark chat colours.
const tg = {
  bg: "bg-[#cfdfc0] dark:bg-[#0e1621]", head: "bg-white dark:bg-[#17212b]", bubble: "bg-white dark:bg-[#182533]",
  name: "text-[#168acd] dark:text-[#6ab3f3]", btn: "bg-[#168acd]/10 text-[#168acd] dark:bg-[#6ab3f3]/10 dark:text-[#6ab3f3]", meta: "text-slate-500 dark:text-slate-400",
};

function Bubble({ ad }: { ad: Ad }) {
  const tx = useT();
  return (
    <div key={ad.ready ? "ready" : "draft"} className={`max-w-[90%] shrink-0 overflow-hidden rounded-2xl rounded-es-md ${tg.bubble} text-[14px] leading-snug text-slate-900 shadow-[0_1px_1px_rgba(0,0,0,.08)] dark:text-slate-100 ${ad.ready ? "animate-arrive" : ""}`}>
      {ad.media && (ad.media.type.startsWith("image") ? <img src={ad.media.src} alt="" className="aspect-video max-h-36 w-full object-cover" /> : <video src={ad.media.src} muted autoPlay loop playsInline className="aspect-video max-h-36 w-full object-cover" />)}
      <div className="px-3.5 py-2.5">
        <span className="flex items-center justify-between gap-3">
          <span className="flex min-w-0 items-center gap-2">
            {ad.showPic && ad.isTg && <span aria-hidden className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-gradient-to-br from-sky-400 to-indigo-500 text-[11px] font-bold text-white">{ad.name.slice(0, 1).toUpperCase()}</span>}
            <span className={`truncate font-semibold ${tg.name}`}>{ad.name}</span>
          </span>
          <span className={`text-[11px] font-medium ${tg.meta}`}>{tx("Ad")}</span>
        </span>
        <span className={`mt-1 block whitespace-pre-wrap break-words ${ad.text.trim() ? "" : tg.meta}`}>{ad.text.trim() ? ad.text.slice(0, tx.tr(AD_TEXT_MAX)) : tx("Your ad text appears here.")}</span>
        <span className={`mt-2.5 block rounded-lg py-2 text-center text-sm font-semibold ${tg.btn}`}>{ad.button}</span>
      </div>
    </div>
  );
}

// The preview shrinks on short screens: older messages are cut first, the ad stays whole.
function Preview({ ad }: { ad: Ad }) {
  const tx = useT();
  const t = ad.target;
  return (
    <figure aria-label={tx("Ad preview")} className={`flex min-h-0 flex-initial flex-col overflow-hidden rounded-3xl border border-slate-200 dark:border-white/10 ${tg.bg}`}>
      {t === "search" ? (
        <>
          <div className={`shrink-0 ${tg.head} px-4 py-3`}><div className={`flex items-center gap-2 rounded-full bg-slate-100 px-3 py-2 text-sm dark:bg-black/25 ${tg.meta}`}><Search aria-hidden className="h-4 w-4" />{ad.list.search[0] ?? tx("crypto news")}</div></div>
          <ul key={t} className={`min-h-0 flex-initial animate-fade-up divide-y divide-slate-100 overflow-hidden [animation-duration:450ms] dark:divide-white/5 ${tg.head}`}>
            <li className="flex items-start gap-3 bg-sky-50 px-4 py-3 dark:bg-[#6ab3f3]/[.06]">
              <span aria-hidden className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gradient-to-br from-sky-400 to-indigo-500 font-bold text-white">{ad.name.slice(0, 1).toUpperCase()}</span>
              <span className="min-w-0 flex-1">
                <span className="flex items-center justify-between gap-2"><span className={`truncate text-sm font-semibold ${tg.name}`}>{ad.name}</span><span className="rounded bg-slate-200 px-1.5 text-[10px] font-semibold text-slate-700 dark:bg-white/10 dark:text-slate-300">{tx("Ad")}</span></span>
                <span className={`line-clamp-2 text-[13px] ${ad.text.trim() ? "text-slate-800 dark:text-slate-200" : tg.meta}`}>{ad.text.trim() || tx("Your ad text appears here.")}</span>
              </span>
            </li>
            {[[tx("Daily Markets"), tx("214K subscribers")], [tx("Coin Digest"), tx("88K subscribers")]].map(([n, s]) => (
              <li key={n} className="flex items-center gap-3 px-4 py-3"><span aria-hidden className="h-10 w-10 shrink-0 rounded-full bg-slate-200 dark:bg-white/10" /><span><span className="block text-sm font-semibold text-slate-900 dark:text-slate-100">{n}</span><span className={`block text-[13px] ${tg.meta}`}>{s}</span></span></li>
            ))}
          </ul>
        </>
      ) : (
        <>
          <div className={`flex shrink-0 items-center gap-3 ${tg.head} px-4 py-3 text-slate-900 dark:text-white`}>
            <span aria-hidden className={`grid h-9 w-9 place-items-center rounded-full text-sm font-bold text-white ${t === "bots" ? "bg-[#e17076]" : "bg-gradient-to-br from-emerald-400 to-teal-600"}`}>{t === "bots" ? <Bot className="h-4 w-4" /> : "TN"}</span>
            <span className="min-w-0"><span className="block truncate text-sm font-semibold">{t === "bots" ? tx("Weather Bot") : tx("Tech News Daily")}</span><span className={`block text-xs ${tg.meta}`}>{t === "bots" ? "bot" : tx("128,450 subscribers")}</span></span>
          </div>
          <div key={t} className="flex min-h-0 flex-initial animate-fade-up flex-col justify-end gap-2 overflow-hidden p-4 [animation-duration:450ms]">
            <div className={`max-w-[85%] shrink rounded-2xl rounded-es-md ${tg.bubble} px-3.5 py-2.5 text-[14px] leading-snug text-slate-800 shadow-[0_1px_1px_rgba(0,0,0,.08)] dark:text-slate-200`}>
              {t === "bots" ? tx("Tomorrow in Berlin: 14° and light rain.") : tx("New phones announced this week: here's what changed.")}
              <span className={`mt-1 block text-end text-[11px] ${tg.meta}`}>{t === "bots" ? "09:12" : tx("41K views · 12:04")}</span>
            </div>
            <div aria-live="polite" className="shrink-0"><Bubble ad={ad} /></div>
          </div>
        </>
      )}
      <figcaption className="sr-only">{t === "search" ? tx("Your ad as the first search result") : t === "bots" ? tx("Your ad inside a bot chat") : tx("Your ad as a sponsored message under a channel post")}</figcaption>
    </figure>
  );
}

function OrderCard({ ad }: { ad: Ad }) {
  const usd = useMoney().format;
  const tx = useT();
  const sample = usePathname()?.startsWith("/design") ?? false;
  const blocker = ad.submitted && ad.errList.length ? tx("Fix {0} above to continue", { 0: ad.errList.length === 1 ? tx("1 thing") : tx("{0} things", { 0: ad.errList.length }) }) : "";
  return (
    <section aria-labelledby={`${ad.p}-order`} className={`${card} shrink-0 p-6`}>
      <h2 id={`${ad.p}-order`} className="font-display text-lg font-semibold text-slate-900 dark:text-white">{tx("Your ad")}</h2>
      <dl className="mt-1 divide-y divide-slate-200 text-[15px] dark:divide-white/10">
        {([[tx("Shown in"), ad.placement.label], [tx("Audience"), ad.reach || "—"], [tx("Views"), `~${fmt(ad.views)}`], [tx("Starts"), ad.startsLabel]] as const).map(([k, v]) => (
          <div key={k} className="flex justify-between gap-4 py-2"><dt className="shrink-0 text-slate-600 dark:text-slate-400">{k}</dt><dd className="min-w-0 truncate text-end font-medium tabular-nums text-slate-900 dark:text-white">{v}</dd></div>
        ))}
      </dl>
      <div aria-live="polite" className="mt-1 flex items-baseline justify-between border-t border-slate-200 pt-3 dark:border-white/10"><span className="text-slate-600 dark:text-slate-400">{tx("Budget")}</span><span className="font-display text-2xl font-bold tabular-nums text-slate-900 dark:text-white">{usd(ad.budget || 0)}</span></div>
      <button type="submit" className={`${primary} mt-4 w-full tabular-nums`}>{tx("Continue ·")}{" "}{usd(ad.budget || 0)}</button>
      <p role="status" className="mt-2.5 text-center text-sm font-semibold text-red-700 empty:hidden dark:text-red-400">{blocker}</p>
      <p className="mt-2.5 text-center text-sm text-slate-600 dark:text-slate-400">{tx("Wallet, card or crypto next. Refunded if rejected.")}</p>
      {sample && <p className="mt-1 text-center text-xs text-slate-500 dark:text-slate-400">{tx("Sample prices and estimates (design preview)")}</p>}
    </section>
  );
}

// ---------- Page ----------

export default function AdsG() {
  const usd = useMoney().format;
  const tx = useT();
  const ad = useAdForm({ status: "active" });
  const extras = useHasExtras();
  const sideRef = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = sideRef.current?.querySelector("button[type=submit]");
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.5 });
    io.observe(el);
    return () => io.disconnect();
  }, [ad.c.order]);

  if (ad.c.order) return <PageShell><div className="px-6 py-14"><TgOrderView o={ad.c.order} onAgain={ad.c.reset} /></div></PageShell>;
  const go = () => { const b = sideRef.current?.querySelector<HTMLButtonElement>("button[type=submit]"); b?.scrollIntoView({ behavior: "smooth", block: "center" }); b?.focus({ preventScroll: true }); };

  return (
    <PageShell>
      <div className="mx-auto max-w-6xl px-4 pb-28 pt-14 sm:px-6">
        <h1 className="text-balance font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-5xl dark:text-white"><PageH1 text={tx("Create a Telegram ad")} /></h1>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-slate-700 sm:mt-4 sm:text-lg dark:text-slate-300">{tx.tr(tgHeadings).ads.sub}</p>
        <div className="mt-6"><Trust items={[tx("No TON or Fragment needed"), tx("Refund if rejected"), tx("Stop any time")]} /></div>

        <form noValidate onSubmit={(e) => { e.preventDefault(); ad.proceed(); }} className="mt-10 grid grid-cols-[minmax(0,1fr)] gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="min-w-0 space-y-6">
            {ad.submitted > 0 && ad.errList.length > 0 && (
              <div ref={ad.summaryRef} tabIndex={-1} role="alert" className="rounded-2xl border-2 border-red-700 bg-red-50 p-5 outline-none dark:border-red-400 dark:bg-red-500/10">
                <h2 className="font-display text-lg font-semibold text-slate-900 dark:text-white">{tx("Please fix")}{" "}{ad.errList.length === 1 ? "this" : tx("these {0} things", { 0: ad.errList.length })}</h2>
                <ul className="mt-2 space-y-1">{ad.errList.map(([k, m]) => <li key={k}><a href={`#${ad.ids[k]}`} onClick={(e) => { e.preventDefault(); document.getElementById(ad.ids[k])?.focus(); }} className={`font-semibold text-red-800 underline underline-offset-2 dark:text-red-300 ${ring}`}>{m}</a></li>)}</ul>
              </div>
            )}
            <WherePanel ad={ad} />
            <AdPanel ad={ad} />
            <BudgetPanel ad={ad} />
            <SchedulePanel ad={ad} />
          </div>

          {/* Sticky on every screen height: capped to the window, the preview gives up space first. */}
          <aside ref={sideRef} aria-label={tx("Preview and order")} className="flex flex-col gap-4 lg:sticky lg:top-24 lg:max-h-[calc(100dvh-7rem)] lg:self-start">
            <Preview ad={ad} />
            <OrderCard ad={ad} />
          </aside>
        </form>

        <section aria-labelledby={`${ad.p}-how`} className="mt-20"><H2 id={`${ad.p}-how`}>{tx("How it works")}</H2><div className="mt-6"><HowItWorks /></div></section>
        <div className="mt-10 max-w-3xl"><Rules /></div>
        {!extras && <section aria-labelledby={`${ad.p}-faq`} className="mt-16 max-w-3xl"><H2 id={`${ad.p}-faq`}>{tx("Common questions")}</H2><div className="mt-6"><TgFaq s="ads" /></div></section>}
      </div>

      {/* Phones: the summary sits below the form, so a bar shows the budget and jumps to Continue. */}
      <div className={`fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white px-4 py-3 shadow-[0_-8px_24px_-12px_rgba(0,0,0,.25)] transition-transform duration-300 dark:border-white/10 dark:bg-[#0E1424] lg:hidden ${inView ? "translate-y-full" : "translate-y-0"}`} aria-hidden={inView} inert={inView}>
        <div className="mx-auto flex max-w-xl items-center justify-between gap-4">
          <span className="min-w-0"><span className="block truncate text-sm text-slate-600 dark:text-slate-400">{ad.placement.label}{" "}{tx("· about")}{" "}{fmt(ad.views)}{" "}{tx("views")}</span><span className="font-display text-xl font-bold tabular-nums text-slate-900 dark:text-white">{usd(ad.budget || 0)}</span></span>
          <button type="button" onClick={go} className={`shrink-0 whitespace-nowrap rounded-xl border border-slate-300 px-4 py-2.5 font-semibold text-slate-800 dark:border-white/20 dark:text-slate-100 ${ring}`}>{tx("Review order")}</button>
        </div>
      </div>

      <CheckoutModal open={ad.c.payOpen} onClose={ad.c.closePay} price={ad.budget} itemLabel={tx("Ad budget")} payLabel={tx("Pay and create")} note={tx("Telegram reviews the ad in about 24 hours. If it's rejected and can't be fixed, you're refunded in full.")}
        onPay={(m) => ad.c.finish({ service: "ads", title: tx("Telegram Ads · New ad"), detail: tx("CPM {0} · about {1} views", { 0: usd(ad.cpm), 1: fmt(ad.views) }), total: ad.budget, to: ad.url.trim(), paidWith: m })}
        summary={<><ServiceIcon s="ads" /><div className="min-w-0 flex-1"><div className="truncate font-semibold text-slate-900 dark:text-white">{tx("Telegram Ads ·")}{" "}{usd(ad.budget)}</div><div className="truncate text-xs text-slate-500 dark:text-slate-400">{ad.url} · {ad.placement.label}</div></div></>} />
    </PageShell>
  );
}
