"use client";

import Link from "@/i18n/Link";
import { MessageCircle, Send, Mail, ArrowUpRight } from "lucide-react";
import { copyright, footerBlurb, legalLinks, supportEmail } from "@/content/footer-en";
import { Logo } from "../header/shared";
import { Columns, EnamadSeal, Socials } from "./parts";
import { FooterLink, type LinkStyle } from "./links";
import { useLocale, useT } from "@/i18n/client";
import seam from "./footerSeam.module.css";

const channels = [
  { icon: MessageCircle, title: "Live chat", desc: "Average reply in 2 minutes", href: "/contact-us", tint: "bg-indigo-600 text-white" },
  { icon: Send, title: "Telegram support", desc: "Message us any time, 24/7", href: "#", tint: "bg-sky-500 text-white" },
  { icon: Mail, title: "Email", desc: supportEmail, href: `mailto:${supportEmail}`, tint: "bg-slate-900 text-white dark:bg-white dark:text-slate-900" },
];

// Offer F — "Support + Wordmark" (B + E): E's three support cards on top, then B's footer without its call-to-action
// card: logo, blurb, socials, link columns and the legal line (the giant faded wordmark under it was removed on
// 2026-11-09). Links and socials animate on hover; `linkStyle` picks the link hover style (see links.tsx).
export default function FooterF({ linkStyle = "arrow" }: { linkStyle?: LinkStyle }) {
  const t = useT();
  const locale = useLocale();
  return (
    <footer className="relative bg-[#F5F6FB] dark:bg-[#070B14]">
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 start-[12%] h-80 w-80 rounded-full bg-indigo-300/30 blur-[110px] dark:bg-indigo-600/15" />
        <div className="absolute -top-16 end-[10%] h-72 w-72 rounded-full bg-fuchsia-300/25 blur-[110px] dark:bg-fuchsia-600/10" />
      </div>
      {/* Glow seam: where the page above fades out, a soft light line marks the footer's edge, glowing both above and
          below it (footerSeam.module.css). The footer itself doesn't clip, so the upper half reaches into the page. */}
      <div aria-hidden className={seam.seam}>
        <div className={seam.halo} />
        <div className={seam.line} />
      </div>

      <div className="relative mx-auto max-w-7xl px-6">
        <div className="grid gap-4 border-b border-slate-200 py-14 md:grid-cols-3 dark:border-white/10">
          {t.tr(channels).map((c) => (
            <Link key={c.title} href={c.href}
              className="group flex items-center gap-4 rounded-3xl bg-white/80 p-5 ring-1 ring-slate-200 backdrop-blur transition duration-300 ease-out hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-200/50 hover:ring-indigo-200 dark:bg-white/5 dark:ring-white/10 dark:hover:shadow-black/40 dark:hover:ring-indigo-400/40 motion-reduce:hover:translate-y-0">
              <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl transition duration-300 ease-out group-hover:scale-105 ${c.tint}`}><c.icon className="h-5 w-5" /></span>
              <span className="min-w-0 flex-1">
                <span className="block font-semibold text-slate-900 dark:text-white">{c.title}</span>
                <span className="block truncate text-sm text-slate-500 dark:text-slate-400">{c.desc}</span>
              </span>
              <ArrowUpRight className="h-5 w-5 text-slate-300 transition duration-300 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-slate-900 rtl:-scale-x-100 dark:text-slate-600 dark:group-hover:text-white" />
            </Link>
          ))}
        </div>

        <div className="grid gap-12 py-16 lg:grid-cols-[1fr_2.2fr]">
          <div>
            <Logo />
            <p className="mt-4 max-w-xs text-sm leading-6 text-slate-500 dark:text-slate-400">{t.tr(footerBlurb)}</p>
            <div className="mt-6"><Socials animated /></div>
            {locale === "fa" && <EnamadSeal className="mt-6" />}
          </div>
          <Columns linkStyle={linkStyle} />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-200 pb-8 pt-6 text-xs text-slate-500 dark:border-white/10 dark:text-slate-400">
          <span>{t.tr(copyright)}</span>
          <div className="flex gap-5">
            {t.tr(legalLinks).map((l) => <FooterLink key={l.href} href={l.href} label={l.label} style={linkStyle} />)}
          </div>
        </div>
      </div>
    </footer>
  );
}
