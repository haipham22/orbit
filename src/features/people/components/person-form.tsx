"use client";

import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { Trash2, Plus } from "lucide-react";

export const personFormSchema = z.object({
  fullName: z.string().min(1, "Nhập tên"),
  relationship: z.string().optional(),
  dob: z.string().optional(),
  notes: z.string().optional(),
  contactMethods: z.array(z.object({ type: z.string().min(1, "Thiếu loại"), value: z.string().min(1, "Thiếu giá trị") })),
});

export type PersonFormValues = z.infer<typeof personFormSchema>;

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
  const form = useForm<PersonFormValues>({
    resolver: zodResolver(personFormSchema),
    defaultValues: { contactMethods: [], ...defaultValues },
  });
  const contactArray = useFieldArray({ control: form.control, name: "contactMethods" });

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <Field>
        <FieldLabel htmlFor="fullName">Tên</FieldLabel>
        <Input id="fullName" {...form.register("fullName")} />
        {form.formState.errors.fullName?.message && (
          <FieldError errors={[{ message: form.formState.errors.fullName.message }]} />
        )}
      </Field>
      <Field>
        <FieldLabel htmlFor="relationship">Quan hệ</FieldLabel>
        <Input id="relationship" placeholder="Bạn bè, gia đình, đồng nghiệp…" {...form.register("relationship")} />
      </Field>
      <Field>
        <FieldLabel htmlFor="dob">Ngày sinh</FieldLabel>
        <Input id="dob" type="date" {...form.register("dob")} />
      </Field>
      <Field>
        <FieldLabel htmlFor="notes">Ghi chú</FieldLabel>
        <Textarea id="notes" rows={3} {...form.register("notes")} />
      </Field>

      <div className="flex flex-col gap-2">
        <FieldLabel>Số liên lạc</FieldLabel>
        {contactArray.fields.map((field, index) => (
          <div key={field.id} className="flex gap-2">
            <Input placeholder="Loại (zalo, email…)" {...form.register(`contactMethods.${index}.type`)} />
            <Input placeholder="Giá trị" {...form.register(`contactMethods.${index}.value`)} />
            <Button type="button" variant="ghost" size="icon" onClick={() => contactArray.remove(index)}>
              <Trash2 className="size-4" />
            </Button>
          </div>
        ))}
        <Button type="button" variant="outline" size="sm" className="w-fit" onClick={() => contactArray.append({ type: "", value: "" })}>
          <Plus className="size-4" /> Thêm số liên lạc
        </Button>
      </div>

      <Button type="submit" disabled={pending} className="self-end">
        {pending ? "Đang lưu…" : submitLabel}
      </Button>
    </form>
  );
}
