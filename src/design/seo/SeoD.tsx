import Link from "next/link";
import { Quote, Smartphone, Phone, Apple, Sparkles, Users, CalendarClock, ShieldCheck, type LucideIcon } from "lucide-react";
import { seoIntro, seoSections, type SeoSection } from "@/content/seo-en";
import Body from "./Body";

const icons: Record<string, LucideIcon> = {
  "virtual-number": Smartphone, "google-voice": Phone, "rent-number": CalendarClock, "apple-id": Apple,
  subscriptions: Sparkles, "social-growth": Users, "why-shopmajazi": ShieldCheck,
};

// Offer D — "Magazine": editorial layout. A lead paragraph with a key-facts box, then the topics as a two-column grid of
// icon-headed blocks, a pull quote in the middle, and quick links to every service at the end.
export default function SeoD() {
  const byId = (id: string) => seoSections.find((s) => s.id === id)!;
  const why = byId("why-shopmajazi");
  const topics = seoSections.filter((s) => s !== why);

  const Block = ({ s }: { s: SeoSection }) => {
    const Icon = icons[s.id];
    return (
      <section id={`d-${s.id}`} className="scroll-mt-20">
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-violet-100 text-violet-700"><Icon className="h-5 w-5" /></span>
        <h3 className="mt-4 font-display text-xl font-semibold text-slate-900">{s.heading}</h3>
        <Body s={s} />
      </section>
    );
  };

  return (
    <section className="bg-[#F6F5F1] py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid gap-10 lg:grid-cols-[1.5fr_1fr]">
          <div>
            <span className="text-sm font-semibold uppercase tracking-widest text-violet-600">The ShopMajazi guide</span>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-5xl">{seoIntro.heading}</h2>
            <p className="mt-6 text-lg leading-8 text-slate-700 first-letter:float-start first-letter:me-3 first-letter:font-display first-letter:text-6xl first-letter:font-bold first-letter:leading-[0.85] first-letter:text-violet-600">{seoIntro.lead}</p>
          </div>
          <aside className="self-start rounded-3xl bg-slate-900 p-7 text-white">
            <h3 className="font-display text-lg font-semibold">{why.heading}</h3>
            <Body s={{ ...why, bullets: undefined }} tone="dark" />
            <ul className="mt-5 space-y-2 border-t border-white/10 pt-5">
              {why.bullets!.map((b) => <li key={b} className="text-sm text-slate-200">• {b}</li>)}
            </ul>
          </aside>
        </div>

        <div className="mt-16 grid gap-x-12 gap-y-14 md:grid-cols-2">
          {topics.slice(0, 2).map((s) => <Block key={s.id} s={s} />)}
        </div>

        <figure className="my-16 rounded-3xl bg-white p-10 text-center shadow-sm ring-1 ring-slate-200/70">
          <Quote className="mx-auto h-6 w-6 text-violet-500" />
          <blockquote className="mx-auto mt-4 max-w-2xl font-display text-2xl font-semibold leading-snug text-slate-900">
            Once a number is sold, it's taken out of circulation, so nobody else can use it to access your account.
          </blockquote>
        </figure>

        <div className="grid gap-x-12 gap-y-14 md:grid-cols-2">
          {topics.slice(2).map((s) => <Block key={s.id} s={s} />)}
        </div>

        <div className="mt-16 flex flex-wrap items-center gap-2 border-t border-slate-300/60 pt-8">
          <span className="me-2 text-sm font-semibold text-slate-700">Jump to a service:</span>
          {topics.filter((s) => s.link).map((s) => (
            <Link key={s.id} href={s.link!.href} className="rounded-full bg-white px-4 py-2 text-sm text-slate-700 ring-1 ring-slate-200 hover:ring-violet-300">{s.link!.label}</Link>
          ))}
        </div>
      </div>
    </section>
  );
}
