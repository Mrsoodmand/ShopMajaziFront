"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "@/i18n/Link";
import { ChevronDown, Search, Menu, LayoutGrid, AlignLeft, BookOpen, Info } from "lucide-react";
import { aboutLinks, navGroups } from "@/content/nav-en";
import { LangSwitch, Logo, MobileMenu, SearchPalette, ThemeToggle, useScrolled, useSearchHotkey } from "./shared";
import { useT } from "@/i18n/client";
import { stripLocale } from "@/i18n/config";
import { AccountButton } from "./AccountMenu";
import { ServicesMega } from "./ServicesMega";

type MenuId = "services" | "about";

// Offer G — "Nav Tray": the links sit in one rounded tray in the middle of the bar, each with its icon;
// the current page's link is lifted. Language, theme, search and the account are outlined pills on the end side.
// Uses header F's "All services" mega panel and "About" dropdown. `overDark` works as in header F.
export default function HeaderG({ overDark = false }: { overDark?: boolean; bare?: "overlay" | "flow" }) {
  const t = useT();
  const path = stripLocale(usePathname() || "/");
  const scrolled = useScrolled();
  const [menu, setMenu] = useState<MenuId | null>(null);
  const [mobile, setMobile] = useState(false);
  const [search, setSearch] = useState(false);
  useSearchHotkey(setSearch);

  const closeTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
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

  // Which tray link matches the current page.
  const under = (href: string) => path === href || path.startsWith(href + "/");
  const onNumbers = under("/virtual-number");
  const onServices = !onNumbers && navGroups.some((g) => g.items.some((it) => under(it.href)) || (g.viewAll && under(g.viewAll.href)));
  const onBlog = under("/blog");
  const onAbout = aboutLinks.some((l) => under(l.href));

  const item = (on: boolean) =>
    `flex items-center gap-2 whitespace-nowrap rounded-xl px-3 py-2 text-sm font-semibold transition-colors duration-200 xl:px-3.5 ${on
      ? "bg-white text-slate-900 shadow-sm ring-1 ring-slate-200 dark:bg-indigo-400/15 dark:text-white dark:shadow-none dark:ring-indigo-300/10"
      : "text-slate-600 hover:bg-white/70 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-white/[.06] dark:hover:text-white"}`;
  const icon = (on: boolean) => `hidden h-4 w-4 xl:block ${on ? "text-indigo-600 dark:text-indigo-300" : "text-slate-400 dark:text-slate-400"}`;
  const round = "grid h-10 w-10 place-items-center rounded-full border border-slate-200 text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 dark:border-white/10 dark:text-slate-200 dark:hover:border-white/20 dark:hover:bg-white/[.04]";

  return (
    <>
      {/* Blurs and dims the page while a menu is open; clicking it closes the menu. */}
      <div aria-hidden onClick={() => setMenu(null)}
        className={`fixed inset-0 z-30 hidden bg-slate-900/20 backdrop-blur-md transition-opacity duration-300 dark:bg-black/40 lg:block ${menu ? "opacity-100" : "pointer-events-none opacity-0"}`} />

      <header onMouseLeave={hide}
        className={`sticky top-0 z-40 -mb-16 border-b transition-all duration-300 ${overDark && !scrolled && !menu ? "dark" : ""} ${scrolled || menu
          ? "border-slate-200/80 bg-white/90 backdrop-blur-xl dark:border-white/[.06] dark:bg-[#070B14]/90"
          : "border-transparent bg-transparent"}`}>
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-6 xl:gap-6">
          <Logo />

          <nav aria-label={t("Main")} className="mx-auto hidden items-center gap-0.5 rounded-2xl border border-slate-200 bg-slate-100/70 p-1 dark:border-white/[.08] dark:bg-white/[.04] lg:flex">
            <Link href="/virtual-number" onMouseEnter={hide} aria-current={onNumbers ? "page" : undefined} className={item(onNumbers)}>
              <LayoutGrid className={icon(onNumbers)} />{t("Virtual numbers")}
            </Link>
            <button onMouseEnter={() => show("services")} onMouseLeave={hide} onClick={() => show("services")} onKeyDown={escape} aria-expanded={menu === "services"} className={item(onServices || menu === "services")}>
              <AlignLeft className={icon(onServices || menu === "services")} />{t("Services")}<ChevronDown className={`h-3.5 w-3.5 opacity-60 transition ${menu === "services" ? "rotate-180" : ""}`} />
            </button>
            <Link href="/blog" onMouseEnter={hide} aria-current={onBlog ? "page" : undefined} className={item(onBlog)}>
              <BookOpen className={icon(onBlog)} />{t("Blog")}
            </Link>
            <div className="relative" onMouseLeave={hide}>
              <button onMouseEnter={() => show("about")} onClick={() => show("about")} onKeyDown={escape} aria-expanded={menu === "about"} className={item(onAbout || menu === "about")}>
                <Info className={icon(onAbout || menu === "about")} />{t("About")}<ChevronDown className={`h-3.5 w-3.5 opacity-60 transition ${menu === "about" ? "rotate-180" : ""}`} />
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

          <div className="ms-auto flex items-center gap-2 lg:ms-0">
            <button onClick={() => setSearch(true)} aria-label={t("Search services (Ctrl K)")} title={t("Search (Ctrl K)")} className={round}><Search className="h-[18px] w-[18px]" /></button>
            <div className="hidden sm:block"><LangSwitch variant="pill" /></div>
            <ThemeToggle className="border border-slate-200 hover:border-slate-300 hover:bg-slate-50 dark:border-white/10 dark:hover:border-white/20 dark:hover:bg-white/[.04]" />
            <AccountButton outline label={t("Sign in / Sign up")} />
            <button onClick={() => setMobile(true)} aria-label={t("Open menu")} className={`${round} lg:hidden`}><Menu className="h-5 w-5" /></button>
          </div>
        </div>

        <ServicesMega open={menu === "services"} onEnter={() => show("services")} onLeave={hide} />
      </header>
      <MobileMenu open={mobile} onClose={() => setMobile(false)} withAbout />
      {search && <SearchPalette onClose={() => setSearch(false)} />}
    </>
  );
}
