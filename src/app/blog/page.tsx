import type { Metadata } from "next";
import { getT } from "@/i18n/server";
import { getSection } from "@/design/registry";
import { readDecisions } from "@/components/design/decisions";
import { blogCats } from "@/content/blog-en";

export const dynamic = "force-dynamic";

type Props = { searchParams: Promise<{ topic?: string }> };

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { topic: id } = await searchParams;
  const topic = blogCats.find((c) => c.id === id);
  const t = await getT();
  return {
    title: topic ? t("{0} articles — ShopMajazi blog", { 0: t(topic.label) }) : t("Blog: guides, news and how-tos — ShopMajazi"),
    description: t("Step-by-step guides for virtual numbers, Apple ID, Telegram, subscriptions and growing your channels."),
    alternates: { canonical: topic ? `/blog?topic=${topic.id}` : "/blog" },
  };
}

// The live blog list: renders whichever page design is chosen in /design/page-blog (falls back to F).
// `?topic=` opens it filtered to one topic.
export default async function BlogPage({ searchParams }: Props) {
  const [decisions, { topic }] = await Promise.all([readDecisions(), searchParams]);
  const section = getSection("page-blog")!;
  const offer = section.offers.find((o) => o.id === decisions["page-blog"]?.offer) ?? section.offers.find((o) => o.id === "F")!;
  const { Component } = offer;
  return <Component topic={topic} />;
}
