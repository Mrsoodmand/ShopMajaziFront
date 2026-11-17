// The Laravel backend. Locally it runs on :8001 (see .claude/launch.json "back"); set BACKEND_URL to point elsewhere.
export const BACKEND_URL = (process.env.BACKEND_URL ?? "http://127.0.0.1:8001").replace(/\/$/, "");

type ApiEnvelope<T> = { success: boolean; message: string | null; data: T };

// Whether a storefront() failure was the backend saying "no such page" (rather than being unreachable).
export const isNotFound = (e: unknown) => (e as { status?: number } | null)?.status === 404;

// Seconds per section an admin set in admin › Cache (GET storefront/cache-times); sections not listed keep the
// time their page passes. Read at most once a minute, and never in the way: on any error the pages' own times apply.
async function cacheTimes(): Promise<Record<string, number>> {
  try {
    const res = await fetch(`${BACKEND_URL}/api/v1/storefront/cache-times`, {
      headers: { Accept: "application/json" },
      next: { revalidate: 60, tags: ["storefront", "cache-times"] },
    });
    if (!res.ok) return {};
    const body = (await res.json()) as ApiEnvelope<{ times: Record<string, number> }>;
    return body.success ? body.data.times ?? {} : {};
  } catch {
    return {};
  }
}

// GET a storefront endpoint from a server component. `revalidate` is in seconds (Next.js data cache), unless admin ›
// Cache set another time for the section (the path's first part, e.g. "blog" for "blog/x"). Every response is tagged
// "storefront" and "storefront:<section>", so admin › Cache can clear one section or all (src/app/api/revalidate).
export async function storefront<T>(path: string, revalidate = 300): Promise<T> {
  const clean = path.replace(/^\//, "");
  const section = clean.split(/[/?]/)[0];
  const seconds = (await cacheTimes())[section] ?? revalidate;
  const res = await fetch(`${BACKEND_URL}/api/v1/storefront/${clean}`, {
    headers: { Accept: "application/json" },
    next: { revalidate: seconds, tags: ["storefront", `storefront:${section}`] },
  });
  if (!res.ok) throw Object.assign(new Error(`Backend ${path}: HTTP ${res.status}`), { status: res.status });
  const body = (await res.json()) as ApiEnvelope<T>;
  if (!body.success) throw new Error(`Backend ${path}: ${body.message ?? "failed"}`);
  return body.data;
}
