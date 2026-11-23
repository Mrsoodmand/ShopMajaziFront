"use client";
import { useMemo, useState } from "react";
import Link from "@/i18n/Link";
import { ArrowLeft, BadgeCheck, CreditCard, Headphones, Layers, MapPin, MessageCircle, ShieldCheck, Sparkles, Smartphone, Apple, Send, Users } from "lucide-react";
import { useT } from "@/i18n/client";
import { faqCategories, faqs, type Faq } from "@/content/faq-en";
import { aboutFacts, aboutStory, aboutTimeline, aboutValues, contactTopics } from "@/content/info-en";
import { PageShell } from "../otp/parts";
import Item from "../faq/Item";
import FaqSchema from "../faq/FaqSchema";
import { ring } from "../googleVoice/clean";
import { ChannelRow, ContactForm, Mark, OfficeCard, PageHead, SearchBox, StillStuck, btn, card, eyebrow, h1, inLanguage, lead, useChannels } from "./parts";

// Page offers for /contact-us, /faq and /about-us. Each section in the gallery: page-contact, page-faq, page-about.

const wrap = "mx-auto max-w-6xl px-4 pb-24 pt-10 sm:px-6 sm:pt-16";

/* ───────────── Contact us ───────────── */

// A — Channels First: three big ways to reach us, then the form beside the office card.
function ContactAInner() {
  const tx = useT();
  const ch = useChannels();
  return (
    <PageShell>
      <div className={wrap}>
        <PageHead kicker="Contact us" title="We're here, ask us anything." text="Pick whichever way suits you. A real person reads every message and answers as soon as possible." />
        <div className="mt-10 grid gap-4 sm:grid-cols-3">{ch.map((c, i) => <div key={c.id} className="animate-fade-up" style={{ animationDelay: `${120 + i * 80}ms` }}><ChannelRow c={c} big /></div>)}</div>
        <div className="mt-12 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
          <section className={`${card} p-6 sm:p-8`}>
            <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-white">{tx("Or leave us a message")}</h2>
            <p className="mt-1 mb-6 text-slate-600 dark:text-slate-400">{tx("We'll call or email you back.")}</p>
            <ContactForm />
          </section>
          <OfficeCard className="h-fit" />
        </div>
      </div>
    </PageShell>
  );
}

// B — Split Form: the form is the page; channels and office sit in a sticky column beside it.
function ContactBInner({ live = false }: { live?: boolean }) {
  const tx = useT();
  const ch = useChannels();
  return (
    <PageShell>
      <div className={wrap}>
        <div className="grid gap-10 lg:grid-cols-[1fr_1.25fr] lg:gap-14">
          <div className="lg:sticky lg:top-24 lg:h-fit">
            <PageHead kicker="Contact us" title="Glad you got in touch." text="Write to us about an order, a payment or anything else. Or use one of these if it's quicker for you." />
            <div className="mt-8 space-y-3">{ch.map((c) => <ChannelRow key={c.id} c={c} />)}</div>
            <OfficeCard className="mt-3 !rounded-2xl !p-4" />
          </div>
          <section className={`${card} animate-fade-up p-6 sm:p-8 [animation-delay:120ms]`}>
            <h2 className="mb-6 font-display text-2xl font-bold text-slate-900 dark:text-white">{tx("Send us a message")}</h2>
            <ContactForm live={live} />
          </section>
        </div>
      </div>
    </PageShell>
  );
}

