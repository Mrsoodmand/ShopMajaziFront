import type { OtpApp, OtpCountry, OtpOffer, OtpOperator } from "@/content/otp-en";

// Virtual numbers from the backend (Api\StorefrontController): GET virtual-numbers and virtual-numbers/offers.
// Names come in Persian ("تلگرام - Telegram", "کشور آلمان"); prices are in toman.

export type Locale = "en" | "fa";

export type ApiService = { id: number; name: string; image: string | null; special: boolean; count: number; min_price: number };
export type ApiCountry = { id: number; name: string; image: string | null; count: number; min_price: number };
export type ApiOffer = { id: number; service_id: number | string; country_id: number | string; server: number; price: number };
export type ApiVirtualNumbers = { page: unknown; services: ApiService[]; countries: ApiCountry[] };

// Everything the page needs up front: apps and countries with their "from" prices.
export type VnCatalog = { apps: OtpApp[]; countries: OtpCountry[]; appFrom: Record<string, number>; countryFrom: Record<string, number> };

const fileSlug = (path: string | null) => (path ?? "").split("/").pop()?.replace(/\.svg$/i, "").toLowerCase() ?? "";

// English names, keyed by the service's image name (several backend names are Persian only or oddly cased).
const APP_EN: Record<string, string> = {
  telegram: "Telegram", whatsapp: "WhatsApp", instagram: "Instagram", tiktok: "TikTok", openai: "ChatGPT / OpenAI", imo: "imo",
  apple: "Apple ID", clubhouse: "Clubhouse", facebook: "Facebook", twitter: "X (Twitter)", viber: "Viber", "line-messenger": "LINE",
  "linked-in": "LinkedIn", gmail: "Google / Gmail / YouTube", yahoo: "Yahoo", discord: "Discord", "mi-chat": "MiChat", paypal: "PayPal",
  likee: "Likee", "snap-chat": "Snapchat", steam: "Steam", meetme: "MeetMe", "office-365": "Office 365", netflix: "Netflix", tinder: "Tinder",
  "we-chat": "WeChat", "ari-bnb": "Airbnb", "ali-baba": "Alibaba", amazon: "Amazon", bilizzard: "Blizzard (Battle.net)", microsoft: "Microsoft",
  twilio: "Twilio", beetalk: "BeeTalk", talk: "KakaoTalk", "bit-money": "LocalBitcoins", "trading-view": "TradingView", vk: "VK", huawei: "Huawei",
  careem: "Careem", nikee: "Nike", aol: "AOL", avito: "Avito", badoo: "Badoo", "bet-fair": "Betfair", coinbase: "Coinbase", carigslist: "Craigslist",
  deliveroo: "Deliveroo", didi: "DiDi", "door-dash": "DoorDash", "easy-pay": "EasyPay", fiverr: "Fiverr", g2a: "G2A", "game-flip": "GameFlip",
  "get-taxi": "Gett", glovo: "Glovo / Raketa", "live-score": "LiveScore", "net-bet": "NetBet", signal: "Signal", skout: "Skout", skrill: "Skrill",
  sneakersnstuff: "Sneakersnstuff", "web-money&enum": "WebMoney", "wing-money": "WingMoney", "1668": "1668",
};

const hasPersian = (s: string) => /[؀-ۿ]/.test(s);
const titleCase = (s: string) => s.replace(/\b\w/g, (c) => c.toUpperCase());

function appNames(raw: string, slug: string) {
  const parts = raw.split(/\s+-\s+/).map((p) => p.trim()).filter(Boolean);
  const fa = parts.filter(hasPersian).join(" - ").replace(/^(شمار(ه)? مجازی|خرید|سایت)\s+/u, "").replace(/\s+/g, " ").trim();
  const latin = parts.filter((p) => !hasPersian(p)).join(" / ");
  const en = APP_EN[slug] ?? (latin ? titleCase(latin) : titleCase(slug.replace(/-/g, " ")));
  return { en, fa: fa || en };
}

// Region names from the browser/Node ICU data; flag files are named by ISO code ("de", "gb-eng").
const regionName = (cc: string, locale: Locale) => {
  try { return new Intl.DisplayNames([locale], { type: "region" }).of(cc) ?? cc; } catch { return cc; }
};

const LETTER_COLORS = ["bg-indigo-600", "bg-sky-600", "bg-emerald-600", "bg-rose-600", "bg-amber-600", "bg-violet-600", "bg-teal-600", "bg-slate-700"];

export function toApp(s: ApiService, locale: Locale): OtpApp {
  const slug = fileSlug(s.image) || `s${s.id}`;
  const n = appNames(s.name, slug);
  const name = locale === "fa" ? n.fa : n.en;
  return {
    id: slug, sid: s.id, name, alt: locale === "fa" ? n.en : n.fa, image: s.image ?? undefined, popular: s.special,
    letter: n.en.charAt(0).toUpperCase(), color: LETTER_COLORS[s.id % LETTER_COLORS.length],
  };
}

