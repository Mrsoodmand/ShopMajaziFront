import { getLocale } from "@/i18n/server";
import { extrasFor } from "@/content/service-extras-en";
import { loadBlog } from "@/lib/blog";
import ServiceExtras from "./ServiceExtras";

// ServiceExtras for the live service pages: its blog section shows the three newest real posts on the service's
// topic, topped up with guides. With no posts (or the backend down) the section is left out.
export default async function LiveServiceExtras({ service }: { service: string }) {
  const all = (await loadBlog(await getLocale())) ?? [];
  const topic = extrasFor(service).blogCat;
  const onTopic = all.filter((p) => p.cat === topic);
  const posts = [...onTopic, ...all.filter((p) => p.cat === "guides" && !onTopic.includes(p))].slice(0, 3);
  return <ServiceExtras service={service} posts={posts} />;
}
