import { timingSafeEqual } from "crypto";
import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

// admin › Cache (Back/app/Services/CacheManager.php) drops cached storefront data here: POST {tag} with the header
// X-Revalidate-Secret = REVALIDATE_SECRET. Tags: "storefront" (everything), "storefront:<section>", "cache-times".
const TAG = /^(storefront(:[a-z-]+)?|cache-times)$/;

function allowed(given: string | null) {
  const secret = process.env.REVALIDATE_SECRET;
  if (!secret || !given) return false;
  const a = Buffer.from(given);
  const b = Buffer.from(secret);
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function POST(req: Request) {
  if (!allowed(req.headers.get("x-revalidate-secret"))) return NextResponse.json({ error: "forbidden" }, { status: 403 });
  const { tag } = (await req.json().catch(() => ({}))) as { tag?: unknown };
  if (typeof tag !== "string" || !TAG.test(tag)) return NextResponse.json({ error: "bad tag" }, { status: 400 });
  revalidateTag(tag);
  return NextResponse.json({ revalidated: tag });
}
