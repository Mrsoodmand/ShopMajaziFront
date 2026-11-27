import { cache } from "react";
import type { Locale } from "@/i18n/config";
import { HAS_BLOG } from "@/i18n/edition";
import { makeT } from "@/i18n/translate";
import { blogCats, type BlogCat, type Post } from "@/content/blog-en";
import { team, topicProducts, type ArticlePage, type TocItem } from "@/content/blog-post-en";
import { isNotFound, storefront } from "./backend";

// The blog from the backend (GET /api/v1/storefront/blog and /blog/{slug}): posts and tech news written in the
// React admin › Blog / News, in Persian. Topics come from the admin, or are guessed from the slug (App\Services\BlogTopics).
// Server only. Dates and reading times are written here in the page's language, so the designs show them as they are.

export type ApiBlogPost = {
  title: string;
  slug: string;
  type: "blog" | "news";
  topic: string;
  excerpt: string;
  image: string | null;
  thumb: string | null;
  views: number;
  reading_minutes: number;
  published_at: string | null;
  created_at: string | null;
};

type ApiBlogArticle = {
  post: ApiBlogPost & {
    id: number;
    html: string;
    toc: { id: string; text: string; level: 2 | 3 }[];
    meta_title: string | null;
    meta_desc: string | null;
    updated_at: string | null;
    faq: { q: string; a: string }[];
  };
  related: ApiBlogPost[];
  next: ApiBlogPost | null;
};

// What the post page needs for its <head> and structured data.
export type ArticleSeo = { title: string; description: string; image: string | null; published: string | null; modified: string | null };

// Posts are written on Tehran time.
const dates: Record<Locale, Intl.DateTimeFormat> = {
  fa: new Intl.DateTimeFormat("fa-IR", { day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Tehran" }),
  en: new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "Asia/Tehran" }),
};

// Posts are kept for an hour: the backend drops them here itself when one is saved, published or deleted
// (App\Models\Blog › booted), so the hour only decides how often an unchanged post is asked for again.
const BLOG_CACHE = 3600;

const isCat = (v: string): v is BlogCat => blogCats.some((c) => c.id === v);

export function toPost(p: ApiBlogPost, locale: Locale): Post {
  const when = p.published_at ?? p.created_at;
  return {
    slug: p.slug,
    cat: isCat(p.topic) ? p.topic : "guides",
    title: p.title,
    excerpt: p.excerpt,
    date: when ? dates[locale].format(new Date(when)) : "",
    read: makeT(locale)("{0} min", { 0: p.reading_minutes }),
    image: p.image ?? undefined,
    views: p.views,
    ...(when && { iso: when }),
    // The posts are Persian; on the English site their text is marked as such (right to left, Persian font).
    ...(locale === "en" && { lang: "fa" as const }),
  };
}

// Every published post and news item, newest first. null when the backend can't be reached. None on the English
// site, which has no blog (src/i18n/edition.ts): the blog sections of the other pages are then left out.
export const loadBlog = cache(async (locale: Locale): Promise<Post[] | null> => {
  if (!HAS_BLOG) return [];
  try {
    const { posts } = await storefront<{ posts: ApiBlogPost[] }>("blog", BLOG_CACHE);
    return posts.map((p) => toPost(p, locale));
  } catch (e) {
    console.error("blog: backend unavailable", e);
    return null;
  }
});

// One post, ready for the post page designs. null when there is no such published post; throws when the backend
// can't be reached (the page shows the error page rather than a wrong 404).
export const loadArticle = cache(async (slug: string, locale: Locale): Promise<{ article: ArticlePage; seo: ArticleSeo; id: number } | null> => {
  if (!HAS_BLOG) return null;
  let data: ApiBlogArticle;
  try {
    data = await storefront<ApiBlogArticle>(`blog/${encodeURIComponent(slug)}`, BLOG_CACHE);
  } catch (e) {
    if (isNotFound(e)) return null;
    throw e;
  }
  const t = makeT(locale);
  const { post: p } = data;
  const post = toPost(p, locale);
  const toc: TocItem[] = p.toc.map(({ id, text, level }) => ({ id, text, level }));
  const article: ArticlePage = {
    post,
    // The stored edit date also moved on every page view until now, so it isn't shown as "Updated".
    updated: post.date,
    author: { name: t(team.name), role: t(team.role), initials: team.initials },
    lead: p.excerpt,
    tags: [],
    product: topicProducts[post.cat], // translated (and priced in toman) by ProductCta
    takeaways: [],
    body: [],
    html: p.html,
    faq: p.faq,
    toc,
    related: data.related.map((r) => toPost(r, locale)),
    next: data.next ? toPost(data.next, locale) : post,
    ...(post.lang && { lang: post.lang }),
  };
  const seo: ArticleSeo = {
    title: p.meta_title?.trim() || p.title,
    description: p.meta_desc?.trim() || p.excerpt,
    image: p.image,
    published: p.published_at ?? p.created_at,
    modified: p.updated_at,
  };
  return { article, seo, id: p.id };
});
