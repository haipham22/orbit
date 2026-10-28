/* SINH TỰ ĐỘNG từ components/Comp_Modal.mdx — không sửa tay, chạy make package */

// Standalone — deps: react, @radix-ui/react-dialog
import * as React from "react"
import * as Dialog from "@radix-ui/react-dialog"

const cn = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(" ")

const Spin = () => (
  <span aria-hidden className="inline-block size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
)

export function Comp_Modal({ open, title, desc, cancelLabel, actionLabel, sendingLabel, tone = "danger", state = "default", onConfirm, onCancel }: {
  open: boolean; title: string; desc: string
  cancelLabel: string; actionLabel: string; sendingLabel?: string
  tone?: "danger" | "primary"
  state?: "default" | "sending" | "disabled"
  onConfirm?: () => void; onCancel?: () => void
}) {
  const actionCls = tone === "danger"
    ? "bg-[var(--color-danger)] text-[var(--color-on-danger)]"
    : "bg-[var(--color-primary)] text-[var(--color-on-primary)]"
  return (
    <Dialog.Root open={open}>
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
              className={cn("inline-flex items-center gap-2 h-[var(--control-height-md)] px-4 rounded-[var(--radius-sm)] font-semibold text-[length:var(--text-base)]", actionCls, state === "sending" && "opacity-80 pointer-events-none", state === "disabled" && "opacity-70 pointer-events-none")}>
              {state === "sending" ? <Spin /> : null}{state === "sending" ? sendingLabel ?? actionLabel : actionLabel}
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
