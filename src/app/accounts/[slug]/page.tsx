import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { subBySlug } from "@/content/subs-en";
import { accountsMetadata, AccountsPage } from "../render";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = subBySlug((await params).slug);
  return p ? accountsMetadata(p) : {};
}

// One subscription's own page, e.g. /accounts/chatgpt-plus: opens on that product with its own content below.
export default async function AccountPage({ params }: Props) {
  const { slug } = await params;
  if (!subBySlug(slug)) notFound();
  return <AccountsPage slug={slug} />;
}