// C — Help Desk: pick a topic first; its common answers show up, and the form sits underneath for anything left.
function ContactCInner() {
  const tx = useT();
  const ch = useChannels();
  const [topic, setTopic] = useState(contactTopics[0].id);
  const t = contactTopics.find((x) => x.id === topic)!;
  const answers = tx.tr(faqs).filter((f) => f.cat === t.faqCat).slice(0, 3);
  const [open, setOpen] = useState<string | null>(null);
  return (
    <PageShell>
      <div className="mx-auto max-w-4xl px-4 pb-24 pt-10 sm:px-6 sm:pt-16">
        <PageHead center kicker="Contact us" title="How can we help you?" text="Choose a topic; maybe the answer is already here. If not, the form is right below." />
        <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {contactTopics.map((x) => (
            <button key={x.id} type="button" aria-pressed={topic === x.id} onClick={() => { setTopic(x.id); setOpen(null); }}
              className={`flex flex-col items-center gap-3 rounded-2xl border-2 p-5 text-center transition ${topic === x.id ? "border-indigo-600 bg-white shadow-lg shadow-indigo-100/60 dark:border-indigo-400 dark:bg-[#0E1424] dark:shadow-black/30" : "border-slate-200 bg-white/60 hover:border-slate-400 dark:border-white/10 dark:bg-white/[0.03]"} ${ring}`}>
              <x.icon aria-hidden className={`h-6 w-6 ${topic === x.id ? "text-indigo-600 dark:text-indigo-400" : "text-slate-500"}`} />
              <span className="text-sm font-semibold text-slate-900 dark:text-white">{tx(x.label)}</span>
            </button>
          ))}
        </div>
        <div key={topic} className="mt-8 animate-fade-up space-y-3 [animation-duration:350ms]">
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">{tx("Common answers")}</p>
          {answers.map((f) => <Item key={f.id} id={`c-${f.id}`} q={f.q} a={f.a} boxed open={open === f.id} onToggle={() => setOpen(open === f.id ? null : f.id)} />)}
        </div>
        <section className={`${card} mt-10 p-6 sm:p-8`}>
          <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-white">{tx("Still need us?")}</h2>
          <p className="mt-1 mb-6 text-slate-600 dark:text-slate-400">{tx("Write it here and we'll take it from there.")}</p>
          <ContactForm topic={topic} />
        </section>
        <div className="mt-6 grid gap-3 sm:grid-cols-3">{ch.map((c) => <ChannelRow key={c.id} c={c} />)}</div>
      </div>
    </PageShell>
  );
}

/* ───────────── FAQ ───────────── */

const catIcon: Record<string, typeof Layers> = { general: Layers, numbers: Smartphone, apple: Apple, subs: Sparkles, telegram: Send, social: Users, payments: CreditCard };

function useFaqSearch() {
  const tx = useT();
  const [q, setQ] = useState("");
  const all = tx.tr(faqs);
  const hits = useMemo(() => {
    const w = q.trim().toLowerCase();
    return w.length < 2 ? all : all.filter((f) => f.q.toLowerCase().includes(w) || f.a.toLowerCase().includes(w));
  }, [q, all]);
  return { q, setQ, all, hits, cats: tx.tr(faqCategories) };
}

function NoHits({ q }: { q: string }) {
  const tx = useT();
  return <p className={`${card} p-8 text-center text-slate-600 dark:text-slate-400`}>{tx("Nothing matches «{0}». Try another word, or ask us directly.", { 0: q })}</p>;
}

// A — Search + Groups: a big search box, topic chips that jump down, every question grouped by topic.
function FaqPageAInner() {
  const tx = useT();
  const { q, setQ, hits, cats } = useFaqSearch();
  const [open, setOpen] = useState<string | null>(null);
  const groups = cats.map((c) => ({ c, list: hits.filter((f) => f.cat === c.id) })).filter((g) => g.list.length);
  return (
    <PageShell>
      <FaqSchema />
      <div className="mx-auto max-w-3xl px-4 pb-24 pt-10 sm:px-6 sm:pt-16">
        <PageHead center kicker="FAQ" title="Questions you may have" text="Short, clear answers about buying, delivery, payment and refunds." />
        <SearchBox big q={q} setQ={setQ} />
        {!q && (
          <nav aria-label={tx("Topics")} className="mt-6 flex flex-wrap justify-center gap-2">
            {cats.map((c) => <a key={c.id} href={`#faq-${c.id}`} className={`rounded-full border border-slate-300 px-3.5 py-1.5 text-sm text-slate-700 transition hover:border-slate-500 dark:border-white/20 dark:text-slate-300 ${ring}`}>{c.label}</a>)}
          </nav>
        )}
        <div className="mt-12 space-y-12">
          {groups.length === 0 && <NoHits q={q} />}
          {groups.map(({ c, list }) => (
            <section key={c.id} id={`faq-${c.id}`} className="scroll-mt-24">
              <h2 className="font-display text-xl font-bold text-slate-900 dark:text-white">{c.label}</h2>
              <div className="mt-2">{list.map((f) => <Item key={f.id} id={`a-${f.id}`} q={<Mark text={f.q} q={q} />} a={<Mark text={f.a} q={q} />} open={open === f.id || q.trim().length >= 2} onToggle={() => setOpen(open === f.id ? null : f.id)} />)}</div>
            </section>
          ))}
        </div>
        <StillStuck />
      </div>
    </PageShell>
  );
}

