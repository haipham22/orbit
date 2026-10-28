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

// Màu data (DECISIONS 2026-10-28): chỉ chấp hex #rrggbb — nền chip; chữ tự chọn
// data-ink/data-paper theo luminance (AA đo lúc render).
const lum = (hex: string): number => {
  const h = hex.replace("#", "").toLowerCase()
  const chan = (i: number): number => {
    const c = parseInt(h.slice(i, i + 2), 16) / 255
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  }
  return 0.2126 * chan(0) + 0.7152 * chan(2) + 0.0722 * chan(4)
}

const dataStyle = (color: string): React.CSSProperties => {
  const hex = `#${color.replace("#", "").toLowerCase()}`
  return { background: hex, color: lum(hex) > 0.35 ? "var(--color-data-ink)" : "var(--color-data-paper)", borderColor: "transparent" }
}

export function Comp_Chip({ tone = "doing", status, color, className, ...props }:
  React.HTMLAttributes<HTMLSpanElement> & { tone?: keyof typeof TONES; status?: keyof typeof STATUS_TONE; color?: string }) {
  const t = status ? STATUS_TONE[status] : tone
  return <span style={color ? dataStyle(color) : undefined} className={cn("inline-flex items-center gap-1 h-[var(--control-height-sm)] px-3 rounded-full border border-[var(--color-border)] text-[length:var(--text-sm)]", !color && TONES[t], className)} {...props} />
}
