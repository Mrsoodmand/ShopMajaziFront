"use client";

import RotatingWord, { type WordMotion } from "@/components/ui/RotatingWord";
import WordReveal from "@/components/ui/WordReveal";
import { HeroSubtitle, type SubStyle } from "./subtitles";
import { LocaleProvider } from "@/i18n/client";
import { usePathname } from "next/navigation";

import { Search, Zap, ShieldCheck } from "lucide-react";
import { CatalogWindow } from "./catalogWindows";
import { useState } from "react";
import { brand } from "@/content/en";
import { useT } from "@/i18n/client";

// Offer G — "Catalog Tabs": centered headline over a tabbed shop window. Each tab shows its categories as cards that lead to the category page.
// `bare` drops the built-in nav for pages with a separate site header: "overlay" when that header floats over the hero
// (adds room for it at the top), "flow" when it sits above the hero.
// `word` (gallery section hero-word): the headline's middle word changes every few seconds, in one of three motions.
const grad = "bg-gradient-to-r from-indigo-600 to-fuchsia-500 bg-clip-text text-transparent dark:from-indigo-300 dark:to-fuchsia-300";

// "خدمات دیجیتال را [آنی · مطمئن · حرفه‌ای] دریافت کنید." / "Get your digital services [instantly · safely · professionally]."
// The word order differs, so each language builds its own line around the changing word.
function HeadlineWords({ motion }: { motion: WordMotion }) {
  const tx = useT();
  const words = [tx("instantly"), tx("safely"), tx("professionally")];
  const rotating = <RotatingWord words={words} motion={motion} className={grad} />;
  // Persian: one line on wide screens (it fits at 1024px even with the longest word); two fixed lines below that, so a longer word never pushes the end of the sentence onto
  // a line of its own.
  return tx.locale === "fa"
    ? <>{tx("Get your")}<br className="lg:hidden" />{" "}{rotating} <span className="whitespace-nowrap">{tx("digital services.")}</span></>
    : <>Get your digital services<br />{rotating}.</>; // too long for one line in English
}

// `sub`: the line under the headline; "gradient" (Display Line, chosen 2026-11-15) unless a gallery offer asks otherwise.
export default function HeroG({ bare, word, sub = "gradient" }: { bare?: "overlay" | "flow"; word?: string; sub?: SubStyle | "plain" }) {
  const tx = useT();
  return (
    <section className="relative overflow-hidden bg-[#F5F6FB] dark:bg-[#070B14]">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 start-[8%] h-[420px] w-[420px] rounded-full bg-indigo-300/50 blur-[110px] dark:bg-indigo-600/30" />
        <div className="absolute -top-20 end-[6%] h-[380px] w-[380px] rounded-full bg-fuchsia-300/40 blur-[110px] dark:bg-fuchsia-600/20" />
        <div className="absolute top-[38%] start-1/2 h-[360px] w-[760px] -translate-x-1/2 rounded-full bg-sky-300/40 blur-[120px] dark:bg-cyan-500/15" />
        <div className="absolute inset-0 bg-[radial-gradient(rgba(15,23,42,.12)_1px,transparent_1px)] bg-[size:22px_22px] dark:bg-[radial-gradient(rgba(255,255,255,.08)_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_at_top,black_20%,transparent_70%)]" />
      </div>

      {!bare && <nav className="relative mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        <span className="font-display text-xl font-bold text-slate-900">{tx.tr(brand).name}</span>
        <div className="hidden w-80 items-center gap-2 rounded-full border border-white bg-white/70 px-4 py-2 text-sm text-slate-400 shadow-sm backdrop-blur md:flex">
          <Search className="h-4 w-4" />{tx("Search 2,000+ services")}
        </div>
        <a href="#" className="rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white">{tx("Sign in")}</a>
      </nav>}

      <div className={`relative mx-auto max-w-6xl px-6 pb-20 text-center ${bare === "overlay" ? "pt-28 md:pt-32" : "pt-12 md:pt-16"}`}>
        <span className="inline-flex items-center gap-2 rounded-full border border-white bg-white/70 px-3 py-1 text-xs font-medium text-slate-600 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
          <Zap className="h-3.5 w-3.5 text-amber-500" />{tx("Instant delivery")}<span className="text-slate-300 dark:text-slate-600">·</span><ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />{tx("Refund guarantee")}
        </span>
        <h1 className={`mx-auto mt-6 max-w-4xl font-display text-4xl font-bold leading-[1.05] tracking-tight text-slate-900 sm:text-6xl dark:text-white ${word && tx.locale === "fa" ? "lg:max-w-none lg:whitespace-nowrap" : ""}`}>
          {word ? <HeadlineWords motion={word as WordMotion} /> : <>{tx("Get your")}{" "}<span className={grad}>{tx("digital services.")}</span></>}
        </h1>
        {sub !== "plain" ? <HeroSubtitle look={sub} /> : <p className="mx-auto mt-5 max-w-xl text-lg text-slate-600 dark:text-slate-400"><WordReveal once text={tx("Safe buying, instant delivery and real support: everything just as you'd expect.")} delay={350} step={45} /></p>}

        <CatalogWindow />
      </div>
    </section>
  );
}

