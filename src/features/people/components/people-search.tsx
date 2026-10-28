"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Comp_SearchInput } from "@/components/ui/ds/searchinput";

/**
 * Ô tìm người (Comp_SearchInput) bọc trong GET form.
 * Form không set action — submit về đúng URL hiện tại (giữ locale prefix),
 * input name="q" giữ nguyên behaviour ?q= của trang danh sách.
 * Comp_SearchInput là controlled, nên state do component này giữ.
 */
export function PeopleSearch({ initialQ }: { initialQ: string }) {
  const t = useTranslations("people");
  const [q, setQ] = useState(initialQ);
  return (
    <form method="get" className="max-w-md">
      <Comp_SearchInput
        name="q"
        value={q}
        onValueChange={setQ}
        placeholder={t("list.searchPlaceholder")}
        aria-label={t("list.search")}
        noResultsText={t("list.searchHint")}
      />
    </form>
  );
}
