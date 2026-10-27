"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field, FieldLabel } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ProjectRow } from "@/features/tasks/queries";

export const taskFormSchema = z.object({
  title: z.string().min(1, "Nhập việc cần làm"),
  notes: z.string(),
  status: z.enum(["todo", "in_progress", "done"]),
  priority: z.enum(["low", "medium", "high", "urgent"]),
  dueDate: z.string(),
  projectId: z.string().nullable(),
});

export type TaskFormValues = z.infer<typeof taskFormSchema>;

const STATUSES = [
  { value: "todo", label: "Chưa làm" },
  { value: "in_progress", label: "Đang làm" },
  { value: "done", label: "Xong" },
];
const PRIORITIES = [
  { value: "low", label: "Thấp" },
  { value: "medium", label: "Vừa" },
  { value: "high", label: "Cao" },
  { value: "urgent", label: "Gấp" },
];

export function TaskForm({
  defaultValues,
  projects,
  onSubmit,
  submitLabel,
  pending,
}: {
  defaultValues?: Partial<TaskFormValues>;
  projects: ProjectRow[];
  onSubmit: (values: TaskFormValues) => Promise<void>;
  submitLabel: string;
  pending: boolean;
}) {
  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      title: "",
      notes: "",
      status: "todo",
      priority: "medium",
      dueDate: "",
      projectId: null,
      ...defaultValues,
    },
  });

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <Field>
        <FieldLabel htmlFor="task-title">Việc cần làm</FieldLabel>
        <Input id="task-title" {...form.register("title")} />
        {form.formState.errors.title && (
          <p className="text-sm text-red-500">{form.formState.errors.title.message}</p>
        )}
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field>
          <FieldLabel>Trạng thái</FieldLabel>
          <Controller
            control={form.control}
            name="status"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {STATUSES.map((s) => (
                    <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </Field>
        <Field>
          <FieldLabel>Ưu tiên</FieldLabel>
          <Controller
            control={form.control}
            name="priority"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {PRIORITIES.map((p) => (
                    <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="task-due">Hạn</FieldLabel>
          <Input id="task-due" type="date" {...form.register("dueDate")} />
        </Field>
        <Field>
          <FieldLabel>Dự án</FieldLabel>
          <Controller
            control={form.control}
            name="projectId"
            render={({ field }) => (
              <Select
                value={field.value ?? "none"}
                onValueChange={(v) => field.onChange(v === "none" ? null : v)}
              >
                <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">— Không —</SelectItem>
                  {projects.map((p) => (
                    <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </Field>
      </div>
      <Field>
        <FieldLabel htmlFor="task-notes">Ghi chú</FieldLabel>
        <Textarea id="task-notes" rows={3} {...form.register("notes")} />
      </Field>
      <Button type="submit" disabled={pending} className="self-end">
        {pending ? "Đang lưu…" : submitLabel}
      </Button>
    </form>
  );
}
