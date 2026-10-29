// Content for the sections shared by every service page: how to use, the long-form content area, comments, FAQ and
// related blog posts. One entry per service; a new service only needs a new entry here.
// PLACEHOLDER text and comments: the live site will load comments from the Laravel `comments` table (type "page",
// approved only) and the content/FAQ from each page's settings.

import type { BlogCat } from "./blog-en";
import { gvFaq } from "./google-voice-en";
import { rentFaq } from "./rent-en";
import { appleFaq } from "./apple-en";
import { subBySlug, subsFaq } from "./subs-en";
import { makeT, type T } from "@/i18n/translate";
import { tgFaq } from "./telegram-en";

// "apple-id" is the general Apple ID page; "apple-id-usa" and "apple-id-custom" have their own content so the three
// addresses aren't duplicates of each other for search engines.
export type ServiceId = "virtual-number" | "rent-number" | "google-voice" | "apple-id" | "apple-id-usa" | "apple-id-custom" | "subscriptions" | "telegram-stars" | "telegram-premium";

export type ServiceComment = { id: string; name: string; date: string; text: string; replies?: { name: string; date: string; text: string; staff?: boolean }[] };

export type ServiceExtras = {
  name: string;
  howTo: { title: string; text: string }[];
  content: { id: string; title: string; paragraphs: string[] }[];
  faq: { q: string; a: string }[];
  comments: ServiceComment[];
  blogCat: BlogCat;
};

const otpFaq = [
  { q: "What is a virtual number for verification?", a: "A temporary phone number that receives one SMS code, so you can sign up for an app without using your own SIM." },
  { q: "What if the code never arrives?", a: "If no SMS arrives within 20 minutes, the number is cancelled and the full amount goes back to your wallet automatically." },
  { q: "Can I use the number again later?", a: "A one-time number is for one code. To log in again later, rent a number for 7 to 30 days instead." },
  { q: "Which apps does it work with?", a: "More than 2,000, including WhatsApp, Telegram, Google, Instagram and ChatGPT. Each app shows its success rate per country." },
  { q: "How do I choose the best country?", a: "Pick by success rate first and price second. A slightly more expensive number that works on the first try saves time." },
];

const support = (text: string) => ({ name: "ShopMajazi support", date: "", text, staff: true });

