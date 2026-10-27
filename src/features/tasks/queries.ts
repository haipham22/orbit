import { and, desc, eq, inArray, sql } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/server/db/client";
import { labels, links, people, peopleLabels, projects, tasks } from "@/server/db/schema";
import { ServiceError } from "@/server/service-error";
import { ERROR_CODES } from "@/server/error-codes";
import { parseUuid, type LabelRow, type PersonWithLabels } from "@/features/people/queries";

const dateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);

export const taskInputSchema = z.object({
  title: z.string().min(1).max(300),
  notes: z.string().max(50_000).nullish(),
  status: z.enum(["todo", "in_progress", "done"]).default("todo"),
  priority: z.enum(["low", "medium", "high", "urgent"]).default("medium"),
  dueDate: dateSchema.nullish(),
  projectId: z.uuid().nullish(),
});

export const projectInputSchema = z.object({
  name: z.string().min(1).max(100),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/).default("#6366f1"),
});

export type TaskInput = z.infer<typeof taskInputSchema>;
export type ProjectInput = z.infer<typeof projectInputSchema>;
export type TaskRow = typeof tasks.$inferSelect;
export type ProjectRow = typeof projects.$inferSelect;
export type TaskWithMeta = TaskRow & {
  project: ProjectRow | null;
  linkedPeople: PersonWithLabels[];
};

function parseTaskInput(input: unknown): TaskInput {
  const parsed = taskInputSchema.safeParse(input);
  if (!parsed.success) {
    throw new ServiceError(ERROR_CODES.VALIDATION, parsed.error.issues[0]?.message ?? "Invalid input");
  }
  return parsed.data;
}

async function attachTaskMeta(rows: TaskRow[]): Promise<TaskWithMeta[]> {
  if (rows.length === 0) return [];

  const projectIds = [...new Set(rows.map((r) => r.projectId).filter((id): id is string => id !== null))];
  const projectRows = projectIds.length
    ? await db.select().from(projects).where(inArray(projects.id, projectIds))
    : [];
  const projectById = new Map(projectRows.map((p) => [p.id, p]));

  const linkRows = await db
    .select({ sourceId: links.sourceId, person: people })
    .from(links)
    .innerJoin(people, eq(links.personId, people.id))
    .where(
      and(
        eq(links.sourceType, "task"),
        inArray(links.sourceId, rows.map((r) => r.id)),
      ),
    );

  const personRows = linkRows.map((r) => r.person);
  const labelsByPerson = new Map<string, LabelRow[]>();
  if (personRows.length > 0) {
    const labelRows = await db
      .select({ personId: peopleLabels.personId, label: labels })
      .from(peopleLabels)
      .innerJoin(labels, eq(peopleLabels.labelId, labels.id))
      .where(inArray(peopleLabels.personId, personRows.map((p) => p.id)));
    for (const row of labelRows) {
      const list = labelsByPerson.get(row.personId) ?? [];
      list.push(row.label);
      labelsByPerson.set(row.personId, list);
    }
  }

  const peopleByTask = new Map<string, PersonWithLabels[]>();
  for (const row of linkRows) {
    const list = peopleByTask.get(row.sourceId) ?? [];
    list.push({ ...row.person, labels: labelsByPerson.get(row.person.id) ?? [] });
    peopleByTask.set(row.sourceId, list);
  }

  return rows.map((row) => ({
    ...row,
    project: row.projectId ? projectById.get(row.projectId) ?? null : null,
    linkedPeople: peopleByTask.get(row.id) ?? [],
  }));
}

export async function listTasks(filter?: { status?: string; projectId?: string }): Promise<TaskWithMeta[]> {
  const conditions = [];
  if (filter?.status) {
    const parsed = z.enum(["todo", "in_progress", "done"]).safeParse(filter.status);
    if (!parsed.success) throw new ServiceError(ERROR_CODES.VALIDATION, "Invalid status");
    conditions.push(eq(tasks.status, parsed.data));
  }
  if (filter?.projectId) {
    conditions.push(eq(tasks.projectId, parseUuid(filter.projectId)));
  }

  const rows = await db
    .select()
    .from(tasks)
    .where(conditions.length ? and(...conditions) : undefined)
    .orderBy(sql`${tasks.dueDate} asc nulls last`, desc(tasks.createdAt))
    .limit(200);

  return attachTaskMeta(rows);
}

export async function getTask(id: string): Promise<TaskWithMeta> {
  const [row] = await db.select().from(tasks).where(eq(tasks.id, parseUuid(id))).limit(1);
  if (!row) {
    throw new ServiceError(ERROR_CODES.NOT_FOUND, "Task not found");
  }
  const [withMeta] = await attachTaskMeta([row]);
  return withMeta;
}

export async function createTask(input: unknown): Promise<TaskWithMeta> {
  const data = parseTaskInput(input);
  const [row] = await db
    .insert(tasks)
    .values({ ...data, completedAt: data.status === "done" ? new Date() : null })
    .returning();
  const [withMeta] = await attachTaskMeta([row]);
  return withMeta;
}

export async function updateTask(id: string, input: unknown): Promise<TaskWithMeta> {
  const data = parseTaskInput(input);
  const [row] = await db
    .update(tasks)
    .set({
      ...data,
      completedAt: data.status === "done" ? new Date() : null,
      updatedAt: new Date(),
    })
    .where(eq(tasks.id, parseUuid(id)))
    .returning();
  if (!row) {
    throw new ServiceError(ERROR_CODES.NOT_FOUND, "Task not found");
  }
  const [withMeta] = await attachTaskMeta([row]);
  return withMeta;
}

export async function deleteTask(id: string): Promise<boolean> {
  const [row] = await db.delete(tasks).where(eq(tasks.id, parseUuid(id))).returning();
  return Boolean(row);
}

export async function listProjects(): Promise<ProjectRow[]> {
  return db.select().from(projects).orderBy(projects.name);
}

export async function createProject(input: unknown): Promise<ProjectRow> {
  const parsed = projectInputSchema.safeParse(input);
  if (!parsed.success) {
    throw new ServiceError(ERROR_CODES.VALIDATION, parsed.error.issues[0]?.message ?? "Invalid input");
  }
  const [row] = await db.insert(projects).values(parsed.data).returning();
  return row;
}

export async function deleteProject(id: string): Promise<boolean> {
  const [row] = await db.delete(projects).where(eq(projects.id, parseUuid(id))).returning();
  return Boolean(row);
}
