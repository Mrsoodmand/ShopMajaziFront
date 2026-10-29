import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { brand } from "@/content/en";
import { copyright, footerBlurb, legalLinks } from "@/content/footer-en";
import { Logo } from "../header/shared";
import { Columns, Socials } from "./parts";

// Offer B — "CTA + Wordmark": a last call-to-action card overlapping the top, the link columns, and a giant faded
// "ShopMajazi" wordmark at the very bottom. Bold and memorable.
export default function FooterB() {
  return (
    <footer className="relative overflow-hidden bg-[#F5F6FB] pt-16 dark:bg-[#070B14]">
      <div className="mx-auto max-w-7xl px-6">
        <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-500 p-10 text-white shadow-2xl shadow-indigo-500/20 sm:p-14">
          <div aria-hidden className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,.18)_1px,transparent_1px)] bg-[size:20px_20px] [mask-image:linear-gradient(to_left,black,transparent)]" />
          <div className="relative flex flex-wrap items-center justify-between gap-8">
            <div className="max-w-xl">
              <h2 className="font-display text-3xl font-bold leading-tight sm:text-4xl">Your first number is 30 seconds away.</h2>
              <p className="mt-3 text-white/80">Create a free account, top up once, and buy any service in one click.</p>
            </div>
            <Link href="/login" className="group flex items-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-indigo-700 shadow-lg">
              Get started free<ArrowRight className="h-4 w-4 transition group-hover:translate-x-1 rtl:rotate-180" />
            </Link>
          </div>
        </div>

        <div className="grid gap-12 py-16 lg:grid-cols-[1fr_2.2fr]">
          <div>
            <Logo />
            <p className="mt-4 max-w-xs text-sm leading-6 text-slate-500 dark:text-slate-400">{footerBlurb}</p>
            <div className="mt-6"><Socials /></div>
          </div>
          <Columns />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-200 py-6 text-xs text-slate-500 dark:border-white/10 dark:text-slate-400">
          <span>{copyright}</span>
          <div className="flex gap-5">{legalLinks.map((l) => <Link key={l.href} href={l.href} className="hover:text-slate-900 dark:hover:text-white">{l.label}</Link>)}</div>
        </div>
      </div>

      <div aria-hidden className="pointer-events-none select-none text-center font-display text-[18vw] font-bold leading-[0.8] tracking-tighter text-slate-900/[.06] dark:text-white/[.05]">
        {brand.name}
      </div>
    </footer>
  );
}
