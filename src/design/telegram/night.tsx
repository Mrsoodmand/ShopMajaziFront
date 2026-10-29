"use client";
import { useId, useState, type ReactNode } from "react";
import { Crown, Gift, Sparkles, Star, User } from "lucide-react";
import { useMoney } from "@/lib/money";
import { tgHeadings } from "@/content/telegram-en";
import { useHasExtras } from "../service/slot";
import { primary } from "../googleVoice/clean";
import { accent, Avatar, glass, H2, NightSky, nightBg, Shine, StarGlyph, TgFaq, Title, Trust, Tweened, type PremiumState, type StarsState } from "./parts";
import { BuyStars, StarsSummary, TierTable, UsesGrid } from "./stars";
import { PremiumSky } from "./premiumKit";
import { FeatureGrid } from "./premium";
import { useT } from "@/i18n/client";

// The frame shared by the night-sky Stars and Premium offers (F–K): a dark star-filled top that always uses the
// dark look, with the title, a piece of hero art, the offer's own content on the left and the order summary with
// Buy in a sticky sidebar. Content below the top follows the site theme.

export const glassForm = `${glass} p-6 sm:p-8 [&_input]:!bg-black/30`;

const trust = {
  stars: ["No login needed", "Delivered in minutes", "Refund if not delivered"],
  premium: ["Gift to your username", "No password needed", "Active in minutes"],
};

export function NightPage({ tone, title, sub, art, side, below, children }: {
  tone: "stars" | "premium"; title?: ReactNode; sub?: ReactNode; art?: ReactNode | false; side: ReactNode; below?: ReactNode; children: ReactNode;
}) {
  const t = useT();
  return (
    <>
      <section aria-label={tone === "stars" ? t("Buy Stars") : t("Get Premium")} className={`dark relative -mt-16 overflow-hidden pt-28 ${tone === "premium" ? "pb-44" : `pb-20 ${nightBg[tone]}`}`}>
        {tone === "premium" ? <PremiumSky /> : <NightSky tone={tone} />}
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex items-start justify-between gap-6">
            <div className="animate-fade-up"><Title s={tone} light sub={sub ?? t.tr(tgHeadings)[tone].sub}>{title ?? t.tr(tgHeadings)[tone].h1}</Title></div>
            {art === false ? null : art ?? (tone === "stars" ? <HeroStar /> : <HeroCrown />)}
          </div>
          <div className="mt-6 animate-fade-up [animation-delay:120ms]"><Trust light items={t.tr(trust)[tone]} /></div>
          <div className="mt-10 grid grid-cols-[minmax(0,1fr)] gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
            <div className="min-w-0 animate-fade-up space-y-6 [animation-delay:240ms]">{children}</div>
            <aside aria-label={t("Your order")} className="animate-fade-up [animation-delay:360ms] lg:sticky lg:top-24 lg:self-start">{side}</aside>
          </div>
        </div>
      </section>
      {below}
    </>
  );
}

// ---------- Hero art ----------

// The big star: floats, with slowly turning rays behind it and three small stars circling it.
export function HeroStar() {
  return (
    <div aria-hidden className="relative hidden h-40 w-40 shrink-0 md:block">
      <span className="absolute inset-0 animate-spin-slow rounded-full bg-[repeating-conic-gradient(rgba(251,191,36,.35)_0deg_5deg,transparent_5deg_22deg)] [mask-image:radial-gradient(circle,black_25%,transparent_70%)]" />
      <span className="absolute inset-6 animate-glow rounded-full [--glow:rgba(251,191,36,.55)]" />
      <span className="absolute inset-0 animate-orbit">
        <StarGlyph className="absolute start-1/2 top-0 h-3 w-3 -translate-x-1/2" />
        <StarGlyph className="absolute bottom-4 end-2 h-2.5 w-2.5" />
        <StarGlyph className="absolute bottom-6 start-1 h-2 w-2" />
      </span>
      <span className="absolute inset-0 grid animate-float place-items-center"><StarGlyph className="h-20 w-20 drop-shadow-[0_0_30px_rgba(251,191,36,.85)]" /></span>
    </div>
  );
}

