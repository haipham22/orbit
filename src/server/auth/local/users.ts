import { eq } from "drizzle-orm";
import { db } from "@/server/db/client";
import { appUsers } from "@/server/db/schema";

export async function findAppUserByEmail(email: string) {
  const [user] = await db
    .select()
    .from(appUsers)
    .where(eq(appUsers.email, email.trim().toLowerCase()))
    .limit(1);
  return user ?? null;
}

export async function upsertAppUserPassword(email: string, passwordHash: string) {
  const normalized = email.trim().toLowerCase();
  await db
    .insert(appUsers)
    .values({ email: normalized, passwordHash })
    .onConflictDoUpdate({ target: appUsers.email, set: { passwordHash, updatedAt: new Date() } });
}
