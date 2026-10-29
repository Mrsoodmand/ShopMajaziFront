import Link from "next/link";
import { copyright, footerBlurb, legalLinks } from "@/content/footer-en";
import { LangSwitch, Logo, ThemeToggle } from "../header/shared";
import { Columns, Payments, Socials } from "./parts";

// Offer A — "Classic Columns": logo, short blurb and socials on the left, four link columns on the right,
// and a bottom bar with copyright, legal links, payment methods, language and theme.
export default function FooterA() {
  return (
    <footer className="border-t border-slate-200 bg-white dark:border-white/10 dark:bg-[#070B14]">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-16 lg:grid-cols-[1fr_2.2fr]">
        <div>
          <Logo />
          <p className="mt-4 max-w-xs text-sm leading-6 text-slate-500 dark:text-slate-400">{footerBlurb}</p>
          <div className="mt-6"><Socials /></div>
        </div>
        <Columns />
      </div>
      <div className="border-t border-slate-200 dark:border-white/10">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-6">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-slate-500 dark:text-slate-400">
            <span>{copyright}</span>
            {legalLinks.map((l) => <Link key={l.href} href={l.href} className="hover:text-slate-900 dark:hover:text-white">{l.label}</Link>)}
          </div>
          <div className="flex items-center gap-3">
            <Payments />
            <LangSwitch />
            <ThemeToggle />
          </div>
        </div>
      </div>
    </footer>
  );
}
