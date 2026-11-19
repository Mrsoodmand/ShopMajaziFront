"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Sparkles } from "lucide-react";
import { PageShell } from "../otp/parts";
import { useHasExtras } from "../service/slot";
import { panels } from "./panels";
import { CatTabs, ProductButton, SearchBox, SubsCheckout, SubsFaq, SubsOrderView, SubsTitle, useCatalog, useSubs } from "./parts";
import { useT } from "@/i18n/client";
import type { SubProduct } from "@/content/subs-en";
import { useLiveSubs, useSubsList } from "./live";
import { QuickPicks } from "../quickPicks";
import { BrandMesh } from "../social/heroBackdrops";
import { SpotlightBand, SpotlightMark, spotTone, useSpotlight } from "@/design/service/spotlight";
import { useLocalePath } from "@/i18n/Link";
import { stripLocale } from "@/i18n/config";
import { PageH1 } from "@/components/seo/PageHeading";

// Page A — "Catalog + Panel": the catalog as a grid with category chips and search; picking a subscription shows
// its plans, the fields it needs and Buy in a panel that stays beside the grid on desktop. On phones the panel sits
// below and the page scrolls to it (focus moves to its heading).
// Opens on ChatGPT Plus (live: the first popular subscription), or on `slug` on a product's own page
// (/accounts/{slug}), where the heading is the product.
// There, picking another subscription goes to its page so the content below matches the address.
const PANEL_FLAG = "subs-open-panel";
const isPhone = () => window.matchMedia("(max-width: 1023px)").matches;
const FALLBACK_COLOR = "#475569"; // lib/subs.ts: a live product the admin gave no colour

// A quick pick's small round mark: the admin's logo, or the letter on the brand colour.
function Mark({ p }: { p: SubProduct }) {
  // eslint-disable-next-line @next/next/no-img-element -- admin uploads, served by the backend through the proxy
  if (p.image) return <img src={p.image} alt="" aria-hidden className="h-7 w-7 rounded-full bg-white object-cover" />;
  const hex = p.color.startsWith("#");
  return <span aria-hidden style={hex ? { backgroundColor: p.color } : undefined} className={`grid h-7 w-7 place-items-center rounded-full text-xs font-bold text-white ${hex ? "" : p.color}`}>{p.letter}</span>;
}

