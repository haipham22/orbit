/* SINH TỰ ĐỘNG từ components/Comp_XPBar.mdx — không sửa tay, chạy make package */

export function Comp_XPBar({ percent = 76, state = "default" }: { percent?: number; state?: "default" | "sending" | "disabled" }) {
  return <div className="h-3 rounded-full border border-[var(--color-border)] bg-[var(--color-primary-soft)] overflow-hidden" style={badgeOpacity(state)}>
    <span className={cn("block h-full bg-[var(--color-primary)]", state === "sending" && "w-2/5 animate-[indet_1.1s_ease-in-out_infinite]")} style={state === "default" ? { width: `${percent}%` } : undefined} />
  </div>
}
