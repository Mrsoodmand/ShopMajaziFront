import { promises as fs } from "fs";
import path from "path";
import { NextResponse } from "next/server";
import { readDecisions } from "@/components/design/decisions";

// Dev-only helper: persists the chosen offer per section to design/decisions.json.
export async function GET() {
  return NextResponse.json(await readDecisions());
}

export async function POST(req: Request) {
  if (process.env.NODE_ENV === "production") return NextResponse.json({ error: "disabled" }, { status: 403 });
  const { section, offer, note } = await req.json();
  if (typeof section !== "string" || typeof offer !== "string") return NextResponse.json({ error: "bad request" }, { status: 400 });
  const data = await readDecisions();
  data[section] = { offer, note: note || undefined, savedAt: new Date().toISOString() };
  await fs.writeFile(path.join(process.cwd(), "design", "decisions.json"), JSON.stringify(data, null, 2) + "\n");
  return NextResponse.json(data);
}
