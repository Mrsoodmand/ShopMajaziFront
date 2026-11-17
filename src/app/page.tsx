import { Fragment } from "react";
import Link from "next/link";
import { sections } from "@/design/registry";
import { readDecisions } from "@/components/design/decisions";
import { LiveBlogProvider } from "@/design/blog/live";
import { getLocale } from "@/i18n/server";
import { loadBlog } from "@/lib/blog";
import { commentDate, loadTestimonials } from "@/lib/comments";
import { LiveTestimonialsProvider, type LiveTestimonial } from "@/design/testimonials/live";
import { getT } from "@/i18n/server";
import { BridgeBeam, BridgeMarquee, BridgeThread, BridgeTwinkle, BridgeWave } from "@/design/bridge/offers";

// The moving element in the band under the hero, by its offer in gallery section "hero-bridge".
const bridges: Record<string, typeof BridgeWave> = { A: BridgeThread, B: BridgeMarquee, C: BridgeBeam, D: BridgeWave, E: BridgeTwinkle };

export const dynamic = "force-dynamic";

// How many of the newest posts the home page's blog section gets.
const HOME_POSTS = 8;

// Temporary home: stitches together the chosen offer of each designed section.
// A chosen variant (e.g. the arrow style for How to buy) stands in for its parent section's offer,
// and a chosen header replaces the hero's built-in nav. The blog section shows the newest real posts (left out when
// the backend can't be reached).
export default async function Home() {
  const decisions = await readDecisions();
  const pick = (id: string) => sections.find((s) => s.id === id)?.offers.find((o) => o.id === decisions[id]?.offer);
  const header = pick("header");
  const Bridge = bridges[decisions["hero-bridge"]?.offer ?? ""];
  const locale = await getLocale();
  const posts = pick("blog") ? ((await loadBlog(locale)) ?? []).slice(0, HOME_POSTS) : [];
  // Real, approved customer comments for the testimonials section (it is left out when there are none).
  const t = await getT();
  const aboutLabel: Record<string, string> = { "virtual-number": "Virtual numbers", "apple-id": "Apple ID", "google-voice": "Google Voice", "static-ip": "Static IP", "rent-number": "Rent a number", accounts: "Subscriptions", "telegram-stars": "Telegram Stars" };
  const testimonials: LiveTestimonial[] = pick("testimonials")
    ? (await loadTestimonials()).map((r) => ({
        id: String(r.id), name: r.name, text: r.text, date: commentDate(r.date, locale),
        about: r.product ?? (r.about && aboutLabel[r.about] ? t(aboutLabel[r.about]) : ""),
      }))
    : [];

  const chosen = sections
    .filter((s) => !s.variantOf && !s.kind && pick(s.id)) // whole pages and the logo never join the home page
    .map((s) => {
      const variant = sections.find((v) => v.variantOf === s.id && pick(v.id));
      return { key: s.id, Component: (variant ? pick(variant.id) : pick(s.id))!.Component };
    });
  // On the home page, Why ShopMajazi comes before How to buy (the registry keeps the gallery order).
  const why = chosen.findIndex((c) => c.key === "why");
  const how = chosen.findIndex((c) => c.key === "how-to-buy");
  if (why > how && how !== -1) chosen.splice(how, 0, ...chosen.splice(why, 1));

  if (chosen.length === 0)
    return (
      <main className="grid min-h-screen place-items-center bg-slate-950 text-white">
        <div className="text-center">
          <h1 className="font-display text-3xl font-bold">No sections chosen yet</h1>
          <Link href="/design" className="mt-4 inline-block text-slate-400 underline underline-offset-4">Go to design offers →</Link>
        </div>
      </main>
    );

  return (
    <LiveBlogProvider value={{ posts }}>
      <LiveTestimonialsProvider value={testimonials}>
      <main>
        {chosen.map(({ key, Component }) => (
          <Fragment key={key}>
            {key === "hero" && header ? <Component bare={header.overlay ? "overlay" : "flow"} /> : <Component />}
            {/* Pulled over the next section's top padding, so the band keeps its height. */}
            {key === "hero" && Bridge && <div className="relative z-10 -mb-12"><Bridge /></div>}
          </Fragment>
        ))}
      </main>
      </LiveTestimonialsProvider>
    </LiveBlogProvider>
  );
}
