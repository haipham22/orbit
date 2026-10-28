import { getTranslations } from "next-intl/server";
import { cookies } from "next/headers";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AppearanceSettings } from "./components/appearance-settings";

export async function generateMetadata() {
  const t = await getTranslations("settings");
  return { title: t("title") };
}

export default async function SettingsPage() {
  const t = await getTranslations("settings");
  // Preset hiện tại đọc từ cookie (cùng nguồn với src/app/layout.tsx) để client
  // render đúng thẻ đang chọn ngay từ hydration, không nhấp nháy.
  const currentPreset = (await cookies()).get("ORBIT_PRESET")?.value ?? "";

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-4">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">{t("title")}</h1>
        <p className="text-sm text-muted-foreground">{t("subtitle")}</p>
      </header>
      <AppearanceSettings currentPreset={currentPreset} />
      {/* Ngôn ngữ: toggle VI/EN đã ở sidebar/topbar — trang chỉ ghi chú. */}
      <Card>
        <CardHeader>
          <CardTitle>{t("language")}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">{t("languageHint")}</p>
        </CardContent>
      </Card>
    </div>
  );
}
