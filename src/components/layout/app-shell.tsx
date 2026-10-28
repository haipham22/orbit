import type { ReactNode } from "react";
import { getTranslations } from "next-intl/server";
import { Separator } from "@/components/ui/separator";
import { NavItem } from "./nav-item";
import { BottomNav } from "./bottom-nav";
import { LanguageToggle } from "./language-toggle";
import { LogoutButton } from "./logout-button";
import { ThemeToggle } from "./theme-toggle";
import { authProvider } from "@/server/auth/provider";

const NAV_ITEMS = [
  { href: "/dashboard", key: "dashboard" },
  { href: "/people", key: "people" },
  { href: "/journal", key: "journal" },
  { href: "/tasks", key: "tasks" },
] as const;

export async function AppShell({ email, children }: { email: string; children: ReactNode }) {
  const t = await getTranslations("nav");
  return (
    <div className="flex min-h-svh flex-1">
      {/* Sidebar desktop (>=md) — ẩn mobile, mobile dùng BottomNav */}
      <aside className="hidden w-56 flex-col gap-4 border-r p-4 md:flex">
        <div className="px-2 text-lg font-semibold tracking-tight">orbit</div>
        <nav className="flex flex-col gap-1">
          {NAV_ITEMS.map((item) => (
            <NavItem key={item.href} href={item.href} label={t(item.key)} />
          ))}
        </nav>
        <div className="mt-auto flex flex-col gap-2">
          <Separator />
          <div className="truncate px-2 text-xs text-muted-foreground">{email}</div>
          <div className="flex items-center gap-1">
            <LanguageToggle />
            <ThemeToggle />
            {authProvider === "local" && <LogoutButton />}
          </div>
        </div>
      </aside>
      {/* Topbar mobile: brand + toggles */}
      <div className="flex min-h-svh w-full flex-col">
        <header className="flex items-center justify-between border-b p-4 md:hidden">
          <span className="text-lg font-semibold tracking-tight">orbit</span>
          <div className="flex items-center gap-1">
            <LanguageToggle />
            <ThemeToggle />
            {authProvider === "local" && <LogoutButton />}
          </div>
        </header>
        <main className="flex-1 p-4 pb-24 md:p-6">{children}</main>
        <BottomNav />
      </div>
    </div>
  );
}