export function toCountry(c: ApiCountry, locale: Locale): OtpCountry {
  const flag = fileSlug(c.image);
  const cc = (flag.split("-")[0] || `c${c.id}`).toUpperCase();
  const fa = c.name.replace(/^کشور\s+/u, "").trim();
  const en = flag === "gb-eng" ? "United Kingdom" : regionName(cc, "en");
  return { cc, cid: c.id, name: locale === "fa" ? fa : en, alt: locale === "fa" ? en : fa, flag: c.image ?? undefined, base: c.min_price };
}

export function toCatalog(data: ApiVirtualNumbers, locale: Locale): VnCatalog {
  const apps = data.services.map((s) => toApp(s, locale));
  const countries = data.countries.map((c) => toCountry(c, locale));
  return {
    apps, countries,
    appFrom: Object.fromEntries(data.services.map((s, i) => [apps[i].id, s.min_price])),
    countryFrom: Object.fromEntries(data.countries.map((c, i) => [countries[i].cc, c.min_price])),
  };
}

// One offer row per server; group them by country (for an app) or by app (for a country), cheapest server first.
export type ServerOffer = { id: number; appId: string; cc: string; server: number; price: number };

export function toServerOffers(rows: ApiOffer[], catalog: VnCatalog): ServerOffer[] {
  const appBySid = new Map(catalog.apps.map((a) => [a.sid, a.id]));
  const ccByCid = new Map(catalog.countries.map((c) => [c.cid, c.cc]));
  return rows.flatMap((r) => {
    const appId = appBySid.get(Number(r.service_id)), cc = ccByCid.get(Number(r.country_id));
    return appId && cc ? [{ id: r.id, appId, cc, server: r.server, price: r.price }] : [];
  });
}

// Cheapest offer per country (for one app) or per app (for one country).
export function cheapestBy(offers: ServerOffer[], key: "cc" | "appId", catalog: VnCatalog): OtpOffer[] {
  const best = new Map<string, ServerOffer>();
  for (const o of offers) { const k = o[key]; const b = best.get(k); if (!b || o.price < b.price) best.set(k, o); }
  const app = new Map(catalog.apps.map((a) => [a.id, a])), country = new Map(catalog.countries.map((c) => [c.cc, c]));
  return [...best.values()].map((o) => ({ app: app.get(o.appId)!, country: country.get(o.cc)!, price: o.price }));
}

// The servers for one app + country become the "operators" to choose from; the cheapest is recommended.
export function serversAsOperators(offers: ServerOffer[], appId: string, cc: string, locale: Locale): OtpOperator[] {
  const list = offers.filter((o) => o.appId === appId && o.cc === cc).sort((a, b) => a.price - b.price);
  return list.map((o, i) => ({ id: String(o.id), name: locale === "fa" ? `سرور ${o.server.toLocaleString("fa-IR")}` : `Server ${o.server}`, price: o.price, recommended: i === 0 }));
}

// Browser side: same-origin, proxied to the backend by next.config.ts rewrites.
// Answers are kept for a few minutes (in memory and in sessionStorage), so going back to an app or country,
// or reloading the page, shows its prices at once. Buying re-checks the price on the server anyway.
const OFFERS_TTL_MS = 5 * 60_000;
const offersMemo = new Map<string, { at: number; rows: Promise<ApiOffer[]> }>();

export async function fetchOffers(by: { service: number } | { country: number }): Promise<ApiOffer[]> {
  const q = "service" in by ? `service=${by.service}` : `country=${by.country}`;
  const key = `vn-offers:${q}`;
  const hit = offersMemo.get(key);
  if (hit && Date.now() - hit.at < OFFERS_TTL_MS) return hit.rows;
  try {
    const saved = JSON.parse(sessionStorage.getItem(key) ?? "null") as { at: number; rows: ApiOffer[] } | null;
    if (saved && Date.now() - saved.at < OFFERS_TTL_MS) {
      offersMemo.set(key, { at: saved.at, rows: Promise.resolve(saved.rows) });
      return saved.rows;
    }
  } catch { /* storage blocked or bad entry: fetch instead */ }
  const at = Date.now();
  const rows = (async () => {
    const res = await fetch(`/api/v1/storefront/virtual-numbers/offers?${q}`, { headers: { Accept: "application/json" } });
    if (!res.ok) throw new Error(`offers: HTTP ${res.status}`);
    return (await res.json()).data.offers as ApiOffer[];
  })();
  offersMemo.set(key, { at, rows });
  rows.then((r) => { try { sessionStorage.setItem(key, JSON.stringify({ at, rows: r })); } catch { /* quota or blocked */ } },
    () => offersMemo.delete(key));
  return rows;
}
