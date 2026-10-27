import { getTranslations } from "next-intl/server";
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

export async function generateMetadata() {
  const t = await getTranslations("dashboard");
  return { title: t("metaTitle") };
}

export default async function DashboardPage() {
  const [t, birthdays, tasks, entries, counts] = await Promise.all([
    getTranslations("dashboard"),
    upcomingBirthdays(),
    upcomingTasks(),
    recentJournalEntries(),
    taskStatusCounts(),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-1">
        {/* mono display + bold đến từ CSS h1 toàn cục, không set font tay */}
        <h1 className="text-[length:var(--type-size-xl)]">{t("greeting")}</h1>
        <p className="text-[length:var(--type-size-sm)] text-muted-foreground">{t("tagline")}</p>
      </header>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <BirthdaysCard people={birthdays} />
        <UpcomingTasksCard tasks={tasks} />
        <RecentJournalCard entries={entries} />
        <TaskSummaryCard counts={counts} />
      </div>
    </div>
  );
}
