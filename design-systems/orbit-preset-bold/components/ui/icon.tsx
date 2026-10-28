/* SINH TỰ ĐỘNG từ components/Comp_Icon.mdx — không sửa tay, chạy make package */

// Standalone — deps: react, lucide-react
import type { LucideIcon } from "lucide-react"
import { Cake, AlarmClock, BookOpen, Check, Flame, Zap, MessageSquare, House, Users, Plus, Search, Trash2, Pencil, Calendar, Flag, X } from "lucide-react"

const ICONS: Record<string, LucideIcon> = {
  cake: Cake, alarm: AlarmClock, book: BookOpen, check: Check, flame: Flame, zap: Zap,
  msg: MessageSquare, home: House, users: Users, plus: Plus, search: Search,
  trash: Trash2, pencil: Pencil, calendar: Calendar, flag: Flag, x: X,
}

export function Comp_Icon({ name, size = 16, state = "default" }: { name: string; size?: number; state?: "default" | "sending" | "disabled" }) {
  const Cmp = ICONS[name]
  if (!Cmp) return null
  return <Cmp width={size} height={size} aria-hidden className={state === "disabled" ? "opacity-70" : undefined} />
}
