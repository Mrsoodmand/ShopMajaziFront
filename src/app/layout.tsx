import type { Metadata } from "next";
import { Inter, Space_Grotesk, Instrument_Serif, JetBrains_Mono } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { LocaleProvider } from "@/i18n/client";
import { AccountProvider } from "@/lib/account";
import { CartProvider } from "@/lib/cart";
import CartDrawer from "@/components/cart/CartDrawer";
import { SignInPopupProvider } from "@/components/account/SignIn";
import ScrollReveal from "@/components/ScrollReveal";
import PersianDigits from "@/components/PersianDigits";
import { Suspense } from "react";
import { BrandProvider } from "@/components/brand/Brand";
import RouteLoader from "@/components/brand/RouteLoader";
import { readDecisions } from "@/components/design/decisions";
import { dirOf } from "@/i18n/config";
import { getLocale, getPrices, getT } from "@/i18n/server";
import { cookies } from "next/headers";
import { SpotlightProvider } from "@/design/service/spotlight";
import { HERO_PREVIEW_COOKIE } from "@/design/service/heroPreview";
import { SITE_URL } from "@/lib/sitemap";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const grotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-grotesk" });
const serif = Instrument_Serif({ subsets: ["latin"], weight: "400", style: ["normal", "italic"], variable: "--font-serif-display" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono-code" });
// Persian pages (see globals.css). FaNum: Latin digits are drawn as Persian digits.
const iransans = localFont({
  variable: "--font-iransans",
  display: "swap",
  src: [
    { path: "./fonts/IRANSansFaNum_Light.woff2", weight: "300" },
    { path: "./fonts/IRANSansFaNum.woff2", weight: "400" },
    { path: "./fonts/IRANSansFaNum_Medium.woff2", weight: "500" },
    { path: "./fonts/IRANSansFaNum_Bold.woff2", weight: "600" },
    { path: "./fonts/IRANSansFaNum_Bold.woff2", weight: "700" },
    { path: "./fonts/IRANSansFaNum_Black.woff2", weight: "800" },
  ],
});

export async function generateMetadata(): Promise<Metadata> {
  const t = await getT();
  return {
    // Canonical and share addresses the pages give as paths ("/blog/x") go out as full addresses on the site's domain.
    metadataBase: new URL(SITE_URL),
    title: t("ShopMajazi — Digital services, delivered instantly"),
    description: t("Virtual numbers, Google Voice, Apple ID, subscriptions and social growth services."),
  };
}

// Runs before first paint: applies the saved theme, or the device setting, so dark mode never flashes white.
const themeScript = `try{var t=localStorage.getItem("theme");if(t==="dark"||(!t&&matchMedia("(prefers-color-scheme: dark)").matches))document.documentElement.classList.add("dark")}catch(e){}`;

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [locale, prices, decisions] = await Promise.all([getLocale(), getPrices(), readDecisions()]);
  // Landing-page hero: "Spotlight × Grid" once chosen (offer B), or while its preview cookie is on (/design/landing-hero).
  const heroPreview = (await cookies()).get(HERO_PREVIEW_COOKIE)?.value === "spotlight";
  const spotlight = decisions["landing-hero"]?.offer === "B" || heroPreview;
  return (
    <html lang={locale} dir={dirOf(locale)} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className={`${inter.variable} ${grotesk.variable} ${serif.variable} ${mono.variable} ${iransans.variable} bg-white font-sans text-slate-900 dark:bg-[#070B14] dark:text-slate-100`}>
        <LocaleProvider locale={locale} prices={prices}>
          <BrandProvider mark={decisions.logo?.offer}>
            <AccountProvider><CartProvider><SignInPopupProvider><SpotlightProvider on={spotlight} preview={heroPreview && decisions["landing-hero"]?.offer !== "B"}>{children}</SpotlightProvider><CartDrawer /></SignInPopupProvider></CartProvider></AccountProvider>
            <Suspense fallback={null}><RouteLoader /></Suspense>
          </BrandProvider>
          <ScrollReveal />
          <PersianDigits />
        </LocaleProvider>
      </body>
    </html>
  );
}
