import { Send, Instagram, Youtube, Twitter, type LucideIcon } from "lucide-react";
import { navGroups } from "./nav-en";

// Footer links. Services come from the header's nav data so both stay in sync.
export type FooterLink = { label: string; href: string };
export type FooterColumn = { title: string; links: FooterLink[] };

export const footerColumns: FooterColumn[] = [
  { title: "Virtual Numbers", links: navGroups.find((g) => g.id === "numbers")!.items.map((i) => ({ label: i.label, href: i.href })) },
  {
    title: "Accounts & Subscriptions",
    links: [
      ...navGroups.find((g) => g.id === "apple")!.items.map((i) => ({ label: i.label, href: i.href })),
      { label: "ChatGPT Plus", href: "/accounts/chatgpt-plus" },
      { label: "All subscriptions", href: "/accounts" },
    ],
  },
  {
    title: "Social Media Services",
    links: navGroups.find((g) => g.id === "social")!.items.map((i) => ({ label: i.label, href: i.href })),
  },
  {
    title: "Company",
    links: [
      { label: "About us", href: "/about-us" },
      { label: "Blog", href: "/blog" },
      { label: "Contact us", href: "/contact-us" },
      { label: "FAQ", href: "/faq" },
      // "Rules" (/rules) comes back here once that page is written.
    ],
  },
];

// Terms of service (/rules), Refund policy (/rules#refunds) and Privacy (/privacy) come back here once those pages
// are written; until then they would be 404s.
export const legalLinks: FooterLink[] = [];

export const socials: { label: string; href: string; icon: LucideIcon }[] = [
  { label: "Telegram", href: "#", icon: Send },
  { label: "Instagram", href: "#", icon: Instagram },
  { label: "YouTube", href: "#", icon: Youtube },
  { label: "X", href: "#", icon: Twitter },
];

export const footerBlurb = "Virtual numbers, Google Voice, Apple IDs, subscriptions and social growth, delivered instantly with a refund guarantee.";
export const supportEmail = "support@shopmajazi.com";
export const copyright = `© ${new Date().getFullYear()} ShopMajazi. All rights reserved.`;
