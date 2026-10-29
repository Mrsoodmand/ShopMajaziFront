// Long-form SEO copy for the home page content area, adapted from the current Persian home article.
// Every design renders all of this as server HTML, so search engines see the full text even when a panel is collapsed.

export type SeoSection = {
  id: string;
  heading: string;
  paragraphs: string[];
  bullets?: string[];
  link?: { label: string; href: string };
};

export const seoIntro = {
  heading: "ShopMajazi: the online store for digital services",
  lead: "ShopMajazi is a one-stop shop for the digital services people and businesses need to work online: virtual numbers for SMS verification, permanent Google Voice numbers, ready and custom Apple IDs, premium subscriptions, and social media growth for Telegram, Instagram, YouTube and TikTok.",
  updated: "Updated October 2026",
  readTime: "6 min read",
};

export const seoSections: SeoSection[] = [
  {
    id: "virtual-number",
    heading: "Buy a virtual number for SMS verification",
    paragraphs: [
      "Many apps and websites ask for a phone number before you can sign up. A virtual number lets you receive that verification code without using your personal SIM card. It is useful for keeping your private number private, managing several accounts, or signing up for services that are not available in your country.",
      "ShopMajazi numbers are delivered instantly from more than 150 countries and work with over 2,000 apps, including WhatsApp, Telegram, Instagram and Google. Once a number is sold, it is taken out of circulation, so nobody else can use it to access your account. If no code arrives, the cost goes back to your wallet automatically.",
    ],
    bullets: ["Numbers from 150+ countries", "Works with WhatsApp, Telegram, Instagram, Google and more", "Automatic refund if no SMS arrives"],
    link: { label: "Buy a virtual number", href: "/virtual-number" },
  },
  {
    id: "google-voice",
    heading: "Google Voice: a permanent US phone number",
    paragraphs: [
      "Most virtual numbers are for one-time use. If you need a number you can keep, a Google Voice number is the answer. It gives you a permanent United States number that can make calls, send texts and receive verification codes for years.",
      "A permanent US number is valuable for freelancers, online businesses and anyone working with international platforms. You can register on services that require a US number, stay reachable by clients abroad, and keep the same number as long as you use it. The number is fully yours and no one else has access to it.",
    ],
    link: { label: "Get a Google Voice number", href: "/google-voice" },
  },
  {
    id: "rent-number",
    heading: "Rent a number for days or weeks",
    paragraphs: [
      "Sometimes you need a number for longer than one code but don't need it forever. Renting a number gives you unlimited SMS for 7 to 30 days, and you can extend the rental at any time from your dashboard. It's a good fit for testing, short projects and accounts that ask you to verify more than once.",
    ],
    link: { label: "Rent a number", href: "/rent-number" },
  },
  {
    id: "apple-id",
    heading: "Buy a USA Apple ID, ready or custom",
    paragraphs: [
      "A US Apple ID unlocks apps, games and subscriptions that are only available in the US App Store. ShopMajazi offers two options: a ready-made USA Apple ID delivered instantly, or a custom USA Apple ID created with your own name and email address.",
      "Every Apple ID comes with a setup guide, and our support team can help with sign-in, two-factor authentication and any problems after purchase. Choose the custom option if you want the account to be fully under your own details from day one.",
    ],
    bullets: ["Ready USA Apple ID with instant delivery", "Custom USA Apple ID with your name and email", "Help with setup and 2FA"],
    link: { label: "Buy an Apple ID", href: "/apple-id" },
  },
  {
    id: "subscriptions",
    heading: "Premium subscriptions: ChatGPT, Netflix, Spotify and Canva",
    paragraphs: [
      "Paying for international subscriptions can be hard without a foreign card. ShopMajazi lets you buy ChatGPT Plus, Netflix Premium, Spotify Premium, Canva Pro and other services with local payment methods or crypto, activated on your own account or delivered as a ready account.",
    ],
    link: { label: "See all subscriptions", href: "/accounts" },
  },
  {
    id: "social-growth",
    heading: "Social media growth for Telegram, Instagram, YouTube and TikTok",
    paragraphs: [
      "A new channel or page needs a first audience before people take it seriously. Our social growth services help you get there with Telegram members and post views, Instagram followers and likes, YouTube views and subscribers, and TikTok followers.",
      "You only share the link to your channel, profile or post. We never ask for your password. Orders start within minutes, you can watch delivery live in your dashboard, and drops are refilled for free during the guarantee period.",
    ],
    link: { label: "Grow your account", href: "/virtual-service" },
  },
  {
    id: "why-shopmajazi",
    heading: "Why buy from ShopMajazi?",
    paragraphs: [
      "Since 2018 ShopMajazi has delivered more than a million orders. Delivery is automatic, prices are shown up front, and every order is covered by a refund guarantee. Real people answer support chat 24 hours a day, in English and Persian.",
    ],
    bullets: ["Instant, automatic delivery", "Refund guarantee on every order", "Card, crypto and wallet payments", "24/7 human support"],
  },
];
