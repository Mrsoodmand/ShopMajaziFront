"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "@/i18n/Link";
import { ArrowRight, BadgeCheck, ChevronDown, ChevronRight, MessageSquare, Send } from "lucide-react";
import { blogCats } from "@/content/blog-en";
import { archive } from "@/content/blog-list-en";
import { extrasFor, type ServiceComment } from "@/content/service-extras-en";
import { field, primary, ring, secondary } from "../googleVoice/clean";
import { PostCard } from "../blogList/parts";
import { useT } from "@/i18n/client";
import HowToSteps from "./HowToSteps";

// The sections every service page ends with, in this order: how to use, content area, comments, FAQ, blog.
// `service` is a key from service-extras (or "subs:{slug}" for a subscription's page).
// Rendered at the end of the page design through the extras slot (see slot.tsx). Accessible throughout: real
// headings, ordered steps, a disclosure that keeps the full article in the HTML, labelled comment form with errors
// tied to fields, native <details> for the FAQ, and FAQ structured data for search results.

const wrap = "mx-auto max-w-6xl px-4 sm:px-6";
const kicker = "text-sm font-semibold uppercase tracking-widest text-emerald-800 dark:text-emerald-300";
const h2 = "mt-2 font-display text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-white";
const card = "rounded-3xl border border-slate-200 bg-white dark:border-white/15 dark:bg-[#0E1424]";

export default function ServiceExtras({ service }: { service: string }) {
  const tx = useT();
  const s = extrasFor(service, tx);
  return (
    <div className="space-y-24 border-t border-slate-200 pb-24 pt-20 dark:border-white/10">
      <HowToUse service={service} />
      <ContentArea service={service} />
      <Comments key={service} service={service} />
      <ServiceFaq service={service} />
      <RelatedPosts service={service} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org", "@type": "FAQPage",
        mainEntity: s.faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
      }).replace(/</g, "\\u003c") }} />
    </div>
  );
}

// ---------- 1 · How to use ----------
// The steps come into focus one by one as they scroll into view (motion E, /design/steps-motion), their big numbers
// roll up into place and the progress bars fill (card animation D, /design/steps-detail).

function HowToUse({ service }: { service: string }) {
  return <HowToSteps service={service} motion="e" detail="roll" />;
}

// ---------- 2 · Content area ----------

