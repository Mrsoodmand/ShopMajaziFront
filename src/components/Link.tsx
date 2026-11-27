"use client";

import NextLink from "next/link";
import { useRouter } from "next/navigation";
import type { ComponentProps, MouseEvent, TouchEvent } from "react";

// next/link without loading every page a link points to as soon as the link scrolls into view (the home page alone
// has dozens): on a slow connection, as in Iran, those downloads compete with the page being opened. A page is
// fetched ahead only when the visitor shows interest (hovers the link, or touches it on a phone), so the click still
// feels quick. A link that passes `prefetch` itself keeps its own setting.
export default function Link({ prefetch, onMouseEnter, onTouchStart, ...props }: ComponentProps<typeof NextLink>) {
  const router = useRouter();
  if (prefetch !== undefined) return <NextLink prefetch={prefetch} onMouseEnter={onMouseEnter} onTouchStart={onTouchStart} {...props} />;
  const href = typeof props.href === "string" ? props.href : null;
  const ahead = () => {
    if (href?.startsWith("/")) router.prefetch(href);
  };
  return (
    <NextLink
      {...props}
      prefetch={false}
      onMouseEnter={(e: MouseEvent<HTMLAnchorElement>) => { ahead(); onMouseEnter?.(e); }}
      onTouchStart={(e: TouchEvent<HTMLAnchorElement>) => { ahead(); onTouchStart?.(e); }}
    />
  );
}
