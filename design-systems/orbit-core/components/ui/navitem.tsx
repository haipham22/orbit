/* SINH TỰ ĐỘNG từ components/Comp_NavItem.mdx — không sửa tay, chạy make package */

import { cn } from "@/lib/utils"

export function Comp_NavItem({ label, active, state = "default", href }: { label: string; active?: boolean; state?: "default" | "sending" | "disabled"; href: string }) {
  return <a href={href} aria-current={active ? "page" : undefined} aria-busy={state === "sending"}
    className={cn("font-semibold py-2 px-1 border-b-2", active ? "text-[var(--color-primary)] border-[var(--color-primary)]" : "text-[var(--color-fg-muted)] border-transparent", state === "disabled" && "opacity-50 pointer-events-none")}>
    {state === "sending" ? <Spinner /> : null} {label}
  </a>
}
