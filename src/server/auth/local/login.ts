import "server-only";
import { getSession, type SessionData } from "./session";
import { findAppUserByEmail } from "./users";
import { verifyPassword } from "./passwords";
import { isAllowedEmail } from "../provider";
import type { AuthUser } from "../types";

export async function loginWithPassword(email: string, password: string): Promise<AuthUser | null> {
  if (!isAllowedEmail(email)) return null;

  const user = await findAppUserByEmail(email);
  if (!user) return null;

  const valid = await verifyPassword(user.passwordHash, password);
  if (!valid) return null;

  const session = await getSession();
  session.userId = user.id;
  session.email = user.email;
  await session.save();

  return { id: user.id, email: user.email };
}

export async function logout() {
  const session = await getSession();
  session.destroy();
}

export async function getLocalUser(): Promise<AuthUser | null> {
  const session = await getSession();
  const data = session as SessionData;
  if (!data.userId || !data.email) return null;
  return { id: data.userId, email: data.email };
}
