"use client";
import { useEffect, useId, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { AlertTriangle, Bot, CalendarDays, Check, Eye, ImagePlus, Megaphone, MousePointerClick, Search, Users, X } from "lucide-react";
import CheckoutModal from "@/components/checkout/CheckoutModal";
import { useMoney } from "@/lib/money";
import { AD_MAX_BUDGET, AD_MIN_BUDGET, AD_TEXT_MAX, adCountries, adLanguages, estClicks, estViews, fmt, tgHeadings } from "@/content/telegram-en";
import { PageShell } from "../otp/parts";
import { useHasExtras } from "../service/slot";
import { accent, card, field, H2, ring, ServiceIcon, SumRows, TgFaq, TgOrderView, Title, Trust, useCheckout } from "./parts";
import { HowItWorks, Rules } from "./ads";

// Ads F — "Telegram Ads Fields": every field of Telegram's own ad form (ads.telegram.org), in dollars, laid out
// like the site's other service pages: title and trust line, numbered cards on the left (where to show it, your
// ad, budget and schedule), and the preview, summary and Pay in a sticky sidebar. How it works, rules and FAQ below.

type Target = "channels" | "bots" | "search" | "users";
const targets: { id: Target; label: string; hint: string; icon: typeof Megaphone }[] = [
  { id: "channels", label: "Channels", hint: "At the end of posts in public channels", icon: Megaphone },
  { id: "bots", label: "Bots", hint: "Inside bots and mini apps", icon: Bot },
  { id: "search", label: "Search", hint: "In Telegram search results", icon: Search },
  { id: "users", label: "Users", hint: "To people by country and language", icon: Users },
];
const MIN_CPM = 0.5; // placeholder
const TME = /^(https?:\/\/)?t\.me\/[a-zA-Z][a-zA-Z0-9_]{4,31}\/?$/i;
const SITE = /^https:\/\/[^\s.]+\.[^\s]{2,}$/i;
const MAX_MEDIA_MB = 10;

type Errors = Partial<Record<"text" | "url" | "media" | "cpm" | "budget" | "daily" | "target" | "start", string>>;

// ---------- Small pieces ----------

function Field({ id, label, hint, error, side, children }: { id: string; label: string; hint?: ReactNode; error?: string; side?: ReactNode; children: ReactNode }) {
  return (
    <div>
      <div className="flex items-end justify-between gap-3"><label htmlFor={id} className="block text-base font-semibold text-slate-900 dark:text-white">{label}</label>{side}</div>
      {hint && <p id={`${id}-hint`} className="text-sm text-slate-600 dark:text-slate-400">{hint}</p>}
      {error && <p id={`${id}-error`} className="mt-1 flex items-start gap-1.5 text-sm font-semibold text-red-700 dark:text-red-400"><X aria-hidden className="mt-0.5 h-4 w-4 shrink-0" /><span><span className="sr-only">Error: </span>{error}</span></p>}
      <div className="mt-2">{children}</div>
    </div>
  );
}
const dsc = (id: string, hint: boolean, error?: string) => [hint && `${id}-hint`, error && `${id}-error`].filter(Boolean).join(" ") || undefined;
const bad = (e?: string) => (e ? "!border-red-700 dark:!border-red-400" : "");

function Money({ id, value, onChange, onBlur, error, hint }: { id: string; value: number; onChange: (n: number) => void; onBlur: () => void; error?: string; hint?: boolean }) {
  return (
    <div className="relative">
      <span aria-hidden className="pointer-events-none absolute start-4 top-1/2 -translate-y-1/2 font-semibold text-slate-500">$</span>
      <input id={id} type="number" inputMode="decimal" min={0} step="0.01" value={value || ""} placeholder="0.00" onChange={(e) => onChange(Number(e.target.value))} onBlur={onBlur}
        aria-invalid={!!error} aria-describedby={dsc(id, !!hint, error)} className={`${field} ps-8 font-semibold ${bad(error)}`} />
    </div>
  );
}

// Typed values become removable chips (Enter, comma or leaving the field adds one; Backspace removes the last).
function ChipInput({ id, values, onChange, placeholder, check, error, describedBy }: { id: string; values: string[]; onChange: (v: string[]) => void; placeholder: string; check?: (v: string) => string | undefined; error?: string; describedBy?: string }) {
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
  return (
    <>
      {msg && <p id={`${id}-chip-error`} className="mb-2 flex items-start gap-1.5 text-sm font-semibold text-red-700 dark:text-red-400"><X aria-hidden className="mt-0.5 h-4 w-4 shrink-0" /><span><span className="sr-only">Error: </span>{msg}</span></p>}
      <div className={`flex min-h-[52px] flex-wrap items-center gap-2 rounded-xl border bg-white px-2.5 py-2 focus-within:ring-2 focus-within:ring-emerald-600 dark:bg-white/5 dark:focus-within:ring-emerald-400 ${msg ? "border-red-700 dark:border-red-400" : "border-slate-300 dark:border-white/20"}`}>
        <ul className="contents">
          {values.map((v) => (
            <li key={v} className="flex animate-pop items-center gap-1 rounded-full bg-sky-100 py-1 pe-1 ps-3 text-sm font-semibold text-sky-900 dark:bg-sky-400/15 dark:text-sky-200">
              {v.replace(/^(https?:\/\/)?t\.me\//i, "@")}
              <button type="button" onClick={() => onChange(values.filter((x) => x !== v))} aria-label={`Remove ${v}`} className={`grid h-6 w-6 place-items-center rounded-full hover:bg-sky-200 dark:hover:bg-white/10 ${ring}`}><X aria-hidden className="h-3.5 w-3.5" /></button>
            </li>
          ))}
        </ul>
        <input id={id} value={draft} onChange={(e) => { setDraft(e.target.value); setOwn(undefined); }} onKeyDown={key} onBlur={add} placeholder={values.length ? "" : placeholder} autoComplete="off" spellCheck={false} autoCapitalize="none"
          aria-invalid={!!msg} aria-describedby={[describedBy, msg && `${id}-chip-error`].filter(Boolean).join(" ") || undefined}
          className="min-w-[10rem] flex-1 bg-transparent px-1.5 py-1 text-base text-slate-900 outline-none placeholder:text-slate-500 dark:text-white dark:placeholder:text-slate-400" />
      </div>
    </>
  );
}

function RadioDot({ on }: { on: boolean }) {
  return <span aria-hidden className={`grid h-5 w-5 shrink-0 place-items-center rounded-full border-2 ${on ? "border-sky-600 bg-sky-600 dark:border-sky-400 dark:bg-sky-400" : "border-slate-400"}`}>{on && <Check className="h-3 w-3 text-white dark:text-sky-950" strokeWidth={3} />}</span>;
}

// ---------- Page ----------

export default function AdsF() {
  const usd = useMoney().format;
  const c = useCheckout();
  const extras = useHasExtras();
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
  const [status, setStatus] = useState<"active" | "hold">("hold");
  const [startOn, setStartOn] = useState(false);
  const [start, setStart] = useState("");
  const [list, setList] = useState<Record<"channels" | "bots" | "search", string[]>>({ channels: [], bots: [], search: [] });
  const [country, setCountry] = useState("Worldwide");
  const [language, setLanguage] = useState("Any");
  const [touched, setTouched] = useState<Partial<Record<keyof Errors, boolean>>>({});
  const [submitted, setSubmitted] = useState(0);
  const fileRef = useRef<HTMLInputElement>(null);
  const summaryRef = useRef<HTMLDivElement>(null);
  const targetName = useId(), perName = useId(), statusName = useId();

  const today = new Date().toISOString().slice(0, 10);
  const isTg = TME.test(url.trim());
  const all: Errors = {};
  if (!text.trim()) all.text = "Write the text of your ad";
  else if (text.length > AD_TEXT_MAX) all.text = `Ad text can be at most ${AD_TEXT_MAX} characters`;
  if (!url.trim()) all.url = "Enter the link you want to promote";
  else if (!isTg && !SITE.test(url.trim())) all.url = "Enter a t.me link or a website starting with https://";
  if (mediaErr) all.media = mediaErr;
  if (!(cpm >= MIN_CPM)) all.cpm = `CPM must be at least ${usd(MIN_CPM)}`;
  if (!(budget >= AD_MIN_BUDGET)) all.budget = `The smallest budget is ${usd(AD_MIN_BUDGET)}`;
  else if (budget > AD_MAX_BUDGET) all.budget = `For more than ${usd(AD_MAX_BUDGET)}, contact us`;
  if (dailyOn && !(daily > 0)) all.daily = "Enter a daily limit, or remove it";
  else if (dailyOn && daily > budget) all.daily = "The daily limit can't be more than the budget";
  if (target !== "users" && !list[target].length) all.target = target === "search" ? "Add at least one search word" : `Add at least one ${target === "bots" ? "bot" : "channel"}`;
  if (startOn && (!start || start < today)) all.start = "Choose today or a later date";
  const errors = Object.fromEntries(Object.entries(all).filter(([k]) => submitted || touched[k as keyof Errors])) as Errors;
  const touch = (k: keyof Errors) => setTouched((t) => ({ ...t, [k]: true }));

  useEffect(() => () => { if (media) URL.revokeObjectURL(media.src); }, [media]);
  useEffect(() => { if (submitted && Object.keys(all).length) summaryRef.current?.focus(); }, [submitted]); // eslint-disable-line react-hooks/exhaustive-deps

  if (c.order) return <PageShell><div className="px-6 py-14"><TgOrderView o={c.order} onAgain={c.reset} /></div></PageShell>;

  const views = estViews(budget || 0, cpm || MIN_CPM);
  const [lo, hi] = estClicks(views);
  const button = isTg ? (/bot\/?$/i.test(url) ? "Start bot" : "View channel") : url.trim() ? "Open link" : "Open";
  const name = title.trim() || url.replace(/^(https?:\/\/)?(t\.me\/)?/i, "").replace(/\/$/, "") || "Your channel";

  const onFile = (f?: File) => {
    if (!f) return;
    if (!/^(image|video)\//.test(f.type)) { setMediaErr("Choose a photo or a video"); return; }
    if (f.size > MAX_MEDIA_MB * 1024 * 1024) { setMediaErr(`The file must be ${MAX_MEDIA_MB} MB or smaller`); return; }
    setMediaErr(undefined); setMedia({ name: f.name, type: f.type, src: URL.createObjectURL(f) });
  };
  const pay = () => { setSubmitted((n) => n + 1); if (!Object.keys(all).length) c.openPay(); };

  const reach = target === "users" ? `people in ${country === "Worldwide" ? "every country" : country}${language !== "Any" ? ` using Telegram in ${language}` : ""}`
    : list[target].length ? `${list[target].length} ${target === "search" ? "search word" : target === "bots" ? "bot" : "channel"}${list[target].length > 1 ? "s" : ""}` : "";
  const errList = Object.entries(all) as [keyof Errors, string][];
  const ids: Record<keyof Errors, string> = { text: "af-text", url: "af-url", media: "af-media", cpm: "af-cpm", budget: "af-budget", daily: "af-daily", target: target === "users" ? "af-country" : "af-target", start: "af-start" };

  return (
    <PageShell>
      <div className="mx-auto max-w-6xl px-4 pb-24 pt-14 sm:px-6">
        <Title s="ads" sub={tgHeadings.ads.sub}>Create a Telegram ad</Title>
        <div className="mt-6"><Trust items={["No TON or Fragment needed", "Refund if rejected", "Stop any time"]} /></div>

        <div className="mt-10 grid grid-cols-[minmax(0,1fr)] gap-8 lg:grid-cols-[minmax(0,1fr)_380px]">
          <div className="space-y-6">
            {submitted > 0 && errList.length > 0 && (
              <div ref={summaryRef} tabIndex={-1} role="alert" className="rounded-2xl border-2 border-red-700 bg-red-50 p-5 outline-none dark:border-red-400 dark:bg-red-500/10">
                <h2 className="font-display text-lg font-semibold text-slate-900 dark:text-white">Please fix {errList.length === 1 ? "this" : `these ${errList.length} things`}</h2>
                <ul className="mt-2 space-y-1">{errList.map(([k, m]) => <li key={k}><a href={`#${ids[k]}`} onClick={(e) => { e.preventDefault(); document.getElementById(ids[k])?.focus(); }} className={`font-semibold text-red-800 underline underline-offset-2 dark:text-red-300 ${ring}`}>{m}</a></li>)}</ul>
              </div>
            )}

            {/* 1 · Where */}
            <section aria-labelledby="af-s1" className={`${card} space-y-6 p-6 sm:p-8`}>
              <H2 id="af-s1" className="text-xl">1 · Where to show it</H2>
              <fieldset>
                <legend className="sr-only">Where to show the ad</legend>
                <div className="grid gap-2.5 sm:grid-cols-2">
                  {targets.map((t) => {
                    const on = target === t.id;
                    return (
                      <label key={t.id} className={`flex cursor-pointer items-start gap-3 rounded-2xl border-2 p-4 transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-sky-500 ${on ? `${accent.ads.border} bg-sky-50 dark:bg-sky-400/10` : "border-slate-200 hover:border-slate-400 dark:border-white/15 dark:hover:border-white/40"}`}>
                        <input type="radio" name={targetName} checked={on} onChange={() => setTarget(t.id)} className="sr-only" />
                        <span aria-hidden className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${on ? "bg-sky-600 text-white dark:bg-sky-500 dark:text-sky-950" : accent.ads.soft}`}><t.icon className="h-5 w-5" /></span>
                        <span className="min-w-0 flex-1"><span className="block font-semibold text-slate-900 dark:text-white">{t.label}</span><span className="text-sm text-slate-600 dark:text-slate-400">{t.hint}</span></span>
                        <RadioDot on={on} />
                      </label>
                    );
                  })}
                </div>
              </fieldset>

              {target === "users" ? (
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field id="af-country" label="Country" hint="Show the ad to people in this country.">
                    <select id="af-country" value={country} onChange={(e) => setCountry(e.target.value)} aria-describedby="af-country-hint" className={`${field} appearance-auto`}>{adCountries.map((x) => <option key={x}>{x}</option>)}</select>
                  </Field>
                  <Field id="af-lang" label="Language" hint="The language of their Telegram app.">
                    <select id="af-lang" value={language} onChange={(e) => setLanguage(e.target.value)} aria-describedby="af-lang-hint" className={`${field} appearance-auto`}>{adLanguages.map((x) => <option key={x}>{x}</option>)}</select>
                  </Field>
                </div>
              ) : (
                <div>
                  <label htmlFor="af-target" className="block text-base font-semibold text-slate-900 dark:text-white">{target === "channels" ? "Target specific channels" : target === "bots" ? "Target specific bots" : "Search words"}</label>
                  <p id="af-target-hint" className="text-sm text-slate-600 dark:text-slate-400">{target === "search" ? "Your ad shows when people search for these words. Press Enter after each one." : `Links like t.me/${target === "bots" ? "examplebot" : "technews"}. Press Enter after each one.`}</p>
                  <div className="mt-2">
                    <ChipInput key={target} id="af-target" values={list[target]} onChange={(v) => { setList((l) => ({ ...l, [target]: v })); touch("target"); }} error={errors.target} describedBy="af-target-hint"
                      placeholder={target === "search" ? "Type a word and press Enter" : `t.me/${target === "bots" ? "examplebot" : "channel"}`}
                      check={target === "search" ? (v) => (v.length > 40 ? "Keep each search word under 40 characters" : undefined) : (v) => (TME.test(v) ? undefined : "Enter a link like t.me/name")} />
                  </div>
                </div>
              )}
              <p className="flex items-start gap-2 rounded-xl bg-amber-50 px-4 py-3 text-sm text-slate-800 dark:bg-amber-400/10 dark:text-slate-200"><AlertTriangle aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-amber-700 dark:text-amber-300" />Where the ad shows can&apos;t be changed after it&apos;s created.</p>
            </section>

            {/* 2 · Ad */}
            <section aria-labelledby="af-s2" className={`${card} space-y-6 p-6 sm:p-8`}>
              <H2 id="af-s2" className="text-xl">2 · Your ad</H2>
              <Field id="af-title" label="Ad title (optional)" hint="Shown in bold at the top. Usually your channel or brand name.">
                <input id="af-title" maxLength={40} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="E.g., My first ad" aria-describedby="af-title-hint" className={field} />
              </Field>
              <Field id="af-text" label="Ad text" hint="Plain text. Say what you offer and why to open it." error={errors.text}
                side={<span aria-live="polite" className={`text-sm tabular-nums ${text.length > AD_TEXT_MAX ? "font-semibold text-red-700 dark:text-red-400" : AD_TEXT_MAX - text.length < 20 ? "text-amber-700 dark:text-amber-300" : "text-slate-500"}`}>{AD_TEXT_MAX - text.length}<span className="sr-only"> characters left</span></span>}>
                <textarea id="af-text" rows={3} value={text} onChange={(e) => setText(e.target.value)} onBlur={() => touch("text")}
                  aria-invalid={!!errors.text} aria-describedby={dsc("af-text", true, errors.text)} className={`${field} resize-y ${bad(errors.text)}`} />
              </Field>
              <Field id="af-url" label="URL you want to promote" hint="A public channel, a bot, or a website starting with https://" error={errors.url}>
                <input id="af-url" inputMode="url" spellCheck={false} autoCapitalize="none" value={url} onChange={(e) => setUrl(e.target.value)} onBlur={() => touch("url")} placeholder="t.me/yourchannel"
                  aria-invalid={!!errors.url} aria-describedby={dsc("af-url", true, errors.url)} className={`${field} ${bad(errors.url)}`} />
              </Field>
              <label className={`flex items-start gap-3 rounded-2xl border border-slate-200 p-4 dark:border-white/15 ${isTg ? "cursor-pointer" : "opacity-60"}`}>
                <input type="checkbox" checked={showPic && isTg} disabled={!isTg} onChange={(e) => setShowPic(e.target.checked)} className={`mt-1 h-5 w-5 accent-sky-600 ${ring}`} />
                <span><span className="block font-semibold text-slate-900 dark:text-white">Show channel picture</span><span className="text-sm text-slate-600 dark:text-slate-400">{isTg ? "Adds your channel's photo next to the title." : "Only for t.me links."}</span></span>
              </label>

              <div>
                <span id="af-media-label" className="block text-base font-semibold text-slate-900 dark:text-white">Ad photo or video (optional)</span>
                <p id="af-media-hint" className="text-sm text-slate-600 dark:text-slate-400">A photo or short video, up to {MAX_MEDIA_MB} MB.</p>
                {mediaErr && <p id="af-media-error" className="mt-1 text-sm font-semibold text-red-700 dark:text-red-400"><span className="sr-only">Error: </span>{mediaErr}</p>}
                <input ref={fileRef} type="file" accept="image/*,video/*" className="sr-only" tabIndex={-1} aria-hidden onChange={(e) => { onFile(e.target.files?.[0]); e.target.value = ""; }} />
                {media ? (
                  <div className="mt-2 flex items-center gap-3 rounded-2xl border border-slate-300 p-3 dark:border-white/20">
                    {media.type.startsWith("image") ? <img src={media.src} alt="" className="h-14 w-14 rounded-xl object-cover" /> : <video src={media.src} muted className="h-14 w-14 rounded-xl object-cover" />}
                    <span className="min-w-0 flex-1 truncate font-medium text-slate-900 dark:text-white">{media.name}</span>
                    <button type="button" onClick={() => setMedia(null)} className={`rounded-lg px-3 py-1.5 text-sm font-semibold text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10 ${ring}`}>Remove</button>
                  </div>
                ) : (
                  <button id="af-media" type="button" onClick={() => fileRef.current?.click()} aria-labelledby="af-media-label" aria-describedby={["af-media-hint", mediaErr && "af-media-error"].filter(Boolean).join(" ")}
                    className={`mt-2 flex w-full flex-col items-center justify-center gap-1.5 rounded-2xl border-2 border-dashed border-slate-300 px-5 py-6 text-slate-700 transition-colors hover:border-sky-500 hover:bg-sky-50 dark:border-white/20 dark:text-slate-300 dark:hover:border-sky-400 dark:hover:bg-sky-400/5 ${ring}`}>
                    <ImagePlus aria-hidden className="h-6 w-6 text-sky-600 dark:text-sky-400" /><span className="font-semibold">Upload photo or video</span>
                  </button>
                )}
              </div>
            </section>

            {/* 3 · Budget */}
            <section aria-labelledby="af-s3" className={`${card} space-y-6 p-6 sm:p-8`}>
              <H2 id="af-s3" className="text-xl">3 · Budget and schedule</H2>
              <div className="grid gap-6 sm:grid-cols-2">
                <Field id="af-cpm" label="CPM" hint={`Price per 1,000 views. From ${usd(MIN_CPM)}; most ads use ${usd(2)}–${usd(4)}.`} error={errors.cpm}>
                  <Money id="af-cpm" value={cpm} onChange={setCpm} onBlur={() => touch("cpm")} error={errors.cpm} hint />
                </Field>
                <Field id="af-budget" label="Budget" hint={`From ${usd(AD_MIN_BUDGET)}. Unspent money is refunded.`} error={errors.budget}>
                  <Money id="af-budget" value={budget} onChange={setBudget} onBlur={() => touch("budget")} error={errors.budget} hint />
                </Field>
              </div>
              <div>
                <button type="button" onClick={() => { setDailyOn(!dailyOn); setDaily(0); }} aria-expanded={dailyOn} aria-controls="af-daily-wrap" className={`rounded-lg font-semibold text-sky-700 underline underline-offset-2 dark:text-sky-300 ${ring}`}>{dailyOn ? "Remove daily limit" : "Set a daily limit"}</button>
                <div id="af-daily-wrap" hidden={!dailyOn} className="mt-3 max-w-xs">
                  {dailyOn && <Field id="af-daily" label="Daily limit" hint="The most it can spend in one day." error={errors.daily}><Money id="af-daily" value={daily} onChange={setDaily} onBlur={() => touch("daily")} error={errors.daily} hint /></Field>}
                </div>
              </div>

              <fieldset>
                <legend className="text-base font-semibold text-slate-900 dark:text-white">Daily views limit per person</legend>
                <p className="text-sm text-slate-600 dark:text-slate-400">How many times a day one person can see it.</p>
                <div className="mt-2 grid grid-cols-4 gap-2">
                  {[1, 2, 3, 4].map((n) => (
                    <label key={n} className={`cursor-pointer rounded-xl border-2 py-2.5 text-center font-semibold transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-sky-500 ${perUser === n ? `${accent.ads.border} bg-sky-50 text-slate-900 dark:bg-sky-400/10 dark:text-white` : "border-slate-200 text-slate-800 hover:border-slate-400 dark:border-white/15 dark:text-slate-200"}`}>
                      <input type="radio" name={perName} checked={perUser === n} onChange={() => setPerUser(n)} className="sr-only" />{n}
                    </label>
                  ))}
                </div>
              </fieldset>

              <fieldset>
                <legend className="text-base font-semibold text-slate-900 dark:text-white">When Telegram approves it</legend>
                <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
                  {([["active", "Start right away", "Runs as soon as it's approved"], ["hold", "Keep on hold", "You start it from your orders"]] as const).map(([id, l, h]) => {
                    const on = status === id;
                    return (
                      <label key={id} className={`flex cursor-pointer items-start gap-3 rounded-2xl border-2 p-4 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-sky-500 ${on ? `${accent.ads.border} bg-sky-50 dark:bg-sky-400/10` : "border-slate-200 hover:border-slate-400 dark:border-white/15"}`}>
                        <input type="radio" name={statusName} checked={on} onChange={() => setStatus(id)} className="sr-only" />
                        <RadioDot on={on} />
                        <span><span className="block font-semibold text-slate-900 dark:text-white">{l}</span><span className="text-sm text-slate-600 dark:text-slate-400">{h}</span></span>
                      </label>
                    );
                  })}
                </div>
              </fieldset>

              <div>
                <button type="button" onClick={() => { setStartOn(!startOn); setStart(""); }} aria-expanded={startOn} aria-controls="af-start-wrap" className={`flex items-center gap-1.5 rounded-lg font-semibold text-sky-700 underline underline-offset-2 dark:text-sky-300 ${ring}`}>
                  <CalendarDays aria-hidden className="h-4 w-4" />{startOn ? "No start date" : "Set a start date"}
                </button>
                <div id="af-start-wrap" hidden={!startOn} className="mt-3 max-w-xs">
                  {startOn && <Field id="af-start" label="Start date" error={errors.start}><input id="af-start" type="date" min={today} value={start} onChange={(e) => setStart(e.target.value)} onBlur={() => touch("start")} aria-invalid={!!errors.start} aria-describedby={dsc("af-start", false, errors.start)} className={`${field} ${bad(errors.start)}`} /></Field>}
                </div>
              </div>
            </section>
          </div>

          {/* Sidebar: preview, summary, Pay */}
          <aside aria-label="Preview and payment" className="space-y-5 lg:sticky lg:top-24 lg:self-start">
            <figure aria-label="Ad preview" className="overflow-hidden rounded-[1.75rem] bg-[#b7d3a8] dark:bg-[#0e1621]">
              <div className="flex items-center gap-3 bg-white px-4 py-3 text-slate-900 dark:bg-[#17212b] dark:text-white">
                <span aria-hidden className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 text-sm font-bold text-white">TN</span>
                <span className="min-w-0"><span className="block truncate text-sm font-semibold">Tech News Daily</span><span className="block text-xs text-slate-500 dark:text-slate-400">128,450 subscribers</span></span>
              </div>
              <div className="space-y-2 p-4">
                <div className="max-w-[85%] rounded-2xl rounded-bl-md bg-white px-3.5 py-2.5 text-[14px] leading-snug text-slate-800 dark:bg-[#182533] dark:text-slate-200">
                  New phones announced this week: here&apos;s what changed.<span className="mt-1 block text-end text-[11px] text-slate-400">👁 41K · 12:04</span>
                </div>
                <div aria-live="polite" className="max-w-[85%] overflow-hidden rounded-2xl rounded-bl-md bg-white text-[14px] leading-snug text-slate-900 dark:bg-[#182533] dark:text-slate-100">
                  {media && (media.type.startsWith("image") ? <img src={media.src} alt="" className="max-h-44 w-full object-cover" /> : <video src={media.src} muted autoPlay loop playsInline className="max-h-44 w-full object-cover" />)}
                  <div className="px-3.5 py-2.5">
                    <span className="flex items-center justify-between gap-3">
                      <span className="flex min-w-0 items-center gap-2">
                        {showPic && isTg && <span aria-hidden className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-gradient-to-br from-sky-400 to-indigo-500 text-[11px] font-bold text-white">{name.slice(0, 1).toUpperCase()}</span>}
                        <span className="truncate font-semibold text-sky-600 dark:text-sky-400">{name}</span>
                      </span>
                      <span className="text-[11px] font-medium text-slate-400">Ad</span>
                    </span>
                    <span className={`mt-1 block whitespace-pre-wrap break-words ${text.trim() ? "" : "text-slate-400"}`}>{text.trim() ? text.slice(0, AD_TEXT_MAX) : "Your ad text appears here."}</span>
                    <span className="mt-2.5 block rounded-lg bg-sky-500/10 py-2 text-center text-sm font-semibold text-sky-600 dark:text-sky-400">{button}</span>
                  </div>
                </div>
              </div>
              <figcaption className="sr-only">Your ad as a sponsored message under a channel post</figcaption>
            </figure>

            <div aria-live="polite" className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-sky-50 p-4 dark:bg-sky-400/10"><div className="flex items-center gap-1.5 text-sm text-slate-600 dark:text-slate-400"><Eye aria-hidden className="h-4 w-4" />Views</div><div className="font-display text-2xl font-bold text-slate-900 dark:text-white">~{fmt(views)}</div></div>
              <div className="rounded-2xl bg-sky-50 p-4 dark:bg-sky-400/10"><div className="flex items-center gap-1.5 text-sm text-slate-600 dark:text-slate-400"><MousePointerClick aria-hidden className="h-4 w-4" />Clicks</div><div className="font-display text-2xl font-bold text-slate-900 dark:text-white">{fmt(lo)}–{fmt(hi)}</div></div>
            </div>

            <section aria-labelledby="af-sum" className={`${card} p-6`}>
              <h2 id="af-sum" className="font-display text-lg font-semibold text-slate-900 dark:text-white">Your ad</h2>
              <div className="mt-3"><SumRows rows={[
                ["Shown", targets.find((t) => t.id === target)!.label],
                ["Audience", reach || "—"],
                ["CPM", usd(cpm || 0)],
                ["Per person", `${perUser} a day`],
                ["Starts", status === "hold" ? "On hold" : startOn && start ? start : "When approved"],
              ]} /></div>
              <div aria-live="polite" className="mt-3 flex items-baseline justify-between border-t border-slate-200 pt-4 dark:border-white/10"><span className="text-slate-600 dark:text-slate-400">Budget</span><span className="font-display text-2xl font-bold text-slate-900 dark:text-white">{usd(budget || 0)}</span></div>
              <button type="button" onClick={pay} className={`${accent.ads.btn} mt-5 w-full`}>Pay {usd(budget || 0)} and create ad</button>
              <p className="mt-3 text-center text-sm text-slate-600 dark:text-slate-400">Rejected ads are refunded in full.</p>
            </section>
          </aside>
        </div>

        <section aria-labelledby="how" className="mt-20"><H2 id="how">How it works</H2><div className="mt-6"><HowItWorks /></div></section>
        <div className="mt-10 max-w-3xl"><Rules /></div>
        {!extras && <section aria-labelledby="faq" className="mt-16 max-w-3xl"><H2 id="faq">Common questions</H2><div className="mt-6"><TgFaq s="ads" /></div></section>}
      </div>

      <CheckoutModal open={c.payOpen} onClose={c.closePay} price={budget} itemLabel="Ad budget" payLabel="Pay and create" note="Telegram reviews the ad in about 24 hours. If it's rejected and can't be fixed, you're refunded in full."
        onPay={(m) => c.finish({ service: "ads", title: `Telegram Ads · ${title.trim() || "New ad"}`, detail: `CPM ${usd(cpm)} · about ${fmt(views)} views`, total: budget, to: url.trim(), paidWith: m })}
        summary={<><ServiceIcon s="ads" /><div className="min-w-0 flex-1"><div className="truncate font-semibold text-slate-900 dark:text-white">Telegram Ads · {usd(budget)}</div><div className="truncate text-xs text-slate-500 dark:text-slate-400">{url} · {targets.find((t) => t.id === target)!.label}</div></div></>} />
    </PageShell>
  );
}
