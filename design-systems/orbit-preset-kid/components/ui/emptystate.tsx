/* SINH TỰ ĐỘNG từ components/Comp_EmptyState.mdx — không sửa tay, chạy make package */

// Standalone — deps: react
import * as React from "react"

type Khuon = "empty" | "error" | "loading"

const skelBox = (w: string): React.CSSProperties => ({ width: w })

function Skel({ w }: { w: string }) {
  return <div aria-hidden className="h-[var(--space-4)] rounded-[var(--radius-sm)] bg-[var(--color-primary-soft)] animate-pulse" style={skelBox(w)} />
}

export function Comp_EmptyState({ khuon, title, desc, action }: { khuon: Khuon; title: string; desc?: string; action?: React.ReactNode }) {
  return (
    <div data-pattern={khuon} className="border border-dashed border-[var(--color-border)] rounded-[var(--radius-md)] p-6 flex flex-col items-center text-center gap-2">
      {khuon === "loading"
        ? <><Skel w="80%" /><Skel w="55%" /></>
        : <><h3>{title}</h3>{desc ? <p className="text-[var(--color-text-muted)] text-[length:var(--text-sm)]">{desc}</p> : null}{action}</>}
    </div>
  )
}
