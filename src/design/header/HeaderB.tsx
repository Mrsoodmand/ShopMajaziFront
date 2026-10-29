"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, Menu, ArrowRight } from "lucide-react";
import { navGroups, navLinks } from "@/content/nav-en";
import { LangSwitch, Logo, MobileMenu, useClickOutside, useScrolled } from "./shared";

// Offer B — "Floating Pill": a rounded glass bar floating below the top edge. It shrinks to a tighter pill once you scroll.
// Each group opens a compact dropdown list under its button.
export default function HeaderB() {
  const scrolled = useScrolled();
  const [open, setOpen] = useState<string | null>(null);
  const [mobile, setMobile] = useState(false);
  const ref = useClickOutside<HTMLDivElement>(() => setOpen(null));

  return (
    <>
      <header className="sticky top-0 z-40 h-0 px-4 pt-4">
        <div ref={ref} className={`mx-auto flex items-center gap-4 rounded-full border border-white/70 bg-white/75 shadow-lg shadow-indigo-900/5 backdrop-blur-xl transition-all duration-500 ${scrolled ? "h-14 max-w-5xl px-4" : "h-16 max-w-6xl px-5"}`}>
          <Logo />
          <nav className="mx-auto hidden items-center gap-0.5 lg:flex">
            {navGroups.map((g) => (
              <div key={g.id} className="relative">
                <button onClick={() => setOpen(open === g.id ? null : g.id)} aria-expanded={open === g.id}
                  className={`flex items-center gap-1 rounded-full px-3.5 py-2 text-sm font-medium transition ${open === g.id ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-900/5 hover:text-slate-900"}`}>
                  {g.label}<ChevronDown className={`h-3.5 w-3.5 transition ${open === g.id ? "rotate-180" : ""}`} />
                </button>
                <div className={`absolute start-1/2 top-full w-80 -translate-x-1/2 pt-3 transition-all duration-200 rtl:translate-x-1/2 ${open === g.id ? "visible opacity-100" : "invisible -translate-y-1 opacity-0"}`}>
                  <div className="rounded-3xl bg-white p-2 shadow-2xl ring-1 ring-slate-200">
                    {g.items.map((it) => (
                      <Link key={it.href} href={it.href} className="flex items-center gap-3 rounded-2xl p-3 hover:bg-slate-50">
                        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-indigo-50 to-fuchsia-50 text-indigo-600"><it.icon className="h-[18px] w-[18px]" /></span>
                        <span className="flex-1"><span className="block text-sm font-semibold text-slate-900">{it.label}</span><span className="block text-xs text-slate-500">{it.desc}</span></span>
                        <span className="text-xs font-semibold text-slate-700">{it.from}</span>
                      </Link>
                    ))}
                    {g.viewAll && <Link href={g.viewAll.href} className="mt-1 flex items-center justify-center gap-1 rounded-2xl bg-slate-50 py-2.5 text-sm font-medium text-indigo-600">{g.viewAll.label}<ArrowRight className="h-4 w-4 rtl:rotate-180" /></Link>}
                  </div>
                </div>
              </div>
            ))}
            {navLinks.map((l) => <Link key={l.href} href={l.href} className="rounded-full px-3.5 py-2 text-sm font-medium text-slate-600 hover:bg-slate-900/5 hover:text-slate-900">{l.label}</Link>)}
          </nav>
          <div className="ms-auto flex items-center gap-2 lg:ms-0">
            <div className="hidden sm:block"><LangSwitch variant="toggle" /></div>
            <Link href="/login" className="hidden rounded-full bg-gradient-to-r from-indigo-600 to-fuchsia-500 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-fuchsia-500/20 sm:block">Get started</Link>
            <button onClick={() => setMobile(true)} aria-label="Open menu" className="grid h-10 w-10 place-items-center rounded-full bg-slate-900/5 lg:hidden"><Menu className="h-5 w-5" /></button>
          </div>
        </div>
      </header>
      <MobileMenu open={mobile} onClose={() => setMobile(false)} />
    </>
  );
}
