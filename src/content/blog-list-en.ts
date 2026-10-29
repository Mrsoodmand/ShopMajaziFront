// Placeholder archive for designing the blog list page: the home page posts plus older ones, newest first.
// The live page will page through the Laravel blog instead.

import { posts, type BlogCat, type Post } from "./blog-en";

const older: Post[] = [
  { slug: "best-countries-otp", cat: "numbers", title: "Which countries give the most reliable verification numbers?", excerpt: "Success rates by country and app, and why the cheapest number isn't always the best pick.", date: "Sep 4, 2026", read: "6 min" },
  { slug: "apple-id-region-change", cat: "apple", title: "Changing your Apple ID region: what you lose and what you keep", excerpt: "Subscriptions, store credit, Family Sharing and purchased apps: a checklist before you switch.", date: "Aug 29, 2026", read: "5 min" },
  { slug: "rent-vs-one-time", cat: "numbers", title: "Rent a number or buy one-time? A quick decision guide", excerpt: "How many codes you need, for how long, and which option ends up cheaper.", date: "Aug 22, 2026", read: "3 min" },
  { slug: "youtube-watch-time", cat: "social", title: "YouTube watch hours: how the 4,000-hour rule really works", excerpt: "What counts toward monetization, what doesn't, and how long it usually takes a new channel.", date: "Aug 15, 2026", read: "7 min" },
  { slug: "spotify-family-vs-individual", cat: "guides", title: "Spotify Individual vs Family: which plan is right for you?", excerpt: "Price per person, the address rule and what happens to your playlists when you switch.", date: "Aug 8, 2026", read: "4 min" },
  { slug: "ai-tools-2026", cat: "news", title: "The AI tools everyone is paying for in 2026", excerpt: "ChatGPT, Claude, Midjourney and more: what each subscription gets you and who it's for.", date: "Aug 1, 2026", read: "9 min" },
  { slug: "telegram-channel-vs-group", cat: "telegram", title: "Telegram channel or group? Pick the right one for your community", excerpt: "Broadcast or conversation: limits, moderation tools and when to run both.", date: "Jul 25, 2026", read: "5 min" },
];

const newest: Post[] = [
  { slug: "telegram-premium-gift", cat: "telegram", title: "How to gift Telegram Premium without sharing your login", excerpt: "All you need is a username. How Premium gifts work, how long they last and what the receiver gets.", date: "Oct 18, 2026", read: "4 min" },
  { slug: "telegram-ads-guide", cat: "telegram", title: "Telegram Ads explained: budgets, targeting and what to expect", excerpt: "Sponsored messages, channel targeting and realistic numbers for a first campaign.", date: "Oct 15, 2026", read: "8 min" },
];

export const archive: Post[] = [...newest, ...posts, ...older];

// Placeholder view counts for "Most read".
const views: Record<string, number> = {
  "whatsapp-virtual-number-guide": 48210, "chatgpt-plus-payment": 39120, "grow-telegram-channel": 31880, "custom-us-apple-id": 27400,
  "google-voice-vs-virtual-number": 22950, "telegram-premium-gift": 18300, "best-countries-otp": 16120, "ai-tools-2026": 14900,
};
export const viewsOf = (p: Post) => views[p.slug] ?? 3000;
export const mostRead = [...archive].sort((a, b) => viewsOf(b) - viewsOf(a));

export const countOf = (cat: BlogCat | "all") => (cat === "all" ? archive.length : archive.filter((p) => p.cat === cat).length);
