import { listProjects, listTasks } from "@/features/tasks/queries";
import { TaskBoard } from "@/features/tasks/components/task-board";

export const metadata = { title: "Tasks — orbit" };

export default async function TasksPage() {
  const [tasks, projects] = await Promise.all([listTasks(), listProjects()]);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold">Tasks</h1>
      <TaskBoard tasks={tasks} projects={projects} />
    </div>
  );
}
