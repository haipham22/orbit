/* SINH TỰ ĐỘNG từ components/Comp_StreakBadge.mdx — không sửa tay, chạy make package */

const badgeOpacity = (state: string): React.CSSProperties => ({ opacity: state === "disabled" ? 0.65 : 1 })

export function Comp_StreakBadge({ days, state = "default" }: { days: number; state?: "default" | "sending" | "disabled" }) {
  return <span className="inline-flex items-center gap-1 h-[var(--control-height-sm)] px-3 rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-primary-soft)] text-[var(--color-primary)] font-bold text-[length:var(--text-sm)]" style={badgeOpacity(state)}>
    <Flame className="size-3.5" /> {state === "sending" ? "…" : `${days} ngày liền`}
  </span>
}
