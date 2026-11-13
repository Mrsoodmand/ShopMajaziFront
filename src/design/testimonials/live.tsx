"use client";

import { createContext, useContext, type ReactNode } from "react";

// Real testimonials for the home page (lib/comments.ts › loadTestimonials, formatted on the server). Without this
// provider (the /design previews) the offers show the placeholder reviews.
export type LiveTestimonial = { id: string; name: string; text: string; date: string; about: string };
const Ctx = createContext<LiveTestimonial[] | null>(null);

export function LiveTestimonialsProvider({ value, children }: { value: LiveTestimonial[]; children: ReactNode }) {
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useLiveTestimonials = () => useContext(Ctx);
