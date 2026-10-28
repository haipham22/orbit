"use client";

// Adapter Comp_NavItem cho sidebar desktop: Comp_NavItem sinh <a> (full-page reload)
// và không nhận children/onClick nên không bọc được bằng next/link. File DS là
// sinh tự động (không sửa tay), nên adapter này giữ spec Comp_NavItem
// (active = aria-current="page" + màu primary) nhưng render Link để giữ SPA nav.
import Link from "next/link";
import { usePathname } from "next/navigation";

export function NavItem({ href, label }: { href: string; label: string }) {
  const active = usePathname().startsWith(href);
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={
        "block rounded-md px-2 py-1.5 text-sm font-semibold transition-colors " +
        (active
          ? "text-primary"
          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground")
      }
    >
      {label}
    </Link>
  );
}
