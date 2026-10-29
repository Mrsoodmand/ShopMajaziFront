import Link from "next/link";
import { postHref, posts, type Post } from "@/content/blog-en";
import Cover from "./Cover";
import { Chip, Heading, Meta } from "./parts";

// Offer D — "Magazine Bento": one large tile and three smaller ones, titles written over the cover like a magazine.
export default function BlogD() {
  const Tile = ({ p, className = "", big = false }: { p: Post; className?: string; big?: boolean }) => (
    <Link href={postHref(p)} className={`group relative block overflow-hidden rounded-3xl ${className}`}>
      <Cover cat={p.cat} size={big ? "lg" : "sm"} corner className="absolute inset-0" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
      <div className={`relative flex h-full flex-col justify-end ${big ? "p-8" : "p-5"}`}>
        <Chip p={p} light />
        <h3 className={`mt-3 font-display font-semibold leading-snug text-white ${big ? "text-2xl sm:text-3xl" : "line-clamp-2 text-base"}`}>{p.title}</h3>
        {big && <p className="mt-2 max-w-lg text-sm text-white/80">{p.excerpt}</p>}
        <div className="mt-3"><Meta p={p} light /></div>
      </div>
    </Link>
  );

  return (
    <section className="bg-[#F6F5F1] py-24 dark:bg-[#070B14]">
      <div className="mx-auto max-w-6xl px-6">
        <Heading kicker="The journal" title="Read, learn, level up" />
        <div className="mt-12 grid auto-rows-[220px] gap-4 md:grid-cols-4">
          <Tile p={posts[0]} big className="md:col-span-2 md:row-span-2" />
          <Tile p={posts[1]} className="md:col-span-2" />
          <Tile p={posts[2]} />
          <Tile p={posts[3]} />
        </div>
      </div>
    </section>
  );
}
