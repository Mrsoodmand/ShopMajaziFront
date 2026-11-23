import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { loadVerify, verifyMetadata, VerifyPage } from "../render";
import type { ApiVerifyDetail } from "@/lib/verify";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return verifyMetadata((await params).slug);
}

// One verification product's own page, e.g. /verify/paypal-verify (same design as /accounts/{slug}).
// Unknown or switched-off products are a 404; with the backend down the catalog explains instead.
export default async function VerifyProductPage({ params }: Props) {
  const { slug } = await params;
  let raw: ApiVerifyDetail | null | undefined;
  try { raw = await loadVerify(slug); } catch { raw = undefined; /* backend down */ }
  if (raw === null) notFound();
  return <VerifyPage slug={slug} raw={raw} />;
}
