import { getLocale, getT } from "@/i18n/server";
import { extrasFor } from "@/content/service-extras-en";
import { loadBlog } from "@/lib/blog";
import { commentKey, loadComments } from "@/lib/comments";
import { storefront } from "@/lib/backend";
import ServiceExtras from "./ServiceExtras";

// ServiceExtras for the live service pages: its blog section shows the eight newest real posts on the service's
// topic, topped up with guides (left out with no posts or the backend down), and its comments are the page's real,
// approved comments from the backend (none rather than placeholders when it is down).
export default async function LiveServiceExtras({ service }: { service: string }) {
  const locale = await getLocale();
  const t = await getT();
  // Subscriptions (and Telegram Premium, also an account product) keep their comments on the product.
  const slug = service.startsWith("subs:") ? service.slice(5) : service === "telegram-premium" ? "telegram-premium" : null;
  const productId = slug
    ? await storefront<{ account: { id: number } }>(`accounts/${encodeURIComponent(slug)}`, 60).then((r) => r.account.id).catch(() => undefined)
    : undefined;
  const key = commentKey(service, productId);
  const [all, comments] = await Promise.all([loadBlog(locale).then((p) => p ?? []), loadComments(key, locale, t("ShopMajazi support"))]);
  const topic = extrasFor(service).blogCat;
  const onTopic = all.filter((p) => p.cat === topic);
  const posts = [...onTopic, ...all.filter((p) => p.cat === "guides" && !onTopic.includes(p))].slice(0, 8);
  return <ServiceExtras service={service} posts={posts} comments={{ key, list: comments }} />;
}
