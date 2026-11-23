import { CreditCard, HelpCircle, PackageCheck, UserRound, type LucideIcon } from "lucide-react";

// Contact us, About us and the FAQ page (src/design/info). Only facts the old Laravel pages already state:
// Mashhad office (Paj 1 tower), phone, email, started in 1400, Enamad, 50,000+ subscriptions delivered.
// Persian in i18n/fa/info.ts.

export const contact = {
  email: "support@shopmajazi.com",
  phone: "09302736430",
  phoneHref: "tel:+989302736430",
  telegram: "#", // no public handle in the codebase yet
  city: "Mashhad, Iran",
  address: "Paj 1 office tower, Mashhad",
};

export type ContactTopic = { id: string; label: string; icon: LucideIcon; faqCat: string };
export const contactTopics: ContactTopic[] = [
  { id: "order", label: "An order", icon: PackageCheck, faqCat: "general" },
  { id: "payment", label: "Payment or refund", icon: CreditCard, faqCat: "payments" },
  { id: "account", label: "My account", icon: UserRound, faqCat: "numbers" },
  { id: "other", label: "Something else", icon: HelpCircle, faqCat: "general" },
];

export const aboutStory = [
  "ShopMajazi started in 1400 with one goal: to make international services reachable for people in Iran, despite the sanctions.",
  "PayPal is closed to us, Visa and Mastercard don't work, there's no Western Union, and even accounts abroad get shut. So we find the ways that do work, and hand them to you ready to use.",
  "Our team works around the clock to keep prices fair and to stand behind every account we deliver.",
];

export const aboutFacts = [
  { value: "1400", label: "The year we started" },
  { value: "50,000+", label: "Subscriptions delivered" },
  { value: "24/7", label: "Support, every day" },
];

export const aboutValues = [
  { title: "Fair prices", text: "We look for the cheapest way that still works well, so the service is within reach for everyone." },
  { title: "Real support", text: "A real person answers you, before and after you buy, and stays until it's sorted." },
  { title: "Trusted and registered", text: "We hold the Enamad trust badge from the Ministry of Industry, Mine and Trade." },
];

export const aboutTimeline = [
  { when: "The problem", text: "PayPal, Visa and Mastercard closed to Iranians; buying any international service turned into a headache." },
  { when: "1400", text: "ShopMajazi opens in Mashhad to fix exactly that." },
  { when: "Enamad", text: "We receive the Enamad trust badge from the Ministry of Industry, Mine and Trade." },
  { when: "Today", text: "More than 50,000 subscriptions delivered, and our team still answers every message." },
];
