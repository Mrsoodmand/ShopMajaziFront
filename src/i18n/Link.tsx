"use client";

import NextLink from "next/link";
import type { ComponentProps } from "react";
import { localePath } from "./config";
import { useLocale } from "./client";

// next/link that keeps the visitor in their language: "/blog" becomes "/en/blog" on the English site.
export default function Link({ href, ...props }: ComponentProps<typeof NextLink>) {
  const locale = useLocale();
  const to = typeof href === "string" ? localePath(href, locale) : href;
  return <NextLink href={to} {...props} />;
}

export function useLocalePath() {
  const locale = useLocale();
  return (path: string) => localePath(path, locale);
}
