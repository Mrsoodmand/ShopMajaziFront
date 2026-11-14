import { Suspense } from "react";
import type { Metadata } from "next";
import { getT } from "@/i18n/server";
import AccountApp from "@/components/account/AccountApp";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getT();
  return { title: t("My account — ShopMajazi"), robots: { index: false, follow: false } };
}

// /account (statement), /account/orders[/id], /account/funds, /account/support[/id|/new], /account/profile,
// /account/password. One client app (design "Passbook"); the data comes from the signed-in session.
export default async function AccountPage({ params }: { params: Promise<{ slug?: string[] }> }) {
  const { slug = [] } = await params;
  return <Suspense><AccountApp slug={slug} /></Suspense>;
}
