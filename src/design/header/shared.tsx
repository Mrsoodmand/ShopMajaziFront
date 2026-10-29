"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "@/i18n/Link";
import { ChevronDown, Globe, X, ArrowRight, Sun, Moon, Search, CornerDownLeft } from "lucide-react";
import { brand } from "@/content/en";
import { BrandMark, Wordmark } from "@/components/brand/Brand";
import { aboutLinks, languages, navGroups, navLinks } from "@/content/nav-en";
import { useLocale, useT } from "@/i18n/client";
import { localePath, stripLocale, type Locale } from "@/i18n/config";
import { useLocalePath } from "@/i18n/Link";
import { AccountMobile } from "./AccountMenu";

// Helpers shared by the header offers. Components follow the site theme (light + `dark:` styles);
// the `dark` prop forces the dark look for headers that are always dark (offer D).

export function useScrolled(px = 8) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > px);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, [px]);
  return scrolled;
}

export function useClickOutside<T extends HTMLElement>(onOutside: () => void) {
  const ref = useRef<T>(null);
  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) onOutside(); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [onOutside]);
  return ref;
}

export function Logo({ dark = false }: { dark?: boolean }) {
  const tx = useT();
  // Mark and name follow the logo chosen in /design/logo (components/brand).
  return (
    <Link href="/" aria-label={tx.tr(brand).name} className={`flex items-center gap-2 text-xl ${dark ? "text-white" : "text-slate-900 dark:text-white"}`}>
      <BrandMark className="h-8 w-8 shrink-0" />
      <Wordmark />
    </Link>
  );
}

// Light / dark switch. The choice is saved in localStorage; layout.tsx applies it before first paint.
export function ThemeToggle({ className = "" }: { className?: string }) {
  const tx = useT();
  const [isDark, setIsDark] = useState(false);
  // Track the <html> class so every toggle on the page (bar and mobile menu) shows the same icon.
  useEffect(() => {
    const html = document.documentElement;
    const sync = () => setIsDark(html.classList.contains("dark"));
    sync();
    const mo = new MutationObserver(sync);
    mo.observe(html, { attributes: true, attributeFilter: ["class"] });
    return () => mo.disconnect();
  }, []);
  const flip = () => {
    const next = !isDark;
    document.documentElement.classList.toggle("dark", next);
    try { localStorage.setItem("theme", next ? "dark" : "light"); } catch {}
    setIsDark(next);
  };
  return (
    <button onClick={flip} aria-label={isDark ? tx("Switch to light mode") : tx("Switch to dark mode")} title={isDark ? tx("Light mode") : tx("Dark mode")}
      className={`relative grid h-10 w-10 place-items-center overflow-hidden rounded-full text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/10 ${className}`}>
      <Sun className={`absolute h-[18px] w-[18px] transition duration-500 ${isDark ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-0 opacity-0"}`} />
      <Moon className={`absolute h-[18px] w-[18px] transition duration-500 ${isDark ? "rotate-90 scale-0 opacity-0" : "rotate-0 scale-100 opacity-100"}`} />
    </button>
  );
}

