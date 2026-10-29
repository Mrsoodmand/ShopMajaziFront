// Social media services: members, followers, views, likes for Telegram, Instagram, YouTube and TikTok.
// Same shape as the old site's virtual-service products (a category per platform, products with a price per 1,000,
// and the fields the order needs). Prices, speeds and limits are placeholders until wired to the back end.

export type SocialPlatform = "telegram" | "instagram" | "youtube" | "tiktok";
// What the buyer pastes: a channel / profile, or one post / video.
export type TargetKind = "tg-channel" | "tg-post" | "ig-profile" | "ig-post" | "yt-video" | "yt-channel" | "tt-profile" | "tt-video";

export type SocialTier = { id: "standard" | "premium"; name: string; desc: string; per1k: number; refillDays: number };
export type SocialService = {
  id: string; platform: SocialPlatform; name: string; unit: string; desc: string;
  min: number; max: number; startsIn: string; startMinutes: number; perDay: number; target: TargetKind; tiers: SocialTier[];
};

export const socialPlatforms: { id: SocialPlatform; name: string; short: string }[] = [
  { id: "telegram", name: "Telegram", short: "Members, views, reactions" },
  { id: "instagram", name: "Instagram", short: "Followers, likes, Reels views" },
  { id: "youtube", name: "YouTube", short: "Views, subscribers, likes" },
  { id: "tiktok", name: "TikTok", short: "Followers, views, likes" },
];

const tiers = (std: number, prem: number, refill: [number, number]): SocialTier[] => [
  { id: "standard", name: "Standard", desc: "Good value, may drop a little over time", per1k: std, refillDays: refill[0] },
  { id: "premium", name: "High quality", desc: "Accounts with photos and posts; drops much less", per1k: prem, refillDays: refill[1] },
];

export const socialServices: SocialService[] = [
  { id: "tg-members", platform: "telegram", name: "Channel members", unit: "members", desc: "Members for a public channel or group", min: 100, max: 50000, startsIn: "within 1 hour", startMinutes: 60, perDay: 5000, target: "tg-channel", tiers: tiers(1.2, 2.9, [30, 90]) },
  { id: "tg-views", platform: "telegram", name: "Post views", unit: "views", desc: "Views on one post", min: 100, max: 100000, startsIn: "within 10 minutes", startMinutes: 10, perDay: 50000, target: "tg-post", tiers: tiers(0.15, 0.4, [0, 0]) },
  { id: "tg-reactions", platform: "telegram", name: "Reactions", unit: "reactions", desc: "Positive emoji reactions on one post", min: 50, max: 10000, startsIn: "within 30 minutes", startMinutes: 30, perDay: 5000, target: "tg-post", tiers: tiers(0.6, 1.4, [0, 30]) },
  { id: "ig-followers", platform: "instagram", name: "Followers", unit: "followers", desc: "Followers for a public profile", min: 100, max: 30000, startsIn: "within 1 hour", startMinutes: 60, perDay: 3000, target: "ig-profile", tiers: tiers(0.9, 2.4, [30, 90]) },
  { id: "ig-likes", platform: "instagram", name: "Post likes", unit: "likes", desc: "Likes on one post or Reel", min: 50, max: 20000, startsIn: "within 15 minutes", startMinutes: 15, perDay: 10000, target: "ig-post", tiers: tiers(0.5, 1.2, [0, 30]) },
  { id: "ig-reels", platform: "instagram", name: "Reels views", unit: "views", desc: "Views on one Reel", min: 500, max: 500000, startsIn: "within 10 minutes", startMinutes: 10, perDay: 100000, target: "ig-post", tiers: tiers(0.12, 0.3, [0, 0]) },
  { id: "yt-views", platform: "youtube", name: "Video views", unit: "views", desc: "Views on one video or Short", min: 500, max: 100000, startsIn: "within 6 hours", startMinutes: 360, perDay: 5000, target: "yt-video", tiers: tiers(2.2, 4.5, [30, 60]) },
  { id: "yt-subs", platform: "youtube", name: "Subscribers", unit: "subscribers", desc: "Subscribers for a channel", min: 100, max: 10000, startsIn: "within 12 hours", startMinutes: 720, perDay: 500, target: "yt-channel", tiers: tiers(9, 18, [30, 90]) },
  { id: "yt-likes", platform: "youtube", name: "Video likes", unit: "likes", desc: "Likes on one video or Short", min: 50, max: 10000, startsIn: "within 1 hour", startMinutes: 60, perDay: 2000, target: "yt-video", tiers: tiers(1.5, 3.2, [0, 30]) },
  { id: "tt-followers", platform: "tiktok", name: "Followers", unit: "followers", desc: "Followers for a public profile", min: 100, max: 30000, startsIn: "within 1 hour", startMinutes: 60, perDay: 4000, target: "tt-profile", tiers: tiers(1.2, 2.8, [30, 60]) },
  { id: "tt-views", platform: "tiktok", name: "Video views", unit: "views", desc: "Views on one video", min: 1000, max: 1000000, startsIn: "within 10 minutes", startMinutes: 10, perDay: 200000, target: "tt-video", tiers: tiers(0.05, 0.12, [0, 0]) },
  { id: "tt-likes", platform: "tiktok", name: "Video likes", unit: "likes", desc: "Likes on one video", min: 50, max: 20000, startsIn: "within 15 minutes", startMinutes: 15, perDay: 10000, target: "tt-video", tiers: tiers(0.6, 1.3, [0, 30]) },
];

