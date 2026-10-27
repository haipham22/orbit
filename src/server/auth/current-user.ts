import "server-only";
import { redirect } from "next/navigation";
import { authProvider } from "./provider";
import { getLocalUser } from "./local/login";
import { getClerkUser } from "./clerk/require-orbit-user";
import type { AuthUser } from "./types";

export async function getUser(): Promise<AuthUser | null> {
  return authProvider === "clerk" ? getClerkUser() : getLocalUser();
}

export async function requireUser(): Promise<AuthUser> {
  const user = await getUser();
  if (!user) redirect("/sign-in");
  return user;
}
