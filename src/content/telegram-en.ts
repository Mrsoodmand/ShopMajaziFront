// English copy and PLACEHOLDER prices for the three Telegram services: Stars, Premium and Ads.
// Live prices will come from the Laravel back end.

export type TgService = "stars" | "premium" | "ads";

export const tgPaths: Record<TgService, string> = { stars: "/telegram/stars", premium: "/telegram/premium", ads: "/telegram/ads" };

// ---------- Recipient ----------

// Telegram usernames: 5–32 characters, letters, digits and underscores, starting with a letter.
export const USERNAME = /^[a-zA-Z][a-zA-Z0-9_]{4,31}$/;
export const cleanUsername = (v: string) => v.trim().replace(/^@/, "").replace(/^(https?:\/\/)?t\.me\//i, "");

export function checkUsername(v: string): string | undefined {
  const u = cleanUsername(v);
  if (!u) return "Enter a Telegram username, like @durov";
  if (u.length < 5) return "Usernames are at least 5 characters";
  if (!USERNAME.test(u)) return "Usernames use only letters, numbers and underscores, and start with a letter";
  return undefined;
}

// Placeholder lookup: the live site asks the back end, which checks the account exists.
export function lookupUser(u: string) {
  const name = u.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  const hues = ["bg-sky-500", "bg-violet-500", "bg-rose-500", "bg-amber-500", "bg-emerald-500", "bg-indigo-500"];
  const h = [...u].reduce((a, c) => a + c.charCodeAt(0), 0);
  return { username: u, name, initials: name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase(), color: hues[h % hues.length], premium: h % 4 === 0 };
}
export type TgUser = ReturnType<typeof lookupUser>;

// ---------- Stars ----------

export const STAR_MIN = 50;
export const STAR_MAX = 100000;
// Price per star falls with the amount.
export const starTiers = [
  { from: 50, each: 0.0165, label: "Starter" },
  { from: 1000, each: 0.0155, label: "Saver" },
  { from: 5000, each: 0.0148, label: "Bulk" },
  { from: 25000, each: 0.0142, label: "Partner" },
];
export const starEach = (n: number) => [...starTiers].reverse().find((t) => n >= t.from)!.each;
export const starPrice = (n: number) => Math.round(n * starEach(n) * 100) / 100;
export const starPacks = [50, 100, 250, 500, 1000, 2500, 5000, 10000];
export const POPULAR_PACK = 500;

export const starUses = [
  { title: "Pay in bots and mini apps", text: "Games, AI bots and services that sell inside Telegram." },
  { title: "Send gifts", text: "Buy and send collectible gifts to friends and channels." },
  { title: "Paid reactions", text: "Support channel posts you like with star reactions." },
  { title: "Unlock paid media", text: "Open paid photos, videos and posts from creators." },
];

// ---------- Premium ----------

export const premiumPlans = [
  { months: 3, price: 11.9, label: "3 months" },
  { months: 6, price: 15.9, label: "6 months", tag: "Popular" },
  { months: 12, price: 28.9, label: "12 months", tag: "Best value" },
];
export type PremiumPlan = (typeof premiumPlans)[number];
export const perMonth = (p: PremiumPlan) => Math.round((p.price / p.months) * 100) / 100;
export const premiumSaving = (p: PremiumPlan) => Math.round((1 - perMonth(p) / perMonth(premiumPlans[0])) * 100);

export const premiumFeatures = [
  { id: "ads", title: "No ads", text: "Sponsored messages in public channels disappear.", short: "Sponsored messages disappear" },
  { id: "upload", title: "4 GB uploads", text: "Send files up to 4 GB each, double the free limit.", short: "Double the file size limit" },
  { id: "speed", title: "Faster downloads", text: "No speed limit on media and file downloads.", short: "No speed limit on downloads" },
  { id: "voice", title: "Voice to text", text: "Read any voice or video message as text.", short: "Read voice messages as text" },
  { id: "limits", title: "Doubled limits", text: "1,000 channels, 20 folders, 4 accounts and more pinned chats.", short: "More channels, folders, accounts" },
  { id: "emoji", title: "Emoji status and stickers", text: "Animated emoji status, premium stickers and reactions.", short: "Animated status and stickers" },
  { id: "stories", title: "Stories features", text: "Stealth mode, permanent view history and more posting options.", short: "Stealth mode and more" },
  { id: "badge", title: "Premium badge", text: "A star next to your name in chats and the members list.", short: "A star next to your name" },
];

// Free vs Premium, for the compare table.
export const premiumCompare = [
  { label: "Ads in public channels", free: "Shown", premium: "None" },
  { label: "File upload size", free: "2 GB", premium: "4 GB" },
  { label: "Download speed", free: "Limited", premium: "Full speed" },
  { label: "Channels you can join", free: "500", premium: "1,000" },
  { label: "Chat folders", free: "10", premium: "20" },
  { label: "Accounts in one app", free: "3", premium: "4" },
  { label: "Voice to text", free: "—", premium: "Yes" },
  { label: "Emoji status", free: "—", premium: "Yes" },
];

// ---------- Ads ----------

export const AD_TEXT_MAX = 160;
export const AD_BUTTON_MAX = 30;
export const AD_MIN_BUDGET = 50;
export const AD_MAX_BUDGET = 5000;
export const AD_CPM = 2.5; // placeholder: average cost per 1,000 views

export const adGoals = [
  { id: "channel", label: "Grow a channel", hint: "Link to your public channel", example: "t.me/yourchannel" },
  { id: "bot", label: "Get bot users", hint: "Link to your bot or mini app", example: "t.me/yourbot" },
  { id: "site", label: "Send people to a website", hint: "Any https:// address", example: "https://example.com" },
] as const;
export type AdGoal = (typeof adGoals)[number]["id"];

export const adTargets = [
  { id: "topics", label: "By topic", hint: "Show in channels about chosen subjects" },
  { id: "channels", label: "In chosen channels", hint: "List the channels where your ad appears" },
  { id: "location", label: "By country and language", hint: "Reach users where they live" },
] as const;
export type AdTarget = (typeof adTargets)[number]["id"];

export const adTopics = ["Crypto", "Tech", "News", "Business", "Education", "Gaming", "Entertainment", "Lifestyle", "Sports", "Music", "Travel", "Shopping"];
export const adCountries = ["Worldwide", "Iran", "Turkey", "UAE", "Russia", "Germany", "United Kingdom", "United States", "India", "Brazil"];
export const adLanguages = ["Any", "Persian", "English", "Russian", "Arabic", "Turkish", "Spanish"];

export const adPackages = [
  { id: "starter", name: "Starter", budget: 50, text: "Test one ad on one topic.", points: ["1 ad", "1 topic or 5 channels", "Report at the end"] },
  { id: "growth", name: "Growth", budget: 200, text: "Two ads to see which works.", points: ["2 ads (A/B test)", "Up to 3 topics or 20 channels", "Weekly report"], tag: "Popular" },
  { id: "pro", name: "Pro", budget: 1000, text: "A full campaign we tune for you.", points: ["Up to 5 ads", "Any targeting", "Daily report and tuning"] },
];

export const estViews = (budget: number, cpm = AD_CPM) => Math.round((budget / cpm) * 1000);
export const estClicks = (views: number) => [Math.round(views * 0.005), Math.round(views * 0.015)] as const;
export const fmt = (n: number) => n.toLocaleString("en-US");

export const adRules = [
  "Ad text up to 160 characters, no emoji or images",
  "Links only to Telegram channels, bots or websites",
  "No gambling, adult content, scams or misleading claims",
  "Telegram reviews every ad, usually within 24 hours",
];

export const adSteps = [
  { title: "Send your ad", text: "Text, link and who should see it." },
  { title: "We submit it", text: "We place it in our Telegram Ads account, so you don't need TON or a Fragment account." },
  { title: "Telegram reviews it", text: "Usually within 24 hours. If it's rejected, we help you fix it or refund you." },
  { title: "It runs", text: "Until the budget is spent. You get a report with views and clicks." },
];

// ---------- Shared ----------

export const tgFaq: Record<TgService, { q: string; a: string }[]> = {
  stars: [
    { q: "Do you need my Telegram login?", a: "No. We only need your username. Stars are sent to the account, and you never share a password or code." },
    { q: "How long does delivery take?", a: "Usually 1 to 5 minutes. Large amounts can take up to an hour. You'll see it in your order and in Telegram." },
    { q: "Can I send Stars to someone else?", a: "Yes. Enter their username instead of yours, and they get the Stars as a gift." },
    { q: "What if I typed the wrong username?", a: "We check the account before sending. If the username doesn't exist, the order stops and the money stays in your wallet." },
    { q: "Do I pay less if I buy more?", a: "Yes. From 1,000 Stars each Star costs about 6% less, from 5,000 about 10% less, and from 25,000 about 14% less. The saving shows on the pack and in your order before you pay." },
    { q: "How do I know the Stars arrived?", a: "Open Telegram, go to Settings, then My Stars: the new balance is there. Your order page here also turns to Delivered." },
  ],
  premium: [
    { q: "Is it activated on my own account?", a: "Yes. Premium is gifted to your username, so it's added to your current account with all your chats." },
    { q: "Do you need my password or login code?", a: "No. A gift only needs your username. Never share your login code with anyone." },
    { q: "What if I already have Premium?", a: "The new months are added after your current period ends." },
    { q: "Can I gift Premium to a friend?", a: "Yes. Enter their username and they receive it as a gift from Telegram." },
  ],
  ads: [
    { q: "Do I need TON or a Fragment account?", a: "No. We run the ad in our own Telegram Ads account and you pay in dollars from your wallet, card or crypto." },
    { q: "What can I advertise?", a: "A public channel, a bot or mini app, or a website. The ad shows as a sponsored message at the end of channel posts." },
    { q: "What if Telegram rejects my ad?", a: "We tell you why and help you change it. If it can't be approved, the full budget goes back to your wallet." },
    { q: "Can I see the results?", a: "Yes. You get views, clicks and spend, and you can stop the campaign at any time. Unspent budget is refunded." },
  ],
};

export const tgHeadings: Record<TgService, { h1: string; sub: string }> = {
  stars: { h1: "Buy Telegram Stars", sub: "Stars sent to any username in minutes. No login, no Fragment account, no TON." },
  premium: { h1: "Telegram Premium", sub: "Gifted to your username for 3, 6 or 12 months. Your chats stay where they are, and we never need your login." },
  ads: { h1: "Telegram Ads", sub: "Sponsored messages in Telegram channels from $50. We set up the campaign, so you don't need TON or a Fragment account." },
};
