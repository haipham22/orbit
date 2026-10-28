/* SINH TỰ ĐỘNG từ components/Comp_XPBar.mdx — không sửa tay, chạy make package */

// Standalone — deps: react
// Loading soc = cong thuc striped chuan Bootstrap: tile 16px + shift dung 1 tile -> seamless
//   @keyframes barberpole { from { background-position: 0 0; } to { background-position: 16px 0; } }
//   @keyframes indet { from { transform: translateX(0); } to { transform: translateX(150%); } } — dung alternate (bounce, khong teleport)
import * as React from "react"

const cn = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(" ")

export function Comp_XPBar({ percent = 76, state = "default", loading = "stripe" }: {
  percent?: number; state?: "default" | "sending" | "disabled"; loading?: "stripe" | "slide"
}) {
  const box = (s: string): React.CSSProperties => ({ opacity: s === "disabled" ? 0.7 : 1 })
  return (
    <div className="relative h-3 rounded-full border border-[var(--color-border)] bg-[var(--color-primary-soft)] overflow-hidden" style={box(state)} role="progressbar" aria-valuenow={state === "default" ? Math.min(percent, 100) : undefined} aria-valuemin={0} aria-valuemax={100} aria-busy={state === "sending" || undefined}>
      <span className={cn("block h-full rounded-[inherit]", state === "sending"
          ? loading === "stripe"
            ? "w-full h-full rounded-[inherit] bg-[var(--color-primary)] bg-[image:linear-gradient(45deg,var(--color-primary-soft)_25%,transparent_25%,transparent_50%,var(--color-primary-soft)_50%,var(--color-primary-soft)_75%,transparent_75%,transparent)] bg-[length:16px_16px] animate-[barberpole_1s_linear_infinite]"
            : "w-2/5 animate-[indet_1.3s_ease-in-out_infinite_alternate]"
          : "w-[76%] bg-[var(--color-primary)]")}
        style={state === "default" ? fillStyle(percent) : undefined} />
    </div>
  )
}

const fillStyle = (percent: number): React.CSSProperties => ({ width: `${Math.min(percent, 100)}%` })
