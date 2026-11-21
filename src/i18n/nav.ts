import { navGroups, type NavGroup, type NavItem } from "@/content/nav-en";
import { formatNum, toman, type PickItem, type T } from "./translate";

// The site menu in this language, with the Subscriptions and Social groups replaced by what the admin put in the
// menu (Api\StorefrontController::prices › picks.menu; at most 6 accounts and 4 platforms). A group with nothing
// chosen keeps its built-in items. Same T → same array, so components keep stable identities.
const memo = new WeakMap<T, NavGroup[]>();

export function navFor(t: T): NavGroup[] {
  let out = memo.get(t);
  if (out) return out;
  const base = t.tr(navGroups);
  const picks = t.prices?.picks?.menu;
  out = base.map((g) => {
    const chosen = g.id === "subs" ? picks?.subs : g.id === "social" ? picks?.social : undefined;
    if (!chosen?.length) return g;
    const fallback = g.items[0]?.icon ?? g.icon;
    return { ...g, items: chosen.map((p) => pickToNav(p, t, fallback)) };
  });
  memo.set(t, out);
  return out;
}

// A chosen account or platform as a menu item: Persian names on the Persian site, English ones (if set) otherwise.
export function pickToNav(p: PickItem, t: T, icon: NavItem["icon"]): NavItem {
  const fa = t.locale === "fa";
  return {
    label: fa ? p.name : p.name_en || p.name,
    desc: (fa ? p.desc : p.desc_en || p.desc) ?? "",
    href: p.href,
    icon,
    image: p.image ?? undefined,
    from: pickPrice(p, t),
  };
}

// "from" price: Toman on the Persian site; dollars elsewhere, converted back at the site's dollar rate.
export function pickPrice(p: PickItem, t: T): string {
  if (!p.from) return "";
  if (t.locale === "fa") return toman(p.from, "fa");
  const usd = t.prices?.usd ? p.from / t.prices.usd : 0;
  return usd ? `$${formatNum(usd, "en", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : "";
}
