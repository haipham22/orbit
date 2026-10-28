"use client";

import { CircleAlert } from "lucide-react";
import { useTranslations } from "next-intl";
import { Comp_Button } from "@/components/ui/ds/button";

// Khuôn error state dùng chung cho các route error.tsx (PRD bộ 3 empty/error/loading):
// icon + message + nút tải lại — copy qua namespace "errors".
export function RouteError({ reset }: { reset: () => void }) {
  const t = useTranslations("errors");

  return (
    <div
      role="alert"
      className="flex flex-col items-center gap-2 rounded-[var(--radius-md)] border border-dashed border-border p-8 text-center"
    >
      <CircleAlert className="size-8 text-[var(--color-danger)]" aria-hidden />
      <h2 className="text-lg font-semibold">{t("title")}</h2>
      <p className="text-sm text-muted-foreground">{t("desc")}</p>
      <Comp_Button variant="ghost" size="sm" onClick={reset}>
        {t("retry")}
      </Comp_Button>
    </div>
  );
}
