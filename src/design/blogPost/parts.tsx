"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import Link from "@/i18n/Link";
import { ArrowRight, Check, ChevronRight, Clock, Info, Link2, Quote, Send, TriangleAlert, Zap } from "lucide-react";
import { catLabel, postHref, type Post } from "@/content/blog-en";
import { getArticle, sampleArticle, type ArticlePage, type Block } from "@/content/blog-post-en";
import Cover from "../blog/Cover";
import { Chip, Meta } from "../blog/parts";
import { useT } from "@/i18n/client";

// Pieces shared by the blog post page offers.

// The article being shown. Each post design wraps itself in <ArticleProvider slug=…>; without a slug (the design
// comparison pages) it shows the sample article.
const ArticleCtx = createContext<ArticlePage>(sampleArticle);
export const useArticle = () => useContext(ArticleCtx);
export function ArticleProvider({ slug, children }: { slug?: string; children: ReactNode }) {
  const tx = useT();
  // Translated like the sample; getArticle builds a new object per call, so keep one per slug.
  const article = useMemo(() => tx.tr((slug && getArticle(slug)) || sampleArticle), [slug, tx]);
  return <ArticleCtx.Provider value={article}>{children}</ArticleCtx.Provider>;
}

// ---------- Article body ----------

// `size` sets the reading size; `cta` decides what the inline product slot shows (nothing, by default).
export function Body({ size = "md", cta, blocks }: { size?: "md" | "lg"; cta?: ReactNode; blocks?: Block[] }) {
  const { post, body } = useArticle();
  const p = size === "lg" ? "text-[19px] leading-9" : "text-[17px] leading-8";
  return (
    <div className="text-slate-700 dark:text-slate-300">
      {(blocks ?? body).map((b, i) => {
        switch (b.t) {
          case "p": return <p key={i} className={`mt-6 ${p}`}>{b.text}</p>;
          case "h2": return <h2 key={i} id={b.id} className="mt-14 scroll-mt-28 font-display text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-white">{b.text}</h2>;
          case "h3": return <h3 key={i} className="mt-8 font-display text-xl font-semibold text-slate-900 dark:text-white">{b.text}</h3>;
          case "ul": return (
            <ul key={i} className={`mt-6 space-y-3 ${p}`}>
              {b.items.map((it) => <li key={it} className="flex gap-3"><Check className="mt-2 h-4 w-4 shrink-0 text-emerald-500" />{it}</li>)}
            </ul>
          );
          case "ol": return (
            <ol key={i} className={`mt-6 space-y-3 ${p}`}>
              {b.items.map((it, n) => <li key={it} className="flex gap-3"><span className="mt-1 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-indigo-600 text-xs font-bold text-white">{n + 1}</span>{it}</li>)}
            </ol>
          );
          case "tip":
          case "warn": {
            const warn = b.t === "warn";
            const Icon = warn ? TriangleAlert : Info;
            return (
              <aside key={i} className={`mt-8 flex gap-4 rounded-2xl p-5 ring-1 ${warn ? "bg-amber-50 ring-amber-200 dark:bg-amber-500/10 dark:ring-amber-400/25" : "bg-indigo-50 ring-indigo-200 dark:bg-indigo-500/10 dark:ring-indigo-400/25"}`}>
                <Icon className={`mt-0.5 h-5 w-5 shrink-0 ${warn ? "text-amber-600 dark:text-amber-400" : "text-indigo-600 dark:text-indigo-400"}`} />
                <div><div className="font-semibold text-slate-900 dark:text-white">{b.title}</div><p className="mt-1 text-[15px] leading-7">{b.text}</p></div>
              </aside>
            );
          }
          case "quote": return (
            <blockquote key={i} className="relative my-12 border-s-4 border-indigo-500 ps-6">
              <Quote className="absolute -top-3 start-6 h-8 w-8 -translate-y-full text-indigo-200 dark:text-indigo-500/30" />
              <p className="font-display text-2xl font-semibold leading-snug text-slate-900 dark:text-white">{b.text}</p>
            </blockquote>
          );
          case "figure": return (
            <figure key={i} className="mt-8">
              <Cover cat={post.cat} className="aspect-[16/9] rounded-2xl" />
              <figcaption className="mt-3 text-center text-sm text-slate-500 dark:text-slate-400">{b.caption}</figcaption>
            </figure>
          );
          case "table": return (
            <div key={i} className="mt-8 overflow-x-auto rounded-2xl ring-1 ring-slate-200 dark:ring-white/10">
              <table className="w-full text-start text-[15px]">
                <thead className="bg-slate-50 dark:bg-white/5"><tr>{b.head.map((h) => <th key={h} className="px-4 py-3 text-start font-semibold text-slate-900 dark:text-white">{h}</th>)}</tr></thead>
                <tbody className="divide-y divide-slate-200 dark:divide-white/10">{b.rows.map((r) => <tr key={r[0]}>{r.map((c) => <td key={c} className="px-4 py-3 align-top">{c}</td>)}</tr>)}</tbody>
              </table>
            </div>
          );
          case "cta": return cta ? <div key={i} className="mt-8">{cta}</div> : null;
        }
      })}
    </div>
  );
}

