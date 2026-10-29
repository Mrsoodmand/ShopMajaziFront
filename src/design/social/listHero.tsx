"use client";

import type { ComponentType, CSSProperties } from "react";
import Link from "@/i18n/Link";
import { Eye, Heart, Music2, Users, UserPlus, type LucideIcon } from "lucide-react";
import { categoryHref, listHeadings, type SocialCategory } from "@/content/social-categories-en";
import { CategoryLogo, iconFor, ListTitle, ring, SearchField, SearchStatus, type CategorySearch } from "./listKit";
import { HeroTexture } from "./heroTextures";
import { HeroIcons } from "./heroIcons";
import { HeroBackdrop, isRich } from "./heroBackdrops";
import { HeroObject } from "./heroObjects";
import { useT } from "@/i18n/client";
import { PageH1 } from "@/components/seo/PageHeading";

// Hero options for the Social media services list (offer F). Each one holds the title, the search and its own way
// into the list. Everything is drawn from the admin's categories: logos, colours and counts are real data, never
// invented numbers. Motion is one entrance or a hover response; reduced motion stills it (globals.css).

export type ListHero = { Component: ComponentType<{ s: CategorySearch; texture?: string; icons?: string; object?: string; bg?: string }>; dark?: boolean; overlap?: boolean };

const ease = "ease-[cubic-bezier(0.22,1,0.36,1)]";
const wrap = "mx-auto max-w-6xl px-4 sm:px-6";

function Counts({ s, light = false }: { s: CategorySearch; light?: boolean }) {
  const tx = useT();
  const services = s.all.reduce((n, c) => n + c.services.length, 0);
  return <p className={`text-sm font-medium tabular-nums ${light ? "text-white/85" : "text-slate-600 dark:text-slate-400"}`}>{tx("{0} platforms · {1} services", { 0: s.all.length, 1: services })}</p>;
}

// ---------- Plain (no hero chosen): title and search on one row ----------

function Plain({ s }: { s: CategorySearch }) {
  return (
    <div className={`${wrap} pt-12`}>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-end">
        <div><ListTitle /></div>
        <SearchField s={s} />
      </div>
      <SearchStatus s={s} />
    </div>
  );
}

// ---------- A · Logo Cloud ----------
// Every platform's logo in a loose staggered cloud beside the title; featured ones larger. Each logo is a link and
// lifts on hover. The logos land one after another on load.

