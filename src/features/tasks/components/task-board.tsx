"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { Comp_Button } from "@/components/ui/ds/button";
import { Comp_Chip } from "@/components/ui/ds/chip";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Plus, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { gql } from "@/lib/gql-client";
import { TaskForm } from "./task-form";
import type { ProjectRow, TaskWithMeta } from "@/features/tasks/queries";

// Comp_Chip status: todo/doing/done/overdue + tone "soon" cho priority urgent.
const STATUS_TO_CHIP: Record<string, "todo" | "doing" | "done"> = {
  todo: "todo",
  in_progress: "doing",
  done: "done",
};

const COLUMNS = [{ value: "todo" }, { value: "in_progress" }, { value: "done" }] as const;

// Quá hạn = có hạn, chưa xong, hạn < hôm nay (so sánh string YYYY-MM-DD).
function isOverdue(task: TaskWithMeta, today: string) {
  return !!task.dueDate && task.status !== "done" && task.dueDate < today;
}

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

const createProjectSchema = (t: (key: string) => string) =>
  z.object({ name: z.string().min(1, t("projectNameRequired")) });
type CreateProjectValues = { name: string };

export function TaskBoard({ tasks, projects }: { tasks: TaskWithMeta[]; projects: ProjectRow[] }) {
  const t = useTranslations("tasks");
  const router = useRouter();
  const today = new Date().toISOString().slice(0, 10);
  const [createOpen, setCreateOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const projectForm = useForm<CreateProjectValues>({
    resolver: zodResolver(createProjectSchema(t)),
    defaultValues: { name: "" },
  });

  async function mutate(query: string, variables: Record<string, unknown>, successMsg?: string) {
    try {
      await gql(query, variables);
      if (successMsg) toast.success(successMsg);
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t("unknownError"));
    }
  }

  async function onCreateTask(values: TaskFields) {
    setPending(true);
    try {
      await gql(CREATE_TASK, { ...values, dueDate: values.dueDate || null });
      setCreateOpen(false);
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t("unknownError"));
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
      next === "done" ? t("doneToast") : t("startedToast"),
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center gap-3">
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild>
            <Comp_Button size="sm">
              <Plus className="size-4" /> {t("addTask")}
            </Comp_Button>
          </DialogTrigger>
          <DialogContent className="max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{t("addTask")}</DialogTitle>
              <DialogDescription>{t("addTaskDesc")}</DialogDescription>
            </DialogHeader>
            <TaskForm projects={projects} onSubmit={onCreateTask} submitLabel={t("save")} pending={pending} />
          </DialogContent>
        </Dialog>

        <form
          className="flex gap-2"
          onSubmit={projectForm.handleSubmit(async (values) => {
            await mutate(CREATE_PROJECT, { name: values.name.trim() }, t("projectAdded"));
            projectForm.reset();
          })}
        >
          <Input {...projectForm.register("name")} placeholder={t("newProjectPlaceholder")} className="h-9 w-36 rounded-sm" />
          <Comp_Button type="submit" variant="ghost" size="sm">{t("addProject")}</Comp_Button>
        </form>

        <div className="ml-auto flex flex-wrap items-center gap-2">
          {projects.map((p) => (
            <Badge
              key={p.id}
              variant="outline"
              className="h-7 rounded-full px-3 text-[length:var(--type-size-sm)]"
              style={{ borderColor: p.color }}
            >
              {p.name}
              <button type="button" aria-label={t("deleteProject", { name: p.name })} onClick={() => mutate(DELETE_PROJECT, { id: p.id })}>
                <X className="size-3" />
              </button>
            </Badge>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {COLUMNS.map((col) => {
          const colTasks = tasks.filter((task) => task.status === col.value);
          const label = t(`columns.${col.value}`);
          return (
            <div key={col.value} className="flex flex-col gap-2">
              <h2 className="text-[length:var(--type-size-lg)] uppercase tracking-[0.06em]">
                {label}{" "}
                <span className="text-[length:var(--type-size-sm)] font-semibold text-muted-foreground">
                  ({colTasks.length})
                </span>
              </h2>
              {colTasks.map((task) => {
                const overdue = isOverdue(task, today);
                return (
                  <Card key={task.id} className="rounded-md shadow-[var(--shadow)] ring-border">
                    <CardContent className="flex flex-col gap-2 p-4">
                      <Link href={`/tasks/${task.id}`} className="font-semibold underline-offset-4 hover:underline">
                        {task.title}
                      </Link>
                      <div className="flex flex-wrap items-center gap-1.5">
                        {overdue ? (
                          <Comp_Chip status="overdue">{t("overdueChip")}</Comp_Chip>
                        ) : task.priority === "urgent" ? (
                          <Comp_Chip tone="soon">{t("priority.urgent")}</Comp_Chip>
                        ) : (
                          <Comp_Chip status={STATUS_TO_CHIP[task.status]}>
                            {t(`status.${task.status}`)}
                          </Comp_Chip>
                        )}
                        <div className="flex flex-wrap items-center gap-2 text-[length:var(--type-size-sm)] text-muted-foreground">
                          {task.dueDate && <span>{t("dueChip", { date: task.dueDate })}</span>}
                          {task.priority !== "urgent" && <span>{t(`priority.${task.priority}`)}</span>}
                          {task.project && (
                            <span className="inline-flex items-center gap-1">
                              <span className="size-2 rounded-full" style={{ background: task.project.color }} />
                              {task.project.name}
                            </span>
                          )}
                          {task.completedAt && (
                            <span>{t("doneChip", { date: new Date(task.completedAt).toLocaleDateString() })}</span>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {col.value !== "done" && (
                          <Comp_Button variant="ghost" size="sm" onClick={() => onAdvance(task)}>
                            {col.value === "todo" ? t("start") : t("finish")}
                          </Comp_Button>
                        )}
                        <Comp_Button
                          variant="ghost"
                          size="sm"
                          onClick={() => mutate(DELETE_TASK, { id: task.id })}
                        >
                          <Trash2 className="size-3" /> {t("deleteTask")}
                        </Comp_Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
              {colTasks.length === 0 && (
                <div className="rounded-md border border-dashed border-border p-4 text-[length:var(--type-size-sm)] text-muted-foreground">
                  {t("empty")}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
