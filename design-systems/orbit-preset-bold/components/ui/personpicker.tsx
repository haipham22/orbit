/* SINH TỰ ĐỘNG từ components/Comp_PersonPicker.mdx — không sửa tay, chạy make package */

// Standalone — deps: react, lucide-react
import * as React from "react"
import { Search, X } from "lucide-react"

export type PickablePerson = { id: string; name: string; initials: string }

const skelBox = (i: number): React.CSSProperties => ({ width: `${44 - i * 8}%` })

export function Comp_PersonPicker({ query, onQueryChange, suggestions, selected, onPick, onRemove, state = "default", placeholder, emptyText }: {
  query: string; onQueryChange: (v: string) => void
  suggestions?: PickablePerson[]; selected?: PickablePerson[]
  onPick?: (p: PickablePerson) => void; onRemove?: (p: PickablePerson) => void
  state?: "default" | "sending" | "disabled"
  placeholder?: string; emptyText?: string
}) {
  const open = state !== "disabled" && query.trim().length > 0
  return (
    <div className="w-full">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[var(--color-text-muted)]" aria-hidden />
        <input type="search" role="combobox" aria-expanded={open} aria-busy={state === "sending" || undefined}
          aria-controls="comp-picker-suggestions" value={query} disabled={state === "disabled"}
          onChange={(e) => onQueryChange(e.target.value)} placeholder={placeholder}
          className="w-full h-[var(--control-height-md)] pl-9 pr-4 border bg-[var(--color-surface-raised)] text-[var(--color-text)] rounded-[var(--radius-sm)] outline-none focus:ring-2 focus:ring-[var(--color-primary)] placeholder:text-[var(--color-text-muted)] border-[var(--color-border)]" />
      </div>
      {open ? (
        <div id="comp-picker-suggestions" role="listbox" aria-busy={state === "sending" || undefined}
          className="border border-[var(--color-border)] rounded-[var(--radius-md)] bg-[var(--color-surface-raised)] shadow-[var(--shadow)] mt-1 overflow-hidden">
          {state === "sending"
            ? [0, 1, 2].map((i) => (
                <div key={i} className="flex items-center gap-2 px-3 py-2">
                  <span aria-hidden className="h-[var(--space-4)] rounded-[var(--radius-sm)] bg-[var(--color-primary-soft)] animate-pulse" style={skelBox(i)} />
                </div>))
            : (suggestions?.length ?? 0) > 0
              ? suggestions!.map((p) => (
                  <button key={p.id} type="button" role="option" aria-selected={false} onClick={() => onPick?.(p)}
                    className="flex w-full items-center gap-2 px-3 py-2 text-left text-[length:var(--text-sm)] hover:bg-[var(--color-primary-soft)]">
                    <span aria-hidden className="grid place-items-center size-6 rounded-full bg-[var(--color-primary-soft)] text-[var(--color-primary)] font-bold flex-none">{p.initials}</span>
                    <span className="min-w-0 overflow-hidden text-ellipsis whitespace-nowrap">{p.name}</span>
                  </button>))
              : <div className="px-3 py-2 text-[length:var(--text-sm)] text-[var(--color-text-muted)]">{emptyText}</div>}
        </div>
      ) : null}
      {selected?.length ? (
        <div className="flex flex-wrap gap-2 mt-2">
          {selected.map((p) => (
            <span key={p.id} className="inline-flex items-center h-[var(--control-height-sm)] px-3 rounded-full border border-[var(--color-border)] bg-[var(--color-primary-soft)] text-[var(--color-primary)] text-[length:var(--text-sm)]">
              {p.name}
              <button type="button" onClick={() => onRemove?.(p)} disabled={state === "disabled"} aria-label={`${p.name} — remove`}
                className="inline-flex flex-none items-center justify-center border-0 bg-transparent p-0 ml-1 text-inherit cursor-pointer">
                <X className="size-3.5" aria-hidden />
              </button>
            </span>
          ))}
        </div>
      ) : null}
    </div>
  )
}
