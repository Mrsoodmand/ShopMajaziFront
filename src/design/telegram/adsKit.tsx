"use client";
import { useEffect, useId, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { AlertTriangle, Bot, CalendarDays, Check, Eye, ImagePlus, Megaphone, MousePointerClick, Search, Users, X } from "lucide-react";
import CheckoutModal from "@/components/checkout/CheckoutModal";
import { useMoney } from "@/lib/money";
import { AD_MAX_BUDGET, AD_MIN_BUDGET, AD_TEXT_MAX, adCountries, adLanguages, estClicks, estViews, fmt, tgHeadings } from "@/content/telegram-en";
import { PageShell } from "../otp/parts";
import { useHasExtras } from "../service/slot";
import { primary, ring } from "../googleVoice/clean";
import { H2, ServiceIcon, TgFaq, TgOrderView, Trust, useCheckout, useTween } from "./parts";
import { HowItWorks, Rules } from "./ads";
import { useT } from "@/i18n/client";

// Shared pieces of the Ads Night pages (Ads G to K). Every field of Telegram's own ad form (from Ads F), on an
// always-dark Telegram-blue night: still dots, solid navy panels, sky selection, the emerald Continue in the sidebar
// order card. Motion: one moment per buyer action — the sponsored message arrives in the preview once the ad is
// complete, and the preview swaps once when the placement changes. Nothing loops.

// ---------- World ----------

export const adsNightBg = "bg-[radial-gradient(ellipse_at_top,#1b6aa8_0%,#0a2747_42%,#050c18_100%)]";
export const panel = "rounded-3xl border border-white/12 bg-[#0a1930] shadow-[0_16px_40px_-20px_rgba(0,0,0,.8)]";
export const focusRing = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a1930]";
export const hasFocusRing = "has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-emerald-400 has-[:focus-visible]:ring-offset-2 has-[:focus-visible]:ring-offset-[#0a1930]";
export const nField = `w-full rounded-xl border border-white/20 bg-black/30 px-4 py-3 text-base text-white placeholder:text-sky-100/60 ${focusRing}`;
export const muted = "text-sky-100/75";
export const optOn = "border-sky-400 bg-white/[.07]";
export const optOff = "border-white/20 hover:border-white/45";
export const linkBtn = `rounded-lg font-semibold text-sky-300 underline underline-offset-4 hover:text-sky-200 ${focusRing}`;
export const ghostBtn = `inline-flex items-center justify-center gap-2 rounded-xl border border-white/25 px-5 py-2.5 font-semibold text-white transition-colors hover:bg-white/[.06] ${focusRing}`;

// ---------- Telegram's ad form ----------

export type Target = "channels" | "bots" | "search" | "users";
export const targets: { id: Target; label: string; hint: string; icon: typeof Megaphone }[] = [
  { id: "channels", label: "Channels", hint: "At the end of posts in public channels", icon: Megaphone },
  { id: "bots", label: "Bots", hint: "Inside bots and mini apps", icon: Bot },
  { id: "search", label: "Search", hint: "In Telegram search results", icon: Search },
  { id: "users", label: "Users", hint: "To people by country and language", icon: Users },
];
export const MIN_CPM = 0.5; // placeholder
const TME = /^(https?:\/\/)?t\.me\/[a-zA-Z][a-zA-Z0-9_]{4,31}\/?$/i;
const SITE = /^https:\/\/[^\s.]+\.[^\s]{2,}$/i;
export const MAX_MEDIA_MB = 10;

export type ErrKey = "text" | "url" | "media" | "cpm" | "budget" | "daily" | "target" | "start";
export type Errors = Partial<Record<ErrKey, string>>;

