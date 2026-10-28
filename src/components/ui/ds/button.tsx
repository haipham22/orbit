/* SINH TỰ ĐỘNG từ components/Comp_Button.mdx — không sửa tay, chạy make package */

// Standalone — deps: react, @radix-ui/react-slot
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"

const cn = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(" ")

const Spin = () => (
  <span aria-hidden className="inline-block size-4 shrink-0 animate-spin rounded-full border-2 border-current border-t-transparent" />
)

const VARIANTS: Record<string, string> = {
  primary: "bg-[var(--color-primary)] text-[var(--color-on-primary)] hover:brightness-110",
  ghost: "text-[var(--color-primary)] border border-[var(--color-border)] bg-[var(--color-surface-raised)]",
  danger: "bg-[var(--color-danger)] text-[var(--color-on-danger)]",
}

const SIZES: Record<string, string> = {
  sm: "h-[var(--control-height-sm)] px-3 text-[length:var(--text-sm)]",
  md: "h-[var(--control-height-md)] px-4 text-[length:var(--text-base)]",
  lg: "h-[var(--control-height-lg)] px-5 text-[length:var(--text-lg)]",
}

export interface CompButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof VARIANTS
  size?: keyof typeof SIZES
  state?: "default" | "sending" | "disabled"
  asChild?: boolean
}

export const Comp_Button = React.forwardRef<HTMLButtonElement, CompButtonProps>(
  ({ className, variant = "primary", size = "md", state = "default", asChild = false, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp ref={ref}
        aria-busy={state === "sending" || undefined}
        aria-disabled={state !== "default" || undefined}
        className={cn("inline-flex items-center justify-center gap-2 font-semibold rounded-[var(--radius-sm)] transition-[transform,opacity] [&_svg]:size-4",
          VARIANTS[variant], SIZES[size],
          state === "sending" && "opacity-80 pointer-events-none",
          state === "disabled" && "opacity-70 pointer-events-none",
          className)}
        {...props}>
        {state === "sending" ? <Spin /> : null}
        {children}
      </Comp>
    )
  })
Comp_Button.displayName = "Comp_Button"
