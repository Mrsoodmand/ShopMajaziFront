import type { NavItem } from "@/content/nav-en";

// A menu item's icon: the admin-uploaded logo for live items (i18n/nav.ts), else its built-in icon.
export function NavIcon({ item, className }: { item: Pick<NavItem, "icon" | "image">; className: string }) {
  if (item.image) return <img src={item.image} alt="" className={`${className} rounded-md object-cover`} />;
  const Icon = item.icon;
  return <Icon className={className} />;
}
