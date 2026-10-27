import { and, count, desc, isNotNull, lte, ne, sql } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/server/db/client";
import { journalEntries, people, tasks } from "@/server/db/schema";

const dateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);

export type BirthdayRow = {
  id: string;
  fullName: string;
  dob: string;
  relationship: string | null;
};

export async function upcomingBirthdays(daysAhead = 30): Promise<BirthdayRow[]> {
  const nextBirthday = sql`to_date(concat(extract(year from current_date)::int, to_char(${people.dob}, '-MM-DD')), 'YYYY-MM-DD')`;
  const effective = sql`case when ${nextBirthday} < current_date then ${nextBirthday} + interval '1 year' else ${nextBirthday} end`;

  const rows = await db
    .select({
      id: people.id,
      fullName: people.fullName,
      dob: people.dob,
      relationship: people.relationship,
    })
    .from(people)
    .where(and(isNotNull(people.dob), sql`${effective} <= current_date + interval '${sql.raw(String(daysAhead))} days'`))
    .orderBy(sql`${effective}`);

  return rows.filter((r): r is BirthdayRow & { dob: string } => r.dob !== null);
}

export type UpcomingTaskRow = {
  id: string;
  title: string;
  dueDate: string;
  priority: "low" | "medium" | "high" | "urgent";
};

export async function upcomingTasks(daysAhead = 7): Promise<UpcomingTaskRow[]> {
  const until = dateSchema.parse(
    new Date(Date.now() + daysAhead * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
  );

  const rows = await db
    .select({
      id: tasks.id,
      title: tasks.title,
      dueDate: tasks.dueDate,
      priority: tasks.priority,
    })
    .from(tasks)
    .where(and(isNotNull(tasks.dueDate), lte(tasks.dueDate, until), ne(tasks.status, "done")))
    .orderBy(tasks.dueDate)
    .limit(20);

  return rows.filter((r): r is UpcomingTaskRow => r.dueDate !== null);
}

export async function recentJournalEntries(limit = 5) {
  return db
    .select({
      id: journalEntries.id,
      title: journalEntries.title,
      entryDate: journalEntries.entryDate,
      body: journalEntries.body,
    })
    .from(journalEntries)
    .orderBy(desc(journalEntries.entryDate))
    .limit(limit);
}

export async function taskStatusCounts() {
  const rows = await db
    .select({ status: tasks.status, count: count() })
    .from(tasks)
    .groupBy(tasks.status);
  const counts = { todo: 0, in_progress: 0, done: 0 };
  for (const row of rows) {
    counts[row.status] = Number(row.count);
  }
  return counts;
}
