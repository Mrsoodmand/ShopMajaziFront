import { BookOpen, Smartphone, Apple, Send, Users, Newspaper, type LucideIcon } from "lucide-react";
import type { BlogCat } from "@/content/blog-en";

// Stand-in cover art until real post images come from the blog: a gradient per category with a large icon.
const looks: Record<BlogCat, { bg: string; icon: LucideIcon }> = {
  guides: { bg: "from-amber-300 via-orange-400 to-rose-500", icon: BookOpen },
  numbers: { bg: "from-indigo-500 via-violet-500 to-fuchsia-500", icon: Smartphone },
  apple: { bg: "from-slate-600 via-slate-800 to-slate-950", icon: Apple },
  telegram: { bg: "from-sky-400 via-blue-500 to-indigo-600", icon: Send },
  social: { bg: "from-sky-400 via-cyan-500 to-emerald-500", icon: Users },
  news: { bg: "from-rose-400 via-fuchsia-500 to-indigo-600", icon: Newspaper },
};

// `corner` puts the icon top-right, for tiles that write text over the cover.
export default function Cover({ cat, className = "", size = "md", corner = false }: { cat: BlogCat; className?: string; size?: "sm" | "md" | "lg"; corner?: boolean }) {
  const { bg, icon: Icon } = looks[cat];
  const icon = size === "lg" ? "h-24 w-24" : size === "sm" ? "h-8 w-8" : "h-14 w-14";
  return (
    <div aria-hidden className={`${className.includes("absolute") ? "" : "relative"} overflow-hidden bg-gradient-to-br ${bg} ${className}`}>
      <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,.25)_1px,transparent_1px)] bg-[size:16px_16px] opacity-60" />
      <div className="absolute -end-6 -top-6 h-32 w-32 rounded-full bg-white/20 blur-2xl" />
      <Icon className={`absolute text-white/85 drop-shadow-lg transition duration-500 group-hover:scale-110 ${corner ? "end-6 top-6" : "start-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rtl:translate-x-1/2"} ${icon}`} strokeWidth={1.5} />
    </div>
  );
}
