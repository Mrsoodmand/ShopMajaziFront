import type { Metadata } from "next";
import { Inter, Space_Grotesk, Instrument_Serif, JetBrains_Mono } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { LocaleProvider } from "@/i18n/client";
import { AccountProvider } from "@/lib/account";
import ScrollReveal from "@/components/ScrollReveal";
import { Suspense } from "react";
import { BrandProvider } from "@/components/brand/Brand";
import RouteLoader from "@/components/brand/RouteLoader";
import { readDecisions } from "@/components/design/decisions";
import { dirOf } from "@/i18n/config";
import { getLocale, getPrices, getT } from "@/i18n/server";

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
    title: t("ShopMajazi — Digital services, delivered instantly"),
    description: t("Virtual numbers, Google Voice, Apple ID, subscriptions and social growth services."),
  };
}

// Runs before first paint: applies the saved theme, or the device setting, so dark mode never flashes white.
const themeScript = `try{var t=localStorage.getItem("theme");if(t==="dark"||(!t&&matchMedia("(prefers-color-scheme: dark)").matches))document.documentElement.classList.add("dark")}catch(e){}`;

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [locale, prices, decisions] = await Promise.all([getLocale(), getPrices(), readDecisions()]);
  return (
    <html lang={locale} dir={dirOf(locale)} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className={`${inter.variable} ${grotesk.variable} ${serif.variable} ${mono.variable} ${iransans.variable} bg-white font-sans text-slate-900 dark:bg-[#070B14] dark:text-slate-100`}>
        <LocaleProvider locale={locale} prices={prices}>
          <BrandProvider mark={decisions.logo?.offer}>
            <AccountProvider>{children}</AccountProvider>
            <Suspense fallback={null}><RouteLoader /></Suspense>
          </BrandProvider>
          <ScrollReveal />
        </LocaleProvider>
      </body>
    </html>
  );
}
