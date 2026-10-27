"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslations } from "next-intl";
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

export type TaskFormValues = {
  title: string;
  notes: string;
  status: "todo" | "in_progress" | "done";
  priority: "low" | "medium" | "high" | "urgent";
  dueDate: string;
  projectId: string | null;
};

function buildSchema(t: (key: string) => string) {
  return z.object({
    title: z.string().min(1, t("titleRequired")),
    notes: z.string(),
    status: z.enum(["todo", "in_progress", "done"]),
    priority: z.enum(["low", "medium", "high", "urgent"]),
    dueDate: z.string(),
    projectId: z.string().nullable(),
  });
}

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
  const t = useTranslations("tasks");
  const statusLabels = {
    todo: t("status.todo"),
    in_progress: t("status.in_progress"),
    done: t("status.done"),
  } as const;
  const priorityLabels = {
    low: t("priority.low"),
    medium: t("priority.medium"),
    high: t("priority.high"),
    urgent: t("priority.urgent"),
  } as const;

  const form = useForm<TaskFormValues>({
    resolver: zodResolver(buildSchema(t)),
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
        <FieldLabel htmlFor="task-title">{t("titleLabel")}</FieldLabel>
        <Input id="task-title" {...form.register("title")} />
        {form.formState.errors.title && (
          <p className="text-sm text-destructive">{form.formState.errors.title.message}</p>
        )}
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field>
          <FieldLabel>{t("statusLabel")}</FieldLabel>
          <Controller
            control={form.control}
            name="status"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {(Object.keys(statusLabels) as (keyof typeof statusLabels)[]).map((s) => (
                    <SelectItem key={s} value={s}>{statusLabels[s]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </Field>
        <Field>
          <FieldLabel>{t("priorityLabel")}</FieldLabel>
          <Controller
            control={form.control}
            name="priority"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {(Object.keys(priorityLabels) as (keyof typeof priorityLabels)[]).map((p) => (
                    <SelectItem key={p} value={p}>{priorityLabels[p]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="task-due">{t("dueLabel")}</FieldLabel>
          <Input id="task-due" type="date" {...form.register("dueDate")} />
        </Field>
        <Field>
          <FieldLabel>{t("projectLabel")}</FieldLabel>
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
                  <SelectItem value="none">{t("none")}</SelectItem>
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
        <FieldLabel htmlFor="task-notes">{t("notesLabel")}</FieldLabel>
        <Textarea id="task-notes" rows={3} {...form.register("notes")} />
      </Field>
      <Button type="submit" disabled={pending} className="self-end rounded-sm">
        {pending ? t("saving") : submitLabel}
      </Button>
    </form>
  );
}
