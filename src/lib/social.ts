// Social media services from the backend (GET /api/v1/storefront/virtual-services → platforms and services set in
// the React admin › Virtual services). Prices are in toman per 1,000.
import type { SocialCategory } from "@/content/social-categories-en";

export type ApiSocialService = {
  id: number;
  slug: string;
  name: string;
  en_name: string | null;
  url: string;
  price_per_1000: number;
  // Any amount: a multiple of `step` (500) between min and max, at `price` toman per step. null = packages.
  count_pricing: { step: number; price: number; min: number; max: number } | null;
};

export type ApiSocialCategory = {
  id: number;
  slug: string;
  name: string;
  en_name: string | null;
  tagline: string | null;
  tagline_en: string | null;
  logo: string | null;
  color: string | null;
  featured: boolean;
  sort: number;
  from_per_1000: number | null;
  services: ApiSocialService[];
};

export type ApiVirtualServices = { categories: ApiSocialCategory[] };

// GET /api/v1/storefront/virtual-services/{platform}: one platform's services with what ordering needs.
export type ApiServicePlan = { id: number; token: string; name: string; count: number; price: number };
export type ApiServiceField = { name: string; title: string; type: "text" | "select"; options: string[] };
export type ApiServiceNote = { label: string; value: string };
export type ApiOrderService = ApiSocialService & { plans: ApiServicePlan[]; fields: ApiServiceField[]; notes: ApiServiceNote[] };
type Seo = { meta_title: string | null; meta_desc: string | null };
export type ApiServicePlatform = {
  category: { id: number; slug: string; name: string; en_name: string | null; tagline: string | null; tagline_en: string | null; color: string | null; image: string | null; short_detail: string | null; content: string | null; seo: Seo };
  services: ApiOrderService[];
};
// GET /api/v1/storefront/virtual-services/{platform}/{service}: one service's own page (SEO and FAQ).
export type ApiServiceDetail = {
  category: { id: number; slug: string; name: string };
  service: ApiOrderService & { short_detail: string | null; content: string | null; seo: Seo; faq: { q: string; a: string }[] };
};

// An order, from POST account/services/buy and GET account/services/orders/{id}. Support moves it along in
// admin › orders: queued (paid, waiting to start) → in_progress → done; or cancelled / refunded to the wallet.
export type ApiServiceOrder = {
  id: number;
  status: "unpaid" | "queued" | "in_progress" | "done" | "cancelled" | "refunded" | "paused";
  service: { id: number; slug: string; name: string; en_name: string | null } | null;
  platform: { slug: string; name: string; en_name: string | null } | null;
  count: number | null;
  plan_name: string | null;
  fields: { title: string; value: string }[];
  price: number;
  paid_with: "wallet" | "card";
  created_at: string;
};

// ---------- The order page's own model ----------

export type LiveField = { name: string; title: string; kind: "text" | "select"; options: string[]; link: boolean };
export type LiveService = {
  id: number;
  slug: string;
  name: string;
  per1000: number;
  // Fixed packages (plans), or any count between min and max in steps of `step` at `price` toman per step.
  plans: { id: number; count: number; price: number }[];
  count: { step: number; price: number; min: number; max: number } | null;
  fields: LiveField[];
  notes: ApiServiceNote[];
};

// "⌛️ مدت تحویل:" → "مدت تحویل". Notes saved as a plain list come back labelled "0", "1", …: those have no label.
const noteLabel = (s: string) => {
  const label = s.replace(/^[^\p{L}\p{N}]+/u, "").replace(/\s*[:：]\s*$/, "").trim();
  return /^\d+$/.test(label) ? "" : label;
};
// Fields that take a link or username: shown left-to-right, with the "never your password" line.
const isLink = (f: ApiServiceField) => f.type === "text" && (/link|url|id|user/i.test(f.name) || /لینک|آیدی|یوزر|آدرس/.test(f.title));
const PERSIAN = /[؀-ۿ]/;
// English titles for the admin's other (Persian) field titles. A field can't be left out, so an unknown title
// stays in Persian.
const EN_FIELD: Record<string, string> = { "متن پاسخ": "Answer text" };
function fieldTitle(f: ApiServiceField, locale: "en" | "fa") {
  if (locale === "fa" || !PERSIAN.test(f.title)) return f.title;
  return isLink(f) ? "Link or username" : EN_FIELD[f.title.trim()] ?? f.title;
}

export function toLiveServices(services: ApiOrderService[], locale: "en" | "fa"): LiveService[] {
  return services
    .map((s) => ({
      id: s.id,
      slug: s.slug,
      name: locale === "fa" ? s.name : display(s.en_name || s.name),
      per1000: s.price_per_1000,
      plans: s.plans.map((p) => ({ id: p.id, count: p.count, price: p.price })),
      count: s.count_pricing && s.count_pricing.price > 0 ? s.count_pricing : null,
      // Field titles are written in Persian in the admin; the English site names them itself where it can.
      fields: s.fields.map((f) => ({ name: f.name, title: fieldTitle(f, locale), kind: f.type, options: f.options, link: isLink(f) })),
      // Notes are Persian too; like the article and FAQ, the English site leaves out the ones written in Persian.
      notes: s.notes.map((n) => ({ label: noteLabel(n.label), value: n.value }))
        .filter((n) => n.label && (locale === "fa" || !PERSIAN.test(n.label + n.value))),
    }))
    // A service with no live plans (or no price) can't be bought.
    .filter((s) => s.count || s.plans.length);
}

// Platforms the site has a built-in icon for, used when the admin has not uploaded a logo.
const ICONS = new Set(["telegram", "instagram", "youtube", "tiktok", "x", "facebook", "twitch", "linkedin"]);

// Brand colours for the platforms the designs draw, used until the admin picks a colour.
export const PLATFORM_BRAND: Record<string, string> = { telegram: "#0ea5e9", instagram: "#db2777", youtube: "#dc2626", tiktok: "#0f172a" };

// Old records sometimes hold an English name in lowercase ("telegram") or with doubled spaces; show it tidied.
export function display(s: string) {
  const t = s.replace(/\s+/g, " ").trim();
  return t === t.toLowerCase() ? t.charAt(0).toUpperCase() + t.slice(1) : t;
}

export function toSocialCategories(data: ApiVirtualServices, locale: "en" | "fa"): SocialCategory[] {
  return data.categories.map((c) => ({
    slug: c.slug,
    name: locale === "fa" ? c.name : display(c.en_name || c.name),
    short: (locale === "fa" ? c.tagline : c.tagline_en) ?? "",
    color: c.color || PLATFORM_BRAND[c.slug] || "#475569",
    logo: c.logo ?? undefined,
    icon: !c.logo && ICONS.has(c.slug) ? c.slug : undefined,
    featured: c.featured,
    order: c.sort,
    services: c.services.map((s) => ({ slug: s.slug, name: locale === "fa" ? s.name : display(s.en_name || s.name), from: s.price_per_1000 })),
  }));
}
