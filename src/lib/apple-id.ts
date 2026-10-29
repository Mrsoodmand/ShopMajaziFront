// Apple IDs from the backend (GET /api/v1/storefront/apple-id → prices set in admin › Apple ID, and ready stock).
export type ApiAppleId = { ready_price: number; custom_price: number; stock: number; max_qty: number; packs: number[] };

// A delivered login (password, birthday and security answers, decrypted by the backend for the buyer only).
export type ApiAppleAccount = { apple_id: string; password: string; birthday: string; answers: string[] };

// An order, from POST apple-id/buy and GET apple-id/orders/{id}.
// "preparing": paid, and support is making the custom one (or the ready stock ran short and the rest is on its way).
export type ApiAppleOrder = {
  id: number;
  kind: "ready" | "custom";
  status: "delivered" | "preparing" | "unpaid" | "failed";
  qty: number;
  price: number;
  paid_with: "wallet" | "card";
  created_at: string;
  accounts: ApiAppleAccount[];
  details: { first: string; last: string; email: string } | null;
};
