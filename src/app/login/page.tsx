import type { Metadata } from "next";
import { getT } from "@/i18n/server";
import LoginView from "./LoginView";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getT();
  return { title: t("Sign in or sign up — ShopMajazi"), robots: { index: false } };
}

// /login: the header's "Sign in / Sign up". Goes back to ?next= (a path on this site) once signed in.
export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const { next } = await searchParams;
  const safeNext = next && next.startsWith("/") && !next.startsWith("//") ? next : "/";
  return <LoginView next={safeNext} />;
}
