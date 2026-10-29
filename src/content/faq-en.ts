// Frequently asked questions for the home page FAQ section. Placeholder answers until support signs off the wording.

export type FaqCategory = { id: string; label: string };
export type Faq = { id: string; cat: string; q: string; a: string };

export const faqCategories: FaqCategory[] = [
  { id: "general", label: "General" },
  { id: "numbers", label: "Virtual Numbers" },
  { id: "apple", label: "Apple ID" },
  { id: "subs", label: "Subscriptions" },
  { id: "telegram", label: "Telegram" },
  { id: "social", label: "Social Media Services" },
  { id: "payments", label: "Payments & Refunds" },
];

export const faqs: Faq[] = [
  { id: "what", cat: "general", q: "What is ShopMajazi?", a: "ShopMajazi is an online store for digital services: virtual numbers for SMS verification, permanent Google Voice numbers, USA Apple IDs, premium subscriptions and social media growth. Everything is delivered automatically to your dashboard." },
  { id: "speed", cat: "general", q: "How fast is delivery?", a: "Most orders are delivered automatically within 30 seconds. Custom Apple IDs and some subscriptions are prepared by our team and usually take under an hour." },
  { id: "account", cat: "general", q: "Do I need an account to buy?", a: "Yes. A free account keeps your numbers, codes, logins and order history in one place, and lets you top up a wallet for one-click purchases." },
  { id: "otp", cat: "numbers", q: "How does a virtual number for verification work?", a: "Pick the app (for example WhatsApp or Telegram) and a country, pay, and you get a number instantly. Enter it in the app, and the SMS code appears in your dashboard within seconds." },
  { id: "nocode", cat: "numbers", q: "What if the verification code never arrives?", a: "If no SMS arrives within 20 minutes, the number is cancelled and the full amount goes back to your wallet automatically. You can then try another number or country." },
  { id: "gv", cat: "numbers", q: "What's the difference between a virtual number and Google Voice?", a: "A virtual number is for receiving one verification code. A Google Voice number is a permanent US number that you keep, with calls and texts, for as long as you use it." },
  { id: "rent", cat: "numbers", q: "Can I keep a number for more than one code?", a: "Yes. Rent a number for 7 to 30 days to receive unlimited SMS, and extend the rental from your dashboard at any time." },
  { id: "custom", cat: "apple", q: "What's a custom USA Apple ID?", a: "It's a US Apple ID created with your own name and email address, so the account is fully under your details from day one. A ready USA Apple ID is delivered instantly with details we provide." },
  { id: "subsown", cat: "subs", q: "Are subscriptions activated on my own account?", a: "For most services, like ChatGPT Plus and Spotify, yes: we activate the plan on your own account. For a few services you receive a ready account instead. Each product page says which." },
  { id: "tgpremium", cat: "telegram", q: "How is Telegram Premium activated?", a: "We send Premium to your @username as a Telegram gift, so we never need your login or phone number. It's active the moment the gift arrives, for 3, 6 or 12 months." },
  { id: "tggift", cat: "telegram", q: "Can I buy Telegram Premium for someone else?", a: "Yes. Enter their @username at checkout and the gift goes straight to them." },
  { id: "tgads", cat: "telegram", q: "How do Telegram Ads work?", a: "Telegram Ads are short sponsored messages shown in large public channels. Send us your link, ad text and the channels or topics you want to reach; we set up and run the campaign, and you follow its views and clicks in your dashboard." },
  { id: "password", cat: "social", q: "Do you need my password for social growth?", a: "No. You only share the link to your channel, profile or post. We never ask for passwords." },
  { id: "drop", cat: "social", q: "What happens if followers or members drop?", a: "Drops during the guarantee period are refilled for free. You can track delivery and refills live in your dashboard." },
  { id: "pay", cat: "payments", q: "Which payment methods do you accept?", a: "You can pay by card or with crypto, or use your wallet balance. Topping up the wallet once lets you buy any service in one click." },
  { id: "refund", cat: "payments", q: "How do refunds work?", a: "If an order can't be delivered, the amount is returned to your wallet automatically. For anything else, open a support ticket and our team will review it within 24 hours." },
];

export const faqSupport = { telegram: "#", email: "support@shopmajazi.com", chat: "/contact-us" };
