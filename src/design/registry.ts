import type { ComponentType } from "react";
import HeroA from "./hero/HeroA";
import { BridgeA, BridgeB, BridgeC, BridgeD, BridgeE } from "./bridge/offers";
import { AdsBudgetA, AdsBudgetB, AdsBudgetC, AdsBudgetD, AdsBudgetE, AdsRulesA, AdsRulesB, AdsRulesC, AdsRulesD, AdsRulesE } from "./telegram/adsParts";
import { SubBridgeA, SubBridgeB, SubBridgeC, SubBridgeD, SubBridgeE, SubBridgeF, SubBridgeG, SubBridgeH, SubBridgeI, SubBridgeJ, SubBridgeK, SubBridgeL, SubBridgeM, SubBridgeN, SubBridgeO, SubBridgeP, SubBridgeQ, SubBridgeR } from "./subSingle/bridge";
import { CartA, CartB, CartC, CartD, CartE } from "./cart/offers";
import { CartOrderA, CartOrderB, CartOrderC, CartOrderD } from "./account/cartOrders";
import { OrderPayA, OrderPayB, OrderPayC } from "./account/orderPay";
import { BusinessOfferA, BusinessOfferB, BusinessOfferC } from "./account/organization";
import { NightCallA, NightCallB, NightCallC } from "./checkout/nightCall";
import { VerifyA, VerifyB, VerifyC, VerifyD, VerifyE, VerifyFormA, VerifyFormB, VerifyFormC, VerifyFormD } from "./verify/offers";
import { AboutA, AboutB, AboutC, ContactA, ContactB, ContactC, FaqPageA, FaqPageB, FaqPageC } from "./info/offers";
import ErrorsA from "./errors/ErrorsA";
import ErrorsB from "./errors/ErrorsB";
import ErrorsC from "./errors/ErrorsC";
import ErrorsD from "./errors/ErrorsD";
import ErrorsE from "./errors/ErrorsE";
import HeroB from "./hero/HeroB";
import HeroC from "./hero/HeroC";
import HeroD from "./hero/HeroD";
import HeroE from "./hero/HeroE";
import HeroF from "./hero/HeroF";
import HeroG, { HeroSubChips, HeroSubGradient, HeroSubIcons, HeroSubMarker, HeroSubPlain, HeroWordBlur, HeroWordSlot, HeroWordType } from "./hero/HeroG";
import HeroH from "./hero/HeroH";
import HeroI from "./hero/HeroI";
import HeroJ from "./hero/HeroJ";
import HeroK from "./hero/HeroK";
import { HeroSysA, HeroSysB, HeroSysC, HeroSysD, HeroSysE } from "./heroSystem/offers";
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
import WhyF from "./why/WhyF";
import WhyG from "./why/WhyG";
import WhyH from "./why/WhyH";
import WhyI from "./why/WhyI";
import WhyJ from "./why/WhyJ";
import TestiA from "./testimonials/TestiA";
import TestiB from "./testimonials/TestiB";
import TestiC from "./testimonials/TestiC";
import TestiD from "./testimonials/TestiD";
import TestiE from "./testimonials/TestiE";
import { TestiF, TestiG, TestiH, TestiI, TestiJ } from "./testimonials/mobile";
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
import { HeroOfferA as PostHeroA, HeroOfferB as PostHeroB, HeroOfferC as PostHeroC, HeroOfferD as PostHeroD, HeroOfferE as PostHeroE, HeroOfferF as PostHeroF } from "./blogPost/heroes";
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
import { PreorderPreviewA, PreorderPreviewB, PreorderPreviewC } from "./googleVoice/preorder";
import { RentCardA, RentCardB, RentCardC, RentCardD, RentCardE, RentCardNow } from "./numbers/rentCardOffers";
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
import { PlanSelectA, PlanSelectB, PlanSelectC, PlanSelectD, PlanSelectE, PlanSelectF } from "./subs/planSelect";
import { PopularBadgeBand, PopularBadgeFolder, PopularBadgeNow, PopularBadgeTab, PopularBadgeTabEnd } from "./subs/popularBadge";
import { NotesCard, NotesChecklist, NotesChips, NotesFold, NotesRows } from "./subs/notesPlacement";
import { DeliveredA, DeliveredB, DeliveredC, DeliveredD, DeliveredE } from "./subSingle/howDelivered";
import { CatalogA, CatalogB, CatalogC, CatalogD, CatalogE } from "./hero/catalogWindows";
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
import { SubsPanelA, SubsPanelB, SubsPanelC, SubsPanelD, SubsPanelE, SubsPanelF, SubsPanelG, SubsPanelH, SubsPanelI, SubsPanelJ } from "./subs/panelOffers";
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
import { SocialServiceA, SocialServiceB, SocialServiceC, SocialServiceD, SocialServiceE } from "./socialService/offers";
import { SocialPlatformF, SocialPlatformG, SocialPlatformH, SocialPlatformI, SocialPlatformJ } from "./socialPlatform/offers";
import { SocialPlatformK } from "./socialPlatform/bandChecklist";
import { SocialPlatformL } from "./socialPlatform/bandShelf";
import { FooterDefault, LinksUnderline, LinksArrow, LinksPill, LinksSweep, LinksDot } from "./footer/variants";
import { OrderPreviewA, OrderPreviewB, OrderPreviewC, OrderPreviewD, OrderPreviewE } from "./otp/order-screen";
import { MotionA, MotionB, MotionC, MotionD, MotionE, MotionF, MotionG, MotionH, MotionI, MotionJ, DetailFill, DetailRelay, DetailWalk, DetailRoll, DetailSheen, DetailJourney } from "./service/stepsMotionOffers";
import AccountA from "./account/AccountA";
import AccountB from "./account/AccountB";
import AccountC from "./account/AccountC";
import { OrdersA, OrdersB, OrdersC, OrdersD, OrdersE, OrdersNow } from "./account/orders";
import { SignInA, SignInB, SignInC, SignInD, SignInF, SignInG, SignInH, SignInI, SignInNow } from "./signin/offers";
import { InvoiceA, InvoiceB, InvoiceC, InvoiceD, InvoiceE } from "./account/invoice";

