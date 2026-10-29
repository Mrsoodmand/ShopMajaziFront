import { Old_Standard_TT } from "next/font/google";
import "./lexicon.css";

// Old Standard: a revival of the book type of late-nineteenth-century dictionaries and lexicons.
const lexicon = Old_Standard_TT({ subsets: ["latin"], weight: ["400", "700"], style: ["normal", "italic"], variable: "--font-lexicon" });

// Landing pages share one world, the ShopMajazi Lexicon (see .impeccable/surfaces/front-src-design-landing-lexicon-tsx.md).
// English for now, so the page sets its own direction; the layout uses logical sides for the Persian version.
export default function LandingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div lang="en" dir="ltr" className={`lx ${lexicon.variable} min-h-screen`}>
      {children}
    </div>
  );
}
