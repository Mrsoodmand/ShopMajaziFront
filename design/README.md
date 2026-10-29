# Design offers

The new ShopMajazi front end is designed one section at a time. Each section gets several offers, and every offer stays in the code even after one is chosen.

- Offers live in `src/design/<section>/` and are registered in `src/design/registry.ts`.
- Compare them at `/design/<section>`. Open one full screen at `/design/<section>/<offer>`.
- **Choose this** saves the pick to `design/decisions.json` (dev only).
- `/` puts together the chosen offer of every section.

English copy lives in `src/content/en.ts`. Layouts use logical `start`/`end` spacing so the Persian (RTL) version can reuse them.

| Section | Offers | Chosen |
|---|---|---|
| Hero | A Command Center · B Bento Store · C Live Demo · D Marquee Pop · E Editorial Trust · F A×B Merge · G Catalog Tabs · H Card Deck · I Globe · J Mega Bento · K Dashboard Preview | **G** Catalog Tabs |
| How to buy | A Step Row · B Interactive Stepper · C Stopwatch Timeline · D Bento Steps · E Per-service Guide | **E** Per-service Guide |
| How to buy · Arrow | A Chevron Chip · B Gradient Orb · C Flow Line · D Chevron Trail · E Progress Rail | **D** Chevron Trail (used inside How to buy E) |
| Content area (SEO) | A Read More Article · B Guide with Contents · C Topic Accordion · D Magazine · E Knowledge Tabs | **B** Guide with Contents |
| Header / Nav | A Mega Menu · B Floating Pill · C Store Bar · D Command Search · E Account Bar · F All Services Menu | **F** All Services Menu (with dark mode) |
| FAQ | A Classic Accordion · B Category Tabs · C Search FAQ · D Split Q&A · E Answer Cards · F Tabs × Split | **F** Tabs × Split |
| Blog | A Featured + List · B Card Grid · C Carousel · D Magazine Bento · E Topic List | **C** Carousel (mouse drag, no progress bar) |
| Footer | A Classic Columns · B CTA + Wordmark · C Dark Newsletter · D Compact Centered · E Support First · F Support + Wordmark | **F** Support + Wordmark |
| Footer · Link style | A Slide + Underline · B Arrow Reveal · C Soft Pill · D Highlight Sweep · E Dot Marker | **B** Arrow Reveal (used inside footer F) |
| Testimonials | A Marquee Wall · B Spotlight · C Masonry Grid · D Score + Filter · E Chat Thread | **D** Score + Filter (How to buy E-style tabs) |
| Why us | A Icon Grid · B Bento Proof · C Comparison · D Live Counters · E Scroll Story | **D** Live Counters |
| Popular products | A Product Grid · B Top 5 Chart · C Tabbed Shelf · D Deal of the Day · E Price Board | — |

## Pages

Whole-page designs use the chosen header and footer and never join the home page.

| Page | Offers | Chosen |
|---|---|---|
| Telegram Stars | A Pack Grid · B Big Counter · C Gift Preview · D Night Sky · E Bot Chat · F Pack Grid on Gold Glow · G Constellation · H Galaxy Slider · I Gift Card · J Bento · K Star Stacks | **F** (A's layout on a theme-aware gold background) · live at /telegram/stars |
| Telegram Premium | A Pricing Page · B Profile Preview · C Feature Tour · D Free vs Premium · E One Card · F Profile Preview on Night Sky · G Feature Orbit · H Before / After · I Timeline · J Gift Box · K Feature Bento · L Telegram's Premium Sheet · M Profile First · N Membership Card · O Gift Message · P Three Steps · Q In-App Screen | **K** (Feature Bento, with the site's green Continue) · live at /telegram/premium |
| Telegram Ads | A Campaign Builder · B Packages · C Step by Step · D Budget Calculator · E Done for You · F Telegram Ads Form | **F** (like Telegram's own ad form; no language/topic/exclude targeting) |
| Virtual Number (OTP) | Flow: app ⇄ country (either first) → operator → payment → buy → order view. K Guided Steps · L Three Columns · M Quick-Buy Hero · N Drill-down Tiles · O Checkout (A–J archived) | **L** Three Columns (Telegram + its cheapest country pre-selected; on phones steps fold and scroll to the next) |
