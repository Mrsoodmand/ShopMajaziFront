"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Menu, Headphones, Send, ShoppingBag, User } from "lucide-react";
import { navGroups } from "@/content/nav-en";
import { LangSwitch, Logo, MobileMenu, useScrolled } from "./shared";

// Offer C — "Store Bar": e-commerce style in three rows. A thin utility strip (support, Telegram channel, language),
// a main row with a big search field, and a row of category chips that link straight to each category page.
// The utility strip slides away when you scroll.
export default function HeaderC() {
  const scrolled = useScrolled(40);
  const [mobile, setMobile] = useState(false);
  const chips = navGroups.flatMap((g) => g.items.slice(0, g.id === "subs" ? 2 : 4));

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-xl">
        <div className={`overflow-hidden bg-slate-900 text-xs text-slate-300 transition-all duration-300 ${scrolled ? "max-h-0" : "max-h-10"}`}>
          <div className="mx-auto flex h-9 max-w-7xl items-center gap-5 px-6">
            <span className="flex items-center gap-1.5"><Headphones className="h-3.5 w-3.5 text-emerald-400" />24/7 support · replies in ~2 min</span>
            <a href="#" className="hidden items-center gap-1.5 hover:text-white sm:flex"><Send className="h-3.5 w-3.5" />Telegram channel</a>
            <span className="ms-auto hidden sm:block">Refund guarantee on every order</span>
            <div className="[&_button]:py-1 [&_button]:text-xs"><LangSwitch dark /></div>
          </div>
        </div>

        <div className="mx-auto flex h-16 max-w-7xl items-center gap-6 px-6">
          <Logo />
          <label className="relative hidden flex-1 md:block">
            <Search className="pointer-events-none absolute start-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input placeholder="Search numbers, Apple ID, ChatGPT, Telegram members…" className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 ps-11 pe-16 text-sm outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100" />
            <kbd className="absolute end-3 top-1/2 -translate-y-1/2 rounded-md border border-slate-200 bg-white px-1.5 py-0.5 font-sans text-[11px] text-slate-400">Ctrl K</kbd>
          </label>
          <div className="ms-auto flex items-center gap-1 md:ms-0">
            <Link href="/login" className="hidden items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 sm:flex"><User className="h-[18px] w-[18px]" />Sign in</Link>
            <Link href="/orders" className="relative grid h-10 w-10 place-items-center rounded-xl text-slate-700 hover:bg-slate-100" aria-label="My orders">
              <ShoppingBag className="h-5 w-5" /><span className="absolute end-1.5 top-1.5 grid h-4 min-w-4 place-items-center rounded-full bg-fuchsia-500 px-1 text-[10px] font-bold text-white">2</span>
            </Link>
            <button onClick={() => setMobile(true)} aria-label="Open menu" className="grid h-10 w-10 place-items-center rounded-xl hover:bg-slate-100 lg:hidden"><Menu className="h-5 w-5" /></button>
          </div>
        </div>

        <nav className="border-y border-slate-100">
          <div className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-6 py-2.5 [scrollbar-width:none]">
            {chips.map((it) => (
              <Link key={it.href} href={it.href} className="flex shrink-0 items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-sm text-slate-700 transition hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700">
                <it.icon className="h-3.5 w-3.5" />{it.label}
              </Link>
            ))}
          </div>
        </nav>
      </header>
      <MobileMenu open={mobile} onClose={() => setMobile(false)} />
    </>
  );
}
