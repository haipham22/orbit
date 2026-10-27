import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { BirthdayRow, UpcomingTaskRow } from "@/features/dashboard/queries";

export function BirthdaysCard({ people }: { people: BirthdayRow[] }) {
  const today = new Date().toISOString().slice(0, 10);
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">🎂 Sinh nhật sắp tới</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2 text-sm">
        {people.map((person) => (
          <div key={person.id} className="flex items-center justify-between gap-2">
            <Link href={`/people/${person.id}`} className="underline-offset-4 hover:underline">
              {person.fullName}
              {person.relationship && <span className="text-muted-foreground"> · {person.relationship}</span>}
            </Link>
            <span className={person.dob.slice(5) === today.slice(5) ? "font-medium text-red-500" : "text-muted-foreground"}>
              {person.dob.slice(5)}
            </span>
          </div>
        ))}
        {people.length === 0 && <p className="text-muted-foreground">Không có sinh nhật nào trong 30 ngày tới.</p>}
      </CardContent>
    </Card>
  );
}

export function UpcomingTasksCard({ tasks }: { tasks: UpcomingTaskRow[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">⏰ Việc sắp đến hạn</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2 text-sm">
        {tasks.map((task) => (
          <div key={task.id} className="flex items-center justify-between gap-2">
            <Link href={`/tasks/${task.id}`} className="underline-offset-4 hover:underline">
              {task.title}
            </Link>
            <div className="flex items-center gap-2">
              <Badge variant="outline">{task.priority}</Badge>
              <span className="text-muted-foreground">{task.dueDate}</span>
            </div>
          </div>
        ))}
        {tasks.length === 0 && <p className="text-muted-foreground">Không có việc nào đến hạn trong 7 ngày tới.</p>}
      </CardContent>
    </Card>
  );
}

export function RecentJournalCard({
  entries,
}: {
  entries: { id: string; title: string; entryDate: string; body: string }[];
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">📔 Nhật ký gần đây</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2 text-sm">
        {entries.map((entry) => (
          <div key={entry.id} className="flex flex-col">
            <div className="flex items-center justify-between gap-2">
              <Link href={`/journal/${entry.id}`} className="font-medium underline-offset-4 hover:underline">
                {entry.title}
              </Link>
              <span className="text-xs text-muted-foreground">{entry.entryDate}</span>
            </div>
            <p className="line-clamp-1 text-muted-foreground">{entry.body}</p>
          </div>
        ))}
        {entries.length === 0 && <p className="text-muted-foreground">Chưa có bài nào.</p>}
      </CardContent>
    </Card>
  );
}

export function TaskSummaryCard({ counts }: { counts: { todo: number; in_progress: number; done: number } }) {
  const rows = [
    { label: "Chưa làm", value: counts.todo },
    { label: "Đang làm", value: counts.in_progress },
    { label: "Xong", value: counts.done },
  ];
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">📋 Tổng quan việc</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2 text-sm">
        {rows.map((row) => (
          <div key={row.label} className="flex items-center justify-between">
            <span>{row.label}</span>
            <span className="font-medium">{row.value}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
