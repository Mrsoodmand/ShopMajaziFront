import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getSection } from "@/design/registry";
import { readDecisions } from "@/components/design/decisions";
import { getArticle } from "@/content/blog-post-en";
import { getT } from "@/i18n/server";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const a = getArticle((await params).slug);
  if (!a) return {};
  const t = await getT();
  const title = t(a.post.title), lead = t(a.lead);
  return {
    title: t("{0} — ShopMajazi", { 0: title }),
    description: lead,
    alternates: { canonical: `/blog/${a.post.slug}` },
    openGraph: { type: "article", title, description: lead },
  };
}

// The live blog post: renders whichever page design is chosen in /design/page-blog-post (falls back to B).
export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const a = getArticle(slug);
  if (!a) notFound();

  const [decisions, t] = await Promise.all([readDecisions(), getT()]);
  const section = getSection("page-blog-post")!;
  const offer = section.offers.find((o) => o.id === decisions["page-blog-post"]?.offer) ?? section.offers.find((o) => o.id === "B")!;
  const { Component } = offer;

  // Article structured data for search results, in the page's language.
  const ld = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: t(a.post.title),
    description: t(a.lead),
    datePublished: new Date(a.post.date).toISOString(),
    dateModified: new Date(a.updated).toISOString(),
    author: { "@type": "Organization", name: t(a.author.name) },
    publisher: { "@type": "Organization", name: t("ShopMajazi") },
    mainEntityOfPage: `/blog/${a.post.slug}`,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld).replace(/</g, "\\u003c") }} />
      <Component slug={slug} />
    </>
  );
}
