/* SINH TỰ ĐỘNG từ components/Comp_NavItem.mdx — không sửa tay, chạy make package */

// Standalone — deps: react, @radix-ui/react-slot (cho asChild — next/link của Next.js)
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"

const cn = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(" ")

const Spin = () => (
  <span aria-hidden className="inline-block size-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
)

export function Comp_NavItem({ label, active, state = "default", href, asChild, children }: {
  label: string; active?: boolean; state?: "default" | "sending" | "disabled"; href: string
  asChild?: boolean; children?: React.ReactNode
}) {
  const cls = cn("font-semibold py-2 px-3 border-b-2",
    active ? "text-[var(--color-primary)] border-[var(--color-primary)]" : "text-[var(--color-fg-muted)] border-transparent",
    state === "disabled" && "opacity-70 pointer-events-none")
  if (asChild) {
    return (
      <Slot className={cls} aria-current={active ? "page" : undefined} aria-busy={state === "sending" || undefined}>
        {children}
      </Slot>
    )
  }
  return (
    <a href={href} aria-current={active ? "page" : undefined} aria-busy={state === "sending" || undefined} className={cls}>
      {state === "sending" ? <Spin /> : null} {label}
    </a>
  )
}