export const serviceExtras: Record<ServiceId, ServiceExtras> = {
  "virtual-number": {
    name: "Virtual Number",
    howTo: [
      { title: "Choose the app", text: "Pick the app you want to verify, like WhatsApp or Telegram." },
      { title: "Choose country and operator", text: "Each shows its price and how often codes arrive." },
      { title: "Enter the number in the app", text: "Copy the number and paste it where the app asks for your phone." },
      { title: "Copy your code", text: "The SMS code appears on the order page within seconds. No code means a refund." },
    ],
    content: [
      { id: "what", title: "What is a virtual number?", paragraphs: [
        "A virtual number is a real phone number that lives online instead of in a SIM card. You rent it for a few minutes, use it to receive one verification SMS, and it's gone. Your personal number never touches the app.",
        "It's the quickest way to create an account on WhatsApp, Telegram, Google or thousands of other services, from any country, without a local SIM.",
      ] },
      { id: "why", title: "Why use one?", paragraphs: [
        "Privacy is the big one: apps can't link the account to your personal phone. It also helps when an app isn't available with your own number, or when you manage several accounts for work.",
      ] },
      { id: "choose", title: "How to choose a country", paragraphs: [
        "Every country lists a success rate from the last 24 hours. Choose by that first. Countries close to where you are tend to trigger fewer extra checks later.",
        "If a number doesn't receive a code, it's cancelled automatically and the money returns to your wallet, so trying another country costs nothing.",
      ] },
      { id: "safe", title: "Keeping your account safe", paragraphs: [
        "After signing up, turn on two-step verification in the app and add a recovery email. That way you never need the same number again to get back in.",
      ] },
    ],
    faq: otpFaq,
    comments: [
      { id: "c1", name: "Ali R.", date: "2 days ago", text: "The Telegram code came in about 20 seconds. Second time buying here.", replies: [support("Thanks Ali, glad it worked first time!")] },
      { id: "c2", name: "Neda K.", date: "1 week ago", text: "First country didn't get a code, but the refund was instant and the second one worked." },
      { id: "c3", name: "Customer M.", date: "2 weeks ago", text: "Does it work for WhatsApp Business too?", replies: [support("Yes, choose WhatsApp when buying; the same code works for both apps.")] },
    ],
    blogCat: "numbers",
  },
  "rent-number": {
    name: "Rent Number",
    howTo: [
      { title: "Choose all apps or one app", text: "All apps takes SMS from any sender; one app is cheaper." },
      { title: "Pick the period and country", text: "From one week to a month. Longer is cheaper per day." },
      { title: "Use the number anywhere", text: "Sign up or log in as often as you need during the rental." },
      { title: "Read every SMS", text: "Messages show up in your inbox here. Extend before it ends to keep the number." },
    ],
    content: [
      { id: "what", title: "What is a rented number?", paragraphs: [
        "A rented number stays yours for the whole rental, from a week to a month. Every SMS sent to it lands in your inbox, so you can log in again, reset a password or verify several accounts with the same number.",
      ] },
      { id: "vs", title: "Rent or one-time number?", paragraphs: [
        "If you need one code, a one-time virtual number is cheaper. If the app may ask you to verify again, or you're setting up more than one service, renting saves you from losing access later.",
      ] },
      { id: "methods", title: "All apps or one app", paragraphs: [
        "An all-apps rental receives messages from any sender. A one-app rental only receives that app's codes and costs less. Pick one app if you know exactly what you need it for.",
      ] },
      { id: "end", title: "When the rental ends", paragraphs: [
        "Extend any time before the end date and the number stays the same. Once a rental ends, the number may go to someone else, so move important accounts to a permanent number like Google Voice.",
      ] },
    ],
    faq: rentFaq,
    comments: [
      { id: "c1", name: "Sina T.", date: "3 days ago", text: "Rented a UK number for a month to verify a few accounts. Every code came through.", replies: [support("Thanks Sina! You can extend it from your orders any time.")] },
      { id: "c2", name: "Customer P.", date: "2 weeks ago", text: "The one-app option is a nice touch, cheaper for just WhatsApp." },
    ],
    blogCat: "numbers",
  },
  "google-voice": {
    name: "Google Voice",
    howTo: [
      { title: "Pick your number", text: "Search by city, area code or digits you like." },
      { title: "Pay once", text: "Wallet, card or crypto. No monthly fee." },
      { title: "Sign in to Google Voice", text: "Use the Gmail and password from your order in the Voice app or voice.google.com." },
      { title: "Make it yours", text: "Change the password and recovery email, and use the number every few weeks." },
    ],
    content: [
      { id: "what", title: "What is Google Voice?", paragraphs: [
        "Google Voice is a US phone service from Google. Your number rings in an app on your phone or computer, so you can call, text and receive verification codes from anywhere in the world.",
        "Each number we sell comes on its own Google account, which you take over completely.",
      ] },
      { id: "uses", title: "What people use it for", paragraphs: [
        "A permanent US number for banks and services that need one, a second number for work, or a way to keep receiving codes for years without renting again.",
      ] },
      { id: "keep", title: "Keeping the number", paragraphs: [
        "Google may reclaim numbers that aren't used for about three months. Make a call or send a text every few weeks and the number stays yours.",
      ] },
    ],
    faq: gvFaq,
    comments: [
      { id: "c1", name: "Reza M.", date: "5 days ago", text: "Got a 415 number, logged in on my phone in a minute. Calls work fine from abroad.", replies: [support("Great to hear, Reza. Remember to use it every few weeks.")] },
      { id: "c2", name: "Customer S.", date: "3 weeks ago", text: "Can I change the recovery email?", replies: [support("Yes, and you should: Google Account → Security → Recovery email.")] },
    ],
    blogCat: "numbers",
  },
  "apple-id": {
    name: "Apple ID",
    howTo: [
      { title: "Choose ready or custom", text: "Ready arrives instantly; custom is made with your own name and email." },
      { title: "Pay", text: "Wallet, card or crypto." },
      { title: "Sign in on your device", text: "Use the Apple ID and password from your order in the App Store or Settings." },
      { title: "Secure it", text: "Change the password and security questions to your own." },
    ],
    content: [
      { id: "why", title: "Why a US Apple ID?", paragraphs: [
        "Many apps, games and subscriptions are only in the US App Store. A US Apple ID lets you download them on any iPhone, iPad or Mac, wherever you live.",
      ] },
      { id: "ready-custom", title: "Ready or custom?", paragraphs: [
        "A ready Apple ID is created in advance and delivered the moment you pay. A custom one is made with your own name, email and birthday, which makes it easier to recover later and better for long-term use.",
      ] },
      { id: "after", title: "After you sign in", paragraphs: [
        "Change the password and security questions, add a trusted phone number, and turn on two-factor authentication. Your purchases and iCloud data then stay under your control.",
      ] },
    ],
    faq: appleFaq,
    comments: [
      { id: "c1", name: "Mina A.", date: "1 day ago", text: "Custom Apple ID with my own email arrived in about 8 minutes. Very clear guide.", replies: [support("Thank you Mina!")] },
      { id: "c2", name: "Customer H.", date: "1 week ago", text: "Bought 3 ready ones for the family, all worked on the first sign-in." },
      { id: "c3", name: "Arash N.", date: "2 weeks ago", text: "Can I add a credit card later?", replies: [support("Yes, any payment method the US App Store accepts can be added in your account settings.")] },
    ],
    blogCat: "apple",
  },
  "apple-id-usa": {
    name: "USA Apple ID",
    howTo: [
      { title: "Choose how many", text: "One for yourself, up to ten for family, or a partner pack." },
      { title: "Pay", text: "The Apple ID is delivered the moment payment goes through." },
      { title: "Sign in", text: "On iPhone: Settings → Sign in, or sign in only to the App Store to keep your own iCloud." },
      { title: "Change the password", text: "Set your own password and security answers right away." },
    ],
    content: [
      { id: "what", title: "What is a ready USA Apple ID?", paragraphs: [
        "It's a United States Apple ID created and verified in advance, so it can be delivered instantly. You get the email, password, date of birth and security answers, and it works on any iPhone, iPad or Mac.",
      ] },
      { id: "store", title: "Using only the App Store", paragraphs: [
        "You don't have to change the Apple ID on your whole phone. In Settings → your name → Media & Purchases, sign out and sign in with the US account. Your photos, contacts and iCloud stay on your own Apple ID; only App Store downloads use the US one.",
      ] },
      { id: "bulk", title: "Buying several at once", paragraphs: [
        "Families and small businesses often buy a few at a time. For 30 or more, partner packs cost less per Apple ID and are delivered together, with a download of all the logins.",
      ] },
      { id: "limits", title: "What a ready Apple ID can't do", paragraphs: [
        "The email address belongs to the account we created, so password recovery goes through the security questions. If you want the account under your own email and name from day one, choose a custom Apple ID instead.",
      ] },
    ],
    faq: [
      { q: "How fast is a ready USA Apple ID delivered?", a: "Instantly. The login appears on your order page as soon as payment goes through." },
      { q: "Can I use it only for the App Store?", a: "Yes. Sign in under Media & Purchases and keep your own Apple ID for iCloud, photos and messages." },
      { q: "Can I buy more than ten?", a: "Yes, with partner packs of 30, 50, 100 or 200, which cost less per Apple ID." },
      { q: "What if the login doesn't work?", a: "Tell support from your order page; we check it right away and replace it or refund you." },
    ],
    comments: [
      { id: "c1", name: "Kian F.", date: "4 days ago", text: "Signed in to the App Store only, kept my own iCloud. Exactly what I needed for one US app.", replies: [support("That's the way we recommend, thanks Kian!")] },
      { id: "c2", name: "Customer L.", date: "2 weeks ago", text: "Bought a pack of 30 for my shop, all delivered together with a spreadsheet." },
    ],
    blogCat: "apple",
  },
  "apple-id-custom": {
    name: "Custom Apple ID",
    howTo: [
      { title: "Enter your details", text: "First and last name, the email you want to use and your date of birth." },
      { title: "Pick a password, or skip", text: "Leave it empty and we'll create a strong one." },
      { title: "Pay and wait about 10 minutes", text: "We create the Apple ID with your details; you can leave the page." },
      { title: "Sign in", text: "Use your own email and the password from your order." },
    ],
    content: [
      { id: "what", title: "What is a custom Apple ID?", paragraphs: [
        "A custom Apple ID is a United States Apple ID created especially for you, with your own first and last name, your own email address and your own date of birth. From day one, the account is under your details.",
      ] },
      { id: "why", title: "Why your own email matters", paragraphs: [
        "Apple sends password resets and security alerts to the account's email. With your own address, you can always recover the account yourself, which makes a custom Apple ID the better choice for long-term use, purchases and iCloud.",
      ] },
      { id: "details", title: "Which details to use", paragraphs: [
        "Use your real name and an email address you can open; Apple may send a confirmation to it. Your date of birth must make you at least 13. If you choose a password, it needs 8 or more characters with an uppercase letter, a lowercase letter and a number.",
      ] },
      { id: "timing", title: "How long it takes", paragraphs: [
        "Most custom Apple IDs are ready in about 10 minutes. The login appears on your order page and you can leave the page in the meantime.",
      ] },
    ],
    faq: [
      { q: "How long does a custom Apple ID take?", a: "About 10 minutes on average. The login appears on your order page when it's ready." },
      { q: "Does my email need to be new?", a: "It must not already be used for another Apple ID. Any email address you can open works, including Gmail or Outlook." },
      { q: "Do I have to give a password?", a: "No. Leave it empty and we create a strong one; you can change it any time." },
      { q: "Can I change my name or birthday later?", a: "Name yes, in your Apple account settings. Apple doesn't let you change the date of birth on most accounts, so enter it correctly." },
    ],
    comments: [
      { id: "c1", name: "Sara T.", date: "2 days ago", text: "Made with my Outlook address, ready in 9 minutes. Recovery emails come to me now.", replies: [support("Glad it's all yours, Sara!")] },
      { id: "c2", name: "Customer D.", date: "1 week ago", text: "Can I use an email that already had an Apple ID?", replies: [support("No, the email has to be new to Apple. Any other address you can open works.")] },
    ],
    blogCat: "apple",
  },
  "telegram-stars": {
    name: "Telegram Stars",
    howTo: [
      { title: "Enter the username", text: "Yours or a friend's. We check the account exists before anything is sent." },
      { title: "Choose how many Stars", text: "Pick a pack or type any amount from 50 to 100,000. From 1,000 Stars each one costs less." },
      { title: "Pay", text: "Wallet, card or crypto." },
      { title: "Open Telegram", text: "The Stars arrive in 1 to 5 minutes. Check them in Settings, then My Stars." },
    ],
    content: [
      { id: "what", title: "What are Telegram Stars?", paragraphs: [
        "Stars are Telegram's own currency. You use them to pay inside bots and mini apps, send collectible gifts, react to posts with paid reactions and unlock paid photos and videos from creators.",
      ] },
      { id: "why", title: "Why buy them here?", paragraphs: [
        "Buying Stars inside Telegram needs an app-store payment or a Fragment account with TON. Here you pay with your wallet, a local card or crypto, and we send the Stars straight to the username you enter. We never ask for your login or a code.",
      ] },
      { id: "price", title: "Pay less for bigger orders", paragraphs: [
        "The price per Star drops as the order grows: about 6% less from 1,000 Stars, 10% from 5,000 and 14% from 25,000. The saving shows on each pack and in your order before you pay.",
      ] },
    ],
    faq: tgFaq.stars,
    comments: [
      { id: "c1", name: "Reza K.", date: "2 days ago", text: "Sent 1,000 Stars to my brother's account, arrived in about two minutes.", replies: [support("Thanks Reza, glad it was quick!")] },
      { id: "c2", name: "Customer S.", date: "5 days ago", text: "Good that it checks the username first, I had a typo and it caught it." },
      { id: "c3", name: "Nazanin T.", date: "1 week ago", text: "Can I use the Stars in any bot?", replies: [support("Yes, in any bot or mini app that accepts Telegram Stars.")] },
    ],
    blogCat: "telegram",
  },
  "telegram-premium": {
    name: "Telegram Premium",
    howTo: [
      { title: "Choose who it's for", text: "Your own account or a friend's. Either way we only need the username." },
      { title: "Pick 3, 6 or 12 months", text: "Longer plans cost less per month." },
      { title: "Pay", text: "Wallet, card or crypto." },
      { title: "Open Telegram", text: "Premium is active in a few minutes. A gift arrives as a message from Telegram." },
    ],
    content: [
      { id: "what", title: "What Telegram Premium adds", paragraphs: [
        "Premium removes ads in public channels, doubles upload size to 4 GB, lifts download speed limits, turns voice messages into text and doubles most limits, from folders to pinned chats. You also get an emoji status, premium stickers and a star next to your name.",
      ] },
      { id: "gift", title: "Gifted to your username", paragraphs: [
        "We send Premium as a Telegram gift to the username you enter, so it lands on the account you already use, with all your chats. We never ask for a password or a login code, and you can send it to a friend the same way.",
      ] },
      { id: "plans", title: "Which plan to choose", paragraphs: [
        "Three months is the easiest way to try it. Twelve months costs the least per month. If you already have Premium, the new months are added after your current period ends.",
      ] },
    ],
    faq: tgFaq.premium,
    comments: [
      { id: "c1", name: "Sina M.", date: "3 days ago", text: "Gifted 12 months to my sister, she had it a few minutes later.", replies: [support("Thanks Sina, enjoy!")] },
      { id: "c2", name: "Customer L.", date: "1 week ago", text: "Activated on my own account, no login needed. Voice to text is great." },
    ],
    blogCat: "telegram",
  },
  subscriptions: {
    name: "Subscriptions",
    howTo: [
      { title: "Pick a subscription", text: "Filter by category or search: ChatGPT, Netflix, Spotify, Canva and more." },
      { title: "Choose a plan", text: "Monthly or longer; longer plans cost less per month." },
      { title: "Enter your account", text: "For most services, just the email of your own account. Never a password." },
      { title: "Pay and enjoy", text: "Ready accounts arrive instantly; activations usually take 15 to 60 minutes." },
    ],
    content: [
      { id: "what", title: "Premium subscriptions without a foreign card", paragraphs: [
        "Many of the best apps only take international cards. ShopMajazi lets you pay with your wallet, a local card or crypto, and we take care of the subscription for you.",
      ] },
      { id: "own", title: "On your account or a ready account", paragraphs: [
        "Most subscriptions are activated on your own account: you give us the email or username, and the plan appears on it. Your history, playlists and files stay yours. A few services, like Netflix and Adobe, come as a ready account with its own login instead.",
      ] },
      { id: "safe", title: "Safe by design", paragraphs: [
        "We never ask for your password. If something stops working before the plan ends, support fixes it, replaces it or refunds the unused time.",
      ] },
    ],
    faq: subsFaq,
    comments: [
      { id: "c1", name: "Parisa J.", date: "3 days ago", text: "ChatGPT Plus on my own account in about 10 minutes. All my chats were still there.", replies: [support("Thanks Parisa, enjoy!")] },
      { id: "c2", name: "Customer V.", date: "1 week ago", text: "Spotify yearly plan is great value. Playlists untouched." },
    ],
    blogCat: "guides",
  },
};

