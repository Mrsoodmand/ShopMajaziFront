// Verification products from the backend (GET /api/v1/storefront/verifications, set up in React admin › وریفای;
// see Back/app/Services/VerificationOrders.php). Prices are in toman. Mapped into the Subscriptions design's
// SubProduct so /verify renders with the same designs as /accounts (design/subs/live.tsx `flavor: "verify"`).
import type { SubField, SubPlan, SubProduct } from "@/content/subs-en";

export type ApiVerifyField = {
  name: string; title: string; title_en: string | null; type: "text" | "email" | "phone" | "select" | "textarea" | "date" | "file";
  required: boolean; hint: string | null; hint_en: string | null; options: string[]; accept: ("image" | "pdf")[]; max_mb: number | null;
};
export type ApiVerify = {
  id: number;
  slug: string;
  name: string;
  en_name: string | null;
  kind: "ready" | "verify";
  tagline: string | null;
  tagline_en: string | null;
  color: string | null;
  image: string | null;
  delivery: string | null;
  delivery_en: string | null;
  popular: boolean;
  plans: { id: number; name: string; en_name: string | null; popular: boolean; price: number; was: number | null }[];
  fields: ApiVerifyField[];
  notes: { label: string; value: string }[];
};
// GET verifications/{slug}: the same plus the page's own text and SEO.
export type ApiVerifyDetail = ApiVerify & { short_detail: string | null; content: string | null; seo: { meta_title: string | null; meta_desc: string | null; head: string | null } };

const PERSIAN = /[؀-ۿ]/;
const FALLBACK_COLOR = "#475569";

// The English site can't show the admin's Persian titles: their English one, else a plain label by type.
function fieldLabel(f: ApiVerifyField, locale: "en" | "fa") {
  if (locale === "fa") return f.title;
  if (f.title_en) return f.title_en;
  if (!PERSIAN.test(f.title)) return f.title;
  return { email: "Email", phone: "Phone number", date: "Date", file: "Document", select: "Option", textarea: "Details", text: "Your answer" }[f.type];
}

export function toVerifyProduct(a: ApiVerify, locale: "en" | "fa"): SubProduct {
  const name = locale === "fa" ? a.name : a.en_name || (PERSIAN.test(a.name) ? a.slug.replace(/-/g, " ") : a.name);
  const plans: SubPlan[] = a.plans.map((p, i) => ({
    id: String(p.id), name: locale === "fa" ? p.name : p.en_name || (PERSIAN.test(p.name) ? `Plan ${i + 1}` : p.name),
    months: 0, price: p.price, was: p.was ?? undefined, popular: !!p.popular,
  }));
  const fields: SubField[] = a.fields.map((f) => ({
    id: f.name,
    label: fieldLabel(f, locale),
    hint: (locale === "fa" ? f.hint : f.hint_en || (f.hint && !PERSIAN.test(f.hint) ? f.hint : null)) ?? undefined,
    type: f.type,
    options: f.type === "select" ? f.options : undefined,
    optional: !f.required,
    accept: f.type === "file" ? (f.accept.length ? f.accept : ["image"]) : undefined,
    maxMb: f.type === "file" ? f.max_mb ?? 5 : undefined,
  }));
  return {
    id: a.id,
    slug: a.slug,
    name,
    cat: a.kind === "ready" ? "verified" : "verify",
    letter: name.replace(/[^\p{L}\p{N}]/gu, "").slice(0, 1).toUpperCase() || "•",
    color: a.color || FALLBACK_COLOR,
    image: a.image ?? undefined,
    tagline: (locale === "fa" ? a.tagline : a.tagline_en) ?? "",
    // "ready": we deliver a ready verified account; "own": we verify the buyer's own account.
    activation: a.kind === "ready" ? "ready" : "own",
    delivery: (locale === "fa" ? a.delivery : a.delivery_en) ?? "",
    plans,
    fields,
    notes: a.notes.map((n) => `${n.label}: ${n.value}`).filter((n) => locale === "fa" || !PERSIAN.test(n)),
    // «پیش از خرید بدانید» card under the buy panel (subs/notesPlacement.tsx): leaves out what the header already says,
    // the activation type and (when the product has its own delivery time) a delivery-time note.
    specs: a.notes
      .filter((n) => !/نوع\s*فعال/u.test(n.label) && !(a.delivery && /زمان|مدت\s*تحویل/u.test(n.label)))
      .filter((n) => locale === "fa" || !PERSIAN.test(`${n.label}${n.value}`)),
    popular: a.popular,
  };
}

export const toVerifyProducts = (list: ApiVerify[], locale: "en" | "fa") => list.map((a) => toVerifyProduct(a, locale));

// The file types a field takes, for <input accept> and the check before sending (the backend checks again).
export const ACCEPT_MIME: Record<"image" | "pdf", string[]> = {
  image: ["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"],
  pdf: ["application/pdf"],
};
