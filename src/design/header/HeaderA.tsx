"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { ChevronDown, Search, Menu, Wallet, ArrowRight } from "lucide-react";
import { navGroups, navLinks } from "@/content/nav-en";
import { LangSwitch, Logo, MobileMenu, ThemeToggle, useScrolled } from "./shared";

// Offer A — "Mega Menu": sticky glass bar. Hovering a group opens a wide panel with every category as a card (icon, text, price).
// Transparent over the hero, turns solid once you scroll. Has the light / dark toggle.
export default function HeaderA() {
  const scrolled = useScrolled();
  const [open, setOpen] = useState<string | null>(null);
  const [mobile, setMobile] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const enter = (id: string) => { clearTimeout(closeTimer.current); setOpen(id); };
  const leave = () => { closeTimer.current = setTimeout(() => setOpen(null), 120); };
  const group = navGroups.find((g) => g.id === open);

  return (
    <>
      <header onMouseLeave={leave}
        className={`sticky top-0 z-40 -mb-16 transition-all duration-300 ${scrolled || open
          ? "bg-white/90 shadow-[0_1px_0_rgba(15,23,42,.06),0_8px_24px_-12px_rgba(15,23,42,.15)] backdrop-blur-xl dark:bg-[#070B14]/85 dark:shadow-[0_1px_0_rgba(255,255,255,.06)]"
          : "bg-transparent"}`}>
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-8 px-6">
          <Logo />
          <nav className="hidden items-center gap-1 lg:flex">
            {navGroups.map((g) => (
              <button key={g.id} onMouseEnter={() => enter(g.id)} onFocus={() => enter(g.id)} aria-expanded={open === g.id}
                className={`flex items-center gap-1 rounded-full px-3.5 py-2 text-sm font-medium transition ${open === g.id
                  ? "bg-slate-900/5 text-slate-900 dark:bg-white/10 dark:text-white"
                  : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"}`}>
                {g.label}<ChevronDown className={`h-3.5 w-3.5 transition ${open === g.id ? "rotate-180" : ""}`} />
              </button>
            ))}
            {navLinks.map((l) => <Link key={l.href} href={l.href} onMouseEnter={leave} className="rounded-full px-3.5 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">{l.label}</Link>)}
          </nav>
          <div className="ms-auto flex items-center gap-1">
            <button aria-label="Search" className="grid h-10 w-10 place-items-center rounded-full text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/10"><Search className="h-[18px] w-[18px]" /></button>
            <ThemeToggle />
            <div className="hidden sm:block"><LangSwitch /></div>
            <Link href="/login" className="hidden px-3 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white sm:block">Sign in</Link>
            <Link href="/wallet" className="hidden items-center gap-2 rounded-full bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200 sm:flex"><Wallet className="h-4 w-4" />Wallet</Link>
            <button onClick={() => setMobile(true)} aria-label="Open menu" className="grid h-10 w-10 place-items-center rounded-full text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-white/10 lg:hidden"><Menu className="h-5 w-5" /></button>
          </div>
        </div>

        <div className={`absolute inset-x-0 top-full hidden origin-top transition-all duration-200 lg:block ${group ? "visible translate-y-0 opacity-100" : "invisible -translate-y-1 opacity-0"}`} onMouseEnter={() => open && enter(open)}>
          <div className="border-t border-slate-100 bg-white shadow-2xl shadow-slate-900/10 dark:border-white/10 dark:bg-[#0E1424] dark:shadow-black/40">
            {group && (
              <div className="mx-auto grid max-w-7xl gap-8 px-6 py-8 lg:grid-cols-[220px_1fr]">
                <div>
                  <group.icon className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                  <div className="mt-3 font-display text-lg font-semibold text-slate-900 dark:text-white">{group.label}</div>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Instant delivery and a refund guarantee on every order.</p>
                  {group.viewAll && <Link href={group.viewAll.href} className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-indigo-600 dark:text-indigo-400">{group.viewAll.label}<ArrowRight className="h-4 w-4 rtl:rotate-180" /></Link>}
                </div>
                <div className={`grid gap-3 ${group.items.length === 2 ? "grid-cols-2" : group.items.length === 3 ? "grid-cols-3" : "grid-cols-4"}`}>
                  {group.items.map((it) => (
                    <Link key={it.href} href={it.href} className="group rounded-2xl border border-slate-200 p-4 transition hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-lg dark:border-white/10 dark:hover:border-indigo-400/50 dark:hover:shadow-black/30">
                      <span className="grid h-10 w-10 place-items-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-300"><it.icon className="h-5 w-5" /></span>
                      <div className="mt-3 font-semibold text-slate-900 dark:text-white">{it.label}</div>
                      <div className="text-sm text-slate-500 dark:text-slate-400">{it.desc}</div>
                      <div className="mt-3 text-xs text-slate-500 dark:text-slate-400">from <span className="text-sm font-bold text-slate-900 dark:text-white">{it.from}</span></div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </header>
      <MobileMenu open={mobile} onClose={() => setMobile(false)} />
    </>
  );
}
