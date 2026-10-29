// Social media service categories, as the admin manages them (the back end's `categories` of type product, with
// their products). Any number of platforms: the admin adds, orders, hides and features them, and uploads a logo.
// Everything here is a placeholder until it comes from the back end.

export type SocialCategoryService = { slug: string; name: string; from: number };
export type SocialCategory = {
  slug: string;            // URL: /virtual-service/{slug}
  name: string;
  short: string;           // one line under the name
  color: string;           // brand colour the admin picks, used for the logo tile
  logo?: string;           // uploaded logo (URL); when missing, the tile shows an icon or the first letter
  icon?: string;           // placeholder only: a built-in icon name for the demo data
  featured?: boolean;      // shown first / larger
  order: number;           // admin's sort order
  services: SocialCategoryService[];
};

const s = (slug: string, name: string, from: number): SocialCategoryService => ({ slug, name, from });

export const socialCategories: SocialCategory[] = [
  { slug: "telegram", name: "Telegram", short: "Members, views, reactions", color: "#0ea5e9", icon: "telegram", featured: true, order: 1,
    services: [s("members", "Channel members", 1.2), s("views", "Post views", 0.15), s("reactions", "Reactions", 0.6), s("votes", "Poll votes", 0.9), s("bot-starts", "Bot starts", 1.5)] },
  { slug: "instagram", name: "Instagram", short: "Followers, likes, Reels views", color: "#db2777", icon: "instagram", featured: true, order: 2,
    services: [s("followers", "Followers", 0.9), s("likes", "Post likes", 0.5), s("reels-views", "Reels views", 0.12), s("comments", "Comments", 4), s("story-views", "Story views", 0.3)] },
  { slug: "youtube", name: "YouTube", short: "Views, subscribers, likes", color: "#dc2626", icon: "youtube", featured: true, order: 3,
    services: [s("views", "Video views", 2.2), s("subscribers", "Subscribers", 9), s("likes", "Video likes", 1.5), s("watch-hours", "Watch hours", 25)] },
  { slug: "tiktok", name: "TikTok", short: "Followers, views, likes", color: "#0f172a", icon: "tiktok", featured: true, order: 4,
    services: [s("followers", "Followers", 1.2), s("views", "Video views", 0.05), s("likes", "Video likes", 0.6), s("shares", "Shares", 0.8)] },
  { slug: "x-twitter", name: "X (Twitter)", short: "Followers, likes, reposts", color: "#18181b", icon: "x", order: 5,
    services: [s("followers", "Followers", 3.5), s("likes", "Post likes", 1.8), s("reposts", "Reposts", 2.2), s("views", "Post views", 0.2)] },
  { slug: "facebook", name: "Facebook", short: "Page likes, followers, post reactions", color: "#2563eb", icon: "facebook", order: 6,
    services: [s("page-likes", "Page likes", 2.5), s("followers", "Followers", 2), s("reactions", "Post reactions", 1.2)] },
  { slug: "threads", name: "Threads", short: "Followers and likes", color: "#111827", order: 7,
    services: [s("followers", "Followers", 2.8), s("likes", "Likes", 1.6)] },
  { slug: "twitch", name: "Twitch", short: "Followers and live viewers", color: "#7c3aed", icon: "twitch", order: 8,
    services: [s("followers", "Followers", 2.4), s("viewers", "Live viewers", 6)] },
  { slug: "linkedin", name: "LinkedIn", short: "Followers, connections, post likes", color: "#0369a1", icon: "linkedin", order: 9,
    services: [s("followers", "Company page followers", 8), s("likes", "Post likes", 5)] },
  { slug: "spotify", name: "Spotify", short: "Plays, followers, monthly listeners", color: "#16a34a", order: 10,
    services: [s("plays", "Track plays", 1.1), s("followers", "Artist followers", 2.5), s("listeners", "Monthly listeners", 3)] },
  { slug: "soundcloud", name: "SoundCloud", short: "Plays, likes, followers", color: "#ea580c", order: 11,
    services: [s("plays", "Plays", 0.3), s("likes", "Likes", 1.4), s("followers", "Followers", 2)] },
  { slug: "discord", name: "Discord", short: "Server members", color: "#4f46e5", order: 12,
    services: [s("members", "Server members", 6)] },
  { slug: "rubika", name: "Rubika", short: "Channel members, views, likes", color: "#be123c", order: 13,
    services: [s("members", "Channel members", 1.4), s("views", "Post views", 0.2), s("likes", "Likes", 0.7)] },
  { slug: "eitaa", name: "Eitaa", short: "Channel members and views", color: "#ea580c", order: 14,
    services: [s("members", "Channel members", 1.3), s("views", "Post views", 0.2)] },
  { slug: "bale", name: "Bale", short: "Channel members and views", color: "#059669", order: 15,
    services: [s("members", "Channel members", 1.5), s("views", "Post views", 0.25)] },
];

// Admin order; hidden categories never reach the front end.
export const sortedCategories = () => [...socialCategories].sort((a, b) => a.order - b.order);
export const categoryFrom = (c: SocialCategory) => Math.min(...c.services.map((x) => x.from));
export const categoryHref = (c: SocialCategory) => `/virtual-service/${c.slug}`;
export const serviceHref = (c: SocialCategory, x: SocialCategoryService) => `/virtual-service/${c.slug}/${x.slug}`;

export const listHeadings = {
  h1: "Social media services",
  sub: "Choose a platform to see its services. Every order needs only a public link, never your password.",
};

export const listSteps = [
  { title: "Choose a platform", text: "Pick where you want to grow: a channel, profile, page or video." },
  { title: "Pick a service and amount", text: "Members, followers, views or likes, with the price per 1,000 and when it starts." },
  { title: "Paste the link and pay", text: "Wallet, card or crypto. Delivery starts on its own, and drops are refilled." },
];
