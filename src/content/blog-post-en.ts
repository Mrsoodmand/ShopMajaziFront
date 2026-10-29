// PLACEHOLDER articles for the blog post page. The live site will load posts from the Laravel blog and map their
// HTML body onto these same blocks (or style it as-is). Only the WhatsApp guide has a full sample body; every other
// post gets a short generated stand-in so its page renders.

import { archive } from "./blog-list-en";
import type { BlogCat, Post } from "./blog-en";

export type Block =
  | { t: "p"; text: string }
  | { t: "h2"; id: string; text: string }
  | { t: "h3"; text: string }
  | { t: "ul" | "ol"; items: string[] }
  | { t: "tip" | "warn"; title: string; text: string }
  | { t: "quote"; text: string }
  | { t: "figure"; caption: string }
  | { t: "table"; head: string[]; rows: string[][] }
  | { t: "cta" };

export type Product = { name: string; desc: string; from: string; href: string };
export type Article = {
  post: Post;
  updated: string;
  author: { name: string; role: string; initials: string };
  lead: string;
  tags: string[];
  product: Product;
  takeaways: string[];
  body: Block[];
  faq: { q: string; a: string }[];
};
// Article plus what the page needs around it.
export type ArticlePage = Article & { toc: Extract<Block, { t: "h2" }>[]; related: Post[]; next: Post };

const team = { name: "ShopMajazi Team", role: "Guides & support", initials: "SM" };

// The service each topic leads to.
const products: Record<BlogCat, Product> = {
  numbers: { name: "Virtual Number (OTP)", desc: "One-time numbers from 150+ countries. Refund if no SMS.", from: "$0.30", href: "/virtual-number" },
  apple: { name: "USA Apple ID", desc: "Ready-made or custom, with a setup guide.", from: "$6.50", href: "/apple-id/usa" },
  telegram: { name: "Telegram Premium", desc: "Gifted to your username, no login needed.", from: "$11.90", href: "/telegram/premium" },
  social: { name: "Social Media Services", desc: "Members, followers, views and likes. Free refills.", from: "$0.90", href: "/virtual-service" },
  guides: { name: "Premium subscriptions", desc: "ChatGPT, Netflix, Spotify, Canva and more.", from: "$4.00", href: "/accounts" },
  news: { name: "Premium subscriptions", desc: "ChatGPT, Netflix, Spotify, Canva and more.", from: "$4.00", href: "/accounts" },
};

