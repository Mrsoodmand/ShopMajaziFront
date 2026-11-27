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
import { EDITION, SITE_INDEXED } from "@/i18n/edition";
import { getLocale, getPrices, getT } from "@/i18n/server";
import { cookies } from "next/headers";
import { SpotlightProvider } from "@/design/service/spotlight";
import { HERO_PREVIEW_COOKIE } from "@/design/service/heroPreview";
import { SITE_URL } from "@/lib/sitemap";
import { SHARE_LOGO, siteTexts } from "@/lib/seo";
import Script from "next/script";

// Analytics carried over from the old Blade header (site-v2/layout/header.blade.php). Production builds only,
// so local development doesn't show up in the reports. Started once the page has fully loaded (lazyOnload): on
// Iranian connections Google and Microsoft can answer slowly, and they shouldn't compete with the page's own files.
const GTM_ID = "GTM-M9NKWXDK";
const CLARITY_ID = "lbb2ig9kcg";
const ANALYTICS = process.env.NODE_ENV === "production";
const gtmScript = `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GTM_ID}');`;
const clarityScript = `(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script","${CLARITY_ID}");`;

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
// Display, serif and code fonts appear in a few places only, so they aren't preloaded: a page that uses one still
// fetches it, but no visitor (on the Persian site, nearly none use them) downloads them up front.
const grotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-grotesk", preload: false });
const serif = Instrument_Serif({ subsets: ["latin"], weight: "400", style: ["normal", "italic"], variable: "--font-serif-display", preload: false });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono-code", preload: false });
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
  const [t, locale, site] = await Promise.all([getT(), getLocale(), siteTexts()]);
  return {
    // Canonical and share addresses the pages give as paths ("/blog/x") go out as full addresses on the site's domain.
    metadataBase: new URL(SITE_URL),
    ...site,
    // Link-preview defaults for pages that set no share data of their own (sign-in, 404…). The rest go through
    // lib/seo.ts › withShare, since a page's openGraph replaces this one whole. No title here: previews then use the
    // page's own <title>.
    openGraph: { type: "website", siteName: t("ShopMajazi"), locale: locale === "fa" ? "fa_IR" : "en_US", images: [{ ...SHARE_LOGO, alt: t("ShopMajazi") }] },
    twitter: { card: "summary" },
    // A site not open to search engines yet (SITE_INDEX=0, src/i18n/edition.ts): every page says noindex.
    ...(!SITE_INDEXED && { robots: { index: false, follow: false } }),
    // The eNamad trust seal is registered for shopmajazi.com.
    ...(EDITION !== "en" && { other: { enamad: "838208" } }),
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
        {ANALYTICS && (
          <>
            <noscript>
              <iframe src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`} height="0" width="0" style={{ display: "none", visibility: "hidden" }} />
            </noscript>
            <Script id="gtm" strategy="lazyOnload">{gtmScript}</Script>
            <Script id="clarity" strategy="lazyOnload">{clarityScript}</Script>
          </>
        )}
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