// All state and checks of the ad form. Field ids carry a prefix so several offers can sit on one page.
export function useAdForm(init: { status?: "active" | "hold" } = {}) {
  const usd = useMoney().format;
  const tx = useT();
  const c = useCheckout();
  const p = useId().replace(/[^a-zA-Z0-9]/g, "");
  const [target, setTarget] = useState<Target>("channels");
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [url, setUrl] = useState("");
  const [showPic, setShowPic] = useState(false);
  const [media, setMedia] = useState<{ name: string; type: string; src: string } | null>(null);
  const [mediaErr, setMediaErr] = useState<string>();
  const [cpm, setCpm] = useState(2.5);
  const [budget, setBudget] = useState(100);
  const [dailyOn, setDailyOn] = useState(false);
  const [daily, setDaily] = useState(0);
  const [perUser, setPerUser] = useState(1);
  const [status, setStatus] = useState<"active" | "hold">(init.status ?? "hold");
  const [startOn, setStartOn] = useState(false);
  const [start, setStart] = useState("");
  const [list, setList] = useState<Record<"channels" | "bots" | "search", string[]>>({ channels: [], bots: [], search: [] });
  const [country, setCountry] = useState("Worldwide");
  const [language, setLanguage] = useState("Any");
  const [touched, setTouched] = useState<Partial<Record<ErrKey, boolean>>>({});
  const [submitted, setSubmitted] = useState(0);
  const fileRef = useRef<HTMLInputElement>(null);
  const summaryRef = useRef<HTMLDivElement>(null);

  const today = new Date().toISOString().slice(0, 10);
  const isTg = TME.test(url.trim());
  const all: Errors = {};
  if (!text.trim()) all.text = tx("Write the text of your ad");
  else if (text.length > tx.tr(AD_TEXT_MAX)) all.text = tx("Ad text can be at most {0} characters", { 0: AD_TEXT_MAX });
  if (!url.trim()) all.url = tx("Enter the link you want to promote");
  else if (!isTg && !SITE.test(url.trim())) all.url = tx("Enter a t.me link or a website starting with https://");
  if (mediaErr) all.media = mediaErr;
  if (!(cpm >= MIN_CPM)) all.cpm = tx("CPM must be at least {0}", { 0: usd(MIN_CPM) });
  if (!(budget >= tx.tr(AD_MIN_BUDGET))) all.budget = tx("The smallest budget is {0}", { 0: usd(AD_MIN_BUDGET) });
  else if (budget > AD_MAX_BUDGET) all.budget = tx("For more than {0}, contact us", { 0: usd(AD_MAX_BUDGET) });
  if (dailyOn && !(daily > 0)) all.daily = tx("Enter a daily limit, or remove it");
  else if (dailyOn && daily > budget) all.daily = tx("The daily limit can't be more than the budget");
  if (target !== "users" && !list[target].length) all.target = target === "search" ? tx("Add at least one search word") : tx("Add at least one {0}", { 0: target === "bots" ? tx("bot") : tx("channel") });
  if (startOn && (!start || start < today)) all.start = tx("Choose today or a later date");
  const errors = Object.fromEntries(Object.entries(all).filter(([k]) => submitted || touched[k as ErrKey])) as Errors;
  const touch = (k: ErrKey) => setTouched((t) => ({ ...t, [k]: true }));

  useEffect(() => () => { if (media) URL.revokeObjectURL(media.src); }, [media]);
  useEffect(() => { if (submitted && Object.keys(all).length) summaryRef.current?.focus(); }, [submitted]); // eslint-disable-line react-hooks/exhaustive-deps

  const views = estViews(budget || 0, cpm || MIN_CPM);
  const [lo, hi] = estClicks(views);
  const button = isTg ? (/bot\/?$/i.test(url) ? tx("Start bot") : tx("View channel")) : url.trim() ? tx("Open link") : tx("Open");
  const name = title.trim() || url.replace(/^(https?:\/\/)?(t\.me\/)?/i, "").replace(/\/$/, "") || tx("Your channel");
  const placement = tx.tr(targets).find((t) => t.id === target)!;
  const reach = target === "users" ? tx("People in {0}", { 0: country === "Worldwide" ? tx("every country") : tx(country) }) + (language !== "Any" ? tx(", Telegram in {0}", { 0: tx(language) }) : "")
    : list[target].length ? `${list[target].length} ${target === "search" ? tx("search word") : target === "bots" ? "bot" : "channel"}${list[target].length > 1 ? "s" : ""}` : "";
  const ids: Record<ErrKey, string> = { text: `${p}-text`, url: `${p}-url`, media: `${p}-media`, cpm: `${p}-cpm`, budget: `${p}-budget`, daily: `${p}-daily`, target: target === "users" ? `${p}-country` : `${p}-target`, start: `${p}-start` };
  const errList = Object.entries(all) as [ErrKey, string][];
  const ready = !all.text && !all.url;

  const onFile = (f?: File) => {
    if (!f) return;
    if (!/^(image|video)\//.test(f.type)) { setMediaErr("Choose a photo or a video"); return; }
    if (f.size > MAX_MEDIA_MB * 1024 * 1024) { setMediaErr(tx("The file must be {0} MB or smaller", { 0: MAX_MEDIA_MB })); return; }
    setMediaErr(undefined); setMedia({ name: f.name, type: f.type, src: URL.createObjectURL(f) });
  };
  const proceed = () => { setSubmitted((n) => n + 1); if (!errList.length) c.openPay(); return !errList.length; };
  const startsLabel = status === "hold" ? tx("On hold until you start it") : startOn && start ? new Date(start).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : tx("When approved");

  return {
    c, p, target, setTarget, title, setTitle, text, setText, url, setUrl, showPic, setShowPic, media, setMedia, mediaErr, cpm, setCpm, budget, setBudget,
    dailyOn, setDailyOn, daily, setDaily, perUser, setPerUser, status, setStatus, startOn, setStartOn, start, setStart, list, setList, country, setCountry,
    language, setLanguage, submitted, fileRef, summaryRef, today, isTg, all, errors, touch, views, lo, hi, button, name, placement, reach, ids, errList,
    ready, onFile, proceed, startsLabel,
  };
}
export type Ad = ReturnType<typeof useAdForm>;

// ---------- Small pieces ----------

const dsc = (id: string, hint: boolean, error?: string) => [hint && `${id}-hint`, error && `${id}-error`].filter(Boolean).join(" ") || undefined;
export const bad = (e?: string) => (e ? "!border-red-300" : "");

export function ErrLine({ id, msg }: { id?: string; msg?: string }) {
  const tx = useT();
  if (!msg) return null;
  return <p id={id} className="mt-1 flex items-start gap-1.5 text-sm font-semibold text-red-300"><X aria-hidden className="mt-0.5 h-4 w-4 shrink-0" /><span><span className="sr-only">{tx("Error:")}{" "}</span>{msg}</span></p>;
}

export function Field({ id, label, hint, error, side, children }: { id: string; label: string; hint?: ReactNode; error?: string; side?: ReactNode; children: ReactNode }) {
  return (
    <div>
      <div className="flex items-end justify-between gap-3"><label htmlFor={id} className="block text-base font-semibold text-white">{label}</label>{side}</div>
      {hint && <p id={`${id}-hint`} className={`text-sm ${muted}`}>{hint}</p>}
      <ErrLine id={`${id}-error`} msg={error} />
      <div className="mt-2">{children}</div>
    </div>
  );
}

export function Money({ id, value, onChange, onBlur, error, hint, big = false }: { id: string; value: number; onChange: (n: number) => void; onBlur: () => void; error?: string; hint?: boolean; big?: boolean }) {
  return (
    <div className="relative">
      <span aria-hidden className={`pointer-events-none absolute start-4 top-1/2 -translate-y-1/2 font-semibold text-sky-100/70 ${big ? "text-2xl" : ""}`}>$</span>
      <input id={id} type="number" inputMode="decimal" min={0} step="0.01" value={value || ""} placeholder="0.00" onChange={(e) => onChange(Number(e.target.value))} onBlur={onBlur}
        aria-invalid={!!error} aria-describedby={dsc(id, !!hint, error)} className={`${nField} font-semibold tabular-nums ${big ? "py-4 ps-10 font-display text-3xl" : "ps-8"} ${bad(error)}`} />
    </div>
  );
}

// Typed values become removable chips (Enter, comma or leaving the field adds one; Backspace removes the last).
// `site`: the site theme (light and dark) instead of the night look.
export function ChipInput({ id, values, onChange, placeholder, check, error, describedBy, site = false }: { id: string; values: string[]; onChange: (v: string[]) => void; placeholder: string; check?: (v: string) => string | undefined; error?: string; describedBy?: string; site?: boolean }) {
  const tx = useT();
  const [draft, setDraft] = useState("");
  const [own, setOwn] = useState<string>();
  const add = () => {
    const v = draft.trim().replace(/,$/, "");
    if (!v) return;
    const e = check?.(v);
    if (e) { setOwn(e); return; }
    if (!values.includes(v)) onChange([...values, v]);
    setDraft(""); setOwn(undefined);
  };
  const key = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") { e.preventDefault(); add(); }
    else if (e.key === "Backspace" && !draft && values.length) onChange(values.slice(0, -1));
  };
  const msg = own ?? error;
  const s = site
    ? { box: tx("bg-white focus-within:ring-emerald-600 focus-within:ring-offset-white dark:bg-white/5 dark:focus-within:ring-emerald-400 dark:focus-within:ring-offset-[#0E1424]"), border: msg ? "border-red-700 dark:border-red-400" : "border-slate-300 dark:border-white/20",
        chip: "bg-sky-100 text-sky-900 dark:bg-sky-400/15 dark:text-sky-100",
        x: `hover:bg-sky-200 dark:hover:bg-white/10 ${ring}`,
        // On the white input box itself.
        input: "text-slate-900 placeholder:text-slate-500 dark:text-white dark:placeholder:text-slate-400",
        err: "text-red-700 dark:text-red-400" }
    : { box: "bg-black/30 focus-within:ring-emerald-400 focus-within:ring-offset-[#0a1930]", border: msg ? "border-red-300" : "border-white/20", chip: "bg-sky-400/15 text-sky-100", x: `hover:bg-white/10 ${focusRing}`,
        input: "text-white placeholder:text-sky-100/60", err: "text-red-300" };
  return (
    <>
      {msg && <p id={`${id}-chip-error`} className={`mb-2 flex items-start gap-1.5 text-sm font-semibold ${s.err}`}><X aria-hidden className="mt-0.5 h-4 w-4 shrink-0" /><span><span className="sr-only">{tx("Error:")}{" "}</span>{msg}</span></p>}
      <div className={`flex min-h-[52px] flex-wrap items-center gap-2 rounded-xl border px-2.5 py-2 focus-within:ring-2 focus-within:ring-offset-2 ${s.box} ${s.border}`}>
        <ul className="contents">
          {values.map((v) => (
            <li key={v} className={`flex animate-pop items-center gap-1 rounded-full py-1 pe-1 ps-3 text-sm font-semibold ${s.chip}`}>
              {v.replace(/^(https?:\/\/)?t\.me\//i, "@")}
              <button type="button" onClick={() => onChange(values.filter((x) => x !== v))} aria-label={tx("Remove {0}", { 0: v })} className={`grid h-6 w-6 place-items-center rounded-full ${s.x}`}><X aria-hidden className="h-3.5 w-3.5" /></button>
            </li>
          ))}
        </ul>
        <input id={id} value={draft} onChange={(e) => { setDraft(e.target.value); setOwn(undefined); }} onKeyDown={key} onBlur={add} placeholder={values.length ? "" : placeholder} autoComplete="off" spellCheck={false} autoCapitalize="none"
          aria-invalid={!!msg} aria-describedby={[describedBy, msg && `${id}-chip-error`].filter(Boolean).join(" ") || undefined}
          className={`min-w-[10rem] flex-1 bg-transparent px-1.5 py-1 text-base outline-none ${s.input}`} />
      </div>
    </>
  );
}

export function RadioDot({ on }: { on: boolean }) {
  return <span aria-hidden className={`grid h-5 w-5 shrink-0 place-items-center rounded-full border-2 ${on ? "border-sky-400 bg-sky-400" : "border-white/40"}`}>{on && <Check className="h-3 w-3 text-[#0a1930]" strokeWidth={3} />}</span>;
}

export function Panel({ id, title, aside, children, className = "" }: { id: string; title: ReactNode; aside?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <section aria-labelledby={id} className={`${panel} space-y-6 p-6 sm:p-8 ${className}`}>
      <div className="flex items-center justify-between gap-4"><h2 id={id} className="font-display text-xl font-semibold text-white">{title}</h2>{aside}</div>
      {children}
    </section>
  );
}

// Bordered red box of links to each problem; takes focus when Continue finds problems.
export function AdErrors({ ad }: { ad: Ad }) {
  const tx = useT();
  if (!ad.submitted || !ad.errList.length) return null;
  return (
    <div ref={ad.summaryRef} tabIndex={-1} role="alert" className="rounded-2xl border-2 border-red-300 bg-red-950/60 p-5 outline-none">
      <h2 className="font-display text-lg font-semibold text-white">{tx("Please fix")}{" "}{ad.errList.length === 1 ? "this" : tx("these {0} things", { 0: ad.errList.length })}</h2>
      <ul className="mt-2 space-y-1">{ad.errList.map(([k, m]) => <li key={k}><a href={`#${ad.ids[k]}`} onClick={(e) => { e.preventDefault(); document.getElementById(ad.ids[k])?.focus(); }} className={`font-semibold text-red-200 underline underline-offset-2 ${focusRing}`}>{m}</a></li>)}</ul>
    </div>
  );
}

// ---------- Field groups ----------

export function PlacementCards({ ad, cols = "sm:grid-cols-2" }: { ad: Ad; cols?: string }) {
  const tx = useT();
  const name = useId();
  return (
    <fieldset>
      <legend className="sr-only">{tx("Where to show the ad")}</legend>
      <div className={`grid gap-2.5 ${cols}`}>
        {tx.tr(targets).map((t) => {
          const on = ad.target === t.id;
          return (
            <label key={t.id} className={`flex cursor-pointer items-start gap-3 rounded-2xl border-2 p-4 transition-colors ${hasFocusRing} ${on ? optOn : optOff}`}>
              <input type="radio" name={name} checked={on} onChange={() => ad.setTarget(t.id)} className="sr-only" />
              <span aria-hidden className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${on ? "bg-sky-400 text-[#0a1930]" : "bg-white/[.08] text-sky-200"}`}><t.icon className="h-5 w-5" /></span>
              <span className="min-w-0 flex-1"><span className="block font-semibold text-white">{t.label}</span><span className={`text-sm ${muted}`}>{t.hint}</span></span>
              <RadioDot on={on} />
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

export function AudienceFields({ ad }: { ad: Ad }) {
  const tx = useT();
  const { p, target } = ad;
  return (
    <>
      {target === "users" ? (
        <div className="grid gap-4 sm:grid-cols-2">
          <Field id={`${p}-country`} label={tx("Country")} hint={tx("Show the ad to people in this country.")}>
            <select id={`${p}-country`} value={ad.country} onChange={(e) => ad.setCountry(e.target.value)} aria-describedby={`${p}-country-hint`} className={`${nField} appearance-auto [&_option]:bg-[#0a1930]`}>{tx.tr(adCountries).map((x) => <option key={x}>{x}</option>)}</select>
          </Field>
          <Field id={`${p}-lang`} label={tx("Language")} hint={tx("The language of their Telegram app.")}>
            <select id={`${p}-lang`} value={ad.language} onChange={(e) => ad.setLanguage(e.target.value)} aria-describedby={`${p}-lang-hint`} className={`${nField} appearance-auto [&_option]:bg-[#0a1930]`}>{tx.tr(adLanguages).map((x) => <option key={x}>{x}</option>)}</select>
          </Field>
        </div>
      ) : (
        <div>
          <label htmlFor={`${p}-target`} className="block text-base font-semibold text-white">{target === "channels" ? tx("Target specific channels") : target === "bots" ? tx("Target specific bots") : tx("Search words")}</label>
          <p id={`${p}-target-hint`} className={`text-sm ${muted}`}>{target === "search" ? tx("Your ad shows when people search for these words. Press Enter after each one.") : tx("Links like t.me/{0}. Press Enter after each one.", { 0: target === "bots" ? "examplebot" : "technews" })}</p>
          <div className="mt-2">
            <ChipInput key={target} id={`${p}-target`} values={ad.list[target]} onChange={(v) => { ad.setList((l) => ({ ...l, [target]: v })); ad.touch("target"); }} error={ad.errors.target} describedBy={`${p}-target-hint`}
              placeholder={target === "search" ? tx("Type a word and press Enter") : `t.me/${target === "bots" ? "examplebot" : "channel"}`}
              check={target === "search" ? (v) => (v.length > 40 ? tx("Keep each search word under 40 characters") : undefined) : (v) => (TME.test(v) ? undefined : tx("Enter a link like t.me/name"))} />
          </div>
        </div>
      )}
      <p className="flex items-start gap-2 rounded-xl bg-amber-300/10 px-4 py-3 text-sm text-amber-50"><AlertTriangle aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-amber-300" />{tx("Where the ad shows can't be changed after it's created.")}</p>
    </>
  );
}

export function TextCounter({ ad }: { ad: Ad }) {
  const tx = useT();
  const left = tx.tr(AD_TEXT_MAX) - ad.text.length;
  return <span aria-live="polite" className={`text-sm tabular-nums ${left < 0 ? "font-semibold text-red-300" : left < 20 ? "text-amber-300" : "text-sky-100/70"}`}>{left}<span className="sr-only">{" "}{tx("characters left")}</span></span>;
}

export function PicToggle({ ad }: { ad: Ad }) {
  const tx = useT();
  return (
    <label className={`flex items-start gap-3 rounded-2xl border border-white/15 p-4 ${ad.isTg ? "cursor-pointer" : "opacity-60"}`}>
      <input type="checkbox" checked={ad.showPic && ad.isTg} disabled={!ad.isTg} onChange={(e) => ad.setShowPic(e.target.checked)} className={`mt-1 h-5 w-5 accent-sky-400 ${focusRing}`} />
      <span><span className="block font-semibold text-white">{tx("Show channel picture")}</span><span className={`text-sm ${muted}`}>{ad.isTg ? tx("Adds your channel's photo next to the title.") : tx("Only for t.me links.")}</span></span>
    </label>
  );
}

export function MediaField({ ad }: { ad: Ad }) {
  const tx = useT();
  const { p, media } = ad;
  return (
    <div>
      <span id={`${p}-media-label`} className="block text-base font-semibold text-white">{tx("Ad photo or video (optional)")}</span>
      <p id={`${p}-media-hint`} className={`text-sm ${muted}`}>{tx("A photo or short video, up to")}{" "}{MAX_MEDIA_MB}{" "}{tx("MB.")}</p>
      <ErrLine id={`${p}-media-error`} msg={ad.mediaErr} />
      <input ref={ad.fileRef} type="file" accept="image/*,video/*" className="sr-only" tabIndex={-1} aria-hidden onChange={(e) => { ad.onFile(e.target.files?.[0]); e.target.value = ""; }} />
      {media ? (
        <div className="mt-2 flex items-center gap-3 rounded-2xl border border-white/20 p-3">
          {media.type.startsWith("image") ? <img src={media.src} alt="" className="h-14 w-14 rounded-xl object-cover" /> : <video src={media.src} muted className="h-14 w-14 rounded-xl object-cover" />}
          <span className="min-w-0 flex-1 truncate font-medium text-white">{media.name}</span>
          <button type="button" onClick={() => ad.setMedia(null)} className={`rounded-lg px-3 py-1.5 text-sm font-semibold text-red-300 hover:bg-red-400/10 ${focusRing}`}>{tx("Remove")}</button>
        </div>
      ) : (
        <button id={`${p}-media`} type="button" onClick={() => ad.fileRef.current?.click()} aria-labelledby={`${p}-media-label`} aria-describedby={[`${p}-media-hint`, ad.mediaErr && `${p}-media-error`].filter(Boolean).join(" ")}
          className={`mt-2 flex w-full flex-col items-center justify-center gap-1.5 rounded-2xl border-2 border-dashed border-white/25 px-5 py-6 text-sky-50 transition-colors hover:border-sky-400 hover:bg-sky-400/[.06] ${focusRing}`}>
          <ImagePlus aria-hidden className="h-6 w-6 text-sky-300" /><span className="font-semibold">{tx("Upload photo or video")}</span>
        </button>
      )}
    </div>
  );
}

export function AdContentFields({ ad }: { ad: Ad }) {
  const tx = useT();
  const { p, errors } = ad;
  return (
    <>
      <Field id={`${p}-title`} label={tx("Ad title (optional)")} hint={tx("Shown in bold at the top. Usually your channel or brand name.")}>
        <input id={`${p}-title`} maxLength={40} value={ad.title} onChange={(e) => ad.setTitle(e.target.value)} placeholder={tx("E.g., My first ad")} aria-describedby={`${p}-title-hint`} className={nField} />
      </Field>
      <Field id={`${p}-text`} label={tx("Ad text")} hint={tx("Plain text. Say what you offer and why to open it.")} error={errors.text} side={<TextCounter ad={ad} />}>
        <textarea id={`${p}-text`} rows={3} value={ad.text} onChange={(e) => ad.setText(e.target.value)} onBlur={() => ad.touch("text")}
          aria-invalid={!!errors.text} aria-describedby={dsc(`${p}-text`, true, errors.text)} className={`${nField} resize-y ${bad(errors.text)}`} />
      </Field>
      <Field id={`${p}-url`} label={tx("URL you want to promote")} hint={tx("A public channel, a bot, or a website starting with https://")} error={errors.url}>
        <input id={`${p}-url`} inputMode="url" spellCheck={false} autoCapitalize="none" value={ad.url} onChange={(e) => ad.setUrl(e.target.value)} onBlur={() => ad.touch("url")} placeholder={tx("t.me/yourchannel")}
          aria-invalid={!!errors.url} aria-describedby={dsc(`${p}-url`, true, errors.url)} className={`${nField} ${bad(errors.url)}`} />
      </Field>
      <PicToggle ad={ad} />
      <MediaField ad={ad} />
    </>
  );
}

export function CpmBudgetFields({ ad, budget = true }: { ad: Ad; budget?: boolean }) {
  const usd = useMoney().format;
  const tx = useT();
  const { p, errors } = ad;
  return (
    <>
      <div className={`grid gap-6 ${budget ? "sm:grid-cols-2" : ""}`}>
        <Field id={`${p}-cpm`} label={tx("CPM")} hint={tx("Price per 1,000 views. From {0}; most ads use {1}–{2}.", { 0: usd(MIN_CPM), 1: usd(2), 2: usd(4) })} error={errors.cpm}>
          <Money id={`${p}-cpm`} value={ad.cpm} onChange={ad.setCpm} onBlur={() => ad.touch("cpm")} error={errors.cpm} hint />
        </Field>
        {budget && (
          <Field id={`${p}-budget`} label={tx("Budget")} hint={tx("From {0}. Unspent money is refunded.", { 0: usd(AD_MIN_BUDGET) })} error={errors.budget}>
            <Money id={`${p}-budget`} value={ad.budget} onChange={ad.setBudget} onBlur={() => ad.touch("budget")} error={errors.budget} hint />
          </Field>
        )}
      </div>
      <DailyLimit ad={ad} />
    </>
  );
}

export function DailyLimit({ ad }: { ad: Ad }) {
  const tx = useT();
  const { p, errors } = ad;
  return (
    <div>
      <button type="button" onClick={() => { ad.setDailyOn(!ad.dailyOn); ad.setDaily(0); }} aria-expanded={ad.dailyOn} aria-controls={`${p}-daily-wrap`} className={linkBtn}>{ad.dailyOn ? tx("Remove daily limit") : tx("Set a daily limit")}</button>
      <div id={`${p}-daily-wrap`} hidden={!ad.dailyOn} className="mt-3 max-w-xs">
        {ad.dailyOn && <Field id={`${p}-daily`} label={tx("Daily limit")} hint={tx("The most it can spend in one day.")} error={errors.daily}><Money id={`${p}-daily`} value={ad.daily} onChange={ad.setDaily} onBlur={() => ad.touch("daily")} error={errors.daily} hint /></Field>}
      </div>
    </div>
  );
}

export function ScheduleFields({ ad }: { ad: Ad }) {
  const tx = useT();
  const { p, errors } = ad;
  const perName = useId(), statusName = useId();
  return (
    <>
      <fieldset>
        <legend className="text-base font-semibold text-white">{tx("Daily views limit per person")}</legend>
        <p className={`text-sm ${muted}`}>{tx("How many times a day one person can see it.")}</p>
        <div className="mt-2 grid grid-cols-4 gap-2">
          {[1, 2, 3, 4].map((n) => (
            <label key={n} className={`cursor-pointer rounded-xl border-2 py-2.5 text-center font-semibold tabular-nums text-white transition-colors ${hasFocusRing} ${ad.perUser === n ? optOn : optOff}`}>
              <input type="radio" name={perName} checked={ad.perUser === n} onChange={() => ad.setPerUser(n)} className="sr-only" />{n}
            </label>
          ))}
        </div>
      </fieldset>
      <fieldset>
        <legend className="text-base font-semibold text-white">{tx("When Telegram approves it")}</legend>
        <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
          {([["active", tx("Start right away"), tx("Runs as soon as it's approved")], ["hold", tx("Keep on hold"), tx("You start it from your orders")]] as const).map(([id, l, h]) => {
            const on = ad.status === id;
            return (
              <label key={id} className={`flex cursor-pointer items-start gap-3 rounded-2xl border-2 p-4 transition-colors ${hasFocusRing} ${on ? optOn : optOff}`}>
                <input type="radio" name={statusName} checked={on} onChange={() => ad.setStatus(id)} className="sr-only" />
                <RadioDot on={on} />
                <span><span className="block font-semibold text-white">{l}</span><span className={`text-sm ${muted}`}>{h}</span></span>
              </label>
            );
          })}
        </div>
      </fieldset>
      <div>
        <button type="button" onClick={() => { ad.setStartOn(!ad.startOn); ad.setStart(""); }} aria-expanded={ad.startOn} aria-controls={`${p}-start-wrap`} className={`flex items-center gap-1.5 ${linkBtn}`}>
          <CalendarDays aria-hidden className="h-4 w-4" />{ad.startOn ? tx("No start date") : tx("Set a start date")}
        </button>
        <div id={`${p}-start-wrap`} hidden={!ad.startOn} className="mt-3 max-w-xs">
          {ad.startOn && <Field id={`${p}-start`} label={tx("Start date")} error={errors.start}><input id={`${p}-start`} type="date" min={ad.today} value={ad.start} onChange={(e) => ad.setStart(e.target.value)} onBlur={() => ad.touch("start")} aria-invalid={!!errors.start} aria-describedby={dsc(`${p}-start`, false, errors.start)} className={`${nField} ${bad(errors.start)}`} /></Field>}
        </div>
      </div>
    </>
  );
}

// ---------- Preview ----------

const tg = { bg: "bg-[#0e1621]", head: "bg-[#17212b]", bubble: "bg-[#182533]", blue: "text-[#6ab3f3]" };

// The sponsored message itself. Arrives once (rises into place) when the ad becomes complete.
export function AdBubble({ ad, className = "max-w-[88%]" }: { ad: Ad; className?: string }) {
  const tx = useT();
  const { media } = ad;
  return (
    <div key={ad.ready ? "ready" : "draft"} className={`${className} overflow-hidden rounded-2xl rounded-es-md ${tg.bubble} text-[14px] leading-snug text-slate-100 ${ad.ready ? "animate-arrive" : ""}`}>
      {media && (media.type.startsWith("image") ? <img src={media.src} alt="" className="max-h-44 w-full object-cover" /> : <video src={media.src} muted autoPlay loop playsInline className="max-h-44 w-full object-cover" />)}
      <div className="px-3.5 py-2.5">
        <span className="flex items-center justify-between gap-3">
          <span className="flex min-w-0 items-center gap-2">
            {ad.showPic && ad.isTg && <span aria-hidden className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-gradient-to-br from-sky-400 to-indigo-500 text-[11px] font-bold text-white">{ad.name.slice(0, 1).toUpperCase()}</span>}
            <span className={`truncate font-semibold ${tg.blue}`}>{ad.name}</span>
          </span>
          <span className="text-[11px] font-medium text-slate-400">{tx("Ad")}</span>
        </span>
        <span className={`mt-1 block whitespace-pre-wrap break-words ${ad.text.trim() ? "" : "text-slate-400"}`}>{ad.text.trim() ? ad.text.slice(0, tx.tr(AD_TEXT_MAX)) : tx("Your ad text appears here.")}</span>
        <span className={`mt-2.5 block rounded-lg bg-[#6ab3f3]/10 py-2 text-center text-sm font-semibold ${tg.blue}`}>{ad.button}</span>
      </div>
    </div>
  );
}

// Where the ad lands, drawn for the chosen placement: a channel, a bot chat, or search results.
export function AdPreview({ ad, bare = false, className = "" }: { ad: Ad; bare?: boolean; className?: string }) {
  const tx = useT();
  const t = ad.target;
  return (
    <figure aria-label={tx("Ad preview")} className={`overflow-hidden ${bare ? "" : "rounded-[1.75rem] border border-white/10"} ${tg.bg} ${className}`}>
      <div key={t} className="animate-fade-up [animation-duration:450ms]">
        {t === "search" ? (
          <>
            <div className={`${tg.head} px-4 py-3`}><div className="flex items-center gap-2 rounded-full bg-black/25 px-3 py-2 text-sm text-slate-300"><Search aria-hidden className="h-4 w-4" />{ad.list.search[0] ?? tx("crypto news")}</div></div>
            <ul className="divide-y divide-white/5">
              <li className="flex items-start gap-3 bg-[#6ab3f3]/[.06] px-4 py-3">
                <span aria-hidden className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gradient-to-br from-sky-400 to-indigo-500 font-bold text-white">{ad.name.slice(0, 1).toUpperCase()}</span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center justify-between gap-2"><span className={`truncate text-sm font-semibold ${tg.blue}`}>{ad.name}</span><span className="rounded bg-white/10 px-1.5 text-[10px] font-semibold text-slate-300">{tx("Ad")}</span></span>
                  <span className={`line-clamp-2 text-[13px] ${ad.text.trim() ? "text-slate-200" : "text-slate-400"}`}>{ad.text.trim() || tx("Your ad text appears here.")}</span>
                </span>
              </li>
              {[[tx("Daily Markets"), tx("214K subscribers")], [tx("Coin Digest"), tx("88K subscribers")]].map(([n, s]) => (
                <li key={n} className="flex items-center gap-3 px-4 py-3"><span aria-hidden className="h-10 w-10 shrink-0 rounded-full bg-white/10" /><span><span className="block text-sm font-semibold text-slate-100">{n}</span><span className="block text-[13px] text-slate-400">{s}</span></span></li>
              ))}
            </ul>
          </>
        ) : (
          <>
            <div className={`flex items-center gap-3 ${tg.head} px-4 py-3 text-white`}>
              <span aria-hidden className={`grid h-9 w-9 place-items-center rounded-full text-sm font-bold text-white ${t === "bots" ? "bg-[#e17076]" : "bg-gradient-to-br from-emerald-400 to-teal-600"}`}>{t === "bots" ? <Bot className="h-4 w-4" /> : "TN"}</span>
              <span className="min-w-0"><span className="block truncate text-sm font-semibold">{t === "bots" ? tx("Weather Bot") : tx("Tech News Daily")}</span><span className="block text-xs text-slate-400">{t === "bots" ? "bot" : tx("128,450 subscribers")}</span></span>
            </div>
            <div className="space-y-2 p-4">
              <div className={`flex max-w-[85%] items-end gap-3 rounded-2xl rounded-es-md ${tg.bubble} px-3.5 py-2 text-[14px] leading-snug text-slate-200`}>
                <span className="min-w-0 truncate">{t === "bots" ? tx("Tomorrow in Berlin: 14° and light rain.") : tx("New phones this week: what changed.")}</span>
                <span className="shrink-0 text-[11px] text-slate-400">{t === "bots" ? "09:12" : "12:04"}</span>
              </div>
              <div aria-live="polite"><AdBubble ad={ad} /></div>
            </div>
          </>
        )}
      </div>
      <figcaption className="sr-only">{t === "search" ? tx("Your ad as the first search result") : t === "bots" ? tx("Your ad inside a bot chat") : tx("Your ad as a sponsored message under a channel post")}</figcaption>
    </figure>
  );
}

function TweenNum({ value }: { value: number }) {
  const v = useTween(value);
  return <><span aria-hidden>{fmt(Math.round(v))}</span><span className="sr-only">{fmt(value)}</span></>;
}

export function Estimate({ ad }: { ad: Ad }) {
  const tx = useT();
  return (
    <div className="grid grid-cols-2 gap-3">
      <div className="rounded-2xl bg-white/[.06] p-4"><div className={`flex items-center gap-1.5 text-sm ${muted}`}><Eye aria-hidden className="h-4 w-4" />{tx("Views")}</div><div className="font-display text-2xl font-bold tabular-nums text-white">~<TweenNum value={ad.views} /></div></div>
      <div className="rounded-2xl bg-white/[.06] p-4"><div className={`flex items-center gap-1.5 text-sm ${muted}`}><MousePointerClick aria-hidden className="h-4 w-4" />{tx("Clicks")}</div><div className="font-display text-2xl font-bold tabular-nums text-white"><TweenNum value={ad.lo} />–<TweenNum value={ad.hi} /></div></div>
    </div>
  );
}

// ---------- Sidebar ----------

// One panel so it fits a laptop screen while sticky: the preview on top, a one-line estimate, the summary rows,
// the budget and the green Continue.
export function OrderCard({ ad, preview = true, estimate = true }: { ad: Ad; preview?: boolean; estimate?: boolean }) {
  const usd = useMoney().format;
  const tx = useT();
  const sample = usePathname()?.startsWith("/design") ?? false;
  const blocker = ad.submitted && ad.errList.length ? tx("Fix {0} above to continue", { 0: ad.errList.length === 1 ? tx("1 thing") : tx("{0} things", { 0: ad.errList.length }) }) : "";
  return (
    <section aria-labelledby={`${ad.p}-order`} className={`${panel} overflow-hidden`}>
      <h2 id={`${ad.p}-order`} className={preview ? "sr-only" : "px-6 pt-6 font-display text-lg font-semibold text-white"}>{tx("Your ad")}</h2>
      {preview && <AdPreview ad={ad} bare />}
      <div className="px-6 pb-6 pt-4">
        {estimate && (
          <p aria-live="polite" className="flex flex-wrap items-center gap-x-4 gap-y-1 border-b border-white/10 pb-3 text-[15px] text-white">
            <span className="flex items-center gap-1.5"><Eye aria-hidden className="h-4 w-4 text-sky-300" /><span className="font-semibold tabular-nums">~<TweenNum value={ad.views} /></span>{" "}{tx("views")}</span>
            <span className="flex items-center gap-1.5"><MousePointerClick aria-hidden className="h-4 w-4 text-sky-300" /><span className="font-semibold tabular-nums"><TweenNum value={ad.lo} />–<TweenNum value={ad.hi} /></span>{" "}{tx("clicks")}</span>
          </p>
        )}
        <dl className="divide-y divide-white/10 text-[15px]">
          {([[tx("Shown in"), ad.placement.label], [tx("Audience"), ad.reach || "—"], ["CPM", usd(ad.cpm || 0)], [tx("Starts"), ad.startsLabel]] as const).map(([k, v]) => (
            <div key={k} className="flex justify-between gap-4 py-2"><dt className="shrink-0 text-sky-100/70">{k}</dt><dd className="min-w-0 truncate text-end font-medium tabular-nums text-white">{v}</dd></div>
          ))}
        </dl>
        <div aria-live="polite" className="mt-1 flex items-baseline justify-between border-t border-white/10 pt-3"><span className="text-sky-100/70">{tx("Budget")}</span><span className="font-display text-2xl font-bold tabular-nums text-white">{usd(ad.budget || 0)}</span></div>
        <button type="submit" className={`${primary} mt-4 w-full tabular-nums`}>{tx("Continue ·")}{" "}{usd(ad.budget || 0)}</button>
        <p role="status" className="mt-2.5 text-center text-sm font-semibold text-red-300 empty:hidden">{blocker}</p>
        <p className="mt-2.5 text-center text-sm text-sky-100/70">{tx("Wallet, card or crypto next. Refunded if rejected.")}</p>
        {sample && <p className="mt-1 text-center text-xs text-sky-100/60">{tx("Sample prices and estimates (design preview)")}</p>}
      </div>
    </section>
  );
}

// ---------- Page frame ----------

const dots = Array.from({ length: 40 }, (_, i) => ({ x: (i * 37 + 11) % 100, y: (i * 53 + 7) % 100, s: (i % 3) + 1, o: 0.2 + (i % 4) * 0.12 }));

// The always-dark top section: still dots, the title row, the trust row, then the form with the sidebar.
// On phones a bar jumps to the order card. Below the top: how it works, rules and FAQ in the site theme.
export function AdsNightPage({ ad, art, sub, left, side, sideWidth = "380px" }: { ad: Ad; art?: ReactNode; sub?: ReactNode; left: ReactNode; side?: ReactNode; sideWidth?: string }) {
  const usd = useMoney().format;
  const tx = useT();
  const extras = useHasExtras();
  const sideRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = sideRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.2 });
    io.observe(el);
    return () => io.disconnect();
  }, [ad.c.order]);
  if (ad.c.order) return <PageShell><div className="px-6 py-14"><TgOrderView o={ad.c.order} onAgain={ad.c.reset} /></div></PageShell>;
  const go = () => { const b = sideRef.current?.querySelector<HTMLButtonElement>("button[type=submit]"); b?.scrollIntoView({ behavior: "smooth", block: "center" }); b?.focus({ preventScroll: true }); };

  return (
    <PageShell heroDark>
      <section aria-labelledby={`${ad.p}-h1`} className={`dark relative -mt-16 overflow-hidden pb-16 pt-24 [color-scheme:dark] selection:bg-sky-300 selection:text-sky-950 sm:pt-28 [&_input]:caret-sky-300 [&_textarea]:caret-sky-300 ${adsNightBg}`}>
        <div aria-hidden className="pointer-events-none absolute inset-0">
          {dots.map((d, i) => <span key={i} className="absolute rounded-full bg-sky-100" style={{ left: `${d.x}%`, top: `${d.y}%`, width: d.s, height: d.s, opacity: d.o }} />)}
        </div>
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex items-center justify-between gap-5">
            <div className="min-w-0">
              <h1 id={`${ad.p}-h1`} className="text-balance font-display text-3xl font-bold tracking-tight text-white sm:text-5xl">{tx("Create a Telegram ad")}</h1>
              <p className="mt-2 max-w-2xl text-base leading-relaxed text-sky-100 sm:mt-3 sm:text-lg">{sub ?? tx.tr(tgHeadings).ads.sub}</p>
            </div>
            {art ?? <div className="hidden sm:block"><ServiceIcon s="ads" size="lg" /></div>}
          </div>
          <div className="mt-4 sm:mt-6 [&_li]:text-sky-50"><Trust light items={[tx("No TON or Fragment needed"), tx("Refund if rejected"), tx("Stop any time")]} /></div>

          <form noValidate onSubmit={(e) => { e.preventDefault(); ad.proceed(); }} className="mt-8 grid grid-cols-[minmax(0,1fr)] gap-6 sm:mt-10 lg:gap-8" style={{ ["--side" as string]: sideWidth }}>
            <div className="grid grid-cols-[minmax(0,1fr)] gap-6 lg:grid-cols-[minmax(0,1fr)_var(--side)] lg:gap-8">
              <div className="min-w-0 space-y-6">{left}</div>
              <div ref={sideRef} className="lg:self-start lg:[@media(min-height:740px)]:sticky lg:[@media(min-height:740px)]:top-24">{side ?? <OrderCard ad={ad} />}</div>
            </div>
          </form>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 pb-28 pt-16 sm:px-6">
        <section aria-labelledby={`${ad.p}-how`}><H2 id={`${ad.p}-how`}>{tx("How it works")}</H2><div className="mt-6"><HowItWorks /></div></section>
        <div className="mt-10 max-w-3xl"><Rules /></div>
        {!extras && <section aria-labelledby={`${ad.p}-faq`} className="mt-16 max-w-3xl"><H2 id={`${ad.p}-faq`}>{tx("Common questions")}</H2><div className="mt-6"><TgFaq s="ads" /></div></section>}
      </div>

      <div className={`fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-[#0a1930] px-4 py-3 text-white shadow-[0_-8px_24px_-12px_rgba(0,0,0,.6)] transition-transform duration-300 lg:hidden ${inView ? "translate-y-full" : "translate-y-0"}`} aria-hidden={inView} inert={inView}>
        <div className="mx-auto flex max-w-xl items-center justify-between gap-4">
          <span className="min-w-0"><span className="block truncate text-sm text-sky-100/75">{ad.placement.label}{" "}{tx("· about")}{" "}{fmt(ad.views)}{" "}{tx("views")}</span><span className="font-display text-xl font-bold tabular-nums">{usd(ad.budget || 0)}</span></span>
          <button type="button" onClick={go} className={`shrink-0 whitespace-nowrap rounded-xl border border-white/25 px-4 py-2.5 font-semibold ${focusRing}`}>{tx("Review order")}</button>
        </div>
      </div>

      <CheckoutModal open={ad.c.payOpen} onClose={ad.c.closePay} price={ad.budget} itemLabel={tx("Ad budget")} payLabel={tx("Pay and create")} note={tx("Telegram reviews the ad in about 24 hours. If it's rejected and can't be fixed, you're refunded in full.")}
        onPay={(m) => ad.c.finish({ service: "ads", title: tx("Telegram Ads · {0}", { 0: ad.title.trim() || "New ad" }), detail: tx("CPM {0} · about {1} views", { 0: usd(ad.cpm), 1: fmt(ad.views) }), total: ad.budget, to: ad.url.trim(), paidWith: m })}
        summary={<><ServiceIcon s="ads" /><div className="min-w-0 flex-1"><div className="truncate font-semibold text-slate-900 dark:text-white">{tx("Telegram Ads ·")}{" "}{usd(ad.budget)}</div><div className="truncate text-xs text-slate-500 dark:text-slate-400">{ad.url} · {ad.placement.label}</div></div></>} />
    </PageShell>
  );
}
