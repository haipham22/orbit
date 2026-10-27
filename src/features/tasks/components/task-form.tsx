"use client";

import { useState } from "react";
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
  status: string;
  priority: string;
  dueDate: string;
  projectId: string | null;
};

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
  const [values, setValues] = useState<TaskFormValues>({
    title: "",
    notes: "",
    status: "todo",
    priority: "medium",
    dueDate: "",
    projectId: null,
    ...defaultValues,
  });

  function update<K extends keyof TaskFormValues>(key: K, value: TaskFormValues[K]) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(values); }} className="flex flex-col gap-4">
      <Field>
        <FieldLabel htmlFor="task-title">Việc cần làm</FieldLabel>
        <Input id="task-title" value={values.title} onChange={(e) => update("title", e.target.value)} />
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field>
          <FieldLabel>Trạng thái</FieldLabel>
          <Select value={values.status} onValueChange={(v) => update("status", v)}>
            <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
            <SelectContent>
              {STATUSES.map((s) => (
                <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
        <Field>
          <FieldLabel>Ưu tiên</FieldLabel>
          <Select value={values.priority} onValueChange={(v) => update("priority", v)}>
            <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
            <SelectContent>
              {PRIORITIES.map((p) => (
                <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
        <Field>
          <FieldLabel htmlFor="task-due">Hạn</FieldLabel>
          <Input
            id="task-due"
            type="date"
            value={values.dueDate ?? ""}
            onChange={(e) => update("dueDate", e.target.value)}
          />
        </Field>
        <Field>
          <FieldLabel>Dự án</FieldLabel>
          <Select
            value={values.projectId ?? "none"}
            onValueChange={(v) => update("projectId", v === "none" ? null : v)}
          >
            <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="none">— Không —</SelectItem>
              {projects.map((p) => (
                <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
      </div>
      <Field>
        <FieldLabel htmlFor="task-notes">Ghi chú</FieldLabel>
        <Textarea id="task-notes" rows={3} value={values.notes ?? ""} onChange={(e) => update("notes", e.target.value)} />
      </Field>
      <Button type="submit" disabled={pending} className="self-end">
        {pending ? "Đang lưu…" : submitLabel}
      </Button>
    </form>
  );
}
