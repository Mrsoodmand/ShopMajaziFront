import { ApiError } from "@/lib/account";
import type { T } from "@/i18n/translate";

// What to tell people for each backend error code (Api\StorefrontAccountController). English here, Persian in
// i18n/fa/account.ts. Unknown codes fall back to the backend's own (Persian) message, or a generic line in English.
const MESSAGES: Record<string, string> = {
  mobile_invalid: "Enter a valid Iranian mobile number, like 0912 345 6789.",
  no_user: "No account uses this number.",
  wrong_password: "Wrong password.",
  wrong_code: "That code is wrong or has expired.",
  name_invalid: "Enter your name (3 to 40 letters).",
  password_invalid: "Use a password of 6 to 30 characters.",
  email_invalid: "That email doesn't look right.",
  user_exists: "An account already uses this number. Sign in instead.",
  too_many_codes: "Too many codes requested. Try again in an hour.",
  auth: "Please sign in to continue.",
  unavailable: "This number isn't available right now. Pick another server or country.",
  out_of_stock: "No numbers left on this server right now. Pick another server or country.",
  balance: "Not enough in your wallet. Top up and try again.",
  busy: "Your last request is still running. Wait a moment and try again.",
  wallet_blocked: "Wallet payments are turned off for your account. Please contact support.",
  price_changed: "The price just changed to {price}. Check it and pay again.",
  cancel_failed: "Couldn't cancel this number yet. Try again in a minute.",
  not_found: "Order not found.",
  network: "Couldn't reach the server. Check your connection and try again.",
  bank_unavailable: "Couldn't reach the bank. Please try again.",
  bank_blocked: "Card payments are turned off for your account. Please contact support.",
  sold: "Someone just bought this number. Pick another one.",
  sold_refunded: "Someone bought this number a moment earlier. Your money is back in your wallet; pick another one.",
  gv_paused: "Google Voice sales are paused for a moment. Please try again a little later.",
  provider_unavailable: "Couldn't reach the number provider. Please try again in a minute.",
  apple_paused: "Apple ID sales are paused for a moment. Please try again a little later.",
  apple_stock: "Not that many ready Apple IDs are in stock right now. Choose fewer, or a custom one.",
  qty_invalid: "Choose 1 to 10 Apple IDs, or a partner pack.",
  details_invalid: "Some of your details aren't valid. Check the form and try again.",
  service_unavailable: "This service isn't on sale right now. Pick another one.",
  count_invalid: "Choose an amount within the limits shown, in the steps shown.",
  plan_invalid: "That package isn't offered any more. Pick another one.",
  fields_invalid: "Some answers aren't valid. Check the fields and try again.",
};

export function errorText(e: unknown, t: T, format: (n: number) => string = String): string {
  if (e instanceof ApiError) {
    const text = MESSAGES[e.code];
    if (text) return t(text, { price: typeof e.data?.price === "number" ? format(e.data.price) : "" });
    if (t.locale === "fa" && /[؀-ۿ]/.test(e.message)) return e.message;
  }
  return t("Something went wrong. Please try again.");
}
