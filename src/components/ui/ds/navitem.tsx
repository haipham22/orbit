/* SINH TỰ ĐỘNG từ components/Comp_NavItem.mdx — không sửa tay, chạy make package */

// Standalone — deps: react
const cn = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(" ")

const Spin = () => (
  <span aria-hidden className="inline-block size-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
)

export function Comp_NavItem({ label, active, state = "default", href }: {
  label: string; active?: boolean; state?: "default" | "sending" | "disabled"; href: string
}) {
  return (
    <a href={href} aria-current={active ? "page" : undefined} aria-busy={state === "sending" || undefined}
      className={cn("font-semibold py-2 px-1 border-b-2",
        active ? "text-[var(--color-primary)] border-[var(--color-primary)]" : "text-[var(--color-fg-muted)] border-transparent",
        state === "disabled" && "opacity-70 pointer-events-none")}>
      {state === "sending" ? <Spin /> : null} {label}
    </a>
  )
}
