"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { gql } from "@/lib/gql-client";
import { TaskForm } from "./task-form";
import type { ProjectRow, TaskWithMeta } from "@/features/tasks/queries";

const COLUMNS = [
  { value: "todo", label: "Chưa làm" },
  { value: "in_progress", label: "Đang làm" },
  { value: "done", label: "Xong" },
] as const;

const CREATE_TASK = `
  mutation CreateTask($title: String!, $notes: String, $status: TaskStatus, $priority: TaskPriority, $dueDate: String, $projectId: String) {
    createTask(title: $title, notes: $notes, status: $status, priority: $priority, dueDate: $dueDate, projectId: $projectId) { id }
  }
`;
const UPDATE_TASK = `
  mutation UpdateTask($id: String!, $title: String!, $notes: String, $status: TaskStatus, $priority: TaskPriority, $dueDate: String, $projectId: String) {
    updateTask(id: $id, title: $title, notes: $notes, status: $status, priority: $priority, dueDate: $dueDate, projectId: $projectId) { id }
  }
`;
const DELETE_TASK = `
  mutation DeleteTask($id: String!) { deleteTask(id: $id) }
`;
const CREATE_PROJECT = `
  mutation CreateProject($name: String!, $color: String) { createProject(name: $name, color: $color) { id } }
`;
const DELETE_PROJECT = `
  mutation DeleteProject($id: String!) { deleteProject(id: $id) }
`;

type TaskFields = {
  title: string;
  notes: string;
  status: string;
  priority: string;
  dueDate: string;
  projectId: string | null;
};

export function TaskBoard({ tasks, projects }: { tasks: TaskWithMeta[]; projects: ProjectRow[] }) {
  const router = useRouter();
  const [createOpen, setCreateOpen] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [pending, setPending] = useState(false);

  async function mutate(query: string, variables: Record<string, unknown>, successMsg?: string) {
    try {
      await gql(query, variables);
      if (successMsg) toast.success(successMsg);
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Lỗi không xác định");
    }
  }

  async function onCreateTask(values: TaskFields) {
    setPending(true);
    try {
      await gql(CREATE_TASK, { ...values, dueDate: values.dueDate || null });
      setCreateOpen(false);
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Lỗi không xác định");
    } finally {
      setPending(false);
    }
  }

  async function onAdvance(task: TaskWithMeta) {
    const next = task.status === "todo" ? "in_progress" : "done";
    await mutate(
      UPDATE_TASK,
      {
        id: task.id,
        title: task.title,
        notes: task.notes ?? "",
        status: next,
        priority: task.priority,
        dueDate: task.dueDate,
        projectId: task.projectId,
      },
      next === "done" ? "Hoàn thành 🎉" : "Đang làm",
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center gap-3">
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild>
            <Button size="sm"><Plus className="size-4" /> Thêm việc</Button>
          </DialogTrigger>
          <DialogContent className="max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Thêm việc</DialogTitle>
              <DialogDescription>Ghi lại việc cần làm.</DialogDescription>
            </DialogHeader>
            <TaskForm projects={projects} onSubmit={onCreateTask} submitLabel="Lưu" pending={pending} />
          </DialogContent>
        </Dialog>

        <form
          className="flex gap-2"
          onSubmit={async (e) => {
            e.preventDefault();
            if (!projectName.trim()) return;
            await mutate(CREATE_PROJECT, { name: projectName.trim() }, "Đã thêm dự án");
            setProjectName("");
          }}
        >
          <input
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            placeholder="Dự án mới…"
            className="h-9 w-36 rounded-md border bg-transparent px-3 text-sm"
          />
          <Button type="submit" variant="outline" size="sm">Thêm</Button>
        </form>

        <div className="ml-auto flex flex-wrap items-center gap-2">
          {projects.map((p) => (
            <Badge key={p.id} variant="outline" style={{ borderColor: p.color }}>
              {p.name}
              <button type="button" aria-label={`Xoá dự án ${p.name}`} onClick={() => mutate(DELETE_PROJECT, { id: p.id })}>
                <Trash2 className="size-3" />
              </button>
            </Badge>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {COLUMNS.map((col) => {
          const colTasks = tasks.filter((t) => t.status === col.value);
          return (
            <div key={col.value} className="flex flex-col gap-3">
              <div className="text-sm font-medium text-muted-foreground">
                {col.label} ({colTasks.length})
              </div>
              {colTasks.map((task) => (
                <Card key={task.id}>
                  <CardContent className="flex flex-col gap-2 p-4">
                    <Link href={`/tasks/${task.id}`} className="font-medium underline-offset-4 hover:underline">
                      {task.title}
                    </Link>
                    <div className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
                      <Badge variant="outline">{task.priority}</Badge>
                      {task.dueDate && <span>hạn {task.dueDate}</span>}
                      {task.project && (
                        <span className="inline-flex items-center gap-1">
                          <span className="size-2 rounded-full" style={{ background: task.project.color }} />
                          {task.project.name}
                        </span>
                      )}
                      {task.completedAt && <span>xong {new Date(task.completedAt).toLocaleDateString()}</span>}
                    </div>
                    <div className="flex gap-2">
                      {col.value !== "done" && (
                        <Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => onAdvance(task)}>
                          {col.value === "todo" ? "Bắt đầu" : "Xong"}
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 text-xs"
                        onClick={() => mutate(DELETE_TASK, { id: task.id })}
                      >
                        <Trash2 className="size-3" /> Xoá
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {colTasks.length === 0 && (
                <p className="text-sm text-muted-foreground">Trống</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
