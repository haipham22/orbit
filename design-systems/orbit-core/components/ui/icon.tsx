/* SINH TỰ ĐỘNG từ components/Comp_Icon.mdx — không sửa tay, chạy make package */

import * as React from "react"
// lucide-react dùng trực tiếp: <Cake className="size-4" /> — stroke kế thừa currentColor
export function Comp_Icon({ name, size = 16, state = "default" }: { name: string; size?: number; state?: "default" | "sending" | "disabled" }) {
  const Cmp = (Lucide as any)[name]
  return <Cmp width={size} height={size} aria-hidden className={state === "disabled" ? "opacity-40" : ""} />
}
