// PLACEHOLDER data for designing the Rent Number page. A rented number receives every SMS sent to it (any app,
// unlimited) until the rental ends, and can be extended before it expires. Prices and stock are made up.

import { otpApps, type OtpApp } from "./otp-en";

export type RentCountry = { cc: string; name: string; week: number; stock: number; popular?: boolean };
export type Duration = { days: 7 | 14 | 30; label: string; factor: number };

export const rentCountries: RentCountry[] = [
  { cc: "US", name: "United States", week: 7.9, stock: 42, popular: true },
  { cc: "GB", name: "United Kingdom", week: 6.9, stock: 35, popular: true },
  { cc: "DE", name: "Germany", week: 8.9, stock: 18 },
  { cc: "NL", name: "Netherlands", week: 7.5, stock: 21, popular: true },
  { cc: "FR", name: "France", week: 8.5, stock: 14 },
  { cc: "CA", name: "Canada", week: 7.9, stock: 26 },
  { cc: "ES", name: "Spain", week: 7.2, stock: 17 },
  { cc: "PL", name: "Poland", week: 5.9, stock: 30 },
  { cc: "BR", name: "Brazil", week: 5.5, stock: 24 },
  { cc: "IN", name: "India", week: 4.9, stock: 51 },
  { cc: "ID", name: "Indonesia", week: 4.9, stock: 47 },
  { cc: "PH", name: "Philippines", week: 5.2, stock: 33 },
];

// Longer rentals cost less per day.
export const durations: Duration[] = [
  { days: 7, label: "1 week", factor: 1 },
  { days: 14, label: "2 weeks", factor: 1.7 },
  { days: 30, label: "1 month", factor: 2.9 },
];

export const priceFor = (c: RentCountry, d: Duration) => Math.round(c.week * d.factor * 10) / 10;
export const perDay = (c: RentCountry, d: Duration) => priceFor(c, d) / d.days;
// Savings of a duration versus renting week by week.
export const savingFor = (d: Duration) => Math.round((1 - d.factor / (d.days / 7)) * 100);
// Any whole number of days (for the slider design): weekly price, cheaper per day as it gets longer.
export const priceForDays = (c: RentCountry, days: number) => Math.round(c.week * (days / 7) * Math.max(0.68, 1 - (days - 7) * 0.0139) * 10) / 10;

export const rentCheapest = rentCountries.reduce((a, b) => (b.week < a.week ? b : a));

// The day a rental that starts now ends, as "Nov 5, 2026" (t() shows it as a Persian date on the Persian site).
// Counted in Iran time, so the server and the browser print the same day wherever they run.
export const endDate = (days: number, from = new Date()) =>
  new Date(from.getTime() + days * 86400000).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "Asia/Tehran" });

export const rentPoints = [
  { title: "Unlimited SMS", text: "Every message sent to the number shows up in your inbox, from any app." },
  { title: "Same number all the way", text: "Log in again next week and verify with the same number." },
  { title: "Extend any time", text: "Add a week or a month before it ends; the number stays yours." },
  { title: "Instant start", text: "The number is active the moment you pay." },
];

export const rentFaq = [
  { q: "What's the difference from a one-time number?", a: "A one-time number receives a single code and then closes. A rented number stays yours for the whole rental and receives every SMS, so you can log in again or verify several apps." },
  { q: "Can I extend the rental?", a: "Yes. From your dashboard, add 7, 14 or 30 days at any time before it ends. The number doesn't change." },
  { q: "Does it work with every app?", a: "It receives SMS from any sender. A few services block rented numbers; if a code doesn't arrive in the first hour, we replace the number." },
  { q: "Can I make calls?", a: "No, rented numbers receive SMS only. For calls, get a Google Voice number." },
  { q: "What happens when the rental ends?", a: "The number is released and may go to someone else later. Move important accounts to a permanent number before then." },
];

// Sample inbox for an active rental.
export const sampleInbox = [
  { from: "WhatsApp", text: "Your WhatsApp code: 482-913. Don't share this code with others.", ago: "just now" },
  { from: "Telegram", text: "Telegram code: 71045. Do not give this code to anyone.", ago: "2 min ago" },
  { from: "Google", text: "G-583201 is your Google verification code.", ago: "1 h ago" },
  { from: "PayPal", text: "PayPal: 662914 is your security code. It expires in 10 minutes.", ago: "yesterday" },
];

export const sampleRentNumber = (cc: string) => ({
  US: "+1 (202) 555-0147", GB: "+44 7700 900412", DE: "+49 1522 3456712", NL: "+31 6 12345 678", FR: "+33 6 12 34 56 78", CA: "+1 (613) 555-0121",
  ES: "+34 612 345 678", PL: "+48 512 345 678", BR: "+55 11 91234 5678", IN: "+91 98765 43210", ID: "+62 812 3456 7890", PH: "+63 917 123 4567",
} as Record<string, string>)[cc] ?? "+1 (202) 555-0147";

// ---------- Two ways to rent ----------
// "all": the number takes SMS from every app. Flow: period → countries available for it → country → pay.
// "app": the number is for one app only, cheaper. Flow: country → period → app → pay.
export type RentMethod = "all" | "app";


// Single-app rentals cost a share of the all-apps price; the share depends on the app.
const appShare: Record<string, number> = {
  whatsapp: 0.55, telegram: 0.5, instagram: 0.5, google: 0.45, openai: 0.6, tiktok: 0.45, facebook: 0.4, x: 0.4,
  discord: 0.35, amazon: 0.35, apple: 0.45, microsoft: 0.35, snapchat: 0.35, uber: 0.3, paypal: 0.5,
};
export type RentApp = OtpApp & { share: number };
export const rentApps: RentApp[] = otpApps.filter((a) => a.id in appShare).map((a) => ({ ...a, share: appShare[a.id] }));

// Stable pseudo-random 0..1 per key, so placeholder stock doesn't change between renders.
const hash = (s: string) => { let h = 7; for (const ch of s) h = (h * 31 + ch.charCodeAt(0)) % 9973; return h / 9973; };

// Fewer numbers can be held for longer; some countries have none for a month.
export const stockFor = (c: RentCountry, days: number) => Math.max(0, Math.round(c.stock * (days === 30 ? 0.45 : days === 14 ? 0.75 : 1) - (days === 30 && hash(c.cc) < 0.25 ? 99 : 0)));
export const countriesFor = (d: Duration) => rentCountries.map((c) => ({ country: c, price: priceFor(c, d), stock: stockFor(c, d.days) })).filter((x) => x.stock > 0);

export const priceApp = (c: RentCountry, d: Duration, a: RentApp) => Math.max(0.9, Math.round(priceFor(c, d) * a.share * 10) / 10);
export const appStock = (c: RentCountry, d: Duration, a: RentApp) => Math.max(0, Math.round(stockFor(c, d.days) * (0.4 + hash(c.cc + a.id) * 0.6)) - (hash(a.id + c.cc) < 0.12 ? 99 : 0));
export const appsFor = (c: RentCountry, d: Duration) => rentApps.map((app) => ({ app, price: priceApp(c, d, app), stock: appStock(c, d, app) }));
// Cheapest one-app price in a country for a period (for "from" hints).
export const appFrom = (c: RentCountry, d: Duration) => Math.min(...rentApps.map((a) => priceApp(c, d, a)));

// Sample messages for a single-app rental.
export const appInbox = (name: string) => [
  { from: name, text: `Your ${name} code: 731 204. Don't share it with anyone.`, ago: "just now" },
  { from: name, text: `Your ${name} code: 518 662.`, ago: "3 days ago" },
];
