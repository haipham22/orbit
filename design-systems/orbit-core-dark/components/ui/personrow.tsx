/* SINH TỰ ĐỘNG từ components/Comp_PersonRow.mdx — không sửa tay, chạy make package */

import { cn } from "@/lib/utils"
import { Comp_Avatar } from "./avatar"
import { Comp_Chip } from "./chip"
import { Comp_Button } from "./button"

export function Comp_PersonRow({ initials, name, label, count, state = "default", onDelete }: {
  initials: string; name: string; label?: string; count?: string; state?: "default" | "sending" | "disabled"; onDelete?: () => void
}) {
  return (
    <div className={cn("flex items-center gap-3 py-3 px-2 border-t border-[var(--color-border)]", state !== "default" && "opacity-60")} aria-busy={state === "sending"}>
      <Comp_Avatar initials={initials} state={state} />
      <span className="font-bold text-[length:var(--text-lg)]">{name}</span>
      {label ? <Comp_Chip>{label}</Comp_Chip> : null}
      <span className="ml-auto flex items-center gap-2">
        <span className="text-[var(--color-text-muted)] text-[length:var(--text-sm)]">{count}</span>
        {onDelete ? <Comp_Button variant="ghost" size="sm" state={state} onClick={onDelete}><Trash2 className="size-3" />{state === "sending" ? "Đang xoá…" : "Xóa"}</Comp_Button> : null}
      </span>
    </div>
  )
}
