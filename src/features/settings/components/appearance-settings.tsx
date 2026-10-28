"use client";

import { useState, useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import { useTranslations } from "next-intl";
import { Comp_Button } from "@/components/ui/ds/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ThemeImport } from "./theme-import";

// Swatch accent/soft/radius lấy từ preset blocks trong globals.css.
// Thẻ value="" = orbit-core gốc (không data-preset): dùng token live để luôn
// khớp theme thật thay vì hardcode hex.
const PRESETS = [
  { value: "", key: "default", accent: "var(--color-primary)", soft: "var(--color-primary-soft)", radius: "var(--radius-md)" },
  { value: "kid", key: "kid", accent: "#c2410c", soft: "#ffedd5", radius: "16px" },
  { value: "teen-cool", key: "teenCool", accent: "#6d28d9", soft: "#ede9fe", radius: "8px" },
  { value: "soft", key: "soft", accent: "#c02168", soft: "#fce7f3", radius: "16px" },
  { value: "bold", key: "bold", accent: "#b91c1c", soft: "#fee2e2", radius: "4px" },
  { value: "warm-earth", key: "warmEarth", accent: "#48740e", soft: "#ecfccb", radius: "16px" },
  { value: "pastel-dream", key: "pastelDream", accent: "#7c3aed", soft: "#ede9fe", radius: "16px" },
  { value: "sticker", key: "sticker", accent: "#b022c1", soft: "#fae8ff", radius: "20px" },
] as const;

const MODES = [
  { value: "light", key: "light" },
  { value: "dark", key: "dark" },
  { value: "system", key: "system" },
] as const;

const subscribeNoop = () => () => {};

// Cookie cùng tên/định dạng với src/app/layout.tsx đọc ở server.
function applyPreset(value: string) {
  document.cookie = `ORBIT_PRESET=${value}; path=/; max-age=31536000; samesite=lax`;
  // Áp dụng ngay không cần reload: CSS preset keyed trên :root[data-preset].
  if (value) document.documentElement.dataset.preset = value;
  else delete document.documentElement.dataset.preset;
}

function ModePicker() {
  const { theme, setTheme } = useTheme();
  const t = useTranslations("settings.mode");
  // theme chưa ổn định trước hydration (server không biết giá trị đã lưu) —
  // isMounted qua useSyncExternalStore: không dùng setState trong effect (lint rule).
  const mounted = useSyncExternalStore(subscribeNoop, () => true, () => false);

  return (
    <div role="group" className="flex flex-wrap gap-2">
      {MODES.map((m) => {
        const selected = mounted && theme === m.value;
        return (
          <Comp_Button
            key={m.value}
            variant={selected ? "primary" : "ghost"}
            size="sm"
            aria-pressed={selected ? true : undefined}
            onClick={() => setTheme(m.value)}
          >
            {t(m.key)}
          </Comp_Button>
        );
      })}
    </div>
  );
}

function PresetGrid({ current }: { current: string }) {
  const t = useTranslations("settings.preset");
  const [active, setActive] = useState(current);

  return (
    <div role="group" className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {PRESETS.map((p) => {
        const selected = active === p.value;
        return (
          <button
            key={p.value}
            type="button"
            aria-pressed={selected}
            onClick={() => {
              applyPreset(p.value);
              setActive(p.value);
            }}
            className={
              "flex flex-col gap-2 rounded-md border p-3 text-start transition-colors " +
              (selected
                ? "border-primary ring-2 ring-primary ring-offset-2 ring-offset-background"
                : "border-border hover:bg-accent")
            }
          >
            {/* Swatch: nền accent + bo góc chính là sample radius của preset */}
            <span
              aria-hidden
              className="block h-9 w-full border border-black/5"
              style={{ background: p.soft, borderRadius: p.radius }}
            >
              <span
                className="block h-9 w-1/2"
                style={{ background: p.accent, borderRadius: p.radius }}
              />
            </span>
            <span className="text-sm font-semibold">{t(p.key)}</span>
          </button>
        );
      })}
    </div>
  );
}

export function AppearanceSettings({ currentPreset }: { currentPreset: string }) {
  const t = useTranslations("settings");

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("theme")}</CardTitle>
        <p className="text-sm text-muted-foreground">{t("themeHint")}</p>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <span className="text-sm font-semibold">{t("mode.label")}</span>
          <ModePicker />
        </div>
        <div className="flex flex-col gap-2">
          <span className="text-sm font-semibold">{t("preset.label")}</span>
          <PresetGrid current={currentPreset} />
        </div>
        <ThemeImport />
      </CardContent>
    </Card>
  );
}
