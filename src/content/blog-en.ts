// Placeholder posts for the home page blog section. The live site will load the latest posts from the Laravel blog
// (HomeController already fetches the 12 newest), with their real cover images.

export type BlogCat = "guides" | "numbers" | "apple" | "telegram" | "social" | "news";
export type Post = { slug: string; cat: BlogCat; title: string; excerpt: string; date: string; read: string };

export const blogCats: { id: BlogCat; label: string }[] = [
  { id: "guides", label: "Guides" },
  { id: "numbers", label: "Virtual Numbers" },
  { id: "apple", label: "Apple ID" },
  { id: "telegram", label: "Telegram" },
  { id: "social", label: "Social Media Services" },
  { id: "news", label: "Tech News" },
];

export const posts: Post[] = [
  { slug: "whatsapp-virtual-number-guide", cat: "numbers", title: "How to verify WhatsApp with a virtual number (2026 guide)", excerpt: "Step by step: picking the right country, receiving the code, and keeping your account safe after sign-up.", date: "Oct 12, 2026", read: "6 min" },
  { slug: "google-voice-vs-virtual-number", cat: "numbers", title: "Google Voice vs. one-time virtual numbers: which do you need?", excerpt: "A permanent US line or a single code? We compare price, lifespan and the apps each one works with.", date: "Oct 8, 2026", read: "5 min" },
  { slug: "custom-us-apple-id", cat: "apple", title: "Custom USA Apple ID: what it is and why it's safer", excerpt: "Why an Apple ID made with your own name and email is easier to recover, and how 2FA works with it.", date: "Oct 3, 2026", read: "4 min" },
  { slug: "grow-telegram-channel", cat: "telegram", title: "10 ways to grow a Telegram channel from zero", excerpt: "Content, cross-promotion, timing and where paid members fit in. A practical playbook for new channels.", date: "Sep 28, 2026", read: "8 min" },
  { slug: "chatgpt-plus-payment", cat: "guides", title: "Paying for ChatGPT Plus without a foreign card", excerpt: "The options that work today, what to watch out for, and how activation on your own account works.", date: "Sep 21, 2026", read: "5 min" },
  { slug: "instagram-algorithm-2026", cat: "news", title: "What changed in Instagram's algorithm this year", excerpt: "Reels reach, the new originality signals and what they mean for small creators.", date: "Sep 15, 2026", read: "7 min" },
  { slug: "keep-accounts-secure", cat: "guides", title: "5 habits that keep your online accounts secure", excerpt: "Password managers, 2FA apps, recovery emails and why you should never reuse a verification number.", date: "Sep 9, 2026", read: "4 min" },
];

export const postHref = (p: Post) => `/blog/${p.slug}`;
export const catLabel = (id: BlogCat) => blogCats.find((c) => c.id === id)!.label;
