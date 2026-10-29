import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { AppleMethod } from "@/content/apple-en";
import { appleMetadata, ApplePage } from "../render";

export const dynamic = "force-dynamic";

// The menu's two Apple ID links: /apple-id/usa opens on Ready, /apple-id/custom opens on Custom.
const kinds: Record<string, AppleMethod> = { usa: "ready", custom: "custom" };

type Props = { params: Promise<{ kind: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const method = kinds[(await params).kind];
  return method ? appleMetadata(method) : {};
}

export default async function AppleIdKindPage({ params }: Props) {
  const method = kinds[(await params).kind];
  if (!method) notFound();
  return <ApplePage method={method} />;
}
