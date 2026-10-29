"use client";

import type { ReactNode } from "react";
import { Menu, Search } from "lucide-react";
import { BrandMark, LoaderMark, Wordmark } from "@/components/brand/Brand";

// How one logo offer is shown on /design/logo: big on light and dark, both lockups (English and Persian), in a
// header bar, at app-icon and favicon sizes, and as the page-change loader. Colours are pinned per panel so the
// light and dark previews are true whatever theme the page is in.

type Tone = "light" | "dark";
const ground: Record<Tone, string> = {
  light: "bg-[#F5F6FB] text-slate-900 ring-1 ring-slate-200",
  dark: "bg-[#070B14] text-white ring-1 ring-white/10",
};
const muted: Record<Tone, string> = { light: "text-slate-500", dark: "text-slate-400" };

function Label({ children, tone = "dark" }: { children: ReactNode; tone?: Tone }) {
  return <p className={`text-xs font-semibold uppercase tracking-wider ${muted[tone]}`}>{children}</p>;
}

function Lockup({ id, locale, size = "lg" }: { id: string; locale: "en" | "fa"; size?: "lg" | "sm" }) {
  return (
    <span dir={locale === "fa" ? "rtl" : "ltr"} lang={locale} className={`inline-flex items-center ${size === "lg" ? "gap-3" : "gap-2"}`}>
      <BrandMark id={id} className={size === "lg" ? "h-11 w-11 shrink-0" : "h-8 w-8 shrink-0"} />
      <Wordmark id={id} locale={locale} className={`${size === "lg" ? "text-3xl" : "text-xl"} ${locale === "fa" ? "font-[family-name:var(--font-iransans)]" : ""}`} />
    </span>
  );
}

function Hero({ id, tone }: { id: string; tone: Tone }) {
  return (
    <div className={`flex flex-col items-center gap-8 rounded-3xl px-6 py-10 ${ground[tone]}`}>
      <BrandMark id={id} className="h-28 w-28" />
      <div className="flex flex-col items-center gap-4">
        <Lockup id={id} locale="en" />
        <Lockup id={id} locale="fa" />
      </div>
    </div>
  );
}

function HeaderBar({ id, tone }: { id: string; tone: Tone }) {
  const pill = tone === "light" ? "border-slate-300 text-slate-700" : "border-white/15 text-slate-300";
  return (
    <div className={`flex items-center justify-between rounded-2xl px-4 py-3 ${ground[tone]}`}>
      <Lockup id={id} locale="en" size="sm" />
      <span className="flex items-center gap-2">
        <span className={`grid h-8 w-8 place-items-center rounded-full border ${pill}`}><Search className="h-4 w-4" /></span>
        <span className={`grid h-8 w-8 place-items-center rounded-full border ${pill}`}><Menu className="h-4 w-4" /></span>
      </span>
    </div>
  );
}

function Sizes({ id, tone }: { id: string; tone: Tone }) {
  return (
    <div className={`flex items-end gap-5 rounded-2xl px-5 py-4 ${ground[tone]}`}>
      {[64, 48, 32, 24, 16].map((s) => (
        <span key={s} className="flex flex-col items-center gap-2">
          <span style={{ width: s, height: s }}><BrandMark id={id} className="h-full w-full" /></span>
          <span className={`text-[11px] tabular-nums ${muted[tone]}`}>{s}</span>
        </span>
      ))}
    </div>
  );
}

function BrowserTab({ id }: { id: string }) {
  return (
    <div className="flex items-center gap-2 rounded-t-xl bg-[#DEE1E6] px-3 pt-2">
      <span className="flex max-w-[220px] items-center gap-2 rounded-t-lg bg-white px-3 py-1.5 text-xs text-slate-700">
        <BrandMark id={id} className="h-4 w-4 shrink-0 text-slate-900" />
        <span className="truncate">ShopMajazi — Digital services</span>
      </span>
    </div>
  );
}

function Loader({ id, tone }: { id: string; tone: Tone }) {
  return (
    <div className={`grid place-items-center rounded-2xl py-8 ${ground[tone]}`}>
      <div className={`rounded-[28px] border p-5 ${tone === "light" ? "border-slate-200 bg-white shadow-[0_24px_60px_-24px_rgba(15,23,42,.35)]" : "border-white/10 bg-[#0E1424] shadow-[0_24px_60px_-24px_rgba(0,0,0,.9)]"}`}>
        <LoaderMark id={id} tone={tone} />
      </div>
    </div>
  );
}

export default function Showcase({ id }: { id: string }) {
  return (
    <div className="bg-slate-950 px-4 py-8 sm:px-6">
      <div className="mx-auto grid max-w-6xl gap-4">
        <div className="grid gap-4 md:grid-cols-2">
          <Hero id={id} tone="light" />
          <Hero id={id} tone="dark" />
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          <section className="space-y-2">
            <Label>In the header</Label>
            <HeaderBar id={id} tone="light" />
            <HeaderBar id={id} tone="dark" />
          </section>
          <section className="space-y-2">
            <Label>App icon and favicon</Label>
            <Sizes id={id} tone="light" />
            <Sizes id={id} tone="dark" />
            <BrowserTab id={id} />
          </section>
          <section className="space-y-2">
            <Label>Page-change loader</Label>
            <div className="grid grid-cols-2 gap-2">
              <Loader id={id} tone="light" />
              <Loader id={id} tone="dark" />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
