"use client";

import { useEffect, useRef, useState } from "react";
import Link from "@/i18n/Link";
import { ChevronDown, Search, Menu, LayoutGrid } from "lucide-react";
import { aboutLinks, navLinks } from "@/content/nav-en";
import { LangSwitch, Logo, MobileMenu, SearchPalette, ThemeToggle, useScrolled, useSearchHotkey } from "./shared";
import { useT } from "@/i18n/client";
import { AccountButton } from "./AccountMenu";
import { ServicesMega } from "./ServicesMega";

type MenuId = "services" | "about";

// Offer F — "All Services Menu": header A's glass bar, but every service lives under one "All services" button.
// The panel lists the categories on the left; hovering one shows its sub-categories in the middle.
// An "About us" dropdown holds Contact us, About us and Rules. The page behind an open menu is blurred.
// `overDark`: the page opens on a dark hero under the transparent bar, so the bar uses its dark-mode (light) ink
// until it turns solid on scroll or when a menu opens.
export default function HeaderF({ overDark = false }: { overDark?: boolean; bare?: "overlay" | "flow" }) {
  const t = useT();
  const scrolled = useScrolled();
  const [menu, setMenu] = useState<MenuId | null>(null);
  const [mobile, setMobile] = useState(false);
  const [search, setSearch] = useState(false);
  useSearchHotkey(setSearch);

  const closeTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  // Open on hover or click; a click only opens, because hovering already opened it and a toggle would shut it again.
  const show = (id: MenuId) => { clearTimeout(closeTimer.current); setMenu(id); };
  const hide = () => { closeTimer.current = setTimeout(() => setMenu(null), 150); };
  const escape = (e: React.KeyboardEvent) => e.key === "Escape" && setMenu(null);
  // Freeze page scroll while a menu is open. The scrollbar's space stays reserved (scrollbar-gutter in globals.css), so the page doesn't shift.
  useEffect(() => {
    if (!menu) return;
    const html = document.documentElement;
    html.style.overflow = "hidden";
    return () => { html.style.overflow = ""; };
  }, [menu]);

  const blog = t.tr(navLinks).find((l) => l.href === "/blog")!;

  const trigger = (id: MenuId) =>
    `flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${menu === id
      ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
      : "text-slate-700 hover:bg-slate-900/5 dark:text-slate-200 dark:hover:bg-white/10"}`;

  return (
    <>
      {/* Blurs and dims the page while a menu is open; clicking it closes the menu. */}
      <div aria-hidden onClick={() => setMenu(null)}
        className={`fixed inset-0 z-30 hidden bg-slate-900/20 backdrop-blur-md transition-opacity duration-300 dark:bg-black/40 lg:block ${menu ? "opacity-100" : "pointer-events-none opacity-0"}`} />

      <header onMouseLeave={hide}
        className={`sticky top-0 z-40 -mb-16 transition-all duration-300 ${overDark && !scrolled && !menu ? "dark" : ""} ${scrolled || menu
          ? "bg-white/90 shadow-[0_1px_0_rgba(15,23,42,.06),0_8px_24px_-12px_rgba(15,23,42,.15)] backdrop-blur-xl dark:bg-[#070B14]/85 dark:shadow-[0_1px_0_rgba(255,255,255,.06)]"
          : "bg-transparent"}`}>
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-6 px-6">
          <Logo />
          <nav className="hidden items-center gap-1 lg:flex">
            <button onMouseEnter={() => show("services")} onMouseLeave={hide} onClick={() => show("services")} onKeyDown={escape} aria-expanded={menu === "services"} className={trigger("services")}>
              <LayoutGrid className="h-4 w-4" />{t("All services")}<ChevronDown className={`h-3.5 w-3.5 transition ${menu === "services" ? "rotate-180" : ""}`} />
            </button>
            <Link href={blog.href} onMouseEnter={hide} className="rounded-full px-3.5 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">{blog.label}</Link>
            <div className="relative" onMouseLeave={hide}>
              <button onMouseEnter={() => show("about")} onClick={() => show("about")} onKeyDown={escape} aria-expanded={menu === "about"} className={trigger("about")}>
                {t("About us")}<ChevronDown className={`h-3.5 w-3.5 transition ${menu === "about" ? "rotate-180" : ""}`} />
              </button>
              <div onMouseEnter={() => show("about")} className={`absolute start-0 top-full w-72 pt-3 transition-all duration-200 ${menu === "about" ? "visible translate-y-0 opacity-100" : "invisible -translate-y-1 opacity-0"}`}>
                <div className="rounded-2xl bg-white p-2 shadow-2xl shadow-slate-900/15 ring-1 ring-slate-200 dark:bg-[#0E1424] dark:shadow-black/50 dark:ring-white/10">
                  {t.tr(aboutLinks).map((l) => (
                    <Link key={l.href} href={l.href} className="flex items-center gap-3 rounded-xl p-3 hover:bg-slate-50 dark:hover:bg-white/5">
                      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-300"><l.icon className="h-[18px] w-[18px]" /></span>
                      <span><span className="block text-sm font-semibold text-slate-900 dark:text-white">{l.label}</span><span className="block text-xs text-slate-500 dark:text-slate-400">{l.desc}</span></span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </nav>
          <div className="ms-auto flex items-center gap-1">
            <button onClick={() => setSearch(true)} aria-label={t("Search services (Ctrl K)")} title={t("Search (Ctrl K)")} className="grid h-10 w-10 place-items-center rounded-full text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/10"><Search className="h-[18px] w-[18px]" /></button>
            <ThemeToggle />
            <div className="hidden sm:block"><LangSwitch /></div>
            {/* One entry point: the auth page lets people sign in or create an account. */}
            <AccountButton label={t("Sign in / Sign up")} />
            <button onClick={() => setMobile(true)} aria-label={t("Open menu")} className="grid h-10 w-10 place-items-center rounded-full text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-white/10 lg:hidden"><Menu className="h-5 w-5" /></button>
          </div>
        </div>

        <ServicesMega open={menu === "services"} onEnter={() => show("services")} onLeave={hide} />
      </header>
      <MobileMenu open={mobile} onClose={() => setMobile(false)} withAbout />
      {search && <SearchPalette onClose={() => setSearch(false)} />}
    </>
  );
}