// The hero-word offers: the same hero with a changing headline word. The gallery is English, so these open in
// Persian (the site's main language) with a switch, to see both sentences. The switch shows on /design only.
function InLanguage({ word, bare, sub }: { word: WordMotion; bare?: "overlay" | "flow"; sub?: SubStyle | "plain" }) {
  const [lang, setLang] = useState<"fa" | "en">("fa");
  // On the home page (the chosen offer, app/page.tsx) the hero runs in the visitor's language, without the switch.
  if (!usePathname()?.startsWith("/design")) return <HeroG bare={bare} word={word} sub={sub} />;
  return (
    <div className="relative">
      <div role="group" aria-label="Language" className="absolute end-4 top-4 z-20 flex rounded-xl border border-slate-300 bg-white p-1 text-sm shadow-sm dark:border-white/15 dark:bg-slate-800">
        {(["fa", "en"] as const).map((l) => <button key={l} type="button" aria-pressed={lang === l} onClick={() => setLang(l)} className={`rounded-lg px-3 py-1.5 ${lang === l ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900" : "text-slate-700 dark:text-slate-300"}`}>{l === "fa" ? "فارسی" : "English"}</button>)}
      </div>
      <div dir={lang === "fa" ? "rtl" : "ltr"} lang={lang}><LocaleProvider locale={lang}><HeroG key={lang} bare={bare} word={word} sub={sub} /></LocaleProvider></div>
    </div>
  );
}
export const HeroWordSlot = (p: { bare?: "overlay" | "flow" }) => <InLanguage {...p} word="slot" />;
export const HeroWordBlur = (p: { bare?: "overlay" | "flow" }) => <InLanguage {...p} word="blur" />;
export const HeroWordType = (p: { bare?: "overlay" | "flow" }) => <InLanguage {...p} word="type" />;

// The hero-subtitle offers: the chosen headline (blur swap) with each style of the line under it.
export const HeroSubChips = (p: { bare?: "overlay" | "flow" }) => <InLanguage {...p} word="blur" sub="chips" />;
export const HeroSubMarker = (p: { bare?: "overlay" | "flow" }) => <InLanguage {...p} word="blur" sub="marker" />;
export const HeroSubGradient = (p: { bare?: "overlay" | "flow" }) => <InLanguage {...p} word="blur" sub="gradient" />;
export const HeroSubIcons = (p: { bare?: "overlay" | "flow" }) => <InLanguage {...p} word="blur" sub="icons" />;
export const HeroSubPlain = (p: { bare?: "overlay" | "flow" }) => <InLanguage {...p} word="blur" sub="plain" />;
