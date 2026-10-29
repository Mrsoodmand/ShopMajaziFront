// The Laravel backend. Locally it runs on :8001 (see .claude/launch.json "back"); set BACKEND_URL to point elsewhere.
export const BACKEND_URL = (process.env.BACKEND_URL ?? "http://127.0.0.1:8001").replace(/\/$/, "");

type ApiEnvelope<T> = { success: boolean; message: string | null; data: T };

// Whether a storefront() failure was the backend saying "no such page" (rather than being unreachable).
export const isNotFound = (e: unknown) => (e as { status?: number } | null)?.status === 404;

// GET a storefront endpoint from a server component. `revalidate` is in seconds (Next.js data cache).
export async function storefront<T>(path: string, revalidate = 300): Promise<T> {
  const res = await fetch(`${BACKEND_URL}/api/v1/storefront/${path.replace(/^\//, "")}`, {
    headers: { Accept: "application/json" },
    next: { revalidate },
  });
  if (!res.ok) throw Object.assign(new Error(`Backend ${path}: HTTP ${res.status}`), { status: res.status });
  const body = (await res.json()) as ApiEnvelope<T>;
  if (!body.success) throw new Error(`Backend ${path}: ${body.message ?? "failed"}`);
  return body.data;
}
