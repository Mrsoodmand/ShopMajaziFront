import type { ComponentType } from "react";
import HeroA from "./hero/HeroA";
import HeroB from "./hero/HeroB";
import HeroC from "./hero/HeroC";
import HeroD from "./hero/HeroD";
import HeroE from "./hero/HeroE";
import HeroF from "./hero/HeroF";
import HeroG from "./hero/HeroG";
import HeroH from "./hero/HeroH";
import HeroI from "./hero/HeroI";
import HeroJ from "./hero/HeroJ";
import HeroK from "./hero/HeroK";
import HowA from "./how/HowA";
import HowB from "./how/HowB";
import HowC from "./how/HowC";
import HowD from "./how/HowD";
import { HowEDefault, ArrowChip, ArrowOrb, ArrowFlow, ArrowChevrons, ArrowRail } from "./how/arrows";
import SeoA from "./seo/SeoA";
import SeoB from "./seo/SeoB";
import SeoC from "./seo/SeoC";
import SeoD from "./seo/SeoD";
import SeoE from "./seo/SeoE";
import HeaderA from "./header/HeaderA";
import HeaderB from "./header/HeaderB";
import HeaderC from "./header/HeaderC";
import HeaderD from "./header/HeaderD";
import HeaderE from "./header/HeaderE";
import HeaderF from "./header/HeaderF";
import HeaderG from "./header/HeaderG";
import HeaderContext from "./header/context";
import FaqA from "./faq/FaqA";
import FaqB from "./faq/FaqB";
import FaqC from "./faq/FaqC";
import FaqD from "./faq/FaqD";
import FaqE from "./faq/FaqE";
import FaqF from "./faq/FaqF";
import BlogA from "./blog/BlogA";
import BlogB from "./blog/BlogB";
import BlogC from "./blog/BlogC";
import BlogD from "./blog/BlogD";
import BlogE from "./blog/BlogE";
import PopA from "./popular/PopA";
import PopB from "./popular/PopB";
import PopC from "./popular/PopC";
import PopD from "./popular/PopD";
import PopE from "./popular/PopE";
import WhyA from "./why/WhyA";
import WhyB from "./why/WhyB";
import WhyC from "./why/WhyC";
import WhyD from "./why/WhyD";
import WhyE from "./why/WhyE";
import TestiA from "./testimonials/TestiA";
import TestiB from "./testimonials/TestiB";
import TestiC from "./testimonials/TestiC";
import TestiD from "./testimonials/TestiD";
import TestiE from "./testimonials/TestiE";
import OtpA from "./otp/OtpA";
import OtpB from "./otp/OtpB";
import OtpC from "./otp/OtpC";
import OtpD from "./otp/OtpD";
import OtpE from "./otp/OtpE";
import OtpF from "./otp/OtpF";
import OtpG from "./otp/OtpG";
import OtpH from "./otp/OtpH";
import OtpI from "./otp/OtpI";
import OtpJ from "./otp/OtpJ";
import OtpK from "./otp/OtpK";
import OtpL from "./otp/OtpL";
import OtpM from "./otp/OtpM";
import OtpN from "./otp/OtpN";
import OtpO from "./otp/OtpO";
import FooterA from "./footer/FooterA";
import FooterB from "./footer/FooterB";
import FooterC from "./footer/FooterC";
import FooterD from "./footer/FooterD";
import FooterE from "./footer/FooterE";
import BlogListA from "./blogList/BlogListA";
import BlogListB from "./blogList/BlogListB";
import BlogListC from "./blogList/BlogListC";
import BlogListD from "./blogList/BlogListD";
import BlogListE from "./blogList/BlogListE";
import BlogListF from "./blogList/BlogListF";
import BlogPostA from "./blogPost/BlogPostA";
import BlogPostB from "./blogPost/BlogPostB";
import BlogPostC from "./blogPost/BlogPostC";
import BlogPostD from "./blogPost/BlogPostD";
import BlogPostE from "./blogPost/BlogPostE";
import GvA from "./googleVoice/GvA";
import GvB from "./googleVoice/GvB";
import GvC from "./googleVoice/GvC";
import GvD from "./googleVoice/GvD";
import GvE from "./googleVoice/GvE";
import GvF from "./googleVoice/GvF";
import GvG from "./googleVoice/GvG";
import GvH from "./googleVoice/GvH";
import GvI from "./googleVoice/GvI";
import GvJ from "./googleVoice/GvJ";
import RentA from "./rent/RentA";
import RentB from "./rent/RentB";
import RentC from "./rent/RentC";
import RentD from "./rent/RentD";
import RentE from "./rent/RentE";
import RentF from "./rent/RentF";
import RentG from "./rent/RentG";
import RentH from "./rent/RentH";
import RentI from "./rent/RentI";
import RentJ from "./rent/RentJ";
import OtpCatalog from "./numbers/OtpCatalog";
import RentCatalog from "./numbers/RentCatalog";
import GvCatalog from "./numbers/GvCatalog";
import { GvCardA, GvCardB, GvCardC, GvCardD, GvCardE, GvCardNow } from "./numbers/gvCardOffers";
import { OtpPanelA, OtpPanelB, OtpPanelC, OtpPanelD, OtpPanelE, OtpCardA, OtpCardB, OtpCardC, OtpCardD, OtpCardE, OtpCardNow, OrderPreviewF, OrderPreviewG, OrderPreviewH, OrderPreviewI, OrderPreviewJ } from "./numbers/otpPanelOffers";
import AppleA from "./appleId/AppleA";
import AppleB from "./appleId/AppleB";
import AppleC from "./appleId/AppleC";
import AppleD from "./appleId/AppleD";
import AppleE from "./appleId/AppleE";
import AppleF from "./appleId/AppleF";
import AppleG from "./appleId/AppleG";
import AppleH from "./appleId/AppleH";
import AppleI from "./appleId/AppleI";
import AppleJ from "./appleId/AppleJ";
import SubsA from "./subs/SubsA";
import SubsB from "./subs/SubsB";
import SubsC from "./subs/SubsC";
import SubsD from "./subs/SubsD";
import SubsE from "./subs/SubsE";
import SubsF from "./subs/SubsF";
import SubsG from "./subs/SubsG";
import SubsH from "./subs/SubsH";
import SubsI from "./subs/SubsI";
import SubsJ from "./subs/SubsJ";
import { SinglePreviewA, SinglePreviewB, SinglePreviewC, SinglePreviewD, SinglePreviewE } from "./subSingle/offers";
import { logoOffers } from "./logo/offers";
import { SubsPanelA, SubsPanelB, SubsPanelC, SubsPanelD, SubsPanelE } from "./subs/panelOffers";
import StarsA from "./telegram/StarsA";
import StarsB from "./telegram/StarsB";
import StarsC from "./telegram/StarsC";
import StarsD from "./telegram/StarsD";
import StarsE from "./telegram/StarsE";
import PremiumA from "./telegram/PremiumA";
import PremiumB from "./telegram/PremiumB";
import PremiumC from "./telegram/PremiumC";
import PremiumD from "./telegram/PremiumD";
import PremiumE from "./telegram/PremiumE";
import AdsA from "./telegram/AdsA";
import AdsB from "./telegram/AdsB";
import AdsC from "./telegram/AdsC";
import AdsD from "./telegram/AdsD";
import AdsE from "./telegram/AdsE";
import AdsF from "./telegram/AdsF";
import AdsG from "./telegram/AdsG";
import AdsH from "./telegram/AdsH";
import AdsI from "./telegram/AdsI";
import AdsJ from "./telegram/AdsJ";
import AdsK from "./telegram/AdsK";
import StarsF from "./telegram/StarsF";
import PremiumF from "./telegram/PremiumF";
import StarsG from "./telegram/StarsG";
import PremiumG from "./telegram/PremiumG";
import StarsH from "./telegram/StarsH";
import PremiumH from "./telegram/PremiumH";
import StarsI from "./telegram/StarsI";
import PremiumI from "./telegram/PremiumI";
import PremiumR from "./telegram/PremiumR";
import PremiumS from "./telegram/PremiumS";
import StarsJ from "./telegram/StarsJ";
import PremiumJ from "./telegram/PremiumJ";
import StarsK from "./telegram/StarsK";
import StarsL from "./telegram/StarsL";
import PremiumK from "./telegram/PremiumK";
import PremiumL from "./telegram/PremiumL";
import PremiumM from "./telegram/PremiumM";
import PremiumN from "./telegram/PremiumN";
import PremiumO from "./telegram/PremiumO";
import PremiumP from "./telegram/PremiumP";
import PremiumQ from "./telegram/PremiumQ";
import ListA from "./social/ListA";
import ListB from "./social/ListB";
import ListC from "./social/ListC";
import ListD from "./social/ListD";
import ListE from "./social/ListE";
import ListF from "./social/ListF";
import { HeroOfferA, HeroOfferB, HeroOfferC, HeroOfferD, HeroOfferE, TexGlyphs, TexGrain, TexGrid, TexLines, TexNone, TexRings, IcoBubble, IcoConstellation, IcoLine, IcoMono, IcoOrbit, IcoTile, ObjCurve, ObjGlobe, ObjHalo, ObjNone, ObjOrb, ObjPulse, IcoGBounce, IcoGPop, IcoGSpin, IcoGOrbit, IcoGRise, IcoNone, BgAurora, BgSunset, BgMesh, BgBeams, BgWaves, BgPlain } from "./social/heroOffers";
import SocialA from "./social/SocialA";
import SocialB from "./social/SocialB";
import SocialC from "./social/SocialC";
import SocialD from "./social/SocialD";
import SocialE from "./social/SocialE";
import { FooterDefault, LinksUnderline, LinksArrow, LinksPill, LinksSweep, LinksDot } from "./footer/variants";
import { OrderPreviewA, OrderPreviewB, OrderPreviewC, OrderPreviewD, OrderPreviewE } from "./otp/order-screen";
import { MotionA, MotionB, MotionC, MotionD, MotionE, MotionF, MotionG, MotionH, MotionI, MotionJ, DetailFill, DetailRelay, DetailWalk, DetailRoll, DetailSheen } from "./service/stepsMotionOffers";
import AccountA from "./account/AccountA";
import AccountB from "./account/AccountB";
import AccountC from "./account/AccountC";

