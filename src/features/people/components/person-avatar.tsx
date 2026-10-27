import { cn } from "cn";

/**
 * Comp_Avatar (orbit-core): chữ cái đầu tên trên nền primary-soft.
 * Pure component — dùng được ở cả RSC (trang danh sách) và client (chi tiết).
 */
export function PersonAvatar({
  name,
  size = "md",
}: {
  name: string;
  size?: "md" | "lg";
}) {
  const initials =
    name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((word) => word.charAt(0).toUpperCase())
      .join("") || "?";
  return (
    <span
      aria-hidden
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full border border-border bg-muted font-bold text-primary",
        size === "lg" ? "size-11 text-lg" : "size-8 text-sm"
      )}
    >
      {initials}
    </span>
  );
}