function LogoCloud({ s }: { s: CategorySearch }) {
  const tx = useT();
  return (
    <div className={`${wrap} pt-12`}>
      <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <div>
          <ListTitle />
          <div className="mt-6 max-w-lg"><SearchField s={s} big /></div>
          <div className="mt-4"><Counts s={s} /></div>
          <SearchStatus s={s} />
        </div>
        <nav aria-label={tx("All platforms")} className="relative">
          <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 rounded-[3rem] bg-[radial-gradient(closest-side,rgba(99,102,241,.14),transparent)] dark:bg-[radial-gradient(closest-side,rgba(99,102,241,.22),transparent)]" />
          <ul className="grid grid-cols-5 gap-3 sm:gap-4">
            {s.all.map((c, i) => (
              <li key={c.slug} className={`grid place-items-center ${Math.floor(i / 5) % 2 ? "translate-x-[10%] rtl:-translate-x-[10%]" : ""}`}>
                <Link href={categoryHref(c)} title={tx(c.name)} style={{ animationDelay: `${i * 45}ms` } as CSSProperties}
                  className={`group/l grid animate-[logo-in_0.8s_cubic-bezier(0.22,1,0.36,1)_backwards] place-items-center rounded-2xl p-1.5 ${ring}`}>
                  <CategoryLogo c={c} size={c.featured ? "xl" : "lg"} className={`shadow-lg shadow-slate-900/10 transition-[translate,scale,rotate] duration-500 ${ease} group-hover/l:-translate-y-1.5 group-hover/l:scale-105 dark:shadow-black/40`} />
                  <span className="sr-only">{tx(c.name)}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
}

// ---------- B · Brand Mesh ----------
// A dark band whose colour comes from the featured platforms' own brand colours, blended as soft glows. Title and a
// big search inside; the featured cards rise over the band's lower edge.

// Glows sit in the upper part of the band, so its lower part is plain navy that fades out cleanly.
function mesh(cats: SocialCategory[]): CSSProperties {
  const spots = ["12% 10%", "88% 5%", "62% 35%", "30% 45%", "50% 0%"];
  const glows = cats.slice(0, 5).map((c, i) => `radial-gradient(38% 55% at ${spots[i]}, color-mix(in srgb, ${c.color} 60%, transparent), transparent 70%)`);
  return { backgroundImage: [...glows, "linear-gradient(#0b1020, #0b1020)"].join(",") };
}

function BrandMesh({ s, texture }: { s: CategorySearch; texture?: string }) {
  const featured = s.all.filter((c) => c.featured);
  return (
    <section className="relative -mt-16 pb-48 pt-28">
      {/* The whole band fades into the page ground over its last third: no hard edge in either theme. */}
      <div aria-hidden className="pointer-events-none absolute inset-0 [mask-image:linear-gradient(to_bottom,black_0%,black_62%,transparent_100%)]">
        <div style={mesh(featured.length ? featured : s.all)} className="absolute inset-0" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-transparent" />
        <HeroTexture id={texture} />
      </div>
      <div className={`${wrap} relative`}>
        <ListTitle light />
        <div className="mt-6 max-w-xl"><SearchField s={s} big onDark /></div>
        <div className="mt-4"><Counts s={s} light /></div>
        <SearchStatus s={s} />
      </div>
    </section>
  );
}

// ---------- C · Search Spotlight ----------
// Centred and quiet: a large title, one big search, and the featured platforms as chips to jump straight in.

function Spotlight({ s, icons, object, bg }: { s: CategorySearch; icons?: string; object?: string; bg?: string }) {
  const tx = useT();
  // With a rich-colour background the hero becomes a band under the header with white text that fades into the page.
  const rich = isRich(bg);
  return (
    <div className={`relative isolate overflow-hidden ${rich ? "-mt-16 pb-28 pt-16" : ""}`}>
      {rich ? <HeroBackdrop id={bg} cats={s.all} /> : <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[34rem] bg-[radial-gradient(60%_70%_at_50%_0%,rgba(99,102,241,.16),transparent)] dark:bg-[radial-gradient(60%_70%_at_50%_0%,rgba(99,102,241,.25),transparent)]" />}
      {!rich && <HeroObject id={object} cats={s.all} />}
      <div className={`${wrap} relative pt-12 text-center sm:pt-20 lg:pb-6`}>
        <HeroIcons cats={s.all} look={icons} />
        <h1 className={`relative z-10 mx-auto max-w-3xl text-balance font-display text-4xl font-bold tracking-tight sm:text-6xl ${rich ? "text-white drop-shadow-[0_2px_12px_rgba(0,0,0,.25)]" : "text-slate-900 dark:text-white"}`}><PageH1 text={tx(listHeadings.h1)} /></h1>
        <p className={`relative z-10 mx-auto mt-4 max-w-2xl text-base leading-relaxed sm:text-lg ${rich ? "text-white/90" : "text-slate-700 dark:text-slate-300"}`}>{tx(listHeadings.sub)}</p>
        <div className="relative z-10 mx-auto mt-8 max-w-2xl text-start"><SearchField s={s} big onDark={rich} /></div>
        <SearchStatus s={s} />
        <div className="relative z-10 mt-5 flex flex-wrap items-center justify-center gap-2">
          <span className={`me-1 text-sm font-semibold ${rich ? "text-white/90" : "text-slate-700 dark:text-slate-300"}`}>{tx("Popular:")}</span>
          {s.all.filter((c) => c.featured).map((c) => (
            <Link key={c.slug} href={categoryHref(c)} className={`inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white py-1 pe-3.5 ps-1 text-sm font-semibold text-slate-900 transition-[border-color,translate,scale,rotate] duration-500 ${ease} hover:-translate-y-0.5 hover:border-slate-400 dark:border-white/15 dark:bg-[#0E1424] dark:text-white dark:hover:border-white/40 ${ring}`}>
              <CategoryLogo c={c} size="sm" className="!h-7 !w-7 !rounded-full" />{tx(c.name)}
            </Link>
          ))}
        </div>
        <div className="relative z-10 mt-6 flex justify-center"><Counts s={s} light={rich} /></div>
      </div>
    </div>
  );
}

// ---------- D · Platform Marquee ----------
// Title and search above two slow rows of platform pills drifting in opposite directions. Pointing at or tabbing
// into a row pauses it; reduced motion leaves it still. The second copy of each row is for the loop only.

function Row({ cats, reverse = false }: { cats: SocialCategory[]; reverse?: boolean }) {
  const tx = useT();
  const pills = (copy: boolean) => cats.map((c) => (
    <li key={`${c.slug}-${copy}`} aria-hidden={copy || undefined}>
      <Link href={categoryHref(c)} tabIndex={copy ? -1 : undefined} className={`inline-flex items-center gap-2.5 whitespace-nowrap rounded-full border border-slate-200 bg-white py-1.5 pe-5 ps-1.5 font-semibold text-slate-900 transition-colors duration-300 hover:border-slate-400 dark:border-white/15 dark:bg-[#0E1424] dark:text-white dark:hover:border-white/40 ${ring}`}>
        <CategoryLogo c={c} size="sm" className="!rounded-full" />{tx(c.name)}
      </Link>
    </li>
  ));
  return (
    <div className="group/row overflow-hidden py-1.5 [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
      <ul dir="ltr" className={`flex w-max gap-3 ${reverse ? "animate-marquee-reverse" : "animate-marquee"} [animation-duration:60s] group-hover/row:[animation-play-state:paused] group-focus-within/row:[animation-play-state:paused]`}>
        {pills(false)}{pills(true)}
      </ul>
    </div>
  );
}

function Marquee({ s }: { s: CategorySearch }) {
  const tx = useT();
  const half = Math.ceil(s.all.length / 2);
  return (
    <div className="pt-14">
      <div className={`${wrap} text-center`}>
        <h1 className="relative z-10 mx-auto max-w-3xl text-balance font-display text-4xl font-bold tracking-tight text-slate-900 sm:text-6xl dark:text-white"><PageH1 text={tx(listHeadings.h1)} /></h1>
        <p className="relative z-10 mx-auto mt-4 max-w-2xl text-base leading-relaxed text-slate-700 sm:text-lg dark:text-slate-300">{tx(listHeadings.sub)}</p>
        <div className="relative z-10 mx-auto mt-8 max-w-2xl text-start"><SearchField s={s} big /></div>
        <SearchStatus s={s} />
      </div>
      <nav aria-label={tx("All platforms")} className="mt-10 space-y-1">
        <Row cats={s.all.slice(0, half)} />
        <Row cats={s.all.slice(half)} reverse />
      </nav>
    </div>
  );
}

// ---------- E · Need Picker ----------
// Title and search beside a card that asks what you want to grow; each answer shows how many platforms sell it and
// filters the list below to them.

const needs: { term: string; label: string; Icon: LucideIcon }[] = [
  { term: "followers", label: "Followers", Icon: UserPlus },
  { term: "members", label: "Members", Icon: Users },
  { term: "views", label: "Views", Icon: Eye },
  { term: "likes", label: "Likes", Icon: Heart },
  { term: "plays", label: "Plays", Icon: Music2 },
];

function NeedPicker({ s }: { s: CategorySearch }) {
  const tx = useT();
  const count = (term: string) => s.all.filter((c) => c.services.some((x) => x.name.toLowerCase().includes(term))).length;
  const pick = (term: string) => {
    s.setQ(s.q === term ? "" : term);
    requestAnimationFrame(() => document.getElementById("platforms")?.scrollIntoView({ behavior: "smooth", block: "start" }));
  };
  return (
    <div className={`${wrap} pt-12`}>
      <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_26rem]">
        <div>
          <ListTitle />
          <div className="mt-6 max-w-lg"><SearchField s={s} /></div>
          <div className="mt-4"><Counts s={s} /></div>
          <SearchStatus s={s} />
        </div>
        <section aria-labelledby="need-h" className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-900/5 dark:border-white/15 dark:bg-[#0E1424] dark:shadow-black/30">
          <h2 id="need-h" className="font-display text-lg font-semibold text-slate-900 dark:text-white">{tx("What do you want to grow?")}</h2>
          <ul className="mt-4 grid grid-cols-2 gap-2.5">
            {needs.map(({ term, label, Icon }, i) => {
              const on = s.q === term;
              const n = count(term);
              return (
                <li key={term} className={i === needs.length - 1 && needs.length % 2 ? "col-span-2" : ""}>
                  <button type="button" aria-pressed={on} onClick={() => pick(term)}
                    className={`group/n flex w-full items-center gap-3 rounded-2xl border-2 p-3 text-start transition-[border-color,background-color,translate,scale,rotate] duration-500 ${ease} hover:-translate-y-0.5 ${ring} ${on ? "border-slate-900 bg-slate-900 text-white dark:border-white dark:bg-white dark:text-slate-900" : "border-slate-200 text-slate-900 hover:border-slate-300 dark:border-white/15 dark:text-white dark:hover:border-white/30"}`}>
                    <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl transition-colors duration-500 ${on ? "bg-white/15 dark:bg-slate-900/10" : "bg-slate-100 dark:bg-white/5"}`}><Icon aria-hidden className="h-5 w-5" /></span>
                    <span className="min-w-0"><span className="block font-semibold">{tx(label)}</span><span className={`block text-sm tabular-nums ${on ? "opacity-80" : "text-slate-600 dark:text-slate-400"}`}>{n === 1 ? tx("1 platform") : tx("{0} platforms", { 0: n })}</span></span>
                  </button>
                </li>
              );
            })}
          </ul>
        </section>
      </div>
    </div>
  );
}

export const listHeroes: Record<string, ListHero> = {
  plain: { Component: Plain },
  A: { Component: LogoCloud },
  B: { Component: BrandMesh, dark: true, overlap: true },
  C: { Component: Spotlight },
  D: { Component: Marquee },
  E: { Component: NeedPicker },
};
