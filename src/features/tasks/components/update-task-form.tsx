"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { gql } from "@/lib/gql-client";
import { TaskForm, type TaskFormValues } from "./task-form";
import type { ProjectRow } from "@/features/tasks/queries";

const UPDATE_TASK = `
  mutation UpdateTask($id: String!, $title: String!, $notes: String, $status: TaskStatus, $priority: TaskPriority, $dueDate: String, $projectId: String) {
    updateTask(id: $id, title: $title, notes: $notes, status: $status, priority: $priority, dueDate: $dueDate, projectId: $projectId) { id }
  }
`;

export function UpdateTaskForm({
  taskId,
  defaultValues,
  projects,
}: {
  taskId: string;
  defaultValues: Partial<TaskFormValues>;
  projects: ProjectRow[];
}) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function onSubmit(values: TaskFormValues) {
    setPending(true);
    try {
      await gql(UPDATE_TASK, {
        id: taskId,
        title: values.title,
        notes: values.notes || null,
        status: values.status,
        priority: values.priority,
        dueDate: values.dueDate || null,
        projectId: values.projectId,
      });
      toast.success("Đã cập nhật");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Lỗi không xác định");
    } finally {
      setPending(false);
    }
  }

  return <TaskForm defaultValues={defaultValues} projects={projects} onSubmit={onSubmit} submitLabel="Cập nhật" pending={pending} />;
}
