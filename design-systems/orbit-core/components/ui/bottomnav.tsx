/* SINH TỰ ĐỘNG từ components/Comp_BottomNav.mdx — không sửa tay, chạy make package */

// Standalone — deps: react
import * as React from "react"

const cn = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(" ")

export type NavTarget = { href: string; label: string; icon: React.ReactNode; active?: boolean }

export function Comp_BottomNav({ items, ariaLabel }: { items: NavTarget[]; ariaLabel?: string }) {
  return (
    <nav aria-label={ariaLabel}
      className="fixed bottom-0 inset-x-0 z-20 flex border-t border-[var(--color-border)] bg-[var(--color-surface)] pb-[env(safe-area-inset-bottom)] md:hidden">
      {items.map((it) => (
        <a key={it.href} href={it.href} aria-current={it.active ? "page" : undefined}
          className={cn("flex flex-1 flex-col items-center justify-center gap-0.5 min-h-[var(--control-height-lg)] py-1 text-[length:var(--text-sm)] font-semibold text-[var(--color-fg-muted)]",
            it.active && "text-[var(--color-primary)]")}>
          {it.icon}
          {it.label}
        </a>
      ))}
    </nav>
  )
}
