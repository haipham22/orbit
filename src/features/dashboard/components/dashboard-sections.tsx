import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { AlarmClock, BookOpen, Cake, ListChecks, type LucideIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { BirthdayRow, UpcomingTaskRow } from "@/features/dashboard/queries";

// --- date helpers (đầu vào luôn "yyyy-mm-dd" từ queries) ---

function dmy(iso: string): string {
  const [, month, day] = iso.split("-");
  return `${day}/${month}`;
}

function daysUntil(iso: string, todayIso: string): number {
  return Math.round((Date.parse(iso) - Date.parse(todayIso)) / 86_400_000);
}

// --- khuôn dùng chung ---

/** Nhãn card theo DS: icon 16 + nhãn in hoa nhỏ màu muted. */
function CardLabel({ icon: Icon, children }: { icon: LucideIcon; children: string }) {
  return (
    <CardTitle className="flex items-center gap-2 text-[length:var(--type-size-sm)] font-semibold uppercase tracking-[0.05em] text-muted-foreground">
      <Icon className="size-4" aria-hidden />
      {children}
    </CardTitle>
  );
}

/** Empty state theo Comp_EmptyState (khuôn dashed, copy nguyên văn DS). */
async function EmptyBlock({ icon: Icon }: { icon: LucideIcon }) {
  const t = await getTranslations("dashboard");
  return (
    <div className="flex items-center gap-2 rounded-md border border-dashed p-4 text-[length:var(--type-size-sm)] text-muted-foreground">
      <Icon className="size-4" aria-hidden />
      <span>{t("empty")}</span>
    </div>
  );
}

function CardShell({ children }: { children: React.ReactNode }) {
  return <Card className="rounded-md border shadow-xs ring-0">{children}</Card>;
}

// --- 4 section dashboard (restyle DS v1, giữ nguyên ý nghĩa) ---

export async function BirthdaysCard({ people }: { people: BirthdayRow[] }) {
  const t = await getTranslations("dashboard");
  const today = new Date().toISOString().slice(0, 10);
  const rel = (iso: string) => {
    const days = daysUntil(iso, today);
    if (days === 0) return t("day.today");
    if (days === 1) return t("day.tomorrow");
    return t("day.inDays", { count: days });
  };
  return (
    <CardShell>
      <CardHeader>
        <CardLabel icon={Cake}>{t("birthdays.title")}</CardLabel>
      </CardHeader>
      <CardContent className="flex flex-col gap-2 text-[length:var(--type-size-sm)]">
        {people.map((person) => (
          <div key={person.id} className="flex items-center justify-between gap-2">
            <Link href={`/people/${person.id}`} className="font-medium underline-offset-4 hover:underline">
              {person.fullName}
              {person.relationship && <span className="text-muted-foreground"> · {person.relationship}</span>}
            </Link>
            <span className={person.dob.slice(5) === today.slice(5) ? "font-semibold" : "text-muted-foreground"}>
              {rel(person.dob)} — {dmy(person.dob)}
            </span>
          </div>
        ))}
        {people.length === 0 && <EmptyBlock icon={Cake} />}
      </CardContent>
    </CardShell>
  );
}

export async function UpcomingTasksCard({ tasks }: { tasks: UpcomingTaskRow[] }) {
  const t = await getTranslations("dashboard");
  const today = new Date().toISOString().slice(0, 10);
  const rel = (iso: string) => {
    const days = daysUntil(iso, today);
    if (days === 0) return t("day.today");
    if (days === 1) return t("day.tomorrow");
    return t("day.inDays", { count: days });
  };
  return (
    <CardShell>
      <CardHeader>
        <CardLabel icon={AlarmClock}>{t("dueTasks.title")}</CardLabel>
      </CardHeader>
      <CardContent className="flex flex-col gap-2 text-[length:var(--type-size-sm)]">
        {tasks.map((task) => (
          <div key={task.id} className="flex items-center justify-between gap-2">
            <Link href={`/tasks/${task.id}`} className="font-medium underline-offset-4 hover:underline">
              {task.title}
            </Link>
            <div className="flex items-center gap-2">
              <Badge variant="outline">{t(`priority.${task.priority}`)}</Badge>
              <span className="text-muted-foreground">
                {rel(task.dueDate)} — {dmy(task.dueDate)}
              </span>
            </div>
          </div>
        ))}
        {tasks.length === 0 && <EmptyBlock icon={AlarmClock} />}
      </CardContent>
    </CardShell>
  );
}

export async function RecentJournalCard({
  entries,
}: {
  entries: { id: string; title: string; entryDate: string; body: string }[];
}) {
  const t = await getTranslations("dashboard");
  return (
    <CardShell>
      <CardHeader>
        <CardLabel icon={BookOpen}>{t("journal.title")}</CardLabel>
      </CardHeader>
      <CardContent className="flex flex-col gap-2 text-[length:var(--type-size-sm)]">
        {entries.map((entry) => (
          <div key={entry.id} className="flex flex-col">
            <div className="flex items-center justify-between gap-2">
              <Link href={`/journal/${entry.id}`} className="font-medium underline-offset-4 hover:underline">
                {entry.title}
              </Link>
              <span className="text-[length:var(--type-size-sm)] text-muted-foreground">{dmy(entry.entryDate)}</span>
            </div>
            <p className="line-clamp-1 text-muted-foreground">{entry.body}</p>
          </div>
        ))}
        {entries.length === 0 && <EmptyBlock icon={BookOpen} />}
      </CardContent>
    </CardShell>
  );
}

export async function TaskSummaryCard({ counts }: { counts: { todo: number; in_progress: number; done: number } }) {
  const t = await getTranslations("dashboard");
  const rows = [
    { label: t("taskSummary.todo"), value: counts.todo },
    { label: t("taskSummary.inProgress"), value: counts.in_progress },
    { label: t("taskSummary.done"), value: counts.done },
  ];
  return (
    <CardShell>
      <CardHeader>
        <CardLabel icon={ListChecks}>{t("taskSummary.title")}</CardLabel>
      </CardHeader>
      <CardContent className="flex flex-col gap-2 text-[length:var(--type-size-sm)]">
        {rows.map((row) => (
          <div key={row.label} className="flex items-center justify-between">
            <span>{row.label}</span>
            <span className="font-semibold tabular-nums">{row.value}</span>
          </div>
        ))}
      </CardContent>
    </CardShell>
  );
}
