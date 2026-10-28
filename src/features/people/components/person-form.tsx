"use client";

import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslations } from "next-intl";
import { Comp_Button } from "@/components/ui/ds/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { Trash2, Plus } from "lucide-react";

export type PersonFormValues = {
  fullName: string;
  relationship?: string;
  dob?: string;
  notes?: string;
  contactMethods: { type: string; value: string }[];
};

export function PersonForm({
  defaultValues,
  onSubmit,
  submitLabel,
  pending,
}: {
  defaultValues?: Partial<PersonFormValues>;
  onSubmit: (values: PersonFormValues) => Promise<void>;
  submitLabel: string;
  pending: boolean;
}) {
  const t = useTranslations("people.form");
  // Schema nằm trong component (như auth form) để message lỗi dịch qua i18n.
  const schema = z.object({
    fullName: z.string().min(1, t("fullNameRequired")),
    relationship: z.string().optional(),
    dob: z.string().optional(),
    notes: z.string().optional(),
    contactMethods: z.array(
      z.object({
        type: z.string().min(1, t("contactTypeRequired")),
        value: z.string().min(1, t("contactValueRequired")),
      })
    ),
  });
  const form = useForm<PersonFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { contactMethods: [], ...defaultValues },
  });
  const contactArray = useFieldArray({ control: form.control, name: "contactMethods" });
  // Comp_Button disabled là aria-only (pointer-events-none vẫn bị Enter submit qua),
  // nên chặn submit lặp khi đang pending.
  const submit = form.handleSubmit(async (values) => {
    if (pending) return;
    await onSubmit(values);
  });

  return (
    <form onSubmit={submit} className="flex flex-col gap-4">
      <Field>
        <FieldLabel htmlFor="fullName">{t("fullName")}</FieldLabel>
        <Input id="fullName" className="h-9" {...form.register("fullName")} />
        {form.formState.errors.fullName?.message && (
          <FieldError errors={[{ message: form.formState.errors.fullName.message }]} />
        )}
      </Field>
      <Field>
        <FieldLabel htmlFor="relationship">{t("relationship")}</FieldLabel>
        <Input
          id="relationship"
          className="h-9"
          placeholder={t("relationshipPlaceholder")}
          {...form.register("relationship")}
        />
      </Field>
      <Field>
        <FieldLabel htmlFor="dob">{t("dob")}</FieldLabel>
        <Input id="dob" type="date" className="h-9" {...form.register("dob")} />
      </Field>
      <Field>
        <FieldLabel htmlFor="notes">{t("notes")}</FieldLabel>
        <Textarea id="notes" rows={3} {...form.register("notes")} />
      </Field>

      <div className="flex flex-col gap-2">
        <FieldLabel>{t("contacts")}</FieldLabel>
        {contactArray.fields.map((field, index) => (
          <div key={field.id} className="flex gap-2">
            <Input
              className="h-9"
              placeholder={t("contactType")}
              aria-label={t("contactType")}
              {...form.register(`contactMethods.${index}.type`)}
            />
            <Input
              className="h-9"
              placeholder={t("contactValue")}
              aria-label={t("contactValue")}
              {...form.register(`contactMethods.${index}.value`)}
            />
            <Comp_Button
              type="button"
              variant="ghost"
              size="sm"
              className="px-2"
              aria-label={t("removeContact")}
              onClick={() => contactArray.remove(index)}
            >
              <Trash2 className="size-4" />
            </Comp_Button>
          </div>
        ))}
        <Comp_Button
          type="button"
          variant="ghost"
          className="w-fit"
          onClick={() => contactArray.append({ type: "", value: "" })}
        >
          <Plus className="size-4" /> {t("addContact")}
        </Comp_Button>
      </div>

      <Comp_Button type="submit" size="lg" className="self-end" state={pending ? "sending" : "default"}>
        {submitLabel}
      </Comp_Button>
    </form>
  );
}
