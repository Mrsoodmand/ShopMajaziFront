import type { Metadata } from "next";
import { socialOrderMetadata, SocialOrderPage } from "../../order";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ platform: string; service: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { platform, service } = await params;
  return socialOrderMetadata(platform, service);
}

// A service's own address: the platform's order page opened on that service, with the service's SEO and FAQ.
export default async function SocialServicePage({ params }: Props) {
  const { platform, service } = await params;
  return <SocialOrderPage platform={platform} service={service} />;
}
