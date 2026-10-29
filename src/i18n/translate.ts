import type { Locale } from "./config";
import { fa, faPatterns } from "./fa";

// English is written in the components; Persian comes from the dictionary in ./fa, keyed by the English text.
// A missing entry falls back to the English, so the page never breaks while the dictionary fills in.

const norm = (s: string) => s.replace(/\s+/g, " ").trim();
const faIndex = new Map<string, string>(Object.entries(fa).map(([k, v]) => [norm(k), v]));

const FA_DIGITS = "۰۱۲۳۴۵۶۷۸۹";
export const faDigits = (s: string) => s.replace(/[0-9]/g, (d) => FA_DIGITS[+d]);

export type Vars = Record<string, string | number>;
export type T = ((text: string, vars?: Vars) => string) & {
  tr: <X>(value: X) => X; locale: Locale; num: (n: number, opts?: Intl.NumberFormatOptions) => string;
  // A price written in dollars, shown the way this language shows prices ("$6.50", or Toman in Persian).
  usd: (n: number) => string;
  // Toman per dollar when prices show in Toman (Persian with a known rate), else 0. For money inputs kept in dollars.
  rate: number;
};

// ---------- Prices ----------
// The Persian site shows every price in Toman. Prices still kept in dollars (pages not on the backend yet, menu
// "from" prices) are converted with the backend's dollar rate; live services show their real lowest price.
// Without a rate (backend unreachable) dollars stay as they are.
export type Prices = { usd: number; from: Record<string, number> };

export const toman = (n: number, locale: Locale = "en") =>
  locale === "fa" ? `${Math.round(n).toLocaleString("fa-IR")} تومان` : `${Math.round(n).toLocaleString("en-US")} Toman`;

// Converted prices are rounded the way shops write them: to 1,000 Toman (100 below 10,000).
const roundToman = (n: number) => (n >= 10000 ? Math.round(n / 1000) * 1000 : Math.max(100, Math.round(n / 100) * 100));
const usdText = (n: number) => `$${n.toFixed(2)}`;
const DOLLARS = /\$(\d[\d,]*(?:\.\d+)?)/g;

// Sentences built from data at runtime ("Email of your Spotify account"): matched by pattern, $1… are the parts.
const faRules = faPatterns.map(([re, out]) => [new RegExp(`^${re}$`), out] as const);
function byPattern(key: string): string | undefined {
  for (const [re, out] of faRules) {
    const m = key.match(re);
    if (m) return out.replace(/\$(\d)/g, (_, i) => lookup("fa", m[+i]));
  }
}

// Dates written in English ("Oct 12, 2026", blog posts) are shown as Persian (Solar Hijri) dates: "۲۰ مهر ۱۴۰۵".
// Read and printed in UTC, so the server and the browser always print the same day.
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const EN_DATE = /^(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]* (\d{1,2}), (\d{4})$/;
const faDate = new Intl.DateTimeFormat("fa-IR", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
function byDate(key: string): string | undefined {
  const m = key.match(EN_DATE);
  return m ? faDate.format(new Date(Date.UTC(+m[3], MONTHS.indexOf(m[1]), +m[2]))) : undefined;
}

function lookup(locale: Locale, text: string): string {
  if (locale === "en") return text;
  const key = norm(text);
  // Lowercased phrases ("at the end of posts…") reuse the entry of their capitalized form. Single words are left
  // alone: lowercase single words are usually ids ("guides").
  const hit = faIndex.get(key) ?? (/^[a-z][^ ]* [^ ]/.test(key) ? faIndex.get(key[0].toUpperCase() + key.slice(1)) : undefined) ?? byPattern(key) ?? byDate(key);
  if (hit == null) return text;
  // Keep the spacing around the original text (JSX text often has a trailing space before a {value}).
  const lead = text.match(/^\s*/)![0], trail = text.match(/\s*$/)![0];
  return lead + hit + trail;
}

// Values: plain numbers print without grouping (years, counts written as `${n}`); in Persian, digits in values
// (prices already formatted, "1,200") become Persian digits too.
function fill(s: string, vars: Vars | undefined, locale: Locale, cur: (s: string) => string = (x) => x) {
  if (!vars) return s;
  return s.replace(/\{(\w+)\}/g, (m, k) => {
    if (!(k in vars)) return m;
    const v = vars[k];
    const out = typeof v === "number" ? formatNum(v, locale, { useGrouping: false, maximumFractionDigits: 20 }) : cur(String(v)); // dollar amounts first, while the digits are still Latin
    return locale === "fa" ? faDigits(out) : out;
  });
}

export const formatNum = (n: number, locale: Locale, opts?: Intl.NumberFormatOptions) => n.toLocaleString(locale === "fa" ? "fa-IR" : "en-US", opts);

// Translates every string inside plain objects / arrays (content files). Same input → same output object (per T).
// `cur` turns dollar amounts into this language's prices; a {href, from} item (menu, service lists) of a live
// service gets its real lowest price instead.
function deep(value: unknown, locale: Locale, cur: (s: string) => string, from: Record<string, number> | null, cache: WeakMap<object, unknown>): unknown {
  if (typeof value === "string") return cur(lookup(locale, value));
  if (locale === "en" || value === null || typeof value !== "object") return value;
  const cached = cache.get(value as object);
  if (cached) return cached;
  let out: unknown = value;
  if (Array.isArray(value)) out = value.map((v) => deep(v, locale, cur, from, cache));
  else if (Object.getPrototypeOf(value) === Object.prototype) {
    out = Object.fromEntries(Object.entries(value).map(([k, v]) => [k, NON_TEXT_KEYS.has(k) ? v : deep(v, locale, cur, from, cache)]));
    const o = value as { href?: unknown; from?: unknown };
    const live = typeof o.href === "string" && typeof o.from === "string" ? from?.[o.href] : undefined;
    if (live) (out as { from: string }).from = toman(live, locale);
  }
  cache.set(value as object, out);
  return out;
}
// Keys whose values are never prose (ids, links, styling).
const NON_TEXT_KEYS = new Set(["id", "href", "url", "slug", "cc", "code", "image", "img", "src", "icon", "color", "tone", "className", "key", "kind", "type", "variant", "cat", "blogCat", "activation", "method", "target", "status"]);

// `prices`: the dollar rate and live lowest prices (Persian only; see Prices above).
export function makeT(locale: Locale, prices?: Prices | null): T {
  const rate = locale === "fa" && prices && prices.usd > 0 ? prices.usd : 0;
  const usd = (n: number) => (rate ? toman(roundToman(n * rate), locale) : usdText(n));
  // Dollar amounts inside text ("from $0.30", "$6.50 each") → this language's prices.
  const cur = rate ? (s: string) => (s.includes("$") ? s.replace(DOLLARS, (_, n: string) => usd(Number(n.replace(/,/g, "")))) : s) : (s: string) => s;
  const cache = new WeakMap<object, unknown>();
  const t = ((text: string, vars?: Vars) => fill(cur(lookup(locale, text)), vars, locale, cur)) as T;
  t.tr = <X,>(value: X) => deep(value, locale, cur, rate ? prices!.from : null, cache) as X;
  t.locale = locale;
  t.num = (n, opts) => formatNum(n, locale, opts);
  t.usd = usd;
  t.rate = rate;
  return t;
}
