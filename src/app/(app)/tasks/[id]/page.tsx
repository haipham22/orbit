import Link from "next/link";
import { Calendar, ChevronLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Badge } from "@/components/ui/badge";
import { getTask, listProjects } from "@/features/tasks/queries";
import { listPeople } from "@/features/people/queries";
import { TaskPeopleCard, TaskDeleteButton } from "@/features/tasks/components/task-detail";
import { UpdateTaskForm } from "@/features/tasks/components/update-task-form";

// Comp_Chip (FACET) — status chip màu theo rule: todo=muted, doing=primary/soft, done=success.
const chipBase =
  "h-[var(--control-h-sm)] rounded-full px-3 text-[length:var(--type-size-sm)] font-medium";
const statusChipClass: Record<string, string> = {
  todo: "border-border bg-transparent text-muted-foreground",
  in_progress: "border-border bg-muted text-primary",
  done: "border-[var(--color-success)] bg-transparent text-[var(--color-success)]",
};

export async function generateMetadata() {
  const t = await getTranslations("tasks");
  return { title: t("taskMetaTitle") };
}

export default async function TaskPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const task = await getTask(id).catch(() => null);
  if (!task) notFound();

  const [projects, people, t] = await Promise.all([
    listProjects(),
    listPeople(),
    getTranslations("tasks"),
  ]);

  const today = new Date().toISOString().slice(0, 10);
  const overdue = !!task.dueDate && task.status !== "done" && task.dueDate < today;
  const urgent = task.priority === "urgent";

  return (
    <div className="flex max-w-2xl flex-col gap-6">
      {/* S8: backlink "Quay lại board" */}
      <Link
        href="/tasks"
        className="inline-flex items-center gap-1 self-start px-2 py-1 text-[length:var(--type-size-sm)] text-muted-foreground transition-colors hover:text-primary"
      >
        <ChevronLeft className="size-4" aria-hidden />
        {t("backToBoard")}
      </Link>

      {/* Header: h1 mono + status chip; meta chips: hạn (danger nếu quá hạn), priority, dự án */}
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="mr-auto text-[length:var(--type-size-xl)]">{task.title}</h1>
        <Badge variant="outline" className={`${chipBase} ${statusChipClass[task.status]}`}>
          {t(`status.${task.status}`)}
        </Badge>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {task.dueDate && (
          <Badge
            variant="outline"
            className={
              overdue
                ? `${chipBase} border-destructive bg-transparent text-destructive`
                : `${chipBase} border-border bg-transparent text-muted-foreground`
            }
          >
            <Calendar className="size-3" aria-hidden />
            {overdue ? t("overdueChip") : t("dueChip", { date: task.dueDate })}
          </Badge>
        )}
        {urgent ? (
          <Badge variant="outline" className={`${chipBase} border-[var(--color-warning)] bg-transparent text-[var(--color-warning)]`}>
            {t("priority.urgent")}
          </Badge>
        ) : (
          <Badge
            variant="outline"
            className={
              task.priority === "high"
                ? `${chipBase} border-destructive bg-transparent text-destructive`
                : `${chipBase} border-border bg-transparent text-muted-foreground`
            }
          >
            {t(`priority.${task.priority}`)}
          </Badge>
        )}
        {task.project && (
          <Badge variant="outline" className={`${chipBase} border-border bg-muted text-primary`}>
            {task.project.name}
          </Badge>
        )}
        <div className="ml-auto">
          <TaskDeleteButton taskId={task.id} />
        </div>
      </div>

      <UpdateTaskForm
        taskId={task.id}
        defaultValues={{
          title: task.title,
          notes: task.notes ?? "",
          status: task.status,
          priority: task.priority,
          dueDate: task.dueDate ?? "",
          projectId: task.projectId,
        }}
        projects={projects}
      />
      <TaskPeopleCard taskId={task.id} linkedPeople={task.linkedPeople} allPeople={people} />
    </div>
  );
}
