/* SINH TỰ ĐỘNG từ components/Comp_BottomNav.mdx — không sửa tay, chạy make package */

// Standalone — deps: react, @radix-ui/react-slot (cho asChild — next/link)
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"

const cn = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(" ")

export type NavTarget = { href: string; label: string; icon: React.ReactNode; active?: boolean; asChild?: boolean; children?: React.ReactNode }

export function Comp_BottomNav({ items, ariaLabel }: { items: NavTarget[]; ariaLabel?: string }) {
  return (
    <nav aria-label={ariaLabel}
      className="fixed bottom-0 inset-x-0 z-20 flex border-t border-[var(--color-border)] bg-[var(--color-surface)] pb-[env(safe-area-inset-bottom)] md:hidden">
      {items.map((it) => {
        const cls = cn("flex flex-1 flex-col items-center justify-center gap-0.5 min-h-[var(--control-height-lg)] py-1 text-[length:var(--text-sm)] font-semibold text-[var(--color-fg-muted)]",
          it.active && "text-[var(--color-primary)]")
        const content = <>{it.icon}{it.label}</>
        return it.asChild ? (
          <Slot key={it.href} className={cls} aria-current={it.active ? "page" : undefined}>{it.children}</Slot>
        ) : (
          <a key={it.href} href={it.href} aria-current={it.active ? "page" : undefined} className={cls}>
            {content}
          </a>
        )
      })}
    </nav>
  )
}
