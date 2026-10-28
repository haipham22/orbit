/* SINH TỰ ĐỘNG từ components/Comp_Chip.mdx — không sửa tay, chạy make package */

// Standalone — deps: react
import * as React from "react"

const cn = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(" ")

const TONES: Record<string, string> = {
  neutral: "bg-[var(--color-surface)] text-[var(--color-text-muted)]",
  doing: "bg-[var(--color-primary-soft)] text-[var(--color-primary)]",
  done: "bg-[var(--color-success-soft)] text-[var(--color-success)]",
  overdue: "bg-[var(--color-danger)] text-[var(--color-on-danger)]",
  soon: "bg-[var(--color-warning-soft)] text-[var(--color-warning)]",
}

const STATUS_TONE: Record<string, string> = {
  todo: "neutral", doing: "doing", done: "done", overdue: "overdue", "due-soon": "soon",
}

export function Comp_Chip({ tone = "doing", status, className, ...props }:
  React.HTMLAttributes<HTMLSpanElement> & { tone?: keyof typeof TONES; status?: keyof typeof STATUS_TONE }) {
  const t = status ? STATUS_TONE[status] : tone
  return <span className={cn("inline-flex items-center gap-1 h-[var(--control-height-sm)] px-3 rounded-full border border-[var(--color-border)] text-[length:var(--text-sm)]", TONES[t], className)} {...props} />
}
