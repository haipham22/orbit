/* SINH TỰ ĐỘNG từ components/Comp_ConfirmDialog.mdx — không sửa tay, chạy make package */

// Standalone — deps: react, @radix-ui/react-dialog
import * as React from "react"
import * as Dialog from "@radix-ui/react-dialog"

const Spin = () => (
  <span aria-hidden className="inline-block size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
)

export function Comp_ConfirmDialog({ open, onOpenChange, title, desc, confirmLabel, cancelLabel, sendingLabel, state = "default", onConfirm, onCancel }: {
  open: boolean; onOpenChange?: (open: boolean) => void
  title: string; desc: string
  confirmLabel: string; cancelLabel: string; sendingLabel?: string
  state?: "default" | "sending" | "disabled"
  onConfirm?: () => void; onCancel?: () => void
}) {
  return (
    <Dialog.Root open={open} onOpenChange={state === "sending" ? undefined : onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-[var(--color-bg)] opacity-[.82] z-20" />
        <Dialog.Content aria-modal="true"
          className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(420px,92vw)] max-h-[calc(100dvh-2*var(--space-lg))] flex flex-col gap-4 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)] p-5 shadow-[var(--shadow)] z-30">
          <Dialog.Title className="font-[var(--font-display)] font-bold">{title}</Dialog.Title>
          <Dialog.Description className="text-[length:var(--text-sm)] text-[var(--color-text-muted)] overflow-auto min-h-0">{desc}</Dialog.Description>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={onCancel} disabled={state !== "default"}
              className="inline-flex items-center h-[var(--control-height-md)] px-4 rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-surface-raised)] text-[var(--color-primary)] font-semibold text-[length:var(--text-base)]">
              {cancelLabel}
            </button>
            <button type="button" onClick={onConfirm} disabled={state !== "default"} aria-busy={state === "sending" || undefined}
              className="inline-flex items-center gap-2 h-[var(--control-height-md)] px-4 rounded-[var(--radius-sm)] bg-[var(--color-danger)] text-[var(--color-on-danger)] font-semibold text-[length:var(--text-base)] data-[state=busy]:opacity-80"
              data-state={state === "sending" ? "busy" : undefined}>
              {state === "sending" ? <Spin /> : null}{state === "sending" ? sendingLabel ?? confirmLabel : confirmLabel}
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
