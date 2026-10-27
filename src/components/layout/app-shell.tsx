import Link from "next/link";
import type { ReactNode } from "react";
import { Separator } from "@/components/ui/separator";
import { LogoutButton } from "./logout-button";
import { authProvider } from "@/server/auth/provider";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/people", label: "People" },
  { href: "/journal", label: "Journal" },
  { href: "/tasks", label: "Tasks" },
];

export function AppShell({ email, children }: { email: string; children: ReactNode }) {
  return (
    <div className="flex min-h-svh flex-1">
      <aside className="flex w-56 flex-col gap-4 border-r p-4">
        <div className="px-2 text-lg font-semibold tracking-tight">orbit</div>
        <nav className="flex flex-col gap-1">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-2 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="mt-auto flex flex-col gap-2">
          <Separator />
          <div className="truncate px-2 text-xs text-muted-foreground">{email}</div>
          {authProvider === "local" && <LogoutButton />}
        </div>
      </aside>
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
