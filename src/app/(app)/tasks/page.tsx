import { getTranslations } from "next-intl/server";
import { listProjects, listTasks } from "@/features/tasks/queries";
import { TaskBoard } from "@/features/tasks/components/task-board";

export async function generateMetadata() {
  const t = await getTranslations("tasks");
  return { title: t("metaTitle") };
}

export default async function TasksPage() {
  const [tasks, projects, t] = await Promise.all([listTasks(), listProjects(), getTranslations("tasks")]);

  return (
    <div className="flex flex-col gap-6">
      {/* Hero S7: h1 mono qua CSS + CTA chính */}
      <h1 className="text-[length:var(--type-size-xl)]">{t("title")}</h1>
      <TaskBoard tasks={tasks} projects={projects} />
    </div>
  );
}
