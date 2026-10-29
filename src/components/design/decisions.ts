import { promises as fs } from "fs";
import path from "path";

export type Decisions = Record<string, { offer: string; note?: string; savedAt: string }>;

export async function readDecisions(): Promise<Decisions> {
  try {
    return JSON.parse(await fs.readFile(path.join(process.cwd(), "design", "decisions.json"), "utf8"));
  } catch {
    return {};
  }
}
