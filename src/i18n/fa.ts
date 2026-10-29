// English → Persian, keyed by the English text exactly as written in the components (spacing is ignored).
// `{name}` placeholders must appear in both. Entries are grouped by area in ./fa/*.ts.
import { common } from "./fa/common";
import { numbers } from "./fa/numbers";
import { services } from "./fa/services";
import { subs } from "./fa/subs";
import { telegram } from "./fa/telegram";
import { extras } from "./fa/extras";
import { content } from "./fa/content";
import { account } from "./fa/account";
import { numberCatalog } from "./fa/numberCatalog";

export const fa: Record<string, string> = { ...common, ...numbers, ...services, ...subs, ...telegram, ...extras, ...content, ...account, ...numberCatalog };

// Sentences built from data at runtime. Each pattern is a regex for the whole English text; $1… in the Persian
// are the captured parts, themselves translated when there is an entry for them.
export const faPatterns: [string, string][] = [
  ["Email of your (.+) account", "ایمیل اکانت $1 شما"],
  ["We activate the plan on this (.+) account\\.", "پلن را روی همین اکانت $1 فعال می‌کنیم."],
  ["(\\d+) months", "$1 ماه"],
  ["(\\d+) comments?", "$1 نظر"],
];
