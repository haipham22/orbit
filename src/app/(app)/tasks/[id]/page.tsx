import { notFound } from "next/navigation";
import { getTask, listProjects } from "@/features/tasks/queries";
import { listPeople } from "@/features/people/queries";
import { TaskForm } from "@/features/tasks/components/task-form";
import { TaskPeopleCard, TaskDeleteButton } from "@/features/tasks/components/task-detail";
import { UpdateTaskForm } from "@/features/tasks/components/update-task-form";

export const metadata = { title: "Việc — orbit" };

export default async function TaskPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const task = await getTask(id).catch(() => null);
  if (!task) notFound();

  const [projects, people] = await Promise.all([listProjects(), listPeople()]);

  return (
    <div className="flex max-w-2xl flex-col gap-6">
      <div className="flex items-start justify-between gap-4">
        <h1 className="text-2xl font-semibold">{task.title}</h1>
        <TaskDeleteButton taskId={task.id} />
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
