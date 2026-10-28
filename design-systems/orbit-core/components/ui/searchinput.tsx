/* SINH TỰ ĐỘNG từ components/Comp_SearchInput.mdx — không sửa tay, chạy make package */

// Standalone — deps: react, lucide-react
import * as React from "react"
import { Search } from "lucide-react"

const cn = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(" ")

const skelBox = (i: number): React.CSSProperties => ({ width: `${44 - i * 8}%` })

export type SearchResult = { id: string; title: string; meta?: string }

export function Comp_SearchInput({ value, onValueChange, results, total, hint, noResultsText, state = "default", ...props }: {
  value: string; onValueChange: (v: string) => void
  results?: SearchResult[]; total?: number; hint?: string; noResultsText?: string
  state?: "default" | "sending" | "disabled"
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "onChange">) {
  const open = state !== "disabled" && value.trim().length > 0
  return (
    <div className="w-full">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[var(--color-text-muted)]" aria-hidden />
        <input type="search" role="combobox" aria-expanded={open} aria-busy={state === "sending" || undefined}
          aria-controls="comp-search-results" value={value} disabled={state === "disabled"}
          onChange={(e) => onValueChange(e.target.value)}
          className="w-full h-[var(--control-height-md)] pl-9 pr-4 border bg-[var(--color-surface-raised)] text-[var(--color-text)] rounded-[var(--radius-sm)] outline-none focus:ring-2 focus:ring-[var(--color-primary)] placeholder:text-[var(--color-text-muted)] border-[var(--color-border)]"
          {...props} />
      </div>
      {open ? (
        <div id="comp-search-results" role="listbox" aria-busy={state === "sending" || undefined}
          className="border border-[var(--color-border)] rounded-[var(--radius-md)] bg-[var(--color-surface-raised)] shadow-[var(--shadow)] mt-1 overflow-hidden">
          {state === "sending"
            ? [0, 1, 2].map((i) => (
                <div key={i} className="flex items-center gap-2 px-3 py-2">
                  <span aria-hidden className="h-[var(--space-4)] rounded-[var(--radius-sm)] bg-[var(--color-primary-soft)] animate-pulse" style={skelBox(i)} />
                </div>))
            : (results?.length ?? 0) > 0
              ? results!.map((r) => (
                  <div key={r.id} role="option" aria-selected={false}
                    className="flex items-center gap-2 px-3 py-2 text-[length:var(--text-sm)] hover:bg-[var(--color-primary-soft)]">
                    <span className="min-w-0 [overflow-wrap:anywhere]">{r.title}</span>
                    {r.meta ? <span className="ml-auto flex-none text-[var(--color-text-muted)]">{r.meta}</span> : null}
                  </div>))
              : <div className="px-3 py-2 text-[length:var(--text-sm)] text-[var(--color-text-muted)]">{noResultsText}</div>}
        </div>
      ) : null}
      {hint ? (
        <p className="mt-1 text-[length:var(--text-sm)] text-[var(--color-text-muted)]">
          {total !== undefined ? `${total} · ` : ""}{hint}
        </p>
      ) : null}
    </div>
  )
}
