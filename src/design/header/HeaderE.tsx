"use client";

import { useState } from "react";
import Link from "next/link";
import { LayoutGrid, Menu, Plus, Bell, ChevronDown, Receipt, Smartphone, Wallet, LifeBuoy, LogOut, ArrowRight } from "lucide-react";
import { navGroups, navLinks } from "@/content/nav-en";
import { LangSwitch, Logo, MobileMenu, useClickOutside, useScrolled } from "./shared";

// Offer E — "Account Bar": built for returning customers. One "All services" button opens a full catalog panel,
// and the right side shows the signed-in state: wallet balance with top-up, notifications and an account menu.
// A "Signed in / Signed out" switch on the preview shows both states.
export default function HeaderE() {
  const scrolled = useScrolled();
  const [mobile, setMobile] = useState(false);
  const [catalog, setCatalog] = useState(false);
  const [account, setAccount] = useState(false);
  const [signedIn, setSignedIn] = useState(true);
  const catRef = useClickOutside<HTMLDivElement>(() => setCatalog(false));
  const accRef = useClickOutside<HTMLDivElement>(() => setAccount(false));

  return (
    <>
      <header className={`sticky top-0 z-40 -mb-16 transition-all duration-300 ${scrolled ? "bg-white/90 shadow-sm backdrop-blur-xl" : "bg-white/40 backdrop-blur"}`}>
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-6">
          <Logo />
          <div ref={catRef} className="relative hidden lg:block">
            <button onClick={() => setCatalog((c) => !c)} aria-expanded={catalog} className={`ms-4 flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${catalog ? "bg-indigo-600 text-white" : "bg-indigo-50 text-indigo-700 hover:bg-indigo-100"}`}>
              <LayoutGrid className="h-4 w-4" />All services<ChevronDown className={`h-3.5 w-3.5 transition ${catalog ? "rotate-180" : ""}`} />
            </button>
            <div className={`absolute start-0 top-full mt-3 w-[860px] rounded-3xl bg-white p-6 shadow-2xl ring-1 ring-slate-200 transition-all duration-200 ${catalog ? "visible translate-y-0 opacity-100" : "invisible -translate-y-1 opacity-0"}`}>
              <div className="grid grid-cols-4 gap-6">
                {navGroups.map((g) => (
                  <div key={g.id}>
                    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-slate-400"><g.icon className="h-4 w-4 text-indigo-500" />{g.label}</div>
                    <ul className="mt-3 space-y-1">
                      {g.items.map((it) => (
                        <li key={it.href}>
                          <Link href={it.href} className="group flex items-center justify-between rounded-lg px-2 py-1.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-indigo-700">
                            {it.label}<span className="text-xs text-slate-400 group-hover:text-indigo-500">{it.from}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                    {g.viewAll && <Link href={g.viewAll.href} className="mt-2 inline-flex items-center gap-1 px-2 text-xs font-semibold text-indigo-600">{g.viewAll.label}<ArrowRight className="h-3 w-3 rtl:rotate-180" /></Link>}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <nav className="hidden gap-1 lg:flex">
            {navLinks.map((l) => <Link key={l.href} href={l.href} className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900">{l.label}</Link>)}
          </nav>

          <div className="ms-auto flex items-center gap-2">
            <button onClick={() => setSignedIn((s) => !s)} className="hidden rounded-full border border-dashed border-slate-300 px-2.5 py-1 text-[11px] text-slate-400 xl:block" title="Preview only">
              Preview: {signedIn ? "signed in" : "signed out"}
            </button>
            <div className="hidden sm:block"><LangSwitch /></div>
            {signedIn ? (
              <>
                <Link href="/wallet" className="hidden items-center gap-1 rounded-full bg-slate-100 py-1 pe-1 ps-3 text-sm sm:flex">
                  <Wallet className="h-4 w-4 text-slate-500" /><span className="font-semibold text-slate-900">$48.20</span>
                  <span className="ms-1 grid h-7 w-7 place-items-center rounded-full bg-emerald-500 text-white" aria-label="Top up"><Plus className="h-4 w-4" /></span>
                </Link>
                <button aria-label="Notifications" className="relative grid h-10 w-10 place-items-center rounded-full text-slate-600 hover:bg-slate-100">
                  <Bell className="h-5 w-5" /><span className="absolute end-2.5 top-2.5 h-2 w-2 rounded-full bg-fuchsia-500 ring-2 ring-white" />
                </button>
                <div ref={accRef} className="relative">
                  <button onClick={() => setAccount((a) => !a)} aria-expanded={account} className="flex items-center gap-2 rounded-full p-1 pe-2 hover:bg-slate-100">
                    <span className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-indigo-500 to-fuchsia-500 text-sm font-bold text-white">S</span>
                    <ChevronDown className="hidden h-4 w-4 text-slate-500 sm:block" />
                  </button>
                  <div className={`absolute end-0 top-full mt-2 w-60 rounded-2xl bg-white p-2 shadow-2xl ring-1 ring-slate-200 transition-all duration-200 ${account ? "visible opacity-100" : "invisible -translate-y-1 opacity-0"}`}>
                    <div className="border-b border-slate-100 px-3 pb-3 pt-1"><div className="text-sm font-semibold text-slate-900">Sara K.</div><div className="text-xs text-slate-500">sara@example.com</div></div>
                    {[[Receipt, "My orders", "/orders"], [Smartphone, "My numbers", "/numbers"], [Wallet, "Wallet", "/wallet"], [LifeBuoy, "Support tickets", "/tickets"]].map(([I, l, h]) => {
                      const Icon = I as typeof Wallet;
                      return <Link key={h as string} href={h as string} className="mt-1 flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"><Icon className="h-4 w-4 text-slate-400" />{l as string}</Link>;
                    })}
                    <button onClick={() => { setSignedIn(false); setAccount(false); }} className="mt-1 flex w-full items-center gap-3 rounded-xl border-t border-slate-100 px-3 py-2 text-sm text-rose-600 hover:bg-rose-50"><LogOut className="h-4 w-4" />Sign out</button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link href="/login" className="hidden px-3 py-2 text-sm font-medium text-slate-700 sm:block">Sign in</Link>
                <Link href="/register" className="rounded-full bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white">Create account</Link>
              </>
            )}
            <button onClick={() => setMobile(true)} aria-label="Open menu" className="grid h-10 w-10 place-items-center rounded-full hover:bg-slate-100 lg:hidden"><Menu className="h-5 w-5" /></button>
          </div>
        </div>
      </header>
      <MobileMenu open={mobile} onClose={() => setMobile(false)} />
    </>
  );
}
