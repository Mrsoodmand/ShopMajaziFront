import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getSection } from "@/design/registry";
import { readDecisions } from "@/components/design/decisions";
import { LiveArticleProvider } from "@/design/blogPost/parts";
import { getLocale, getT } from "@/i18n/server";
import { loadArticle } from "@/lib/blog";
import { absolute } from "@/lib/seo";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

// The canonical address is the Persian page (/blog/{slug}) in both languages: the posts are written in Persian.
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const found = await loadArticle(slug, await getLocale());
  if (!found) return {};
  const { article, seo } = found;
  const t = await getT();
  const image = seo.image ? await absolute(seo.image) : undefined;
  return {
    title: t("{0} — ShopMajazi", { 0: seo.title }),
    description: seo.description,
    alternates: { canonical: `/blog/${article.post.slug}` },
    openGraph: {
      type: "article", title: seo.title, description: seo.description, locale: "fa_IR",
      ...(seo.published && { publishedTime: seo.published }),
      ...(image && { images: [{ url: image }] }),
    },
    ...(image && { twitter: { card: "summary_large_image", images: [image] } }),
  };
}

// The live blog post from the backend, in whichever page design is chosen in /design/page-blog-post (falls back to B).
export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const found = await loadArticle(slug, await getLocale());
  if (!found) notFound();
  const { article, seo } = found;

  const [decisions, t] = await Promise.all([readDecisions(), getT()]);
  const section = getSection("page-blog-post")!;
  const offer = section.offers.find((o) => o.id === decisions["page-blog-post"]?.offer) ?? section.offers.find((o) => o.id === "B")!;
  const { Component } = offer;

  // Article structured data for search results.
  const ld = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: article.post.title,
    description: seo.description,
    inLanguage: "fa",
    ...(seo.image && { image: await absolute(seo.image) }),
    ...(seo.published && { datePublished: seo.published }),
    ...(seo.modified && { dateModified: seo.modified }),
    author: { "@type": "Organization", name: t("ShopMajazi") },
    publisher: { "@type": "Organization", name: t("ShopMajazi") },
    mainEntityOfPage: `/blog/${article.post.slug}`,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld).replace(/</g, "\\u003c") }} />
      <LiveArticleProvider value={article}>
        <Component slug={slug} />
      </LiveArticleProvider>
    </>
  );
}
