/* SINH TỰ ĐỘNG từ components/Comp_StreakBadge.mdx — không sửa tay, chạy make package */

// Standalone — deps: react, lucide-react
import * as React from "react"
import { Flame } from "lucide-react"

const badgeOpacity = (state: string): React.CSSProperties => ({ opacity: state === "disabled" ? 0.7 : 1 })

export function Comp_StreakBadge({ days, state = "default", label }: { days: number; state?: "default" | "sending" | "disabled"; label?: string }) {
  return (
    <span aria-busy={state === "sending" || undefined} style={badgeOpacity(state)}
      className="inline-flex items-center gap-1 h-[var(--control-height-sm)] px-3 rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-primary-soft)] text-[var(--color-primary)] font-bold text-[length:var(--text-sm)]">
      <Flame className="size-3.5" aria-hidden />
      {state === "sending" ? "…" : `${days} ${label ?? "ngày liền"}`}
    </span>
  )
}
