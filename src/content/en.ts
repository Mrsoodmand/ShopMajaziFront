// English copy shared by the design offers. A matching fa.ts will mirror this shape.

export const brand = {
  name: "ShopMajazi",
  tagline: "Digital services, delivered instantly",
};

export type Service = {
  id: string;
  name: string;
  short: string;
  from: string;
  href: string;
};

export const services: Service[] = [
  { id: "virtual-number", name: "Virtual Numbers", short: "One-time SMS numbers from 150+ countries", from: "$0.30", href: "/virtual-numbers" },
  { id: "google-voice", name: "Google Voice", short: "Permanent US numbers you fully own", from: "$9.90", href: "/google-voice" },
  { id: "apple-id", name: "Apple ID", short: "Ready & custom Apple IDs, any region", from: "$6.50", href: "/apple-id" },
  { id: "subscriptions", name: "Subscriptions", short: "ChatGPT, Netflix, Spotify, Canva & more", from: "$4.00", href: "/accounts" },
  { id: "telegram", name: "Telegram", short: "Telegram Stars, Premium & Ads", from: "$0.83", href: "/telegram/stars" },
  { id: "social", name: "Social Media Services", short: "Members, followers, views & likes", from: "$0.90", href: "/virtual-service" },
  { id: "static-ip", name: "Static IP", short: "Dedicated IPs for stable access", from: "$7.00", href: "/static-ip" },
];

export const platforms = [
  "Telegram", "WhatsApp", "Instagram", "ChatGPT", "Netflix", "Spotify",
  "Google", "Apple", "TikTok", "YouTube", "Discord", "Canva", "X", "PayPal",
];

export const stats = [
  { value: "1.2M+", label: "Orders delivered" },
  { value: "150+", label: "Countries" },
  { value: "< 30s", label: "Avg. delivery" },
  { value: "24/7", label: "Human support" },
];

export const recentOrders = [
  { what: "WhatsApp number · Netherlands", when: "12s ago" },
  { what: "ChatGPT Plus · 1 month", when: "40s ago" },
  { what: "Google Voice · US", when: "1m ago" },
  { what: "5,000 Telegram members", when: "2m ago" },
  { what: "Apple ID · US region", when: "3m ago" },
];