// `panel` picks the product panel version (see panels.tsx; chosen in /design/page-subs-panel).
export default function SubsA({ slug, panel: panelId }: { slug?: string; panel?: string }) {
  const t = useT();
  const live = useLiveSubs();
  const list = useSubsList();
  const Panel = panels[panelId ?? "original"] ?? panels.original;
  const s = useSubs(slug ?? (live ? (list.find((p) => p.popular) ?? list[0])?.slug : "chatgpt-plus"));
  const c = useCatalog();
  const panel = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const lp = useLocalePath();
  const extras = useHasExtras();

  const showPanel = () => {
    panel.current?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
    panel.current?.querySelector<HTMLElement>("h2")?.focus({ preventScroll: true });
  };
  // Arriving from a pick on another product page: on phones, go straight to this product's plans.
  useEffect(() => {
    let flagged = false;
    try { flagged = sessionStorage.getItem(PANEL_FLAG) === "1"; sessionStorage.removeItem(PANEL_FLAG); } catch {}
    if (flagged && isPhone()) setTimeout(showPanel, 120);
  }, []);
  if (s.order) return <PageShell><div className="px-6 py-14"><SubsOrderView s={s} /></div></PageShell>;

  const pick = (p: Parameters<typeof s.select>[0]) => {
    if (slug && p && p.slug !== slug && stripLocale(window.location.pathname).startsWith("/accounts/")) {
      try { sessionStorage.setItem(PANEL_FLAG, "1"); } catch {}
      router.push(lp(`/accounts/${p.slug}`), { scroll: false });
      return;
    }
    s.select(p);
    if (isPhone()) setTimeout(showPanel, 80);
  };
  const product = slug ? s.product : null;
  // The catalog (/accounts) opens on the same hero as /virtual-service: a Brand Mesh band in the popular
  // subscriptions' own colours, with a centred title, a big search and the popular ones as quick picks.
  // Live: when the admin marked none as popular, every subscription is a quick pick.
  const marked = list.filter((p) => p.popular);
  const popular = marked.length ? marked : list.slice(0, 6);
  const hexOf = (cls: string) => cls.match(/#[0-9a-f]{6}/i)?.[0];
  const spot = useSpotlight();

  return (
    <PageShell heroDark={!product && !spot}>
      {!product && (
        <section aria-labelledby="subs-h1" className="relative isolate -mt-16 overflow-hidden pb-20 pt-16">
          {spot ? <SpotlightBand /> : <BrandMesh colors={popular.map((p) => hexOf(p.color)).filter((x): x is string => !!x && x !== FALLBACK_COLOR)} />}
          <div className="mx-auto max-w-7xl px-4 pt-12 text-center sm:px-6 sm:pt-20">
            {spot && <SpotlightMark icon={Sparkles} />}
            <h1 id="subs-h1" className={`mx-auto max-w-5xl text-balance font-display text-4xl font-bold tracking-tight sm:text-6xl ${spot ? spotTone.title : "text-white drop-shadow-[0_2px_12px_rgba(0,0,0,.25)]"}`}><PageH1 text={t("Premium subscriptions")} /></h1>
            <p className={`mx-auto mt-4 max-w-3xl text-base leading-relaxed sm:text-lg ${spot ? spotTone.sub : "text-white/90"}`}>{live
              ? t("Premium apps without a foreign card. Each one shows how it's activated and how long it takes.")
              : t("ChatGPT, Netflix, Spotify, Canva and more. Most are activated on your own account; you never share a password.")}</p>
            <SearchBox c={c} hero className="mx-auto mt-7 max-w-xl text-start" />
            <QuickPicks tone={spot ? "page" : "band"} items={popular.map((p) => ({
              key: p.slug, name: p.name, on: s.product?.slug === p.slug, onPick: () => pick(p),
              icon: <Mark p={p} />,
            }))} />
            {live?.error && <p role="alert" className="mx-auto mt-6 max-w-xl rounded-2xl bg-white/95 px-4 py-3 text-sm font-semibold text-slate-900">{live.error}</p>}
          </div>
        </section>
      )}
      <div className={`mx-auto max-w-7xl px-4 pb-24 sm:px-6 ${product ? "pt-10 sm:pt-14" : "pt-2"}`}>
        {product && <SubsTitle sub={product.tagline}>{t("{0} subscription", { 0: product.name })}</SubsTitle>}

        <div className={`${product ? "mt-8" : ""} grid grid-cols-[minmax(0,1fr)] gap-8 lg:grid-cols-[minmax(0,1fr)_400px]`}>
          <section aria-label={t("Catalog")}>
            <div className="space-y-3">
              {product && <SearchBox c={c} className="max-w-md" />}
              <CatTabs c={c} />
            </div>
            <ul className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {c.list.map((p) => <li key={p.slug}><ProductButton more p={p} on={s.product?.slug === p.slug} onPick={() => pick(p)} /></li>)}
            </ul>
            {c.list.length === 0 && <p className="mt-6 text-slate-600 dark:text-slate-400">{t("Nothing matches “")}{c.q}”.</p>}
          </section>

          <div ref={panel} className="scroll-mt-20 lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-white/15 dark:bg-[#0E1424]">
              {s.product
                ? <div key={s.product.slug} className="animate-fade-up [animation-duration:250ms]"><Panel s={s} focusable /></div>
                : <div className="py-10 text-center"><Sparkles aria-hidden className="mx-auto h-8 w-8 text-violet-600 dark:text-violet-400" /><p className="mt-3 font-semibold text-slate-900 dark:text-white">{t("Pick a subscription")}</p><p className="text-slate-600 dark:text-slate-400">{t("You'll see its plans and price here.")}</p></div>}
            </div>
          </div>
        </div>

        {!extras && <section aria-labelledby="faq" className="mt-20 max-w-3xl"><h2 id="faq" className="font-display text-2xl font-bold text-slate-900 dark:text-white">{t("Common questions")}</h2><div className="mt-6"><SubsFaq /></div></section>}
      </div>
      <SubsCheckout s={s} />
    </PageShell>
  );
}
