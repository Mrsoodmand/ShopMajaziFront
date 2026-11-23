import type { Metadata } from "next";
import { getT } from "@/i18n/server";
import { ContactBLive } from "@/design/info/offers";
import { PageHeadingProvider } from "@/components/seo/PageHeading";
import { pageSeo, seoMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getT();
  return seoMetadata("contact-us", {
    title: t("Contact us — ShopMajazi"),
    description: t("Questions about an order, a payment or your account? Message us on Telegram, email or phone, or leave a message here."),
    alternates: { canonical: "/contact-us" },
  });
}

// Contact us = page-contact B "Split Form" (decisions.json). The form posts to api/v1/storefront/contact
// (Laravel StorefrontContactController), replacing the old Blade page.
export default async function ContactUsPage() {
  const seo = await pageSeo("contact-us");
  return <PageHeadingProvider h1={seo.h1}><ContactBLive live /></PageHeadingProvider>;
}
