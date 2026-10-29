// PLACEHOLDER catalog for designing the Subscriptions page. Mirrors the Laravel model: products of type "accounts"
// (each with its own page at /accounts/{slug}), plans per product (name, price, optional discount) and per-product
// form fields (text or select) the buyer fills in. Prices are made up; the live ones come from the Plan table.

export type SubCat = "ai" | "video" | "music" | "design" | "work" | "trading";
export const subCats: { id: SubCat; label: string }[] = [
  { id: "ai", label: "AI tools" },
  { id: "video", label: "Video" },
  { id: "music", label: "Music" },
  { id: "design", label: "Design" },
  { id: "work", label: "Productivity" },
  { id: "trading", label: "Trading" },
];

export type SubPlan = { id: string; name: string; months: number; price: number; was?: number };
// A field the buyer fills in. `options` makes it a select.
export type SubField = { id: string; label: string; hint?: string; type: "email" | "text" | "select"; options?: string[]; optional?: boolean };
// "own": activated on the buyer's own account (we need its email). "ready": we deliver a ready account login.
export type SubProduct = {
  slug: string; name: string; cat: SubCat; letter: string; color: string; tagline: string;
  activation: "own" | "ready"; delivery: string; plans: SubPlan[]; fields: SubField[]; notes: string[]; popular?: boolean;
};

const yourEmail = (app: string): SubField => ({ id: "email", label: `Email of your ${app} account`, hint: `We activate the plan on this ${app} account.`, type: "email" });
const months = (n: number) => (n === 1 ? "1 month" : n === 12 ? "1 year" : `${n} months`);
const plans = (prefix: string, rows: [number, number, number?][]): SubPlan[] => rows.map(([m, price, was]) => ({ id: `${prefix}-${m}`, name: months(m), months: m, price, was }));

