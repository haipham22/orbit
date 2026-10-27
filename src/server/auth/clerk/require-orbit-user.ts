import "server-only";
import { auth, currentUser } from "@clerk/nextjs/server";
import { isAllowedEmail } from "../provider";
import type { AuthUser } from "../types";

export async function getClerkUser(): Promise<AuthUser | null> {
  const { userId } = await auth();
  if (!userId) return null;

  const user = await currentUser();
  const email = user?.primaryEmailAddress?.emailAddress;
  if (!email || !isAllowedEmail(email)) return null;

  return { id: userId, email };
}
