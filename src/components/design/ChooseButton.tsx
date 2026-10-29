"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";

export default function ChooseButton({ section, offer, chosen }: { section: string; offer: string; chosen: boolean }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function choose() {
    setBusy(true);
    await fetch("/api/design-choice", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ section, offer }) });
    setBusy(false);
    router.refresh();
  }

  if (chosen)
    return <span className="flex items-center gap-1.5 rounded-full bg-emerald-500 px-4 py-1.5 text-xs font-semibold text-white"><Check className="h-3.5 w-3.5" />Chosen</span>;
  return (
    <button onClick={choose} disabled={busy} className="rounded-full bg-white px-4 py-1.5 text-xs font-semibold text-slate-900 hover:bg-slate-200 disabled:opacity-50">
      {busy ? "Saving…" : "Choose this"}
    </button>
  );
}
