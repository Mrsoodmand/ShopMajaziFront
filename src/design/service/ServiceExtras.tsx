"use client";

import { useEffect, useId, useRef, useState, type CSSProperties } from "react";
import Link from "@/i18n/Link";
import { ArrowRight, BadgeCheck, ChevronDown, ChevronLeft, ChevronRight, Clock, Mail, MessageCircle, MessageSquare, Plus, Send } from "lucide-react";
import { blogCats, type Post } from "@/content/blog-en";
import { supportEmail } from "@/content/footer-en";
import { archive } from "@/content/blog-list-en";
import type { ServiceComment } from "@/content/service-extras-en";
import { useServiceExtras } from "../subs/live";
import { field, primary, ring, secondary } from "../googleVoice/clean";
import { PostCard } from "../blogList/parts";
import { useT } from "@/i18n/client";
import { CAPTCHA_MESSAGES, CaptchaField, useCaptcha } from "@/lib/captcha";
import HowToSteps from "./HowToSteps";
import { useSwipeRow } from "@/components/ui/useSwipeRow";
import SwipeDots from "@/components/ui/SwipeDots";
import { useGlow } from "./slot";
import type { GlowTone } from "./HeaderGlow";
import fq from "./faq.module.css";
import { FaqC } from "./faqOffers";

// The sections every service page ends with, in this order: how to use, content area, comments, FAQ (faqOffers › C), blog.
// `service` is a key from service-extras (or "subs:{slug}" for a subscription's page). `posts`: the live posts for the
// blog section (LiveServiceExtras); without them (the /design pages) it shows placeholder posts.
// Rendered at the end of the page design through the extras slot (see slot.tsx). Accessible throughout: real
// headings, ordered steps, a disclosure that keeps the full article in the HTML, labelled comment form with errors
// tied to fields, native <details> for the FAQ, and FAQ structured data for search results.

const wrap = "mx-auto max-w-6xl px-4 sm:px-6";
const kicker = "text-sm font-semibold uppercase tracking-widest text-emerald-800 dark:text-emerald-300";
const h2 = "mt-2 font-display text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-white";
const card = "rounded-3xl border border-slate-200 bg-white dark:border-white/15 dark:bg-[#0E1424]";

// `comments`: the page's real comments and the key new ones are posted under (LiveServiceExtras). Without it (the
// /design previews) the placeholder comments are shown and the form only pretends to send.
export type LiveComments = { key: string | null; list: ServiceComment[] };

// `omit`: the page design shows the comments and FAQ itself (subscription pages put them in tabs, subSingle/tabs.tsx),
// so they are left out here; the FAQ structured data stays.
// `rule`: the hairline above the block; a subscription's own page goes without it.
export default function ServiceExtras({ service, posts, comments, omit = false, rule = true }: { service: string; posts?: Post[]; comments?: LiveComments; omit?: boolean; rule?: boolean }) {
  const tx = useT();
  const s = useServiceExtras(service);
  return (
    <div className={`space-y-24 pb-24 ${rule ? "border-t border-slate-200 pt-20 dark:border-white/10" : "pt-10"}`}>
      <HowToUse service={service} />
      <ContentArea service={service} />
      {!omit && <Comments key={service} service={service} live={comments} />}
      {/* FAQ: offer C "Index & Answer" (chosen at /design/service-faq); ServiceFaq below is the earlier design. */}
      {!omit && <FaqC service={service} />}
      <RelatedPosts service={service} live={posts} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org", "@type": "FAQPage",
        mainEntity: s.faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
      }).replace(/</g, "\\u003c") }} />
    </div>
  );
}

// ---------- 1 · How to use ----------
// The steps come into focus one by one as they scroll into view (motion E, /design/steps-motion), their big numbers
// roll up into place and the progress bars fill (card animation D, /design/steps-detail), and the numbers and bars keep
// replaying that on a loop while the steps are on screen (`repeat`). On virtual numbers the steps are walked through
// instead: each lights up in turn while its bar fills, then is ticked off (card animation F, "journey"; it ignores
// `repeat`).

const journeySteps = new Set(["virtual-number"]);

function HowToUse({ service }: { service: string }) {
  return <HowToSteps service={service} motion="e" detail={journeySteps.has(service) ? "journey" : "roll"} repeat />;
}

// ---------- 2 · Content area ----------

