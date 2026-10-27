import { getUser } from "@/server/auth/current-user";
import type { AuthUser } from "@/server/auth/types";

export type Context = {
  user: AuthUser | null;
};

export async function createContext(): Promise<Context> {
  return { user: await getUser() };
}
