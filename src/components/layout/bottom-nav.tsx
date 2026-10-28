"use client";

// Bottom tab bar mobile (<md) — Comp_BottomNav asChild + next/link giữ SPA nav;
// active theo usePathname, vùng chạm theo DS (--control-height-lg).
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, LayoutDashboard, ListChecks, Settings, Users } from "lucide-react";
import { useTranslations } from "next-intl";
import { Comp_BottomNav } from "@/components/ui/ds/bottomnav";

const ITEMS = [
  { href: "/dashboard", key: "dashboard", icon: LayoutDashboard },
  { href: "/people", key: "people", icon: Users },
  { href: "/journal", key: "journal", icon: BookOpen },
  { href: "/tasks", key: "tasks", icon: ListChecks },
  { href: "/settings", key: "settings", icon: Settings },
] as const;

export function BottomNav() {
  const pathname = usePathname();
  const t = useTranslations("nav");
  return (
    <Comp_BottomNav
      ariaLabel="Primary"
      items={ITEMS.map(({ href, key, icon: Icon }) => {
        const active = pathname.startsWith(href);
        // asChild: Slot bọc Link — icon + label phải là children của Link
        // (trường icon/label của NavTarget chỉ dùng cho nhánh <a> thường).
        return {
          href,
          label: t(key),
          icon: <Icon className="size-5" aria-hidden />,
          active,
          asChild: true as const,
          children: (
            <Link href={href}>
              <Icon className="size-5" aria-hidden />
              {t(key)}
            </Link>
          ),
        };
      })}
    />
  );
}
