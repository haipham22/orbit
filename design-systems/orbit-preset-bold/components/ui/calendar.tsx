/* SINH TỰ ĐỘNG từ components/Comp_Calendar.mdx — không sửa tay, chạy make package */

// Standalone — deps: react
import * as React from "react"

const cn = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(" ")

export function Comp_Calendar({ month, year, selected, state = "default", ariaLabel }: {
  month: number; year: number; selected?: number; state?: "default" | "sending" | "disabled"; ariaLabel?: string
}) {
  const days = new Date(year, month, 0).getDate()
  const dow = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"]
  return (
    <div role="group" aria-label={ariaLabel}
      className={cn("border border-[var(--color-border)] rounded-[var(--radius-md)] p-3 bg-[var(--color-surface)] max-w-[280px]", state === "disabled" && "opacity-70")}
      aria-busy={state === "sending" || undefined}>
      <div className="flex items-center justify-between font-[var(--font-display)] font-semibold text-[length:var(--text-sm)] mb-2">{ariaLabel ?? `Tháng ${month} · ${year}`}</div>
      <div className="grid grid-cols-7 gap-1 text-center text-[length:var(--text-sm)]">
        {state === "sending"
          ? Array.from({ length: 14 }, (_, i) => <div key={i} className="h-5 rounded-[var(--radius-sm)] bg-[var(--color-primary-soft)] animate-pulse" />)
          : dow.map((d) => <span key={d} className="text-[var(--color-fg-muted)] font-semibold">{d}</span>)
              .concat(Array.from({ length: days }, (_, i) => {
                const d = i + 1
                return <span key={d} aria-current={d === selected ? "date" : undefined}
                  className={cn("py-1 rounded-[var(--radius-sm)]", d === selected && "bg-[var(--color-primary)] text-[var(--color-on-primary)] font-semibold")}>{d}</span>
              }))}
      </div>
    </div>
  )
}
