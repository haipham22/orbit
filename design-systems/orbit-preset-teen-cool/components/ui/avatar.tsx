/* SINH TỰ ĐỘNG từ components/Comp_Avatar.mdx — không sửa tay, chạy make package */

// Standalone — deps: react
import * as React from "react"

const cn = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(" ")

const Spin = () => (
  <span aria-hidden className="inline-block size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
)

const avBox = (size: string): React.CSSProperties => (
  size === "lg"
    ? { width: "var(--control-height-lg)", height: "var(--control-height-lg)" }
    : { width: "var(--control-height-sm)", height: "var(--control-height-sm)" }
)

export function Comp_Avatar({ initials, state = "default", size = "md" }: { initials: string; state?: "default" | "sending" | "disabled"; size?: "md" | "lg" }) {
  return (
    <span aria-hidden
      className={cn("grid place-items-center rounded-full bg-[var(--color-primary-soft)] text-[var(--color-primary)] font-bold text-[length:var(--text-sm)]",
        size === "lg" && "text-[length:var(--text-lg)]", state === "disabled" && "opacity-70")}
      style={avBox(size)}>
      {state === "sending" ? <Spin /> : initials}
    </span>
  )
}