// archived offers stay in the code but are hidden from the comparison page unless "Show archived" is on.
// `overlay` (headers only): the header floats over the hero instead of sitting above it.
export type Offer = { id: string; name: string; summary: string; Component: ComponentType<{ card?: string; bare?: "overlay" | "flow"; orderView?: string; slug?: string; topic?: string; method?: string; panel?: string; hero?: string; texture?: string; icons?: string; object?: string; bg?: string }>; archived?: boolean; overlay?: boolean };
// A section with `variantOf` refines another section (e.g. its arrow style); on the home page its chosen offer replaces the parent's.
// `context` is rendered under each offer on the comparison page (e.g. the hero under a header).
// `kind: "page"` marks a whole-page design (with its own header and footer); `kind: "brand"` marks a site-wide
// asset such as the logo; `kind: "part"` marks a piece of other pages (e.g. the service pages' How to use steps),
// compared in a frame with its own controls. None of them joins the home page.
export type Section = { id: string; title: string; offers: Offer[]; variantOf?: string; context?: ComponentType<{ overlay?: boolean }>; kind?: "page" | "brand" | "part" };

// Every page section we design gets an entry here; offers stay saved even after one is chosen.
export const sections: Section[] = [
  {
    // The chosen mark is used by the header and footer logo and by the page-change loader (components/brand).
    id: "logo",
    title: "Logo",
    kind: "brand",
    offers: logoOffers,
  },
  {
    id: "header",
    title: "Header / Nav",
    context: HeaderContext,
    offers: [
      { id: "A", name: "Mega Menu", summary: "Sticky glass bar over the hero. Hovering a group opens a wide panel of category cards with prices.", Component: HeaderA, overlay: true },
      { id: "B", name: "Floating Pill", summary: "Rounded glass pill floating below the top edge; shrinks on scroll. Compact dropdown per group.", Component: HeaderB, overlay: true },
      { id: "C", name: "Store Bar", summary: "E-commerce style: utility strip, big search field, and a row of category chips.", Component: HeaderC },
      { id: "D", name: "Command Search", summary: "Dark slim bar with a Ctrl K search palette to jump to any service by keyboard.", Component: HeaderD },
      { id: "E", name: "Account Bar", summary: "\"All services\" catalog panel plus signed-in tools: wallet with top-up, notifications, account menu.", Component: HeaderE, overlay: true },
      { id: "F", name: "All Services Menu", summary: "Header A's bar with one \"All services\" menu: categories on the left, their sub-categories in the middle, a support card on the right.", Component: HeaderF, overlay: true },
      { id: "G", name: "Nav Tray", summary: "Links grouped in one rounded tray in the middle, each with an icon; the current page is lifted. Outlined pills for search, language, theme and My account with the wallet balance.", Component: HeaderG, overlay: true },
    ],
  },
  {
    id: "hero",
    title: "Hero",
    offers: [
      { id: "A", name: "Command Center", summary: "Dark, search-first. The search bar is the hero, with a live orders ticker underneath.", Component: HeroA },
      { id: "B", name: "Bento Store", summary: "Light and friendly. Copy on the left, the whole catalog as a colorful bento grid on the right.", Component: HeroB },
      { id: "C", name: "Live Demo", summary: "An animated phone receives an OTP code. Shows the product working, with a quick-buy widget.", Component: HeroC, archived: true },
      { id: "D", name: "Marquee Pop", summary: "Bold type, neo-brutalist buttons and scrolling platform pills. Energetic and social.", Component: HeroD, archived: true },
      { id: "E", name: "Editorial Trust", summary: "Calm and premium with a serif headline. Leads with stats, guarantees and a review.", Component: HeroE, archived: true },
      { id: "F", name: "A × B Merge", summary: "A's dark glow background with B's layout and copy. The right side is now a glass quick-order panel.", Component: HeroF, archived: true },
      { id: "G", name: "Catalog Tabs", summary: "Centered headline above a tabbed shop window. Each tab shows its categories as cards that link to the category page.", Component: HeroG },
      { id: "H", name: "Card Deck", summary: "Deep violet. Services as a fanned hand of cards that spread out on hover.", Component: HeroH, archived: true },
      { id: "I", name: "Globe", summary: "Dark navy wireframe globe with live country pins and prices. Leads with coverage.", Component: HeroI, archived: true },
      { id: "J", name: "Mega Bento", summary: "Full-width bento where every tile shows a tiny live UI of its service.", Component: HeroJ, archived: true },
      { id: "K", name: "Dashboard Preview", summary: "SaaS style. A tilted preview of the customer dashboard: wallet, numbers, orders.", Component: HeroK, archived: true },
    ],
  },
  {
    id: "popular",
    title: "Popular products",
    offers: [
      { id: "A", name: "Product Grid", summary: "Eight best-sellers as shop cards: badge, rating, price with discount, delivery time and a Buy button.", Component: PopA },
      { id: "B", name: "Top 5 Chart", summary: "A big card for the #1 best-seller beside a numbered chart of the next five, ranked by weekly sales.", Component: PopB },
      { id: "C", name: "Tabbed Shelf", summary: "How to buy E's tab bar over a shelf of best-sellers for the chosen category.", Component: PopC },
      { id: "D", name: "Deal of the Day", summary: "One discounted product with a live countdown to midnight, beside three other best-sellers.", Component: PopD },
      { id: "E", name: "Price Board", summary: "A dense price list grouped by category with a quick filter, in-stock dots, rating and delivery time.", Component: PopE },
    ],
  },
  {
    id: "how-to-buy",
    title: "How to buy",
    offers: [
      { id: "A", name: "Step Row", summary: "Classic four steps in a row joined by a dashed line. Clean, light and easy to scan.", Component: HowA },
      { id: "B", name: "Interactive Stepper", summary: "Dark like hero A. Steps auto-advance with a progress bar and a screen shows each step.", Component: HowB },
      { id: "C", name: "Stopwatch Timeline", summary: "Vertical timeline stamped 0:00, 0:10, 0:30. The speed is the story.", Component: HowC },
      { id: "D", name: "Bento Steps", summary: "Three colorful step cards, each with a small picture of the step, plus a guarantee strip.", Component: HowD },
      { id: "E", name: "Per-service Guide", summary: "Tabs for each service, since each one buys differently. Shows its exact three steps.", Component: HowEDefault },
    ],
  },
  {
    id: "how-to-buy-arrow",
    title: "How to buy · Arrow",
    variantOf: "how-to-buy",
    offers: [
      { id: "A", name: "Chevron Chip", summary: "White pill with a chevron that nudges on the live step and flips to a green check when done.", Component: ArrowChip },
      { id: "B", name: "Gradient Orb", summary: "Glowing indigo-to-pink orb with a ping ring on the live step; turns into a green check.", Component: ArrowOrb },
      { id: "C", name: "Flow Line", summary: "Dashed line across a wider gap with a glowing dot travelling along it; solid green when done.", Component: ArrowFlow },
      { id: "D", name: "Chevron Trail", summary: "Three chevrons lighting up in sequence, like a go-this-way sign.", Component: ArrowChevrons },
      { id: "E", name: "Progress Rail", summary: "No arrows between cards. A rail with numbered nodes above the cards fills step by step.", Component: ArrowRail },
    ],
  },
  {
    id: "why",
    title: "Why us",
    offers: [
      { id: "A", name: "Icon Grid", summary: "Six reasons as cards in a 3 × 2 grid with colored icon tiles; cards lift on hover.", Component: WhyA },
      { id: "B", name: "Bento Proof", summary: "Each reason shown, not told: delivery timer, refund notice, support avatars, payment chips, big stats.", Component: WhyB },
      { id: "C", name: "Comparison", summary: "Side-by-side table of ShopMajazi against a typical seller, with our column highlighted.", Component: WhyC },
      { id: "D", name: "Live Counters", summary: "A dark band of big numbers that count up when scrolled into view, with the reasons listed below.", Component: WhyD },
      { id: "E", name: "Scroll Story", summary: "Pinned heading on the left; reasons scroll past on the right and light up one at a time.", Component: WhyE },
    ],
  },
  {
    id: "testimonials",
    title: "Testimonials",
    offers: [
      { id: "A", name: "Marquee Wall", summary: "Two rows of review cards drifting in opposite directions; hovering a row pauses it.", Component: TestiA },
      { id: "B", name: "Spotlight", summary: "One big quote at a time with the reviewer below; moves on by itself, with arrows and dots.", Component: TestiB },
      { id: "C", name: "Masonry Grid", summary: "Reviews of different lengths packed into tidy columns under a one-line rating summary.", Component: TestiC },
      { id: "D", name: "Score + Filter", summary: "Overall score with a star breakdown, beside reviews filtered by service with FAQ F-style tabs.", Component: TestiD },
      { id: "E", name: "Chat Thread", summary: "Reviews arrive one by one as messages in a support-chat window when scrolled into view.", Component: TestiE },
    ],
  },
  {
    id: "content",
    title: "Content area (SEO)",
    offers: [
      { id: "A", name: "Read More Article", summary: "One calm reading column that fades out and expands on click. Full text always in the HTML.", Component: SeoA },
      { id: "B", name: "Guide with Contents", summary: "Sticky table of contents that highlights where you are, article beside it. Anchor links help sitelinks.", Component: SeoB },
      { id: "C", name: "Topic Accordion", summary: "Intro on the left, each topic a native expandable panel on the right. Compact, no JavaScript.", Component: SeoC },
      { id: "D", name: "Magazine", summary: "Editorial layout: lead with a drop cap, key-facts box, two-column topics, a pull quote and service links.", Component: SeoD },
      { id: "E", name: "Knowledge Tabs", summary: "Vertical topic menu with one panel at a time, matching hero G. Hidden panels stay in the HTML.", Component: SeoE },
    ],
  },
  {
    id: "faq",
    title: "FAQ",
    offers: [
      { id: "A", name: "Classic Accordion", summary: "One centered column, one question open at a time. The most familiar FAQ pattern.", Component: FaqA },
      { id: "B", name: "Category Tabs", summary: "Topic tabs (Numbers, Apple ID, Payments…) filter a two-column grid of boxed questions. Matches hero G.", Component: FaqB },
      { id: "C", name: "Search FAQ", summary: "Live search that filters and highlights matches, with support contacts on the side and a fallback when nothing matches.", Component: FaqC },
      { id: "D", name: "Split Q&A", summary: "Questions listed on the left, the chosen answer shown large on the right. Accordion on phones.", Component: FaqD },
      { id: "E", name: "Answer Cards", summary: "The six most-asked questions as cards that expand, with a support banner underneath.", Component: FaqE },
      { id: "F", name: "Tabs × Split", summary: "B's topic tabs on top of D's split reader: the tab's questions on the left, the chosen answer large on the right. Accordion on phones.", Component: FaqF },
    ],
  },
  {
    id: "blog",
    title: "Blog",
    offers: [
      { id: "A", name: "Featured + List", summary: "The newest article large on the left, the next four as a compact list on the right.", Component: BlogA },
      { id: "B", name: "Card Grid", summary: "Three classic article cards with cover, topic, title, excerpt and date.", Component: BlogB },
      { id: "C", name: "Carousel", summary: "A swipeable row of article cards with prev / next arrows and a progress bar.", Component: BlogC },
      { id: "D", name: "Magazine Bento", summary: "One large tile and three smaller ones, titles written over the cover like a magazine.", Component: BlogD },
      { id: "E", name: "Topic List", summary: "Topic tabs (like FAQ F) over an editorial list of articles with thumbnails.", Component: BlogE },
    ],
  },
  {
    id: "footer",
    title: "Footer",
    offers: [
      { id: "A", name: "Classic Columns", summary: "Logo, blurb and socials beside four link columns; bottom bar with legal links, payments, language and theme.", Component: FooterA },
      { id: "B", name: "CTA + Wordmark", summary: "A last call-to-action card, the link columns, and a giant faded ShopMajazi wordmark at the bottom.", Component: FooterB },
      { id: "C", name: "Dark Newsletter", summary: "Always dark: newsletter signup, a live status badge, link columns and slots for trust seals.", Component: FooterC },
      { id: "D", name: "Compact Centered", summary: "Logo, one row of key links, socials and a tiny legal line, all centered. Light-weight.", Component: FooterD },
      { id: "E", name: "Support First", summary: "Opens with three ways to reach support, then links, payment methods and trust seals on hero G's mesh.", Component: FooterE },
      { id: "F", name: "Support + Wordmark", summary: "E's support cards on top of B's footer (no call-to-action card), with smooth hover animations on links and socials.", Component: FooterDefault },
    ],
  },
  {
    id: "footer-links",
    title: "Footer · Link style",
    variantOf: "footer",
    offers: [
      { id: "A", name: "Slide + Underline", summary: "The link slides a touch and an underline draws in from the start side.", Component: LinksUnderline },
      { id: "B", name: "Arrow Reveal", summary: "A small arrow grows in before the text, which turns indigo.", Component: LinksArrow },
      { id: "C", name: "Soft Pill", summary: "A rounded pill fades in behind the link.", Component: LinksPill },
      { id: "D", name: "Highlight Sweep", summary: "An indigo-to-pink highlight sweeps across behind the text.", Component: LinksSweep },
      { id: "E", name: "Dot Marker", summary: "A gradient dot pops in at the start and nudges the text over.", Component: LinksDot },
    ],
  },
  {
    id: "page-otp",
    title: "Page · Virtual Number (OTP)",
    kind: "page",
    offers: [
      { id: "A", name: "Picker + Sidebar", summary: "App tiles, then a sortable country table with region filters; your live numbers stay in a sticky sidebar.", Component: OtpA, archived: true },
      { id: "B", name: "Step-by-step Wizard", summary: "One question at a time in a centered card: app, country, then your number and code. Best for first-timers.", Component: OtpB, archived: true },
      { id: "C", name: "One Search", summary: "A single smart search for app + country (\"telegram germany\"), with the live order on a phone mock.", Component: OtpC, archived: true },
      { id: "D", name: "Power Dashboard", summary: "Three panes for heavy users: apps, countries with favorites, and all active numbers with timers.", Component: OtpD, archived: true },
      { id: "E", name: "Price Matrix", summary: "Countries × top apps price table shaded cheap to pricey; click a price to buy in a side panel.", Component: OtpE, archived: true },
      { id: "F", name: "Quick-Buy Hero", summary: "Opens like the home hero, with one glass card of two searchable dropdowns and a Get number button; popular combos and a short FAQ below.", Component: OtpF, archived: true },
      { id: "G", name: "App Store + Sheet", summary: "Big app-store cards; tapping one opens a sheet with its countries, and a floating pill tracks your active numbers.", Component: OtpG, archived: true },
      { id: "H", name: "Live Console", summary: "Dark and techy: pick on the left, a terminal on the right streams payment, number, polling and the code.", Component: OtpH, archived: true },
      { id: "I", name: "Country First", summary: "Choose the country first: expandable country cards list every app with its price for that country.", Component: OtpI, archived: true },
      { id: "J", name: "Checkout", summary: "E-commerce checkout: app, country and quantity, payment method cards, and an order summary with fees.", Component: OtpJ, archived: true },
      { id: "K", name: "Guided Steps", summary: "One centered card asks one thing at a time: app or country first (your choice), then operator, then the order.", Component: OtpK },
      { id: "L", name: "Three Columns", summary: "App, country and operator side by side; each unlocks in turn, and a swap button flips app-first / country-first.", Component: OtpL },
      { id: "M", name: "Quick-Buy Hero", summary: "Hero with one glass card: app and country dropdowns with a swap button, operator cards, Buy; the card becomes the order.", Component: OtpM },
      { id: "N", name: "Drill-down Tiles", summary: "Big tiles you drill into with breadcrumbs on top: by app or by country, then operator cards and a buy panel.", Component: OtpN },
      { id: "O", name: "Checkout", summary: "Numbered sections that fold into a one-line summary with Change, plus an order summary with payment, then the order page.", Component: OtpO },
      { id: "P", name: "Catalog + Panel", summary: "Like /accounts and /virtual-service: a brand-colour band with a big search and popular apps, then every app (or country) as a colour-washed card; the chosen one's countries, operators and Continue sit in a panel beside the grid.", Component: OtpCatalog },
    ],
  },
  {
    id: "page-otp-panel",
    title: "Page · Virtual Number · Catalog P · Panel",
    kind: "page",
    variantOf: "page-otp",
    offers: [
      { id: "A", name: "Steps", summary: "The first version: numbered steps, the full searchable country list with price sorting, then operator cards and Continue.", Component: OtpPanelA },
      { id: "B", name: "Compact", summary: "Fits a phone screen: the country as one dropdown with prices, operators as small segments, and the total beside Continue.", Component: OtpPanelB },
      { id: "C", name: "Best Picks", summary: "Three suggestions up top (cheapest, best success rate, most numbers) as big cards; the full list folds away below. Operators as price chips.", Component: OtpPanelC },
      { id: "D", name: "One at a Time", summary: "Only the current question is open; a finished one folds to its answer with Change. A short summary above Continue.", Component: OtpPanelD },
      { id: "E", name: "Quick Buy", summary: "Two taps: the chosen country opens in place with its operators, each with its own Buy button straight to payment.", Component: OtpPanelE },
    ],
  },
  {
    id: "page-otp-card",
    title: "Page · Virtual Number · Catalog P · App card",
    kind: "page",
    variantOf: "page-otp",
    offers: [
      { id: "A", name: "Row", summary: "Logo beside the name and price, like a contact list: half the height of the current card, so more apps fit on screen. Popular is a small star.", Component: OtpCardA },
      { id: "B", name: "Logo Spotlight", summary: "Centred: the logo in a soft glow of its own colour, the name under it and the price in a small pill.", Component: OtpCardB },
      { id: "C", name: "Brand Ring", summary: "A calm neutral card; the brand shows as a ring of colour around the logo. On hover the card fills with a wash of that colour (D's hover) and the arrow slides.", Component: OtpCardC },
      { id: "D", name: "Price First", summary: "The price is the big number; logo and name sit small above it. A wash of the brand colour fills in on hover.", Component: OtpCardD },
      { id: "E", name: "Store Tile", summary: "App-store style: logo, name and a price pill that reads like a Get button; it turns solid on hover and when chosen.", Component: OtpCardE },
      { id: "F", name: "Current", summary: "The card as it is now, for comparison.", Component: OtpCardNow },
    ],
  },
  {
    id: "page-otp-order",
    title: "Page · Virtual Number · Order screen",
    kind: "page",
    variantOf: "page-otp",
    offers: [
      { id: "A", name: "Number Hero", summary: "One card: progress bar on top, the number large in the middle, a draining timer bar, and an action row with Cancel on one side and next steps on the other.", Component: OrderPreviewA },
      { id: "B", name: "Ticket + Status", summary: "The number as a gradient ticket with the order on its stub; a status panel beside it with the timer ring, a vertical timeline and a full-width Cancel.", Component: OrderPreviewB },
      { id: "C", name: "Phone Inbox", summary: "Number, three short how-to steps and Cancel on one side; a phone on the other shows a typing bubble, then the SMS with the code.", Component: OrderPreviewC },
      { id: "D", name: "Receipt", summary: "One narrow card read top to bottom: status and timer, number, a dashed code slot, order lines, and stacked full-width buttons with Cancel.", Component: OrderPreviewD },
      { id: "E", name: "Stepper + Control Bar", summary: "The current layout tidied: a connected stepper, number with detail chips, and a dark bar holding the timer and Cancel side by side.", Component: OrderPreviewE },
      { id: "F", name: "Code Slot", summary: "One card top to bottom: the number with Copy, a slim timer (rose near the end), an empty code slot that fills in when the SMS lands, and a three-step guide. While waiting only a quiet Cancel shows.", Component: OrderPreviewF },
      { id: "G", name: "Inbox", summary: "Number and a vertical what-to-do guide on one side; an inbox on the other where the SMS arrives as a message with the code picked out and a Copy button.", Component: OrderPreviewG },
      { id: "H", name: "Timer Ring", summary: "A ring of time left beside the big number, so how long you have is clear at a glance; it turns rose near the end and into a green check with the code below.", Component: OrderPreviewH },
      { id: "I", name: "Checklist", summary: "The order as a checklist (paid, number, SMS, code); the current line shows its content, so the screen always says what is happening now.", Component: OrderPreviewI },
      { id: "J", name: "Slim Bar", summary: "For buying several: one short bar per order with the number, a timer chip and a small code slot that fills in; the guide sits under it while waiting.", Component: OrderPreviewJ },
    ],
  },
  {
    id: "page-blog",
    title: "Page · Blog list",
    kind: "page",
    offers: [
      { id: "A", name: "Magazine Front", summary: "The newest article large with the next three beside it, then topic tabs over a three-column grid with numbered pages.", Component: BlogListA },
      { id: "B", name: "Sidebar Archive", summary: "Classic blog: wide article rows with thumbnails; a sticky sidebar with search, topics and counts, most read and a Telegram card.", Component: BlogListB },
      { id: "C", name: "Search & Filter", summary: "Hero-style page with one big search field, topic tabs with counts, a Newest / Most read switch and Load more.", Component: BlogListC },
      { id: "D", name: "Topic Shelves", summary: "Full-width cover banner for the newest article, sticky topic chips, then a swipeable shelf per topic with See all.", Component: BlogListD },
      { id: "E", name: "Editorial Index", summary: "Text-first: underlined topic words and big title rows grouped by month; hovering a row slides in its cover.", Component: BlogListE },
      { id: "F", name: "Switchable View", summary: "B's sidebar filters with a Grid / List switch: grid (default) is C's cards two per row, list is B's wide rows. Sort by newest or most read.", Component: BlogListF },
    ],
  },
  {
    id: "page-blog-post",
    title: "Page · Blog post",
    kind: "page",
    offers: [
      { id: "A", name: "Classic Read", summary: "One calm centered column: title, lead and byline, a wide cover, the article with an inline product box, then tags, author and related posts.", Component: BlogPostA },
      { id: "B", name: "Guide with Contents", summary: "Docs-style: contents on the left highlight where you are, the product card and share stay in view on the right; FAQ at the end.", Component: BlogPostB },
      { id: "C", name: "Immersive Cover", summary: "The cover fills the first screen with the title over it; larger reading type, floating share buttons and a full-width Next article.", Component: BlogPostC },
      { id: "D", name: "Guide + Buy", summary: "Key takeaways up top, a sticky buy card beside the article, a slim buy bar on phones, and the guide's FAQ.", Component: BlogPostD },
      { id: "E", name: "Focus Reader", summary: "Text first, no big cover. A floating reader bar with a progress ring and minutes left, contents and a text-size switch.", Component: BlogPostE },
    ],
  },
  {
    id: "page-google-voice",
    title: "Page · Google Voice",
    kind: "page",
    offers: [
      { id: "A", name: "Number Picker", summary: "Every number in stock as a grid, filtered by state or searched by digits; the chosen number and Buy stay in a bar at the bottom.", Component: GvA },
      { id: "B", name: "Product Page", summary: "Shop-style: a phone showing your chosen number beside title, rating, price, a scrolling number list and Buy; details in tabs below.", Component: GvB, archived: true },
      { id: "C", name: "Pick by City", summary: "Start with the city: cards with area codes and numbers left; opening one lists its numbers with a buy card beside them.", Component: GvC, archived: true },
      { id: "D", name: "Digit Search", summary: "Like a domain search: a dark hero with one big search for digits, area code or city; matches highlighted, plus easy-to-remember picks.", Component: GvD, archived: true },
      { id: "E", name: "Guide + Compare", summary: "Explains Google Voice, compares it with one-time and rented numbers, then a three-step picker (city, number, buy) and the FAQ.", Component: GvE, archived: true },
      { id: "F", name: "One Simple Form", summary: "One calm column that reads like a form: 1 · city, 2 · number, 3 · review and pay. Plain words, big type, real radio buttons.", Component: GvF },
      { id: "G", name: "Search + Summary", summary: "Labelled search and city filter over a two-column list of numbers; the order summary stays in view beside it.", Component: GvG },
      { id: "H", name: "Grouped by City", summary: "Phone-first: numbers under city headings with jump links, and your choice with Continue in a bar at the bottom.", Component: GvH },
      { id: "I", name: "Number Table", summary: "A real data table with a radio per row and sortable columns that announce their order; city filter and summary beside it.", Component: GvI },
      { id: "J", name: "Guided Steps", summary: "One question per screen (city, number, review) with Step 2 of 3 progress, Back / Continue, and focus moved to each question.", Component: GvJ },
      { id: "K", name: "Catalog + Panel", summary: "Like /accounts and /virtual-service: a band in Google's colours with a big search for digits, area code or city; every city in stock as a card, its numbers, price and Buy in a panel beside the grid.", Component: GvCatalog },
    ],
  },
  {
    id: "page-account",
    title: "Page · Account (dashboard, add funds, orders, order, support, profile, password)",
    kind: "page",
    offers: [
      { id: "A", name: "Needs You", summary: "A deep indigo band holds the page title, the wallet and the tabs. The overview sorts by what each thing needs: first what's waiting on you (a paused order, a support reply, a code that just came in), beside it what's on its way with timers drawn to scale, then a table of what's done. Orders filter by the same states; each order, ticket and form is its own page.", Component: AccountA },
      { id: "B", name: "One Page", summary: "The whole account on one scrolling page: right now, orders, add funds, support, profile, password. A solid indigo index on the side follows the scroll, a filled square on the section you're in (chips on phones). Orders and tickets unfold in place with everything they have; nothing opens a new page.", Component: AccountB },
      { id: "C", name: "Passbook", summary: "Read like a bank passbook: the home page is the wallet statement, each top-up, purchase and refund on a line with the balance after it, today's balance at the head of the column. An order opens as a receipt whose money lines add up. Deep indigo rail on the side, a tab bar on phones; orders grouped by service; support as a two-pane inbox.", Component: AccountC },
    ],
  },
  {
    id: "page-google-voice-card",
    title: "Page · Google Voice · Catalog K · City card",
    kind: "page",
    variantOf: "page-google-voice",
    offers: [
      { id: "A", name: "Area Code", summary: "The area code leads in big digits after a small +1, like a number being dialled; city under it, count and lowest price on a hairline at the bottom.", Component: GvCardA },
      { id: "B", name: "Number Preview", summary: "Shows a real number from the city in a little phone-line strip; extra numbers sit as cards stacked behind it and fan out on hover.", Component: GvCardB },
      { id: "C", name: "Map Pin", summary: "A small tile map of the US with the city's state lit in green, so where the number is from reads at a glance; city, state, area codes and price beside it.", Component: GvCardC },
      { id: "D", name: "Price First", summary: "The lowest price is the big figure; city small above it, area codes below, and a round go button that fills green on hover and turns into a check when chosen.", Component: GvCardD },
      { id: "E", name: "Directory", summary: "One bordered list like a phone directory: state tile, city and area codes, then count and price lined up in columns. Most cities on screen, prices compare down one column.", Component: GvCardE },
      { id: "F", name: "Current", summary: "The card as it is now, for comparison.", Component: GvCardNow },
    ],
  },
  {
    id: "page-rent",
    title: "Page · Rent Number",
    kind: "page",
    offers: [
      { id: "A", name: "Rental Builder", summary: "Two plain questions (country, then 1 week / 2 weeks / 1 month with per-day price and savings) beside an order summary that stays in view.", Component: RentA, archived: true },
      { id: "B", name: "Plan Cards", summary: "Pricing-page style: pick the country once, then three plan cards with what's included and their own Rent button; the month is marked best value.", Component: RentB, archived: true },
      { id: "C", name: "Price Table", summary: "Every country × every length in one table; each price is a labelled radio button, with the summary beside it.", Component: RentC, archived: true },
      { id: "D", name: "Pick Any Length", summary: "Rent for exactly 3–30 days with a keyboard-friendly slider and quick week / month buttons; total, per-day and end date update live.", Component: RentD, archived: true },
      { id: "E", name: "Inbox Preview", summary: "Setup on the left, a live preview of the rental inbox on the right with messages arriving, so unlimited SMS is obvious.", Component: RentE, archived: true },
      { id: "F", name: "Step by Step", summary: "All apps or one app, then the questions in order down the page; done steps fold to one line with Change. The last pick opens the payment window.", Component: RentF },
      { id: "G", name: "Columns", summary: "Like virtual number page L: the steps side by side (period → country, or country → period → app), each unlocking in turn.", Component: RentG },
      { id: "H", name: "One Question at a Time", summary: "First all apps or one app, then one question per screen with progress and Back; answers move on by themselves.", Component: RentH },
      { id: "I", name: "Quick Pick", summary: "One compact screen: period chips and a country grid, or a country dropdown, period chips and an app grid.", Component: RentI },
      { id: "J", name: "Steps + Summary", summary: "The current question with a clickable step bar; a summary on the right fills in and shows the price.", Component: RentJ },
      { id: "K", name: "Catalog + Panel", summary: "Like /accounts and /virtual-service: a brand-colour band with a big search and popular countries; every country as a card, and all apps / one app, period, app and Continue in a panel beside the grid.", Component: RentCatalog },
    ],
  },
  {
    id: "page-apple-id",
    title: "Page · Apple ID",
    kind: "page",
    offers: [
      { id: "A", name: "Choose, then Details", summary: "Ready and Custom as cards on top; below, only what that kind needs (quantity or the form) beside an order summary.", Component: AppleA },
      { id: "B", name: "Two Tabs", summary: "One column with keyboard tabs for Ready and Custom; each tab holds what you get, the quantity or form, the total and Buy.", Component: AppleB, archived: true },
      { id: "C", name: "One Simple Form", summary: "Reads like a paper form: 1 · kind, 2 · quantity or your details, 3 · review and pay. Large type, one column.", Component: AppleC, archived: true },
      { id: "D", name: "Live Preview", summary: "Product page: a card previews the Apple ID and fills in as you type; kind, quantity or form and Buy beside it.", Component: AppleD, archived: true },
      { id: "E", name: "Guided Steps", summary: "One question per screen with progress; each answer is checked before moving on, and a review screen has Change links.", Component: AppleE, archived: true },
      { id: "F", name: "One Card", summary: "The whole purchase in one small card that fits a phone screen: Ready / Custom switch, quantity or form, Buy. The rest is folded away.", Component: AppleF },
      { id: "G", name: "Buy Always in Reach", summary: "Clean page where the total and buy button never leave the screen: a bottom bar on phones, a small card that follows you on desktop.", Component: AppleG },
      { id: "H", name: "Instant First", summary: "Opens on a ready Apple ID: tap 1, 2, 3, 5 or 10 and Buy. Custom is one button below that opens the short form in place.", Component: AppleH },
      { id: "I", name: "Two Big Buttons", summary: "Just two large buttons, Ready and Custom; each opens a sheet (bottom sheet on phones) with only what it needs.", Component: AppleI },
      { id: "J", name: "Side by Side", summary: "No switching: Ready and Custom next to each other on desktop with their own buy buttons; stacked on phones, Ready first.", Component: AppleJ },
    ],
  },
  {
    id: "page-subs",
    title: "Page · Subscriptions",
    kind: "page",
    offers: [
      { id: "A", name: "Catalog + Panel", summary: "Grid with a sliding category bar (icons and counts) and search; the chosen product's plans, fields and Buy in a panel beside it (below on phones, scrolled to).", Component: SubsA },
      { id: "B", name: "Grid + Sheet", summary: "Compact app-store grid of icons and prices; tapping one opens a sheet (bottom sheet on phones) with plans, fields and Continue.", Component: SubsB, archived: true },
      { id: "C", name: "Expandable List", summary: "One calm column grouped by category; opening a row unfolds its plans, fields and Buy in place. Easy to scan on phones.", Component: SubsC, archived: true },
      { id: "D", name: "Two Panes", summary: "Like a mail app: the list on the left, the chosen subscription on the right. One pane at a time on phones, with Back.", Component: SubsD, archived: true },
      { id: "E", name: "Featured Product", summary: "A product page: plans as pricing cards with their own Buy, the account field above; More subscriptions swaps the product in place.", Component: SubsE, archived: true },
      { id: "F", name: "Category Tabs", summary: "Categories as keyboard tabs with counts; every subscription is a row with its own Buy button that opens the plans. Two taps to payment.", Component: SubsF },
      { id: "G", name: "Filter Sidebar", summary: "Shop-style filters: category checkboxes with counts, how it's delivered, and sort; on phones the filters open in a sheet with Show N results.", Component: SubsG },
      { id: "H", name: "Plans on the Card", summary: "Each category a section with a sticky jump bar; plans are buttons on the card, so one tap goes to payment (or to the one field needed).", Component: SubsH },
      { id: "I", name: "Quick Picker", summary: "Three plain dropdowns: Category → Subscription → Plan, then the field and Buy. Popular picks fill all three in one tap.", Component: SubsI },
      { id: "J", name: "Category First", summary: "Six big category tiles → that category's subscriptions → plans, with a breadcrumb back and focus moved to each new heading.", Component: SubsJ },
    ],
  },
  {
    id: "page-subs-panel",
    title: "Page · Subscriptions · Product panel",
    kind: "page",
    variantOf: "page-subs",
    offers: [
      { id: "A", name: "Compact", summary: "Small header, plans as one row of segments with savings tags, the field, then total and Continue side by side. Fits a phone screen.", Component: SubsPanelA },
      { id: "B", name: "Monthly Price First", summary: "Plans as a plain list where the price per month is the big number; a one-line 'You pay $63 once' summary above Continue.", Component: SubsPanelB },
      { id: "C", name: "Three Steps", summary: "The panel reads as numbered steps: plan, your account, pay; each gets a check when done.", Component: SubsPanelC },
      { id: "D", name: "Big Price", summary: "A large price per month that changes with the period and shows the saving; included features fold away.", Component: SubsPanelD },
      { id: "E", name: "Detailed", summary: "Plan cards with Popular and Best value tags, an Included box, and secure payment / refund / delivery under Continue.", Component: SubsPanelE },
    ],
  },
  {
    id: "page-sub-single",
    title: "Page · Single subscription",
    kind: "page",
    offers: [
      { id: "A", name: "Overview + Sticky Buy", summary: "Details down the left (what you get, how it's delivered, plans compared); the buy box follows you on the right. On phones it comes right after the title.", Component: SinglePreviewA },
      { id: "B", name: "Pricing Page", summary: "Centered title, plans as pricing cards with Best value; choosing one moves you to the account field and Continue right below.", Component: SinglePreviewB },
      { id: "C", name: "Tabs", summary: "Title and buy box side by side; details in keyboard tabs (Overview, Plans, How it works) that stay in the HTML for search.", Component: SinglePreviewC },
      { id: "D", name: "Brand Hero", summary: "A hero in the product's own colour; the buy box overlaps it on desktop. Details and related subscriptions below.", Component: SinglePreviewD },
      { id: "E", name: "Buy First", summary: "Minimal: a one-line title, the buy box straight away, and the details folded into expandable sections underneath.", Component: SinglePreviewE },
    ],
  },
  {
    id: "page-tg-stars",
    title: "Page · Telegram Stars",
    kind: "page",
    offers: [
      { id: "A", name: "Pack Grid", summary: "Username, a grid of ready packs (50 to 10,000) or any amount, and a summary that stays in view. Uses, price tiers and FAQ below.", Component: StarsA },
      { id: "B", name: "Big Counter", summary: "One large editable number with − / + and a slider; a tier bar shows your price per Star and how many more reach the next tier.", Component: StarsB },
      { id: "C", name: "Gift Preview", summary: "Form beside a phone that shows the chat the receiver will see: their name, the Stars gift bubble, and your name or Anonymous.", Component: StarsC },
      { id: "D", name: "Night Sky", summary: "A dark star-filled hero holding the whole purchase: username, six amount chips and Buy. Details and prices below.", Component: StarsD },
      { id: "E", name: "Bot Chat", summary: "Buying is a chat with a Telegram-style bot: send a username, tap or type an amount, pay from the summary message.", Component: StarsE },
      { id: "F", name: "Pack Grid on Gold Glow", summary: "A's layout (username, pack grid or any amount, summary and Buy in the sidebar) on a warm gold background that follows the theme and fades into the page; sparkles drift up, the star turns like a coin. Standard Continue button.", Component: StarsF },
      { id: "G", name: "Constellation", summary: "The packs are stars in a constellation that draws itself in; bigger pack, bigger and brighter star. On phones it becomes the pack grid. Night sky, Buy in the sidebar.", Component: StarsG },
      { id: "H", name: "Galaxy Slider", summary: "One big number with − / + and a slider; a little galaxy fills with more stars as the amount grows. Tier chips show your price. Night sky, Buy in the sidebar.", Component: StarsH },
      { id: "I", name: "Gift Card", summary: "A gold gift card fills in as you choose (amount, for whom, from whom); it tilts toward the pointer with a light sweeping across. Night sky, Buy in the sidebar.", Component: StarsI },
      { id: "J", name: "Bento", summary: "Packs as glass bento tiles in different sizes (500 big, 10,000 wide) with savings; the chosen tile gets a turning gold border. Night sky, Buy in the sidebar.", Component: StarsJ },
      { id: "K", name: "Star Stacks", summary: "Packs as gold columns that grow up one after another; taller column, more Stars. The chosen one glows and its star spins. Night sky, Buy in the sidebar.", Component: StarsK },
      { id: "L", name: "Pack Grid on a Gold Band", summary: "Premium S's layout in Stars gold: an amber band with the title and coin; the order summary rises into it on desktop and the form overlaps its edge. Below follows the site theme.", Component: StarsL },
    ],
  },
  {
    id: "page-tg-premium",
    title: "Page · Telegram Premium",
    kind: "page",
    offers: [
      { id: "A", name: "Pricing Page", summary: "Centered: 3 / 6 / 12 months as pricing cards with per-month price and saving, the username and one Buy. Features and Free vs Premium below.", Component: PremiumA },
      { id: "B", name: "Profile Preview", summary: "For me or a gift, then the username; a Telegram profile card fills in and the Premium star appears next to the name.", Component: PremiumB },
      { id: "C", name: "Feature Tour", summary: "Purple hero; features as keyboard tabs with a big picture each, while the buy box (plans, username) stays beside them.", Component: PremiumC },
      { id: "D", name: "Free vs Premium", summary: "The page is the comparison table with the Premium column highlighted; plans, username and Upgrade sit right under it.", Component: PremiumD },
      { id: "E", name: "One Card", summary: "The whole purchase in one small card that fits a phone screen: plan segments, username, Buy. Features fold away below.", Component: PremiumE },
      { id: "F", name: "Profile Preview on Night Sky", summary: "B's flow (for me or a gift, username, plan) on the night-sky background in Premium purple; the profile card in the sidebar holds the total and Buy.", Component: PremiumF },
      { id: "G", name: "Feature Orbit", summary: "The crown in the middle with every feature circling it; the ring stops when you point at it, and choosing a feature explains it. Night sky, Buy in the sidebar.", Component: PremiumG },
      { id: "H", name: "Before / After", summary: "A phone that switches between Free and Premium: the ad disappears, the star badge appears, limits double, voice turns to text. Night sky, Buy in the sidebar.", Component: PremiumH },
      { id: "I", name: "Timeline", summary: "The next 12 months as a bar; choosing a plan fills it and shows the exact date Premium lasts until. Night sky, Buy in the sidebar.", Component: PremiumI },
      { id: "J", name: "Gift Box", summary: "Made for gifting: a wrapped box bobs gently; when the account is found the lid lifts and the crown rises out with sparkles. Night sky, Buy in the sidebar.", Component: PremiumJ },
      { id: "K", name: "Feature Bento", summary: "Plans and username in one glass card, then the features as bento tiles that fade in; pointing at one lights a turning border. Night sky, Buy in the sidebar.", Component: PremiumK },
      { id: "L", name: "Telegram's Premium Sheet", summary: "What Premium unlocks as Telegram's own coloured feature rows, who / how long beside it, and the profile card with total and green Continue in the sidebar. Night sky, nothing loops.", Component: PremiumL },
      { id: "M", name: "Profile First", summary: "The recipient's profile is the big piece: who switch and username inside it; when found, the avatar gets the Premium ring and star with a sparkle burst. Plans and features below. Night sky, green Continue in the sidebar.", Component: PremiumM },
      { id: "N", name: "Membership Card", summary: "Fill in a Telegram Premium card (membership, or gift card for a friend) with who, length and valid-until date; the card turns once when it changes. Night sky, green Continue in the sidebar.", Component: PremiumN },
      { id: "O", name: "Gift Message", summary: "A Telegram chat shows the Premium message that arrives, with its turning badge; it re-arrives when the plan or recipient changes. Form beside it. Night sky, green Continue in the sidebar.", Component: PremiumO },
      { id: "P", name: "Three Steps", summary: "Who, which account, how long as three numbered steps; each number turns into a tick once settled. Badge beside the title. Night sky, green Continue in the sidebar.", Component: PremiumP },
      { id: "Q", name: "In-App Screen", summary: "The whole form inside a phone showing Telegram's own Premium screen: emblem, grouped list rows for who / username / plan, and what's included. Night sky, green Continue in the sidebar.", Component: PremiumQ },
      { id: "R", name: "Bento on Violet Glow", summary: "K's plans, username and feature bento on Stars F's background in Premium violet: lavender in light mode, navy with a violet glow in dark, fading into the page. Green Continue in the sidebar.", Component: PremiumR },
      { id: "S", name: "Bento on a Brand Band", summary: "Single D's layout: a violet-to-fuchsia band with the title and badge; the order card rises into it on desktop and the form overlaps its edge. Below follows the site theme.", Component: PremiumS },
    ],
  },
  {
    id: "page-tg-ads",
    title: "Page · Telegram Ads",
    kind: "page",
    offers: [
      { id: "A", name: "Campaign Builder", summary: "Three cards (your ad, audience, budget) beside a live preview of the sponsored message, the views/clicks estimate and Pay.", Component: AdsA },
      { id: "B", name: "Packages", summary: "Starter / Growth / Pro packages with estimated views; choosing one scrolls to a short brief with a small preview.", Component: AdsB },
      { id: "C", name: "Step by Step", summary: "Promote → Your ad → Audience → Budget with a clickable step bar; each step is checked before moving on.", Component: AdsC },
      { id: "D", name: "Budget Calculator", summary: "A blue hero that starts with money: drag the budget and watch estimated views and clicks change; the ad form follows.", Component: AdsD },
      { id: "E", name: "Done for You", summary: "Reads like a managed service: how it works and the rules first, then one short brief. We can improve your text before submitting.", Component: AdsE },
      { id: "F", name: "Telegram Ads Fields", summary: "Every field of Telegram's own ad form, in dollars, in the site's usual layout: numbered cards (where, your ad, budget and schedule) and the preview, summary and Pay in a sticky sidebar.", Component: AdsF },
      { id: "G", name: "Night Fields", summary: "F's complete Telegram form (where, your ad, budget and schedule) on the Telegram-blue night sky, like Premium L. Preview, estimate, summary and green Continue in the sidebar.", Component: AdsG },
      { id: "H", name: "Write in the Post", summary: "You type the ad inside a Telegram channel: title, text and link are the sponsored message itself, and its button fills in from the link. Where and budget below. Night sky, green Continue in the sidebar.", Component: AdsH },
      { id: "I", name: "Where It Shows", summary: "Starts with the choice you can't change later: four tiles with a small drawing of where the ad lands; the sidebar preview redraws for channel, bot or search. Night sky, green Continue in the sidebar.", Component: AdsI },
      { id: "J", name: "Reach Field", summary: "Starts with money: a big budget with a slider and a field of dots that light up in one sweep as views grow. Where, ad and schedule follow. Night sky, green Continue in the sidebar.", Component: AdsJ },
      { id: "K", name: "Ad Checklist", summary: "The form as four folding rows, one open at a time; closed rows show their answer and a tick, or the problem after Continue. Night sky, preview and green Continue in the sidebar.", Component: AdsK },
    ],
  },
  {
    id: "page-social-list",
    title: "Page · Social Media Services · Categories",
    kind: "page",
    offers: [
      { id: "A", name: "Category Grid", summary: "Search, then one card per platform in the admin's order: logo, one-liner, number of services, lowest price, and its top three services as direct links.", Component: ListA },
      { id: "B", name: "Featured + Directory", summary: "Indigo band with the title and a big search; featured platforms as large tiles over its edge, every other platform in a compact three-column directory.", Component: ListB },
      { id: "C", name: "A–Z Directory", summary: "Built for a long list: popular chips up top, then every platform alphabetically under letter headings, with a sticky search and letter bar to jump.", Component: ListC },
      { id: "D", name: "Platform Explorer", summary: "Platforms as a vertical tab list; the chosen one opens beside it with its logo, every service and price as links, and a button to its page. Disclosures on phones.", Component: ListD },
      { id: "E", name: "Colour Bento", summary: "Each platform a tile washed in its own brand colour (set by the admin); featured ones take the big tiles, the rest fill a tighter grid.", Component: ListE },
      { id: "F", name: "Colour Grid", summary: "A × E: A's cards (one-liner, top services as links, number of services, lowest price) washed in each platform's brand colour. Featured platforms as E's big tiles in the first row, the rest as smaller cards.", Component: ListF },
    ],
  },
  {
    id: "page-social-list-hero",
    title: "Page · Social Media Services · Categories · Hero",
    kind: "page",
    variantOf: "page-social-list",
    offers: [
      { id: "A", name: "Logo Cloud", summary: "Title and a big search beside a staggered cloud of every platform's logo (featured ones larger); each logo is a link, they land one after another and lift on hover.", Component: HeroOfferA },
      { id: "B", name: "Brand Mesh", summary: "A dark band coloured by the featured platforms' own brand colours, blended as soft glows. Title and big search inside; the featured cards rise over its lower edge.", Component: HeroOfferB },
      { id: "C", name: "Search Spotlight", summary: "Centred and quiet: a large title, one big search on a soft indigo glow, and the featured platforms as chips to jump straight in.", Component: HeroOfferC },
      { id: "D", name: "Platform Marquee", summary: "Centred title and search above two slow rows of platform pills drifting in opposite directions; pointing at or tabbing into a row pauses it.", Component: HeroOfferD },
      { id: "E", name: "Need Picker", summary: "Title and search beside a card asking what you want to grow: followers, members, views, likes, plays, each with how many platforms sell it; a tap filters the list.", Component: HeroOfferE },
    ],
  },
  {
    id: "page-social-list-hero-texture",
    title: "Page · Social Media Services · Hero B · Background texture",
    kind: "page",
    variantOf: "page-social-list-hero",
    offers: [
      { id: "A", name: "Fine Grid", summary: "Thin graph-paper lines in a wide 56px grid, brightest near the title and fading out toward the edges.", Component: TexGrid },
      { id: "B", name: "Ripple Rings", summary: "Thin rings spreading from the top corner like a signal reaching outward, fading as they spread. Mirrors in Persian.", Component: TexRings },
      { id: "C", name: "Film Grain", summary: "A fine noise blended into the colours: no pattern, just a soft printed feel that takes the digital flatness off the glows.", Component: TexGrain },
      { id: "D", name: "Pinstripes", summary: "Very faint diagonal lines at an angle, fading toward the edges. Calm and directional.", Component: TexLines },
      { id: "E", name: "Platform Glyphs", summary: "A few outlined platform icons (Telegram, Instagram, YouTube, TikTok…) scattered and tilted at very low strength, like a watermark.", Component: TexGlyphs },
      { id: "F", name: "None", summary: "Just the brand-colour glows with nothing on top, for comparison.", Component: TexNone },
    ],
  },
  {
    id: "page-social-list-hero-icons",
    title: "Page · Social Media Services · Hero C · Icons",
    kind: "page",
    variantOf: "page-social-list-hero",
    offers: [
      { id: "A", name: "Soft Tiles", summary: "Rounded tiles washed in each platform's own colour at low strength, the icon in that colour; they float and sway gently.", Component: IcoTile, archived: true },
      { id: "B", name: "Bare Mono", summary: "Just the icons, no container, in quiet slate, each with a small brand-colour dot that pulses softly; colour fills in on hover.", Component: IcoMono, archived: true },
      { id: "C", name: "Glass Bubbles", summary: "Frosted glass bubbles with the brand colour glowing inside; each rises slowly, fades and comes back on its own rhythm.", Component: IcoBubble, archived: true },
      { id: "D", name: "Constellation", summary: "Small line icons joined by faint lines on each side, like star maps; the lines and icons draw themselves in, then the icons twinkle.", Component: IcoConstellation, archived: true },
      { id: "E", name: "Orbit", summary: "Two slow rings circle the whole hero in opposite directions, the icons riding them upright and passing by the sides. Pointing at the hero pauses them.", Component: IcoOrbit, archived: true },
      { id: "F", name: "Line Rings (current)", summary: "Thin line icons in hairline rings that draw in on load and float; a ring breathes out now and then.", Component: IcoLine, archived: true },
      { id: "G", name: "Glossy Bounce", summary: "Glossy 3D app-icon tiles in each platform's colour that hop with squash and stretch; little heart, like, follow and view chips float up from them.", Component: IcoGBounce, archived: true },
      { id: "H", name: "Glossy Pop", summary: "Glossy 3D tiles that take turns popping: a jump, a wiggle and a burst of tiny hearts, one after another around the title.", Component: IcoGPop, archived: true },
      { id: "I", name: "Glossy Flip", summary: "Glossy 3D tiles that flip like coins in turn, rising as they spin and landing with a small squash.", Component: IcoGSpin, archived: true },
      { id: "J", name: "Glossy Orbit", summary: "Glossy 3D tiles riding two flat rings around the hero in opposite directions, throwing off reaction chips as they pass the sides.", Component: IcoGOrbit, archived: true },
      { id: "K", name: "Glossy Balloons", summary: "A steady stream of glossy 3D icons rising up both sides like balloons, tumbling gently as they go.", Component: IcoGRise, archived: true },
      { id: "L", name: "No icons", summary: "No floating icons: just the title, search and the background behind them.", Component: IcoNone },
    ],
  },
  {
    id: "page-social-list-hero-bg",
    title: "Page · Social Media Services · Hero C · Background style",
    kind: "page",
    variantOf: "page-social-list-hero",
    offers: [
      { id: "A", name: "Aurora", summary: "Ribbons of Instagram pink, Telegram blue, TikTok teal, violet and amber drifting across a deep night like northern lights.", Component: BgAurora },
      { id: "B", name: "Sunset", summary: "One bold story-ring gradient (violet, magenta, orange) that slowly pans so the colours shift, with a warm glow behind the title.", Component: BgSunset },
      { id: "C", name: "Brand Mesh", summary: "Big soft blobs in the featured platforms' own colours (set by the admin), slowly changing shape and drifting.", Component: BgMesh },
      { id: "D", name: "Stage Beams", summary: "Coloured spotlights fanning down onto the title from above, swaying slowly like stage lights.", Component: BgBeams },
      { id: "E", name: "Colour Waves", summary: "A blue-to-violet sky with layered pink, orange and teal waves rolling along the bottom.", Component: BgWaves },
      { id: "F", name: "Plain (current)", summary: "The light indigo glow the hero has now, for comparison.", Component: BgPlain },
    ],
  },
  {
    id: "page-social-list-hero-object",
    title: "Page · Social Media Services · Hero C · Background object",
    kind: "page",
    variantOf: "page-social-list-hero",
    offers: [
      { id: "A", name: "Globe", summary: "A large wireframe globe turning slowly behind the title, a few brand-coloured points glowing on it like live orders. Fades out before the cards.", Component: ObjGlobe },
      { id: "B", name: "Rising Orb", summary: "The curve of a huge planet rises behind the search like a horizon, its rim lit in indigo. One slow rise on load, then still.", Component: ObjOrb },
      { id: "C", name: "Growth Curve", summary: "One long line climbing across the hero like a follower graph; it draws itself in, brand-coloured points mark the way and the top one keeps pulsing. Mirrors in Persian.", Component: ObjCurve },
      { id: "D", name: "Halo Ring", summary: "A wide tilted ring of light around the search, like a planet's ring seen edge-on, with a bright spark travelling slowly round it.", Component: ObjHalo },
      { id: "E", name: "Signal Pulse", summary: "Soft rings spread slowly from behind the search one after another, like a post reaching more and more people.", Component: ObjPulse },
      { id: "F", name: "None", summary: "The hero as it was, for comparison.", Component: ObjNone },
    ],
  },
  {
    id: "page-social",
    title: "Page · Social Media Services · Order",
    kind: "page",
    offers: [
      { id: "A", name: "Platform Band", summary: "Stars L's layout: a band in the chosen platform's colours with the title and platform pills; it cross-fades when you switch. Service, quality, amount and link in a card over its edge; the summary rises into the band.", Component: SocialA },
      { id: "B", name: "Order Checklist", summary: "Four folding rows (platform, service, amount, link), one open at a time; closed rows show their answer and a tick, or the problem after Continue. Plain site theme.", Component: SocialB },
      { id: "C", name: "Live Preview", summary: "The order card opens with a sketch of what you're growing in the platform's style, named from your link, and the number being added counts up. Platform as a compact icon row.", Component: SocialC },
      { id: "D", name: "Price Board", summary: "Every service on one list with platform filters and search; rows show price per 1,000, start time and refill. Pick a row, then quality, amount and link below it.", Component: SocialD },
      { id: "E", name: "Delivery Timeline", summary: "Platform and service as two dropdowns, a big amount with − / + and a slider, and a timeline of when it starts, when it's done and how long the refill covers.", Component: SocialE },
    ],
  },
  {
    id: "steps-motion",
    title: "Service pages · How to use · Motion",
    kind: "part",
    offers: [
      { id: "A", name: "Cascade", summary: "The cards rise into place one after another in reading order. Quiet and quick.", Component: MotionA },
      { id: "B", name: "Number First", summary: "Empty cards appear, the step numbers pop in one by one, then each card's words slide in after its number.", Component: MotionB },
      { id: "C", name: "Progress Line", summary: "A thin green line runs across the tops of the cards from step 1 to the last; each number fills in as the line passes it.", Component: MotionC },
      { id: "D", name: "Wipe", summary: "Each card is unveiled from the reading side (right in Persian), one after another, and its words follow.", Component: MotionD },
      { id: "E", name: "Focus", summary: "The cards start blurred and come into focus one by one, quickly (under half a second). Shown on the live card design: a big step number and a progress bar in the page's own colour, chevrons between steps, a lift on hover.", Component: MotionE },
      { id: "F", name: "Flip", summary: "The cards swing down into place from their top edge, like turning pages.", Component: MotionF },
      { id: "G", name: "Spotlight", summary: "After a quick entrance, one step at a time is lifted and outlined in green, with a small timer bar; it moves on every few seconds. Hover a step to hold it.", Component: MotionG },
      { id: "H", name: "Ring", summary: "The numbers start as outlines; a ring draws round each in turn, then it fills green.", Component: MotionH },
      { id: "I", name: "Travelling Dot", summary: "A dotted line joins the numbers and a green dot walks along it, pausing at each step; each number pings as the dot arrives. Keeps going while on screen. Phones get the cascade.", Component: MotionI },
      { id: "J", name: "Deal", summary: "The steps start stacked as one card, then deal out into their places across the row. Phones get the cascade.", Component: MotionJ },
    ],
  },
  {
    id: "steps-detail",
    title: "Service pages · How to use · Card animation",
    variantOf: "steps-motion",
    offers: [
      { id: "A", name: "Bars Fill", summary: "As the cards come in, the progress bars fill one after another from step 1, and each step number lights up in the page colour as its bar fills, then settles. Plays once.", Component: DetailFill },
      { id: "B", name: "Arrow Relay", summary: "The arrows between the steps keep pulsing towards the next step, one gap after another, like a 'go this way' sign. Loops gently while on screen.", Component: DetailRelay },
      { id: "C", name: "Walkthrough", summary: "Like the home page's How to buy: the steps take turns. The current one lifts with a coloured outline, its number lights up, its bar refills over its turn and the arrows after it point on. Hover a step to hold it.", Component: DetailWalk },
      { id: "D", name: "Number Roll", summary: "The big step numbers roll up into place from under their line, one after another, and the bars fill behind them. Plays once.", Component: DetailRoll },
      { id: "E", name: "Sheen", summary: "A soft band of the page colour sweeps across each card once in reading order, and the bars fill. Plays once.", Component: DetailSheen },
    ],
  },
];

// Sections still to design, in page order.
export const upcoming = ["Service categories"];

export const getSection = (id: string) => sections.find((s) => s.id === id);
