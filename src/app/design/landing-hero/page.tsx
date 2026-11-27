import Link from "@/components/Link";
import { cookies } from "next/headers";
import { ExternalLink } from "lucide-react";
import { readDecisions } from "@/components/design/decisions";
import ChooseButton from "@/components/design/ChooseButton";
import { HERO_PREVIEW_COOKIE } from "@/design/service/heroPreview";
import PreviewSwitch from "./PreviewSwitch";

export const dynamic = "force-dynamic";

// Preview hub for the landing-page hero "Spotlight × Grid" (hero-system C with A's grid, design/service/spotlight.tsx).
// The switch sets a cookie, so every real page below shows the new hero for you only; "Choose this" makes it the
// site's hero (decisions.json › landing-hero = B). The home page is not part of it.
const pages = [
  { name: "Virtual number", href: "/virtual-number", note: "Centred band, search and popular apps" },
  { name: "Google Voice", href: "/google-voice", note: "Centred band" },
  { name: "Rent a number", href: "/rent-number", note: "Centred band" },
  { name: "Apple ID", href: "/apple-id", note: "Centred band, cards rise into it" },
  { name: "Apple ID · Custom", href: "/apple-id/custom", note: "Same page, custom method" },
  { name: "Accounts (list)", href: "/accounts", note: "Centred band, search and popular picks" },
  { name: "Accounts (single)", href: "/accounts/buy-spotify-account", note: "Start-aligned band, buy box overlaps it" },
  { name: "Telegram Stars", href: "/telegram/stars", note: "Start-aligned band, coin and summary" },
  { name: "Telegram Premium", href: "/telegram/premium", note: "Start-aligned band, badge and summary" },
  { name: "Telegram Ads", href: "/telegram/ads", note: "New band (the page had none); form overlaps it" },
  { name: "Virtual service (list)", href: "/virtual-service", note: "Centred band, search and platforms" },
  { name: "Virtual service (platform)", href: "/virtual-service/instagram", note: "Start-aligned band, platform pills" },
  { name: "Virtual service (single)", href: "/virtual-service/instagram/buy-instagram-like", note: "Start-aligned band, order summary" },
];

export default async function LandingHeroPreview() {
  const [decisions, jar] = await Promise.all([readDecisions(), cookies()]);
  const chosen = decisions["landing-hero"]?.offer === "B";
  const on = chosen || jar.get(HERO_PREVIEW_COOKIE)?.value === "spotlight";
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <header className="sticky top-0 z-50 flex items-center justify-between border-b border-white/10 bg-slate-950/90 px-6 py-3 backdrop-blur">
        <Link href="/design" className="text-sm text-slate-400 hover:text-white">← All sections</Link>
        <span className="font-display font-semibold">Landing hero · Spotlight × Grid</span>
        <ChooseButton section="landing-hero" offer="B" chosen={chosen} />
      </header>

      <div className="mx-auto max-w-4xl px-6 py-12">
        <h1 className="font-display text-3xl font-bold tracking-tight">New hero on every landing page</h1>
        <p className="mt-3 max-w-2xl text-slate-400">
          Hero C (spotlight beam, icon tile with rings) on hero A&apos;s hairline grid, as one band for all landing pages that follows the theme (pale in light, night in dark) and melts into the page with no edge. The home page keeps its own hero.
          Turn the preview on, open any page, and use the pill at the bottom to flip back to the current hero and compare.
        </p>
        <div className="mt-6"><PreviewSwitch on={on} locked={chosen} /></div>

        <ul className="mt-10 divide-y divide-white/10 overflow-hidden rounded-2xl border border-white/10">
          {pages.map((p) => (
            <li key={p.href}>
              <a href={p.href} className="flex items-center justify-between gap-4 px-5 py-4 hover:bg-white/5">
                <span>
                  <span className="block font-semibold">{p.name}</span>
                  <span className="block text-sm text-slate-400">{p.note}</span>
                </span>
                <span className="flex items-center gap-2 font-mono text-xs text-slate-500">{p.href}<ExternalLink className="h-3.5 w-3.5" /></span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
