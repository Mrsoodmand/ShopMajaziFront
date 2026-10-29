// PLACEHOLDER data for designing the Virtual Number (OTP) page. The live page will load apps (Virtual_Service) and
// country prices (Virtual_Products) from the Laravel API: GetNumbers / filterNumbers / GetSingleNumberDetail.

// Live data (from the backend) adds `image` / `flag` and the backend ids, and has no stock or success figures.
// `alt` is the name in the other language, so search works in both.
export type OtpApp = { id: string; name: string; alt?: string; letter: string; color: string; popular?: boolean; image?: string; sid?: number };
export type OtpCountry = { cc: string; name: string; alt?: string; base: number; region?: "Europe" | "Americas" | "Asia" | "Middle East" | "Africa"; flag?: string; cid?: number };
export type OtpOffer = { app: OtpApp; country: OtpCountry; price: number; stock?: number; success?: number };

// Brand-like colors for letter tiles (not official logos).
export const otpApps: OtpApp[] = [
  { id: "whatsapp", name: "WhatsApp", letter: "W", color: "bg-[#25D366]", popular: true },
  { id: "telegram", name: "Telegram", letter: "T", color: "bg-[#229ED9]", popular: true },
  { id: "instagram", name: "Instagram", letter: "I", color: "bg-gradient-to-br from-[#F58529] via-[#DD2A7B] to-[#8134AF]", popular: true },
  { id: "google", name: "Google / Gmail", letter: "G", color: "bg-[#EA4335]", popular: true },
  { id: "openai", name: "ChatGPT / OpenAI", letter: "O", color: "bg-[#10A37F]", popular: true },
  { id: "tiktok", name: "TikTok", letter: "T", color: "bg-black", popular: true },
  { id: "facebook", name: "Facebook", letter: "f", color: "bg-[#1877F2]" },
  { id: "x", name: "X (Twitter)", letter: "X", color: "bg-slate-900" },
  { id: "discord", name: "Discord", letter: "D", color: "bg-[#5865F2]" },
  { id: "amazon", name: "Amazon", letter: "a", color: "bg-[#FF9900]" },
  { id: "apple", name: "Apple", letter: "A", color: "bg-slate-700" },
  { id: "microsoft", name: "Microsoft", letter: "M", color: "bg-[#00A4EF]" },
  { id: "snapchat", name: "Snapchat", letter: "S", color: "bg-[#FFFC00] text-slate-900!" },
  { id: "uber", name: "Uber", letter: "U", color: "bg-slate-800" },
  { id: "paypal", name: "PayPal", letter: "P", color: "bg-[#003087]" },
  { id: "other", name: "Any other app", letter: "+", color: "bg-gradient-to-br from-indigo-500 to-fuchsia-500" },
];

export type Region = "Europe" | "Americas" | "Asia" | "Middle East" | "Africa";
// Placeholder data always has stock, success and region; live data may not.
export type MockCountry = OtpCountry & { region: Region };
export type MockOffer = OtpOffer & { country: MockCountry; stock: number; success: number };
export type MockOperator = OtpOperator & { stock: number; success: number };

export const otpCountries: MockCountry[] = [
  { cc: "US", name: "United States", base: 0.65, region: "Americas" },
  { cc: "GB", name: "United Kingdom", base: 0.55, region: "Europe" },
  { cc: "DE", name: "Germany", base: 0.48, region: "Europe" },
  { cc: "NL", name: "Netherlands", base: 0.42, region: "Europe" },
  { cc: "FR", name: "France", base: 0.5, region: "Europe" },
  { cc: "CA", name: "Canada", base: 0.6, region: "Americas" },
  { cc: "TR", name: "Turkey", base: 0.3, region: "Middle East" },
  { cc: "AE", name: "United Arab Emirates", base: 0.7, region: "Middle East" },
  { cc: "IN", name: "India", base: 0.22, region: "Asia" },
  { cc: "ID", name: "Indonesia", base: 0.2, region: "Asia" },
  { cc: "BR", name: "Brazil", base: 0.32, region: "Americas" },
  { cc: "PL", name: "Poland", base: 0.38, region: "Europe" },
  { cc: "SE", name: "Sweden", base: 0.58, region: "Europe" },
  { cc: "KZ", name: "Kazakhstan", base: 0.26, region: "Asia" },
  { cc: "EG", name: "Egypt", base: 0.24, region: "Africa" },
  { cc: "ZA", name: "South Africa", base: 0.34, region: "Africa" },
];

// Deterministic pseudo-random so server and browser render the same numbers.
const seed = (s: string) => { let h = 2166136261; for (const ch of s) h = Math.imul(h ^ ch.charCodeAt(0), 16777619); return ((h >>> 0) % 1000) / 1000; };
const appFactor: Record<string, number> = { whatsapp: 1.3, telegram: 1.5, openai: 1.4, google: 1.1, instagram: 0.9, tiktok: 0.8 };

export function offersFor(appId: string): MockOffer[] {
  const app = otpApps.find((a) => a.id === appId)!;
  return otpCountries.map((country) => {
    const r = seed(app.id + country.cc);
    return {
      app, country,
      price: Math.round(country.base * (appFactor[app.id] ?? 1) * (0.85 + r * 0.3) * 100) / 100,
      stock: Math.round(40 + r * 2400),
      success: Math.round(86 + seed(country.cc + app.id) * 13),
    };
  });
}

export const cheapest = (appId: string) => offersFor(appId).reduce((a, b) => (b.price < a.price ? b : a));
export const usd = (n: number) => `$${n.toFixed(2)}`;
export const WALLET_BALANCE = 48.2; // placeholder

// Operators (carriers) per country. "Any operator" picks whichever has stock: usually cheapest and most reliable.
export type OtpOperator = { id: string; name: string; price: number; stock?: number; success?: number; recommended?: boolean };
const carriers: Record<string, string[]> = {
  US: ["AT&T", "T-Mobile", "Verizon"], GB: ["EE", "Vodafone", "O2", "Three"], DE: ["Telekom", "Vodafone", "O2"],
  NL: ["KPN", "Vodafone", "Odido"], FR: ["Orange", "SFR", "Bouygues", "Free"], CA: ["Rogers", "Bell", "Telus"],
  TR: ["Turkcell", "Vodafone", "Türk Telekom"], AE: ["Etisalat", "du"], IN: ["Jio", "Airtel", "Vi"], ID: ["Telkomsel", "Indosat", "XL"],
  BR: ["Vivo", "Claro", "TIM"], PL: ["Play", "Orange", "Plus"], SE: ["Telia", "Tele2", "Telenor"], KZ: ["Beeline", "Kcell"],
  EG: ["Vodafone", "Orange", "Etisalat"], ZA: ["Vodacom", "MTN", "Cell C"],
};

export function operatorsFor(appId: string, cc: string): MockOperator[] {
  const base = offersFor(appId).find((o) => o.country.cc === cc)!;
  const named = (carriers[cc] ?? ["Local"]).map((name) => {
    const r = seed(appId + cc + name);
    return { id: name.toLowerCase().replace(/[^a-z0-9]+/g, "-"), name, price: Math.round(base.price * (1.02 + r * 0.35) * 100) / 100, stock: Math.round(10 + r * base.stock * 0.5), success: Math.min(99, Math.round(base.success - 4 + r * 8)) };
  });
  return [{ id: "any", name: "Any operator", price: base.price, stock: base.stock, success: base.success, recommended: true }, ...named];
}

// Offers for one country across all apps (for the country-first path).
export const offersInCountry = (cc: string) => otpApps.map((a) => offersFor(a.id).find((o) => o.country.cc === cc)!);
