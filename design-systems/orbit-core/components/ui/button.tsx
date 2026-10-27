/* SINH TỰ ĐỘNG từ components/Comp_Button.mdx — không sửa tay, chạy make package */

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 font-semibold rounded-[var(--radius-sm)] transition-[transform,opacity] disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4",
  { variants: {
      variant: {
        primary: "bg-[var(--color-primary)] text-[var(--color-on-primary)] hover:brightness-110",
        ghost: "text-[var(--color-primary)] border border-[var(--color-border)] bg-[var(--color-surface-raised)]",
        danger: "bg-[var(--color-danger)] text-[var(--color-on-danger)]",
      },
      size: {
        sm: "h-[var(--control-height-sm)] px-3 text-[length:var(--text-sm)]",
        md: "h-[var(--control-height-md)] px-4 text-[length:var(--text-base)]",
        lg: "h-[var(--control-height-lg)] px-5 text-[length:var(--text-lg)]",
      },
      state: { default: "", sending: "opacity-70 pointer-events-none", disabled: "opacity-50 pointer-events-none" },
    },
    defaultVariants: { variant: "primary", size: "md", state: "default" } })

export interface CompButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> { asChild?: boolean }

export const Comp_Button = React.forwardRef<HTMLButtonElement, CompButtonProps>(
  ({ className, variant, size, state, asChild = false, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return <Comp ref={ref} className={cn(buttonVariants({ variant, size, state }), className)} {...props}>{state === "sending" ? <Spinner /> : null}{children}</Comp>
  })
Comp_Button.displayName = "Comp_Button"
