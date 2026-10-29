import type { Metadata } from "next";
import { socialOrderMetadata, SocialOrderPage } from "../order";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ platform: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return socialOrderMetadata((await params).platform);
}

// One platform's services, ordered and paid on the page (design chosen in /design/page-social).
export default async function SocialPlatformPage({ params }: Props) {
  return <SocialOrderPage platform={(await params).platform} />;
}