// Content for one subscription's own page (/accounts/{slug}), built from the product so every page reads differently
// and isn't a duplicate of /accounts. "subs:{slug}" keys look it up.
function subsExtras(slug: string, t: T): ServiceExtras | null {
  const raw = subBySlug(slug);
  if (!raw) return null;
  const p = t.tr(raw);
  const own = p.activation === "own";
  const field = p.fields.find((f) => !f.options);
  // English: "Email of your Spotify account" → "the email of your Spotify account"; Persian uses the field label as is.
  const need = t.locale === "fa" ? (field ? field.label : t("your account email"))
    : field ? (/^your /i.test(field.label) ? `y${field.label.slice(1)}` : `the ${field.label.charAt(0).toLowerCase()}${field.label.slice(1)}`) : "your account email";
  const cheapest = p.plans.reduce((a, b) => (b.price < a.price ? b : a));
  const longest = p.plans.reduce((a, b) => (b.months > a.months ? b : a));
  const sentence = (...parts: string[]) => parts.join(t.locale === "fa" ? "، " : ". ") + ".";
  return t.tr({
    name: p.name,
    howTo: [
      { title: t("Choose a {0} plan", { 0: p.name }), text: p.plans.map((pl) => `${pl.name} ${t.usd(pl.price)}`).join(" · ") },
      own
        ? { title: field ? field.label : "Your account", text: field?.hint ?? t("We activate {0} on your own account.", { 0: p.name }) }
        : { title: "No details needed", text: t("We deliver a ready {0} account.", { 0: p.name }) },
      { title: "Pay", text: "Wallet, card or crypto." },
      own
        ? { title: t("Open {0}", { 0: p.name }), text: t("The plan appears on your account {0}.", { 0: t.locale === "fa" ? p.delivery : p.delivery.toLowerCase() }) }
        : { title: "Sign in", text: "The login is on your order page, ready to copy." },
    ],
    content: [
      { id: "what", title: t("What you get with {0}", { 0: p.name }), paragraphs: [sentence(p.tagline, ...p.notes)] },
      { id: "how", title: own ? "Activated on your own account" : "A ready account, delivered to you", paragraphs: [own
        ? t("You keep using your own {0} account; we only need {1}. You never share a password, and everything already on the account stays as it is.", { 0: p.name, 1: need })
        : t("You receive a working {0} login on your order page. There's nothing to set up on your side; sign in and start using it.", { 0: p.name })] },
      { id: "plans", title: "Which plan to choose", paragraphs: [p.plans.length > 1
        ? t("The {0} plan costs {1}.", { 0: cheapest.name, 1: t.usd(cheapest.price) }) + " " + t("{0} works out cheapest per month at {1}.", { 0: longest.name, 1: t.usd(longest.price / longest.months) })
          + (longest.was ? " " + t("That saves {0}%.", { 0: Math.round((1 - longest.price / longest.was) * 100) }) : "")
        : t("{0} comes as {1} for {2}.", { 0: p.name, 1: cheapest.name, 2: t.usd(cheapest.price) })] },
    ],
    faq: [
      { q: t("How long does {0} take?", { 0: p.name }), a: `${p.delivery}. ${t(own ? "You'll see the plan on your account once it's active." : "The login appears on your order page.")}` },
      own
        ? { q: t("Do you need my {0} password?", { 0: p.name }), a: t("No. Only {0}. Never share your password with anyone.", { 0: need }) }
        : { q: "Can I change the password?", a: "Shared ready accounts must keep their password; private profiles can set their own PIN." },
      { q: t("What if {0} stops working?", { 0: p.name }), a: "Tell support from your order page. We fix it, replace it or refund the unused time." },
    ],
    comments: [
      { id: `${p.slug}-1`, name: "Customer R.", date: "5 days ago", text: t("{0} {1} quickly, exactly as described.", { 0: p.name, 1: t(own ? "was activated on my account" : "login arrived") }), replies: [support("Thanks for the feedback!")] },
    ],
    blogCat: p.cat === "ai" ? "news" : "guides",
  });
}

// Any extras key: a fixed service, or "subs:{slug}" for a subscription's own page.
// `t` translates the result (English when left out).
export function extrasFor(id: string, t: T = makeT("en")): ServiceExtras {
  if (id.startsWith("subs:")) return subsExtras(id.slice(5), t) ?? t.tr(serviceExtras.subscriptions);
  return t.tr(serviceExtras[id as ServiceId]);
}