const sample: Article = {
  post: archive.find((p) => p.slug === "whatsapp-virtual-number-guide")!,
  updated: "Oct 14, 2026",
  author: team,
  lead: "WhatsApp asks for a phone number before it lets you in. If you'd rather not use your personal SIM, a virtual number gets you verified in about a minute. Here's exactly how to do it, and how to keep the account safe afterwards.",
  tags: ["WhatsApp", "Virtual numbers", "SMS verification", "Privacy"],
  product: products.numbers,
  takeaways: [
    "Pick a country with a high success rate for WhatsApp, not just the cheapest one.",
    "The code shows up in your dashboard within seconds; no code means an automatic refund.",
    "Turn on two-step verification right after sign-up so the account stays yours.",
  ],
  body: [
    { t: "h2", id: "what-you-need", text: "What you need" },
    { t: "ul", items: ["A ShopMajazi account (free) with a little wallet balance or a card", "WhatsApp installed on your phone, or WhatsApp Business", "About two minutes"] },
    { t: "h2", id: "pick-country", text: "Step 1: Pick the right country" },
    { t: "p", text: "Every country lists its price and its success rate for WhatsApp over the last 24 hours. A slightly pricier number with a 98% rate is usually a better deal than the cheapest one at 80%, because you won't have to try twice." },
    { t: "tip", title: "Tip", text: "Countries close to where you actually are tend to cause fewer extra security checks later." },
    { t: "h2", id: "buy-number", text: "Step 2: Buy the number" },
    { t: "ol", items: ["Open Virtual Number and choose WhatsApp.", "Pick the country and, if offered, the operator.", "Pay from your wallet or by card. The number appears instantly."] },
    { t: "cta" },
    { t: "h2", id: "enter-number", text: "Step 3: Enter the number in WhatsApp" },
    { t: "p", text: "Open WhatsApp, choose the country code that matches your number and paste the rest of it. Confirm, and WhatsApp sends the verification SMS." },
    { t: "figure", caption: "The country code in WhatsApp must match the number's country." },
    { t: "h2", id: "receive-code", text: "Step 4: Receive the code" },
    { t: "p", text: "Keep the order page open. The six-digit code usually arrives within 10 to 60 seconds and is shown in large type, ready to copy." },
    { t: "warn", title: "No code?", text: "If nothing arrives within 20 minutes, the number is cancelled and the full amount goes back to your wallet. Try another country or operator." },
    { t: "quote", text: "The fastest verification is the one you don't have to repeat: choose by success rate first, price second." },
    { t: "h2", id: "stay-safe", text: "Keep your account safe after sign-up" },
    { t: "ul", items: ["Turn on two-step verification in Settings → Account and set a PIN.", "Add a recovery email so you can get back in without SMS.", "Never reuse a one-time number for another important account."] },
    { t: "h2", id: "problems", text: "Common problems and fixes" },
    { t: "table", head: ["Problem", "Fix"], rows: [["\"This number is banned\"", "Cancel for a refund and pick another country."], ["Code arrives too late", "Request it again in WhatsApp; it shows on the same order."], ["Asked to verify again later", "Use a rented number instead of a one-time one."]] },
    { t: "p", text: "That's it. With the right country and two-step verification turned on, a virtual number works just like a regular one for WhatsApp." },
  ],
  faq: [
    { q: "Is it allowed to use a virtual number for WhatsApp?", a: "Yes. WhatsApp only needs a number that can receive its SMS once. Keep to WhatsApp's terms of service when using the account." },
    { q: "Can I use the same number again later?", a: "A one-time number is for one code. If you expect to verify again, rent a number for 7 to 30 days instead." },
    { q: "Does it work for WhatsApp Business?", a: "Yes, choose WhatsApp when buying; the same code works for both apps." },
  ],
};

// Stand-in body for posts without a sample text yet.
function stub(post: Post): Article {
  const product = products[post.cat];
  return {
    post, updated: post.date, author: team, lead: post.excerpt, tags: [], product,
    takeaways: [post.excerpt],
    body: [
      { t: "p", text: "This is placeholder text for the design. The real article will be loaded from the blog." },
      { t: "h2", id: "overview", text: "Overview" },
      { t: "p", text: post.excerpt },
      { t: "h2", id: "how-it-works", text: "How it works" },
      { t: "ol", items: ["Choose what you need.", "Pay from your wallet, by card or with crypto.", "Delivery shows up in your dashboard."] },
      { t: "cta" },
      { t: "h2", id: "tips", text: "Tips" },
      { t: "tip", title: "Need help?", text: "Our support team answers 24/7 on chat and Telegram." },
    ],
    faq: [],
  };
}

const withPage = (a: Article): ArticlePage => {
  const at = archive.indexOf(a.post);
  return {
    ...a,
    toc: a.body.filter((b): b is Extract<Block, { t: "h2" }> => b.t === "h2"),
    related: archive.filter((p) => p !== a.post && (p.cat === a.post.cat || p.cat === "guides")).slice(0, 3),
    next: archive[(at + 1) % archive.length],
  };
};

export function getArticle(slug: string): ArticlePage | null {
  const post = archive.find((p) => p.slug === slug);
  if (!post) return null;
  return withPage(post.slug === sample.post.slug ? sample : stub(post));
}

// The sample article, used by the design comparison pages.
export const sampleArticle = withPage(sample);
