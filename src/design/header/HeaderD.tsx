"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Menu } from "lucide-react";
import { navGroups, navLinks } from "@/content/nav-en";
import { LangSwitch, Logo, MobileMenu, SearchPalette, useScrolled, useSearchHotkey } from "./shared";

// Offer D — "Command Search": a dark slim bar with a ⌘K / Ctrl K search palette.
// Type anything ("telegram", "apple") and jump straight to the service with the keyboard.
export default function HeaderD() {
  const scrolled = useScrolled();
  const [mobile, setMobile] = useState(false);
  const [palette, setPalette] = useState(false);
  useSearchHotkey(setPalette);

  return (
    <>
      <header className={`sticky top-0 z-40 border-b transition-colors duration-300 ${scrolled ? "border-white/10 bg-[#070B14]/90 backdrop-blur-xl" : "border-transparent bg-[#070B14]"}`}>
        <div className="mx-auto flex h-14 max-w-7xl items-center gap-6 px-6">
          <Logo dark />
          <nav className="hidden items-center gap-5 text-sm text-slate-400 lg:flex">
            {navGroups.map((g) => <Link key={g.id} href={g.viewAll?.href ?? g.items[0].href} className="transition hover:text-white">{g.label}</Link>)}
            <span className="h-4 w-px bg-white/10" />
            {navLinks.map((l) => <Link key={l.href} href={l.href} className="transition hover:text-white">{l.label}</Link>)}
          </nav>
          <div className="ms-auto flex items-center gap-2">
            <button onClick={() => setPalette(true)} className="flex h-9 items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 text-sm text-slate-400 transition hover:border-white/20 hover:text-white">
              <Search className="h-4 w-4" /><span className="hidden sm:inline">Search services</span>
              <kbd className="hidden rounded border border-white/10 px-1.5 font-sans text-[10px] sm:inline">Ctrl K</kbd>
            </button>
            <div className="hidden sm:block"><LangSwitch dark /></div>
            <Link href="/login" className="hidden rounded-lg bg-white px-3.5 py-2 text-sm font-semibold text-slate-900 sm:block">Sign in</Link>
            <button onClick={() => setMobile(true)} aria-label="Open menu" className="grid h-9 w-9 place-items-center rounded-lg text-white hover:bg-white/10 lg:hidden"><Menu className="h-5 w-5" /></button>
          </div>
        </div>
      </header>
      <MobileMenu open={mobile} onClose={() => setMobile(false)} dark />
      {palette && <SearchPalette dark onClose={() => setPalette(false)} />}
    </>
  );
}

