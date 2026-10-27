"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field, FieldLabel } from "@/components/ui/field";

export type JournalEntryFormValues = {
  title: string;
  body: string;
  entryDate: string;
};

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
  const [values, setValues] = useState<JournalEntryFormValues>({
    title: "",
    body: "",
    entryDate: new Date().toISOString().slice(0, 10),
    ...defaultValues,
  });

  function update<K extends keyof JournalEntryFormValues>(key: K, value: JournalEntryFormValues[K]) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(values); }} className="flex flex-col gap-4">
      <Field>
        <FieldLabel htmlFor="title">Tiêu đề</FieldLabel>
        <Input id="title" value={values.title} onChange={(e) => update("title", e.target.value)} />
      </Field>
      <Field>
        <FieldLabel htmlFor="entryDate">Ngày</FieldLabel>
        <Input
          id="entryDate"
          type="date"
          value={values.entryDate}
          onChange={(e) => update("entryDate", e.target.value)}
        />
      </Field>
      <Field>
        <FieldLabel htmlFor="body">Nội dung</FieldLabel>
        <Textarea id="body" rows={8} value={values.body} onChange={(e) => update("body", e.target.value)} />
      </Field>
      <Button type="submit" disabled={pending} className="self-end">
        {pending ? "Đang lưu…" : submitLabel}
      </Button>
    </form>
  );
}
