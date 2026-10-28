/* SINH TỰ ĐỘNG từ components/Comp_Skeleton.mdx — không sửa tay, chạy make package */

// Standalone — deps: react
import * as React from "react"

const cn = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(" ")

const SHAPES: Record<string, string> = {
  line: "h-[var(--space-4)] rounded-[var(--radius-sm)]",
  avatar: "size-[var(--control-height-sm)] rounded-full",
  card: "h-[var(--space-8)] rounded-[var(--radius-md)]",
}

export function Comp_Skeleton({ shape = "line", width, state = "default" }: {
  shape?: keyof typeof SHAPES; width?: string; state?: "default" | "sending" | "disabled"
}) {
  const box = (w?: string): React.CSSProperties => (w ? { width: w } : {})
  return (
    <div aria-hidden data-shape={shape} style={box(width)}
      className={cn("bg-[var(--color-primary-soft)] animate-pulse", SHAPES[shape], state === "disabled" && "opacity-70")} />
  )
}
