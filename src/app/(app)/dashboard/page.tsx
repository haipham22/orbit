import {
  recentJournalEntries,
  taskStatusCounts,
  upcomingBirthdays,
  upcomingTasks,
} from "@/features/dashboard/queries";
import {
  BirthdaysCard,
  RecentJournalCard,
  TaskSummaryCard,
  UpcomingTasksCard,
} from "@/features/dashboard/components/dashboard-sections";

export const metadata = { title: "Dashboard — orbit" };

export default async function DashboardPage() {
  const [birthdays, tasks, entries, counts] = await Promise.all([
    upcomingBirthdays(),
    upcomingTasks(),
    recentJournalEntries(),
    taskStatusCounts(),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <BirthdaysCard people={birthdays} />
        <UpcomingTasksCard tasks={tasks} />
        <RecentJournalCard entries={entries} />
        <TaskSummaryCard counts={counts} />
      </div>
    </div>
  );
}