export const servicesOf = (p: SocialPlatform) => socialServices.filter((s) => s.platform === p);
export const fromPrice = (p: SocialPlatform) => Math.min(...servicesOf(p).map((s) => s.tiers[0].per1k));

// The field the order needs, per target kind: label, hint, an example, and the check.
export const targets: Record<TargetKind, { label: string; hint: string; placeholder: string; test: RegExp; wrong: string }> = {
  "tg-channel": { label: "Channel or group link", hint: "A public @username or t.me link. Private invite links (t.me/+…) work too.", placeholder: "t.me/yourchannel", test: /^(@[a-z0-9_]{4,32}|(https?:\/\/)?(t|telegram)\.me\/(\+[\w-]{6,}|[a-z0-9_]{4,32}))\/?$/i, wrong: "Use a channel link like t.me/yourchannel or @yourchannel" },
  "tg-post": { label: "Post link", hint: "Open the post, tap Copy link, and paste it here.", placeholder: "t.me/yourchannel/123", test: /^(https?:\/\/)?(t|telegram)\.me\/(c\/\d+|[a-z0-9_]{4,32})\/\d+\/?$/i, wrong: "Use a post link like t.me/yourchannel/123" },
  "ig-profile": { label: "Instagram username or profile link", hint: "The profile must be public while we deliver.", placeholder: "@yourname", test: /^(@?[a-z0-9._]{1,30}|(https?:\/\/)?(www\.)?instagram\.com\/[a-z0-9._]{1,30}\/?)$/i, wrong: "Use a username like @yourname or an instagram.com link" },
  "ig-post": { label: "Post or Reel link", hint: "Open the post, tap Share, then Copy link.", placeholder: "instagram.com/p/Cx1aB2c3", test: /^(https?:\/\/)?(www\.)?instagram\.com\/(p|reel|reels|tv)\/[\w-]{5,}\/?(\?.*)?$/i, wrong: "Use a post link like instagram.com/p/… or instagram.com/reel/…" },
  "yt-video": { label: "Video link", hint: "A public or unlisted video or Short. Paste the link from Share.", placeholder: "youtu.be/dQw4w9WgXcQ", test: /^(https?:\/\/)?(www\.|m\.)?(youtube\.com\/(watch\?v=|shorts\/)|youtu\.be\/)[\w-]{11}.*$/i, wrong: "Use a video link like youtu.be/… or youtube.com/watch?v=…" },
  "yt-channel": { label: "Channel link", hint: "Your channel's @handle or its youtube.com link.", placeholder: "youtube.com/@yourchannel", test: /^(@[\w.-]{3,30}|(https?:\/\/)?(www\.|m\.)?youtube\.com\/(@[\w.-]{3,30}|channel\/[\w-]{20,})\/?)$/i, wrong: "Use a channel link like youtube.com/@yourchannel" },
  "tt-profile": { label: "TikTok username or profile link", hint: "The profile must be public while we deliver.", placeholder: "@yourname", test: /^(@?[a-z0-9._]{2,24}|(https?:\/\/)?(www\.)?tiktok\.com\/@[a-z0-9._]{2,24}\/?)$/i, wrong: "Use a username like @yourname or a tiktok.com/@… link" },
  "tt-video": { label: "Video link", hint: "Open the video, tap Share, then Copy link.", placeholder: "tiktok.com/@yourname/video/7301…", test: /^(https?:\/\/)?((www|vm|vt)\.)?tiktok\.com\/(@[a-z0-9._]{2,24}\/video\/\d{8,}|[\w]{6,})\/?(\?.*)?$/i, wrong: "Use a video link like tiktok.com/@yourname/video/…" },
};