// archived offers stay in the code but are hidden from the comparison page unless "Show archived" is on.
// `overlay` (headers only): the header floats over the hero instead of sitting above it.
export type Offer = { id: string; name: string; summary: string; Component: ComponentType<{ card?: string; bare?: "overlay" | "flow"; orderView?: string; slug?: string; topic?: string; method?: string; word?: string; panel?: string; hero?: string; texture?: string; icons?: string; object?: string; bg?: string; code?: string; budget?: string; rules?: string }>; archived?: boolean; overlay?: boolean };
// A section with `variantOf` refines another section (e.g. its arrow style); on the home page its chosen offer replaces the parent's.
// `context` is rendered under each offer on the comparison page (e.g. the hero under a header).
// `kind: "page"` marks a whole-page design (with its own header and footer); `kind: "brand"` marks a site-wide
// asset such as the logo; `kind: "part"` marks a piece of other pages (e.g. the service pages' How to use steps),
// compared in a frame with its own controls. None of them joins the home page.
export type Section = { id: string; title: string; offers: Offer[]; variantOf?: string; context?: ComponentType<{ overlay?: boolean }>; kind?: "page" | "brand" | "part" };

// Every page section we design gets an entry here; offers stay saved even after one is chosen.
export const sections: Section[] = [
  {
    id: "cart",
    title: "Shopping cart · header button, cart, add to cart",
    kind: "page",
    offers: [
      { id: "A", name: "Side Drawer", summary: "Cart icon with a count in the header. Add to cart slides a drawer in from the side with the lines, quantity steppers, total and Wallet / Card; the page stays behind it.", Component: CartA },
      { id: "B", name: "Cart Page", summary: "A Cart button with the count opens its own page: lines in a card on one side, a sticky summary with Wallet / Card and the pay button on the other. Most room for long carts.", Component: CartB },
      { id: "C", name: "Bottom Bar", summary: "Phones first: after the first add a dark bar floats at the bottom with the count, total and View cart; it opens the cart as a bottom sheet, like the payment step.", Component: CartC },
      { id: "D", name: "Header Popover", summary: "The header button shows the running total. It drops a compact cart under it (lines with remove, total, Pay for all), like the Services menu; no page change.", Component: CartD },
      { id: "E", name: "Receipt", summary: "The cart as a receipt beside the product: numbered lines on dashed rules, a torn edge, a big green total. Matches the Passbook and the invoice.", Component: CartE },
    ],
  },
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
    id: "hero-word",
    title: "Hero · Headline with a changing word",
    variantOf: "hero",
    offers: [
      { id: "A", name: "Slot Flip", summary: "«خدمات دیجیتال را [آنی ← مطمئن ← حرفه‌ای] دریافت کنید.» The word slides up and out while the next slides in from below, every 2.6 seconds. Only the word moves; the line keeps its width.", Component: HeroWordSlot },
      { id: "B", name: "Blur Swap", summary: "The same words, fading through a soft blur into the next one, like the sign-in page's text.", Component: HeroWordBlur },
      { id: "C", name: "Typewriter", summary: "The word is deleted letter by letter and the next one typed, with a blinking indigo cursor. The most noticeable of the three.", Component: HeroWordType },
      { id: "D", name: "Current", summary: "«خدمات دیجیتال را دریافت کنید.» as it is now, nothing moves.", Component: HeroG },
    ],
  },
  {
    id: "hero-subtitle",
    title: "Hero · The line under the headline",
    kind: "part",
    offers: [
      { id: "A", name: "Soft Chips", summary: "The three promises («خرید مطمئن», «تحویل آنی», «پشتیبانی واقعی») in pale green, amber and indigo tints that pop in one after another; the ending stays plain.", Component: HeroSubChips },
      { id: "B", name: "Highlighter", summary: "The promises in bold, with a soft marker stroke that draws under each one, start to end, after the line has arrived.", Component: HeroSubMarker },
      { id: "C", name: "Display Line (current)", summary: "The line in the headline's font, a size bigger; the promises in the headline's indigo-to-pink gradient with a light sheen passing through them once. The ending is quieter.", Component: HeroSubGradient },
      { id: "D", name: "Icon Row", summary: "The promises as one row, each with a coloured icon (shield, lightning, headset); \"everything just as you'd expect\" on its own quieter line under it.", Component: HeroSubIcons },
      { id: "E", name: "Word by word", summary: "One grey line that writes itself in word by word (before C was chosen).", Component: HeroSubPlain },
    ],
  },
  {
    // A small moving element for the empty band between the home hero and the section under it.
    id: "hero-bridge",
    title: "Hero · Bridge to the next section",
    kind: "part",
    offers: [
      { id: "A", name: "Scroll Thread", summary: "A hairline drops from the hero card; a bright dot runs down it to a gently bobbing arrow. Says \"keep scrolling\" and ties the two sections together.", Component: BridgeA },
      { id: "B", name: "Service Marquee", summary: "The catalog's names (virtual numbers, Apple ID, Telegram Stars…) as chips drifting slowly across, fading at both edges; pauses on hover.", Component: BridgeB },
      { id: "C", name: "Beam Line", summary: "A hairline across the page with a pink light running along it and the logo glowing softly in the middle.", Component: BridgeC },
      { id: "D", name: "Soft Wave", summary: "Two thin indigo-to-pink waves rolling across at different speeds. The calmest moving option.", Component: BridgeD },
      { id: "E", name: "Twinkle Field", summary: "A quiet scatter of small dots that light up and dim, densest in the middle. Pure atmosphere, no shape.", Component: BridgeE },
    ],
  },
  {
    id: "hero-system",
    title: "Hero system (all pages)",
    kind: "part",
    offers: [
      { id: "A", name: "Grid Console", summary: "Centered. Hairline blueprint grid, live status eyebrow, the search field is the main action, stats row below.", Component: HeroSysA },
      { id: "B", name: "Split Terminal", summary: "Copy on one side, a small terminal on the other that plays this page's order line by line.", Component: HeroSysB },
      { id: "C", name: "Spotlight", summary: "Centered. One soft green beam onto the page's icon tile with breathing rings; headline, two buttons, checks.", Component: HeroSysC },
      { id: "D", name: "Spec Bento", summary: "Copy beside four spec tiles: the key number, the three buy steps, payment methods, automatic refund.", Component: HeroSysD },
      { id: "E", name: "Signal Lines", summary: "Copy beside a circuit board: thin traces carry pulses from apps/payments into the page's chip.", Component: HeroSysE },
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
      { id: "A", name: "Icon Grid", summary: "Six reasons as cards in a 3 × 2 grid with colored icon tiles; cards lift on hover.", Component: WhyA, archived: true },
      { id: "B", name: "Bento Proof", summary: "Each reason shown, not told: delivery timer, refund notice, support avatars, payment chips, big stats.", Component: WhyB, archived: true },
      { id: "C", name: "Comparison", summary: "Side-by-side table of ShopMajazi against a typical seller, with our column highlighted.", Component: WhyC, archived: true },
      { id: "D", name: "Live Counters", summary: "A dark band of big numbers that count up when scrolled into view, with the reasons listed below.", Component: WhyD },
      { id: "E", name: "Scroll Story", summary: "Pinned heading on the left; reasons scroll past on the right and light up one at a time.", Component: WhyE, archived: true },
      { id: "F", name: "Glossy Bento (current)", summary: "Your first reference: soft white bento cards with a 2 × 2 cluster of glossy product icons, a 24 tile, big blue numbers and a blue brand card with fine wavy lines and the logo in the middle.", Component: WhyF },
      { id: "G", name: "Service Cards", summary: "Your second reference: white cards with a coloured line icon by the title, a short paragraph and a pale illustration in the corner with coloured coins floating over it. One tall card, one wide refund card.", Component: WhyG },
      { id: "H", name: "Phone Story", summary: "A phone in the middle plays an order (choose, pay, delivered) on a loop; the reason cards either side light up when the phone reaches their step. Hover holds the step.", Component: WhyH },
      { id: "I", name: "Icon Shelf", summary: "The calm one: six big glossy icons on one shelf, bobbing gently in turn, with a title and a line each; a strip of four big blue numbers that count up underneath.", Component: WhyI },
      { id: "J", name: "Number Mosaic", summary: "The heading is a tile inside the grid; big blue numbers share the mosaic with the reasons, plus a small feed showing orders ending as delivered or refunded.", Component: WhyJ },
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
      { id: "F", name: "Swipe Row", summary: "Phone-first: one review card and a peek of the next, swiped like the blog row, with dots; three across with arrows on wide screens. Real comments only, no stars.", Component: TestiF },
      { id: "G", name: "Card Stack", summary: "A deck of review cards: swipe the top one away and it goes to the back; the next two peek out behind it. Counter and arrows.", Component: TestiG },
      { id: "H", name: "Stories", summary: "Like phone stories: a row of ringed avatars and one story card with progress bars that moves on by itself; tap the sides to go back or on, hold to pause.", Component: TestiH },
      { id: "I", name: "Focus Carousel", summary: "One card centred in full, neighbours smaller and faded either side; swipe or let it move on by itself. Dots below.", Component: TestiI },
      { id: "J", name: "Fold List", summary: "The calm one: three compact cards folded to three lines on phones, Read more on each and a Show more button; masonry columns on wide screens.", Component: TestiJ },
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
    // Error pages: Next.js (app/not-found.tsx, app/error.tsx) and Laravel (resources/views/errors/*) use the chosen
    // offer. Each preview has a switcher for every status code.
    id: "page-errors",
    title: "Page · Error pages (400, 404, 500 …)",
    kind: "page",
    offers: [
      { id: "A", name: "Big Code", summary: "The status number huge and pale behind the message like a watermark; one plain sentence, Try again / Home / Back, and on 404 a search field with popular pages.", Component: ErrorsA },
      { id: "B", name: "Search Rescue", summary: "A dead end as a fresh start: big search field and the popular services as tiles, the error only a small chip. Server errors swap the tiles for Try again.", Component: ErrorsB },
      { id: "C", name: "Status Card", summary: "One calm card like a receipt: an icon tile coloured by kind, What happened / What you can do, the buttons, and the code + time printed small to quote to support.", Component: ErrorsC },
      { id: "D", name: "Broken Route", summary: "Copy beside a small browser window whose route line breaks at the code, a dot pulsing along it. Maintenance (503) shows a whole line and a filling bar instead.", Component: ErrorsD },
      { id: "E", name: "Quiet Line", summary: "Editorial, text only: code and title on one line split by a hairline, a short paragraph, then a plain list of ways out. No cards, no icons.", Component: ErrorsE },
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
    // The top of a blog post (title, lead, byline, cover), shown inside the live post layout B.
    id: "blog-post-hero",
    title: "Blog post · Hero",
    kind: "part",
    offers: [
      { id: "A", name: "Split Cover", summary: "Title, lead and byline on one side, the cover whole on the other, so the first screen shows both. Date, reading time and views as small facts beside the topic.", Component: PostHeroA },
      { id: "B", name: "Panel Banner", summary: "The header in a white panel with a faint grid and a soft glow; author and share buttons along its bottom edge. The cover stays at the top of the article.", Component: PostHeroB },
      { id: "C", name: "Blurred Backdrop", summary: "A dark panel coloured by the post's own cover (blurred behind), white text, and the sharp cover beside it.", Component: PostHeroC },
      { id: "D", name: "Meta Strip", summary: "A compact header, then one strip with author, date, reading time, views and share, and the cover wide under it.", Component: PostHeroD },
      { id: "E", name: "Centered Editorial", summary: "Everything centred like a magazine opener: topic, title, lead, byline and facts, the cover under them.", Component: PostHeroE },
      { id: "F", name: "Current", summary: "Today's header: a large title over the article column, three lines on wide screens.", Component: PostHeroF },
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
    id: "page-signin",
    title: "Page · Sign in (/login page and the header's sign-in popup)",
    kind: "page",
    offers: [
      { id: "A", name: "Trust Split", summary: "A deep indigo panel with the logo, \"Your orders, codes and wallet in one place\", three promises (delivered in seconds, money back to your wallet, support around the clock) and Enamad; the form beside it. Popup: the same indigo strip on top of the form.", Component: SignInA },
      { id: "B", name: "Quiet Card", summary: "One centered card on a faint blueprint grid, the logo above it and a three-step strip under it (mobile → password or SMS code → your account), with a line on how the number is used. Popup: the card with the step strip.", Component: SignInB, archived: true },
      { id: "C", name: "Phone First", summary: "A big phone icon and \"One number, your whole account\"; the form with no heading of its own, and under it the three ways in: password, SMS code, or a new account in a minute. Popup: icon, heading and form, centered.", Component: SignInC, archived: true },
      { id: "D", name: "Account Preview", summary: "Beside the form, a picture of what signing in opens: the wallet balance and a live order with its countdown and code, in the Passbook look. Popup: wide, the same picture beside the form (phones: form only).", Component: SignInD, archived: true },
      { id: "E", name: "Current", summary: "The /login page as it is now; its popup is the plain form.", Component: SignInNow },
      { id: "F", name: "Trust Split · Light", summary: "A, with the panel in pale indigo and dark text instead of deep indigo: the same logo, headline, three promises and Enamad line, calmer on light pages. Popup: a pale strip on top.", Component: SignInF },
      { id: "G", name: "Trust Split · Services", summary: "A's deep indigo panel, but it shows what the account is for: \"One account for everything you buy here\" over six service tiles (numbers, Google Voice, Apple ID, Telegram Premium, Instagram, subscriptions) and the refund-to-wallet line. Popup: logo and the tiles on top.", Component: SignInG },
      { id: "H", name: "Trust Split · Glow", summary: "A's indigo with the site's faint grid and a soft breathing glow, a lock icon, the headline and the four promises as small chips. Popup: the glow strip with two chips.", Component: SignInH },
      { id: "I", name: "Trust Split · Steps", summary: "The form comes first; a slimmer indigo panel after it walks through what happens: enter your mobile, password or SMS code, you're in, plus how the number is used. Popup: form, with the privacy line in an indigo footer.", Component: SignInI },
    ],
  },
  {
    id: "page-account-orders",
    title: "Page · Account · Passbook · Orders list",
    kind: "page",
    variantOf: "page-account",
    offers: [
      { id: "A", name: "Status Tabs", summary: "One list, newest first, with tabs by what each order needs: Needs you, In progress, Delivered, Refunded & cancelled, each with its count. Opens on Needs you when something waits on you.", Component: OrdersA },
      { id: "B", name: "Ledger Table", summary: "Every order in one table: order with its status, date, how it was paid and price, in fixed columns. Sort by date or price, filter by service. Most orders on screen at once.", Component: OrdersB },
      { id: "C", name: "Handover Cards", summary: "A card per order that already shows what it handed over: the number with its code and copy buttons, the countdown, the delivery bar, or how many login details are inside. Orders that need you come first.", Component: OrdersC },
      { id: "D", name: "By Day", summary: "Reads like the statement: orders still going are pinned in an In progress box on top; the rest fall under Today, Yesterday and dates, with the time on the start side.", Component: OrdersD },
      { id: "E", name: "List & Preview", summary: "Wide screens: a compact list beside the chosen order's handover, price and payment, so you can go through orders without changing page. Phones: tap opens the receipt.", Component: OrdersE },
      { id: "F", name: "Current", summary: "Grouped by service (Virtual numbers, Telegram, Social growth, Accounts), as it is now.", Component: OrdersNow },
    ],
  },
  {
    id: "page-account-cart-order",
    title: "Page · Account · Passbook · Cart order (several services, one order)",
    kind: "page",
    variantOf: "page-account",
    offers: [
      { id: "A", name: "Expandable Row", summary: "The cart is one row in the list: its services' tiles stacked, 'Order #C-12 · 3 services', how many are delivered and one total. Tap to open it in place; each service underneath opens its own page as today.", Component: CartOrderA },
      { id: "B", name: "Grouped Box", summary: "Always open: a green-edged box in the list with the order number, time, progress and total on top, and the services as normal rows inside it.", Component: CartOrderB },
      { id: "C", name: "Order Page · Cards", summary: "One row in the list opens the cart order's own page: a card per service with its status and price (tap for its page), and a money box with the total, how it was paid, any refund and one invoice.", Component: CartOrderC },
      { id: "D", name: "Order Page · Receipt", summary: "One row in the list opens a receipt-style page: numbered service lines on dashed rules, each with its status and its own order number, the total, and the money box with one invoice.", Component: CartOrderD },
    ],
  },
  {
    id: "page-account-order-pay",
    title: "Page · Account · Passbook · Pay what's due & cancel",
    kind: "page",
    variantOf: "page-account",
    offers: [
      { id: "A", name: "Pay Banner", summary: "An amber band across the top of the order: what support asked for (the order support made, or VAT added later), the amount, wallet or card, Pay. Cancel is a quiet red link in the side column.", Component: OrderPayA },
      { id: "B", name: "In the Money table", summary: "The unpaid lines sit in a dashed amber box under the order's Money table, with the total to pay and the Pay controls right there. A 'Changed your mind?' card in the side column cancels with a refund.", Component: OrderPayB },
      { id: "C", name: "Side Pay Card", summary: "A deep indigo card at the top of the side column: the amount to pay in big type, its lines, then wallet/card and Pay. Under it a 'Not started yet' card with Cancel & refund.", Component: OrderPayC },
    ],
  },
  {
    id: "page-account-business",
    title: "Page · Account · Passbook · Business (organisation) account",
    kind: "page",
    variantOf: "page-account",
    offers: [
      { id: "A", name: "Steps", summary: "A three-step track on top (send details → we review → business prices), then the whole form in one card. Approved: your discount, what it applies to and a sample price, with your company details beside it.", Component: BusinessOfferA },
      { id: "B", name: "Benefits Aside", summary: "The form split into 'Company details' and 'A few questions' cards, with a deep-indigo side card listing what a business account gives you. Approved: the same side card shows your percent.", Component: BusinessOfferB },
      { id: "C", name: "Membership Card", summary: "A company card at the top — empty dashed outline while personal, an indigo card with company name, tax code and percent once approved. Applying is two short steps behind a 'Get a business account' button.", Component: BusinessOfferC },
    ],
  },
  {
    id: "checkout-night-call",
    title: "Checkout · Available for a call at night?",
    kind: "part",
    offers: [
      { id: "A", name: "Segmented", summary: "One question with a phone icon and a Yes / No pill switch; Pay waits for an answer.", Component: NightCallA },
      { id: "B", name: "Moon & Sun cards", summary: "Two cards side by side — moon 'Yes, at night too', sun 'Daytime only' — each saying what it means; Pay waits for a pick.", Component: NightCallB },
      { id: "C", name: "Quiet switch", summary: "A single row with a moon and a switch, off by default: nobody has to answer to pay; only a yes is recorded as 'may call at night'.", Component: NightCallC },
    ],
  },
  {
    id: "page-account-invoice",
    title: "Page · Account · Passbook · Printable invoice",
    kind: "page",
    variantOf: "page-account",
    offers: [
      { id: "A", name: "Official", summary: "The Iranian sales-invoice layout: boxed seller and buyer, a ruled table with row number, quantity, unit price and amount, the total in figures and in words, payment boxes.", Component: InvoiceA },
      { id: "B", name: "Passbook", summary: "Matches the account: a deep indigo head with the amount paid, who it's for and from, the order and any refund as money lines on dashed rules.", Component: InvoiceB },
      { id: "C", name: "Slip", summary: "A narrow till slip: centred, dashed rules, total and amount in words at the foot. Half a page on paper, readable as a screenshot on a phone.", Component: InvoiceC },
      { id: "D", name: "Clean", summary: "Lots of white: the amount and a Paid mark first, billed to / paid with / from in three columns, one line table and a green total.", Component: InvoiceD },
      { id: "E", name: "Bilingual", summary: "Persian and English on every label and both calendars, whatever language the site is in, for showing a company, accountant or embassy.", Component: InvoiceE },
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
    id: "gv-preorder",
    title: "Google Voice · Pre-order card",
    kind: "part",
    offers: [
      { id: "A", name: "Steps Card", summary: "One calm card: why there are no numbers, the three steps (pay, we get your number, or your money back) in a row, then the price and Pre-order now.", Component: PreorderPreviewA },
      { id: "B", name: "Reserved Line", summary: "The steps as a short list beside a phone-line strip with the number still blank and \"reserved for you\", the price and the button under it.", Component: PreorderPreviewB },
      { id: "C", name: "Notice Bar", summary: "The page's unavailable message becomes one slim amber bar with the price in a sentence and the button at its end. Least space, least explanation.", Component: PreorderPreviewC },
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
    id: "page-rent-card",
    title: "Page · Rent Number · Catalog K · Country card",
    kind: "page",
    variantOf: "page-rent",
    offers: [
      { id: "A", name: "Flag Row", summary: "Like the chosen Google Voice and virtual number cards: one row with the flag on the start side, country, calling code and free numbers, the weekly price lined up on the end side. Two to a row.", Component: RentCardA },
      { id: "B", name: "Calling Code", summary: "The calling code (+44) leads in big digits, the way the number will start; flag beside it, country under it, free numbers and weekly price on a hairline at the bottom.", Component: RentCardB },
      { id: "C", name: "Week & Month", summary: "Flag, country and free numbers on top; the 1 week and 1 month prices side by side in a small well, so countries compare on the length you want.", Component: RentCardC },
      { id: "D", name: "Price First", summary: "The weekly price is the big figure; flag and country small above it, and a round go button that fills green on hover and turns into a check when chosen.", Component: RentCardD },
      { id: "E", name: "Directory", summary: "One bordered list: flag, country and calling code, free numbers and weekly price in columns, a chevron at the end. Most countries on screen, prices compare down one column.", Component: RentCardE },
      { id: "F", name: "Current", summary: "The card as it is now, for comparison.", Component: RentCardNow },
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
      { id: "F", name: "Tight Rows", summary: "Smaller: one bordered list of short rows (dot, name, price at the end); price repeats inside Continue.", Component: SubsPanelF },
      { id: "G", name: "Segmented", summary: "Smaller: plan names in a pill switch, the chosen price shown once and large under it, then the field and Continue.", Component: SubsPanelG },
      { id: "H", name: "Dropdown", summary: "Smallest: the plan is a select (name — price), the field, and Continue with the price.", Component: SubsPanelH },
      { id: "I", name: "Mini Tiles", summary: "Smaller: compact tiles in one row with name and price in small type and a check on the chosen one.", Component: SubsPanelI },
      { id: "J", name: "Filled Rows", summary: "Smaller: short rows where the chosen plan fills violet; Continue carries the price.", Component: SubsPanelJ },
    ],
  },
  {
    id: "page-contact",
    title: "Page · Contact us",
    kind: "page",
    offers: [
      { id: "A", name: "Channels First", summary: "Three big cards (Telegram, email, phone) up top, then the message form beside the Mashhad office card.", Component: ContactA },
      { id: "B", name: "Split Form", summary: "The form is the page; heading, channels and office sit in a column beside it that stays put on desktop.", Component: ContactB },
      { id: "C", name: "Help Desk", summary: "Pick a topic first (order, payment, account, other); its common answers open right there, with the form underneath for anything left.", Component: ContactC },
    ],
  },
  {
    id: "page-faq",
    title: "Page · FAQ",
    kind: "page",
    offers: [
      { id: "A", name: "Search + Groups", summary: "One calm column: a big search box that highlights matches, topic chips that jump down, every question grouped by topic.", Component: FaqPageA },
      { id: "B", name: "Help Center", summary: "Search in a soft band, topic cards with icons and counts; the chosen topic's questions open as boxed cards.", Component: FaqPageB },
      { id: "C", name: "Side Index", summary: "Search and a topic list in a sticky side column (chips on phones), the questions in one card beside it, support card under the list.", Component: FaqPageC },
    ],
  },
  {
    id: "page-about",
    title: "Page · About us",
    kind: "page",
    offers: [
      { id: "A", name: "Story Column", summary: "A calm reading column: the story, three facts in a strip (1400, 50,000+, 24/7) and what we care about, numbered.", Component: AboutA },
      { id: "B", name: "Bento", summary: "The story and the proof as tiles: a blue story tile, delivered count, start year, Enamad and the office; values below.", Component: AboutB },
      { id: "C", name: "Timeline", summary: "Heading and facts on one side; four moments (the problem, 1400, Enamad, today) on a line that lights up as you go.", Component: AboutC },
    ],
  },
  {
    id: "page-verify",
    title: "Page · Verification",
    kind: "page",
    offers: [
      { id: "A", name: "Two Doors", summary: "Two big choices first (buy a verified account / verify my own account), then only that kind's products; the chosen one's plans and form open below.", Component: VerifyA },
      { id: "B", name: "Catalog + Panel", summary: "Like the Subscriptions page: kind chips, search and a product grid; the chosen product's plans and form in a panel that follows you on desktop.", Component: VerifyB },
      { id: "C", name: "Guided Steps", summary: "One column of numbered steps: what you need → product → plan, details and documents. Finished steps fold to one line with Change.", Component: VerifyC },
      { id: "D", name: "Rows that Open", summary: "A calm list in two groups (ready accounts / we verify yours); opening a row unfolds its plans and form in place.", Component: VerifyD },
      { id: "E", name: "Privacy First", summary: "Opens on what happens to your documents (send → kept private → verified → deleted after 30 days), then product cards; the form opens in a sheet.", Component: VerifyE },
    ],
  },
  {
    id: "page-verify-form",
    title: "Page · Verification · Order form",
    kind: "page",
    variantOf: "page-verify",
    offers: [
      { id: "A", name: "Drop Zone", summary: "One column; each file is a large dashed box you can drop onto or tap. A green privacy box sits above the form.", Component: VerifyFormA },
      { id: "B", name: "Compact Rows", summary: "Fields grouped as «Your account» and «Your documents»; each file is a slim row with a Choose file button.", Component: VerifyFormB },
      { id: "C", name: "Camera First", summary: "Grouped like B, but each file offers Take a photo (opens the camera on phones) and Choose from files.", Component: VerifyFormC },
      { id: "D", name: "Checklist", summary: "Fields on one side, a «What we need · 2 of 5 ready» checklist with a progress bar beside them; each item jumps to its field.", Component: VerifyFormD },
    ],
  },
  {
    id: "subs-plan-select",
    title: "Subscriptions · Chosen plan colour",
    kind: "part",
    offers: [
      { id: "A", name: "Violet", summary: "The chosen plan fills violet (as it was before E was chosen).", Component: PlanSelectA },
      { id: "B", name: "Emerald", summary: "Fills with the site's own green, the same family as the main buttons.", Component: PlanSelectB },
      { id: "C", name: "Indigo", summary: "Fills indigo, the colour of the pay buttons; deeper and calmer than violet.", Component: PlanSelectC },
      { id: "D", name: "Violet outline", summary: "A violet border on a soft violet tint instead of a full fill; quieter, so the gold «محبوب‌ترین» badge leads.", Component: PlanSelectD },
      { id: "E", name: "Emerald outline (current)", summary: "A green border on a soft green tint; quiet, and in the site's own colour.", Component: PlanSelectE },
      { id: "F", name: "Ink", summary: "No colour: white in dark theme, black in light. The strongest contrast; the gold badge is the only accent.", Component: PlanSelectF },
    ],
  },
  {
    id: "subs-popular-badge",
    title: "Subscriptions · Popular badge with a business price",
    kind: "part",
    offers: [
      { id: "N", name: "Now", summary: "The gold pill beside the name, as it is today; with two prices the row gets crowded.", Component: PopularBadgeNow },
      { id: "A", name: "Tab on the top edge", summary: "The pill sits on the row's top border, so the row is left to the name and both prices.", Component: PopularBadgeTab },
      { id: "D", name: "Tab over the price", summary: "The same pill on the row's top border, but at the price's side.", Component: PopularBadgeTabEnd },
      { id: "E", name: "Folder tab", summary: "A gold tab joined to the row's top corner, like a folder tab: it reads as part of the plan, not a sticker.", Component: PopularBadgeFolder },
      { id: "F", name: "Gold band inside (current)", summary: "A thin gold strip across the top inside the row with «★ محبوب‌ترین»; name and prices sit under it.", Component: PopularBadgeBand },
    ],
  },
  {
    id: "subs-notes",
    title: "Subscriptions · Order notes (نکات کنار سفارش) in panel J",
    kind: "part",
    offers: [
      { id: "A", name: "Spec rows under the name", summary: "A tinted box of label / value rows right under the product name, before the plans: read first.", Component: NotesRows },
      { id: "B", name: "Chips under the name", summary: "The notes as small «عنوان: مقدار» pills under the name; takes the least room.", Component: NotesChips },
      { id: "C", name: "Checklist above Continue", summary: "Green-check lines between the total and Continue, the last thing read before paying.", Component: NotesChecklist },
      { id: "D", name: "Card under the panel", summary: "Its own small card «پیش از خرید بدانید» under the buy panel; the panel stays as it is today.", Component: NotesCard },
      { id: "E", name: "Fold «جزئیات سرویس»", summary: "A closed row under the plans that opens to the notes; nothing extra on screen until asked.", Component: NotesFold },
    ],
  },
  {
    id: "hero-catalog",
    title: "Home hero · Shop window",
    kind: "part",
    offers: [
      { id: "A", name: "Catalog Tabs (current)", summary: "A row of tabs with a sliding pill and the products as full cards. On phones the tabs run off both edges and the cards stack very long.", Component: CatalogA },
      { id: "B", name: "Icon Tiles + List", summary: "Five equal tiles (icon over a short name) that always fit, and the products as slim rows: a whole category fits on one phone screen.", Component: CatalogB },
      { id: "C", name: "Chips + Swipe", summary: "Category chips that wrap to a second line instead of scrolling; on phones the product cards sit side by side and swipe, the next one peeking in.", Component: CatalogC },
      { id: "D", name: "Category Menu", summary: "On phones each category is a row with its count and opens its products right under it; on wider screens a menu beside the products.", Component: CatalogD },
      { id: "E", name: "Segmented + Mini Cards", summary: "Five equal segments (icon over a short name) under one sliding pill; products as small cards two to a row, with the details on wider screens.", Component: CatalogE },
    ],
  },
  {
    id: "sub-how-delivered",
    title: "Subscriptions · How it's delivered",
    kind: "part",
    offers: [
      { id: "A", name: "Numbered row (current)", summary: "Three numbered steps side by side under a one-line heading, as it is now.", Component: DeliveredA },
      { id: "B", name: "Timeline", summary: "Icon stops joined by a line (down the side on phones, across on wide screens), the delivery time as a pill and a reassurance line under it.", Component: DeliveredB },
      { id: "C", name: "Step cards", summary: "Each step is its own card with a big icon and «Step 1/2/3», arrows between them on wide screens.", Component: DeliveredC },
      { id: "D", name: "Summary + checklist", summary: "A tinted panel says how it works and how long it takes; the steps sit beside it as a short checklist.", Component: DeliveredD },
      { id: "E", name: "Order tracker", summary: "One progress bar with three stops, like tracking a parcel; the last stop turns green.", Component: DeliveredE },
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
    id: "sub-single-bridge",
    title: "Single subscription · Bridge to How to use",
    kind: "part",
    offers: [
      { id: "A", name: "Logo Orbit", summary: "The product's tile glowing in the middle; six other subscriptions circle it slowly on a dashed ring, staying upright.", Component: SubBridgeA, archived: true },
      { id: "B", name: "Logo Marquee", summary: "Two rows of subscription chips (logo + name) drifting in opposite directions, fading at both edges; pauses on hover.", Component: SubBridgeB, archived: true },
      { id: "C", name: "Brand Aurora", summary: "Two soft clouds, one in the product's own colour, drifting over a faint dot grid. Pure atmosphere, the calmest one.", Component: SubBridgeC, archived: true },
      { id: "D", name: "Step Rail", summary: "A preview of the steps below: four icons (pick, pay, deliver, done) on a line light up one by one as a light runs along it.", Component: SubBridgeD, archived: true },
      { id: "E", name: "Rising Logos", summary: "Other subscriptions' tiles floating gently up and fading at staggered spots, like bubbles.", Component: SubBridgeE, archived: true },
      { id: "F", name: "Signal Ripple", summary: "The product's tile sending soft rings out in its own colour, with hairlines reaching to both sides.", Component: SubBridgeF, archived: true },
      { id: "G", name: "Promise Ticker", summary: "A pill with the product's logo turning over its own promises one at a time: delivery time, how it's activated, fixed or refunded.", Component: SubBridgeG, archived: true },
      { id: "H", name: "Brand Wave", summary: "Two thin waves in the product's colour and violet rolling across at different speeds.", Component: SubBridgeH, archived: true },
      { id: "I", name: "Constellation", summary: "The product at the centre with lines drawing out to six other subscriptions floating as stars; small dots twinkle between them.", Component: SubBridgeI, archived: true },
      { id: "J", name: "Glow Thread", summary: "A hairline in the product's colour drops from the cards; a bright dot runs down it to a bobbing arrow pointing at the steps.", Component: SubBridgeJ, archived: true },
      { id: "K", name: "Twin Threads", summary: "Two curved hairlines start under the cards and meet in the middle; dots slide down both and land on the arrow together.", Component: SubBridgeK, archived: true },
      { id: "L", name: "Flowing Dash", summary: "A dashed line in the product's colour that keeps flowing downward into a softly pulsing ring with the arrow.", Component: SubBridgeL, archived: true },
      { id: "M", name: "Comet Drop", summary: "A small comet with a fading tail falls down the thread and makes a ripple where it lands on the arrow.", Component: SubBridgeM, archived: true },
      { id: "N", name: "Chevron Cascade", summary: "Three stacked chevrons on the thread light up top to bottom, again and again, like a gentle scroll hint.", Component: SubBridgeN, archived: true },
      { id: "O", name: "Four Beads", summary: "Four beads on the thread, one per step below, light up in turn on the way down to the arrow.", Component: SubBridgeO, archived: true },
      { id: "P", name: "Logo Landing", summary: "The thread ends in the product's own logo instead of an arrow; each dot that lands makes the logo glow.", Component: SubBridgeP, archived: true },
      { id: "Q", name: "Triple Threads", summary: "K with three lines: two curved hairlines from the sides and a straight one down the middle meet at the arrow, a dot on each, landing together.", Component: SubBridgeQ, archived: true },
      { id: "R", name: "Triple Cascade", summary: "N three times: three widely spaced columns of chevrons on their own threads, the middle one longer, lighting top to bottom one after another.", Component: SubBridgeR },
    ],
  },
  {
    id: "tg-ads-budget",
    title: "Telegram Ads · Budget section",
    kind: "part",
    offers: [
      { id: "A", name: "Current", summary: "Today's layout: budget field, CPM as three radio cards plus My own, the estimate in a light strip, daily limit link.", Component: AdsBudgetA },
      { id: "B", name: "Calculator", summary: "Fields on one side, a blue result card on the other with views, clicks and the sum written out (budget ÷ CPM × 1,000). CPM is a four-way switch.", Component: AdsBudgetB },
      { id: "C", name: "Slider", summary: "The amount large with a slider from the minimum up; CPM levels as three cards side by side with speed bars; the estimate under them.", Component: AdsBudgetC },
      { id: "D", name: "Three Steps", summary: "Reads top to bottom as numbered steps on a line: how much, how fast (CPM list with speed bars), what you get.", Component: AdsBudgetD },
      { id: "E", name: "Compact", summary: "One row: budget, CPM as a drop-down, and the estimate as two chips with the daily limit beside them. The shortest.", Component: AdsBudgetE },
    ],
  },
  {
    id: "tg-ads-rules",
    title: "Telegram Ads · Where the ad rules sit",
    kind: "part",
    offers: [
      { id: "A", name: "Current", summary: "An amber box at the bottom of the page, after How it works.", Component: AdsRulesA },
      { id: "B", name: "Under the ad text", summary: "A compact amber box right under the ad text field, where the rules matter.", Component: AdsRulesB },
      { id: "C", name: "Live check", summary: "Under the ad text as a checklist: the text and link rules tick green as you type (red when broken); the other two are reminders.", Component: AdsRulesC },
      { id: "D", name: "Beside the preview", summary: "A folded amber box in the side column between the preview and the order card; one tap opens it.", Component: AdsRulesD },
      { id: "E", name: "Before you start", summary: "A slim strip above the form with the four rules as pills, read before anything is filled in.", Component: AdsRulesE },
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
      { id: "B", name: "Order Checklist", summary: "Four folding rows (platform, service, amount, link), one open at a time; closed rows show their answer and a tick, or the problem after Continue. Plain site theme.", Component: SocialB, archived: true },
      { id: "C", name: "Live Preview", summary: "The order card opens with a sketch of what you're growing in the platform's style, named from your link, and the number being added counts up. Platform as a compact icon row.", Component: SocialC, archived: true },
      { id: "D", name: "Price Board", summary: "Every service on one list with platform filters and search; rows show price per 1,000, start time and refill. Pick a row, then quality, amount and link below it.", Component: SocialD, archived: true },
      { id: "E", name: "Delivery Timeline", summary: "Platform and service as two dropdowns, a big amount with − / + and a slider, and a timeline of when it starts, when it's done and how long the refill covers.", Component: SocialE, archived: true },
      { id: "F", name: "Service Shelf", summary: "Light header with the platform switch, then every service as a card on one shelf (swipe row on phones). The chosen card lifts in the platform colour; amount, link and a sticky summary follow. Phones: a pay bar with the total.", Component: SocialPlatformF },
      { id: "G", name: "Compare", summary: "The platform's services side by side, one column each, with price, delivery, feature and amounts as rows. Pick a column; the order follows. Phones scroll the columns with the labels pinned.", Component: SocialPlatformG },
      { id: "H", name: "Catalog + Panel", summary: "Like /accounts and /virtual-numbers: a band in the platform's colours with title and platform switch; services as colour-washed cards, the chosen one's amount, link, total and Pay in a panel beside them (below on phones).", Component: SocialPlatformH },
      { id: "I", name: "Spec Tabs", summary: "The Spec Sheet you picked for a single service, with the platform's services as tabs under the title. Tabs stick under the header while you fill the form; fact tiles, form and summary follow the tab.", Component: SocialPlatformI },
      { id: "J", name: "Order Console", summary: "The whole order (service, amount, link, total, Pay) in one compact card in the hero, so a returning buyer is done without scrolling. Below, every service with its facts and an Order this button.", Component: SocialPlatformJ },
      { id: "K", name: "Band + Checklist", summary: "A's top as it is live (title, icon and platform switch on the band; the summary rises into it on desktop) with B's selection under it: service (as F's cards), amount and link as folding rows, one open at a time. Closed rows show the answer and a tick, or what to fix after Continue.", Component: SocialPlatformK, archived: true },
      { id: "L", name: "Band + Shelf", summary: "Live now. A's top as it is live (title, icon and platform switch on the band) with F's order under it: Pick a service as cards on one shelf over the band's edge (swipe row on phones), then amount and link beside a sticky summary. Phones: a pay bar with the total.", Component: SocialPlatformL },
    ],
  },
  {
    id: "page-social-service",
    title: "Page · Social Media Services · Single service",
    kind: "page",
    offers: [
      { id: "A", name: "Spec Sheet", summary: "Light header with the service's facts (start, speed, refill, feature) as four tiles right under the title, two by two on phones. Form, sticky summary, then promises, what happens after you pay, comments, FAQ. Phones: a pay bar with the total.", Component: SocialServiceA },
      { id: "B", name: "Step by Step", summary: "The order as three short steps (amount → link → check and pay) in one card, with Back / Next fixed to the bottom on phones. Each step shows the promise that fits it; promises stay beside the card on desktop.", Component: SocialServiceB },
      { id: "C", name: "Trust First", summary: "The platform's colour band holds the title, the four promises (swipeable on phones) and the newest real comment. One single-column order card overlaps it, with total and pay at its foot.", Component: SocialServiceC },
      { id: "D", name: "Receipt", summary: "The summary is a receipt that fills in as you choose, the facts as its lines and the promises stamped on it. On phones it's a bottom sheet: the total shows, tap to unfold and pay.", Component: SocialServiceD },
      { id: "E", name: "Tabs", summary: "Compact header with fact chips, then a tab bar that sticks under the site header (Order · Details · Comments · Questions) and follows where you are. Short stops on a phone.", Component: SocialServiceE },
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
      { id: "F", name: "Journey", summary: "The process walked through once: the cards rise in out of a soft blur, then each step in turn lights up in the page colour (outline, lift, a glow from its number) while its bar fills, and is ticked off as the next one lights. Ends with every step ticked; plays again when the steps come back into view. Hover a step to hold it. Live on Virtual number.", Component: DetailJourney },
    ],
  },
];

// Sections still to design, in page order.
export const upcoming = ["Service categories"];

export const getSection = (id: string) => sections.find((s) => s.id === id);
