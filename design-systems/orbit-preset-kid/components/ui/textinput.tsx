/* SINH TỰ ĐỘNG từ components/Comp_TextInput.mdx — không sửa tay, chạy make package */

// Standalone — deps: react
import * as React from "react"

const cn = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(" ")

export const Comp_TextInput = React.forwardRef<HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & {
    state?: "default" | "sending" | "disabled"
    error?: string
  }>(
  ({ className, state = "default", error, id, ...props }, ref) => (
    <div className={cn("w-full", className)}>
      <input ref={ref} id={id}
        aria-busy={state === "sending" || undefined}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id ?? props.name}-msg` : undefined}
        disabled={state === "disabled"}
        className={cn("w-full border bg-[var(--color-surface-raised)] text-[var(--color-text)] rounded-[var(--radius-sm)] outline-none focus:ring-2 focus:ring-[var(--color-primary)] placeholder:text-[var(--color-text-muted)] border-[var(--color-border)]",
          error && "border-[var(--color-danger)]")}
        {...props} />
      {error ? <p id={`${id ?? props.name}-msg`} role="alert" className="mt-1 flex items-center gap-1 text-[length:var(--text-sm)] text-[var(--color-danger)]">{error}</p> : null}
    </div>
  ))
Comp_TextInput.displayName = "Comp_TextInput"