// A handle to show in previews, taken from what was pasted ("t.me/news/12" → "news").
export function handleOf(link: string) {
  const s = link.trim().replace(/^https?:\/\//, "").replace(/^www\./, "");
  const m = s.match(/@([\w.-]+)/) ?? s.match(/^(?:t|telegram)\.me\/(?:\+)?([\w-]+)/) ?? s.match(/^instagram\.com\/(?:p|reel|reels|tv\/)?([\w.-]+)/) ?? s.match(/^([\w.]+)$/);
  return m ? m[1] : "";
}

export const socialHeadings = {
  h1: "Social media services",
  sub: "Members, followers, views and likes for Telegram, Instagram, YouTube and TikTok. Just a public link, never your password.",
};

// Things that make an order go wrong, said before payment.
export const socialRules = [
  { title: "Keep it public until it's done", text: "A private account or channel can't receive followers or views. Delivery pauses until it's public again." },
  { title: "Don't change the username", text: "Renaming the account or deleting the post mid-order stops delivery, and it can't be refunded." },
  { title: "One seller per link at a time", text: "Running another order on the same link at the same time makes counts impossible to check. Wait for one to finish." },
  { title: "Drops are refilled", text: "Orders with a refill period are topped up for free if the count drops within that time. Ask support from your order page." },
];

// The live order page (/virtual-service/{platform}) only says what holds for every real service: no refill
// periods or start times, which the admin doesn't set per service.
export const liveSocialRules = socialRules.slice(0, 3);
export const liveSocialFaq = [
  { q: "Do you need my password or a login code?", a: "No. We only need the public link to the channel, profile, post or video. Never share your password with anyone who offers these services." },
  { q: "What if my order can't start?", a: "If the link is wrong, private or deleted before we begin, the order is cancelled and the money goes back to your wallet." },
  { q: "Can I split one order across several posts?", a: "No, one order goes to one link. Place a separate order for each post or video." },
  { q: "Where do I follow my order?", a: "On this page right after paying, and any time in your orders. Support updates it when delivery starts and when it's done." },
];

export const socialFaq = [
  { q: "Do you need my password or a login code?", a: "No. We only need the public link to the channel, profile, post or video. Never share your password with anyone who offers these services." },
  { q: "How fast does it start?", a: "Each service shows when it starts and how many it delivers per day. Most start within an hour; YouTube can take up to 12 hours to begin." },
  { q: "What happens if the numbers drop?", a: "Every service with a refill period is topped up for free when the count drops within that time. Open the order in your account and press Refill, or message support." },
  { q: "What if my order can't start?", a: "If the link is wrong, private or deleted before we begin, the order is cancelled and the money goes back to your wallet automatically." },
  { q: "Can I split one order across several posts?", a: "No, one order goes to one link. Place a separate order for each post or video." },
];
