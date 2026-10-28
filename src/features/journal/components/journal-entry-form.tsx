"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslations } from "next-intl";
import { Comp_Button } from "@/components/ui/ds/button";
import { Comp_DateInput } from "@/components/ui/ds/dateinput";
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
        <Controller
          control={form.control}
          name="entryDate"
          render={({ field }) => (
            <Comp_DateInput
              value={field.value}
              onChange={field.onChange}
              error={form.formState.errors.entryDate?.message}
              ariaLabel={t("dateLabel")}
            />
          )}
        />
      </Field>
      <Field>
        <FieldLabel htmlFor="body">{t("bodyLabel")}</FieldLabel>
        <Textarea id="body" rows={8} {...form.register("body")} />
      </Field>
      <Comp_Button
        type="submit"
        state={pending ? "sending" : "default"}
        className="self-end"
      >
        {pending ? t("saving") : submitLabel}
      </Comp_Button>
    </form>
  );
}
