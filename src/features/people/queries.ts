import { eq, inArray, sql } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/server/db/client";
import { labels, people, peopleLabels } from "@/server/db/schema";
import { ServiceError } from "@/server/service-error";
import { ERROR_CODES } from "@/server/error-codes";

const contactMethodSchema = z.object({
  type: z.string().min(1).max(50),
  value: z.string().min(1).max(200),
});

export const personCreateSchema = z.object({
  fullName: z.string().min(1).max(200),
  relationship: z.string().max(100).nullish(),
  dob: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullish(),
  notes: z.string().max(10_000).nullish(),
  contactMethods: z.array(contactMethodSchema).max(20).default([]),
});

export const labelCreateSchema = z.object({
  name: z.string().min(1).max(50),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/).default("#6366f1"),
});

export const uuidSchema = z.uuid();

export type PersonCreateInput = z.infer<typeof personCreateSchema>;
export type LabelCreateInput = z.infer<typeof labelCreateSchema>;
export type PersonRow = typeof people.$inferSelect;
export type LabelRow = typeof labels.$inferSelect;
export type PersonWithLabels = PersonRow & { labels: LabelRow[] };

export function parseUuid(id: string) {
  const parsed = uuidSchema.safeParse(id);
  if (!parsed.success) {
    throw new ServiceError(ERROR_CODES.VALIDATION, "Invalid id");
  }
  return parsed.data;
}

async function attachLabels(rows: PersonRow[]): Promise<PersonWithLabels[]> {
  if (rows.length === 0) return [];

  const rowsWithLabels = await db
    .select({ personId: peopleLabels.personId, label: labels })
    .from(peopleLabels)
    .innerJoin(labels, eq(peopleLabels.labelId, labels.id))
    .where(inArray(peopleLabels.personId, rows.map((r) => r.id)));

  const byPerson = new Map<string, LabelRow[]>();
  for (const row of rowsWithLabels) {
    const list = byPerson.get(row.personId) ?? [];
    list.push(row.label);
    byPerson.set(row.personId, list);
  }

  return rows.map((row) => ({ ...row, labels: byPerson.get(row.id) ?? [] }));
}

export async function listPeople(query?: string): Promise<PersonWithLabels[]> {
  const q = query?.trim();
  const rows = q
    ? await db
        .select()
        .from(people)
        .where(sql`lower(${people.fullName}) % lower(${q}) or ${people.fullName} ilike ${`%${q}%`}`)
        .orderBy(sql`similarity(lower(${people.fullName}), lower(${q})) desc`, people.fullName)
        .limit(100)
    : await db.select().from(people).orderBy(people.fullName).limit(200);
  return attachLabels(rows);
}

export async function getPerson(id: string): Promise<PersonWithLabels> {
  const [row] = await db.select().from(people).where(eq(people.id, parseUuid(id))).limit(1);
  if (!row) {
    throw new ServiceError(ERROR_CODES.NOT_FOUND, "Person not found");
  }
  const [withLabels] = await attachLabels([row]);
  return withLabels;
}

export async function createPerson(input: unknown): Promise<PersonWithLabels> {
  const parsed = personCreateSchema.safeParse(input);
  if (!parsed.success) {
    throw new ServiceError(ERROR_CODES.VALIDATION, parsed.error.issues[0]?.message ?? "Invalid input");
  }
  const [row] = await db.insert(people).values(parsed.data).returning();
  const [withLabels] = await attachLabels([row]);
  return withLabels;
}

export async function updatePerson(id: string, input: unknown): Promise<PersonWithLabels> {
  const parsed = personCreateSchema.safeParse(input);
  if (!parsed.success) {
    throw new ServiceError(ERROR_CODES.VALIDATION, parsed.error.issues[0]?.message ?? "Invalid input");
  }
  const [row] = await db
    .update(people)
    .set({ ...parsed.data, updatedAt: new Date() })
    .where(eq(people.id, parseUuid(id)))
    .returning();
  if (!row) {
    throw new ServiceError(ERROR_CODES.NOT_FOUND, "Person not found");
  }
  const [withLabels] = await attachLabels([row]);
  return withLabels;
}

export async function deletePerson(id: string): Promise<boolean> {
  const [row] = await db.delete(people).where(eq(people.id, parseUuid(id))).returning();
  return Boolean(row);
}

export async function listLabels(): Promise<LabelRow[]> {
  return db.select().from(labels).orderBy(labels.name);
}

export async function createLabel(input: unknown): Promise<LabelRow> {
  const parsed = labelCreateSchema.safeParse(input);
  if (!parsed.success) {
    throw new ServiceError(ERROR_CODES.VALIDATION, parsed.error.issues[0]?.message ?? "Invalid input");
  }
  const [row] = await db.insert(labels).values(parsed.data).returning();
  return row;
}

export async function deleteLabel(id: string): Promise<boolean> {
  const [row] = await db.delete(labels).where(eq(labels.id, parseUuid(id))).returning();
  return Boolean(row);
}

export async function assignPersonLabel(personId: string, labelId: string): Promise<boolean> {
  await getPerson(personId);
  const [label] = await db.select().from(labels).where(eq(labels.id, parseUuid(labelId))).limit(1);
  if (!label) {
    throw new ServiceError(ERROR_CODES.NOT_FOUND, "Label not found");
  }
  await db
    .insert(peopleLabels)
    .values({ personId: parseUuid(personId), labelId: parseUuid(labelId) })
    .onConflictDoNothing();
  return true;
}

export async function unassignPersonLabel(personId: string, labelId: string): Promise<boolean> {
  const rows = await db
    .delete(peopleLabels)
    .where(sql`${peopleLabels.personId} = ${parseUuid(personId)} and ${peopleLabels.labelId} = ${parseUuid(labelId)}`)
    .returning();
  return rows.length > 0;
}