// FA / EN switcher: opens the same page in the other language (Persian at /, English under /en).
export function LangSwitch({ dark = false, variant = "menu" }: { dark?: boolean; variant?: "menu" | "toggle" | "pill" }) {
  const tx = useT();
  const lang = useLocale();
  const setLang = (code: string) => { if (code !== lang) window.location.assign(localePath(stripLocale(window.location.pathname), code as Locale) + window.location.search + window.location.hash); };
  const [open, setOpen] = useState(false);
  const ref = useClickOutside<HTMLDivElement>(() => setOpen(false));

  if (variant === "toggle")
    return (
      <div className={`flex rounded-full p-0.5 text-xs font-semibold ${dark ? "bg-white/10" : "bg-slate-100 dark:bg-white/10"}`}>
        {tx.tr(languages).map((l) => (
          <button key={l.code} onClick={() => setLang(l.code)}
            className={`rounded-full px-2.5 py-1 transition ${lang === l.code ? "bg-white text-slate-900 shadow-sm" : dark ? "text-slate-300" : "text-slate-500 dark:text-slate-300"}`}>
            {l.code === "fa" ? "فا" : l.short}
          </button>
        ))}
      </div>
    );

  return (
    <div ref={ref} className="relative">
      {variant === "pill" ? (
        // Outlined pill (header G): globe + code, no chevron.
        <button onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-label={tx("Language")}
          className="flex h-10 items-center gap-2 rounded-full border border-slate-200 px-3.5 text-sm font-semibold text-slate-800 transition hover:border-slate-300 hover:bg-slate-50 dark:border-white/10 dark:text-white dark:hover:border-white/20 dark:hover:bg-white/[.04]">
          <Globe className="h-4 w-4" />{lang === "fa" ? "فا" : "EN"}
        </button>
      ) : (
        <button onClick={() => setOpen((o) => !o)} aria-expanded={open}
          className={`flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium ${dark ? "text-slate-300 hover:bg-white/10" : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/10"}`}>
          <Globe className="h-4 w-4" />{lang === "fa" ? "فا" : "EN"}<ChevronDown className="h-3.5 w-3.5" />
        </button>
      )}
      {open && (
        <div className="absolute end-0 top-full z-50 mt-2 w-40 rounded-xl bg-white p-1 shadow-xl ring-1 ring-slate-200 dark:bg-[#0E1424] dark:ring-white/10">
          {tx.tr(languages).map((l) => (
            <button key={l.code} onClick={() => { setLang(l.code); setOpen(false); }}
              className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm ${lang === l.code ? "bg-indigo-50 font-medium text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300" : "text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-white/5"}`}>
              {l.label}<span className="text-xs text-slate-400">{l.short}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// Slide-in mobile menu with an accordion per service group. `withAbout` swaps Support for an "About us" group (header F).
export function MobileMenu({ open, onClose, dark = false, withAbout = false }: { open: boolean; onClose: () => void; dark?: boolean; withAbout?: boolean }) {
  const tx = useT();
  const [group, setGroup] = useState<string | null>(tx.tr(navGroups)[0].id);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const panel = dark ? tx("bg-[#0B1020] text-white") : tx("bg-white text-slate-900 dark:bg-[#0B1020] dark:text-white");
  const line = dark ? "border-white/10" : "border-slate-100 dark:border-white/10";
  const hover = dark ? "hover:bg-white/5" : "hover:bg-slate-50 dark:hover:bg-white/5";
  const muted = dark ? "text-slate-400" : "text-slate-500 dark:text-slate-400";
  const current = dark ? "bg-white/5" : "bg-slate-50 dark:bg-white/5";
  const tile = dark ? "bg-white/5 text-slate-400 ring-1 ring-white/10" : "bg-white text-slate-500 ring-1 ring-slate-200 dark:bg-white/5 dark:text-slate-400 dark:ring-white/10";
  const ease = "ease-[cubic-bezier(.2,.7,.2,1)]";
  // Rows and sub-items fade up in a short stagger. The class is only set while visible, so adding it replays the animation.
  const rise = (show: boolean) => (show ? "animate-fade-up [animation-duration:450ms]" : "");
  const delay = (ms: number) => ({ animationDelay: `${ms}ms` });

  return (
    <div className={`fixed inset-0 z-[60] lg:hidden ${open ? "" : "pointer-events-none"}`} aria-hidden={!open}>
      <div onClick={onClose} className={`absolute inset-0 bg-slate-950/40 backdrop-blur-sm transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0"}`} />
      <div className={`absolute inset-y-0 end-0 flex w-[86%] max-w-sm flex-col shadow-2xl transition-transform duration-500 ${ease} ${panel} ${open ? "translate-x-0" : "translate-x-full rtl:-translate-x-full"}`}>
        <div className="flex items-center justify-between px-5 py-4">
          <Logo dark={dark} />
          <div className="flex items-center gap-1">
            {!dark && <ThemeToggle />}
            <button onClick={onClose} aria-label={tx("Close menu")} className={`grid h-9 w-9 place-items-center rounded-full ${dark ? "bg-white/10" : "bg-slate-100 dark:bg-white/10"}`}><X className="h-5 w-5" /></button>
          </div>
        </div>
        <nav className="flex-1 overflow-y-auto px-3">
          {tx.tr(navGroups).map((g, gi) => {
            const on = group === g.id;
            const shown = open && on;
            return (
              <div key={g.id} className={`border-b ${line} ${rise(open)}`} style={delay(80 + gi * 50)}>
                <button onClick={() => setGroup(on ? null : g.id)} aria-expanded={on} className={`my-1.5 flex w-full items-center gap-3 rounded-2xl px-2 py-2.5 text-start font-medium transition-colors duration-300 ${on ? current : hover}`}>
                  <span className={`grid h-9 w-9 place-items-center rounded-xl transition-colors duration-300 ${on ? "bg-indigo-600 text-white" : tile}`}><g.icon className="h-[18px] w-[18px]" /></span>
                  <span className="flex-1">{g.label}</span>
                  <ChevronDown className={`h-4 w-4 transition-transform duration-500 ${ease} ${on ? "rotate-180" : ""}`} />
                </button>
                <div className={`grid transition-all duration-500 ${ease} ${on ? "grid-rows-[1fr] pb-3 opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                  <div className="overflow-hidden">
                    {g.items.map((it, i) => (
                      <Link key={it.href} href={it.href} onClick={onClose} style={delay(60 + i * 45)} className={`flex items-center gap-3 rounded-xl px-3 py-2.5 ${hover} ${rise(shown)}`}>
                        <it.icon className={`h-4 w-4 ${muted}`} />
                        <span className="flex-1 text-sm">{it.label}</span>
                        <span className={`text-xs ${muted}`}>{it.from}</span>
                      </Link>
                    ))}
                    {g.viewAll && <Link href={g.viewAll.href} onClick={onClose} style={delay(60 + g.items.length * 45)} className={`flex items-center gap-1 ${rise(shown)} px-3 py-2 text-sm font-medium text-indigo-500`}>{g.viewAll.label}<ArrowRight className="h-3.5 w-3.5 rtl:rotate-180" /></Link>}
                  </div>
                </div>
              </div>
            );
          })}
          {(withAbout ? tx.tr(navLinks).filter((l) => l.href !== "/contact-us") : tx.tr(navLinks)).map((l, li) => <Link key={l.href} href={l.href} onClick={onClose} style={delay(80 + (tx.tr(navGroups).length + li) * 50)} className={`block border-b px-2 py-4 font-medium ${line} ${rise(open)}`}>{l.label}</Link>)}
          {withAbout && (
            <div className={`px-2 py-4 ${rise(open)}`} style={delay(80 + (tx.tr(navGroups).length + tx.tr(navLinks).length) * 50)}>
              <div className={`text-xs font-semibold uppercase tracking-widest ${muted}`}>{tx("About us")}</div>
              {tx.tr(aboutLinks).map((l) => (
                <Link key={l.href} href={l.href} onClick={onClose} className={`mt-1 flex items-center gap-3 rounded-xl px-1 py-2.5 text-sm ${hover}`}><l.icon className={`h-4 w-4 ${muted}`} />{l.label}</Link>
              ))}
            </div>
          )}
        </nav>
        <div className={`space-y-3 border-t p-5 ${line}`}>
          <div className="flex items-center justify-between text-sm"><span className={muted}>{tx("Language")}</span><LangSwitch variant="toggle" dark={dark} /></div>
          <AccountMobile onClose={onClose} label={withAbout ? tx("Sign in / Sign up") : tx("Sign in")} />
        </div>
      </div>
    </div>
  );
}

// Ctrl K / Cmd K toggles the search palette; Escape closes it.
export function useSearchHotkey(setOpen: (fn: (open: boolean) => boolean) => void) {
  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); setOpen((o) => !o); }
      if (e.key === "Escape") setOpen(() => false);
    };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [setOpen]);
}

// Search palette over every service: type to filter, arrow keys to move, Enter to open.
// Follows the site theme; `dark` forces the dark look (offer D).
export function SearchPalette({ onClose, dark = false }: { onClose: () => void; dark?: boolean }) {
  const tx = useT();
  const router = useRouter();
  const [q, setQ] = useState("");
  const [sel, setSel] = useState(0);
  const input = useRef<HTMLInputElement>(null);
  useEffect(() => input.current?.focus(), []);

  const results = useMemo(() => {
    const all = tx.tr(navGroups).flatMap((g) => g.items.map((it) => ({ ...it, group: g.label })));
    const t = q.trim().toLowerCase();
    return t ? all.filter((r) => `${r.label} ${r.desc} ${r.group}`.toLowerCase().includes(t)) : all;
  }, [q]);

  const lp = useLocalePath();
  const go = (href: string) => { onClose(); router.push(lp(href)); };
  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") { e.preventDefault(); setSel((s) => Math.min(s + 1, results.length - 1)); }
    if (e.key === "ArrowUp") { e.preventDefault(); setSel((s) => Math.max(s - 1, 0)); }
    if (e.key === "Enter" && results[sel]) go(results[sel].href);
  };

  const box = dark ? tx("border-white/10 bg-[#0B1020] text-white") : tx("border-slate-200 bg-white text-slate-900 dark:border-white/10 dark:bg-[#0B1020] dark:text-white");
  const line = dark ? "border-white/10" : "border-slate-100 dark:border-white/10";
  const muted = dark ? "text-slate-500" : "text-slate-400 dark:text-slate-500";
  const chip = dark ? "bg-white/5 text-slate-400" : "bg-slate-100 text-slate-500 dark:bg-white/5 dark:text-slate-400";
  const selRow = dark ? "bg-indigo-500/20" : "bg-indigo-50 dark:bg-indigo-500/20";

  return (
    <div className="fixed inset-0 z-[70] flex items-start justify-center bg-slate-950/50 px-4 pt-[12vh] backdrop-blur-sm" onClick={onClose}>
      <div role="dialog" aria-label={tx("Search services")} onClick={(e) => e.stopPropagation()} className={`w-full max-w-xl animate-fade-up overflow-hidden rounded-2xl border shadow-2xl [animation-duration:250ms] ${box}`}>
        <div className={`flex items-center gap-3 border-b px-4 ${line}`}>
          <Search className={`h-5 w-5 ${muted}`} />
          <input ref={input} value={q} onChange={(e) => { setQ(e.target.value); setSel(0); }} onKeyDown={onKey} placeholder={tx("Search services…")} className="h-14 flex-1 bg-transparent text-base outline-none placeholder:text-slate-400" />
          <button onClick={onClose} aria-label={tx("Close search")} className={`grid h-7 w-7 place-items-center rounded-md ${chip}`}><X className="h-4 w-4" /></button>
        </div>
        <ul className="max-h-80 overflow-y-auto p-2">
          {results.length === 0 && <li className={`px-3 py-8 text-center text-sm ${muted}`}>{tx("No services match “")}{q}”.</li>}
          {results.map((r, i) => (
            <li key={r.href}>
              <button onMouseEnter={() => setSel(i)} onClick={() => go(r.href)} className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-start ${i === sel ? selRow : ""}`}>
                <span className={`grid h-9 w-9 place-items-center rounded-lg ${i === sel ? "bg-indigo-500 text-white" : chip}`}><r.icon className="h-4 w-4" /></span>
                <span className="flex-1"><span className="block text-sm font-medium">{r.label}</span><span className={`block text-xs ${muted}`}>{r.group} · {r.desc}</span></span>
                <span className={`text-xs ${muted}`}>{r.from}</span>
                {i === sel && <CornerDownLeft className={`h-4 w-4 ${muted}`} />}
              </button>
            </li>
          ))}
        </ul>
        <div className={`flex gap-4 border-t px-4 py-2.5 text-[11px] ${line} ${muted}`}><span>{tx("↑↓ to move")}</span><span>{tx("Enter to open")}</span><span>{tx("Esc to close")}</span></div>
      </div>
    </div>
  );
}
