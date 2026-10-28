"use client";

// Wrapper client cho sidebar desktop: active phải theo usePathname nên cần
// client; DS spec giữ qua Comp_NavItem asChild + next/link (SPA nav, không reload).
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Comp_NavItem } from "@/components/ui/ds/navitem";

export function NavItem({ href, label }: { href: string; label: string }) {
  const active = usePathname().startsWith(href);
  return (
    <Comp_NavItem asChild href={href} active={active} label={label}>
      <Link href={href}>{label}</Link>
    </Comp_NavItem>
  );
}
