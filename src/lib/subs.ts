// Subscriptions / foreign accounts from the backend (GET /api/v1/storefront/accounts, set up in React admin ›
// accounts; see Back/app/Services/AccountOrders.php). Prices are in toman. Mapped into the design's SubProduct so
// the chosen /accounts designs render live products unchanged.
import type { SubCat, SubField, SubPlan, SubProduct } from "@/content/subs-en";

export type ApiSubPlan = { id: number; name: string; en_name: string | null; tier: string | null; months: number | null; price: number; was: number | null; popular?: boolean };
export type ApiSubField = { name: string; title: string; type: "text" | "email" | "password" | "select"; options: string[] };
export type ApiSub = {
  id: number;
  slug: string;
  name: string;
  en_name: string | null;
  tagline: string | null;
  tagline_en: string | null;
  category: SubCat;
  color: string | null;
  image: string | null;
  activation: "own" | "login" | "ready";
  delivery: string | null;
  delivery_en: string | null;
  popular: boolean;
  plans: ApiSubPlan[];
  fields: ApiSubField[];
  addons?: { id: string; question: string; question_en: string; options: { id: string; label: string; label_en: string; prices: Record<string, number> }[] }[];
  notes: { label: string; value: string }[];
};
// GET accounts/{slug}: the same plus the page's own text and SEO.
export type ApiSubDetail = ApiSub & { short_detail: string | null; content: string | null; seo: { meta_title: string | null; meta_desc: string | null } };

// An order, from POST account/subscriptions/buy and GET account/subscriptions/orders/{id}. Support moves it along
// in admin › orders: queued (paid) → in_progress → done; or cancelled / refunded to the wallet.
export type ApiSubOrder = {
  id: number;
  status: "unpaid" | "queued" | "in_progress" | "done" | "cancelled" | "refunded" | "paused";
  product: { id: number; slug: string; name: string; en_name: string | null; image: string | null; color: string | null; activation: ApiSub["activation"] } | null;
  plan: { id: number | null; name: string; en_name: string | null; months: number | null };
  fields: { title: string; value: string | null }[];
  price: number;
  paid_with: "wallet" | "card";
  created_at: string;
  // Done: may the buyer comment on the product (design/account/ReviewCard), or did they already.
  review?: { state: "open" | "sent" } | null;
};

const PERSIAN = /[؀-ۿ]/;
const FALLBACK_COLOR = "#475569";

// "buy-spotify-account" → "Spotify", "trading-view" → "Trading View": the English name until the admin sets one.
function nameFromSlug(slug: string) {
  const words = slug.replace(/^buy-/, "").replace(/-(account|accounts|subscription)$/, "").split("-").filter(Boolean);
  return words.map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ") || slug;
}

export const monthsLabel = (m: number) => (m === 12 ? "1 year" : m % 12 === 0 ? `${m / 12} years` : m === 1 ? "1 month" : `${m} months`);

function planName(p: ApiSubPlan, i: number, locale: "en" | "fa") {
  if (locale === "fa") return p.name;
  if (p.en_name) return p.en_name;
  return [p.tier, p.months ? monthsLabel(p.months) : null].filter(Boolean).join(" · ") || `Plan ${i + 1}`;
}

// English labels for the admin's Persian field titles (the English site can't show Persian).
function fieldLabel(f: ApiSubField, product: string, locale: "en" | "fa") {
  if (locale === "fa" || !PERSIAN.test(f.title)) return f.title;
  if (f.type === "password") return `Password of your ${product} account`;
  if (f.type === "email") return `Email of your ${product} account`;
  if (/تلگرام/.test(f.title)) return "Your Telegram username";
  if (/نام\s*کاربری|یوزر|آیدی/.test(f.title)) return `Your ${product} username`;
  return f.type === "select" ? "Option" : `Your ${product} account`;
}

export function toSubProduct(a: ApiSub, locale: "en" | "fa"): SubProduct {
  const name = locale === "fa" ? a.name : a.en_name || nameFromSlug(a.slug);
  const plans: SubPlan[] = a.plans.map((p, i) => ({
    id: String(p.id), name: planName(p, i, locale), months: p.months ?? 0, price: p.price, was: p.was ?? undefined, popular: !!p.popular,
  }));
  const fields: SubField[] = a.fields.map((f) => ({
    id: f.name, label: fieldLabel(f, name, locale), type: f.type, options: f.type === "select" ? f.options : undefined,
  }));
  // Notes are written in Persian; the English site leaves out the ones it can't show.
  const notes = a.notes.map((n) => `${n.label}: ${n.value}`).filter((n) => locale === "fa" || !PERSIAN.test(n));
  // The card under the buy panel leaves out «نوع فعال‌سازی»: the activation badge already says it (delivery time is
  // taken out by the server).
  const specs = a.notes.filter((n) => !/نوع\s*فعال/u.test(n.label)).filter((n) => locale === "fa" || !PERSIAN.test(`${n.label}${n.value}`));
  return {
    id: a.id,
    slug: a.slug,
    name,
    cat: a.category,
    letter: name.replace(/[^\p{L}\p{N}]/gu, "").slice(0, 1).toUpperCase() || "•",
    color: a.color || FALLBACK_COLOR,
    image: a.image ?? undefined,
    tagline: (locale === "fa" ? a.tagline : a.tagline_en) ?? "",
    activation: a.activation,
    delivery: (locale === "fa" ? a.delivery : a.delivery_en) ?? "",
    plans,
    fields,
    // The English site shows the English wording when the admin wrote one, else the Persian.
    addons: (a.addons ?? []).map((x) => ({
      id: x.id, question: (locale === "en" && x.question_en) || x.question,
      options: x.options.map((o) => ({ id: o.id, label: (locale === "en" && o.label_en) || o.label, prices: o.prices ?? {} })),
    })),
    notes,
    specs,
    popular: a.popular,
  };
}

export const toSubProducts = (list: ApiSub[], locale: "en" | "fa") => list.map((a) => toSubProduct(a, locale));
