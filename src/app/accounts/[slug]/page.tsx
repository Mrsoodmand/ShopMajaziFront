import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { accountsMetadata, AccountsPage, loadSub } from "../render";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return accountsMetadata((await params).slug);
}

// One subscription's own page, e.g. /accounts/telegram-premium: opens on that product with its own content below.
// Unknown or switched-off subscriptions are a 404; with the backend down the catalog explains instead.
export default async function AccountPage({ params }: Props) {
  const { slug } = await params;
  let exists = true;
  try { exists = !!(await loadSub(slug)); } catch { /* backend down */ }
  if (!exists) notFound();
  return <AccountsPage slug={slug} />;
}
