"use client";

import Link from "@/i18n/Link";
import { CreditCard, Bitcoin, Wallet, ShieldCheck } from "lucide-react";
import { footerColumns, socials, type FooterColumn } from "@/content/footer-en";
import { FooterLink, hoverLink, type LinkStyle } from "./links";
import { useT } from "@/i18n/client";

export { hoverLink };

// Pieces shared by the footer offers. `dark` forces the dark look (always-dark footers); otherwise they follow the theme.

// `linkStyle` turns on one of the animated hover styles from links.tsx (theme-following footers only).
export function Columns({ cols = footerColumns, dark = false, animated = false, linkStyle, className = "" }: { cols?: FooterColumn[]; dark?: boolean; animated?: boolean; linkStyle?: LinkStyle; className?: string }) {
  const tx = useT();
  cols = tx.tr(cols);
  const style = linkStyle ?? (animated ? "underline" : undefined);
  return (
    <div className={`grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-4 ${className}`}>
      {cols.map((c) => (
        <nav key={c.title} aria-label={c.title}>
          <div className={`text-sm font-semibold ${dark ? "text-white" : "text-slate-900 dark:text-white"}`}>{c.title}</div>
          <ul className="mt-4 space-y-2.5">
            {c.links.map((l) => (
              <li key={l.href}>
                {style
                  ? <FooterLink href={l.href} label={l.label} style={style} className="text-sm" />
                  : <Link href={l.href} className={`text-sm transition ${dark ? "text-slate-400 hover:text-white" : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"}`}>{l.label}</Link>}
              </li>
            ))}
          </ul>
        </nav>
      ))}
    </div>
  );
}

export function Socials({ dark = false, animated = false }: { dark?: boolean; animated?: boolean }) {
  const tx = useT();
  return (
    <div className="flex gap-2">
      {tx.tr(socials).map((s) => (
        <a key={s.label} href={s.href} aria-label={s.label} title={s.label}
          className={`grid h-10 w-10 place-items-center rounded-full transition ${animated ? "duration-300 ease-out hover:-translate-y-1 hover:shadow-lg hover:shadow-indigo-500/20 motion-reduce:hover:translate-y-0" : ""} ${dark ? "bg-white/5 text-slate-300 ring-1 ring-white/10 hover:bg-white hover:text-slate-900" : "bg-slate-100 text-slate-600 hover:bg-slate-900 hover:text-white dark:bg-white/5 dark:text-slate-300 dark:ring-1 dark:ring-white/10 dark:hover:bg-white dark:hover:text-slate-900"}`}>
          <s.icon className="h-[18px] w-[18px]" />
        </a>
      ))}
    </div>
  );
}

export function Payments({ dark = false }: { dark?: boolean }) {
  const tx = useT();
  const chip = dark ? "bg-white/5 text-slate-300 ring-white/10" : "bg-white text-slate-600 ring-slate-200 dark:bg-white/5 dark:text-slate-300 dark:ring-white/10";
  return (
    <div className="flex flex-wrap items-center gap-2">
      {[[CreditCard, tx("Card")], [Bitcoin, tx("Crypto")], [Wallet, tx("Wallet")]].map(([I, l]) => {
        const Icon = I as typeof Wallet;
        return <span key={l as string} className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium ring-1 ${chip}`}><Icon className="h-3.5 w-3.5" />{l as string}</span>;
      })}
    </div>
  );
}

// Space for official trust seals (for example e-Namad); they are images supplied by the issuer, so this is a placeholder.
export function TrustSeals({ dark = false }: { dark?: boolean }) {
  const tx = useT();
  return (
    <div className="flex gap-2">
      {[tx("Trust seal"), tx("Trust seal")].map((t, i) => (
        <div key={i} className={`grid h-16 w-16 place-items-center rounded-xl border border-dashed text-center text-[10px] leading-tight ${dark ? "border-white/15 text-slate-500" : "border-slate-300 text-slate-400 dark:border-white/15 dark:text-slate-500"}`}>
          <span><ShieldCheck className="mx-auto mb-1 h-4 w-4" />{t}</span>
        </div>
      ))}
    </div>
  );
}
