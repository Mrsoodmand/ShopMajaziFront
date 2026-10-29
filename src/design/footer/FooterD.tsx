import Link from "next/link";
import { copyright, legalLinks } from "@/content/footer-en";
import { aboutLinks, navGroups } from "@/content/nav-en";
import { LangSwitch, Logo, ThemeToggle } from "../header/shared";
import { Socials } from "./parts";

// Offer D — "Compact Centered": everything centered in a few lines: logo, one row of key links, socials, and a
// tiny legal line. Light-weight for a page that is already long.
export default function FooterD() {
  const links = [
    ...navGroups.map((g) => ({ label: g.label, href: g.viewAll?.href ?? g.items[0].href })),
    { label: "Blog", href: "/blog" },
    ...aboutLinks.map((l) => ({ label: l.label, href: l.href })),
  ];
  return (
    <footer className="border-t border-slate-200 bg-white py-14 dark:border-white/10 dark:bg-[#070B14]">
      <div className="mx-auto flex max-w-5xl flex-col items-center px-6 text-center">
        <Logo />
        <nav aria-label="Footer" className="mt-8 flex flex-wrap justify-center gap-x-7 gap-y-3">
          {links.map((l) => <Link key={l.href} href={l.href} className="text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">{l.label}</Link>)}
        </nav>
        <div className="mt-8"><Socials /></div>
        <div className="mt-10 flex w-full flex-wrap items-center justify-center gap-x-5 gap-y-3 border-t border-slate-100 pt-6 text-xs text-slate-500 dark:border-white/10 dark:text-slate-400">
          <span>{copyright}</span>
          {legalLinks.map((l) => <Link key={l.href} href={l.href} className="hover:text-slate-900 dark:hover:text-white">{l.label}</Link>)}
          <span className="flex items-center gap-1"><LangSwitch /><ThemeToggle /></span>
        </div>
      </div>
    </footer>
  );
}
