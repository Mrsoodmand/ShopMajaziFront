// Error page copy, shared by the client offers (parts.tsx) and server files (app/not-found.tsx).
export const ERROR_CODES = ["400", "401", "403", "404", "419", "429", "500", "503"] as const;
export type ErrorCode = (typeof ERROR_CODES)[number];

export type Copy = { title: string; body: string; hint: string; retry?: boolean; signIn?: boolean };
// What happened, in plain words, and what the visitor can do next. No jargon, no blame.
export const errorCopy: Record<ErrorCode, Copy> = {
  "400": { title: "That request didn't make sense", body: "Something in the link or the form wasn't quite right, so we couldn't open it.", hint: "Check the address, or go back and try once more." },
  "401": { title: "Please sign in first", body: "This page belongs to an account. Sign in and we'll take you straight there.", hint: "New here? Signing up takes a few seconds.", signIn: true },
  "403": { title: "This page isn't open to you", body: "Your account doesn't have access to this page.", hint: "If you think it should, message support and we'll check." },
  "404": { title: "We couldn't find that page", body: "The link may be old, or the page has moved. Everything you came for is still here.", hint: "Search for a service, or start from one of these." },
  "419": { title: "This page expired", body: "You were away for a while, so the form timed out to keep your account safe.", hint: "Refresh the page and send it again. Nothing was charged.", retry: true },
  "429": { title: "Slow down a little", body: "You've sent us a lot of requests in a short time.", hint: "Wait a minute, then try again.", retry: true },
  "500": { title: "Something broke on our side", body: "It's not you. The error has been logged and we're on it.", hint: "Try again in a moment. Your wallet and orders are safe.", retry: true },
  "503": { title: "Back in a few minutes", body: "We're updating the site to make it better.", hint: "Your wallet and orders are safe. Please check back shortly.", retry: true },
};

export const isCode = (v: string | undefined): v is ErrorCode => !!v && (ERROR_CODES as readonly string[]).includes(v);