function ContentArea({ service }: { service: string }) {
  const tx = useT();
  const s = extrasFor(service, tx);
  const [open, setOpen] = useState(false);
  // Only fold (and offer "Read the full guide") when the article is taller than the folded height.
  const FOLD = 420;
  const article = useRef<HTMLElement>(null);
  const [long, setLong] = useState(true);
  useEffect(() => {
    const el = article.current;
    if (!el) return;
    const check = () => setLong(el.scrollHeight > FOLD + 40);
    check();
    const ro = new ResizeObserver(check);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const folded = long && !open;
  const bodyId = useId();
  return (
    <section aria-labelledby="guide" className={wrap}>
      <p className={kicker}>{tx("Guide")}</p>
      <h2 id="guide" className={h2}>{tx("The {0} guide", { 0: s.name })}</h2>
      <div className="mt-8 grid gap-10 lg:grid-cols-[220px_minmax(0,1fr)]">
        <nav aria-label={tx("On this page")} className="hidden lg:block">
          <div className="sticky top-24">
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400">{tx("On this page")}</p>
            <ol className="mt-3 space-y-1 border-s border-slate-200 dark:border-white/10">
              {s.content.map((c) => (
                <li key={c.id}><a href={`#${service}-${c.id}`} onClick={() => setOpen(true)} className={`-ms-px block border-s-2 border-transparent py-1.5 ps-4 text-sm text-slate-700 hover:border-slate-400 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white ${ring}`}>{c.title}</a></li>
              ))}
            </ol>
          </div>
        </nav>
        <div>
          {/* The whole article stays in the HTML; when folded it is clipped, not removed, so search engines read all of it. */}
          <div id={bodyId} className={`relative overflow-hidden transition-[max-height] duration-500 ${folded ? "max-h-[420px]" : "max-h-[4000px]"}`}>
            <article ref={article} className="max-w-3xl space-y-10">
              {s.content.map((c) => (
                <section key={c.id} id={`${service}-${c.id}`} className="scroll-mt-24">
                  <h3 className="font-display text-xl font-bold text-slate-900 dark:text-white">{c.title}</h3>
                  {c.paragraphs.map((p, i) => <p key={i} className="mt-3 text-[17px] leading-8 text-slate-700 dark:text-slate-300">{p}</p>)}
                </section>
              ))}
            </article>
            {folded && <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#F5F6FB] to-transparent dark:from-[#070B14]" />}
          </div>
          {long && (
            <button onClick={() => setOpen(!open)} aria-expanded={open} aria-controls={bodyId} className={`${secondary} mt-6`}>
              {open ? tx("Show less") : tx("Read the full guide")}<ChevronDown aria-hidden className={`h-4 w-4 transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
            </button>
          )}
        </div>
      </div>
    </section>
  );
}

// ---------- 3 · Comments ----------

const PAGE = 3;

function Initials({ name, staff = false }: { name: string; staff?: boolean }) {
  const t = name.split(/\s+/).map((w) => w[0]).join("").slice(0, 2).toUpperCase();
  return <span aria-hidden className={`grid h-10 w-10 shrink-0 place-items-center rounded-full text-sm font-bold ${staff ? "bg-emerald-700 text-white dark:bg-emerald-400 dark:text-emerald-950" : "bg-slate-200 text-slate-800 dark:bg-white/10 dark:text-slate-200"}`}>{t}</span>;
}

function CommentItem({ c }: { c: ServiceComment }) {
  const tx = useT();
  return (
    <li className={`${tx.tr(card)} p-5`}>
      <article aria-label={tx("Comment by {0}", { 0: c.name })}>
        <div className="flex items-center gap-3">
          <Initials name={c.name} />
          <div><p className="font-semibold text-slate-900 dark:text-white">{c.name}</p><p className="text-sm text-slate-600 dark:text-slate-400">{c.date}</p></div>
        </div>
        <p className="mt-3 text-[15px] leading-7 text-slate-800 dark:text-slate-200">{c.text}</p>
      </article>
      {c.replies && c.replies.length > 0 && (
        <ul aria-label={tx("Replies to {0}", { 0: c.name })} className="mt-4 space-y-3 border-s-2 border-slate-200 ps-4 dark:border-white/10">
          {c.replies.map((r, i) => (
            <li key={i}>
              <article aria-label={tx("Reply from {0}", { 0: r.name })} className="flex gap-3">
                <Initials name={r.name} staff={r.staff} />
                <div>
                  <p className="flex items-center gap-1.5 font-semibold text-slate-900 dark:text-white">{r.name}{r.staff && <BadgeCheck aria-label={tx("Staff")} className="h-4 w-4 text-emerald-700 dark:text-emerald-400" />}</p>
                  <p className="mt-1 text-[15px] leading-7 text-slate-800 dark:text-slate-200">{r.text}</p>
                </div>
              </article>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
}

function Comments({ service }: { service: string }) {
  const tx = useT();
  const s = extrasFor(service, tx);
  const [shown, setShown] = useState(PAGE);
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [tried, setTried] = useState(false);
  const [sent, setSent] = useState(false);
  const nId = useId(), tId = useId();
  const errName = tried && !name.trim() ? tx("Enter your name") : "";
  const errText = tried && text.trim().length < 10 ? (text.trim() ? tx("Write at least 10 characters") : tx("Write your comment")) : "";
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setTried(true);
    if (!name.trim()) return document.getElementById(nId)?.focus();
    if (text.trim().length < 10) return document.getElementById(tId)?.focus();
    setSent(true); setName(""); setText(""); setTried(false);
  };
  const total = s.comments.length;

  return (
    <section aria-labelledby="comments" className={wrap}>
      <p className={kicker}>{tx("Comments")}</p>
      <h2 id="comments" className={h2}>{total} {tx(total === 1 ? "comment" : "comments")}{" "}{tx("on")}{" "}{s.name}</h2>
      <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_380px]">
        <div>
          <ul className="space-y-4">{s.comments.slice(0, shown).map((c) => <CommentItem key={c.id} c={c} />)}</ul>
          {shown < total && <button onClick={() => setShown(shown + PAGE)} className={`${secondary} mt-5`}>{tx("Show more comments (")}{total - shown})</button>}
        </div>

        <div className={`${tx.tr(card)} h-fit p-6 lg:sticky lg:top-24`}>
          <h3 className="flex items-center gap-2 font-display text-lg font-semibold text-slate-900 dark:text-white"><MessageSquare aria-hidden className="h-5 w-5" />{tx("Leave a comment")}</h3>
          <p aria-live="polite" className="mt-2 text-[15px] text-emerald-800 dark:text-emerald-300">{sent && tx("Thanks! Your comment will appear after a quick review.")}</p>
          <form noValidate onSubmit={submit} className="mt-2 space-y-5">
            <div>
              <label htmlFor={nId} className="block text-base font-semibold text-slate-900 dark:text-white">{tx("Name")}</label>
              {errName && <p id={`${nId}-e`} className="text-sm font-semibold text-red-700 dark:text-red-400"><span className="sr-only">{tx("Error:")}{" "}</span>{errName}</p>}
              <input id={nId} autoComplete="name" value={name} onChange={(e) => { setName(e.target.value); setSent(false); }} aria-invalid={!!errName} aria-describedby={errName ? `${nId}-e` : undefined} className={`${field} mt-2 ${errName ? "!border-red-700 dark:!border-red-400" : ""}`} />
            </div>
            <div>
              <label htmlFor={tId} className="block text-base font-semibold text-slate-900 dark:text-white">{tx("Comment")}</label>
              <p id={`${tId}-h`} className="text-sm text-slate-600 dark:text-slate-400">{tx("Questions are welcome; our team replies here.")}</p>
              {errText && <p id={`${tId}-e`} className="text-sm font-semibold text-red-700 dark:text-red-400"><span className="sr-only">{tx("Error:")}{" "}</span>{errText}</p>}
              <textarea id={tId} rows={5} maxLength={1000} value={text} onChange={(e) => { setText(e.target.value); setSent(false); }} aria-invalid={!!errText}
                aria-describedby={[`${tId}-h`, errText && `${tId}-e`, `${tId}-c`].filter(Boolean).join(" ")} className={`${field} mt-2 resize-y ${errText ? "!border-red-700 dark:!border-red-400" : ""}`} />
              <p id={`${tId}-c`} className="mt-1 text-end text-sm text-slate-600 dark:text-slate-400">{text.length} / 1000</p>
            </div>
            <button type="submit" className={`${primary} w-full`}><Send aria-hidden className="h-4 w-4" />{tx("Post comment")}</button>
          </form>
        </div>
      </div>
    </section>
  );
}

// ---------- 4 · FAQ ----------

function ServiceFaq({ service }: { service: string }) {
  const tx = useT();
  const s = extrasFor(service, tx);
  return (
    <section aria-labelledby="svc-faq" className={wrap}>
      <p className={kicker}>{tx("FAQ")}</p>
      <h2 id="svc-faq" className={h2}>{tx("{0} questions", { 0: s.name })}</h2>
      <div className={`${tx.tr(card)} mt-8 max-w-3xl divide-y divide-slate-200 dark:divide-white/10`}>
        {s.faq.map((f) => (
          <details key={f.q} className="group p-5 [&_summary::-webkit-details-marker]:hidden">
            <summary className={`flex cursor-pointer list-none items-center justify-between gap-4 rounded-lg text-[17px] font-semibold text-slate-900 dark:text-white ${ring}`}>
              {f.q}<ChevronRight aria-hidden className="h-5 w-5 shrink-0 text-slate-500 transition group-open:rotate-90 rtl:rotate-180 rtl:group-open:rotate-90" />
            </summary>
            <p className="mt-3 text-[15px] leading-7 text-slate-700 dark:text-slate-300">{f.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

// ---------- 5 · Blog ----------

function RelatedPosts({ service }: { service: string }) {
  const tx = useT();
  const s = extrasFor(service, tx);
  const posts = [...tx.tr(archive).filter((p) => p.cat === s.blogCat), ...tx.tr(archive).filter((p) => p.cat === "guides")].slice(0, 3);
  const topic = tx.tr(blogCats).find((c) => c.id === s.blogCat)!.label;
  return (
    <section aria-labelledby="svc-blog" className={wrap}>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div><p className={kicker}>{tx("Blog")}</p><h2 id="svc-blog" className={h2}>{tx("Read more about")}{" "}{s.name}</h2></div>
        <Link href={`/blog?topic=${s.blogCat}`} className={`${secondary} py-2.5`}>{tx("All {0} articles", { 0: topic })}<ArrowRight aria-hidden className="h-4 w-4 rtl:rotate-180" /></Link>
      </div>
      <div className="mt-8 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">{posts.map((p) => <PostCard key={p.slug} p={p} />)}</div>
    </section>
  );
}
