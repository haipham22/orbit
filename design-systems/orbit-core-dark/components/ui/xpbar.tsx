/* SINH TỰ ĐỘNG từ components/Comp_XPBar.mdx — không sửa tay, chạy make package */

// Standalone — deps: react
import * as React from "react"

const cn = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(" ")

export function Comp_XPBar({ percent = 76, state = "default" }: { percent?: number; state?: "default" | "sending" | "disabled" }) {
  const box = (s: string): React.CSSProperties => ({ opacity: s === "disabled" ? 0.7 : 1 })
  return (
    <div className="h-3 rounded-full border border-[var(--color-border)] bg-[var(--color-primary-soft)] overflow-hidden" style={box(state)} aria-busy={state === "sending" || undefined}>
      <span className={cn("block h-full bg-[var(--color-primary)]", state === "sending" && "w-2/5 animate-[indet_1.1s_ease-in-out_infinite]")}
        style={state === "default" ? fillStyle(percent) : undefined} />
    </div>
  )
}

const fillStyle = (percent: number): React.CSSProperties => ({ width: `${Math.min(percent, 100)}%` })
