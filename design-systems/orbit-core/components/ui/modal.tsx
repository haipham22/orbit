/* SINH TỰ ĐỘNG từ components/Comp_Modal.mdx — không sửa tay, chạy make package */

import * as React from "react"
import * as Dialog from "@radix-ui/react-dialog"
import { cn } from "@/lib/utils"
import { Comp_Button } from "./button"

export function Comp_Modal({ open, title, desc, state = "default", onConfirm, onCancel }: {
  open: boolean; title: string; desc: string; state?: "default" | "sending" | "disabled"; onConfirm?: () => void; onCancel?: () => void
}) {
  return (
    <Dialog.Root open={open}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-[var(--color-bg)] opacity-82 z-20" />
        <Dialog.Content aria-modal="true" className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(420px,92vw)] flex flex-col gap-4 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)] p-5 shadow-[var(--shadow)] z-21">
          <Dialog.Title className="font-[var(--font-display)] font-bold">{title}</Dialog.Title>
          <Dialog.Description className="text-[length:var(--text-sm)] text-[var(--color-text-muted)]">{desc}</Dialog.Description>
          <div className="flex justify-end gap-2">
            <Comp_Button variant="ghost" onClick={onCancel} disabled={state !== "default"}>Huỷ</Comp_Button>
            <Comp_Button variant="danger" state={state} onClick={onConfirm}>{state === "sending" ? "Đang xoá…" : "Xoá"}</Comp_Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
