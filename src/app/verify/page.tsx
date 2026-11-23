import { verifyMetadata, VerifyPage } from "./render";

export const dynamic = "force-dynamic";

export const generateMetadata = () => verifyMetadata();

// The live Verification catalog (same design as /accounts). Each product also has its own page at /verify/{slug}.
export default function VerifyIndexPage() {
  return <VerifyPage />;
}
