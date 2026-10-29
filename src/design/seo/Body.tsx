import Link from "@/i18n/Link";
import { ArrowRight, Check } from "lucide-react";
import type { SeoSection } from "@/content/seo-en";

// Paragraphs, bullet list and internal link of one SEO section. Shared by all content-area offers.
export default function Body({ s, tone = "light" }: { s: SeoSection; tone?: "light" | "dark" }) {
  const dark = tone === "dark";
  return (
    <>
      {s.paragraphs.map((p, i) => (
        <p key={i} className={`mt-4 text-[15px] leading-7 ${dark ? "text-slate-300" : "text-slate-600 dark:text-slate-400"}`}>{p}</p>
      ))}
      {s.bullets && (
        <ul className="mt-5 grid gap-2 sm:grid-cols-2">
          {s.bullets.map((b) => (
            <li key={b} className={`flex items-start gap-2 text-sm ${dark ? "text-slate-200" : "text-slate-700 dark:text-slate-300"}`}>
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />{b}
            </li>
          ))}
        </ul>
      )}
      {s.link && (
        <Link href={s.link.href} className={`group mt-5 inline-flex items-center gap-1.5 text-sm font-semibold ${dark ? "text-cyan-300" : "text-indigo-600 dark:text-indigo-400"}`}>
          {s.link.label}<ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5 rtl:rotate-180" />
        </Link>
      )}
    </>
  );
}
