import type { ReactNode } from "react";
import { requireUser } from "@/server/auth/current-user";
import { AppShell } from "@/components/layout/app-shell";

export const dynamic = "force-dynamic";

export default async function AppLayout({ children }: { children: ReactNode }) {
  const user = await requireUser();
  return <AppShell email={user.email}>{children}</AppShell>;
}
