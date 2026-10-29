import { accountsMetadata, AccountsPage } from "./render";

export const dynamic = "force-dynamic";

export const generateMetadata = () => accountsMetadata();

// The live Subscriptions page (opens on ChatGPT Plus). Each subscription also has its own page at /accounts/{slug}.
export default function AccountsIndexPage() {
  return <AccountsPage />;
}