function ContentArea({ service }: { service: string }) {
  const tx = useT();
  const s = useServiceExtras(service);
  const [open, setOpen] = useState(false);
  // Only fold (and offer "Read the full guide") when the article is taller than the folded height.
  const FOLD = 420;
  const article = useRef<HTMLElement>(null);
  const [long, setLong] = useState(true);
  // Opened, the box grows to the article's own height (long admin articles run far past a fixed cap).
  const [full, setFull] = useState(4000);
  useEffect(() => {
    const el = article.current;
    if (!el) return;
    const check = () => { setLong(el.scrollHeight > FOLD + 40); setFull(el.scrollHeight); };
    check();
    const ro = new ResizeObserver(check);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const folded = long && !open;
  const fade = "linear-gradient(to bottom, #000 calc(100% - 8rem), transparent)";
  const bodyId = useId();
  // The "On this page" entry for the section being read: the last section whose top has passed a line just under the
  // sticky header. Sections clipped away by the fold don't count.
  const [active, setActive] = useState(s.content[0]?.id ?? "");
  const ids = s.content.map((c) => c.id).join("|");
  useEffect(() => {
    const body = document.getElementById(bodyId);
    if (!body || !ids) return;
    const list = ids.split("|");
    const LINE = 140;
    // A handful of rect reads per scroll event; cheap enough to run directly.
    const update = () => {
      const bottom = body.getBoundingClientRect().bottom;
      let cur = list[0];
      for (const id of list) {
        const top = document.getElementById(`${service}-${id}`)?.getBoundingClientRect().top;
        if (top !== undefined && top <= LINE && top < bottom) cur = id;
      }
      setActive(cur);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => { window.removeEventListener("scroll", update); window.removeEventListener("resize", update); };
  }, [bodyId, service, ids, open]);
  return (
    <section aria-labelledby="guide" className={wrap}>
      <p className={kicker}>{tx("Guide")}</p>
      <h2 id="guide" className={h2}>{tx("The {0} guide", { 0: s.name })}</h2>
      <div className="mt-8 grid gap-10 lg:grid-cols-[220px_minmax(0,1fr)]">
        <nav aria-label={tx("On this page")} className="hidden lg:block">
          <div className="sticky top-24">
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400">{tx("On this page")}</p>
            <ol className="mt-3 space-y-1 border-s border-slate-200 dark:border-white/10">
              {s.content.map((c) => {
                const on = active === c.id;
                return (
                  <li key={c.id}><a href={`#${service}-${c.id}`} onClick={() => { setOpen(true); setActive(c.id); }} aria-current={on ? "location" : undefined}
                    className={`-ms-px block border-s-2 py-1.5 ps-4 text-sm transition-colors ${on ? "border-emerald-700 font-semibold text-slate-900 dark:border-emerald-400 dark:text-white" : "border-transparent text-slate-600 hover:border-slate-400 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"} ${ring}`}>{c.title}</a></li>
                );
              })}
            </ol>
          </div>
        </nav>
        {/* The article sits on a solid card so long reading isn't done over the page's patterned backdrop. */}
        <div className={`${tx.tr(card)} p-5 shadow-sm sm:p-8 lg:p-10`}>
          {/* The whole article stays in the HTML; when folded it is clipped, not removed, so search engines read all of it.
              Folded, its last lines fade out through a mask (not a page-coloured overlay, so the page backdrop shows). */}
          <div id={bodyId} style={{ maxHeight: folded ? FOLD : full + 40, ...(folded ? { maskImage: fade, WebkitMaskImage: fade } : {}) }} className="relative overflow-hidden transition-[max-height] duration-500">
            <article ref={article} className="max-w-3xl space-y-10">
              {s.content.map((c) => (
                <section key={c.id} id={`${service}-${c.id}`} className="scroll-mt-24">
                  <h3 className="font-display text-xl font-bold text-slate-900 dark:text-white">{c.title}</h3>
                  {c.paragraphs.map((p, i) => <p key={i} className="mt-3 text-[17px] leading-8 text-slate-700 dark:text-slate-300">{p}</p>)}
                </section>
              ))}
            </article>
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
          <div>
            <p className="flex flex-wrap items-center gap-x-2 gap-y-1 font-semibold text-slate-900 dark:text-white">{c.name}
              {/* Written from the buyer's own delivered order, so shown as from someone who really bought it. */}
              {c.verified && <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-800 dark:bg-emerald-400/10 dark:text-emerald-300"><BadgeCheck aria-hidden className="h-3.5 w-3.5" />{tx("Verified buyer")}</span>}
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-400">{c.date}</p>
          </div>
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

// `embedded`: inside a page's tabs, without its own heading, the form under the list instead of beside it.
export function Comments({ service, live, embedded = false }: { service: string; live?: LiveComments; embedded?: boolean }) {
  const s = useServiceExtras(service);
  return <CommentsBlock about={s.name} placeholder={s.comments} live={live} embedded={embedded} />;
}

// The comments section for any page: `about` is what the comments are about (the heading), `placeholder` the comments
// shown when there is no `live` data (the /design previews). Blog posts use it directly (blogPost/parts › PostComments).
export function CommentsBlock({ about, placeholder, live, embedded = false }: { about: string; placeholder: ServiceComment[]; live?: LiveComments; embedded?: boolean }) {
  const tx = useT();
  const [shown, setShown] = useState(PAGE);
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [tried, setTried] = useState(false);
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [failed, setFailed] = useState("");
  const [website, setWebsite] = useState(""); // honeypot: hidden from people, bots fill it in
  const captcha = useCaptcha("comment"); // admin › Captcha; checked by the backend
  const nId = useId(), tId = useId();
  const errName = tried && !name.trim() ? tx("Enter your name") : "";
  const errText = tried && text.trim().length < 10 ? (text.trim() ? tx("Write at least 10 characters") : tx("Write your comment")) : "";
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setTried(true);
    if (!name.trim()) return document.getElementById(nId)?.focus();
    if (text.trim().length < 10) return document.getElementById(tId)?.focus();
    if (!live) { setSent(true); setName(""); setText(""); setTried(false); return; }
    if (!live.key) return;
    setSending(true); setFailed("");
    // Saved as pending in the backend; it appears here once the admin approves it.
    captcha.fields()
      .then((extra) => fetch("/api/v1/storefront/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ key: live.key, name: name.trim(), text: text.trim(), website, ...extra }),
      }))
      .then(async (r) => {
        const body = await r.json().catch(() => null) as { success?: boolean; message?: string; code?: string; data?: Record<string, unknown> | null } | null;
        if (r.ok && body?.success) { setSent(true); setName(""); setText(""); setTried(false); captcha.used(); }
        else if (captcha.handle(body?.code, body?.data)) setFailed(tx(CAPTCHA_MESSAGES[body!.code!]));
        else {
          captcha.used(); // a number picture is good for one try
          setFailed(r.status === 429 ? tx("Too many comments in a short time. Please try again in a minute.") : body?.message || tx("Your comment couldn't be sent. Please try again."));
        }
      })
      .catch(() => setFailed(tx("Your comment couldn't be sent. Please try again.")))
      .finally(() => setSending(false));
  };
  const list = live ? live.list : placeholder;
  const total = list.length;

  const body = (
      <div className={embedded ? "space-y-8" : "mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_380px]"}>
        <div>
          {/* Empty: an invitation card that fills the column beside the form instead of one lonely line. */}
          {total === 0 && (
            <div className="flex h-full min-h-64 flex-col items-center justify-center gap-2 rounded-3xl border-2 border-dashed border-slate-300 px-6 py-10 text-center dark:border-white/15">
              <span aria-hidden className="grid h-12 w-12 place-items-center rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-400/15 dark:text-emerald-300"><MessageCircle className="h-6 w-6" /></span>
              <p className="mt-2 font-display text-lg font-semibold text-slate-900 dark:text-white">{tx("Be the first to comment")}</p>
              <p className="max-w-sm text-[15px] leading-7 text-slate-600 dark:text-slate-400">{tx("Ask a question or share how your order went; our team replies here.")}</p>
              <p className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-emerald-800 dark:text-emerald-300"><Clock aria-hidden className="h-4 w-4" />{tx("We usually reply within a few hours")}</p>
            </div>
          )}
          <ul className="space-y-4">{list.slice(0, shown).map((c) => <CommentItem key={c.id} c={c} />)}</ul>
          {shown < total && <button onClick={() => setShown(shown + PAGE)} className={`${secondary} mt-5`}>{tx("Show more comments (")}{total - shown})</button>}
        </div>

        <div className={`${tx.tr(card)} h-fit p-6 ${embedded ? "" : "lg:sticky lg:top-24"}`}>
          <h3 className="flex items-center gap-2 font-display text-lg font-semibold text-slate-900 dark:text-white"><MessageSquare aria-hidden className="h-5 w-5" />{tx("Leave a comment")}</h3>
          <p aria-live="polite" className="mt-2 text-[15px] text-emerald-800 dark:text-emerald-300">{sent && tx("Thanks! Your comment will appear after a quick review.")}</p>
          {failed && <p role="alert" className="mt-2 text-[15px] font-semibold text-red-700 dark:text-red-400">{failed}</p>}
          <form noValidate onSubmit={submit} className="relative mt-2 space-y-5">
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
            <CaptchaField captcha={captcha} />
            <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden value={website} onChange={(e) => setWebsite(e.target.value)} className="pointer-events-none absolute start-0 top-0 h-px w-px overflow-hidden opacity-0 [clip-path:inset(50%)]" />
            <button type="submit" disabled={sending} className={`${primary} w-full disabled:opacity-60`}><Send aria-hidden className="h-4 w-4" />{tx(sending ? "Sending…" : "Post comment")}</button>
          </form>
        </div>
      </div>
  );
  if (embedded) return body;
  return (
    <section aria-labelledby="comments" className={wrap}>
      <p className={kicker}>{tx("Comments")}</p>
      <h2 id="comments" className={h2}>{total > 0 ? <>{total} {tx(total === 1 ? "comment" : "comments")}{" "}{tx("on")}{" "}{about}</> : tx("Comments on {0}", { 0: about })}</h2>
      {body}
    </section>
  );
}

// ---------- 4 · FAQ ----------
// Wide screens: the heading, a short line and a support card on the start side, the questions beside them. Phones
// stack heading, questions, then the support card. Each question is its own card (native <details>, see
// faq.module.css), all in one group so opening one closes the one before; the first starts open, to show that the
// answers are right here. Accents follow the page's colour (its header glow; brand indigo where there is none).

const faqTone: Record<GlowTone, [string, string]> = {
  violet: ["#7c3aed", "#c4b5fd"], emerald: ["#059669", "#6ee7b7"], amber: ["#d97706", "#fcd34d"], sky: ["#0284c7", "#7dd3fc"], rose: ["#db2777", "#f9a8d4"],
};

export function ServiceFaq({ service }: { service: string }) {
  const tx = useT();
  const s = useServiceExtras(service);
  const glow = useGlow();
  const [tone, toneDark] = glow ? faqTone[glow] : ["#4f46e5", "#a5b4fc"];
  return (
    <section aria-labelledby="svc-faq" className={`${wrap} ${fq.faq}`} style={{ "--tone": tone, "--tone-d": toneDark } as CSSProperties}>
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)] lg:grid-rows-[auto_1fr] lg:gap-x-16">
        <div className="lg:col-start-1 lg:row-start-1">
          <p className={kicker}>{tx("FAQ")}</p>
          <h2 id="svc-faq" className={h2}>{tx("{0} questions", { 0: s.name })}</h2>
          <p className="mt-4 max-w-sm text-pretty text-[15px] leading-7 text-slate-600 dark:text-slate-400">{tx("Short answers to what buyers ask most about {0}.", { 0: s.name })}</p>
        </div>

        <div className="space-y-3 lg:col-start-2 lg:row-span-2 lg:row-start-1">
          {s.faq.map((f, i) => (
            <details key={f.q} name={`faq-${service}`} open={i === 0}
              className={`${fq.item} rounded-2xl border border-slate-200 bg-white dark:border-white/10 dark:bg-[#0E1424] [&_summary::-webkit-details-marker]:hidden`}>
              <summary className={`flex cursor-pointer list-none items-center justify-between gap-4 rounded-2xl px-5 py-4 text-base font-semibold leading-7 text-slate-900 sm:px-6 sm:py-5 sm:text-[17px] dark:text-white ${ring}`}>
                <span>{f.q}</span>
                <span aria-hidden className={`${fq.icon} grid h-8 w-8 shrink-0 place-items-center rounded-full bg-slate-100 text-slate-600 dark:bg-white/10 dark:text-slate-300`}><Plus className="h-4 w-4" /></span>
              </summary>
              <div className={fq.answer}>
                <p className="max-w-[65ch] px-5 pb-5 text-[15px] leading-7 text-slate-700 sm:px-6 sm:pb-6 dark:text-slate-300">{f.a}</p>
              </div>
            </details>
          ))}
        </div>

        <div className={`${tx.tr(card)} p-6 lg:col-start-1 lg:row-start-2 lg:self-start`}>
          <span aria-hidden className={`${fq.tile} grid h-11 w-11 place-items-center rounded-2xl`}><MessageCircle className="h-5 w-5" /></span>
          <h3 className="mt-4 font-display text-lg font-semibold text-slate-900 dark:text-white">{tx("Still have a question?")}</h3>
          <p className="mt-1 text-[15px] leading-7 text-slate-600 dark:text-slate-400">{tx("Write to our support team; we reply around the clock.")}</p>
          <a href={`mailto:${supportEmail}`} className={`${secondary} mt-5 w-full px-4 py-3 text-[15px] sm:w-auto`}>
            <Mail aria-hidden className="h-4 w-4 shrink-0" /><span dir="ltr" className="truncate">{supportEmail}</span>
          </a>
        </div>
      </div>
    </section>
  );
}

// ---------- 5 · Blog ----------
// A swipe row like the home page's blog carousel (blog offer C): about three cards across on wide screens, one and a
// bit on phones (so the next card peeks in), arrows beside "All articles" and dots under the row on phones. Mouse
// drag, touch swipe and keyboard (the cards are links) all move it.

const RELATED = 8;

function RelatedPosts({ service, live }: { service: string; live?: Post[] }) {
  const tx = useT();
  const s = useServiceExtras(service);
  const posts = live ?? [...tx.tr(archive).filter((p) => p.cat === s.blogCat), ...tx.tr(archive).filter((p) => p.cat === "guides" && p.cat !== s.blogCat)].slice(0, RELATED);
  return <PostRow posts={posts} cat={s.blogCat} name={s.name} />;
}

// The swipe row itself, also used by the social platform pages (socialPlatform/parts.tsx › PlatformBelow).
export function PostRow({ posts, cat, name, className = "" }: { posts: Post[]; cat: Post["cat"]; name: string; className?: string }) {
  const tx = useT();
  const topic = tx.tr(blogCats).find((c) => c.id === cat)!.label;
  const { track, handlers, dragging, edges, index, count, nudge, go } = useSwipeRow();
  if (!posts.length) return null;
  const arrow = `grid h-11 w-11 place-items-center rounded-full ring-1 ring-slate-300 text-slate-700 transition hover:bg-slate-900 hover:text-white hover:ring-slate-900 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-inherit disabled:hover:ring-slate-300 dark:ring-white/15 dark:text-slate-200 dark:hover:bg-white dark:hover:text-slate-900 ${ring}`;
  const scrolls = !(edges.start && edges.end);
  return (
    <section aria-labelledby="svc-blog" className={`${className || wrap} overflow-x-clip`}>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div><p className={kicker}>{tx("Blog")}</p><h2 id="svc-blog" className={h2}>{tx("Read more about")}{" "}{name}</h2></div>
        <div className="flex items-center gap-2">
          {scrolls && <>
            <button type="button" onClick={() => nudge(-1)} disabled={edges.start} aria-label={tx("Previous articles")} className={`${arrow} hidden sm:grid`}><ChevronLeft aria-hidden className="h-5 w-5 rtl:rotate-180" /></button>
            <button type="button" onClick={() => nudge(1)} disabled={edges.end} aria-label={tx("Next articles")} className={`${arrow} hidden sm:grid`}><ChevronRight aria-hidden className="h-5 w-5 rtl:rotate-180" /></button>
          </>}
          <Link href={`/blog?topic=${cat}`} className={`${secondary} py-2.5 sm:ms-2`}>{tx("All {0} articles", { 0: topic })}<ArrowRight aria-hidden className="h-4 w-4 rtl:rotate-180" /></Link>
        </div>
      </div>
      <div ref={track} {...handlers}
        className={`-mx-4 mt-6 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-4 px-4 pb-8 pt-2 select-none [scrollbar-width:none] sm:-mx-6 sm:gap-5 sm:scroll-px-6 sm:px-6 [&::-webkit-scrollbar]:hidden ${scrolls ? (dragging ? "cursor-grabbing [&_a]:cursor-grabbing" : "cursor-grab") : ""}`}>
        {posts.map((p) => (
          <div key={p.slug} className="w-[84%] shrink-0 snap-start sm:w-[46%] lg:w-[calc((100%-2.5rem)/3)]"><PostCard p={p} /></div>
        ))}
      </div>
      <SwipeDots count={count} index={index} go={go} label={tx("Articles")} className="-mt-3 sm:hidden" />
    </section>
  );
}
