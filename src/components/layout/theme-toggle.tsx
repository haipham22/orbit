"use client";

// Comp_Icon rule (gói DS v1): icon = lucide inline SVG, không emoji.
// Icon đổi qua CSS dark: variant — không cần mounted state (tránh hydration mismatch).
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  return (
    <Button
      variant="ghost"
      size="sm"
      className="justify-start gap-2 px-2"
      aria-label="Toggle theme"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
    >
      <Sun className="size-4 dark:hidden" />
      <Moon className="size-4 hidden dark:inline" />
    </Button>
  );
}
