import ErrorsD from "@/design/errors/ErrorsD";
import { errorCopy } from "@/design/errors/copy";
import { getT } from "@/i18n/server";

// 404 for pages Next.js owns (a missing blog post, product or service). Unknown URLs Next.js has no page for go
// to Laravel through the fallback rewrite, whose 404 (resources/views/errors) uses the same design (D).
export default async function NotFound() {
  const t = await getT();
  return (
    <>
      <title>{`${t(errorCopy["404"].title)} — ${t("ShopMajazi")}`}</title>
      <meta name="robots" content="noindex" />
      <ErrorsD code="404" />
    </>
  );
}