// B — Help Center: topic cards with a count; choosing one shows its questions as boxed accordions.
function FaqPageBInner() {
  const tx = useT();
  const { q, setQ, all, hits, cats } = useFaqSearch();
  const [cat, setCat] = useState(cats[0].id);
  const [open, setOpen] = useState<string | null>(null);
  const searching = q.trim().length >= 2;
  const list: Faq[] = searching ? hits : all.filter((f) => f.cat === cat);
  return (
    <PageShell>
      <FaqSchema />
      <div className={wrap}>
        <div className="rounded-[2rem] bg-gradient-to-b from-indigo-50 to-transparent px-4 pb-4 pt-10 dark:from-indigo-500/10">
          <PageHead center kicker="Help center" title="How can we help you today?" />
          <SearchBox big q={q} setQ={setQ} />
        </div>
        {!searching && (
          <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
            {cats.map((c) => {
              const Icon = catIcon[c.id] ?? Layers;
              const on = c.id === cat;
              return (
                <button key={c.id} type="button" aria-pressed={on} onClick={() => { setCat(c.id); setOpen(null); }}
                  className={`flex flex-col items-start gap-3 rounded-2xl border-2 p-4 text-start transition ${on ? "border-indigo-600 bg-white dark:border-indigo-400 dark:bg-[#0E1424]" : "border-transparent bg-white/70 ring-1 ring-slate-200 hover:ring-slate-400 dark:bg-white/[0.03] dark:ring-white/10"} ${ring}`}>
                  <span className={`grid h-10 w-10 place-items-center rounded-xl ${on ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-600 dark:bg-white/10 dark:text-slate-300"}`}><Icon aria-hidden className="h-5 w-5" /></span>
                  <span className="text-sm font-semibold leading-5 text-slate-900 dark:text-white">{c.label}</span>
                  <span className="text-xs text-slate-500">{tx("Questions: {0}", { 0: all.filter((f) => f.cat === c.id).length })}</span>
                </button>
              );
            })}
          </div>
        )}
        <div key={searching ? "s" : cat} className="mx-auto mt-10 max-w-3xl animate-fade-up space-y-3 [animation-duration:350ms]">
          {list.length === 0 && <NoHits q={q} />}
          {list.map((f) => <Item key={f.id} id={`b-${f.id}`} boxed q={<Mark text={f.q} q={q} />} a={<Mark text={f.a} q={q} />} open={open === f.id} onToggle={() => setOpen(open === f.id ? null : f.id)} />)}
        </div>
        <div className="mx-auto max-w-3xl"><StillStuck /></div>
      </div>
    </PageShell>
  );
}

// C — Side Index: a sticky topic list with search on the side (chips on phones), all answers open-able on the right.
function FaqPageCInner() {
  const tx = useT();
  const { q, setQ, hits, cats } = useFaqSearch();
  const [cat, setCat] = useState<string>("all");
  const [open, setOpen] = useState<string | null>(null);
  const list = cat === "all" || q.trim().length >= 2 ? hits : hits.filter((f) => f.cat === cat);
  const opts = [{ id: "all", label: tx("All questions") }, ...cats];
  return (
    <PageShell>
      <FaqSchema />
      <div className={wrap}>
        <PageHead kicker="FAQ" title="Good questions, straight answers." />
        <div className="mt-10 grid gap-8 lg:grid-cols-[260px_1fr]">
          <aside className="lg:sticky lg:top-24 lg:h-fit">
            <SearchBox q={q} setQ={setQ} />
            <nav aria-label={tx("Topics")} className="mt-4 flex gap-2 overflow-x-auto [scrollbar-width:none] lg:flex-col lg:gap-1">
              {opts.map((c) => {
                const Icon = c.id === "all" ? MessageCircle : catIcon[c.id] ?? Layers;
                const on = cat === c.id;
                return (
                  <button key={c.id} type="button" aria-pressed={on} onClick={() => { setCat(c.id); setOpen(null); }}
                    className={`flex shrink-0 items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition lg:w-full ${on ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900" : "text-slate-600 hover:bg-white dark:text-slate-400 dark:hover:bg-white/5"} ${ring}`}>
                    <Icon aria-hidden className="h-4 w-4" />{c.label}
                  </button>
                );
              })}
            </nav>
            <div className={`${card} mt-6 hidden p-5 lg:block`}>
              <Headphones aria-hidden className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
              <p className="mt-3 font-display font-semibold text-slate-900 dark:text-white">{tx("Didn't find your answer?")}</p>
              <Link href="/contact-us" className={`mt-3 inline-flex items-center gap-1 text-sm font-semibold text-indigo-600 dark:text-indigo-400 ${ring}`}>{tx("Contact us")}<ArrowLeft aria-hidden className="h-4 w-4 ltr:rotate-180" /></Link>
            </div>
          </aside>
          <div key={cat} className={`${card} animate-fade-up px-5 sm:px-8 [animation-duration:350ms]`}>
            {list.length === 0 ? <div className="py-8"><NoHits q={q} /></div> : list.map((f) => <Item key={f.id} id={`s-${f.id}`} q={<Mark text={f.q} q={q} />} a={<Mark text={f.a} q={q} />} open={open === f.id} onToggle={() => setOpen(open === f.id ? null : f.id)} />)}
          </div>
        </div>
        <div className="lg:hidden"><StillStuck /></div>
      </div>
    </PageShell>
  );
}