// ---------- Header bits ----------

export function Crumbs({ light = false }: { light?: boolean }) {
  const tx = useT();
  const { post } = useArticle();
  const c = light ? "text-white/70 hover:text-white" : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white";
  return (
    <nav aria-label={tx("Breadcrumb")} className={`flex flex-wrap items-center gap-1.5 text-sm ${light ? "text-white/50" : "text-slate-400"}`}>
      <Link href="/" className={c}>{tx("Home")}</Link><ChevronRight className="h-3.5 w-3.5 rtl:rotate-180" />
      <Link href="/blog" className={c}>{tx("Blog")}</Link><ChevronRight className="h-3.5 w-3.5 rtl:rotate-180" />
      <Link href={`/blog?topic=${post.cat}`} className={c}>{tx(catLabel(post.cat))}</Link>
    </nav>
  );
}

export function Byline({ light = false, updated = true }: { light?: boolean; updated?: boolean }) {
  const tx = useT();
  const article = useArticle();
  const { author, post } = article;
  return (
    <div className="flex items-center gap-3">
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-gradient-to-br from-indigo-600 to-fuchsia-500 text-sm font-bold text-white">{author.initials}</span>
      <div className="text-sm">
        <div className={`font-semibold ${light ? "text-white" : "text-slate-900 dark:text-white"}`}>{author.name}</div>
        <div className={`flex flex-wrap items-center gap-x-2 ${light ? "text-white/70" : "text-slate-500 dark:text-slate-400"}`}>
          <time>{post.date}</time>{updated && article.updated !== post.date && <><span aria-hidden>·</span><span>{tx("Updated")}{" "}{article.updated}</span></>}<span aria-hidden>·</span>
          <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{post.read}{" "}{tx("read")}</span>
        </div>
      </div>
    </div>
  );
}

// ---------- Reading helpers ----------

export function useProgress() {
  const [pct, setPct] = useState(0);
  useEffect(() => {
    const on = () => {
      const el = document.getElementById("article");
      if (!el) return;
      const r = el.getBoundingClientRect();
      const total = r.height - window.innerHeight * 0.6;
      setPct(Math.max(0, Math.min(1, -r.top / Math.max(1, total))));
    };
    on();
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    return () => { window.removeEventListener("scroll", on); window.removeEventListener("resize", on); };
  }, []);
  return pct;
}

export function ProgressBar({ pct }: { pct: number }) {
  return <div aria-hidden className="fixed inset-x-0 top-16 z-30 h-1 bg-transparent"><div className="h-full origin-left bg-gradient-to-r from-indigo-500 to-fuchsia-500 rtl:origin-right" style={{ transform: `scaleX(${pct})` }} /></div>;
}

