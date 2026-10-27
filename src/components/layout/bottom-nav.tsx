"use client";

// Bottom tab bar mobile (<md) — DS PERSONAS: mobile tối giản, vùng chạm ≥44px.
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, LayoutDashboard, ListChecks, Users } from "lucide-react";
import { useTranslations } from "next-intl";

const ITEMS = [
  { href: "/dashboard", key: "dashboard", icon: LayoutDashboard },
  { href: "/people", key: "people", icon: Users },
  { href: "/journal", key: "journal", icon: BookOpen },
  { href: "/tasks", key: "tasks", icon: ListChecks },
] as const;

export function BottomNav() {
  const pathname = usePathname();
  const t = useTranslations("nav");
  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-40 flex border-t bg-background/95 backdrop-blur md:hidden"
    >
      {ITEMS.map(({ href, key, icon: Icon }) => {
        const active = pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={
              "flex min-h-14 flex-1 flex-col items-center justify-center gap-0.5 text-[length:var(--type-size-sm)] " +
              (active ? "font-semibold text-primary" : "text-muted-foreground")
            }
          >
            <Icon className="size-5" aria-hidden />
            {t(key)}
          </Link>
        );
      })}
    </nav>
  );
}
