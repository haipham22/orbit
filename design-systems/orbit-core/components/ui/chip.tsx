/* SINH TỰ ĐỘNG từ components/Comp_Chip.mdx — không sửa tay, chạy make package */

import * as React from "react"
import { cn } from "@/lib/utils"

const fillStyle = (percent: number): React.CSSProperties => ({ width: `${Math.min(percent, 100)}%` })

const tones = {
  neutral: "bg-[var(--color-primary-soft)] text-[var(--color-primary)]",
  success: "bg-[var(--color-surface)] text-[var(--color-success)] border-[var(--color-success)]",
  warning: "bg-[var(--color-surface)] text-[var(--color-warning)] border-[var(--color-warning)]",
  danger: "bg-[var(--color-surface)] text-[var(--color-danger)] border-[var(--color-danger)]",
}

export function Comp_Chip({ tone = "neutral", className, ...props }: React.HTMLAttributes<HTMLSpanElement> & { tone?: keyof typeof tones }) {
  return <span className={cn("inline-flex items-center gap-1 h-[var(--control-height-sm)] px-3 rounded-full border border-[var(--color-border)] text-[length:var(--text-sm)]", tones[tone], className)} {...props} />
}
