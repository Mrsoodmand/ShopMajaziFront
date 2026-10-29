import { MessageSquareCode, Phone, CalendarClock, UserPen, BadgeCheck, Bot, Clapperboard, Headphones, Crown, Send, Instagram, type LucideIcon } from "lucide-react";

// PLACEHOLDER best-sellers for designing the Popular products section. Prices, ratings and sales counts are made up;
// the live section should read them from the product API.
export type Product = {
  id: string; cat: "numbers" | "apple" | "subs" | "telegram" | "social"; name: string; desc: string; icon: LucideIcon;
  price: number; oldPrice?: number; rating: number; sold: number; delivery: string; badge?: "Best seller" | "New" | "Deal"; href: string;
};

export const productCats: { id: Product["cat"]; label: string }[] = [
  { id: "numbers", label: "Virtual Numbers" },
  { id: "apple", label: "Apple ID" },
  { id: "subs", label: "Subscriptions" },
  { id: "telegram", label: "Telegram" },
  { id: "social", label: "Social Media Services" },
];

export const products: Product[] = [
  { id: "wa-de", cat: "numbers", name: "WhatsApp number · Germany", desc: "One-time SMS verification", icon: MessageSquareCode, price: 0.42, rating: 4.9, sold: 3820, delivery: "Instant", badge: "Best seller", href: "/virtual-number?app=whatsapp&country=de" },
  { id: "gv-ny", cat: "numbers", name: "Google Voice · New York", desc: "Permanent US number", icon: Phone, price: 9.9, oldPrice: 12.5, rating: 4.8, sold: 940, delivery: "~5 min", badge: "Deal", href: "/google-voice" },
  { id: "rent-us", cat: "numbers", name: "Rent · US number, 30 days", desc: "Unlimited SMS for a month", icon: CalendarClock, price: 14.9, rating: 4.7, sold: 410, delivery: "Instant", href: "/rent-number" },
  { id: "aid-custom", cat: "apple", name: "Custom USA Apple ID", desc: "Your name and email", icon: UserPen, price: 9, rating: 4.9, sold: 760, delivery: "~1 hour", badge: "Best seller", href: "/apple-id/custom" },
  { id: "aid-usa", cat: "apple", name: "USA Apple ID", desc: "Ready-made, instant", icon: BadgeCheck, price: 6.5, rating: 4.8, sold: 1210, delivery: "Instant", href: "/apple-id/usa" },
  { id: "gpt", cat: "subs", name: "ChatGPT Plus · 1 month", desc: "On your own account", icon: Bot, price: 22, oldPrice: 25, rating: 4.9, sold: 2140, delivery: "~10 min", badge: "Best seller", href: "/accounts/chatgpt-plus" },
  { id: "netflix", cat: "subs", name: "Netflix Premium · 1 month", desc: "4K on every screen", icon: Clapperboard, price: 8, rating: 4.6, sold: 880, delivery: "~10 min", href: "/accounts/netflix" },
  { id: "spotify", cat: "subs", name: "Spotify Premium · 1 month", desc: "Individual plan", icon: Headphones, price: 4, rating: 4.8, sold: 1530, delivery: "~5 min", href: "/accounts/spotify" },
  { id: "tg-premium", cat: "telegram", name: "Telegram Premium · 3 months", desc: "Gifted to your username", icon: Crown, price: 11.9, oldPrice: 14, rating: 4.9, sold: 1670, delivery: "Instant", badge: "New", href: "/telegram/premium" },
  { id: "tg-members", cat: "social", name: "Telegram members · 1,000", desc: "Real members, steady delivery", icon: Send, price: 6.9, rating: 4.7, sold: 1290, delivery: "Starts in minutes", href: "/virtual-service/telegram" },
  { id: "ig-followers", cat: "social", name: "Instagram followers · 1,000", desc: "High quality, refill guarantee", icon: Instagram, price: 3.5, oldPrice: 4.5, rating: 4.6, sold: 2050, delivery: "Starts in minutes", badge: "Deal", href: "/virtual-service/instagram" },
];

export const money = (n: number) => `$${n.toFixed(2)}`;
export const catOf = (id: Product["cat"]) => productCats.find((c) => c.id === id)!.label;