/* ───────────── About us ───────────── */

function TrustBadge() {
  const tx = useT();
  return (
    <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-sm font-medium text-emerald-700 ring-1 ring-emerald-200 dark:bg-emerald-400/10 dark:text-emerald-300 dark:ring-emerald-400/30">
      <ShieldCheck aria-hidden className="h-4 w-4" />{tx("Enamad trust badge")}
    </span>
  );
}

function AboutCta() {
  const tx = useT();
  return (
    <div className="mt-16 flex flex-wrap items-center gap-3">
      <Link href="/" className={btn}>{tx("See our services")}</Link>
      <Link href="/contact-us" className={`inline-flex items-center gap-2 rounded-xl border border-slate-300 px-5 py-3 font-semibold text-slate-800 transition hover:border-slate-500 dark:border-white/20 dark:text-white ${ring}`}>{tx("Contact us")}</Link>
    </div>
  );
}

// A — Story Column: a calm reading column; three facts in a row, then what we care about.
function AboutAInner() {
  const tx = useT();
  return (
    <PageShell>
      <div className="mx-auto max-w-3xl px-4 pb-24 pt-10 sm:px-6 sm:pt-16">
        <PageHead kicker="About us" title="We bring the world's services to you, without the hassle." ><div className="mt-5"><TrustBadge /></div></PageHead>
        <div className="mt-10 space-y-5 text-lg leading-9 text-slate-700 dark:text-slate-300">{aboutStory.map((p, i) => <p key={i} className="animate-fade-up" style={{ animationDelay: `${100 + i * 90}ms` }}>{tx(p)}</p>)}</div>
        <dl className="mt-12 grid grid-cols-3 divide-x divide-slate-200 rounded-3xl border border-slate-200 bg-white py-6 rtl:divide-x-reverse dark:divide-white/10 dark:border-white/10 dark:bg-[#0E1424]">
          {aboutFacts.map((f) => (
            <div key={f.label} className="px-3 text-center">
              <dt className="sr-only">{tx(f.label)}</dt>
              <dd className="font-display text-2xl font-bold text-indigo-600 sm:text-4xl dark:text-indigo-400">{tx(f.value)}</dd>
              <dd aria-hidden className="mt-1 text-xs text-slate-500 sm:text-sm dark:text-slate-400">{tx(f.label)}</dd>
            </div>
          ))}
        </dl>
        <h2 className="mt-16 font-display text-2xl font-bold text-slate-900 dark:text-white">{tx("What we care about")}</h2>
        <div className="mt-6 space-y-6">
          {aboutValues.map((v, i) => (
            <div key={v.title} className="flex gap-4">
              <span className="font-mono text-sm text-indigo-600 dark:text-indigo-400">{String(i + 1).padStart(2, "0")}</span>
              <div><p className="font-display font-semibold text-slate-900 dark:text-white">{tx(v.title)}</p><p className="mt-1 text-slate-600 dark:text-slate-400">{tx(v.text)}</p></div>
            </div>
          ))}
        </div>
        <AboutCta />
      </div>
    </PageShell>
  );
}