// The crown: floats inside a glowing gradient badge, with turning rays and sparkles circling it.
export function HeroCrown() {
  return (
    <div aria-hidden className="relative hidden h-40 w-40 shrink-0 md:block">
      <span className="absolute inset-0 animate-spin-slow rounded-full bg-[repeating-conic-gradient(rgba(240,171,252,.35)_0deg_5deg,transparent_5deg_22deg)] [mask-image:radial-gradient(circle,black_25%,transparent_70%)]" />
      <span className="absolute inset-0 animate-orbit">
        <Sparkles className="absolute start-1/2 top-0 h-4 w-4 -translate-x-1/2 text-fuchsia-200" />
        <Star className="absolute bottom-4 end-2 h-3 w-3 fill-violet-200 text-violet-200" />
        <Star className="absolute bottom-6 start-1 h-2.5 w-2.5 fill-fuchsia-200 text-fuchsia-200" />
      </span>
      <span className="absolute inset-0 grid animate-float place-items-center">
        <span className="grid h-20 w-20 animate-glow place-items-center rounded-[1.75rem] bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white [--glow:rgba(217,70,239,.6)]"><Crown className="h-10 w-10" /></span>
      </span>
    </div>
  );
}

// ---------- Sidebars ----------

export const StarsSide = ({ st }: { st: StarsState }) => <StarsSummary st={st} className={glass}><BuyStars st={st} shine className="mt-5" /></StarsSummary>;

export type Who = "me" | "gift";
export function useWho(pm: PremiumState, initial: Who = "me") {
  const [who, setWhoRaw] = useState<Who>(initial);
  const setWho = (w: Who) => { setWhoRaw(w); if (w === "me") pm.r.useMine(); else pm.r.set(""); };
  return { who, setWho };
}

