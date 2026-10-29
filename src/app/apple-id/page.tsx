import { appleMetadata, ApplePage } from "./render";

export const dynamic = "force-dynamic";

export const generateMetadata = () => appleMetadata();

// The live Apple ID page (opens on Ready). /apple-id/usa and /apple-id/custom open on a specific kind.
export default function AppleIdPage() {
  return <ApplePage />;
}
