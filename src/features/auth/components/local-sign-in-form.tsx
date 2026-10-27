"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function LocalSignInForm() {
  const t = useTranslations("auth");
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);
  const form = useForm({
    resolver: zodResolver(
      z.object({
        email: z.string().email(t("errorEmailInvalid")),
        password: z.string().min(1, t("errorPasswordRequired")),
      })
    ),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(values: { email: string; password: string }) {
    setFormError(null);
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(values),
    });
    if (!res.ok) {
      setFormError(t("errorInvalid"));
      return;
    }
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="flex w-full flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="email">{t("emailLabel")}</Label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          aria-invalid={!!form.formState.errors.email}
          className="h-9 rounded-sm"
          {...form.register("email")}
        />
        {form.formState.errors.email && (
          <p className="text-[length:var(--type-size-sm)] text-destructive">
            {form.formState.errors.email.message}
          </p>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="password">{t("passwordLabel")}</Label>
        <Input
          id="password"
          type="password"
          autoComplete="current-password"
          aria-invalid={!!form.formState.errors.password}
          className="h-9 rounded-sm"
          {...form.register("password")}
        />
        {form.formState.errors.password && (
          <p className="text-[length:var(--type-size-sm)] text-destructive">
            {form.formState.errors.password.message}
          </p>
        )}
      </div>
      {formError && (
        <p className="text-[length:var(--type-size-sm)] text-destructive">{formError}</p>
      )}
      <Button type="submit" className="h-11 w-full" disabled={form.formState.isSubmitting}>
        {form.formState.isSubmitting ? (
          <>
            <Loader2 className="animate-spin" aria-hidden />
            {t("submitting")}
          </>
        ) : (
          t("submit")
        )}
      </Button>
    </form>
  );
}