// B — Bento: the story and the proof as tiles (year, delivered, Enamad, office, support), values below.
function AboutBInner() {
  const tx = useT();
  const tile = `${card} p-6`;
  return (
    <PageShell>
      <div className={wrap}>
        <PageHead kicker="About us" title="Hi, we're ShopMajazi." text={aboutStory[0]} />
        <div className="mt-10 grid gap-4 md:grid-cols-4 md:grid-rows-2">
          <div className="relative overflow-hidden rounded-3xl bg-indigo-600 p-7 text-white md:col-span-2 md:row-span-2">
            <div aria-hidden className="absolute -bottom-16 -end-16 h-64 w-64 rounded-full bg-white/10 animate-drift" />
            <p className="relative font-display text-2xl font-bold leading-snug">{tx("Sanctions closed the doors. We find the ones that still open.")}</p>
            <p className="relative mt-4 leading-8 text-indigo-100">{tx(aboutStory[1])}</p>
          </div>
          <div className={`${tile} md:col-span-1`}><p className="font-display text-4xl font-bold text-slate-900 dark:text-white">{tx("50,000+")}</p><p className="mt-2 text-slate-600 dark:text-slate-400">{tx("Subscriptions delivered")}</p></div>
          <div className={`${tile} md:col-span-1`}><p className="font-display text-4xl font-bold text-slate-900 dark:text-white">{tx("1400")}</p><p className="mt-2 text-slate-600 dark:text-slate-400">{tx("The year we started")}</p></div>
          <div className={`${tile} md:col-span-1`}><BadgeCheck aria-hidden className="h-8 w-8 text-emerald-600 dark:text-emerald-400" /><p className="mt-3 font-display font-semibold text-slate-900 dark:text-white">{tx("Enamad trust badge")}</p><p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{tx("From the Ministry of Industry, Mine and Trade")}</p></div>
          <div className={`${tile} md:col-span-1`}><MapPin aria-hidden className="h-8 w-8 text-indigo-600 dark:text-indigo-400" /><p className="mt-3 font-display font-semibold text-slate-900 dark:text-white">{tx("Mashhad, Iran")}</p><p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{tx("Paj 1 office tower, Mashhad")}</p></div>
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {aboutValues.map((v) => <div key={v.title} className={tile}><p className="font-display font-semibold text-slate-900 dark:text-white">{tx(v.title)}</p><p className="mt-2 text-slate-600 dark:text-slate-400">{tx(v.text)}</p></div>)}
        </div>
        <AboutCta />
      </div>
    </PageShell>
  );
}

// C — Timeline: how we got here, as a vertical line of four moments that light up in turn; facts at the side.
function AboutCInner() {
  const tx = useT();
  const [lit, setLit] = useState(aboutTimeline.length - 1);
  return (
    <PageShell>
      <div className={wrap}>
        <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr]">
          <div className="lg:sticky lg:top-24 lg:h-fit">
            <PageHead kicker="About us" title="Our story, in four steps." text={aboutStory[2]} />
            <div className="mt-6"><TrustBadge /></div>
            <dl className="mt-8 grid grid-cols-3 gap-3">
              {aboutFacts.map((f) => <div key={f.label} className={`${card} !rounded-2xl p-4`}><dd className="font-display text-xl font-bold text-slate-900 dark:text-white">{tx(f.value)}</dd><dt className="mt-1 text-xs text-slate-500 dark:text-slate-400">{tx(f.label)}</dt></div>)}
            </dl>
          </div>
          <ol className="relative space-y-4 border-s-2 border-slate-200 ps-8 dark:border-white/10">
            {aboutTimeline.map((s, i) => {
              const on = i <= lit;
              return (
                <li key={s.when} onMouseEnter={() => setLit(i)} className="relative">
                  <span aria-hidden className={`absolute -start-[41px] top-6 h-4 w-4 rounded-full ring-4 ring-[#F5F6FB] transition dark:ring-[#070B14] ${on ? "bg-indigo-600 dark:bg-indigo-400" : "bg-slate-300 dark:bg-slate-600"}`} />
                  <div className={`${card} p-6 transition ${on ? "" : "opacity-60"}`}>
                    <p className={`${eyebrow} !text-xs`}>{tx(s.when)}</p>
                    <p className="mt-2 text-lg leading-8 text-slate-800 dark:text-slate-200">{tx(s.text)}</p>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
        <h2 className={`mt-20 text-center ${h1} !text-3xl`}>{tx("What we care about")}</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {aboutValues.map((v) => <div key={v.title} className={`${card} p-6`}><p className="font-display font-semibold text-slate-900 dark:text-white">{tx(v.title)}</p><p className={`!mt-2 !text-base ${lead}`}>{tx(v.text)}</p></div>)}
        </div>
        <div className="flex justify-center"><AboutCta /></div>
      </div>
    </PageShell>
  );
}

export const ContactA = inLanguage(ContactAInner);
export const ContactB = inLanguage(() => <ContactBInner />); // gallery: the form only previews
export const ContactBLive = ContactBInner; // /contact-us: the form posts to the backend
export const ContactC = inLanguage(ContactCInner);
export const FaqPageA = inLanguage(FaqPageAInner);
export const FaqPageB = inLanguage(FaqPageBInner);
export const FaqPageC = inLanguage(FaqPageCInner);
export const AboutA = inLanguage(AboutAInner);
export const AboutB = inLanguage(AboutBInner);
export const AboutC = inLanguage(AboutCInner);
