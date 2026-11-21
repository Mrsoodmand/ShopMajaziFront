import {
  Smartphone, Apple, Sparkles, Users, MessageSquareCode, Phone, CalendarClock, UserPen, BadgeCheck,
  Bot, LineChart, Headphones, Palette, Send, Instagram, MessagesSquare, Info, Crown, Megaphone, Star, type LucideIcon,
} from "lucide-react";

// Site navigation, grouped the same way as the hero G tabs.
// `image`: an admin-uploaded logo (live menu items, i18n/nav.ts), shown instead of `icon`.
export type NavItem = { label: string; desc: string; href: string; icon: LucideIcon; from: string; image?: string };
export type NavGroup = { id: string; label: string; icon: LucideIcon; items: NavItem[]; viewAll?: { label: string; href: string } };

export const navGroups: NavGroup[] = [
  {
    id: "numbers", label: "Virtual Numbers", icon: Smartphone,
    items: [
      { label: "Virtual Number (OTP)", desc: "One-time SMS codes, 150+ countries", href: "/virtual-number", icon: MessageSquareCode, from: "$0.30" },
      { label: "Google Voice", desc: "Permanent US number you own", href: "/google-voice", icon: Phone, from: "$9.90" },
      { label: "Rent Number", desc: "Unlimited SMS for 7–30 days", href: "/rent-number", icon: CalendarClock, from: "$4.90" },
    ],
  },
  {
    id: "apple", label: "Apple ID", icon: Apple,
    items: [
      { label: "Custom USA Apple ID", desc: "Made with your name and email", href: "/apple-id/custom", icon: UserPen, from: "$9.00" },
      { label: "USA Apple ID", desc: "Ready-made, instant delivery", href: "/apple-id/usa", icon: BadgeCheck, from: "$6.50" },
    ],
  },
  {
    id: "subs", label: "Subscriptions", icon: Sparkles, viewAll: { label: "All subscriptions", href: "/accounts" },
    items: [
      // The live account products (backend type "accounts"), from each one's cheapest plan.
      { label: "Claude", desc: "AI assistant, Pro to Ultra", href: "/accounts/buy-claude", icon: Bot, from: "$22.00" },
      { label: "Spotify Premium", desc: "Ad-free, offline listening", href: "/accounts/buy-spotify-account", icon: Headphones, from: "$3.30" },
      { label: "Freepik", desc: "Premium photos and templates", href: "/accounts/buy-freepick-account", icon: Palette, from: "$9.90" },
      { label: "TradingView", desc: "Pro charts and alerts", href: "/accounts/trading-view", icon: LineChart, from: "$32.99" },
    ],
  },
  {
    // No viewAll: there is no Telegram hub page, and its three pages are all listed below.
    id: "telegram", label: "Telegram", icon: Send,
    items: [
      { label: "Telegram Stars", desc: "Sent to any username in minutes", href: "/telegram/stars", icon: Star, from: "$0.83" },
      { label: "Telegram Premium", desc: "Gifted to your username, 3–12 months", href: "/telegram/premium", icon: Crown, from: "$11.90" },
      { label: "Telegram Ads", desc: "Sponsored messages in channels", href: "/telegram/ads", icon: Megaphone, from: "$50.00" },
    ],
  },
  {
    id: "social", label: "Social Media Services", icon: Users, viewAll: { label: "All social services", href: "/virtual-service" },
    items: [
      { label: "Telegram", desc: "Members, views, reactions", href: "/virtual-service/telegram", icon: Send, from: "$1.20" },
      { label: "Instagram", desc: "Followers, likes, Reels views", href: "/virtual-service/instagram", icon: Instagram, from: "$0.90" },
      // YouTube and TikTok come back here once they have services in admin › Virtual services (pages 404 or are empty until then).
    ],
  },
];

export const navLinks = [
  { label: "Blog", href: "/blog" },
  { label: "Support", href: "/contact-us" },
];

// "About us" dropdown in header F (and the mobile menu).
export const aboutLinks = [
  { label: "Contact us", desc: "Chat, email or Telegram, 24/7", href: "/contact-us", icon: MessagesSquare },
  { label: "About us", desc: "Who we are and how we work", href: "/about-us", icon: Info },
  // "Rules" (/rules, icon ScrollText) comes back here once that page is written.
];

export const languages = [
  { code: "en", label: "English", short: "EN" },
  { code: "fa", label: "فارسی", short: "FA" },
];