// The section currently being read, for highlighting the contents list.
export function useActiveSection() {
  const { toc } = useArticle();
  const [active, setActive] = useState(toc[0]?.id ?? "");
  useEffect(() => {
    const els = toc.map((h) => document.getElementById(h.id)).filter(Boolean) as HTMLElement[];
    const on = () => {
      let cur = toc[0]?.id ?? "";
      for (const el of els) if (el.getBoundingClientRect().top < 140) cur = el.id;
      setActive(cur);
    };
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, [toc]);
  return active;
}

export function Toc({ active, title = "On this page" }: { active: string; title?: string }) {
  const tx = useT();
  title = tx(title);
  const { toc } = useArticle();
  return (
    <nav aria-label={tx("Contents")}>
      <div className="text-xs font-semibold uppercase tracking-widest text-slate-400">{title}</div>
      <ol className="mt-4 space-y-1 border-s border-slate-200 dark:border-white/10">
        {toc.map((h) => {
          const on = h.id === active;
          return (
            <li key={h.id}>
              <a href={`#${h.id}`} className={`-ms-px block border-s-2 py-1.5 ps-4 text-sm transition-colors duration-300 ${on ? "border-indigo-600 font-semibold text-slate-900 dark:border-indigo-400 dark:text-white" : "border-transparent text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"}`}>{h.text}</a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

// ---------- Share ----------

export function Share({ vertical = false, label = true }: { vertical?: boolean; label?: boolean }) {
  const tx = useT();
  const [copied, setCopied] = useState(false);
  const copy = () => { navigator.clipboard?.writeText(window.location.href).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1600); }).catch(() => {}); };
  const open = (base: string) => window.open(base + encodeURIComponent(window.location.href), "_blank", "noopener");
  const btn = "grid h-10 w-10 place-items-center rounded-full bg-white text-slate-600 ring-1 ring-slate-200 transition hover:-translate-y-0.5 hover:text-indigo-600 hover:ring-indigo-300 dark:bg-white/5 dark:text-slate-300 dark:ring-white/10 dark:hover:text-indigo-300";
  return (
    <div className={`flex items-center gap-2 ${vertical ? "flex-col" : ""}`}>
      {label && <span className="text-xs font-semibold uppercase tracking-widest text-slate-400">{tx("Share")}</span>}
      <button onClick={() => open("https://t.me/share/url?url=")} aria-label={tx("Share on Telegram")} title={tx("Telegram")} className={btn}><Send className="h-4 w-4" /></button>
      <button onClick={() => open("https://x.com/intent/post?url=")} aria-label={tx("Share on X")} title="X" className={btn}><span className="text-sm font-bold">𝕏</span></button>
      <button onClick={() => open("https://wa.me/?text=")} aria-label={tx("Share on WhatsApp")} title={tx("WhatsApp")} className={btn}><span className="text-[11px] font-bold">{tx("WA")}</span></button>
      <button onClick={copy} aria-label={tx("Copy link")} title={copied ? tx("Copied") : tx("Copy link")} className={btn}>{copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Link2 className="h-4 w-4" />}</button>
    </div>
  );
}

// ---------- Endings ----------

export function Tags() {
  const article = useArticle();
  if (!article.tags.length) return null;
  return <div className="flex flex-wrap gap-2">{article.tags.map((t) => <span key={t} className="rounded-full bg-slate-100 px-3 py-1.5 text-sm text-slate-600 dark:bg-white/5 dark:text-slate-300">#{t}</span>)}</div>;
}

export function AuthorBox() {
  const tx = useT();
  const { author } = useArticle();
  return (
    <div className="flex gap-4 rounded-3xl bg-white p-6 ring-1 ring-slate-200 dark:bg-[#0E1424] dark:ring-white/10">
      <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-gradient-to-br from-indigo-600 to-fuchsia-500 font-bold text-white">{author.initials}</span>
      <div>
        <div className="text-xs font-semibold uppercase tracking-widest text-slate-400">{tx("Written by")}</div>
        <div className="mt-1 font-display text-lg font-semibold text-slate-900 dark:text-white">{author.name}</div>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{tx("The people who answer your support tickets. We write up what customers ask us most, and keep each guide updated.")}</p>
      </div>
    </div>
  );
}

// `stacked` lays it out top to bottom for narrow side columns.
export function ProductCta({ compact = false, stacked = false }: { compact?: boolean; stacked?: boolean }) {
  const tx = useT();
  // Translated here too: live posts come untranslated, and in Persian the price shows in Toman.
  const product = tx.tr(useArticle().product);
  if (stacked) return (
    <div className="rounded-3xl bg-gradient-to-br from-indigo-600 to-fuchsia-500 p-5 text-white">
      <span className="grid h-11 w-11 place-items-center rounded-2xl bg-white/20"><Zap className="h-5 w-5" /></span>
      <div className="mt-4 font-display text-lg font-semibold">{product.name}</div>
      <div className="mt-1 text-sm text-white/80">{product.desc}</div>
      <Link href={product.href} className="mt-5 flex items-center justify-center gap-1.5 rounded-xl bg-white py-2.5 text-sm font-semibold text-indigo-700">{tx("From")}{" "}{product.from}<ArrowRight className="h-4 w-4 rtl:rotate-180" /></Link>
    </div>
  );
  return (
    <div className={`flex flex-wrap items-center gap-4 rounded-3xl bg-gradient-to-br from-indigo-600 to-fuchsia-500 text-white ${compact ? "p-5" : "p-6 sm:p-7"}`}>
      <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-white/20"><Zap className="h-6 w-6" /></span>
      <div className="min-w-0 flex-1">
        <div className="font-display text-lg font-semibold">{product.name}</div>
        <div className="text-sm text-white/80">{product.desc}</div>
      </div>
      <Link href={product.href} className="flex shrink-0 items-center gap-1.5 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-indigo-700">{tx("From")}{" "}{product.from}<ArrowRight className="h-4 w-4 rtl:rotate-180" /></Link>
    </div>
  );
}

export function RelatedPosts({ title = "Keep reading", posts }: { title?: string; posts?: Post[] }) {
  const tx = useT();
  title = tx(title);
  const { related } = useArticle();
  posts ??= related;
  return (
    <section>
      <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-white">{title}</h2>
      <div className="mt-6 grid gap-6 sm:grid-cols-3">
        {posts.map((p) => (
          <Link key={p.slug} href={postHref(p)} className="group">
            <Cover cat={p.cat} className="aspect-[4/3] rounded-2xl" />
            <div className="mt-3"><Chip p={p} /></div>
            <h3 className="mt-2 line-clamp-2 font-display font-semibold leading-snug text-slate-900 transition-colors group-hover:text-indigo-700 dark:text-white dark:group-hover:text-indigo-300">{p.title}</h3>
            <div className="mt-1.5"><Meta p={p} /></div>
          </Link>
        ))}
      </div>
    </section>
  );
}

// The article's own questions under a heading; renders nothing when the article has none.
export function FaqList({ title }: { title: string }) {
  const article = useArticle();
  if (!article.faq.length) return null;
  return (
    <>
    <h2 className="mt-14 font-display text-2xl font-bold text-slate-900 dark:text-white">{title}</h2>
    <div className="mt-6 divide-y divide-slate-200 rounded-3xl bg-white ring-1 ring-slate-200 dark:divide-white/10 dark:bg-[#0E1424] dark:ring-white/10">
      {article.faq.map((f) => (
        <details key={f.q} className="group p-5 [&_summary::-webkit-details-marker]:hidden">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-slate-900 dark:text-white">
            {f.q}<ChevronRight className="h-4 w-4 shrink-0 text-slate-400 transition group-open:rotate-90 rtl:rotate-180 rtl:group-open:rotate-90" />
          </summary>
          <p className="mt-3 text-[15px] leading-7 text-slate-600 dark:text-slate-400">{f.a}</p>
        </details>
      ))}
    </div>
    </>
  );
}
