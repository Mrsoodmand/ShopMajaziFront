import { ImageResponse } from "next/og";
import { readDecisions } from "@/components/design/decisions";
import { markById } from "@/design/logo/marks";

// /share-image.png: the logo chosen in /design/logo as a 600×600 picture, for link previews (Telegram, WhatsApp, X…)
// of pages without an image of their own (lib/seo.ts › withShare). Drawn like the browser-tab icon (app/icon.tsx),
// on white so marks whose ink follows the page theme stay visible.
export const dynamic = "force-dynamic";

const SIZE = 600;

export async function GET() {
  const m = markById((await readDecisions()).logo?.offer);
  const mark = !m ? null : m.src ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={m.src} width={SIZE * 0.72} height={SIZE * 0.72} alt="" style={{ borderRadius: SIZE * 0.16 }} />
  ) : (
    <m.Mark size={SIZE * 0.72} />
  );
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#fff" }}>
      {mark ?? <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: SIZE * 0.72, height: SIZE * 0.72, borderRadius: SIZE * 0.16, background: "linear-gradient(135deg, #4F46E5, #D946EF)", color: "#fff", fontSize: 260, fontWeight: 700 }}>S</div>}
    </div>,
    { width: SIZE, height: SIZE, headers: { "Cache-Control": "public, max-age=86400" } },
  );
}
