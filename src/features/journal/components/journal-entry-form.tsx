"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field, FieldLabel } from "@/components/ui/field";

export type JournalEntryFormValues = {
  title: string;
  body: string;
  entryDate: string;
};

function buildSchema(t: (key: string) => string) {
  return z.object({
    title: z.string().min(1, t("titleRequired")),
    body: z.string(),
    entryDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, t("dateRequired")),
  });
}

export function JournalEntryForm({
  defaultValues,
  onSubmit,
  submitLabel,
  pending,
}: {
  defaultValues?: Partial<JournalEntryFormValues>;
  onSubmit: (values: JournalEntryFormValues) => Promise<void>;
  submitLabel: string;
  pending: boolean;
}) {
  const t = useTranslations("journal");
  const form = useForm<JournalEntryFormValues>({
    resolver: zodResolver(buildSchema(t)),
    defaultValues: {
      title: "",
      body: "",
      entryDate: new Date().toISOString().slice(0, 10),
      ...defaultValues,
    },
  });

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <Field>
        <FieldLabel htmlFor="title">{t("titleLabel")}</FieldLabel>
        <Input id="title" {...form.register("title")} />
        {form.formState.errors.title && (
          <p className="text-sm text-destructive">{form.formState.errors.title.message}</p>
        )}
      </Field>
      <Field>
        <FieldLabel htmlFor="entryDate">{t("dateLabel")}</FieldLabel>
        <Input id="entryDate" type="date" {...form.register("entryDate")} />
        {form.formState.errors.entryDate && (
          <p className="text-sm text-destructive">{form.formState.errors.entryDate.message}</p>
        )}
      </Field>
      <Field>
        <FieldLabel htmlFor="body">{t("bodyLabel")}</FieldLabel>
        <Textarea id="body" rows={8} {...form.register("body")} />
      </Field>
      <Button type="submit" disabled={pending} className="self-end rounded-sm">
        {pending ? t("saving") : submitLabel}
      </Button>
    </form>
  );
}
