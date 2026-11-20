"use client";
import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { Bot, CalendarDays, Check, ChevronDown, CircleHelp, Clock, Eye, ImagePlus, Lock, Megaphone, MousePointerClick, Search, ShieldCheck, Users, X } from "lucide-react";
import CheckoutModal from "@/components/checkout/CheckoutModal";
import { useMoney } from "@/lib/money";
import { AD_TEXT_MAX, adCountries, adLanguages, adMinBudget, adRules, fmt, tgHeadings } from "@/content/telegram-en";
import { PageShell } from "../otp/parts";
import { useHasExtras } from "../service/slot";
import { primary } from "../googleVoice/clean";
import { card, field, H2, ring, ServiceIcon, TgFaq, TgOrderView, Trust, useGroupedInput, useTween } from "./parts";
import { HowItWorks, Rules } from "./ads";
import { ChipInput as KitChipInput, MAX_MEDIA_MB, MIN_CPM, targets, useAdForm, type Ad, type Target } from "./adsKit";
import { useLocale, useT } from "@/i18n/client";
import { SpotlightBand, spotTone, useSpotlight } from "@/design/service/spotlight";
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

const tipsEn = {
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

// The same help in Persian, written for the page (warm, polite «شما»). Kept as JSX like the English, so the bold
// words and the example line keep their styling.
const tipsFa: typeof tipsEn = {
  where: <>جایی که تلگرام آگهی‌تان را نشان می‌دهد. <b>کانال‌ها</b>: زیر پست‌های کانال‌های عمومی با بیش از ۱٬۰۰۰ عضو. <b>ربات‌ها</b>: داخل ربات‌ها و مینی‌اپ‌ها. <b>جستجو</b>: بالای جستجوی تلگرام. <b>کاربران</b>: برای مخاطبان یک کشور یا زبان، هر جا که مطلب می‌خوانند.</>,
  channels: <>لینک کانال‌های عمومی که خواننده‌هایشان به پیشنهاد شما می‌خورند، مثل <b>t.me/technews</b>. آگهی فقط همان‌جا دیده می‌شود. برای شروع، ۵ تا ۲۰ کانال با یک موضوع انتخاب خوبی است.</>,
  bots: <>لینک ربات‌ها یا مینی‌اپ‌ها، مثل <b>t.me/examplebot</b>. آگهی به کسانی نشان داده می‌شود که از آن‌ها استفاده می‌کنند.</>,
  search: <>کلمه‌هایی که مردم در جستجوی تلگرام تایپ می‌کنند، مثل <b>اخبار کریپتو</b>. کلمه‌های کوتاه و دقیق بهتر جواب می‌دهند.</>,
  country: <>فقط کسانی که در این کشور هستند آگهی را می‌بینند. برای رسیدن به همه، «همه کشورها» را انتخاب کنید.</>,
  language: <>زبان اپ تلگرام مخاطب. متن آگهی را هم به همین زبان بنویسید.</>,
  text: <>تا {AD_TEXT_MAX} حرف متن ساده: چه پیشنهادی دارید و چرا ارزش یک کلیک را دارد.<span className="mt-2 block rounded-xl bg-white/10 px-3 py-2"><span className="font-semibold text-emerald-300">نمونه خوب:</span> خلاصه خبرهای هوش مصنوعی در ۲ دقیقه. ابزارها و نکته‌های تازه، بدون اغراق.</span><span className="mt-2 block">از ایموجی، حروف تماماً بزرگ، «این‌جا کلیک کنید» و وعده‌های بزرگ دوری کنید؛ تلگرام این‌ها را رد می‌کند.</span></>,
  url: <>دکمه آگهی به کجا برود: یک کانال عمومی (<b dir="ltr">t.me/name</b>)، یک ربات (<b dir="ltr">t.me/namebot</b>) یا سایتی که با <b dir="ltr">https://</b> شروع می‌شود. متن دکمه هم از روی لینک انتخاب می‌شود: «مشاهده کانال»، «شروع ربات» یا «باز کردن لینک».</>,
  media: <>یک عکس یا ویدیوی کوتاه اختیاری بالای متن.<span className="mt-2 block">پیشنهاد ما تصویر <b>افقی ۱۶:۹</b> با حداقل <b>۱۲۸۰ × ۷۲۰ پیکسل</b> است (مربع ۱۰۸۰ × ۱۰۸۰ هم قبول است). JPG، PNG یا MP4، تا {MAX_MEDIA_MB} مگابایت. نوشته‌های داخل تصویر را کم و درشت نگه دارید.</span></>,
  pic: <>عکس پروفایل کانالتان را کنار اسمش در آگهی نشان می‌دهد. فقط برای لینک‌های t.me.</>,
  budget: <>مبلغی که الان پرداخت می‌کنید. هر بار که آگهی دیده می‌شود از آن خرج می‌شود و وقتی آگهی تمام شد، هر چه مانده به کیف پولتان برمی‌گردد.</>,
  cpm: <><b>CPM</b> قیمت هر ۱٬۰۰۰ بازدید است. وقتی چند آگهی برای یک جا رقابت می‌کنند، آگهی با CPM بالاتر زودتر نشان داده می‌شود: CPM بالاتر سریع‌تر بازدید می‌گیرد و CPM پایین‌تر ارزان‌تر است، ولی ممکن است کند پیش برود.<span className="mt-2 block">بودجه ÷ CPM × ۱٬۰۰۰ ≈ بازدیدی که می‌گیرید.</span></>,
  daily: <>بیشترین مبلغی که آگهی می‌تواند در یک روز خرج کند، تا بودجه دیرتر تمام شود.</>,
  perUser: <>یک نفر در روز چند بار می‌تواند آگهی‌تان را ببیند. برای بیشتر آگهی‌ها ۱ کافی است؛ ۲ تا ۴ کمک می‌کند در ذهن بماند.</>,
  start: <>آگهی از این تاریخ شروع می‌شود، به شرطی که تلگرام تأییدش کرده باشد. اگر تاریخی نگذارید، همین که تأیید شد شروع می‌شود؛ معمولاً ظرف ۲۴ ساعت.</>,
};
const useTips = () => (useLocale() === "fa" ? tipsFa : tipsEn);

// ---------- Field pieces (site theme) ----------

const hintCls = "text-sm text-slate-600 dark:text-slate-400";
const bad = (e?: string) => (e ? "!border-red-700 dark:!border-red-400" : "");
// Amount fields: the thick rounded border of the Stars amount field, with a Telegram-blue glow on focus.
const amountField = "!rounded-2xl !border-2 tracking-wide !transition-[border-color,background-color,box-shadow] placeholder:font-normal focus:!border-sky-500 focus:shadow-[0_0_0_4px_rgba(14,165,233,.2)] dark:focus:!border-sky-400 dark:focus:shadow-[0_0_0_4px_rgba(56,189,248,.18)]";
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
  // Toman is typed grouped in thousands (1,250,000).
  const grouped = useGroupedInput(rate ? value * rate : 0, (n) => onChange(n / (rate || 1)));
  if (rate) return (
    <div className="relative">
      <input {...grouped} id={id} placeholder="0" onBlur={onBlur}
        aria-invalid={!!error} aria-describedby={dsc(id, hint, error)} className={`${field} ${amountField} font-semibold tabular-nums ${big ? "py-3.5 pe-20 font-display text-3xl" : "pe-16"} ${bad(error)}`} />
      <span aria-hidden className={`pointer-events-none absolute end-4 top-1/2 -translate-y-1/2 font-semibold text-slate-500 dark:text-slate-400 ${big ? "text-lg" : "text-sm"}`}>{tx("Toman")}</span>
    </div>
  );
  return (
    <div className="relative">
      <span aria-hidden className={`pointer-events-none absolute start-4 top-1/2 -translate-y-1/2 font-semibold text-slate-500 dark:text-slate-400 ${big ? "font-display text-2xl" : ""}`}>$</span>
      <input id={id} type="number" inputMode="decimal" min={0} step="0.01" value={value || ""} placeholder="0.00" onChange={(e) => onChange(Number(e.target.value))} onBlur={onBlur}
        aria-invalid={!!error} aria-describedby={dsc(id, hint, error)} className={`${field} ${amountField} font-semibold tabular-nums ${big ? "py-3.5 ps-10 font-display text-3xl" : "ps-8"} ${bad(error)}`} />
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
  const tips = useTips();
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

function AdPanel({ ad, rules = "A" }: { ad: Ad; rules?: string }) {
  const tips = useTips();
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
        {rules === "B" && <div className="pt-1"><RulesInline /></div>}
        {rules === "C" && <div className="pt-1"><RulesLive ad={ad} /></div>}
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
  const tips = useTips();
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
          <Head id={`${p}-budget`} label={tx("Total budget")} tip={tips.budget} hint={tx("From {0}. Unspent money is refunded.", { 0: usd(adMinBudget(tx.rate)) })} error={errors.budget} />
          <Money id={`${p}-budget`} big value={ad.budget} onChange={ad.setBudget} onBlur={() => ad.touch("budget")} error={errors.budget} />
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

      <div className="mt-5"><DailyLimit ad={ad} /></div>
    </section>
  );
}

function DailyLimit({ ad }: { ad: Ad }) {
  const tips = useTips();
  const tx = useT();
  const { p, errors } = ad;
  return (
    <>
      <button type="button" onClick={() => { ad.setDailyOn(!ad.dailyOn); ad.setDaily(0); }} aria-expanded={ad.dailyOn} aria-controls={`${p}-daily-wrap`} className={linkCls}>{ad.dailyOn ? tx("Remove daily limit") : tx("Set a daily limit")}</button>
      <div id={`${p}-daily-wrap`} hidden={!ad.dailyOn} className="mt-3 max-w-xs space-y-2">
        {ad.dailyOn && <><Head id={`${p}-daily`} label={tx("Daily limit")} tip={tips.daily} hint={tx("The most it can spend in one day.")} error={errors.daily} /><Money id={`${p}-daily`} value={ad.daily} onChange={ad.setDaily} onBlur={() => ad.touch("daily")} error={errors.daily} /></>}
      </div>
    </>
  );
}

// ---------- 3 · Budget: gallery offers (section "tg-ads-budget"; A is BudgetPanel above) ----------
// Each keeps the same fields and checks (budget, CPM level or your own, the estimate, the daily limit); only the
// layout changes.

// The CPM choice every offer shares: a level, or "My own" with its own field.
function useCpmChoice(ad: Ad) {
  const tx = useT();
  const list = tx.tr(levels);
  const preset = list.find((l) => l.cpm === ad.cpm);
  const [custom, setCustom] = useState(false);
  const isCustom = custom || !preset;
  return { list, preset, isCustom, pick: (cpm: number) => { setCustom(false); ad.setCpm(cpm); }, own: () => setCustom(true) };
}
// Your own CPM: a visible label, the amount field, and a scale under it that shows where the price sits between
// Low, Standard and High (drag it, or type). The scale runs from the minimum to 1.5 × High.
function OwnCpm({ ad }: { ad: Ad }) {
  const usd = useMoney().format;
  const tx = useT();
  const { p, errors } = ad;
  const list = tx.tr(levels);
  const top = list[list.length - 1].cpm * 1.5;
  const at = (v: number) => Math.min(100, Math.max(0, ((v - MIN_CPM) / (top - MIN_CPM)) * 100));
  const pos = at(ad.cpm || MIN_CPM);
  const zone = !ad.cpm || ad.cpm < MIN_CPM ? null : ad.cpm < list[0].cpm ? tx("Slower than Low") : ad.cpm < list[1].cpm ? tx("Between Low and Standard") : ad.cpm < list[2].cpm ? tx("Between Standard and High") : tx("Shown first");
  return (
    <div>
      <label htmlFor={`${p}-cpm`} className="text-sm font-semibold text-slate-900 dark:text-white">{tx("Your price for 1,000 views")}</label>
      <ErrLine id={`${p}-cpm-error`} msg={errors.cpm} />
      <div className="mt-1.5"><Money id={`${p}-cpm`} big value={ad.cpm} onChange={ad.setCpm} onBlur={() => ad.touch("cpm")} error={errors.cpm} /></div>
      <div className="relative mt-5 h-2">
        <span aria-hidden className="absolute inset-0 rounded-full bg-slate-200 dark:bg-white/10" />
        <span aria-hidden className="absolute inset-y-0 start-0 rounded-full ltr:bg-gradient-to-r rtl:bg-gradient-to-l from-sky-400 to-sky-600 transition-[width] duration-300 ease-out dark:from-sky-500 dark:to-sky-300" style={{ width: `${pos}%` }} />
        {list.map((l) => <span key={l.id} aria-hidden className="absolute top-1/2 h-3 w-0.5 ltr:-translate-x-1/2 rtl:translate-x-1/2 -translate-y-1/2 rounded-full bg-white/80 dark:bg-[#0E1424]" style={{ insetInlineStart: `${at(l.cpm)}%` }} />)}
        <span aria-hidden className="pointer-events-none absolute top-1/2 h-5 w-5 ltr:-translate-x-1/2 rtl:translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] border-sky-600 bg-white shadow-md transition-[inset-inline-start] duration-300 ease-out dark:border-sky-300 dark:bg-[#0E1424]" style={{ insetInlineStart: `${pos}%` }} />
        <input type="range" min={MIN_CPM} max={top} step={0.05} value={Math.min(top, Math.max(MIN_CPM, ad.cpm || MIN_CPM))} onChange={(e) => ad.setCpm(Number(e.target.value))} onBlur={() => ad.touch("cpm")}
          aria-label={tx("Your price for 1,000 views")} aria-valuetext={usd(ad.cpm)} className={`absolute -inset-y-2 inset-x-0 w-full cursor-pointer opacity-0 ${ring}`} />
      </div>
      <div className="relative mt-2 h-9 text-xs">
        {list.map((l) => {
          const near = Math.abs(ad.cpm - l.cpm) < 0.13;
          return <span key={l.id} className={`absolute ltr:-translate-x-1/2 rtl:translate-x-1/2 whitespace-nowrap text-center tabular-nums transition-colors ${near ? "font-semibold text-sky-700 dark:text-sky-300" : "text-slate-500 dark:text-slate-400"}`} style={{ insetInlineStart: `${at(l.cpm)}%` }}><span className="block">{l.label}</span><span className="block">{usd(l.cpm)}</span></span>;
        })}
      </div>
      <p id={`${p}-cpm-hint`} className={`${hintCls} mt-2`}>{tx("From")}{" "}{usd(MIN_CPM)}{zone && <> · <span className="font-semibold text-sky-700 dark:text-sky-300">{zone}</span></>}</p>
    </div>
  );
}
// Speed as 1–3 small bars (Low, Standard, High).
function Speed({ n, on }: { n: number; on: boolean }) {
  return <span aria-hidden className="flex items-end gap-0.5">{[1, 2, 3].map((i) => <span key={i} className={`w-1.5 rounded-full ${i <= n ? (on ? "bg-sky-600 dark:bg-sky-400" : "bg-slate-400 dark:bg-slate-500") : "bg-slate-200 dark:bg-white/10"}`} style={{ height: 6 + i * 4 }} />)}</span>;
}
function BudgetField({ ad }: { ad: Ad }) {
  const tips = useTips();
  const usd = useMoney().format;
  const tx = useT();
  const { p, errors } = ad;
  return (
    <div className="space-y-2">
      <Head id={`${p}-budget`} label={tx("Total budget")} tip={tips.budget} hint={tx("From {0}. Unspent money is refunded.", { 0: usd(adMinBudget(tx.rate)) })} error={errors.budget} />
      <Money id={`${p}-budget`} big value={ad.budget} onChange={ad.setBudget} onBlur={() => ad.touch("budget")} error={errors.budget} />
    </div>
  );
}

const calcEase = "ease-[cubic-bezier(0.22,1,0.36,1)]";

// B · Calculator: the fields on one side, a coloured result card on the other with the views, the clicks and the
// sum written out (budget ÷ CPM × 1,000). CPM is a four-way switch.
function BudgetCalc({ ad }: { ad: Ad }) {
  const tips = useTips();
  const usd = useMoney().format;
  const tx = useT();
  const { p } = ad;
  const c = useCpmChoice(ad);
  // The white pill slides under the chosen button (four equal columns, so its place is just the index); the buttons
  // only change their text colour.
  const seg = (on: boolean) => `relative z-10 rounded-xl px-2 py-2 text-center text-sm font-semibold transition-colors duration-300 ${on ? "text-sky-800 dark:text-sky-200" : "text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"} ${ring}`;
  const at = c.isCustom ? 3 : Math.max(0, c.list.findIndex((l) => l.id === c.preset?.id));
  // Choosing "My own" opens its field and puts the cursor in it once it has unfolded.
  const own = () => { c.own(); setTimeout(() => document.getElementById(`${p}-cpm`)?.focus({ preventScroll: true }), 320); };
  const fold = (open: boolean) => `grid transition-[grid-template-rows,opacity,translate] duration-500 ${calcEase} ${open ? "grid-rows-[1fr] translate-y-0 opacity-100" : "pointer-events-none grid-rows-[0fr] -translate-y-1 opacity-0"}`;
  return (
    <section aria-labelledby={`${p}-s3`} className={`${card} overflow-hidden`}>
      <div className="grid md:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
        <div className="space-y-6 p-6 sm:p-8">
          <H2 id={`${p}-s3`} className="text-xl">{tx("Budget")}</H2>
          <BudgetField ad={ad} />
          <div className="space-y-2">
            <Head id={`${p}-cpm-set`} as="span" label={tx("Price per 1,000 views (CPM)")} tip={tips.cpm} />
            <div role="radiogroup" aria-labelledby={`${p}-cpm-set-label`} className="relative grid grid-cols-4 gap-1 rounded-2xl bg-slate-100 p-1 dark:bg-white/5">
              <span aria-hidden className={`absolute inset-y-1 rounded-xl bg-white shadow-sm transition-[inset-inline-start] duration-500 ${calcEase} dark:bg-[#0E1424]`}
                style={{ width: "calc((100% - 1.25rem) / 4)", insetInlineStart: `calc(0.25rem + ${at} * ((100% - 1.25rem) / 4 + 0.25rem))` }} />
              {c.list.map((l) => {
                const on = !c.isCustom && c.preset?.id === l.id;
                return <button key={l.id} type="button" role="radio" aria-checked={on} onClick={() => c.pick(l.cpm)} className={seg(on)}>{l.label}<span className="block text-xs font-normal tabular-nums opacity-80">{usd(l.cpm)}</span></button>;
              })}
              <button type="button" role="radio" aria-checked={c.isCustom} onClick={own} className={seg(c.isCustom)}>{tx("My own")}</button>
            </div>
            {/* The level's hint folds away as the custom field unfolds (and back); the hidden one is inert. */}
            <div className={fold(!c.isCustom)} inert={c.isCustom}><div className="overflow-hidden"><p className={hintCls}>{c.preset?.hint ?? tx.tr(levels)[1].hint}</p></div></div>
            <div className={fold(c.isCustom)} inert={!c.isCustom}><div className="overflow-hidden"><div className={`px-1 pb-1 pt-2 transition-transform duration-500 ${calcEase} ${c.isCustom ? "scale-100" : "scale-95"}`}><OwnCpm ad={ad} /></div></div></div>
          </div>
          <DailyLimit ad={ad} />
        </div>
        <div aria-live="polite" className="flex flex-col justify-center gap-4 bg-gradient-to-br from-sky-600 to-indigo-700 p-6 text-white sm:p-8">
          <p className="text-sm font-semibold text-sky-100">{tx("What you get")}</p>
          <p><span className="font-display text-5xl font-bold tabular-nums">~<TweenNum value={ad.views} /></span><span className="ms-2 text-lg text-sky-100">{tx("views")}</span></p>
          <p className="flex items-center gap-2 text-lg"><MousePointerClick aria-hidden className="h-5 w-5 text-sky-200" /><span className="font-semibold tabular-nums"><TweenNum value={ad.lo} />–<TweenNum value={ad.hi} /></span><span className="text-sky-100">{tx("clicks")}</span></p>
          <p className="mt-2 flex flex-wrap items-center gap-2 border-t border-white/15 pt-4 text-sm tabular-nums text-sky-50">
            <span className="rounded-lg bg-white/15 px-2 py-1 font-semibold">{usd(ad.budget || 0)}</span>÷<span className="rounded-lg bg-white/15 px-2 py-1 font-semibold">{usd(ad.cpm || 0)}</span><span>{tx("× 1,000 views. An estimate.")}</span>
          </p>
        </div>
      </div>
    </section>
  );
}

// C · Slider: the amount large with a slider under it (from the minimum, growing faster towards the top), and the
// CPM levels as three cards side by side with speed bars.
function BudgetSlider({ ad }: { ad: Ad }) {
  const tips = useTips();
  const usd = useMoney().format;
  const tx = useT();
  const { p } = ad;
  const c = useCpmChoice(ad);
  const min = adMinBudget(tx.rate);
  const max = 5000;
  const toPos = (b: number) => Math.round((Math.log(Math.max(min, Math.min(max, b)) / min) / Math.log(max / min)) * 100);
  // Slider steps land on round amounts: 100,000 toman, or whole dollars in English.
  const fromPos = (v: number) => { const d = min * (max / min) ** (v / 100); return tx.rate ? Math.round((d * tx.rate) / 100000) * 100000 / tx.rate : Math.round(d); };
  return (
    <section aria-labelledby={`${p}-s3`} className={`${card} space-y-7 p-6 sm:p-8`}>
      <H2 id={`${p}-s3`} className="text-xl">{tx("Budget")}</H2>
      <div className="space-y-3">
        <BudgetField ad={ad} />
        <input type="range" aria-label={tx("Budget slider")} min={0} max={100} value={toPos(ad.budget || min)} onChange={(e) => ad.setBudget(fromPos(Number(e.target.value)))} className="w-full accent-sky-600" />
        <div className={`flex justify-between text-sm tabular-nums ${hintCls}`}><span>{usd(min)}</span><span>{usd(max)}</span></div>
      </div>
      <fieldset className="relative space-y-2" aria-labelledby={`${p}-cpm-set-label`}>
        <Head id={`${p}-cpm-set`} as="span" label={tx("Price per 1,000 views (CPM)")} tip={tips.cpm} />
        <div className="grid gap-2 sm:grid-cols-3">
          {c.list.map((l, i) => {
            const on = !c.isCustom && c.preset?.id === l.id;
            return (
              <button key={l.id} type="button" aria-pressed={on} onClick={() => c.pick(l.cpm)} className={`flex flex-col items-start gap-2 rounded-2xl border-2 p-4 text-start transition-colors ${on ? selOn : selOff} ${ring}`}>
                <span className="flex w-full items-center justify-between"><span className="font-semibold text-slate-900 dark:text-white">{l.label}</span><Speed n={i + 1} on={on} /></span>
                <span className="font-display text-lg font-bold tabular-nums text-slate-900 dark:text-white">{usd(l.cpm)}</span>
                <span className="text-sm text-slate-600 dark:text-slate-400">{l.hint}</span>
              </button>
            );
          })}
        </div>
        <button type="button" aria-pressed={c.isCustom} onClick={c.own} className={`${linkCls} mt-1`}>{tx("My own")}</button>
        {c.isCustom && <OwnCpm ad={ad} />}
      </fieldset>
      <div aria-live="polite" className="flex flex-wrap items-center gap-x-8 gap-y-3 rounded-2xl bg-sky-50 px-5 py-4 dark:bg-sky-400/10">
        <span className="flex items-center gap-2"><Eye aria-hidden className="h-5 w-5 text-sky-700 dark:text-sky-300" /><span className="font-display text-2xl font-bold tabular-nums text-slate-900 dark:text-white">~<TweenNum value={ad.views} /></span><span className={hintCls}>{tx("views")}</span></span>
        <span className="flex items-center gap-2"><MousePointerClick aria-hidden className="h-5 w-5 text-sky-700 dark:text-sky-300" /><span className="font-display text-2xl font-bold tabular-nums text-slate-900 dark:text-white"><TweenNum value={ad.lo} />–<TweenNum value={ad.hi} /></span><span className={hintCls}>{tx("clicks")}</span></span>
      </div>
      <DailyLimit ad={ad} />
    </section>
  );
}

// D · Three Steps: the section reads top to bottom as numbered steps on a line: how much, how fast, what you get.
function BudgetSteps({ ad }: { ad: Ad }) {
  const tips = useTips();
  const usd = useMoney().format;
  const tx = useT();
  const { p } = ad;
  const c = useCpmChoice(ad);
  const Num = ({ n }: { n: number }) => <span aria-hidden className="relative z-10 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-sky-600 font-display text-sm font-bold text-white dark:bg-sky-500 dark:text-sky-950">{n}</span>;
  return (
    <section aria-labelledby={`${p}-s3`} className={`${card} p-6 sm:p-8`}>
      <H2 id={`${p}-s3`} className="text-xl">{tx("Budget")}</H2>
      <ol className="relative mt-6 space-y-8 before:absolute before:bottom-4 before:start-4 before:top-4 before:w-px before:bg-slate-200 dark:before:bg-white/10">
        <li className="flex gap-4"><Num n={1} /><div className="min-w-0 flex-1"><BudgetField ad={ad} /></div></li>
        <li className="flex gap-4"><Num n={2} />
          <fieldset className="relative min-w-0 flex-1 space-y-2" aria-labelledby={`${p}-cpm-set-label`}>
            <Head id={`${p}-cpm-set`} as="span" label={tx("Price per 1,000 views (CPM)")} tip={tips.cpm} />
            <div className="divide-y divide-slate-200 overflow-hidden rounded-2xl border border-slate-200 dark:divide-white/10 dark:border-white/15">
              {c.list.map((l, i) => {
                const on = !c.isCustom && c.preset?.id === l.id;
                return (
                  <button key={l.id} type="button" aria-pressed={on} onClick={() => c.pick(l.cpm)} className={`flex w-full items-center gap-3 px-4 py-3 text-start transition-colors ${on ? "bg-sky-50 dark:bg-sky-400/10" : "hover:bg-slate-50 dark:hover:bg-white/5"} ${ring}`}>
                    <Speed n={i + 1} on={on} />
                    <span className="min-w-0 flex-1"><span className="block font-semibold text-slate-900 dark:text-white">{l.label}</span><span className="block text-sm text-slate-600 dark:text-slate-400">{l.hint}</span></span>
                    <span className="font-display font-bold tabular-nums text-slate-900 dark:text-white">{usd(l.cpm)}</span>
                    {on && <Check aria-hidden className="h-4 w-4 text-sky-700 dark:text-sky-300" strokeWidth={3} />}
                  </button>
                );
              })}
              <button type="button" aria-pressed={c.isCustom} onClick={c.own} className={`flex w-full items-center gap-3 px-4 py-3 text-start font-semibold transition-colors ${c.isCustom ? "bg-sky-50 dark:bg-sky-400/10" : "hover:bg-slate-50 dark:hover:bg-white/5"} text-slate-900 dark:text-white ${ring}`}>{tx("My own")}</button>
            </div>
            {c.isCustom && <OwnCpm ad={ad} />}
          </fieldset>
        </li>
        <li className="flex gap-4"><Num n={3} />
          <div aria-live="polite" className="min-w-0 flex-1">
            <p className="font-semibold text-slate-900 dark:text-white">{tx("What you get")}</p>
            <p className="mt-2 flex flex-wrap items-baseline gap-x-6 gap-y-1"><span><span className="font-display text-3xl font-bold tabular-nums text-slate-900 dark:text-white">~<TweenNum value={ad.views} /></span>{" "}<span className={hintCls}>{tx("views")}</span></span><span><span className="font-display text-xl font-bold tabular-nums text-slate-900 dark:text-white"><TweenNum value={ad.lo} />–<TweenNum value={ad.hi} /></span>{" "}<span className={hintCls}>{tx("clicks")}</span></span></p>
            <p className={`mt-1 text-sm tabular-nums ${hintCls}`}>{usd(ad.budget || 0)} ÷ {usd(ad.cpm || 0)}{" "}{tx("× 1,000 views. An estimate.")}</p>
            <div className="mt-4"><DailyLimit ad={ad} /></div>
          </div>
        </li>
      </ol>
    </section>
  );
}

// E · Compact: one row with the budget, the CPM as a drop-down and the estimate, for a shorter page.
function BudgetCompact({ ad }: { ad: Ad }) {
  const tips = useTips();
  const usd = useMoney().format;
  const tx = useT();
  const { p } = ad;
  const c = useCpmChoice(ad);
  return (
    <section aria-labelledby={`${p}-s3`} className={`${card} space-y-6 p-6 sm:p-8`}>
      <H2 id={`${p}-s3`} className="text-xl">{tx("Budget")}</H2>
      <div className="grid gap-6 md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
        <BudgetField ad={ad} />
        <div className="space-y-2">
          <Head id={`${p}-cpm-pick`} label={tx("Price per 1,000 views (CPM)")} tip={tips.cpm} />
          <select id={`${p}-cpm-pick`} value={c.isCustom ? "own" : c.preset?.id} onChange={(e) => { const l = c.list.find((x) => x.id === e.target.value); if (l) c.pick(l.cpm); else c.own(); }} className={`${field} py-4 font-semibold`}>
            {c.list.map((l) => <option key={l.id} value={l.id}>{l.label} · {usd(l.cpm)}</option>)}
            <option value="own">{tx("My own")}</option>
          </select>
          {c.isCustom ? <OwnCpm ad={ad} /> : <p className={hintCls}>{c.preset?.hint}</p>}
        </div>
      </div>
      <div aria-live="polite" className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-200 pt-5 dark:border-white/10">
        <span className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-50 px-3 py-1.5 text-sm font-semibold tabular-nums text-sky-900 dark:bg-sky-400/10 dark:text-sky-100"><Eye aria-hidden className="h-4 w-4" />~<TweenNum value={ad.views} />{" "}{tx("views")}</span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-50 px-3 py-1.5 text-sm font-semibold tabular-nums text-sky-900 dark:bg-sky-400/10 dark:text-sky-100"><MousePointerClick aria-hidden className="h-4 w-4" /><TweenNum value={ad.lo} />–<TweenNum value={ad.hi} />{" "}{tx("clicks")}</span>
        </span>
        <DailyLimit ad={ad} />
      </div>
    </section>
  );
}

const budgetPanels: Record<string, (props: { ad: Ad }) => ReactNode> = { A: BudgetPanel, B: BudgetCalc, C: BudgetSlider, D: BudgetSteps, E: BudgetCompact };

// ---------- Telegram's ad rules: gallery offers (section "tg-ads-rules") ----------
// A is the current box at the bottom of the page (Rules from ./ads). The others move the same four rules to where
// they help: next to the ad text, as a live check of it, beside the preview, or at the top before the form.

const amberBox = "rounded-2xl border border-amber-300 bg-amber-50 dark:border-amber-400/30 dark:bg-amber-400/5";
function RulesTitle() {
  const tx = useT();
  return <span className="flex items-center gap-2 font-semibold text-slate-900 dark:text-white"><ShieldCheck aria-hidden className="h-5 w-5 text-amber-700 dark:text-amber-300" />{tx("Telegram's ad rules")}</span>;
}

// B · Under the ad text: a compact box right under the text field, where the rules matter.
function RulesInline() {
  const tx = useT();
  return (
    <div className={`${amberBox} p-4`}>
      <RulesTitle />
      <ul className="mt-2 grid gap-x-6 gap-y-1 text-sm text-slate-700 sm:grid-cols-2 dark:text-slate-300">{tx.tr(adRules).map((r) => <li key={r} className="flex gap-2"><span aria-hidden>·</span>{r}</li>)}</ul>
    </div>
  );
}

// C · Live check: the rules as a checklist under the ad text. The text and link rules tick green once what you typed
// meets them (or turn red when it breaks them); the other two are reminders.
const EMOJI = /\p{Extended_Pictographic}/u;
function RulesLive({ ad }: { ad: Ad }) {
  const tx = useT();
  const [textRule, linkRule, contentRule, reviewRule] = tx.tr(adRules);
  const text = ad.text.trim();
  const textOk = text ? (text.length <= AD_TEXT_MAX && !EMOJI.test(text)) : null;
  const linkOk = ad.url.trim() ? !ad.all.url : null;
  const row = (label: string, ok: boolean | null, Icon: typeof Check = Check) => (
    <li className="flex items-start gap-2.5">
      <span aria-hidden className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full ${ok === true ? "bg-emerald-600 text-white dark:bg-emerald-500" : ok === false ? "bg-red-600 text-white dark:bg-red-500" : "bg-slate-200 text-slate-600 dark:bg-white/10 dark:text-slate-300"}`}>
        {ok === false ? <X className="h-3 w-3" strokeWidth={3} /> : <Icon className="h-3 w-3" strokeWidth={3} />}
      </span>
      <span className={ok === false ? "font-semibold text-red-800 dark:text-red-300" : "text-slate-700 dark:text-slate-300"}>{label}</span>
    </li>
  );
  return (
    <div className={`${amberBox} p-4`}>
      <RulesTitle />
      <ul aria-live="polite" className="mt-3 space-y-2 text-sm">
        {row(textRule, textOk)}
        {row(linkRule, linkOk)}
        {row(contentRule, null, ShieldCheck)}
        {row(reviewRule, null, Clock)}
      </ul>
    </div>
  );
}

// D · Beside the preview: a folded box between the preview and the order card, opened with one tap.
function RulesAside() {
  const tx = useT();
  return (
    <details className={`group ${amberBox} shrink-0`}>
      <summary className={`flex cursor-pointer list-none items-center justify-between gap-2 rounded-2xl p-4 ${ring}`}><RulesTitle /><ChevronDown aria-hidden className="h-4 w-4 text-slate-500 transition-transform group-open:rotate-180" /></summary>
      <ul className="space-y-1.5 px-4 pb-4 text-sm text-slate-700 dark:text-slate-300">{tx.tr(adRules).map((r) => <li key={r} className="flex gap-2"><span aria-hidden>·</span>{r}</li>)}</ul>
    </details>
  );
}

// E · Before you start: a slim strip above the form, so the rules are read before anything is filled in.
function RulesStrip() {
  const tx = useT();
  return (
    <div className={`${amberBox} flex flex-col gap-3 p-4 lg:flex-row lg:items-center lg:gap-6`}>
      <span className="shrink-0"><RulesTitle /></span>
      <ul className="flex flex-wrap gap-2 text-sm text-slate-800 dark:text-slate-200">{tx.tr(adRules).map((r) => <li key={r} className="rounded-full bg-white/80 px-3 py-1 ring-1 ring-amber-200 dark:bg-white/5 dark:ring-amber-400/20">{r}</li>)}</ul>
    </div>
  );
}

// ---------- 4 · Schedule ----------

function SchedulePanel({ ad }: { ad: Ad }) {
  const tips = useTips();
  const tx = useT();
  const { p, errors } = ad;
  const perName = useId();
  return (
    <section aria-labelledby={`${p}-s4`} className={`${card} space-y-6 p-6 sm:p-8`}>
      <H2 id={`${p}-s4`} className="text-xl">{tx("Schedule")}</H2>
      <fieldset className="relative" aria-labelledby={`${p}-per-label`} aria-describedby={`${p}-per-hint`}>
        <Head id={`${p}-per`} as="span" label={tx("Views per person a day")} tip={tips.perUser} hint={tx("How many times one person can see it in a day.")} />
        {/* Each choice shows as many eyes as views, the count, and what it means (reach against repeats). */}
        <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {([[1, "Most people"], [2, "Balanced"], [3, "Better recall"], [4, "Most repeats"]] as const).map(([n, meaning]) => {
            const on = ad.perUser === n;
            return (
              <label key={n} className={`group relative flex cursor-pointer flex-col items-center gap-1.5 rounded-2xl border-2 px-2 pb-3 pt-3.5 text-center transition-[border-color,background-color,transform] duration-200 hover:-translate-y-0.5 ${tx.tr(hasRing)} ${on ? selOn : selOff}`}>
                <input type="radio" name={perName} checked={on} onChange={() => ad.setPerUser(n)} className="sr-only" />
                {on && <span aria-hidden className="absolute end-2 top-2 grid h-5 w-5 animate-pop place-items-center rounded-full bg-sky-600 text-white dark:bg-sky-400 dark:text-sky-950"><Check className="h-3 w-3" strokeWidth={3} /></span>}
                <span aria-hidden className="flex h-5 items-center gap-0.5">
                  {Array.from({ length: n }, (_, i) => <Eye key={i} className={`h-4 w-4 transition-colors duration-200 ${on ? "text-sky-600 dark:text-sky-300" : "text-slate-400 group-hover:text-slate-500 dark:text-slate-500"}`} style={on ? { animation: `pop .3s cubic-bezier(.16,1,.3,1) ${i * 60}ms both` } : undefined} />)}
                </span>
                <span className="font-display text-base font-bold tabular-nums text-slate-900 dark:text-white">{n}{" "}{tx("times")}</span>
                <span className={`text-xs ${on ? "font-semibold text-sky-700 dark:text-sky-300" : "text-slate-500 dark:text-slate-400"}`}>{tx(meaning)}</span>
              </label>
            );
          })}
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
      <button type="submit" className={`${primary} mt-4 w-full tabular-nums`}>{tx("Continue")}</button>
      <p role="status" className="mt-2.5 text-center text-sm font-semibold text-red-700 empty:hidden dark:text-red-400">{blocker}</p>
      {sample && <p className="mt-1 text-center text-xs text-slate-500 dark:text-slate-400">{tx("Sample prices and estimates (design preview)")}</p>}
    </section>
  );
}

// ---------- Page ----------

// `budget` / `rules`: the picks in /design/tg-ads-budget and /design/tg-ads-rules (A = the original layout).
export default function AdsG({ budget = "A", rules = "A" }: { budget?: string; rules?: string }) {
  const usd = useMoney().format;
  const tx = useT();
  const ad = useAdForm({ status: "active" });
  const extras = useHasExtras();
  const spot = useSpotlight();
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

  const trust = [tx("No TON or Fragment needed"), tx("Refund if rejected"), tx("Stop any time")];
  const Budget = budgetPanels[budget] ?? BudgetPanel;
  return (
    <PageShell>
      {/* Spotlight × Grid (landing hero preview): the heading moves into the band and the form overlaps its lower part. */}
      {spot && (
        <section className={`relative -mt-16 overflow-hidden pb-28 pt-28 ${spotTone.title}`}>
          <SpotlightBand under={false} beam="start" />
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
            <h1 className="text-balance font-display text-3xl font-bold tracking-tight sm:text-5xl lg:max-w-[calc(100%-400px)]"><PageH1 text={tx("Create a Telegram ad")} /></h1>
            <p className={`mt-3 max-w-3xl text-pretty text-base leading-relaxed sm:mt-4 sm:text-lg ${spotTone.sub}`}>{tx.tr(tgHeadings).ads.sub}</p>
            <div className="mt-6"><Trust items={trust} /></div>
          </div>
        </section>
      )}
      <div className={`mx-auto max-w-7xl px-4 pb-28 sm:px-6 ${spot ? "" : "pt-14"}`}>
        {!spot && <>
          <h1 className="text-balance font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-5xl dark:text-white"><PageH1 text={tx("Create a Telegram ad")} /></h1>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-slate-700 sm:mt-4 sm:text-lg dark:text-slate-300">{tx.tr(tgHeadings).ads.sub}</p>
          <div className="mt-6"><Trust items={trust} /></div>
        </>}

        <form noValidate onSubmit={(e) => { e.preventDefault(); ad.proceed(); }} className={`${spot ? "relative z-10 -mt-16" : "mt-10"} grid grid-cols-[minmax(0,1fr)] gap-8 lg:grid-cols-[minmax(0,1fr)_360px]`}>
          <div className="min-w-0 space-y-6">
            {ad.submitted > 0 && ad.errList.length > 0 && (
              <div ref={ad.summaryRef} tabIndex={-1} role="alert" className="rounded-2xl border-2 border-red-700 bg-red-50 p-5 outline-none dark:border-red-400 dark:bg-red-500/10">
                <h2 className="font-display text-lg font-semibold text-slate-900 dark:text-white">{tx("Please fix")}{" "}{ad.errList.length === 1 ? "this" : tx("these {0} things", { 0: ad.errList.length })}</h2>
                <ul className="mt-2 space-y-1">{ad.errList.map(([k, m]) => <li key={k}><a href={`#${ad.ids[k]}`} onClick={(e) => { e.preventDefault(); document.getElementById(ad.ids[k])?.focus(); }} className={`font-semibold text-red-800 underline underline-offset-2 dark:text-red-300 ${ring}`}>{m}</a></li>)}</ul>
              </div>
            )}
            {rules === "E" && <RulesStrip />}
            <WherePanel ad={ad} />
            <AdPanel ad={ad} rules={rules} />
            <Budget ad={ad} />
            <SchedulePanel ad={ad} />
          </div>

          {/* Sticky on every screen height: capped to the window, the preview gives up space first. */}
          <aside ref={sideRef} aria-label={tx("Preview and order")} className="flex flex-col gap-4 lg:sticky lg:top-24 lg:max-h-[calc(100dvh-7rem)] lg:self-start">
            <Preview ad={ad} />
            {rules === "D" && <RulesAside />}
            <OrderCard ad={ad} />
          </aside>
        </form>

        {!extras && <section aria-labelledby={`${ad.p}-how`} className="mt-20"><H2 id={`${ad.p}-how`}>{tx("How it works")}</H2><div className="mt-6"><HowItWorks /></div></section>}
        {rules === "A" && <div className="mt-10 max-w-3xl"><Rules /></div>}
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
