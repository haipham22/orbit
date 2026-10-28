/* SINH TỰ ĐỘNG từ components/Comp_PersonRow.mdx — không sửa tay, chạy make package */

// Standalone — deps: react, lucide-react
import * as React from "react"
import { Trash2 } from "lucide-react"

const cn = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(" ")

export function Comp_PersonRow({ initials, name, label, count, state = "default", onDelete, deleteLabel = "Xóa", sendingLabel = "Đang xoá…" }: {
  initials: string; name: string; label?: string; count?: string
  state?: "default" | "sending" | "disabled"
  onDelete?: () => void; deleteLabel?: string; sendingLabel?: string
}) {
  return (
    <div className={cn("flex items-center gap-3 py-3 px-2 border-t border-[var(--color-border)] min-w-0", state === "sending" && "opacity-80", state === "disabled" && "opacity-70")} aria-busy={state === "sending" || undefined}>
      <span aria-hidden className="grid place-items-center size-[var(--control-height-sm)] rounded-full bg-[var(--color-primary-soft)] text-[var(--color-primary)] font-bold text-[length:var(--text-sm)] flex-none">{initials}</span>
      <span className="block min-w-0 overflow-hidden text-ellipsis whitespace-nowrap font-bold text-[length:var(--text-lg)]">{name}</span>
      {label ? <span className="inline-flex items-center h-[var(--control-height-sm)] px-3 rounded-full border border-[var(--color-border)] bg-[var(--color-primary-soft)] text-[var(--color-primary)] text-[length:var(--text-sm)]">{label}</span> : null}
      <span className="ml-auto flex items-center gap-2">
        {count ? <span className="text-[var(--color-text-muted)] text-[length:var(--text-sm)]">{count}</span> : null}
        {onDelete ? (
          <button type="button" onClick={onDelete} disabled={state !== "default"}
            className="inline-flex items-center gap-1 h-[var(--control-height-sm)] px-3 rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-surface-raised)] text-[var(--color-primary)] font-semibold text-[length:var(--text-sm)]">
            <Trash2 className="size-3" aria-hidden />{state === "sending" ? sendingLabel : deleteLabel}
          </button>
        ) : null}
      </span>
    </div>
  )
}