export function WhoRadios({ who, setWho }: { who: Who; setWho: (w: Who) => void }) {
  const t = useT();
  const name = useId();
  return (
    <fieldset>
      <legend className="text-base font-semibold text-white">{t("Who is it for?")}</legend>
      <div className="mt-3 grid grid-cols-2 gap-2.5">
        {([["me", t("For me"), User], ["gift", t("A gift"), Gift]] as const).map(([id, label, I]) => {
          const on = who === id;
          return (
            <label key={id} className={`flex cursor-pointer items-center gap-3 rounded-2xl border-2 px-4 py-3.5 transition has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-violet-400 ${on ? "animate-pop border-violet-400 bg-white/10" : "border-white/20 hover:border-white/50"}`}>
              <input type="radio" name={name} checked={on} onChange={() => setWho(id)} className="sr-only" />
              <I aria-hidden className={`h-5 w-5 ${on ? "text-violet-300" : "text-white/60"}`} /><span className="font-semibold text-white">{label}</span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

// Profile card that fills in as you type (turning ring and sparkles once found), then the summary and Buy.
// `green` uses the site's standard Continue button (as on every product page) instead of the violet glowing one.
export function PremiumSide({ pm, who, green = false }: { pm: PremiumState; who: Who; green?: boolean }) {
  const usd = useMoney().format;
  const t = useT();
  const u = pm.r.user;
  return (
    <div className={`${glass} overflow-hidden`}>
      <div aria-live="polite" className={`relative overflow-hidden px-6 pb-6 pt-8 text-center text-white ${t.tr(accent).premium.hero}`}>
        <div aria-hidden className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,.18)_1px,transparent_1px)] bg-[size:16px_16px]" />
        <span aria-hidden className="absolute -top-16 start-1/2 h-40 w-40 -translate-x-1/2 animate-drift rounded-full bg-white/20 blur-2xl rtl:translate-x-1/2" />
        <div className="relative mx-auto grid h-[4.5rem] w-[4.5rem] place-items-center">
          {u && <span aria-hidden className="absolute inset-0 animate-[spin_4s_linear_infinite] rounded-full bg-[conic-gradient(#f0abfc,#a78bfa,#fde68a,#f0abfc)]" />}
          <span className={`relative rounded-full ${u ? "animate-pop ring-[3px] ring-violet-700" : ""}`}>{u ? <Avatar u={u} size="lg" /> : <span aria-hidden className="grid h-16 w-16 place-items-center rounded-full bg-white/20"><User className="h-7 w-7" /></span>}</span>
          {u && <>
            <Sparkles aria-hidden className="absolute -end-4 -top-1 h-4 w-4 animate-twinkle text-yellow-200" />
            <Sparkles aria-hidden className="absolute -start-5 bottom-1 h-3.5 w-3.5 animate-twinkle text-fuchsia-100 [animation-delay:1.2s]" />
          </>}
        </div>
        <div className="relative mt-3 flex items-center justify-center gap-1.5 font-display text-xl font-bold">
          {u ? u.name : t("Username")}
          <Star aria-hidden className={`h-5 w-5 fill-white text-white transition duration-500 ${u ? "rotate-0 scale-100 opacity-100" : "-rotate-180 scale-0 opacity-0"}`} />
        </div>
        <div className="relative text-sm text-white/80">{u ? `@${u.username}` : t("type a username")}{pm.r.checking && t(" · checking…")}</div>
        <p className="sr-only">{u ? t("{0} will get Telegram Premium for {1}.", { 0: u.name, 1: pm.plan.label }) : ""}</p>
      </div>
      <div className="space-y-3 p-6 text-[15px] text-white">
        <div className="flex justify-between gap-4"><span className="text-white/60">{t("Plan")}</span><span className="font-semibold">{t("Premium ·")}{" "}{pm.plan.label}</span></div>
        <div className="flex justify-between gap-4"><span className="text-white/60">{who === "gift" ? t("From") : t("For")}</span><span className="font-semibold">{who === "gift" ? t("You") : t("Your account")}</span></div>
        <div className="flex justify-between gap-4"><span className="text-white/60">{t("Activation")}</span><span className="font-semibold">{t("A few minutes")}</span></div>
        <div aria-live="polite" className="flex items-baseline justify-between border-t border-white/10 pt-4"><span className="text-white/60">{t("Total")}</span><span className="font-display text-2xl font-bold tabular-nums"><Tweened value={pm.total} /></span></div>
        {green ? (
          <>
            <button type="button" onClick={pm.proceed} className={`${primary} mt-2 w-full tabular-nums`}>{t("Continue ·")}{" "}{usd(pm.total)}</button>
            <p role="status" className="text-center text-sm font-semibold text-red-300 empty:hidden">{pm.blocker ?? ""}</p>
          </>
        ) : <BuyPremiumShine pm={pm} label={who === "gift" ? t("Gift Premium") : t("Get Premium")} />}
      </div>
    </div>
  );
}

export const BuyPremiumShine = ({ pm, label = "Get Premium" }: { pm: PremiumState; label?: string }) => {
  const usd = useMoney().format;
  const t = useT();
  label = t(label);
  return (
  <button type="button" onClick={pm.proceed} className={`${t.tr(accent).premium.btn} relative mt-2 w-full animate-glow overflow-hidden [--glow:rgba(192,38,211,.55)]`}><Shine /><span className="relative">{label} · {usd(pm.total)}</span></button>
);
};

// ---------- Below the top ----------

export function StarsBelow({ st }: { st: StarsState }) {
  const t = useT();
  const extras = useHasExtras();
  return (
    <div className="mx-auto max-w-6xl px-4 pb-24 pt-20 sm:px-6">
      <section aria-labelledby="uses"><H2 id="uses">{t("What can you do with Stars?")}</H2><div className="mt-6"><UsesGrid /></div></section>
      <section aria-labelledby="tiers" className="mt-16 max-w-3xl"><H2 id="tiers">{t("Buy more, pay less per Star")}</H2><div className="mt-6"><TierTable st={st} /></div></section>
      {!extras && <section aria-labelledby="faq" className="mt-16 max-w-3xl"><H2 id="faq">{t("Common questions")}</H2><div className="mt-6"><TgFaq s="stars" /></div></section>}
    </div>
  );
}

export function PremiumBelow({ features = true }: { features?: boolean }) {
  const t = useT();
  const extras = useHasExtras();
  if (!features && extras) return null;
  return (
    <div className="mx-auto max-w-6xl px-4 pb-24 pt-20 sm:px-6">
      {features && <section aria-labelledby="feat"><H2 id="feat">{t("Everything in Premium")}</H2><div className="mt-6"><FeatureGrid /></div></section>}
      {!extras && <section aria-labelledby="faq" className={`${features ? "mt-16" : ""} max-w-3xl`}><H2 id="faq">{t("Common questions")}</H2><div className="mt-6"><TgFaq s="premium" /></div></section>}
    </div>
  );
}