export const subs: SubProduct[] = [
  { slug: "chatgpt-plus", name: "ChatGPT Plus", cat: "ai", letter: "G", color: "bg-[#10A37F]", tagline: "GPT models with higher limits, on your own account", activation: "own", delivery: "Within 15 minutes", popular: true,
    plans: plans("gpt", [[1, 22], [3, 63, 66], [12, 239, 264]]), fields: [yourEmail("ChatGPT")],
    notes: ["Activated on your own account; we never need your password", "Your chats and settings stay as they are"] },
  { slug: "claude-pro", name: "Claude Pro", cat: "ai", letter: "C", color: "bg-[#D97757]", tagline: "More usage and the latest Claude models", activation: "own", delivery: "Within 15 minutes",
    plans: plans("claude", [[1, 22], [12, 239, 264]]), fields: [yourEmail("Claude")], notes: ["Activated on your own account"] },
  { slug: "midjourney", name: "Midjourney", cat: "ai", letter: "M", color: "bg-slate-900 ring-1 ring-inset ring-white/25", tagline: "AI image generation, Basic or Standard", activation: "own", delivery: "Within 30 minutes",
    plans: [{ id: "mj-basic", name: "Basic · 1 month", months: 1, price: 12 }, { id: "mj-std", name: "Standard · 1 month", months: 1, price: 32 }],
    fields: [{ id: "discord", label: "Your Discord username", hint: "Midjourney is linked to Discord.", type: "text" }], notes: ["Linked to your Discord account"] },
  { slug: "netflix", name: "Netflix Premium", cat: "video", letter: "N", color: "bg-[#E50914]", tagline: "4K streaming, delivered as a ready profile", activation: "ready", delivery: "Instant", popular: true,
    plans: [{ id: "nf-1", name: "1 profile · 1 month", months: 1, price: 8 }, { id: "nf-3", name: "1 profile · 3 months", months: 3, price: 22, was: 24 }],
    fields: [{ id: "device", label: "Main device", type: "select", options: ["TV", "Phone", "Computer", "Tablet"], hint: "So we can send the right setup guide." }],
    notes: ["A private profile with its own PIN", "Works on TV, phone and computer"] },
  { slug: "youtube-premium", name: "YouTube Premium", cat: "video", letter: "Y", color: "bg-[#FF0000]", tagline: "No ads, background play and YouTube Music", activation: "own", delivery: "Within 30 minutes",
    plans: plans("yt", [[1, 6], [12, 62, 72]]), fields: [yourEmail("Google")], notes: ["Joins your Google account to a family plan"] },
  { slug: "spotify", name: "Spotify Premium", cat: "music", letter: "S", color: "bg-[#1DB954]", tagline: "Ad-free music and offline listening", activation: "own", delivery: "Within 15 minutes", popular: true,
    plans: plans("sp", [[1, 4], [3, 11, 12], [6, 21, 24], [12, 39, 48]]), fields: [yourEmail("Spotify")],
    notes: ["Your playlists and liked songs stay", "Upgrade on your own account"] },
  { slug: "apple-music", name: "Apple Music", cat: "music", letter: "A", color: "bg-gradient-to-br from-[#FA233B] to-[#FB5C74]", tagline: "100 million songs, lossless audio", activation: "own", delivery: "Within 30 minutes",
    plans: plans("am", [[1, 6], [12, 59, 72]]), fields: [{ id: "email", label: "Your Apple ID email", type: "email", hint: "The Apple ID you use on your devices." }], notes: ["Works with any Apple ID region"] },
  { slug: "canva", name: "Canva Pro", cat: "design", letter: "C", color: "bg-gradient-to-br from-[#00C4CC] to-[#7D2AE8]", tagline: "Every premium template, photo and tool", activation: "own", delivery: "Within 15 minutes", popular: true,
    plans: plans("cv", [[1, 3], [12, 12, 36]]), fields: [yourEmail("Canva")], notes: ["Added to a Pro team; your designs stay yours"] },
  { slug: "adobe-cc", name: "Adobe Creative Cloud", cat: "design", letter: "Ad", color: "bg-[#DA1F26]", tagline: "Photoshop, Illustrator, Premiere and more", activation: "ready", delivery: "Within 1 hour",
    plans: plans("adobe", [[1, 18], [12, 180, 216]]), fields: [], notes: ["Ready account with all Creative Cloud apps", "100 GB cloud storage"] },
  { slug: "microsoft-365", name: "Microsoft 365", cat: "work", letter: "M", color: "bg-[#0078D4]", tagline: "Word, Excel, PowerPoint and 1 TB OneDrive", activation: "own", delivery: "Within 30 minutes",
    plans: plans("ms", [[12, 29, 70]]), fields: [yourEmail("Microsoft")], notes: ["Activated on your own Microsoft account"] },
  { slug: "grammarly", name: "Grammarly Premium", cat: "work", letter: "G", color: "bg-[#15C39A]", tagline: "Advanced grammar, tone and clarity checks", activation: "ready", delivery: "Instant",
    plans: plans("gr", [[1, 5], [12, 45, 60]]), fields: [], notes: ["Ready shared account login"] },
  { slug: "linkedin-premium", name: "LinkedIn Premium", cat: "work", letter: "in", color: "bg-[#0A66C2]", tagline: "InMail, profile insights and LinkedIn Learning", activation: "own", delivery: "Within 1 hour",
    plans: plans("li", [[1, 15], [3, 42, 45]]), fields: [{ id: "profile", label: "Your LinkedIn profile URL", type: "text", hint: "For example linkedin.com/in/your-name" }], notes: ["Career or Business plan, on your profile"] },
  { slug: "duolingo-super", name: "Duolingo Super", cat: "work", letter: "D", color: "bg-[#58CC02]", tagline: "No ads, unlimited hearts, practice hub", activation: "own", delivery: "Within 30 minutes",
    plans: plans("duo", [[12, 22, 84]]), fields: [{ id: "username", label: "Your Duolingo username", type: "text" }], notes: ["Joins a Family plan on your account"] },
  { slug: "tradingview", name: "TradingView", cat: "trading", letter: "TV", color: "bg-[#131722] ring-1 ring-inset ring-white/25", tagline: "Essential, Plus or Premium charts", activation: "own", delivery: "Within 1 hour",
    plans: [{ id: "tv-ess", name: "Essential · 1 month", months: 1, price: 9 }, { id: "tv-plus", name: "Plus · 1 month", months: 1, price: 18 }, { id: "tv-prem", name: "Premium · 1 month", months: 1, price: 35 }],
    fields: [{ id: "username", label: "Your TradingView username", type: "text" }], notes: ["Upgraded on your own TradingView account"] },
];

export const subBySlug = (slug: string) => subs.find((s) => s.slug === slug);
export const fromPrice = (p: SubProduct) => Math.min(...p.plans.map((x) => x.price / x.months));
export const cheapestPlan = (p: SubProduct) => p.plans.reduce((a, b) => (b.price < a.price ? b : a));
export const savePct = (pl: SubPlan) => (pl.was ? Math.round((1 - pl.price / pl.was) * 100) : 0);

export const subsFaq = [
  { q: "Is the subscription activated on my own account?", a: "For most services, yes: you give us your account email and we activate the plan on it. A few, like Netflix and Adobe, come as a ready account instead. Each product says which." },
  { q: "Do you need my password?", a: "No. For services activated on your account we only need the email or username. Never share your password with anyone." },
  { q: "How long does activation take?", a: "Ready accounts are instant. Activations on your own account usually take 15 to 60 minutes; the time is shown on each product." },
  { q: "What if it stops working before the end?", a: "Tell support from your order page. We fix it, replace it or refund the unused time." },
];
