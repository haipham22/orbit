/* SINH TỰ ĐỘNG từ components/Comp_TextInput.mdx — không sửa tay, chạy make package */

import * as React from "react"
import { cn } from "@/lib/utils"

export const Comp_TextInput = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement> & { state?: "default" | "sending" | "disabled" }>(
  ({ className, state = "default", ...props }, ref) => (
    <input ref={ref} aria-busy={state === "sending"} disabled={state === "disabled"}
      className={cn("w-full border border-[var(--color-border)] bg-[var(--color-surface-raised)] text-[var(--color-text)] rounded-[var(--radius-sm)] outline-none focus:ring-2 focus:ring-[var(--color-primary)] placeholder:text-[var(--color-text-muted)]", className)}
      {...props} />
  ))
Comp_TextInput.displayName = "Comp_TextInput"
