import { getLocale, getT } from "@/i18n/server";
import { extrasFor } from "@/content/service-extras-en";
import { loadBlog } from "@/lib/blog";
import { commentKey, loadComments } from "@/lib/comments";
import { storefront } from "@/lib/backend";
import ServiceExtras, { type LiveComments } from "./ServiceExtras";

// ServiceExtras for the live service pages: its blog section shows the eight newest real posts on the service's
// topic, topped up with guides (left out with no posts or the backend down), and its comments are the page's real,
// approved comments from the backend (none rather than placeholders when it is down).
// The page's real, approved comments and the key new ones are posted under. Exported so a product page that shows
// the comments in its own tabs can load them once and hand the same list to the extras.
export async function loadLiveComments(service: string): Promise<LiveComments> {
  const locale = await getLocale();
  const t = await getT();
  // Subscriptions (and Telegram Premium, also an account product) keep their comments on the product.
  const slug = service.startsWith("subs:") ? service.slice(5) : service === "telegram-premium" ? "telegram-premium" : null;
  // Verification products keep theirs on the product too.
  const verify = service.startsWith("verify:") ? service.slice(7) : null;
  const productId = slug
    ? await storefront<{ account: { id: number } }>(`accounts/${encodeURIComponent(slug)}`, 60).then((r) => r.account.id).catch(() => undefined)
    : verify
      ? await storefront<{ product: { id: number } }>(`verifications/${encodeURIComponent(verify)}`, 60).then((r) => r.product.id).catch(() => undefined)
      : undefined;
  const key = commentKey(service, productId);
  return { key, list: await loadComments(key, locale, t("ShopMajazi support")) };
}

// `omit`: the page shows comments and FAQ itself (see ServiceExtras); `comments`: already loaded by the page.
export default async function LiveServiceExtras({ service, omit = false, comments, rule = true }: { service: string; omit?: boolean; comments?: LiveComments; rule?: boolean }) {
  const locale = await getLocale();
  const [all, live] = await Promise.all([loadBlog(locale).then((p) => p ?? []), comments ?? loadLiveComments(service)]);
  const topic = extrasFor(service).blogCat;
  const onTopic = all.filter((p) => p.cat === topic);
  const posts = [...onTopic, ...all.filter((p) => p.cat === "guides" && !onTopic.includes(p))].slice(0, 8);
  return <ServiceExtras service={service} posts={posts} comments={live} omit={omit} rule={rule} />;
}
