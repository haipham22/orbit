"use client";

import { useRef, useState, useSyncExternalStore } from "react";
import { useTranslations } from "next-intl";
import { Comp_Button } from "@/components/ui/ds/button";
import { Comp_ConfirmDialog } from "@/components/ui/ds/confirmdialog";
import { Comp_Toast } from "@/components/ui/ds/toast";
import {
  applyTheme,
  clearTheme,
  deleteTheme,
  saveTheme,
  savedTheme,
  validateTheme,
} from "@/lib/theme-runtime";

const subscribeNoop = () => () => {};

// Khối "Nhập theme" (THEME-FORMAT §5): file .json → validate → preview (áp var
// runtime tạm) → Comp_ConfirmDialog → lưu localStorage orbit-theme + toast.
// Huỷ → về theme đang lưu. Copy qua catalog settings.importTheme* có sẵn.
export function ThemeImport() {
  const t = useTranslations("settings");
  const tc = useTranslations("common");
  const inputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [preview, setPreview] = useState<{ name: string; raw: string } | null>(null);
  // localStorage chỉ có ở client — mounted qua useSyncExternalStore (không
  // setState trong effect — lint rule), cùng pattern với ModePicker.
  const mounted = useSyncExternalStore(subscribeNoop, () => true, () => false);

  async function onFile(file: File) {
    try {
      const raw = await file.text();
      const v = validateTheme(JSON.parse(raw));
      if (!v.ok) {
        Comp_Toast.error(t("importInvalid", { reason: v.reason }));
        return;
      }
      applyTheme(v.tokens); // preview — chưa lưu, huỷ sẽ hoàn tác
      setPreview({ name: v.name, raw });
      setOpen(true);
    } catch {
      Comp_Toast.error(t("importInvalid", { reason: "File không đọc được (JSON hỏng?)." }));
    } finally {
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  // Huỷ preview: hoàn var runtime về theme đang lưu (hoặc theme gói).
  function cancel() {
    setOpen(false);
    setPreview(null);
    const saved = savedTheme();
    if (saved) applyTheme(saved.tokens);
    else clearTheme();
  }

  function confirm() {
    if (!preview) return;
    saveTheme(preview.raw);
    Comp_Toast.success(t("importApplied", { name: preview.name }));
    setOpen(false);
    setPreview(null);
  }

  function clearCustomTheme() {
    deleteTheme();
    clearTheme();
  }

  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-semibold">{t("importTheme")}</span>
      <p className="text-sm text-muted-foreground">{t("importHint")}</p>
      <div className="flex flex-wrap items-center gap-2">
        <Comp_Button variant="ghost" size="sm" onClick={() => inputRef.current?.click()}>
          {t("importAction")}
        </Comp_Button>
        {/* Nút xoá chỉ có nghĩa khi đang có theme tuỳ chỉnh trong localStorage. */}
        {mounted && savedTheme() !== null && (
          <Comp_Button variant="ghost" size="sm" onClick={clearCustomTheme}>
            {tc("delete")}
          </Comp_Button>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept=".json,application/json"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) void onFile(f);
        }}
      />
      <Comp_ConfirmDialog
        open={open}
        onOpenChange={(o) => {
          if (!o) cancel();
        }}
        title={t("importConfirm", { name: preview?.name ?? "" })}
        desc={t("importHint")}
        confirmLabel={tc("save")}
        sendingLabel={tc("saving")}
        cancelLabel={tc("cancel")}
        onConfirm={confirm}
        onCancel={cancel}
      />
    </div>
  );
}
