import { storefront } from "@/lib/backend";
import type { Locale } from "@/i18n/config";
import type { ServiceComment } from "@/content/service-extras-en";

// Real customer comments from the Laravel `comments` table (Back: Api\StorefrontCommentController). Only comments
// the admin approved are returned; new ones are posted to the same endpoint and wait for review.

type ApiComment = { id: number; name: string; text: string; date: string | null; verified?: boolean; replies: { text: string; date: string | null }[] };
export type ApiTestimonial = { id: number; name: string; text: string; date: string | null; about: string | null; product: string | null };

// Which comments each service page shows. The keys match the old site's (page ids 1, 4, 6 …), so comments posted
// there over the years show up here, and the admin's comment queue keeps moderating both.
export function commentKey(service: string, productId?: number): string | null {
  if (service.startsWith("subs:")) return productId ? `service:${productId}` : null;
  const pages: Record<string, string> = {
    "virtual-number": "virtual-number",
    "rent-number": "rent-number",
    "google-voice": "google-voice",
    "apple-id": "apple-id",
    "apple-id-usa": "apple-id",
    "apple-id-custom": "apple-id",
    "telegram-stars": "telegram-stars",
    "telegram-ads": "telegram-ads",
    subscriptions: "accounts",
  };
  // Telegram Premium is also sold as the "telegram-premium" account product; both pages share its comments.
  if (service === "telegram-premium") return productId ? `service:${productId}` : null;
  return pages[service] ? `page:${pages[service]}` : null;
}

// "2023-12-18T22:46:22+03:30" → "۲۷ آذر ۱۴۰۲" (Persian calendar) or "Dec 18, 2023".
export function commentDate(iso: string | null, locale: Locale): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return locale === "fa"
    ? new Intl.DateTimeFormat("fa-IR-u-ca-persian", { day: "numeric", month: "long", year: "numeric" }).format(d)
    : new Intl.DateTimeFormat("en-US", { day: "numeric", month: "short", year: "numeric" }).format(d);
}

// A page's approved comments, newest first, shaped for ServiceExtras. [] when there are none or the backend is down
// (never the placeholder comments). `supportName` labels the shop's replies.
export async function loadComments(key: string | null, locale: Locale, supportName: string): Promise<ServiceComment[]> {
  if (!key) return [];
  try {
    const { comments } = await storefront<{ comments: ApiComment[] }>(`comments?key=${encodeURIComponent(key)}`, 120);
    return comments.map((c) => ({
      id: String(c.id),
      name: c.name,
      date: commentDate(c.date, locale),
      text: c.text,
      verified: !!c.verified,
      replies: c.replies.map((r) => ({ name: supportName, date: commentDate(r.date, locale), text: r.text, staff: true })),
    }));
  } catch (e) {
    console.error(`comments ${key}: backend unavailable`, e);
    return [];
  }
}

// Approved comments that tell how buying went, for the home page. [] when there are none or the backend is down.
export async function loadTestimonials(): Promise<ApiTestimonial[]> {
  try {
    return (await storefront<{ testimonials: ApiTestimonial[] }>("testimonials", 600)).testimonials;
  } catch (e) {
    console.error("testimonials: backend unavailable", e);
    return [];
  }
}
