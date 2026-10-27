/* SINH TỰ ĐỘNG từ components/Comp_Avatar.mdx — không sửa tay, chạy make package */

import * as React from "react"

const avBox = (size: string): React.CSSProperties => (
  size === "lg" ? { width: "var(--control-height-lg)", height: "var(--control-height-lg)" } : { width: "var(--control-height-sm)", height: "var(--control-height-sm)" }
)

export function Comp_Avatar({ initials, state = "default", size = "md" }: { initials: string; state?: "default" | "sending" | "disabled"; size?: "md" | "lg" }) {
  return <span aria-hidden className={cn("grid place-items-center rounded-full bg-[var(--color-primary-soft)] text-[var(--color-primary)] font-bold text-[length:var(--text-sm)]", size === "lg" && "text-[length:var(--text-lg)]", state === "disabled" && "opacity-50") }
    style={avBox(size)}>{state === "sending" ? <Spinner /> : initials}</span>
}
