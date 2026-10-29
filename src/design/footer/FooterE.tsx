import Link from "next/link";
import { MessageCircle, Send, Mail, ArrowUpRight } from "lucide-react";
import { copyright, footerBlurb, legalLinks, supportEmail } from "@/content/footer-en";
import { LangSwitch, Logo, ThemeToggle } from "../header/shared";
import { Columns, Payments, Socials, TrustSeals } from "./parts";

const channels = [
  { icon: MessageCircle, title: "Live chat", desc: "Average reply in 2 minutes", href: "/contact-us", tint: "bg-indigo-600 text-white" },
  { icon: Send, title: "Telegram support", desc: "Message us any time, 24/7", href: "#", tint: "bg-sky-500 text-white" },
  { icon: Mail, title: "Email", desc: supportEmail, href: `mailto:${supportEmail}`, tint: "bg-slate-900 text-white dark:bg-white dark:text-slate-900" },
];

// Offer E — "Support First": the footer opens with three ways to reach a real person, then the link columns,
// payment methods and trust seals. Uses hero G's soft mesh background so the page ends where it started.
export default function FooterE() {
  return (
    <footer className="relative overflow-hidden bg-[#F5F6FB] dark:bg-[#070B14]">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -bottom-32 start-[10%] h-96 w-96 rounded-full bg-indigo-300/40 blur-[120px] dark:bg-indigo-600/20" />
        <div className="absolute -bottom-20 end-[8%] h-80 w-80 rounded-full bg-fuchsia-300/30 blur-[110px] dark:bg-fuchsia-600/15" />
      </div>
      <div className="relative mx-auto max-w-7xl px-6">
        <div className="grid gap-4 border-b border-slate-200 py-14 md:grid-cols-3 dark:border-white/10">
          {channels.map((c) => (
            <Link key={c.title} href={c.href} className="group flex items-center gap-4 rounded-3xl bg-white/80 p-5 ring-1 ring-slate-200 backdrop-blur transition hover:-translate-y-0.5 hover:shadow-lg dark:bg-white/5 dark:ring-white/10 dark:hover:shadow-black/30">
              <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl ${c.tint}`}><c.icon className="h-5 w-5" /></span>
              <span className="min-w-0 flex-1">
                <span className="block font-semibold text-slate-900 dark:text-white">{c.title}</span>
                <span className="block truncate text-sm text-slate-500 dark:text-slate-400">{c.desc}</span>
              </span>
              <ArrowUpRight className="h-5 w-5 text-slate-300 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-slate-900 dark:text-slate-600 dark:group-hover:text-white" />
            </Link>
          ))}
        </div>

        <div className="grid gap-12 py-14 lg:grid-cols-[1fr_2.2fr]">
          <div>
            <Logo />
            <p className="mt-4 max-w-xs text-sm leading-6 text-slate-500 dark:text-slate-400">{footerBlurb}</p>
            <div className="mt-6"><Socials /></div>
          </div>
          <Columns />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-6 border-t border-slate-200 py-8 dark:border-white/10">
          <div className="flex flex-wrap items-center gap-6">
            <TrustSeals />
            <div>
              <div className="text-xs font-semibold uppercase tracking-widest text-slate-400">We accept</div>
              <div className="mt-2"><Payments /></div>
            </div>
          </div>
          <div className="flex items-center gap-1"><LangSwitch /><ThemeToggle /></div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 pb-8 text-xs text-slate-500 dark:text-slate-400">
          <span>{copyright}</span>
          <div className="flex gap-5">{legalLinks.map((l) => <Link key={l.href} href={l.href} className="hover:text-slate-900 dark:hover:text-white">{l.label}</Link>)}</div>
        </div>
      </div>
    </footer>
  );
}
