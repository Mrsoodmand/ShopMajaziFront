"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { Post } from "@/content/blog-en";
import { useT } from "@/i18n/client";

// The live pages (home, /blog, service pages) get real posts from the backend through this provider (see lib/blog.ts).
// Without it (the /design previews) the blog designs show the placeholder posts in content/blog-*.ts.

export type LiveBlog = { posts: Post[]; error?: string };

const Ctx = createContext<LiveBlog | null>(null);

export function LiveBlogProvider({ value, children }: { value: LiveBlog; children: ReactNode }) {
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useLiveBlog(): LiveBlog | null {
  return useContext(Ctx);
}

// The posts a blog section shows: the live ones, or else these placeholders, translated.
export function useBlogPosts(placeholder: Post[]): Post[] {
  const live = useContext(Ctx);
  const tx = useT();
  return live ? live.posts : tx.tr(placeholder);
}

// Marks a live post's Persian text on the English site: right to left, in the Persian font (globals.css).
export const textLang = (p: { lang?: "fa" }) => (p.lang ? { lang: p.lang, dir: "rtl" as const } : {});
