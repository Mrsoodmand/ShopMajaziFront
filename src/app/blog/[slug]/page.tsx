import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getSection } from "@/design/registry";
import { readDecisions } from "@/components/design/decisions";
import { LiveArticleProvider } from "@/design/blogPost/parts";
import { PostWithHero, type PostHeroId } from "@/design/blogPost/heroes";
import { getLocale, getT } from "@/i18n/server";
import { loadArticle } from "@/lib/blog";
import { loadComments } from "@/lib/comments";
import { absolute, SHARE_LOGO, withShare } from "@/lib/seo";
import { SITE_URL } from "@/lib/sitemap";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

// The canonical address is the Persian page (/blog/{slug}) in both languages: the posts are written in Persian.
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const found = await loadArticle(slug, await getLocale());
  if (!found) return {};
  const { article, seo } = found;
  const t = await getT();
  const image = seo.image ? absolute(seo.image) : undefined;
  // Some admin titles already end in the site's name; it isn't added a second time.
  const branded = /شاپ\s*مجازی|shop\s*majazi/i.test(seo.title);
  return withShare({
    title: branded ? seo.title : t("{0} — ShopMajazi", { 0: seo.title }),
    description: seo.description,
    alternates: { canonical: `/blog/${article.post.slug}` },
    openGraph: {
      type: "article", title: seo.title, description: seo.description, locale: "fa_IR", url: `/blog/${article.post.slug}`,
      ...(seo.published && { publishedTime: seo.published }),
      ...(image && { images: [{ url: image }] }),
    },
  });
}

// The live blog post from the backend, in whichever page design is chosen in /design/page-blog-post (falls back to B).
export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const found = await loadArticle(slug, await getLocale());
  if (!found) notFound();
  const { article: post, seo, id } = found;

  const [decisions, t, locale] = await Promise.all([readDecisions(), getT(), getLocale()]);
  // The post's approved comments (the old site's too: same comments table), and the key new ones are sent under.
  const key = `blog:${id}`;
  const article = { ...post, comments: { key, list: await loadComments(key, locale, t("ShopMajazi support")) } };
  const section = getSection("page-blog-post")!;
  const offer = section.offers.find((o) => o.id === decisions["page-blog-post"]?.offer) ?? section.offers.find((o) => o.id === "B")!;
  const { Component } = offer;
  // The hero chosen in /design/blog-post-hero; it fits post design B, the one the live page uses.
  const picked = decisions["blog-post-hero"]?.offer;
  const hero = offer.id === "B" && picked && "ABCDEF".includes(picked) && picked.length === 1 ? (picked as PostHeroId) : undefined;

  // Article structured data for search results.
  const ld = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: article.post.title,
    description: seo.description,
    inLanguage: "fa",
    ...(seo.image && { image: absolute(seo.image) }),
    ...(seo.published && { datePublished: seo.published }),
    ...(seo.modified && { dateModified: seo.modified }),
    author: { "@type": "Organization", name: t("ShopMajazi"), url: SITE_URL },
    // The square logo (600×600): the old wide logo-v5.jpg was 284×68, under the 112px search engines ask for.
    publisher: { "@type": "Organization", name: t("ShopMajazi"), logo: { "@type": "ImageObject", url: absolute(SHARE_LOGO.url), width: SHARE_LOGO.width, height: SHARE_LOGO.height } },
    mainEntityOfPage: `${SITE_URL}/blog/${article.post.slug}`,
  };

  // The post's questions and answers as plain text, as the old site gave them to search engines.
  const plain = (s: string) => s.replace(/<[^>]*>/g, "").trim();
  const questions = article.faq.map((f) => ({ q: plain(f.q), a: plain(f.a) })).filter((f) => f.q && f.a);
  const faqLd = questions.length > 0 && {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: questions.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld).replace(/</g, "\\u003c") }} />
      {faqLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd).replace(/</g, "\\u003c") }} />}
      <LiveArticleProvider value={article}>
        {hero ? <PostWithHero slug={slug} hero={hero} /> : <Component slug={slug} />}
      </LiveArticleProvider>
    </>
  );
}
