import { ImageResponse } from "next/og";
import { readDecisions } from "@/components/design/decisions";
import { markById } from "@/design/logo/marks";

// The browser-tab icon: the logo chosen in /design/logo. Marks whose ink follows the page theme (Orbit, Frame) sit
// on a white tile so they stay visible on dark tab bars. With no choice yet, the old indigo-to-fuchsia S.
export const size = { width: 64, height: 64 };
export const contentType = "image/png";
export const dynamic = "force-dynamic";

export default async function Icon() {
  const m = markById((await readDecisions()).logo?.offer);
  if (!m) {
    return new ImageResponse(
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 16, background: "linear-gradient(135deg, #4F46E5, #D946EF)", color: "#fff", fontSize: 38, fontWeight: 700 }}>S</div>,
      size,
    );
  }
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "#0F172A", ...(m.ink ? { background: "#fff", borderRadius: 16 } : {}) }}>
      <m.Mark size={m.ink ? 52 : 64} />
    </div>,
    size,
  );
}
