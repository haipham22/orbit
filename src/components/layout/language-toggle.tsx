"use client";

// Đổi locale qua cookie NEXT_LOCALE + refresh — không đổi URL (D2).
import { Languages } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { defaultLocale, type Locale } from "@/i18n/config";
import { useLocale } from "next-intl";

const NEXT_LOCALE_COOKIE = "NEXT_LOCALE";

export function LanguageToggle() {
  const locale = useLocale();
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function switchTo(next: Locale) {
    document.cookie = `${NEXT_LOCALE_COOKIE}=${next}; path=/; max-age=31536000; samesite=lax`;
    startTransition(() => router.refresh());
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      className="justify-start gap-2 px-2"
      disabled={pending}
      aria-label="Switch language"
      onClick={() => switchTo(locale === "vi" ? "en" : defaultLocale)}
    >
      <Languages className="size-4" />
      <span className="uppercase">{locale}</span>
    </Button>
  );
}
