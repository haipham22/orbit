/* SINH TỰ ĐỘNG từ components/Comp_Card.mdx — không sửa tay, chạy make package */

import * as React from "react"
import { cn } from "@/lib/utils"

export function Comp_Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius)] p-4 shadow-[var(--shadow)]", className)} {...props} />
}
