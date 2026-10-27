import { and, desc, eq, inArray, sql } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/server/db/client";
import { journalEntries, labels, links, people, peopleLabels } from "@/server/db/schema";
import { ServiceError } from "@/server/service-error";
import { ERROR_CODES } from "@/server/error-codes";
import { parseUuid, type LabelRow, type PersonWithLabels } from "@/features/people/queries";

export const journalEntryInputSchema = z.object({
  title: z.string().min(1).max(300),
  body: z.string().max(100_000).default(""),
  entryDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

export type JournalEntryInput = z.infer<typeof journalEntryInputSchema>;
export type JournalEntryRow = typeof journalEntries.$inferSelect;
export type JournalEntryWithPeople = JournalEntryRow & { linkedPeople: PersonWithLabels[] };

function parseEntryInput(input: unknown): JournalEntryInput {
  const parsed = journalEntryInputSchema.safeParse(input);
  if (!parsed.success) {
    throw new ServiceError(ERROR_CODES.VALIDATION, parsed.error.issues[0]?.message ?? "Invalid input");
  }
  return parsed.data;
}

async function attachPeople(rows: JournalEntryRow[]): Promise<JournalEntryWithPeople[]> {
  if (rows.length === 0) return [];

  const rowsWithPeople = await db
    .select({ sourceId: links.sourceId, person: people })
    .from(links)
    .innerJoin(people, eq(links.personId, people.id))
    .where(and(eq(links.sourceType, "journal_entry"), inArray(links.sourceId, rows.map((r) => r.id))));

  const personRows = rowsWithPeople.map((r) => r.person);
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

  const bySource = new Map<string, PersonWithLabels[]>();
  for (const row of rowsWithPeople) {
    const list = bySource.get(row.sourceId) ?? [];
    list.push({ ...row.person, labels: labelsByPerson.get(row.person.id) ?? [] });
    bySource.set(row.sourceId, list);
  }

  return rows.map((row) => ({ ...row, linkedPeople: bySource.get(row.id) ?? [] }));
}

export async function listJournalEntries(query?: string): Promise<JournalEntryWithPeople[]> {
  const q = query?.trim();
  if (!q) {
    const rows = await db.select().from(journalEntries).orderBy(desc(journalEntries.entryDate)).limit(100);
    return attachPeople(rows);
  }

  const ranked = await db
    .select({
      entry: journalEntries,
      rank: sql<number>`ts_rank(${journalEntries.searchVector}, websearch_to_tsquery('english', ${q}))`,
    })
    .from(journalEntries)
    .where(sql`${journalEntries.searchVector} @@ websearch_to_tsquery('english', ${q})`)
    .orderBy(desc(sql`ts_rank(${journalEntries.searchVector}, websearch_to_tsquery('english', ${q}))`), desc(journalEntries.entryDate))
    .limit(50);

  if (ranked.length > 0) {
    return attachPeople(ranked.map((r) => r.entry));
  }

  const fallback = await db
    .select()
    .from(journalEntries)
    .where(sql`${journalEntries.title} ilike ${`%${q}%`} or ${journalEntries.body} ilike ${`%${q}%`}`)
    .orderBy(desc(journalEntries.entryDate))
    .limit(50);
  return attachPeople(fallback);
}

export async function getJournalEntry(id: string): Promise<JournalEntryWithPeople> {
  const [row] = await db
    .select()
    .from(journalEntries)
    .where(eq(journalEntries.id, parseUuid(id)))
    .limit(1);
  if (!row) {
    throw new ServiceError(ERROR_CODES.NOT_FOUND, "Journal entry not found");
  }
  const [withPeople] = await attachPeople([row]);
  return withPeople;
}

export async function createJournalEntry(input: unknown): Promise<JournalEntryWithPeople> {
  const data = parseEntryInput(input);
  const [row] = await db.insert(journalEntries).values(data).returning();
  const [withPeople] = await attachPeople([row]);
  return withPeople;
}

export async function updateJournalEntry(id: string, input: unknown): Promise<JournalEntryWithPeople> {
  const data = parseEntryInput(input);
  const [row] = await db
    .update(journalEntries)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(journalEntries.id, parseUuid(id)))
    .returning();
  if (!row) {
    throw new ServiceError(ERROR_CODES.NOT_FOUND, "Journal entry not found");
  }
  const [withPeople] = await attachPeople([row]);
  return withPeople;
}

export async function deleteJournalEntry(id: string): Promise<boolean> {
  const [row] = await db.delete(journalEntries).where(eq(journalEntries.id, parseUuid(id))).returning();
  return Boolean(row);
}
